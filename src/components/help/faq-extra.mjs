// Detailed customer questions, shared by the website and generated knowledge export.
export const extraFaqItems = [
  {
    id: "what-service",
    group: "start",
    question: "What can I use this service for?",
    answer:
      "Watch public websites, private servers, network services and supported Bluetooth sensors from a chosen monitor location. The website brings readings, history, alerts and reports together. The assistant can help configure hosts and run supported investigations. Your selected agent and plan determine which checks are available.",
    guide: "getting-started",
  },
  {
    id: "host-meaning",
    group: "start",
    question: "What does “host” mean here?",
    answer:
      "A host is a saved monitoring configuration, not necessarily a whole physical computer. It combines an address, endpoint, location and relevant settings. One physical device can have several hosts: for example, a website request and a TCP check, or separate battery voltage and current measurements.",
    guide: "getting-started",
  },
  {
    id: "endpoint-meaning",
    group: "start",
    question: "What is an endpoint type?",
    answer:
      "An endpoint selects the kind of recurring check: ping, DNS, HTTP, a TLS property, a port scan or a Bluetooth reading. It determines what success means and what measurement is recorded. Choose it for the question you want answered; a successful TCP connection does not establish that a web application is working correctly.",
    guide: "getting-started",
  },
  {
    id: "location-meaning",
    group: "start",
    question: "What is a monitor location?",
    answer:
      "It identifies the agent that performs the check. Network reachability, DNS resolution, available tools and Bluetooth radio range belong to that location. Changing it can change the result even when the address stays the same. Select a registered location rather than copying a location name from an example.",
    guide: "platforms",
  },
  {
    id: "private-address",
    group: "start",
    question: "Can I monitor 192.168.x.x, 10.x.x.x or localhost?",
    answer:
      "Yes, through an agent that can reach the private address. A public service location cannot normally reach your LAN. Localhost and 127.0.0.1 refer to the machine or container running the check, not automatically your browser’s computer. Choose a local agent and test reachability from its environment.",
    guide: "getting-started",
  },
  {
    id: "browser-probe",
    group: "start",
    question: "Does the website itself scan my home network?",
    answer:
      "The browser displays and controls monitoring; checks run on the selected agent. Opening the dashboard on your home Wi-Fi does not give a remote agent access to that network. Install and authorise a local agent for local targets.",
    guide: "platforms",
  },
  {
    id: "enable-host",
    group: "start",
    question: "Why is a newly added host not producing readings?",
    answer:
      "Confirm that it is enabled and that your changes were saved. Check the monitor location, agent authorisation and target address. Then allow an eligible polling cycle; skip cycles and endpoint scheduling can delay the first observation. Inspect status text if a check returns a failure.",
    guide: "getting-started",
  },
  {
    id: "disable-host",
    group: "start",
    question: "Can I pause monitoring without deleting a host?",
    answer:
      "Disable the host and save. This preserves its configuration while stopping new scheduled checks. Enable and save it again to resume. Pausing collection does not create readings for the time it was disabled or guarantee that older history will remain beyond retention.",
    guide: "getting-started",
  },
  {
    id: "delete-host",
    group: "start",
    question: "What should I do before deleting a host?",
    answer:
      "Confirm you have selected the correct host and download any history you need using the available controls. Deleting a configuration is different from disabling it temporarily. Do not rely on deletion being reversible or on a newly added replacement automatically inheriting the original host’s history.",
    guide: "getting-started",
  },
  {
    id: "duplicate-host",
    group: "start",
    question: "Can I monitor the same address more than once?",
    answer:
      "Yes, when its relevant configuration differs, such as endpoint, monitor location or Args. This is useful for comparing locations and selecting several BLE metrics. Exact duplicate configurations are rejected. Changing only a friendly description should not be relied on to distinguish identical monitoring checks.",
    guide: "getting-started",
  },
  {
    id: "port-choice",
    group: "start",
    question: "When do I need to set a port?",
    answer:
      "Set the port when the endpoint checks a specific service, such as a TCP listener, SMTP server or TLS service. Use the service’s actual listening port. A successful check of one port says nothing about other ports. Ping and ordinary name lookup do not ask the same port-specific question.",
    guide: "endpoints",
  },
  {
    id: "timeout-meaning",
    group: "start",
    question: "What does Timeout mean, and what unit does it use?",
    answer:
      "Timeout is the execution budget in milliseconds: 1000 ms is one second. It controls how long a check can run; it is not a voltage limit or a guaranteed polling interval. Some longer jobs use extended endpoint-specific budgets. Read the endpoint guidance before applying a short ping timeout to a scan or crawl.",
    guide: "endpoints",
  },
  {
    id: "skip-cycles",
    group: "start",
    question: "How does Skip cycles change the check frequency?",
    answer:
      "Zero checks on every eligible processor cycle; one skips one cycle between checks; three skips three. Leaving it blank uses the endpoint’s configured default. Actual cadence also depends on the agent, work duration and endpoint scheduling, so this is not an exact wall-clock scheduling control.",
    guide: "getting-started",
  },
  {
    id: "args-purpose",
    group: "start",
    question: "What are Args, and do I always need them?",
    answer:
      "Args supply endpoint-specific options. Ordinary checks can often leave them empty. BLE uses them to choose format and metric, while some diagnostics or custom checks have their own syntax. Use the documentation for the selected endpoint; arbitrary arguments are not meaningful to every check.",
    guide: "endpoints",
  },
  {
    id: "credential-purpose",
    group: "start",
    question: "Are Password / Key values always login passwords?",
    answer:
      "No. Their meaning depends on the endpoint. For encrypted BLE advertisements the value is a protocol encryption key, not the Bluetooth pairing PIN or your website password. Use the credential requirements of the specific check and avoid copying keys into public support messages.",
    guide: "endpoints",
  },
  {
    id: "icmp-fails-http-works",
    group: "start",
    question: "Why does ping fail when the website works?",
    answer:
      "The target or network may block ICMP while allowing web traffic. Ping and HTTP test different protocols. Use HTTP for website reachability and inspect its response status. An ICMP failure alone does not prove that the web application is unavailable.",
    guide: "endpoints",
  },
  {
    id: "http-status",
    group: "start",
    question: "Does an HTTP 404 or 500 always mean the host was unreachable?",
    answer:
      "No. A completed error response can show that the server was reached. Read the returned status as well as duration and success/failure interpretation. Reachability, a successful application response and correct page content are different properties.",
    guide: "endpoints",
  },
  {
    id: "html-rendered",
    group: "start",
    question: "What is the difference between httphtml and httpfull?",
    answer:
      "httphtml downloads HTML without executing the page’s JavaScript. httpfull uses browser automation to load rendered content. Choose the latter when client-side rendering matters and your agent supports it. Android restricts browser automation, and ESP32 does not run a browser.",
    guide: "endpoints",
  },
  {
    id: "sitehash-changes",
    group: "start",
    question: "What does the sitehash endpoint tell me?",
    answer:
      "It compares rendered page content with a saved baseline. A change can be expected content, personalisation or a meaningful alteration; it is not automatically evidence of compromise. Review the changed content and baseline behaviour. This endpoint needs browser-capable tooling.",
    guide: "endpoints",
  },
  {
    id: "dns-result",
    group: "start",
    question: "What does a DNS check measure?",
    answer:
      "It resolves the hostname from the selected agent and records lookup duration and status. Different resolvers or networks can give different answers. A successful lookup does not establish that the resolved server or its application is reachable.",
    guide: "endpoints",
  },
  {
    id: "smtp-result",
    group: "start",
    question: "Does the SMTP check prove that email will be delivered?",
    answer:
      "It checks the configured SMTP connection and protocol response, not a complete send-and-receive transaction. Mail acceptance, authentication, filtering and final delivery are separate issues. Use the correct server and port and inspect diagnostics.",
    guide: "endpoints",
  },
  {
    id: "tcp-result",
    group: "start",
    question: "What does rawconnect prove?",
    answer:
      "It tests a TCP connection to the configured port. A successful socket connection establishes that the connection could be made from that agent at that time. It does not establish correct application behaviour, valid certificates or a successful authenticated session.",
    guide: "endpoints",
  },
  {
    id: "certificate-expiry",
    group: "start",
    question: "Can a certificate check fail before the certificate expires?",
    answer:
      "Certificate-check paths can treat the seven-day expiry warning as a failure. Inspect the returned certificate/status details rather than interpreting every failure as a network timeout. The documented HTTP/HTTPS routing differences also matter; use focused OpenSSL diagnostics when investigating trust or expiry.",
    guide: "endpoints",
  },
  {
    id: "configintegrity",
    group: "start",
    question: "What does configintegrity monitor?",
    answer:
      "It reads a local Debian configuration-integrity result published at /run/config-integrity/result.json. The monitoring check does not run the underlying integrity checker itself. The selected agent needs access to a valid result produced by that separate setup.",
    guide: "endpoints",
  },
  {
    id: "daily-jobs",
    group: "start",
    question: "Why does a daily endpoint not run as often as ping?",
    answer:
      "Daily crawl and daily Space maintenance have endpoint-specific scheduling. A successful ping cycle does not imply that a daily job should run again. Check the endpoint’s schedule and status before treating a less frequent observation as a failure.",
    guide: "endpoints",
  },
  {
    id: "multiple-agents",
    group: "start",
    question: "Can I use several agents with the same account?",
    answer:
      "You can authorise available agents to your account and choose the appropriate location for each host. Available registrations, locations and host allowances follow your account and configuration. Use clear locations so you can distinguish home, office and remote checks.",
    guide: "platforms",
  },
  {
    id: "mac-app",
    group: "start",
    question: "Is there a native macOS app?",
    answer:
      "The documented native apps target Windows and Android. On macOS, Docker Desktop can run the Linux agent container if the image and host architecture are compatible. Container networking and hardware access differ from a native macOS application.",
    guide: "platforms",
  },
  {
    id: "ble-pairing",
    group: "observe",
    question: "Do I need to pair with a Bluetooth sensor?",
    answer:
      "The supported monitoring path listens to advertisements rather than opening a GATT control connection. The device must broadcast a supported payload and be within radio range. Encrypted advertisements still require the correct protocol key, even when pairing is unnecessary.",
    guide: "sensors",
  },
  {
    id: "ble-supported",
    group: "observe",
    question: "Will any Bluetooth device work?",
    answer:
      "No. Automatic numeric decoding supports the implemented Victron Instant Readout, Ruuvi RAWv2 and BTHome v2 formats. A device being Bluetooth-capable does not establish protocol compatibility. Generic capture can help investigate other payloads but does not automatically supply a numeric decoder.",
    guide: "sensors",
  },
  {
    id: "victron-selection",
    group: "observe",
    question: "How does the service know which Victron decoder to use?",
    answer:
      "Victron’s advertisement record type selects the matching implemented record decoder. The address identifies the device, the key allows decryption and --metric selects the recorded field. You do not choose a solar decoder solely because the address or password looks familiar.",
    guide: "sensors",
  },
  {
    id: "victron-pin",
    group: "observe",
    question: "Is the Victron advertisement key the same as its pairing PIN?",
    answer:
      "No. Use the device’s Instant Readout advertisement encryption key, a 16-byte AES key normally represented as 32 hexadecimal characters. A pairing PIN and your service login password serve different purposes. Consult the Victron setup/specification references for obtaining the key for your device.",
    guide: "sensors",
  },
  {
    id: "victron-families",
    group: "observe",
    question: "Which Victron device families have decoders?",
    answer:
      "Implemented record layouts cover solar chargers, battery monitors, inverters, DC/DC converters, SmartLithium, Inverter RS, AC chargers, Smart Battery Protect, Lynx Smart BMS, Multi RS, VE.Bus, DC energy meters and Orion XS. Support is at record level; not every model or firmware provides every catalogue metric.",
    guide: "sensors",
  },
  {
    id: "victron-missing-field",
    group: "observe",
    question:
      "Why does a Victron device decode text but not my selected metric?",
    answer:
      "The text can contain several fields while the selected record lacks the requested numeric field or marks it unavailable. Check the --metric spelling, record/device type and returned status. Successfully decrypting a packet does not guarantee that every metric in the shared catalogue exists on that device.",
    guide: "sensors",
  },
  {
    id: "two-metrics",
    group: "observe",
    question: "How do I record both voltage and current from one device?",
    answer:
      "Create two enabled hosts using the same BLE address and location. Give one Args of --format victron --metric battery_voltage and the other --format victron --metric battery_current, with the appropriate key. Different Args distinguish the hosts; each records one selected measurement with its own unit and limits.",
    guide: "sensors",
  },
  {
    id: "ruuvi-key",
    group: "observe",
    question: "Do Ruuvi RAWv2 broadcasts need an encryption key?",
    answer:
      "The supported Ruuvi RAWv2 format is unencrypted, so leave the key empty. Use --format ruuvi and an available metric such as temperature. Make sure the device is actually broadcasting the supported format; another Ruuvi payload is not automatically the same layout.",
    guide: "sensors",
  },
  {
    id: "ruuvi-fields",
    group: "observe",
    question: "What can I record from a RuuviTag?",
    answer:
      "RAWv2 exposes temperature, humidity, pressure, XYZ acceleration, battery voltage, transmit power, movement count and measurement sequence. Select the exact name from the metric reference. Counts and sequences should be interpreted as counts, not as ordinary temperature or latency trends.",
    guide: "sensors",
  },
  {
    id: "bthome-manufacturer",
    group: "observe",
    question: "Is BTHome a manufacturer?",
    answer:
      "BTHome is a broadcast protocol used by multiple manufacturers. Compatibility depends on the device sending supported BTHome v2 objects, not simply its brand. Some Shelly devices use BTHome; this does not mean every Shelly product is supported by the BLE decoder.",
    guide: "sensors",
  },
  {
    id: "bthome-encrypted",
    group: "observe",
    question: "How do I configure encrypted BTHome?",
    answer:
      "Select --format bthome and the desired --metric, supply the correct device address and its 16-byte key in Password / Key. BTHome encryption also authenticates the packet. Plain broadcasts do not need an encryption key. A wrong address or key can prevent authenticated decoding.",
    guide: "sensors",
  },
  {
    id: "bthome-two-temperature",
    group: "observe",
    question: "How do I choose between two BTHome temperatures?",
    answer:
      "Repeated objects get numbered selectors: temperature for the first, temperature_2 for the second, then temperature_3 and so on. For the second use --format bthome --metric temperature_2. Confirm which physical sensor that occurrence represents; the broadcaster determines the object ordering.",
    guide: "ble-metrics",
  },
  {
    id: "metric-case",
    group: "observe",
    question: "Where do I find exact metric names and units?",
    answer:
      "Use the Bluetooth metric reference, which lists the shared catalogue by format. Copy the selector, such as battery_voltage or temperature_2, into --metric. Catalogue membership does not guarantee a particular device sends that field. Inspect the decoded text and status for actual availability.",
    guide: "ble-metrics",
  },
  {
    id: "metric-text",
    group: "observe",
    question:
      "Why does decoded text show many values when the chart shows one?",
    answer:
      "Decoded text is diagnostic information for the whole packet. The numeric host reading is the field selected by --metric. To chart another field, create a separate configuration or change the selector, bearing in mind that old and new measurements should not be mixed without interpretation.",
    guide: "sensors",
  },
  {
    id: "manual-scaling",
    group: "observe",
    question: "Do I need to calculate scale and offset for BLE?",
    answer:
      "No, supported format/metric selections supply their conversion and unit automatically. Enter the metric rather than an encoding formula. The website and actual-value outputs should show physical readings; applying another scale to an already converted JSON value would produce the wrong number.",
    guide: "sensors",
  },
  {
    id: "ble-discovery",
    group: "observe",
    question: "How can I discover nearby Bluetooth devices?",
    answer:
      "Use the supported BLE discovery workflow, BleBroadcastListen or blebroadcastlisten, on a nearby scanner. It captures a bounded set of advertisements and diagnostics. Discovery does not automatically create a recurring host for every device or field. Use a discovered address in a targeted sensor configuration.",
    guide: "sensors",
  },
  {
    id: "ble-signal",
    group: "observe",
    question: "Why are Bluetooth readings intermittent?",
    answer:
      "Check distance, obstacles, interference, scanner permissions, advertisement interval and device power. A capture window may miss a sparse broadcast. Move a capable agent closer and inspect discovery output before changing the metric or key. A sensor can be present yet not heard during a particular observation.",
    guide: "sensors",
  },
  {
    id: "ble-linux",
    group: "observe",
    question: "Can the Linux container listen to Bluetooth sensors?",
    answer:
      "Live Linux BLE advertisement scanning is not currently implemented in this processor. Offline payload decoding is different from scanning the radio. Use Windows, Android or BLE-enabled ESP32 firmware for live monitoring, subject to their hardware and permissions.",
    guide: "sensors",
  },
  {
    id: "ble-generic",
    group: "observe",
    question:
      "Can I decode an arbitrary encrypted advertisement with its AES key?",
    answer:
      "The key alone does not define the payload layout, field lengths, units or missing-value markers. Generic raw/AES capture can help diagnostics, but automatic numeric monitoring needs a matching protocol decoder and measurement metadata. Use manufacturer specifications when considering a new decoder.",
    guide: "sensors",
  },
  {
    id: "state-values",
    group: "observe",
    question: "What do raw values, state codes and event readings mean?",
    answer:
      "They represent protocol states, enumerations, events or counters rather than necessarily a continuous physical quantity. Consult the relevant vendor specification for meanings. A button event code or charger error code should not be interpreted as milliseconds or assigned a normal latency rating.",
    guide: "ble-metrics",
  },
  {
    id: "low-only",
    group: "observe",
    question: "Can I set only a low limit or only a high limit?",
    answer:
      "Yes. Leave the unused limit empty. Set the other in the displayed measurement unit and save the host. For example, a low-only limit checks values below that boundary. If both limits are present, low must be less than high.",
    guide: "alerts",
  },
  {
    id: "zero-limit",
    group: "observe",
    question: "Can an alert limit be zero or negative?",
    answer:
      "Yes, when that boundary makes sense for the measurement. Empty disables a limit; zero is an actual boundary. Negative temperature or current can be valid. Check the displayed unit and physical meaning before choosing a boundary.",
    guide: "alerts",
  },
  {
    id: "exact-limit",
    group: "observe",
    question: "Does a reading exactly equal to a limit violate it?",
    answer:
      "A low violation is a valid reading below the low limit; a high violation is above the high limit. Equality is not itself outside those boundaries. Account for measurement resolution when interpreting values very close to a boundary.",
    guide: "alerts",
  },
  {
    id: "clear-limit",
    group: "observe",
    question: "How do I turn off measurement-limit alerts?",
    answer:
      "Clear the low and high fields in edit details and save. Clearing one disables that side only. Failure/availability alerting is a separate concern, and clearing limits does not automatically reset an already latched alert.",
    guide: "alerts",
  },
  {
    id: "failed-limit",
    group: "observe",
    question: "Does a timeout also count as a low reading?",
    answer:
      "No. An unavailable observation is not a numeric zero or an artificially low physical measurement. Availability failures and valid out-of-range samples have different meanings. Read the status and failure markers rather than treating missing data as a sensor value.",
    guide: "alerts",
  },
  {
    id: "limit-units",
    group: "observe",
    question: "Do I enter limits using encoded storage values?",
    answer:
      "Enter the actual unit shown for the host: volts, amps, degrees Celsius or the relevant measurement. Users do not normally need internal encoding factors. If the endpoint or metric changes, review the limits so an old voltage boundary is not applied to a new current reading.",
    guide: "alerts",
  },
  {
    id: "safe-limits",
    group: "observe",
    question:
      "Can the assistant choose a safe battery or temperature limit for me?",
    answer:
      "It can help interpret the measurement and relevant references, but there is no universal safe limit for every device or installation. Use the equipment manufacturer’s guidance and your operating requirements. If limits are unset, neither the chart nor an AI explanation should invent a safety boundary.",
    guide: "alerts",
  },
  {
    id: "alert-recovery",
    group: "observe",
    question: "Does an alert reset automatically when the target recovers?",
    answer:
      "The notification is latched until reset in the current alert workflow. Recovery and resetting are different actions. Review the current status, then reset the relevant alert if you want another notification. A continuing condition can trigger again after reset.",
    guide: "alerts",
  },
  {
    id: "reset-repair",
    group: "observe",
    question: "Does resetting an alert fix the problem?",
    answer:
      "No. Reset permits another notification; it does not repair the server, radio connection or measurement. Investigate returned diagnostics and history first. Repeatedly resetting a still-failing host can simply lead to another alert.",
    guide: "alerts",
  },
  {
    id: "five-failures",
    group: "observe",
    question: "Are alerts always triggered after exactly five failed checks?",
    answer:
      "No universal count should be assumed. Failure triggering follows service/processor configuration and alert state. Measurement limits are a separate trigger. Do not calculate a guaranteed notification time from a fixed count copied from an older example.",
    guide: "alerts",
  },
  {
    id: "prediction-limits",
    group: "observe",
    question: "Are predictive alerts the same as high and low limits?",
    answer:
      "No. Predictive/anomaly processing evaluates patterns over configured observation windows; fixed limits compare valid measurements with explicit boundaries. Their reset controls are separate. The current ML pipeline is latency-oriented and is not calibrated for every sensor unit.",
    guide: "alerts",
  },
  {
    id: "alert-delay",
    group: "observe",
    question: "Will an alert arrive immediately after an observation?",
    answer:
      "Collection, upload, processing and email delivery take time, and a running disconnected agent may upload observations later. Trigger configuration also matters. For an urgent investigation, inspect the newest observation and its timestamp rather than relying only on when an email reached your inbox.",
    guide: "alerts",
  },
  {
    id: "chart-details",
    group: "observe",
    question: "Where can I see the monitor location and all host settings?",
    answer:
      "Open the host chart and expand Show details. It exposes configuration and measurement context without filling the plot with extra controls. Use the host’s edit details when changing settings; the displayed location identifies where the check runs.",
    guide: "charts",
  },
  {
    id: "chart-columns",
    group: "observe",
    question: "Can I add more columns to the host table?",
    answer:
      "Use Table options → Columns to choose the information you want visible. Filtering, sorting and optional columns help keep the table useful for your task. Long text cells have hover information on supported desktop interactions; use detail views on touch screens.",
    guide: "charts",
  },
  {
    id: "chart-datasets",
    group: "observe",
    question: "What is the difference between a dataset and a time range?",
    answer:
      "A dataset selects a stored collection, including the latest dataset. A time range selects observations by explicit start/end times and can span available datasets. The two views answer different questions; choose a range for a period such as the last day.",
    guide: "charts",
  },
  {
    id: "range-custom",
    group: "observe",
    question: "How long can a custom chart range be?",
    answer:
      "The current custom range supports up to 90 days per request. That limit does not guarantee 90 days of retained data. Availability depends on your plan, actual collection and accessible archives. Split a longer investigation into supported periods.",
    guide: "charts",
  },
  {
    id: "chart-points",
    group: "observe",
    question: "Does a week-long chart display every collected point?",
    answer:
      "Long range charts use up to 960 representative points across 160 buckets. Selection retains useful first/last values, extrema and failure samples rather than drawing every observation. The chart is a visual summary; its plotted point count is not the number of collected readings.",
    guide: "charts",
  },
  {
    id: "summary-sampling",
    group: "observe",
    question: "Are chart averages calculated only from the displayed sample?",
    answer:
      "Range summaries use the available observations for the requested period rather than only the representative plotted points. If archive coverage is incomplete, the summary describes the available data. Check any coverage notice before interpreting it as a complete record of the period.",
    guide: "charts",
  },
  {
    id: "chart-refresh",
    group: "observe",
    question: "Will background refresh wipe my selected chart view?",
    answer:
      "The range/selection is preserved. When a view includes the latest dataset, new observations can produce a new-data indicator so you can refresh deliberately. A fixed historical period should not jump to the latest view simply because the agent uploaded another batch.",
    guide: "charts",
  },
  {
    id: "chart-gaps",
    group: "observe",
    question: "Why does a chart have gaps even though the agent is registered?",
    answer:
      "Registration is not proof that every observation is available. The agent may be off, the host disabled, a job scheduled less frequently, or an upload/archive unavailable. Failed observations and periods with no collected data are different. Inspect timestamps, status and coverage notices.",
    guide: "charts",
  },
  {
    id: "chart-current-limits",
    group: "observe",
    question: "If I change a limit, do old chart colours change?",
    answer:
      "Violation colouring compares plotted values with the current limits. Changing a limit can therefore change how earlier points are coloured. It is not a saved history of the limits that existed or the exact point that caused an email at the time.",
    guide: "charts",
  },
  {
    id: "chart-alert-point",
    group: "observe",
    question: "Can I locate the exact observation that sent an alert?",
    answer:
      "The chart clearly identifies current-limit violations and failed observations, but these markers are not stored alert-trigger events. Use alert timestamps and nearby readings for context. Do not claim that a coloured point is definitively the notification trigger.",
    guide: "charts",
  },
  {
    id: "chart-negative",
    group: "observe",
    question: "Why can the chart go below zero?",
    answer:
      "Signed measurements such as current and temperature can legitimately be negative. The chart should plot their actual values, with failure represented separately. A negative point is not automatically a timeout or bad performance.",
    guide: "charts",
  },
  {
    id: "chart-precision",
    group: "observe",
    question:
      "Why does the displayed number have fewer decimals than an export?",
    answer:
      "The interface rounds values to sensible display precision, avoiding floating-point artefacts such as 13.049999999998. Display formatting does not make the underlying sensor more precise. Compare values using the measurement’s resolution, not the number of digits in an unformatted calculation.",
    guide: "charts",
  },
  {
    id: "metric-change-history",
    group: "observe",
    question: "What happens if I change a host from voltage to current?",
    answer:
      "The host’s current measurement definition and limits change, while previously collected observations belong to their original meaning. Do not interpret a mixed period as one consistent series. Separate hosts for distinct metrics provide clearer histories; review or clear old limits when changing the selector.",
    guide: "charts",
  },
  {
    id: "report-frequency",
    group: "observe",
    question: "When will I receive a report?",
    answer:
      "Reports follow the service/account schedule and configuration; normal reports are presented as weekly summaries. Verify email and notification preferences, and make sure there are observations in the report period. A scheduled report is different from asking the assistant for an immediate explanation.",
    guide: "reports",
  },
  {
    id: "report-ai",
    group: "observe",
    question: "What data does AI report analysis receive?",
    answer:
      "When enabled, it receives actual measurement values, timestamps, units, measurement descriptions, appropriate analysis guidance and configured limits. Physical metrics are not judged using ordinary ping ratings. Analysis should remain specific to the host, available data and requested period.",
    guide: "reports",
  },
  {
    id: "report-root-cause",
    group: "observe",
    question: "Does a report prove the root cause of an outage?",
    answer:
      "No. Summaries and AI commentary interpret observations, which may suggest a useful investigation. They cannot establish unobserved causes or certify equipment safety. Compare status text and trends with an appropriate on-demand diagnostic result.",
    guide: "reports",
  },
  {
    id: "json-null",
    group: "observe",
    question: "What does null mean in a measurement JSON download?",
    answer:
      "It represents an unavailable reading, not a zero measurement. Actual-value host/report outputs include units and observation context. Preserve unavailable values when analysing the data rather than converting them into zero or including them as valid numeric samples.",
    guide: "reports",
  },
  {
    id: "json-scale",
    group: "observe",
    question: "Should I apply scale and offset again to host/report JSON?",
    answer:
      "No. Those measurement outputs contain actual values. A value of -1.1 with unit A is already negative current. Applying display conversion again would corrupt it. The full profile archive has a different stored-record format, so identify which kind of download you are using.",
    guide: "reports",
  },
  {
    id: "profile-export",
    group: "observe",
    question: "How do I download my full stored-data archive?",
    answer:
      "Open Profile and use Generate Data Download. Wait for the prepared download link. This compressed stored-record backup differs from host/report measurement JSON and currently can contain encoded readings without fully resolved display metadata. Retention and collection still bound what is available.",
    guide: "reports",
  },
  {
    id: "archive-recover",
    group: "observe",
    question:
      "Can a download recover readings from when my agent was powered off?",
    answer:
      "No. An agent that was off could not take observations. A running disconnected agent may have buffered observations, within storage limits, and upload them later. Downloading history cannot create measurements that were never collected.",
    guide: "reports",
  },
  {
    id: "assistant-start",
    group: "assist",
    question: "How should I phrase my first request to the assistant?",
    answer:
      "Give the target, chosen agent and goal. For example: “Using my home agent, show the available endpoints and help add a DNS monitor for example.com.” Include constraints and ask to inspect a result. Vague requests make it harder to choose the right tool and location.",
    guide: "assistant",
  },
  {
    id: "assistant-location",
    group: "assist",
    question: "How do I make sure a diagnostic runs on the right agent?",
    answer:
      "Select the location in the interface and name it in the request, especially when delegating to an expert. Check the returned target and agent before accepting the outcome. A remote location and a home agent may see very different networks and devices.",
    guide: "assistant",
  },
  {
    id: "assistant-results",
    group: "assist",
    question: "The assistant says it completed something. How can I verify it?",
    answer:
      "Look for the actual function result, error or operation status. For host changes, inspect the dashboard and its settings; for checks, inspect returned diagnostics. A fluent explanation, example transcript or proposed command alone does not establish execution.",
    guide: "assistant",
  },
  {
    id: "assistant-endpoints",
    group: "assist",
    question: "Can the assistant tell me what this agent supports?",
    answer:
      "Ask it to list available agents and endpoints or inspect supported commands for the selected location. Capability depends on account entitlement, platform, configuration and dependencies. Use returned availability rather than assuming the full documented catalogue is installed everywhere.",
    guide: "assistant",
  },
  {
    id: "assistant-history",
    group: "assist",
    question: "Can I return to an earlier conversation?",
    answer:
      "Use available history controls to reopen saved conversations. Memory retrieval can recall relevant turns and surrounding context. Local/TestLLM context can depend on the original server being available; a different server or model route is not guaranteed to resume the same local state.",
    guide: "assistant",
  },
  {
    id: "assistant-delete",
    group: "assist",
    question: "Can I delete a saved conversation?",
    answer:
      "Use the conversation history’s delete control where available. Deleting a visible history entry should not be interpreted as an assurance that every operational log or provider record is removed. Consult the privacy policy or support for account-data requests.",
    guide: "assistant",
  },
  {
    id: "assistant-voice",
    group: "assist",
    question: "Can I speak to the assistant and hear its answer?",
    answer:
      "Supported interfaces offer microphone transcription and optional spoken replies. Grant microphone permission when requested and check the selected audio controls. Availability depends on the app/browser and configured audio service. Voice input still needs the same target and agent context as typed text.",
    guide: "assistant",
  },
  {
    id: "assistant-stop",
    group: "assist",
    question: "Does Stop cancel a diagnostic already running?",
    answer:
      "Stopping generation stops the reply stream; it does not by itself establish that an agent operation was cancelled. Ask for operation status and use supported cancellation for the running task. Confirm the returned cancellation result rather than assuming a closed chat stopped the agent.",
    guide: "assistant",
  },
  {
    id: "assistant-models",
    group: "assist",
    question:
      "Why are different models available on different days or accounts?",
    answer:
      "Model routes are configured by the service and follow account allowances and provider availability. Hosted and local/TestLLM routes can have different context and tool behaviour. Use the current selector and Subscription page rather than treating an example model name as a permanent promise.",
    guide: "assistant",
  },
  {
    id: "assistant-tokens",
    group: "assist",
    question: "What are tokens and why can a long chat reach a limit?",
    answer:
      "Tokens are the units models use to process text and other supplied context. Your plan has usage and context allowances; lengthy histories and diagnostic output can consume them. Keep a request focused and use a new conversation when appropriate. Check current allowances on Subscription instead of relying on copied figures.",
    guide: "assistant",
  },
  {
    id: "assistant-knowledge",
    group: "assist",
    question: "Can the assistant search product help and security references?",
    answer:
      "It has retrieval tools for the local FAQ/help index and other configured knowledge collections, including security and quantum material and MITRE references. Retrieved help is not live account state. Ask it to inspect real hosts or agents when the question depends on your current setup.",
    guide: "assistant",
  },
  {
    id: "assistant-accuracy",
    group: "assist",
    question:
      "What should I do if an assistant answer contradicts the interface?",
    answer:
      "Check the current configuration and actual tool result, then ask it to reconcile the difference. Retrieved material can be outdated and models can misinterpret it. Supply the relevant error or host identifier without unnecessary secrets and use the current guide or support when uncertainty remains.",
    guide: "assistant",
  },
  {
    id: "scan-versus-monitor",
    group: "assist",
    question: "Should I run a scan once or add an Nmap monitor?",
    answer:
      "Run an on-demand diagnostic for an immediate scoped investigation. Add a recurring endpoint when you need ongoing history and alerts, accounting for scan duration and load. A scan’s completion time is not the same measurement as ping latency.",
    guide: "diagnostics",
  },
  {
    id: "nmap-vulnerabilities",
    group: "assist",
    question: "Does an open-port scan prove there are no vulnerabilities?",
    answer:
      "No. It identifies tested port/service observations. Vulnerability scripts require a capable full Nmap installation and their own scope; a clean result still only covers what was tested. Inspect the actual command, target and output before making a security conclusion.",
    guide: "diagnostics",
  },
  {
    id: "nmap-esp32",
    group: "assist",
    question: "Is ESP32 Nmap the same as desktop Nmap?",
    answer:
      "No. The embedded implementation provides bounded TCP scanning and discovery. It lacks NSE vulnerability scripts, UDP scans and OS fingerprinting. Service labels are hints rather than active version detection. Choose a capable desktop agent for full-tool workflows.",
    guide: "diagnostics",
  },
  {
    id: "openssl-purpose",
    group: "assist",
    question: "When should I ask for OpenSSL diagnostics?",
    answer:
      "Use them to investigate TLS negotiation, certificates and configuration with returned detail. Supply a reachable hostname, port and agent location. ESP32 offers selected typed TLS diagnostics, not the complete desktop OpenSSL command line.",
    guide: "diagnostics",
  },
  {
    id: "metasploit-live",
    group: "assist",
    question:
      "What is the difference between Penetration and Live penetration experts?",
    answer:
      "The Penetration expert can find modules, inspect their options and run a scoped module task. The Live expert works with a persistent Metasploit console session. Both require appropriate agent tooling and entitlement and should stay within your authorised target scope.",
    guide: "diagnostics",
  },
  {
    id: "busybox-purpose",
    group: "assist",
    question: "What is BusyBox used for?",
    answer:
      "It provides supported command-line utilities on capable agents for diagnostic tasks. Availability depends on the installation and platform. Ask for a specific operation and inspect its returned output; do not assume every desktop shell command exists on an embedded board or Android device.",
    guide: "diagnostics",
  },
  {
    id: "crawl-purpose",
    group: "assist",
    question: "Can the assistant inspect a web page or crawl a site?",
    answer:
      "Supported Search/Crawl tools can retrieve information from a page or follow site links on capable agents. Browser-dependent workflows require appropriate tooling and are restricted on Android and ESP32. Remote access controls and page behaviour can limit results.",
    guide: "diagnostics",
  },
  {
    id: "space-guarantee",
    group: "assist",
    question:
      "Will Hugging Face wake/keep-alive checks guarantee my Space stays up?",
    answer:
      "No. These attempt the supported browser/activity workflows and depend on upstream page behaviour, permissions and provider policy. They do not override hosting limits or guarantee continuous uptime. Inspect returned status and the Space’s own configuration.",
    guide: "diagnostics",
  },
  {
    id: "quantum-handshake-cert",
    group: "assist",
    question:
      "Why can a quantum handshake pass but the certificate check fail?",
    answer:
      "Post-quantum key exchange and post-quantum certificate signatures are different properties. A server can support one without the other. Inspect both outcomes and the tested algorithms rather than collapsing them into a single infrastructure-wide quantum-safe label.",
    guide: "quantum",
  },
  {
    id: "quantum-info-support",
    group: "assist",
    question:
      "Does QuantumInfo mean my agent can negotiate all listed algorithms?",
    answer:
      "No. Algorithm information explains catalogue entries; runtime negotiation depends on compiled libraries, providers and configuration. ESP32 has a limited compiled group set. Use an actual handshake result to establish support for a specific service and algorithm.",
    guide: "quantum",
  },
  {
    id: "quantum-port",
    group: "assist",
    question: "Can I check a TLS service on a port other than 443?",
    answer:
      "Use the service’s actual TLS port and a capable agent that can reach it. A check of one hostname/port does not assess every service on the machine. Give the port explicitly in an on-demand request and inspect the returned connection details.",
    guide: "quantum",
  },
  {
    id: "connect-command",
    group: "assist",
    question:
      "What is the difference between a Connect and a command processor?",
    answer:
      "A Connect is a recurring monitoring check that publishes observations and status. A command processor performs an on-demand task and returns output. Use Connect for a measurement you want in host history, and a command processor for a task you run when needed.",
    guide: "automation",
  },
  {
    id: "custom-metadata",
    group: "assist",
    question:
      "What should I specify when asking for a custom measurement check?",
    answer:
      "Describe the source, target, success/failure condition, numeric value, unit and physical meaning. State how unavailable data should be represented. Appropriate metadata lets charts, limits and reports interpret it correctly. Ask to review source and host settings before deployment.",
    guide: "automation",
  },
  {
    id: "custom-review",
    group: "assist",
    question: "Is assistant-generated code automatically safe to deploy?",
    answer:
      "Review it and its target first. Custom C# modules run with the chosen agent’s permissions and dependencies; they are not a guaranteed sandbox. Confirm actual execution and results after deployment. Existing built-in checks may already meet the need without new code.",
    guide: "automation",
  },
  {
    id: "custom-board",
    group: "assist",
    question: "Can I upload a custom C# Connect to an ESP32?",
    answer:
      "No. ESP32 runs compiled firmware with its built-in endpoint and diagnostic subset. Dynamic C# Connects and command processors require capable .NET agents. A backend AgentFlow is also different from replacing board firmware.",
    guide: "automation",
  },
  {
    id: "flow-inputs",
    group: "assist",
    question: "Can I save a workflow and reuse it with different targets?",
    answer:
      "AgentFlow supports named workflows with runtime inputs, steps, timeouts and branches. Ask the expert to save and inspect the definition, then run it with explicit inputs and agent context. Confirm each returned step rather than assuming a saved flow has already run.",
    guide: "automation",
  },
  {
    id: "flow-failure",
    group: "assist",
    question: "What happens when one workflow step fails?",
    answer:
      "The outcome depends on the saved flow’s branches, timeouts and error handling. Ask for failed-step output and inspect the definition. Do not interpret a final summary as evidence that every step succeeded; design a branch that reports failure clearly when creating the workflow.",
    guide: "automation",
  },
  {
    id: "camera-protocol",
    group: "assist",
    question: "Which camera protocols can I use?",
    answer:
      "The Camera expert supports still capture from reachable RTSP streams and ONVIF cameras on capable agents. Supply protocol, address and port; it asks for required missing credentials. Native tooling and camera implementation affect availability.",
    guide: "cameras",
  },
  {
    id: "camera-network",
    group: "assist",
    question: "Why can the assistant not reach my camera?",
    answer:
      "Make sure the selected agent is on a network that reaches it, the protocol/port are correct and authentication is valid. Your browser seeing the camera does not establish agent reachability. Inspect capture errors and required native dependencies such as media tooling.",
    guide: "cameras",
  },
  {
    id: "camera-video",
    group: "assist",
    question:
      "Does camera analysis record continuous video or detect every event?",
    answer:
      "The supported workflow captures and analyses a still image. It is not continuous recording or a guaranteed detection system. A snapshot shows one moment and viewpoint, and image quality, lighting and occlusion affect interpretation.",
    guide: "cameras",
  },
  {
    id: "docker-state",
    group: "manage",
    question: "Why does the Docker agent need a persistent state volume?",
    answer:
      "It retains agent state across container replacement and can hold buffered observations. Preserve the volume when updating. Removing it can lose registration or stored observations; restarting a container with its existing volume is different from setting up a completely new agent.",
    guide: "linux",
  },
  {
    id: "docker-authorise",
    group: "manage",
    question: "Where do I find the Linux agent’s authorisation code?",
    answer:
      "The Linux/Docker agent has no graphical setup interface. Start it and run docker logs -f processor (or use your actual container name). Find its HTTPS authorisation URL and user code, copy the complete URL into a browser on your computer or phone, sign in and approve the device. Enter the printed code if requested. Leave the agent running, return to its logs and wait for successful authorisation and registration. Then sign into the dashboard with the same account and select its location.",
    guide: "linux",
  },
  {
    id: "docker-update",
    group: "manage",
    question: "How do I update the Docker agent?",
    answer:
      "From the Compose directory, pull the configured image and recreate the service while preserving its state volume. The guide uses docker compose pull followed by docker compose up -d. Check logs and fresh host readings afterwards; do not erase state just to update the image.",
    guide: "linux",
  },
  {
    id: "docker-localhost",
    group: "manage",
    question:
      "Why can the container not reach a service I can reach on my computer?",
    answer:
      "The container has its own networking environment. Localhost normally refers to the container, and Docker Desktop/host routing can differ from native access. Use an address reachable from inside the agent and inspect the actual network configuration rather than assuming browser reachability proves container reachability.",
    guide: "linux",
  },
  {
    id: "docker-architecture",
    group: "manage",
    question: "Can I run the container on an ARM machine?",
    answer:
      "The processor has amd64/x64 and arm64 build paths, but check the currently published image’s architecture support for your hardware. A build path in source is not proof that a particular tag includes your architecture. Use the supported image and installed dependencies for that platform.",
    guide: "linux",
  },
  {
    id: "windows-authorise",
    group: "manage",
    question: "I logged into the app. Why is my PC not a monitor location?",
    answer:
      "The local agent also needs to be enabled and authorised to the same account as the website. Complete device authorisation and confirm registration in app/configuration state. An app login alone does not establish a running agent that can receive recurring checks.",
    guide: "windows",
  },
  {
    id: "windows-sleep",
    group: "manage",
    question: "Will my Windows agent monitor while the PC sleeps?",
    answer:
      "A sleeping or powered-off processor cannot reliably perform scheduled checks. Keep the machine awake, powered and connected for continuous use. Buffered uploads are useful after network outages, but they cannot recreate observations missed while the machine was not running.",
    guide: "windows",
  },
  {
    id: "windows-discovery",
    group: "manage",
    question:
      "Does local network discovery automatically monitor every device?",
    answer:
      "Discovery helps identify targets and direct checks. Verify that the desired recurring host has actually been added, enabled and assigned to a location. Finding a device once is different from configuring ongoing observations and alerts.",
    guide: "windows",
  },
  {
    id: "android-permissions",
    group: "manage",
    question: "Which permissions matter for Android BLE scanning?",
    answer:
      "Grant requested Bluetooth/nearby-device permissions and enable Bluetooth. Some Android versions also need location-related permission/settings for scanning. Permission requirements vary by OS version; follow the app’s requests and inspect discovery before assuming a decoder or key is wrong.",
    guide: "android",
  },
  {
    id: "android-browser",
    group: "manage",
    question: "Why can I not use rendered-page and crawl checks on Android?",
    answer:
      "The current Android platform policy disables browser automation endpoints, including httpfull, sitehash, crawlsite, dailycrawl, dailyhugkeepalive and hugwake, and related browser commands. Choose a browser-capable Linux or Windows agent for those tasks.",
    guide: "android",
  },
  {
    id: "android-always-on",
    group: "manage",
    question: "Can I use an old Android phone as a permanent monitor?",
    answer:
      "It can be useful for supported local and BLE checks, but battery saving and background restrictions can delay work. Keep it powered and review background settings. For predictable unattended operation, consider a stable Linux/Windows host or a compatible dedicated board.",
    guide: "android",
  },
  {
    id: "board-model",
    group: "manage",
    question: "Will the firmware work on any ESP32 board?",
    answer:
      "The documented target is ESP32-S3 N16R8 with 16 MB flash and 8 MB octal PSRAM. Other memory layouts and targets are not interchangeable. Check the physical board guide and release assets before flashing and use a USB data cable.",
    guide: "esp32",
  },
  {
    id: "board-wifi",
    group: "manage",
    question: "Can the board join a 5 GHz-only Wi-Fi network?",
    answer:
      "The documented ESP32-S3 setup uses 2.4 GHz Wi-Fi. Provide a compatible network during USB setup. If registration or uploads fail, check power, signal, credentials and network access before concluding that host checks or BLE decoding are broken.",
    guide: "esp32",
  },
  {
    id: "board-factory",
    group: "manage",
    question: "Should I factory-flash an enrolled board to update it?",
    answer:
      "Use Profile → Device firmware for normal updates of an enrolled processor. Factory installation erases flash and is intended for new-board setup. Use the physical board guide for recovery when needed, and distinguish recovery from a routine firmware update.",
    guide: "esp32",
  },
  {
    id: "board-ota-status",
    group: "manage",
    question: "How do I know an ESP32 update has finished?",
    answer:
      "Inspect the firmware operation’s status and confirm the board returns to normal communication and fresh readings. Selecting an image is not itself proof of installation. Use the signed update/recovery workflow and project instructions if an update fails or rollback occurs.",
    guide: "esp32",
  },
  {
    id: "board-no-readings",
    group: "manage",
    question: "My board is online but one host fails. What should I check?",
    answer:
      "Verify the host’s endpoint is supported, its address/port/Args are correct and the board can reach it. BLE needs radio proximity and a valid format/key. Processor communication does not establish successful target checks; inspect the host’s own returned status.",
    guide: "esp32",
  },
  {
    id: "email-verify",
    group: "manage",
    question: "Why do I need to verify my email?",
    answer:
      "Alert and report delivery rely on a verified address and enabled notification preferences. Check both in Profile, then inspect spam and host alert state if delivery is missing. Verifying an address does not reset an already notified host alert.",
    guide: "account",
  },
  {
    id: "change-email",
    group: "manage",
    question: "What should I check after changing my email address?",
    answer:
      "Review the profile’s address and verification state and complete any requested verification. Check notification preferences and delivery to the new inbox. Do not assume an unverified replacement has the same delivery state as the previous address.",
    guide: "account",
  },
  {
    id: "passkey-manage",
    group: "manage",
    question: "Can I use and remove passkeys?",
    answer:
      "Available profile controls support registering, listing and deleting passkeys. Retain a working authentication method when removing a credential. A passkey is an account sign-in credential, not a Bluetooth advertisement key or an agent’s device-authorisation code.",
    guide: "account",
  },
  {
    id: "cancel-plan",
    group: "manage",
    question: "How do I manage or cancel a paid subscription?",
    answer:
      "Open Profile → View Subscription and use the provided plan/billing control to reach the customer portal for an existing subscription. Review the billing terms and confirmation there. Contact support if the portal or account access is unavailable.",
    guide: "account",
  },
  {
    id: "plan-capabilities",
    group: "manage",
    question: "Does a paid plan make every endpoint work on every platform?",
    answer:
      "No. Entitlement is one requirement; the agent still needs the implementation, dependencies, network access and hardware. For example, a subscription does not give ESP32 a desktop browser or make Linux live BLE capture implemented. Compare platform support separately from plan allowances.",
    guide: "account",
  },
  {
    id: "retention",
    group: "manage",
    question: "How much history can I keep?",
    answer:
      "Use the current Subscription page for your plan’s retention and allowances. Actual history also depends on collection and archive availability. The chart’s 90-day request limit is a query limit, not a promise of retained observations for every account.",
    guide: "account",
  },
  {
    id: "remove-agent",
    group: "manage",
    question: "What should I do before removing a registered processor?",
    answer:
      "Identify the device and hosts assigned to its location. Reassign or disable affected configurations as appropriate, then use processor management to remove the registration. Do not assume removing a device automatically provides another location with equivalent network or BLE access.",
    guide: "account",
  },
  {
    id: "appearance",
    group: "manage",
    question: "Can I switch between light, dark and system appearance?",
    answer:
      "Use the appearance control in the website header. System mode follows your device preference; explicit light/dark overrides it. The responsive site supports both themes for guides and monitoring views. Appearance does not change readings or alert conditions.",
    guide: "account",
  },
  {
    id: "sharing",
    group: "manage",
    question: "Can I assume everyone in my team sees my hosts?",
    answer:
      "Do not assume team sharing or shared account visibility from an example or a plan name. Access follows the implemented account ownership and available controls. If you need a team workflow, ask support about currently supported arrangements rather than sharing credentials.",
    guide: "account",
  },
  {
    id: "secrets-chat",
    group: "manage",
    question: "Should I paste credentials or encryption keys into chat?",
    answer:
      "Prefer a dedicated credential field when one exists, such as a host’s Password / Key. Some tool workflows may ask for required authentication details. Review the privacy policy first and provide only what the task needs; interactions are logged and chosen providers may process supplied information.",
    guide: "account",
  },
  {
    id: "data-deletion",
    group: "manage",
    question: "How do I request help with account data or privacy?",
    answer:
      "Read the Privacy and Security & Compliance pages for current handling and contact support for account-data requests. Deleting one visible host or chat is not a universal guarantee about backups, logs or provider retention. Specify the account-data request without unnecessary secrets.",
    guide: "account",
  },
  {
    id: "agent-not-listed",
    group: "manage",
    question: "Why is my new agent missing from the location list?",
    answer:
      "Confirm it completed device authorisation for the same account, is enabled and has communicated successfully. Refresh available locations after registration. Inspect logs or app configuration for authorisation/upload errors; a started process without completed registration is not yet a usable location.",
    guide: "troubleshooting",
  },
  {
    id: "old-reading",
    group: "manage",
    question: "Why is the newest reading older than expected?",
    answer:
      "Check whether the agent is running, the host is enabled, skip cycles or daily scheduling apply, and uploads are succeeding. A displayed last-known value is not evidence of a fresh measurement. Read its timestamp and inspect status or logs before interpreting it as current.",
    guide: "troubleshooting",
  },
  {
    id: "wrong-units",
    group: "manage",
    question: "A host is showing the wrong unit. What should I check?",
    answer:
      "Inspect endpoint, Args and selected metric, then confirm that the expected metadata is displayed. Avoid applying manual conversion to supported sensor readings. If the configuration or software changed, report the exact selector, unit and status to support without disclosing its key.",
    guide: "troubleshooting",
  },
  {
    id: "backlog-full",
    group: "manage",
    question: "Can an agent stop checking while it still appears connected?",
    answer:
      "A full stored-observation backlog can pause new checks to protect buffered data. A connected agent can also have disabled hosts, long jobs or unavailable dependencies. Inspect upload state and logs; processor communication alone does not prove each host is being sampled.",
    guide: "troubleshooting",
  },
  {
    id: "support-details",
    group: "manage",
    question: "What information makes a useful support request?",
    answer:
      "Include the platform/app, endpoint or command, selected monitor location, affected host identifier, relevant times/timezone and returned error. Describe expected versus observed behaviour. Omit passwords, encryption keys, active authorisation codes and unrelated personal information.",
    guide: "troubleshooting",
  },
  {
    id: "headless-enrolment",
    group: "manage",
    guide: "platforms",
    question: "How do I enrol an agent that has no screen or user interface?",
    answer:
      "Linux/Docker and ESP32 print device-authorisation instructions in their logs instead of offering an Authorize button. Read the container/service log or USB serial console, open its printed URL in a browser, sign in and approve. Enter the accompanying user code if the page requests it. Return to the agent log to confirm registration, then use the same account on the dashboard. You can use a browser on a different computer or phone.",
  },
  {
    id: "esp32-authorise",
    group: "manage",
    guide: "esp32",
    question: "Where do I find the ESP32 authorisation URL and code?",
    answer:
      "After first installation, open the board’s USB serial console at 115200 baud and complete the 2.4 GHz Wi-Fi prompts. Find nm_enrollment: Sign in at in the serial log. Copy only the HTTPS URL into a browser, excluding the trailing ; code ... text. Sign in and approve; enter the short serial-log code if requested. Keep the board powered and the console open, then wait for successful registration and ESP32_S3_MQTT_READY.",
  },
  {
    id: "esp32-serial-console",
    group: "manage",
    guide: "esp32",
    question: "How do I open the ESP32 setup log?",
    answer:
      "Use a USB data cable and the serial port used to flash your board. With the Python serial tools from the physical-board guide, run python -m serial.tools.miniterm /dev/ttyACM0 115200, replacing the port with your actual device, such as /dev/ttyUSB0, COM3 or a macOS /dev/cu.usbmodem port. The serial console shows Wi-Fi prompts and browser-authorisation instructions. Close it before flashing and reopen afterwards.",
  },
  {
    id: "enrolment-browser-device",
    group: "manage",
    guide: "platforms",
    question:
      "Must I open the authorisation browser on the machine running the agent?",
    answer:
      "No. For Linux/Docker or ESP32, you can read its logs and open the printed device-authorisation URL in a browser on another computer or phone. Use the URL and code from that specific running agent, keep it running during approval and sign in with the account you want to own its monitor location.",
  },
  {
    id: "enrolment-expired-code",
    group: "manage",
    guide: "troubleshooting",
    question: "What do I do if the enrolment code expires?",
    answer:
      "Use a newly issued URL and code rather than retrying the expired one. On ESP32, restart the board and follow its serial prompts to obtain a fresh request; it resumes its saved setup stage. On Linux/Docker, watch for a fresh request in the log and restart the container normally if necessary, preserving its state volume. Do not factory-erase the board or delete container state just to retry authentication.",
  },
  {
    id: "enrolment-browser-confirmation",
    group: "manage",
    guide: "troubleshooting",
    question: "The browser says approved. Is enrolment finished?",
    answer:
      "Browser approval is only one part of the flow. Return to the Linux/Docker or ESP32 log and confirm that the agent completed registration. On ESP32, also wait for ESP32_S3_MQTT_READY. If it is missing, inspect connection or registration errors. Refresh available locations on the dashboard using the same account, then assign an enabled host to the newly registered processor.",
  },
  {
    id: "enrolment-url-copy",
    group: "manage",
    guide: "troubleshooting",
    question:
      "Should I copy the whole authorisation log line into the browser?",
    answer:
      "Copy the complete HTTPS URL, including its query parameters, but exclude the log prefix and any explanatory text after it. ESP32 prints a line beginning nm_enrollment: Sign in at and may append ; code ... after the URL. Use that short code only if the page requests it. Always use the URL from your current agent, not a sample URL or another device’s code.",
  },
];
