const LitElement = Object.getPrototypeOf(customElements.get("ha-panel-lovelace"));
const html = LitElement.prototype.html;

/**
 * Compare old and actual entity states
 * @param { Object } element - Element where all the changes were
 * @param { Object } changedProps - All changed properties
 */
function hasConfigOrEntityChanged(element, changedProps) {
    if (changedProps.has("_config")) {
        return true;
    }
    const oldHass = changedProps.get("hass");

    if (oldHass) {      
      const entListNames = findConfigEntityNames(element, 'actual')
        .concat(findConfigEntityNames(element, 'target'));
      const oldStates = entListNames.map(x => { return oldHass.states[x]; });
      const actualStates = entListNames.map( x => { return element.hass.states[x] });

      // check when states were changed or not
      return (oldStates !== actualStates 
        || oldHass.states["sun.sun"] !== element.hass.states["sun.sun"]);
    }
    
    return true;
}

/**
 * Returns list of entity names from config by type
 * @param { Object } element - Element where all changes are
 * @param { String } type  - Type of elements. Basically can be target/actual
 */
function findConfigEntityNames(element, type) {
  return element._config.entities.map(x => { return x[type]; })
    .filter(x => { return x !== undefined; });
}

/**
 * 
 * @param { Object } element - Element where all states and other stuff from hass are placed
 */
function getEntities(element, property) {
    const list = element._config.entities
      .filter(x => x.hasOwnProperty(property));

    return list.map(x => { 
        const actual = element.hass.states[x.actual];
        const target = element.hass.states[x.target];

        let item = {
          name: x[property],
        };

        if (target !== undefined) {          
          item.target = { 
            state: target.state, 
            unit: target.attributes.unit_of_measurement, 
            name: target.attributes.friendly_name,
            id: target.entity_id
          };
          if (x.target_reg !== undefined) {
            item.target.reg = x.target_reg
          }
        }

        if (actual !== undefined) {
          item.actual = { 
            state: actual.state, 
            unit: actual.attributes.unit_of_measurement, 
            name: actual.attributes.friendly_name,
            id: actual.entity_id
          };
          if (x.actual_reg !== undefined) {
            item.actual.reg = x.actual_reg
          }
        }
        return item;        
    });
}

class AcondHeatCard extends LitElement {
    static get properties() {
        return {
            _config: {},
            hass: {}
        };
    }

    static getStubConfig() {
        return {};
    }    

    setConfig(config) {
        if (!config.hasOwnProperty('unit')) {
            throw new Error("Please define a unit");
        }

        if (!config.hasOwnProperty('entities')) {
            throw new Error("Please define a entities");
        }

        // default temperature step is 1 degree
        if (!config.hasOwnProperty('temp_step')) {
          config.temp_step = 1;
        }

        // default value offset is 10. When setting register
        // number will be multipled by value_offset
        if (!config.hasOwnProperty('value_offset')) {
          config.value_offset = 10;
        }

        this._config = config;
    }

    shouldUpdate(changedProps) {
        return hasConfigOrEntityChanged(this, changedProps);
    }

    /**
     * Handle the event for changing temperature
     * 
     * @param {Object} element - Object with all data neccessary for call modbus TCP protocol
     * @param {string} direction - up/down setting tempereature direction
     */
    _changeTemp(element, direction) {      

      const obj = {
        unit: this._config.unit,
        address: element.reg
      }

      if (this._config.hasOwnProperty('hub')) {
        obj.hub = this._config.hub;
      }      

      switch (direction) {
        case 'up':
            obj.value = parseFloat(element.state) + this._config.temp_step;
          break;
        case 'down':
            obj.value = parseFloat(element.state) - this._config.temp_step;
          break;
        default:
          throw new Error("Wrong temp direction");
      }      

      obj.value *= this._config.value_offset;
      // call modbus TCP service
      this.hass.callService('modbus', 'write_register', obj).then(x => {
        this.hass.state
      });
    }

    _temButton(element, direction) {
      if (element.hasOwnProperty('reg'))
      {
        return html`
          <ha-icon class="change-btn" icon="mdi:menu-${direction}-outline" 
            @click="${ e =>  this._changeTemp(element, direction) }">
          </ha-icon>
        `;
      }
    }

    render() {
        if (!this._config || !this.hass) {
            return html``;
        }        

        const circuits = getEntities(this, 'circuit')
          .concat(getEntities(this, 'water'));

        const mode = getEntities(this, 'mode');
        const state = getEntities(this, 'state');

        return html`
        ${this.renderStyle()}
        <ha-card>
            <span class="title">Acond Therm</span>
            <div class="acond-heat-card">
              <div class="row">
                <div class="acond-block">asdfas</div>
                <div class="acond-temps">
                  <ul>
                  ${
                    circuits.map(circuit =>
                      html`
                        <li>
                          <span class="circuit-name"></span>
                          <span class="circuit-temps">
                            <span class="ha-icon">${ this._temButton(circuit.actual, 'up') }</span>
                          </span>
                          <span class="circuit-temps">
                            <span class="ha-icon">${ this._temButton(circuit.target, 'up') }</span>
                          </span>
                        </li>
                        <li>
                          <span class="circuit-name">
                            ${ circuit.name }
                          </span>
                          <span class="circuit-temps">
                            ${ circuit.actual.state } ${ circuit.actual.unit }
                          </span>
                          <span class="circuit-temps">
                            ${ circuit.target.state } ${ circuit.actual.unit }
                          </span>
                        </li>
                        <li>
                          <span class="circuit-name"></span>
                          <span class="circuit-temps">
                            <span class="ha-icon">${ this._temButton(circuit.actual, 'down') }</span>                            
                          </span>
                          <span class="circuit-temps">
                            <span class="ha-icon">${ this._temButton(circuit.target, 'down') }</span>                            
                          </span>
                        </li>
                      `
                    )
                  }
                  </ul>
                </div>
              </div>
              <div class="row">
                <div class="acond-modes">
                  <div class="mode-button></div>
                </div>
              </div>
            </div>
        </ha-card>`;
    }    

    renderStyle() {
        return html`
          <style>
            ha-card {
              margin: auto;
              padding-top: 2.5em;
              padding-bottom: 1.2em;
              padding-left: 1em;
              padding-right: 1em;
              position: relative;
            }
    
            .acond-heat-card {
                width: 100%;
                overflow: hidden;
            }

            .acond-block {
                width: 30%;
                float: left;
                border: 1px solid blue;
            }

            .acond-temps {
                float: right;
                width: 67%;
                color: var(--primary-text-color);
            }

            .acond-modes {
                border: 1px solid yellow;
            }

            .row {
              display: table;
              width: 100%;
              margin-bottom: 5px;
            }

            .change-btn {
              cursor: pointer;
            }

            ul {
              padding: 0;
              margin: 0;
            }

            ul li {
              font-size: 1.2em;
              display: flex;
              flex-wrap: wrap;
              list-style-type: none;
            }

            .circuit-temps {
              position: relative;
              width: 29%;
              text-align: center;
            }

            .circuit-name {
              position: relative;
              width: 40%;
            }
    
            .title {
              position: absolute;
              top: 0.1em;
              left: 0.5em;
              font-weight: 300;
              font-size: 2em;
              color: var(--primary-text-color);
            }

          </style>
        `;
      }
}

customElements.define("acond-heat-card", AcondHeatCard);
