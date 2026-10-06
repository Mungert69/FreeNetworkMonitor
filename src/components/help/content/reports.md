## Emailed host reports

Scheduled reports summarise your monitored hosts with successful/failed observations, measurement summaries and graphs. The report schedule and availability follow the service/account configuration; normal service reports are presented as weekly summaries.

Verify email and enable notifications in [Profile](/docs/account/). If a report has no data, check whether the host had available readings during its period and whether its agent was running.

## Understand measurements in a report

Read each host in its own unit. A voltage plot is in volts, current in amps and a timing check in milliseconds. Negative physical readings can be valid. Missing observations are not zeros.

Timing categories such as Excellent/Good are only used for eligible duration measurements with defined rating boundaries. A scan’s elapsed time or a sensor value does not inherit a normal ping’s performance category.

## AI analysis

When AI report analysis is enabled, the assistant receives actual readings, timestamps, units, measurement descriptions and appropriate analysis guidance. It also receives configured low/high limits. Its recommendations should be interpreted in the context of that host and period.

This lets it discuss a voltage trend differently from a latency trend. It should not invent safe battery temperatures or universal current limits when none were supplied. AI commentary is an interpretation of the observations, not proof of root cause or an equipment safety certification.

You can ask the [assistant](/docs/assistant/) to explain a particular host’s trend, status or limit breach and then compare it with the [chart](/docs/charts/).

## Host and report JSON downloads

Where a host/report result offers a JSON download, its measurement output contains actual values and units, observation timestamps/statuses and unavailable readings as `null`. These values should be read directly; do not apply another scale conversion.

For example, a current value of `-1.1` with unit `A` represents negative current. A null reading is unavailable. This is different from the full profile archive below.

## Full account archive

In **Profile**, use **Generate Data Download** to prepare the full stored-data archive. Download it when the ready link appears. This is a compressed stored-record backup, not the same ready-to-use physical-value format as host/report JSON.

The archive currently preserves encoded readings and may not carry the resolved display metadata for every measurement. Use the website, reports or host measurement JSON to read physical values. Do not assume archive numbers are milliseconds or volts without the matching measurement definition.

Available history depends on your [plan retention](/subscription/), collection and archiving state. A download does not recover observations that were never collected while an agent was off. For missing coverage, see [troubleshooting](/docs/troubleshooting/).
