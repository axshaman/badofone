"use client";

import Button from "@/components/ui/button";
import { ScenarioConfig, ScenarioKey } from "@/lib/scenarios";

interface ChatToolbarProps {
  scenario: ScenarioConfig;
  options: ScenarioConfig[];
  onScenarioChange: (key: ScenarioKey) => void;
  autopilotEnabled: boolean;
  onToggleAutopilot: () => void;
  onEscalate: () => void;
  busy: boolean;
}

export default function ChatToolbar({
  scenario,
  options,
  onScenarioChange,
  autopilotEnabled,
  onToggleAutopilot,
  onEscalate,
  busy
}: ChatToolbarProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Scenario
          </label>
          <select
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
            value={scenario.key}
            onChange={(event) => onScenarioChange(event.target.value as ScenarioKey)}
          >
            {options.map((option) => (
              <option key={option.key} value={option.key}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="secondary" onClick={onToggleAutopilot}>
            {autopilotEnabled ? "Pause autopilot" : "Resume autopilot"}
          </Button>
          <Button variant="destructive" onClick={onEscalate} disabled={busy}>
            Escalate anyway
          </Button>
        </div>
      </div>

      <div className="rounded-xl bg-slate-900 px-4 py-3 text-sm text-slate-100 shadow-inner">
        <p className="font-semibold">{scenario.tagline}</p>
        <p className="mt-1 text-slate-300">{scenario.greeting}</p>
      </div>

      <ul className="list-disc space-y-1 rounded-xl border border-slate-200 bg-slate-50 px-5 py-3 text-xs text-slate-600">
        {scenario.disclaimers.map((disclaimer) => (
          <li key={disclaimer} className="leading-snug">
            {disclaimer}
          </li>
        ))}
      </ul>
    </div>
  );
}
