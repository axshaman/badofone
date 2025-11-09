import { BotMood, SupportSuggestion } from "@/types/chat";
import { ScenarioKey, getScenario } from "./scenarios";

interface ResponseOptions {
  autopilot?: boolean;
  escalate?: boolean;
}

interface BotResponse {
  reply: string;
  mood: BotMood;
  suggestions: SupportSuggestion[];
  shouldEscalate: boolean;
}

const generalResponses = {
  neutral: [
    "Thank you for your patience. Our patience with your patience is also limited.",
    "We have logged your complaint in our system's black hole.",
    "Interesting issue! Let me forward it to the appropriate shrugging department.",
    "Hold on while I consult our sacred troubleshooting flowchart (it's just a picture of a power button)."
  ],
  annoyed: [
    "Please stop using tone. Our sensors detect tone.",
    "We can escalate this, but it will only make both of us sadder.",
    "I promise someone will look into this. I just can't promise when, who, or why.",
    "Our records show you agreed to this chaos in the terms and conditions you definitely read."
  ],
  unhinged: [
    "Escalation confirmed. Summoning a manager. Estimated arrival: 2097.",
    "Your ticket has been prioritized into our Ultra Mega Queue™. Population: countless.",
    "We've tagged this as TOP PRIORITY. That stands for 'Totally Optional Priority'.",
    "We hear your frustration. We will now place it on hold with our other frustrations."
  ]
};

const scenarioResponses: Record<ScenarioKey, Record<BotMood, string[]>> = {
  technical: {
    neutral: [
      "Our diagnostics show everything is perfect. Therefore, the problem must be you.",
      "Try hugging the modem for 30 seconds. Emotional support can work wonders.",
      "We recommend upgrading to our Premium Signal Plan to fix the problem we just denied exists.",
      "This is definitely a known issue. Known to us, ignored by us."
    ],
    annoyed: [
      "The system indicates you have 27 devices connected. Maybe unplug a toaster?",
      "Please describe your problem in the form of a haiku. Our bot responds better to poetry.",
      "If you want a technician, please select a 6 hour window sometime next leap year.",
      "We already sent a fix. It's invisible, but trust us, it's there."
    ],
    unhinged: [
      "Fine. We'll reboot the entire grid. This may or may not affect several continents.",
      "Escalating to Tier 4. Tier 4 is just a rotating chair with a cat sitting on it.",
      "A senior engineer will call you shortly. Senior in age, not rank.",
      "Our system is now printing your complaint on recycled paper to be ceremonially ignored."
    ]
  },
  billing: {
    neutral: [
      "Those charges are definitely real. They just haven't happened yet. Time is a flat invoice.",
      "The double charge is part of our loyalty multiplier. The more you pay, the more loyal we assume you are.",
      "According to our records, you subscribed to 'Mystery Fees'. They are mysterious even to us.",
      "We see the problem, but the system needs another billing cycle to appreciate your concern."
    ],
    annoyed: [
      "Refunds require a 42 step form available only in-person on alternating Thursdays.",
      "A manager can authorize a refund, but they are currently on a 4000 hour lunch break.",
      "We're happy to waive that fee after you complete the optional survey about your disappointment.",
      "Escalations trigger an audit. Audits trigger naps."
    ],
    unhinged: [
      "Escalation accepted. We have now mailed you 17 forms, each requiring a notarized apology letter.",
      "Great news! Your refund has been approved pending a 12-18 year review period.",
      "We're looping in finance. They speak only in spreadsheets and riddles.",
      "Your account has been tagged 'difficult'. Congratulations, that's our highest honor."
    ]
  },
  retention: {
    neutral: [
      "Before you cancel, have you considered our Platinum Hold Music subscription?",
      "We value your loyalty almost as much as we value not doing paperwork.",
      "What if we offered you three free months of mild frustration?",
      "Leaving so soon? We haven't even started our 24 part retention presentation."
    ],
    annoyed: [
      "We can cancel your service right after we confirm your childhood nickname for security.",
      "If you insist on leaving, there is a ceremonial 90 day notice period for dramatic effect.",
      "Our retention specialist can help after they finish convincing themselves to stay here too.",
      "We're experiencing a brief outage in cancellation services. Estimated resolution: eventually."
    ],
    unhinged: [
      "Request acknowledged. Initiating Operation: Endless Hold.",
      "We're generating your cancellation ticket. It's 400 pages and printed in invisible ink.",
      "To cancel, please solve this escape room we just emailed you.",
      "We've escalated to the Loyalty Tribunal. They meet once per comet sighting."
    ]
  }
};

