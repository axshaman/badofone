import { NextResponse } from "next/server";
import { generateResponse } from "@/lib/responses";
import { scenarioEnumValues, ScenarioKey } from "@/lib/scenarios";

const scenarioSet = new Set<ScenarioKey>(scenarioEnumValues);

export async function POST(request: Request) {
  try {
    const payload = await request.json();

    if (!isRecord(payload)) {
      return NextResponse.json(
        { error: "Invalid request payload" },
        { status: 400 }
      );
    }

    const message = typeof payload.message === "string" ? payload.message.trim() : "";
    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const scenario = payload.scenario;
    if (!isScenario(scenario)) {
      return NextResponse.json(
        { error: "Unsupported scenario" },
        { status: 400 }
      );
    }

    const autopilot = Boolean(payload.autopilot);
    const escalate = Boolean(payload.escalate);

    const result = generateResponse(message, scenario, {
      autopilot,
      escalate,
    });

    const escalationTicket = result.shouldEscalate
      ? `BD-${Math.random().toString(36).slice(2, 6).toUpperCase()}-${Date.now().toString().slice(-3)}`
      : undefined;

    return NextResponse.json({
      reply: result.reply,
      mood: result.mood,
      suggestions: result.suggestions,
      escalationTicket,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to generate Badofone response" },
      { status: 500 }
    );
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isScenario(value: unknown): value is ScenarioKey {
  return typeof value === "string" && scenarioSet.has(value as ScenarioKey);
}
