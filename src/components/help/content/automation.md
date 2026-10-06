## Choose the right kind of custom task

| You want… | Ask for… |
| --- | --- |
| A check that repeats and appears as a monitored host | A custom Connect. |
| A task you run when needed and inspect its output | A custom Command Processor. |
| A reusable sequence of expert tasks, inputs and decisions | An AgentFlow. |

Start by checking the built-in [endpoints](/docs/endpoints) and [diagnostic commands](/docs/diagnostics). You may already have the check you need.

## A custom Connect

The Connect expert can list existing Connects, inspect their source and add, update or remove custom definitions on capable .NET agents. Describe the target, success/failure condition and the measurement’s meaning and unit. Ask for a periodic check only when the result belongs in host history.

For example: “Create a recurring check for my device’s published temperature reading. The numeric value is degrees Celsius. Failed reads must be unavailable, not a temperature of zero. Show me the code and explain the host settings.”

The definition must supply appropriate measurement metadata so charts, limits and reports interpret the sample correctly. Adding a decoder for an arbitrary new encrypted sensor needs its protocol; a key alone is not sufficient. Existing BLE devices only need [format and metric selection](/docs/sensors).

## A custom command processor

The Command Processor expert can inspect source and help, run modules and manage custom processors. Describe inputs, required output, agent location and dependencies. A one-off command does not automatically create periodic host history or alerts.

Custom C# modules require a supported .NET agent. Generated code runs with the agent’s permissions and dependencies. Review the code and its target before deploying it; changing code is not a substitute for verifying a successful run. Built-in modules are not ordinary removable custom definitions.

## An AgentFlow

Ask the AgentFlow expert to save a named workflow with steps, runtime inputs, timeouts and branches. It can retrieve, list, run and remove saved flows. These workflows orchestrate expert tasks through the service; they are different from uploading firmware or adding a C# Connect.

A useful example is “Save a flow that checks DNS for a supplied host, runs a TLS check if DNS succeeds, and summarises both results. Use my chosen agent and return the failed step if something goes wrong.” Check the returned flow definition, then run it with explicit inputs.

## Availability and follow-through

Your plan, chosen agent and installed dependencies determine what can run. ESP32 uses its built-in firmware checks and does not load dynamic C# modules. Android restricts browser and native executable tasks. See the [platform comparison](/docs/platforms).

Confirm created hosts in [the dashboard](/dashboard), inspect workflow outputs, and use [troubleshooting](/docs/troubleshooting) for missing results. Learn more about [assistant operation status and cancellation](/docs/assistant).
