import { extraFaqItems } from "./faq-extra.mjs";
// Customer-facing navigation. Content lives in Markdown; reuse these IDs in links.
export const groups = [
  {
    id: "start",
    title: "Start monitoring",
    description:
      "Your first monitor, the right agent and the checks that matter.",
    icon: "monitor",
  },
  {
    id: "observe",
    title: "Understand your readings",
    description: "Measurements, alerts, charts and reports in one place.",
    icon: "chart",
  },
  {
    id: "assist",
    title: "Work with the assistant",
    description: "Diagnostics, quantum checks and automation with guidance.",
    icon: "assistant",
  },
  {
    id: "manage",
    title: "Manage your setup",
    description: "Install, authorise and look after your agents and account.",
    icon: "agent",
  },
];

export const guides = [
  {
    slug: "getting-started",
    group: "start",
    title: "Your first monitor",
    summary:
      "Add a website or local device, choose where to check it and see your first results.",
    platforms: ["Website"],
    tags: "quick start host add edit enable location",
  },
  {
    slug: "endpoints",
    group: "start",
    title: "Choose a monitoring check",
    summary:
      "A practical reference to every built-in endpoint, from ping to quantum and BLE.",
    platforms: ["All agents"],
    tags: "icmp http https dns smtp rawconnect nmap sitehash configintegrity quantum ble",
  },
  {
    slug: "platforms",
    group: "start",
    title: "Choose an agent",
    summary:
      "Compare Linux, Windows, Android and ESP32, and decide where your checks should run.",
    platforms: ["All agents"],
    tags: "platform compatibility docker macos app local remote cloud",
  },
  {
    slug: "sensors",
    group: "observe",
    title: "Monitor Bluetooth sensors",
    summary:
      "Read Victron, Ruuvi and BTHome broadcasts with automatic units and selectable metrics.",
    platforms: ["Windows", "Android", "ESP32"],
    tags: "ble bluetooth victron ruuvi bthome shelly key aes password voltage current temperature",
  },
  {
    slug: "ble-metrics",
    group: "observe",
    title: "Bluetooth metric reference",
    summary:
      "Find the exact metric names and units for supported sensor broadcasts.",
    platforms: ["Windows", "Android", "ESP32"],
    tags: "ble victron ruuvi bthome metric battery_voltage battery_current pv_power humidity sensor",
  },
  {
    slug: "alerts",
    group: "observe",
    title: "Set up alerts",
    summary:
      "Understand failed checks, optional high and low limits, email delivery and resetting alerts.",
    platforms: ["Website", "All agents"],
    tags: "threshold limit high low email reset timeout notification down",
  },
  {
    slug: "charts",
    group: "observe",
    title: "Explore hosts and charts",
    summary:
      "Use table options, time ranges, status markers and expandable chart details.",
    platforms: ["Website"],
    tags: "history dataset archive chart sampling timezone points refresh columns filter",
  },
  {
    slug: "reports",
    group: "observe",
    title: "Reports and downloads",
    summary:
      "Read emailed summaries and AI analysis, and understand the two kinds of data download.",
    platforms: ["Website"],
    tags: "export archive download json summary weekly units report",
  },
  {
    slug: "assistant",
    group: "assist",
    title: "Use the AI assistant",
    summary:
      "Meet the experts, select your agent, use voice and return to saved conversations.",
    platforms: ["Website", "Windows", "Android"],
    tags: "llm ai turbo hug free test history voice audio memory stop cancel quota model",
  },
  {
    slug: "diagnostics",
    group: "assist",
    title: "Run diagnostic checks",
    summary:
      "Use Nmap, OpenSSL, BusyBox, search and guided Metasploit workflows.",
    platforms: ["Linux", "Windows", "Android", "ESP32"],
    tags: "security penetration metasploit metalive nmap openssl busybox search crawl ports command",
  },
  {
    slug: "quantum",
    group: "assist",
    title: "Check quantum readiness",
    summary:
      "Test post-quantum key exchange and certificates, and understand what the results mean.",
    platforms: ["All agents"],
    tags: "pqc tls kem mlkem mldsa certificate quantuminfo quantumcert quantumscan",
  },
  {
    slug: "automation",
    group: "assist",
    title: "Custom checks and workflows",
    summary:
      "Choose between a periodic Connect, a one-off command processor and a reusable AgentFlow.",
    platforms: ["Linux", "Windows", "Android"],
    tags: "custom code csharp connect commandprocessor agentflow automation dynamic schedule",
  },
  {
    slug: "cameras",
    group: "assist",
    title: "Inspect a camera snapshot",
    summary:
      "Capture an RTSP or ONVIF image and ask the Camera expert to help interpret it.",
    platforms: ["Capable agents"],
    tags: "camera rtsp onvif snapshot ffmpeg image analysis",
  },
  {
    slug: "linux",
    group: "manage",
    title: "Install the Linux / Docker agent",
    summary:
      "Run the agent in a persistent container, authorise it and assign your first local host.",
    platforms: ["Linux", "Docker"],
    tags: "install linux amd64 arm64 docker compose container macos",
  },
  {
    slug: "windows",
    group: "manage",
    title: "Install the Windows apps",
    summary:
      "Set up Network Monitor or Quantum Secure and use your PC as a local agent.",
    platforms: ["Windows"],
    tags: "install windows microsoft store quantumsecure authorise",
  },
  {
    slug: "android",
    group: "manage",
    title: "Install the Android apps",
    summary:
      "Set up a phone or tablet, grant Bluetooth permissions and understand background limits.",
    platforms: ["Android"],
    tags: "install play phone tablet battery background bluetooth permissions",
  },
  {
    slug: "esp32",
    group: "manage",
    title: "Set up an ESP32-S3",
    summary:
      "Install Live firmware, join Wi-Fi, authorise your board and manage firmware updates.",
    platforms: ["ESP32"],
    tags: "install board firmware ota rollback wifi usb factory update n16r8",
  },
  {
    slug: "account",
    group: "manage",
    title: "Account and agent management",
    summary:
      "Manage email, passkeys, subscriptions, registered processors and privacy preferences.",
    platforms: ["Website"],
    tags: "profile account passkey plan tokens retention email processor delete security privacy",
  },
  {
    slug: "troubleshooting",
    group: "manage",
    title: "Troubleshoot your setup",
    summary:
      "Find missing readings, diagnose unavailable checks and get alerts flowing again.",
    platforms: ["All agents"],
    tags: "offline no data missing unavailable disabled logs timeout failed troubleshooting",
  },
];

