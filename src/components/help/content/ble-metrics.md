## Choose a metric, not a conversion factor

Set `--format` and `--metric` in the host’s Args. The decoder supplies units and conversion automatically. The names below come from the shared decoder catalogue; a name in this catalogue does not mean every device broadcasts that field.

For example, `--format victron --metric battery_current` records current rather than the other fields in the decoded text. The [sensor setup guide](/docs/sensors/) explains addresses, keys and device identification.

## Availability and repeated fields

Victron selects its record decoder from the advertisement’s record type. Different products expose different subsets, and fields marked unavailable cannot supply a valid sample. Ruuvi entries apply to RAWv2 broadcasts. BTHome entries depend on the objects your device sends; state, event and counter fields are not always continuous measurements.

Repeated BTHome objects use numbered names: the first temperature is `temperature`, the second is `temperature_2`, and later occurrences continue with `_3`, `_4` and so on. For example, use `--format bthome --metric temperature_2` for the second temperature in the broadcast. Check the decoded output to identify which physical sensor each occurrence represents; ordering belongs to the device protocol.

Units described as “raw value” represent protocol codes, states or counts; use the protocol reference to interpret them. Device error/state codes are not latency ratings.

## Victron metrics

Source: [Victron advertisement specification](https://communityarchive.victronenergy.com/storage/attachments/extra-manufacturer-data-2022-12-14.pdf).

| Metric | Unit |
| --- | --- |
| `ac_apparent_power` | VA |
| `ac_current` | A |
| `ac_in_power` | W |
| `ac_out_power` | W |
| `ac_voltage` | V |
| `active_ac_input` | raw value |
| `alarm` | raw value |
| `alarm_reason` | raw value |
| `aux_input` | raw value |
| `aux_voltage` | V |
| `balancer_status` | raw value |
| `battery_current` | A |
| `battery_current_1` | A |
| `battery_current_2` | A |
| `battery_current_3` | A |
| `battery_temperature` | °C |
| `battery_voltage` | V |
| `battery_voltage_1` | V |
| `battery_voltage_2` | V |
| `battery_voltage_3` | V |
| `bms_error` | raw value |
| `bms_flags` | raw value |
| `cell_1_voltage` | V |
| `cell_2_voltage` | V |
| `cell_3_voltage` | V |
| `cell_4_voltage` | V |
| `cell_5_voltage` | V |
| `cell_6_voltage` | V |
| `cell_7_voltage` | V |
| `cell_8_voltage` | V |
| `charger_error` | raw value |
| `consumed_ah` | Ah |
| `device_state` | raw value |
| `error_code` | raw value |
| `input_current` | A |
| `input_voltage` | V |
| `io_status` | raw value |
| `load_current` | A |
| `mid_voltage` | V |
| `monitor_mode` | raw value |
| `off_reason` | raw value |
| `output_current` | A |
| `output_state` | raw value |
| `output_voltage` | V |
| `pv_power` | W |
| `smartlithium_error` | raw value |
| `state_of_charge` | % |
| `time_to_go` | min |
| `ve_bus_error` | raw value |
| `warning_reason` | raw value |
| `warnings_alarms` | raw value |
| `yield_today` | kWh |

## Ruuvi metrics

Source: [Ruuvi RAWv2 specification](https://docs.ruuvi.com/communication/bluetooth-advertisements/data-format-5-rawv2).

| Metric | Unit |
| --- | --- |
| `acceleration_x` | g |
| `acceleration_y` | g |
| `acceleration_z` | g |
| `battery_voltage` | V |
| `humidity` | % |
| `measurement_sequence` | raw value |
| `movement_counter` | raw value |
| `pressure` | Pa |
| `temperature` | °C |
| `tx_power` | dBm |

## Bthome metrics

Source: [BTHome v2 format](https://bthome.io/format/) and [encryption](https://bthome.io/encryption/).

| Metric | Unit |
| --- | --- |
| `acceleration` | m/s² |
| `battery` | % |
| `battery_charging` | raw value |
| `battery_low` | raw value |
| `boolean` | raw value |
| `button` | raw value |
| `carbon_monoxide` | raw value |
| `channel` | raw value |
| `co2` | ppm |
| `cold` | raw value |
| `conductivity` | µS/cm |
| `connectivity` | raw value |
| `count` | raw value |
| `current` | A |
| `device_type_id` | raw value |
| `dewpoint` | °C |
| `dimmer` | raw value |
| `dimmer_steps` | steps |
| `direction` | ° |
| `distance_m` | m |
| `distance_mm` | mm |
| `door` | raw value |
| `duration` | s |
| `energy` | kWh |
| `garage_door` | raw value |
| `gas` | m³ |
| `gas_detected` | raw value |
| `gyroscope` | °/s |
| `heat` | raw value |
| `humidity` | % |
| `illuminance` | lx |
| `light` | raw value |
| `light_level` | raw value |
| `lock_unlocked` | raw value |
| `mass_kg` | kg |
| `mass_lb` | lb |
| `moisture` | % |
| `moisture_detected` | raw value |
| `motion` | raw value |
| `moving` | raw value |
| `occupancy` | raw value |
| `opening` | raw value |
| `packet_id` | raw value |
| `plug` | raw value |
| `pm10` | µg/m³ |
| `pm2_5` | µg/m³ |
| `power` | W |
| `power_state` | raw value |
| `precipitation` | mm |
| `presence` | raw value |
| `pressure` | hPa |
| `problem` | raw value |
| `rotation` | ° |
| `rotational_speed` | rpm |
| `running` | raw value |
| `safety` | raw value |
| `settings_revision` | raw value |
| `smoke` | raw value |
| `sound` | raw value |
| `speed` | m/s |
| `tamper` | raw value |
| `temperature` | °C |
| `timestamp` | raw value |
| `tvoc` | µg/m³ |
| `uv_index` | raw value |
| `vibration` | raw value |
| `voltage` | V |
| `volume_flow_rate` | m³/hr |
| `volume_l` | L |
| `volume_ml` | mL |
| `volume_storage` | L |
| `water` | L |
| `window` | raw value |

## Put readings to work

Use [actual-unit alert limits](/docs/alerts/), review [chart violations](/docs/charts/) and read [reports](/docs/reports/). If a value is missing, follow [troubleshooting](/docs/troubleshooting/).
