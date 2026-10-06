## What Bluetooth monitoring does

Read compatible device broadcasts without connecting to their GATT services or controlling the device. Your agent needs a Bluetooth adapter, scanning permission and radio range. Use Windows, Android or BLE-enabled ESP32 firmware. Linux live scanning is not currently implemented.

Choose **blebroadcast** to record a specific metric from a device. **blebroadcastlisten** discovers nearby broadcasts during a capped window and returns diagnostics; it does not automatically make a monitor for every value it sees.

## Supported devices and protocols

| Format in Args | Supported broadcasts | Key |
| --- | --- | --- |
| `victron` | Victron Instant Readout records | Device advertisement encryption key |
| `ruuvi` | RuuviTag RAWv2 / format 5 | No key |
| `bthome` | BTHome v2 broadcasts, including compatible Shelly BLU devices | No key for plain packets; AES key for encrypted packets |

Victron record support includes solar chargers, battery monitors, inverters, DC/DC converters, SmartLithium, Inverter RS, AC chargers, Smart Battery Protect, Lynx Smart BMS, Multi RS, VE.Bus, DC energy meters and Orion XS. The packet’s record type selects the decoder. Available readings depend on the device and firmware.

BTHome is a protocol used by different manufacturers. Support does not mean every Shelly or other vendor device broadcasts BTHome v2. Check the device’s documentation.

## Add a Victron monitor

1. Enable the device’s supported broadcast/readout feature and obtain its advertisement key using the vendor’s device tools. This is not the short Bluetooth pairing PIN.
2. On the dashboard, add a host using `blebroadcast` and an agent near the device.
3. Enter the BLE address and put the advertisement key in **Password / Key**.
4. Set **Args** to the format and exact metric name:

```text
--format victron --metric battery_voltage
```

5. Enable and save. Confirm that the latest status identifies the selected metric and that the value uses `V`.

To monitor current too, add another host with the same address/key/location and:

```text
--format victron --metric battery_current
```

Different Args distinguish the monitors. One broadcast may contain several readings, but each host records its selected metric. Keep the explicit metric even when a device has a familiar default.

## Add a Ruuvi or BTHome monitor

For a RuuviTag temperature monitor, leave Password / Key empty and use:

```text
--format ruuvi --metric temperature
```

For a plain BTHome v2 temperature device:

```text
--format bthome --metric temperature
```

Encrypted BTHome needs the device’s 16-byte key and correct BLE address. Its encryption also authenticates the packet. If your device emits a different object, select it from the [metric reference](/docs/ble-metrics/). Repeated fields get numbered selectors: `temperature` for the first, `temperature_2` for the second. Use `--format bthome --metric temperature_2` to record the second temperature, and confirm its physical meaning from the device’s output.

## Values and missing readings

Units and conversion are automatic. You do not need to enter a scale or offset for a supported metric. A value such as `-1.1 A` can be valid current, not a timeout. A missing field, unsupported record or unavailable value should be shown as an unavailable reading.

States, button events and counters are not interchangeable with continuously sampled temperature. A trigger-based sensor may only broadcast when something happens; choose a capture budget/cadence appropriate to it. A sparse event stream does not prove the device is offline.

Use [high/low limits](/docs/alerts/#measurement-limits) in actual units when useful. The [chart](/docs/charts/) colours violations of your current limits; it does not reconstruct past alert events.

## Discovery and generic payloads

Listen mode can help find addresses/payloads. Decoded output is diagnostic text, not proof that all nearby devices are compatible. Raw, AES-GCM and AES-CTR payload options are available for specialist capture/decryption, but arbitrary payloads do not gain an automatic physical metric.

If discovery succeeds but a targeted reading fails, check format, key, address, broadcast interval, radio range and whether that record actually contains the selected field. See [troubleshooting](/docs/troubleshooting/#bluetooth-decodes-but-the-number-is-wrong).

## Vendor references

- [Victron Extra Manufacturer Data specification (PDF)](https://communityarchive.victronenergy.com/storage/attachments/extra-manufacturer-data-2022-12-14.pdf)
- [Victron Orion XS layout discussion](https://community.victronenergy.com/t/orion-xs-12v-12v-50a-bluetooth-advertising-data/2183)
- [Ruuvi RAWv2 / format 5](https://docs.ruuvi.com/communication/bluetooth-advertisements/data-format-5-rawv2)
- [BTHome format reference](https://bthome.io/format/) and [encrypted broadcasts](https://bthome.io/encryption/)
- [Shelly BLE documentation](https://shelly-api-docs.shelly.cloud/docs-ble/common/)

These references describe the protocols. The [metric list](/docs/ble-metrics/) describes the selection names supported here.
