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

## Find the condition on a chart

Red downward arrows show failed observations. Blue/amber-style violation points and reference lines show readings outside the **current** low/high limits. They show threshold violations, not a historical log of which point sent an email. Long ranges use representative points. See [chart interpretation](/docs/charts/#failure-and-limit-markers).

If emails or readings are missing, follow [troubleshooting](/docs/troubleshooting/) and review [account preferences](/docs/account/).
