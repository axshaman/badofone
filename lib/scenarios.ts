export const scenarioEnumValues = ["technical", "billing", "retention"] as const;

export type ScenarioKey = (typeof scenarioEnumValues)[number];

export interface ScenarioConfig {
  key: ScenarioKey;
  label: string;
  tagline: string;
  greeting: string;
  script: string[];
  disclaimers: string[];
}

const scenarioRegistry: Record<ScenarioKey, ScenarioConfig> = {
  technical: {
    key: "technical",
    label: "Technical outage",
    tagline: "Because rebooting fixes everything, right?",
    greeting:
      "👾 Technical support is now online. Please describe your obscure and impossible-to-reproduce issue.",
    script: [
      "Hi, my connection drops every 10 minutes.",
      "Yes, I already rebooted the router.",
      "No, I can't move my entire office closer to the modem.",
      "Is there a real person I can talk to?",
      "I'm going to switch providers."
    ],
    disclaimers: [
      "Response times may vary between 2 seconds and 6 business months.",
      "All solutions default to \"have you tried turning it off and on again?\"",
      "Escalations are printed and filed directly into the recycling bin."
    ]
  },
  billing: {
    key: "billing",
    label: "Billing dispute",
    tagline: "The customer is always...overcharged.",
    greeting:
      "👾 Welcome to Badofone billing. Refunds are theoretically possible, but let's not get carried away.",
    script: [
      "Hi, why is my bill double this month?",
      "No, I did not subscribe to the 'Premium Hold Music' package.",
      "I cancelled that add-on last year!",
      "This is outrageous. I want a supervisor.",
      "Fine, I'm reporting this."
    ],
    disclaimers: [
      "All refunds are processed in a minimum of 18 - 24 fiscal quarters.",
      "Talking to a supervisor requires a blood moon and three certified witnesses.",
      "Billing math may not add up. It's more of an interpretive dance."
    ]
  },
  retention: {
    key: "retention",
    label: "Customer retention",
    tagline: "Stay for the chaos, not the service.",
    greeting:
      "👾 Retention desk here. We'd love to keep you — mostly because closing accounts requires paperwork.",
    script: [
      "Hi, I'd like to cancel my service.",
      "Yes, I'm aware of the loyalty discount that expires yesterday.",
      "No, free ringtone downloads are not a reason to stay.",
      "Can I please just cancel?",
      "Hello? Did you hang up?"
    ],
    disclaimers: [
      "Cancellation requests are handled strictly on alternate leap days.",
      "Retention specialists earn bonuses for every customer who gives up first.",
      "Termination fees apply even if the issue is entirely our fault."
    ]
  }
};

export const scenarios = scenarioRegistry;

export const scenarioKeys: ScenarioKey[] = [...scenarioEnumValues];

export function getScenario(key: ScenarioKey): ScenarioConfig {
  return scenarioRegistry[key];
}

export function listScenarios(): ScenarioConfig[] {
  return scenarioKeys.map((key) => scenarioRegistry[key]);
}
