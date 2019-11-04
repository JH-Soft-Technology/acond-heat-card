const LitElement = Object.getPrototypeOf(customElements.get("ha-panel-lovelace"));

const html = LitElement.prototype.html;

/**
 * 
 * @param {HTML} element - Element where all the changes were
 * @param {Object} changedProps - All changed properties
 */
function hasConfigOrEntityChanged(element, changedProps) {
    if (changedProps.has("_config")) {
        return true;
    }

    const oldHass = changedProps.get("hass");
    if (oldHass) {
        return (
        oldHass.states[element._config.entity] !==
            element.hass.states[element._config.entity] ||
        oldHass.states["sun.sun"] !== element.hass.states["sun.sun"]
        );
    }
    
    return true;
}

function getCircuits(element) {
    const list = element._config.entities.filter(x => x.hasOwnProperty('circuit'));    

    return list.map(x => { 
        const actual = element.hass.states[x.actual];
        const target = element.hass.states[x.target];

        return {
            name: x.circuit,
            actual: { 
                state: actual.state, 
                unit: actual.attributes.unit_of_measurement, 
                name: actual.attributes.friendly_name 
            },
            target: { 
                state: target.state, 
                unit: target.attributes.unit_of_measurement, 
                name: target.attributes.friendly_name 
            },
        };
    });
}

function getWater(element) {

}

function getState(element) {

}

function getMode(element) {

}

class AcondHeatPump extends LitElement {
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

        this._config = config;
    }

    shouldUpdate(changedProps) {
        return hasConfigOrEntityChanged(this, changedProps);
    }

    render() {
        if (!this._config || !this.hass) {
            return html``;
        }        

        const circuits = getCircuits(this);

        return html`
        ${this.renderStyle()}
        <ha-card>
            <span class="title">Acond Therm</span>
            <div class="acond-heat-pump">
                <div class="acond-block"></div>
                <div class="acond-temps"></div>
                <div class="acond-modes"></div>
            </div>
        </ha-card>`;
    }

    renderStyle() {
        return html`
          <style>
            ha-card {
              cursor: pointer;
              margin: auto;
              padding-top: 2.5em;
              padding-bottom: 1.3em;
              padding-left: 1em;
              padding-right: 1em;
              position: relative;
            }
    
            .acond-heat-pump {
                width: 100%;
                height: 250px;
                position: relative;
            }

            .acond-block {
                position: relative;
                left: 0;
                top: 0;
                width: 30%;
                height: 75%;
                border: 1px solid blue;
            }

            .acond-temps {
                border: 1px solid green;
                position: absolute;
                right: 0;
                top: 0;
                width: 67%;
                height: 75%;
            }

            .acond-modes {
                border: 1px solid yellow;
                position: absolute;
                left: 0;
                bottom: 0;
                width: 100%;
                height: 22%;
            }

            .clear {
              clear: both;
            }
    
            .ha-icon {
              height: 18px;
              margin-right: 5px;
              color: var(--paper-item-icon-color);
            }
    
            .title {
              position: absolute;
              top: 0.1em;
              left: 0.5em;
              font-weight: 300;
              font-size: 2em;
              color: var(--primary-text-color);
            }
            .temp {
              font-weight: 300;
              font-size: 4em;
              color: var(--primary-text-color);
              position: absolute;
              right: 1em;
              top: 0.3em;
            }
    
            .tempc {
              font-weight: 300;
              font-size: 1.5em;
              vertical-align: super;
              color: var(--primary-text-color);
              position: absolute;
              right: 1em;
              margin-top: -14px;
              margin-right: 7px;
            }
    
            .variations {
              display: flex;
              flex-flow: row wrap;
              justify-content: space-between;
              font-weight: 300;
              color: var(--primary-text-color);
              list-style: none;
              margin-top: 4.5em;
              padding: 0;
            }
    
            .variations li {
              flex-basis: auto;
            }
    
            .variations li:first-child {
              padding-left: 1em;
            }
    
            .variations li:last-child {
              padding-right: 1em;
            }
    
            .unit {
              font-size: 0.8em;
            }
    
            .forecast {
              width: 100%;
              margin: 0 auto;
              height: 9em;
            }
    
            .day {
              display: block;
              width: 20%;
              float: left;
              text-align: center;
              color: var(--primary-text-color);
              border-right: 0.1em solid #d9d9d9;
              line-height: 2;
              box-sizing: border-box;
            }
    
            .dayname {
              text-transform: uppercase;
            }
    
            .forecast .day:first-child {
              margin-left: 0;
            }
    
            .forecast .day:nth-last-child(1) {
              border-right: none;
              margin-right: 0;
            }
    
            .highTemp {
              font-weight: bold;
            }
    
            .lowTemp {
              color: var(--secondary-text-color);
            }
    
            .icon.bigger {
              width: 10em;
              height: 10em;
              margin-top: -4em;
              position: absolute;
              left: 0em;
            }
    
            .icon {
              width: 50px;
              height: 50px;
              margin-right: 5px;
              display: inline-block;
              vertical-align: middle;
              background-size: contain;
              background-position: center center;
              background-repeat: no-repeat;
              text-indent: -9999px;
            }
    
            .weather {
              font-weight: 300;
              font-size: 1.5em;
              color: var(--primary-text-color);
              text-align: left;
              position: absolute;
              top: -0.5em;
              left: 6em;
              word-wrap: break-word;
              width: 30%;
            }
          </style>
        `;
      }
}

customElements.define("acond-heat-pump", AcondHeatPump);
