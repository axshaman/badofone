"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import ChatBubble from "@/components/chat/chat-bubble";
import ChatToolbar from "@/components/chat/chat-toolbar";
import SupportResources from "@/components/chat/support-resources";
import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import Input from "@/components/ui/input";
import { listScenarios, getScenario, ScenarioKey } from "@/lib/scenarios";
import { Message, SupportSuggestion } from "@/types/chat";

const scenarioOptions = listScenarios();
const defaultScenarioKey: ScenarioKey = "technical";
const defaultScenario = getScenario(defaultScenarioKey);

function createMessage(
  sender: Message["sender"],
  text: string,
  mood?: Message["mood"],
  meta?: Message["meta"]
): Message {
  return {
    id: `${sender}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    sender,
    text,
    timestamp: new Date().toISOString(),
    mood,
    meta,
  };
}

export default function ChatPage() {
  const [scenarioKey, setScenarioKey] = useState<ScenarioKey>(defaultScenarioKey);
  const scenario = useMemo(() => getScenario(scenarioKey), [scenarioKey]);
  const [messages, setMessages] = useState<Message[]>([
    createMessage("bot", defaultScenario.greeting, "neutral"),
  ]);
  const [input, setInput] = useState("");
  const [autopilotEnabled, setAutopilotEnabled] = useState(true);
  const [autoIndex, setAutoIndex] = useState(0);
  const [suggestions, setSuggestions] = useState<SupportSuggestion[]>([]);
  const [escalationTicket, setEscalationTicket] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, suggestions]);

  useEffect(() => {
    setMessages([createMessage("bot", scenario.greeting, "neutral")]);
    setAutopilotEnabled(true);
    setAutoIndex(0);
    setSuggestions([]);
    setEscalationTicket(null);
  }, [scenario]);

  useEffect(() => {
    if (!autopilotEnabled || busy) {
      return;
    }

    if (autoIndex >= scenario.script.length) {
      setAutopilotEnabled(false);
      return;
    }

    const scriptedLine = scenario.script[autoIndex];
    const timer = setTimeout(() => {
      pushMessage("user", scriptedLine, undefined, { autopilot: true });
      void dispatchToBot(scriptedLine, { autopilot: true });
      setAutoIndex((prev) => prev + 1);
    }, autoIndex === 0 ? 1000 : 4500);

    return () => clearTimeout(timer);
  }, [autoIndex, autopilotEnabled, busy, scenario]);

  const pushMessage = (
    sender: Message["sender"],
    text: string,
    mood?: Message["mood"],
    meta?: Message["meta"]
  ) => {
    setMessages((prev) => [...prev, createMessage(sender, text, mood, meta)]);
  };

  const dispatchToBot = async (
    content: string,
    options?: { autopilot?: boolean; escalate?: boolean }
  ) => {
    setBusy(true);
    try {
      const response = await fetch("/api/support/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: content,
          scenario: scenario.key,
          autopilot: Boolean(options?.autopilot),
          escalate: Boolean(options?.escalate),
        }),
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const payload = await response.json();
      pushMessage("bot", payload.reply, payload.mood);

      if (payload.escalationTicket) {
        setEscalationTicket(payload.escalationTicket);
        pushMessage(
          "system",
          `Escalation ticket ${payload.escalationTicket} created. Estimated response window: ±14 geological eras.`
        );
      }

      setSuggestions(payload.suggestions ?? []);
    } catch (error) {
      pushMessage(
        "system",
        "🚨 Connection to Badofone collapsed. Please increase the volume of your frustration and try again."
      );
    } finally {
      setBusy(false);
    }
  };

  const handleSubmit = (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    if (!input.trim()) {
      return;
    }

    const sanitized = input.trim();
    setInput("");
    setAutopilotEnabled(false);
    pushMessage("user", sanitized);
    void dispatchToBot(sanitized);
  };

  const handleScenarioChange = (key: ScenarioKey) => {
    setScenarioKey(key);
  };

  const handleToggleAutopilot = () => {
    setAutopilotEnabled((prev) => !prev);
  };

  const handleEscalate = () => {
    const text = "I want this escalated immediately.";
    setAutopilotEnabled(false);
    pushMessage("user", text);
    void dispatchToBot(text, { escalate: true });
  };

  const handleSuggestionSelect = (suggestion: SupportSuggestion) => {
    const text = `I read \"${suggestion.title}\" and it still didn't fix anything.`;
    setAutopilotEnabled(false);
    pushMessage("user", text);
    void dispatchToBot(text);
  };

  return (
    <div className="min-h-screen bg-slate-100 py-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 md:flex-row">
        <aside className="md:w-5/12">
          <ChatToolbar
            scenario={scenario}
            options={scenarioOptions}
            onScenarioChange={handleScenarioChange}
            autopilotEnabled={autopilotEnabled}
            onToggleAutopilot={handleToggleAutopilot}
            onEscalate={handleEscalate}
            busy={busy}
          />
        </aside>

        <section className="flex flex-1 flex-col gap-4">
          <Card className="flex h-[70vh] flex-col" padding={false}>
            <div className="border-b border-slate-200 bg-slate-900 px-6 py-4 text-white">
              <h1 className="text-lg font-semibold">Badofone Support Arena 💬</h1>
              <p className="text-sm text-slate-300">Scenario: {scenario.label}</p>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto bg-gradient-to-b from-slate-50 to-slate-100 px-6 py-6">
              {messages.map((message) => (
                <ChatBubble key={message.id} message={message} />
              ))}

              {busy && (
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  👾 Badofone is composing a vague reply...
                </p>
              )}

              <div ref={chatEndRef} />
            </div>

            <form
              onSubmit={handleSubmit}
              className="border-t border-slate-200 bg-white px-4 py-4"
            >
              <div className="flex flex-col gap-3 sm:flex-row">
                <Input
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="Type your plea for help..."
                  disabled={busy}
                />
                <Button
                  type="submit"
                  disabled={busy || !input.trim()}
                  className="sm:w-40"
                >
                  Send cry for help
                </Button>
              </div>
              {escalationTicket && (
                <p className="mt-3 text-xs text-amber-600">
                  Escalation ticket {escalationTicket} logged. Estimated resolution: sometime between now and the heat death of the universe.
                </p>
              )}
            </form>
          </Card>

          <SupportResources
            suggestions={suggestions}
            onSuggestionSelect={handleSuggestionSelect}
          />
        </section>
      </div>
    </div>
  );
}
