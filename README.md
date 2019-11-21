[![Version](https://img.shields.io/badge/version-0.0.1-green.svg?style=for-the-badge)](#)
[![mantained](https://img.shields.io/maintenance/yes/2019.svg?style=for-the-badge)](#)
[![GitHub](https://img.shields.io/github/license/jhoralek/acond-heat-card?style=for-the-badge)](#)
[![GitHub last commit](https://img.shields.io/github/last-commit/jhoralek/acond-heat-card?style=for-the-badge)](#)
[![hacs_badge](https://img.shields.io/badge/HACS-Default-orange.svg?style=for-the-badge)](https://github.com/custom-components/hacs)

# Lovelace - Accond-heat-card
Custom lovelace card to manage ACCOND heat pump over modbus TCP rotocol. 

#### Please ⭐️ this repo if you find it useful

# Example
There are couple of thinks you can set up.

***Water temperatur*** It's possible to increase or reduce a temperature of water in your tank.

***Required temperature*** It will turn on a pump until it reaches the required temperature.

***Actual temperatere*** Modbus TCP protocol is designed for control by a higher-level system. Thus, the temperature sensor is suppressed and the current temperature value is set via a service call or manually.

***Set type of heating*** You can turn on/off the pump or set some of predefined types of heating.

<!--
## Pump states
<!--
| Name | Type | Default | Description
| ---- | ---- | ------- | -----------
| type | string | **Required** | `custom:love-lock-card`
| cards | list | **Required** | List of cards
| title | string | **Optional** | Card title
| popup | string | **Optional** | password, confirm, timeout
| password | string | **Required** | Only required with popup:password
<!--
## Installation
<!--
### Now available in HACS
<!--
![HACS](https://i.imgur.com/1xNjAuC.jpg)
<!--
### Manual Install
<!--
1. Install the `love-lock-card` card by copying `love-lock-card.js` to `<config directory>/www/love-lock-card.js`
<!--
2. Link `love-lock-card` inside your `ui-lovelace.yaml` 
<!--
```yaml
resources:
  - url: /local/love-lock-card.js
    type: js
```
<!--
3. Add a custom card in your `ui-lovelace.yaml`
<!--
**Password Example**
<!--
```yaml
type: 'custom:love-lock-card'
title: Lounge
popup: password
password: 1234
cards:
  - entity: light.hue_white_lamp_1
    name: Lounge Lamp
    type: light
```
<!--
**Confirm Example**
<!--
```yaml
type: 'custom:love-lock-card'
title: Lounge
popup: confirm
cards:
  - entity: light.hue_white_lamp_1
    name: Lounge Lamp
    type: light
```
<!--
**Timeout Example**
<!--
```yaml
type: 'custom:love-lock-card'
title: Lounge
popup: timeout
cards:
  - entity: light.hue_white_lamp_1
    name: Lounge Lamp
    type: light
```
<!--
# Credits
Idea comes from [Thomasloven's lovelace-toggle-lock-entity-row](https://github.com/thomasloven/lovelace-toggle-lock-entity-row)
<!--
Based on [vertical-stack-in-card](https://github.com/custom-cards/vertical-stack-in-card/blob/master/README.md)