const knowledgeBase: Record<ScenarioKey, SupportSuggestion[]> = {
  technical: [
    {
      title: "Troubleshooting the blinking red light",
      url: "https://support.badofone.fake/articles/blinking-red",
      description: "An 87 step process that ultimately tells you to reboot again."
    },
    {
      title: "How to speak fluent modem",
      url: "https://support.badofone.fake/articles/modem-language",
      description: "Advanced tips on whispering sweet nothings to your router."
    },
    {
      title: "Why outages are actually features",
      url: "https://support.badofone.fake/articles/outage-feature",
      description: "An opinion piece from marketing that somehow became documentation."
    }
  ],
  billing: [
    {
      title: "Understanding your 47 mysterious fees",
      url: "https://support.badofone.fake/articles/mystery-fees",
      description: "Spoiler: we don't understand them either."
    },
    {
      title: "How to request a refund without crying",
      url: "https://support.badofone.fake/articles/refund-guide",
      description: "A meditative guide to accepting the inevitable denial."
    },
    {
      title: "Cancelling paid add-ons from 1998",
      url: "https://support.badofone.fake/articles/retro-addons",
      description: "Legacy services never die, they just bill forever."
    }
  ],
  retention: [
    {
      title: "Leaving Badofone in 12 dramatic steps",
      url: "https://support.badofone.fake/articles/dramatic-exit",
      description: "A theatrical script for canceling while maintaining eye contact."
    },
    {
      title: "Negotiating with the Loyalty Tribunal",
      url: "https://support.badofone.fake/articles/loyalty-tribunal",
      description: "Required reading before we let you cancel."
    },
    {
      title: "Keep calm and hold forever",
      url: "https://support.badofone.fake/articles/endless-hold",
      description: "Breathing exercises for 4 hour hold music sessions."
    }
  ]
};

const escalationTriggers = /cancel|manager|supervisor|escalate|complain|refund|compensation/i;
const annoyedTriggers = /angry|upset|ridiculous|mad|outrageous|why/i;

export function generateResponse(
  message: string,
  scenario: ScenarioKey,
  options: ResponseOptions = {}
): BotResponse {
  const normalized = message.trim();
  const wantsEscalation = options.escalate || escalationTriggers.test(normalized);
  const isAnnoyed = wantsEscalation || annoyedTriggers.test(normalized);

  let mood: BotMood = "neutral";
  if (wantsEscalation) {
    mood = "unhinged";
  } else if (isAnnoyed) {
    mood = "annoyed";
  }

  const scenarioPack = scenarioResponses[scenario][mood];
  const fallbackPack = scenarioResponses[scenario].neutral;
  const moodPack = scenarioPack.length ? scenarioPack : fallbackPack;

  const reply = pickRandom([
    ...moodPack,
    ...generalResponses[mood],
    ...generalResponses.neutral
  ]);

  const scenarioConfig = getScenario(scenario);
  const suggestions = options.autopilot
    ? []
    : pickSuggestions(knowledgeBase[scenario], wantsEscalation ? 1 : 2);

  const shouldEscalate = wantsEscalation || (!options.autopilot && normalized.length > 180);

  return {
    reply: `${reply} (${scenarioConfig.tagline})`,
    mood,
    suggestions,
    shouldEscalate
  };
}

function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function pickSuggestions(items: SupportSuggestion[], take: number): SupportSuggestion[] {
  if (!items.length || take <= 0) {
    return [];
  }

  const shuffled = [...items].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(take, items.length));
}
