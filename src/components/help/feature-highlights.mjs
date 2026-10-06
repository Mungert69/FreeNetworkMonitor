// Shared by the Features UI and its readable build-time HTML.
export const featureIntro = {
  title: "Quantum readiness, security and AI network monitoring",
  summary: "Test post-quantum TLS support, investigate network security and keep watch over your services with guided AI diagnostics and agents running where you need them.",
};
export const featureHighlights = [
  {
    id: "quantum-readiness",
    title: "Prepare your services for the quantum era",
    description: "Find out what your services support today, understand the results and keep checking as your infrastructure changes.",
    cards: [
      { title: "Test post-quantum TLS", text: "Check whether a service can negotiate a post-quantum key exchange using the algorithms available to your agent. Run a check on demand or keep watching with the quantum endpoint.", href: "/docs/quantum", link: "Explore quantum readiness" },
      { title: "Inspect certificates separately", text: "Inspect post-quantum certificate properties with quantumcert. Understand the distinction between key exchange, certificate signatures and ordinary certificate trust.", href: "/docs/quantum#two-different-properties", link: "Understand the two checks" },
      { title: "Discover and investigate", text: "Use the Quantum expert to scan specified ports, explain algorithms and interpret results. Quantum Secure offers dedicated checks and local discovery on supported Windows and Android builds.", href: "/docs/platforms", link: "Choose your quantum tools" },
    ],
  },
  {
    id: "security-diagnostics",
    title: "Investigate your network’s security",
    description: "Bring network discovery, TLS inspection and guided security testing into one workflow, with checks running from your selected agent.",
    cards: [
      { title: "Discover hosts and services", text: "Use Nmap to inspect ports and services, and supported NSE scripts to investigate vulnerabilities. Agent capabilities determine which scans are available.", href: "/docs/diagnostics#network-and-tls-tools", link: "Explore network diagnostics" },
      { title: "Examine TLS and certificates", text: "Use OpenSSL diagnostics to inspect connections, certificates and TLS configuration. Ask the assistant to explain the output and help identify the next check.", href: "/docs/diagnostics", link: "Inspect your TLS configuration" },
      { title: "Guided penetration testing", text: "Work with the Penetration expert to find and configure Metasploit modules, or use the Live expert for a persistent console session. Available on suitably equipped Linux and Windows agents for systems you are authorised to test.", href: "/docs/diagnostics#guided-metasploit-work", link: "See supported security workflows" },
    ],
  },
  {
    id: "ai-monitoring",
    title: "Turn observations into informed action",
    description: "Combine continuous monitoring with an assistant that can help investigate a problem, explain the evidence and guide your next steps.",
    cards: [
      { title: "Work with specialist AI experts", text: "Use the assistant for monitoring, security and quantum questions. Ask it to run supported checks through your agent and explain results in plain English, with text or voice interaction.", href: "/docs/assistant", link: "Meet the assistant" },
      { title: "Keep checking between investigations", text: "Watch availability, response times and supported security checks. Configure alerts, review history and use reports to understand failures and changes over time.", href: "/docs/endpoints", link: "Compare monitoring checks" },
      { title: "Build repeatable workflows", text: "Use custom Connects, command processors and AgentFlow to extend supported agents and repeat useful diagnostic workflows. Choose the tools and account capabilities that suit your setup.", href: "/docs/automation", link: "Explore automation" },
    ],
  },
];