export const platformLinks = {
  linux: "/docs/linux",
  windows: "/docs/windows",
  android: "/docs/android",
  esp32: "/docs/esp32",
};

export const downloads = {
  windowsAgent: "https://www.microsoft.com/store/apps/9P58PM1PM9TZ",
  windowsQuantum: "https://www.microsoft.com/store/apps/9NXT248W9NR6",
  androidAgent:
    "https://play.google.com/store/apps/details?id=click.freenetworkmonitor.networkmonitormaui",
  androidQuantum:
    "https://play.google.com/store/apps/details?id=click.freenetworkmonitor.quantumsecure",
  firmware:
    "https://github.com/Mungert69/NetworkMonitorProcessorAgentEmbedded/releases/latest",
  boardSetup:
    "https://github.com/Mungert69/NetworkMonitorProcessorAgentEmbedded/blob/main/docs/first-physical-board.md",
};

const coreFaqItems = [
  {
    id: "support",
    group: "manage",
    question: "How do I contact support?",
    answer:
      "Email support@readyforquantum.com with your platform, affected check and returned error. Keep passwords, keys and personal data out of your message unless a support process specifically requests them.",
    href: "mailto:support@readyforquantum.com",
    linkLabel: "Email support",
  },
  {
    id: "first-host",
    group: "start",
    question: "How do I add a website or a local device?",
    answer:
      "Sign in to the dashboard, switch to Edit hosts and add a host. Choose its address, endpoint and monitor location, enable it and save. Private addresses need an agent on that network.",
    guide: "getting-started",
  },
  {
    id: "agent-choice",
    group: "start",
    question: "Do I need to install an agent?",
    answer:
      "Use an available service-provided monitor location for a public target. Install a local agent for private devices, local diagnostics or Bluetooth broadcasts. Your available locations and features depend on your account and the selected agent.",
    guide: "platforms",
  },
  {
    id: "app-choice",
    group: "start",
    question:
      "What is the difference between Network Monitor and Quantum Secure?",
    answer:
      "Both apps can host an authorised local agent, show monitored hosts and open the assistant. Quantum Secure also provides dedicated single-host checks, local network discovery and a logs view. Choose the app and platform that fit your workflow.",
    guide: "platforms",
  },
  {
    id: "endpoint-choice",
    group: "start",
    question: "Why is an endpoint missing or disabled?",
    answer:
      "Endpoint choices follow the selected agent’s capabilities and your account. Browser automation is restricted on Android, ESP32 has a fixed subset, and Linux does not currently scan live BLE advertisements. Custom Connects are available only where deployed.",
    guide: "endpoints",
  },
  {
    id: "sensor-value",
    group: "observe",
    question: "How do I choose a Bluetooth reading?",
    answer:
      "Choose blebroadcast, enter the device address, then set Args to a supported format and metric, such as --format victron --metric battery_voltage. Enter the advertisement key in Password / Key when needed. Units and conversion are automatic.",
    guide: "sensors",
  },
  {
    id: "negative",
    group: "observe",
    question: "Is a negative current or temperature a failure?",
    answer:
      "No. A negative physical reading can be valid. Failed or missing readings are shown separately as unavailable observations. Read the unit and status together.",
    guide: "sensors",
  },
  {
    id: "limits",
    group: "observe",
    question: "How do I alert on voltage, temperature or another measurement?",
    answer:
      "Open the host’s edit details and set a Low alert limit, a High alert limit, or both, in the displayed unit. Leave a limit empty to disable it. If both are set, low must be less than high. Timeout controls how long a check can run; it is not a measurement limit.",
    guide: "alerts",
  },
  {
    id: "email",
    group: "observe",
    question: "Why am I not receiving alert emails?",
    answer:
      "Verify your email and enable email notifications in your profile. Check spam and whether the host’s alert has already been sent. An alert is sent once until you reset it; the failure trigger is configured, not a universal fixed count.",
    guide: "alerts",
  },
  {
    id: "reset",
    group: "observe",
    question: "Why did I only receive one alert?",
    answer:
      "The alert remains latched after notification. Reset it from the host’s alert control when you want to allow another notification. Monitor and predictive alerts have separate reset controls.",
    guide: "alerts",
  },
  {
    id: "range",
    group: "observe",
    question: "Can I see the last hour, day or week?",
    answer:
      "Open a host chart and choose its Time range. You can select the last hour, 24 hours, 7 days, 30 days or a custom period of up to 90 days. The selected range is preserved when new data arrives.",
    guide: "charts",
  },
  {
    id: "chart-markers",
    group: "observe",
    question: "What do the red arrows and coloured chart points mean?",
    answer:
      "Red downward arrows below the axis mark failed observations. Coloured measurement points show violations of the current high or low limit. They are not a historical record of which observation sent an alert.",
    guide: "charts",
  },
  {
    id: "timezone",
    group: "observe",
    question: "Why do times change when I view data elsewhere?",
    answer:
      "The website displays times in your browser’s local timezone and sends explicit UTC times for range requests. Alert timestamps use UTC. The same observation can therefore have a different displayed local time.",
    guide: "charts",
  },
  {
    id: "reports",
    group: "observe",
    question: "What do reports and data downloads contain?",
    answer:
      "Reports summarise your hosts and can include charts and AI analysis in the correct units. Host/report JSON contains actual values. The full profile archive is a separate stored-data backup and should not be treated as the same ready-to-use measurement format.",
    guide: "reports",
  },
  {
    id: "ai-actions",
    group: "assist",
    question: "Can the assistant actually change hosts or run a check?",
    answer:
      "Yes. It can call host-management functions and ask specialist experts to run supported diagnostics on your chosen agent. Look for a completed function result: advice or an example response is not evidence that a task ran.",
    guide: "assistant",
  },
  {
    id: "plan",
    group: "assist",
    question: "Which plan, host allowance and token limits apply?",
    answer:
      "The Subscription page shows the current plan allowances, prices and features. Available tools also depend on your agent and installed dependencies. We keep plan figures there so they stay current.",
    href: "/subscription",
    linkLabel: "Compare current plans",
  },
  {
    id: "quantum",
    group: "assist",
    question:
      "Does a successful quantum check mean everything is quantum-safe?",
    answer:
      "It establishes the tested property for that service and algorithm set. A post-quantum key exchange and a post-quantum certificate are different checks. Neither certifies all ports, applications or other cryptographic dependencies.",
    guide: "quantum",
  },
  {
    id: "custom",
    group: "assist",
    question: "Can I create my own checks or workflows?",
    answer:
      "Ask the Connect expert for a recurring monitor, the Command Processor expert for a one-off task, or the AgentFlow expert for a reusable multi-step workflow. The selected agent and your plan must support the task. Review generated code before deploying it.",
    guide: "automation",
  },
  {
    id: "metasploit",
    group: "assist",
    question: "Why can’t I run Metasploit from this agent?",
    answer:
      "Metasploit needs a capable Linux or Windows agent and the required account entitlement. Windows requires a separate framework installation. Android and ESP32 do not provide Metasploit execution.",
    guide: "diagnostics",
  },
  {
    id: "camera",
    group: "assist",
    question: "Can the assistant look at an IP camera?",
    answer:
      "The Camera expert can capture a still from a reachable RTSP or ONVIF camera on a capable agent and help interpret it. Supply the camera protocol, location and credentials when required. This is snapshot analysis, not continuous video recording.",
    guide: "cameras",
  },
  {
    id: "android",
    group: "manage",
    question: "Why does my Android agent check less often in the background?",
    answer:
      "Android battery saving and background restrictions can delay polling, especially when unplugged. Keep the device powered for continuous use and check its background settings. Use Linux/Docker, Windows or a dedicated board when you need a more predictable always-on setup.",
    guide: "android",
  },
  {
    id: "offline",
    group: "manage",
    question: "What happens when my agent loses its connection?",
    answer:
      "A running agent can retain observations while disconnected and upload them after reconnecting, within its buffer/storage limits. An agent that is powered off cannot take readings. A full backlog can pause new checks rather than losing stored data.",
    guide: "troubleshooting",
  },
  {
    id: "esp32-update",
    group: "manage",
    question: "How do I update an already registered ESP32?",
    answer:
      "Use Profile → Device firmware to select an available image and request the update. Factory installation is for a new board and erases flash; it is not the normal update procedure for an enrolled processor.",
    guide: "esp32",
  },
  {
    id: "privacy",
    group: "manage",
    question: "What should I know about assistant privacy?",
    answer:
      "LLM interactions are logged under the service’s security policy, and selected model providers may process submitted information. Avoid pasting secrets into chat. Read the Privacy and Security & Compliance pages for current policies and contact support for account-data requests.",
    guide: "account",
  },
];

export const faqItems = [...coreFaqItems, ...extraFaqItems].sort(
  (a, b) =>
    groups.findIndex((g) => g.id === a.group) -
    groups.findIndex((g) => g.id === b.group),
);

export function filterGuides(query, group = "all") {
  const terms = query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  return guides.filter(
    (guide) =>
      (group === "all" || guide.group === group) &&
      terms.every((term) =>
        `${guide.title} ${guide.summary} ${guide.tags} ${guide.platforms.join(" ")}`
          .toLowerCase()
          .includes(term),
      ),
  );
}

export function headingId(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}
