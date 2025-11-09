export type Sender = "user" | "bot" | "system";

export type BotMood = "neutral" | "annoyed" | "unhinged";

export interface SupportSuggestion {
  title: string;
  url: string;
  description: string;
}

export interface Message {
  id: string;
  sender: Sender;
  text: string;
  timestamp: string;
  mood?: BotMood;
  meta?: {
    autopilot?: boolean;
  };
}
