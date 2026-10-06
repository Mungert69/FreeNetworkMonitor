## View and edit your host table

Use the [dashboard](/dashboard) viewing table to compare status, readings and counts. Search/filter hosts, sort columns and use **Table options → Columns** to add available fields such as endpoint, location, args and limits. Your table preferences are saved locally. Hover long text to read it fully.

Switch to **Edit hosts** to add, enable/disable or remove a monitor. Open edit details for timeout, credentials/key, Args, skip cycles and low/high limits. Save changes before returning to view. Low/high limits and skip cycles live in the details dialog so the main edit table stays compact.

## Open a host chart

Use the host’s chart control. The chart includes its reading unit, summaries and history. **Show details** expands above the plot with endpoint/configuration and monitor location. You can use full-screen view when you need more room.

A monitor location tells you where the checks run. A gap in readings does not by itself establish when an agent was online; inspect actual observations and agent status separately.

## Datasets and time ranges

**Selected dataset** shows one collection of readings, with previous/next dataset navigation. **Time range** selects observations across datasets:

- Last hour
- Last 24 hours
- Last 7 days
- Last 30 days
- Custom From/To, up to 90 days

Custom inputs use your local time; the website sends explicit UTC instants. A range includes its start and excludes its end. The same observation can display a different clock time in another timezone. Alert timestamps use UTC.

## Summaries and long ranges

Range summaries use all available readings within the chosen period, not just visible chart dots. Successful values contribute to mean/minimum/maximum; failed observations are counted separately.

For long periods, the range chart retains up to 960 representative points across 160 time buckets: first, last, minimum, maximum and first/last failure where present. That keeps the chart readable and preserves extrema, but does not display every individual failure or brief event. A shorter range gives you more detail.

Archived datasets that cannot be read by this chart are noted. Their missing samples are excluded from statistics. A retention allowance does not mean every archived point is loaded in every view. A range spanning a changed metric/configuration is not a reliable like-for-like comparison; choose a period using one measurement definition.

## Failure and limit markers

**Red downward arrows below the horizontal axis** mark failed observations. They sit away from the measurement line so failures do not distort your response/voltage scale.

**Coloured, outlined points** indicate readings outside a configured low or high limit, with reference lines and explanatory tooltips. Colours use your current limits, including on historical data. Changing a limit changes that historical colouring. It does not change past readings or identify the exact point that caused a historical alert notification.

Negative physical values remain valid points. No reading/unavailable is different from `0` and from a negative current. See [Bluetooth measurements](/docs/sensors/) and [alerts](/docs/alerts/).

## New data without losing your place

The background refresh preserves the period you are viewing. If your view includes the latest collecting dataset, a **New data available** indicator lets you load updates when you choose. A fixed historic period is not replaced by the newest data.

If you see no readings, check the time range, host enablement, location, agent and any archived-coverage notice. Follow [troubleshooting](/docs/troubleshooting/#a-chart-says-there-is-no-data). For summaries you can share, use [reports and downloads](/docs/reports/).
