## Start with a goal and an agent

Open the assistant from the website or supported app. Choose an available model and, for a local task, your agent location. Say what you want to achieve, which target to use and where the task should run. The browser is your control surface; your chosen agent performs network checks.

For example: “Using my home agent, add a DNS monitor for example.com. Show me the available endpoints first.” For a sensor, include its format and metric; see [Bluetooth setup](/docs/sensors/).

Available models, experts, token allowances and commands depend on your [plan](/subscription/), service configuration and [agent capabilities](/docs/platforms/). The model selector can offer hosted models and a local/TestLLM route. A model name is not a guarantee that every tool is available.

## Meet the experts

| Expert | What you can ask it to do |
| --- | --- |
| Monitor | List, add and edit hosts; retrieve readings; discover available endpoints; reset alerts. |
| Security | Run Nmap and OpenSSL checks and retrieve relevant security references. |
| Penetration | Find Metasploit modules, read module information and run a scoped test on a capable agent. |
| Live penetration | Work through a persistent Metasploit console session. |
| Quantum | Test key exchange and certificates, scan services and explain algorithm information. |
| Search | Search the web, crawl pages and retrieve information. |
| Command Processor | Inspect, run and manage one-off command modules. |
| Connect | Inspect and manage recurring monitoring checks. |
| AgentFlow | Save and run multi-step workflows with inputs and branches. |
| Camera | Capture an RTSP or ONVIF still and interpret it with your question. |
| Memory | Recall relevant saved conversation turns and their surrounding context. |

The assistant can also retrieve account and agent information, inspect operation status, cancel supported work and run supported BusyBox tasks. Its knowledge retrieval includes service help, security and quantum references, MITRE material and indexed articles. References help ground an answer; check their relevance and freshness.

## Read the result, not just the reply

A suggested command or example is not evidence of execution. Look for the returned function result, target and agent. If a host was added, check it in [the dashboard](/dashboard). If a diagnostic failed, ask for the returned error rather than accepting an invented explanation.

For timing measurements, analysis may include the endpoint’s timing ratings. Physical measurements are interpreted using their units, measurement description and configured limits. There is no universal “excellent” voltage or temperature. See [reports](/docs/reports/) and [alerts](/docs/alerts/).

## Conversations, voice and stopping work

Replies stream as they are produced. Use history to reopen or delete saved conversations. Memory retrieval can help find earlier discussions without repeating everything in a new prompt. Local/TestLLM saved context can depend on the same server being available; a hosted conversation and a local model session are not interchangeable.

Use microphone controls where available to transcribe a spoken question. Optional spoken replies let you listen to answers. Browser or app microphone permission and the configured audio service are required.

Stop generation when you no longer need a reply. For an operation already running on an agent, ask to check its status or cancel it where cancellation is supported; stopping text generation alone does not establish that the operation stopped.

## Keep a task focused

Give the assistant the target, selected agent, intended outcome and relevant constraints. Review changes and generated code before use. Run security tests only on systems you own or have permission to test, following the [Acceptable Use Policy](/acceptable-use.html).

Assistant interactions are logged under the service policy, and model providers may process supplied information. Avoid putting secrets into conversation text. Read [account and privacy guidance](/docs/account/).

Next: [diagnostics](/docs/diagnostics/), [quantum checks](/docs/quantum/), [custom workflows](/docs/automation/) or [camera snapshots](/docs/cameras/).
