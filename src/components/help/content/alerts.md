## Three different kinds of alert

**Availability alerts** describe failed checks. **Measurement-limit alerts** describe a valid value below or above an optional limit. **Predictive alerts** come from the configured anomaly pipeline. A device can respond successfully while its measurement is out of range.

Timeout is how long a check is allowed to run. Increasing it does not set a voltage or temperature alert boundary.

## Enable email delivery

1. Open **Profile** on the [dashboard](/dashboard).
2. Verify the account email address. Resend verification if needed and check spam.
3. Enable email notifications using the profile control.
4. Check that the host is enabled and assigned to a working [monitor location](/docs/platforms/).

Unsubscribing through an email disables email notifications. An alert shown in the table and an email being delivered are separate things.

## Availability alerts

The processor reports failed-check state and the alert service applies its configured trigger. There is not one fixed failure count that applies to every deployment. Look at the status: failure can mean no response, a certificate condition, a scan outcome or a decoding problem rather than simply “the server is powered off”.

For uptime monitoring, use an endpoint that answers the question you care about. Ping and TCP reachability may disagree because services and firewalls behave differently. See [endpoint meanings](/docs/endpoints/).

## Measurement limits

Open the host’s **edit details** and set **Low alert limit**, **High alert limit**, or both. Enter the actual displayed unit: `12.0` for a 12 V limit, not an encoded storage number. Blank means disabled. If both are set, low must be less than high.

For illustration, a voltage monitor with low `12.0` and high `14.8` alerts when a successful observation is below 12.0 V or above 14.8 V. Equality is not a violation. These example limits are not recommended limits for your battery: use the equipment’s documented operating range.

Missing/failed observations do not turn into physical-limit breaches. Valid negative readings are evaluated normally. Temperature, power, current and duration each need their own meaningful limits; the service does not invent safety boundaries for them.

Changing the selected endpoint/metric changes what a limit means. Review or clear old limits whenever you change the measurement.

## Reset an alert

An alert is notified once until reset. Use the host’s alert-reset control in the table or ask the [assistant](/docs/assistant/) to reset the relevant alert. Predictive alerts have their own reset control.

Resetting permits another notification if the condition happens again. It does not repair the target. Investigate the status and chart first; an ongoing condition can trigger again on subsequent checks.

## Predictive alerts and model settings

Where enabled for your account/setup, anomaly detection evaluates patterns in monitoring windows. It can identify unusual changes or spikes rather than simply comparing one sample to a fixed limit. It needs enough observations and its configured model services.

Advanced monitor-model configuration includes confidence, pretraining/window sizes and change/spike parameters. Change these only when you understand their effect; they are different from host low/high limits.

The current ML pipeline is latency-oriented. Do not assume it has been calibrated for every BLE sensor unit or that it guarantees advance prediction of outages. Use explicit measurement limits for a clear voltage/temperature boundary.

### Edit host model configuration

Keep **Use custom model configuration for this host** off to use the deployment defaults. With it enabled, blank numeric fields and **Inherit** logging selections still use defaults. Detector-specific settings take precedence over shared host settings. The editor retains the full set of tuning and developer diagnostic controls.

Saved changes are refreshed before the next prediction run; larger observation windows load available historical data or wait for enough new usable readings. An already-sent predictive alert keeps its detection results latched: reset the predictive alert to resume evaluation. Prediction runs follow the deployment schedule, not the Save button.

| Setting | Meaning |
| --- | --- |
| Change / Spike Confidence | Enter percentages, such as `60`, rather than `0.6`. Higher confidence is more conservative in ML.NET. TimesFM uses available central bands of 20%, 40%, 60%, and 80%, rounding down between them and capping above 80%. Values below 20% use a median band widened by the noise/minimum-width settings. Thus 90 and 99 differ in ML.NET but both use TimesFM’s 80% band. Historical fractional confidence values below 1 are read as percentages. |
| Change / Spike Pre-Train | History length for ML.NET. Initial unscored context length for TimesFM, not retraining its model. Use fewer observations than Predict Window. |
| Predict Window | Target historical usable observations for evaluation, not a future horizon. TimesFM forecasts one observation from each historical prefix and compares it with the observed reading. |
| Spike Detection Threshold | Minimum number of flagged observations in the evaluated batch required for a spike issue; not necessarily consecutive. |
| Run Length | TimesFM consecutive outside-band observations needed for persistence. |
| K of N (K/N) | TimesFM alternative persistence rule: at least K outside-band observations among the most recent N. Either this OR Run Length can satisfy persistence. K must not exceed N. |
| MAD Alpha | TimesFM background-noise multiplier added to each edge of the expected band. Larger values widen tolerance. |
| Min Band Abs / Rel | Minimum total expected-band width in raw measurement units (milliseconds for latency), or as a fraction of the forecast. `0.15` means 15%. |
| Roll Sigma Window | TimesFM prior observations used to estimate background noise. |
| Baseline Window | TimesFM prior observations used to calculate the median baseline. |
| Sigma Cooldown | TimesFM observation count for holding the noise estimate after confirmation. It is not a notification cooldown. |
| Min Relative Shift | TimesFM minimum change from the baseline, as a fraction: `0.20` means 20%. Increases and decreases can qualify. |

TimesFM settings have no effect in an ML.NET-only deployment. In hybrid mode, ML.NET must detect both a change and a spike, then TimesFM must confirm a change or spike. Outside hybrid mode, both primary detectors must report an issue for the final predictive alert. Adjusting a spike setting alone does not guarantee an alert.

### Developer diagnostics

These controls write to the prediction service logs at **Information** level. They do not download data to the browser. Use them to understand why observations were accepted, rejected, or close to an anomaly threshold.

| Control | Use |
| --- | --- |
| Sample Rows | Maximum diagnostic sample rows per detector and batch, spread across the batch including its ends. `1` logs the last scored observation; `0` disables samples while retaining the summary. Increase for more detail, subject to available scored observations. |
| Near Miss Fraction | Counts observations inside but close to a band edge. Distance to the edge is divided by the total band width; `0.10` means 10%. Useful for spotting borderline behaviour before changing sensitivity. Does not affect anomaly flags. |
| Log JSON | Choose JSON for structured analysis or Text for reading logs. Inherit preserves shared/server formatting. Does not enable detection or alter anomaly flags. |

The summary reports requested confidence, effective quantile band, outside-band count, confirmed flags, near misses, largest residual, minimum margin, cooldown and accumulated evidence. Sample rows expose observed and forecast values, band edges, noise estimate, persistence counts, baseline shift, gate decisions, and diagnostic scores. JSON records are suitable for extracting these fields with log-processing tools. Reported diagnostic p-values/evidence are algorithm outputs, not a guaranteed probability of a future outage.

Absolute widths and baseline shifts operate on the current latency-oriented input; they are not automatically calibrated for BLE sensor units. Notes describe a configuration; ID and update metadata do not affect detection.

## Find the condition on a chart

Red downward arrows show failed observations. Blue/amber-style violation points and reference lines show readings outside the **current** low/high limits. They show threshold violations, not a historical log of which point sent an email. Long ranges use representative points. See [chart interpretation](/docs/charts/#failure-and-limit-markers).

If emails or readings are missing, follow [troubleshooting](/docs/troubleshooting/) and review [account preferences](/docs/account/).
