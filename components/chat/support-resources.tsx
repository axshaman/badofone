"use client";

import Button from "@/components/ui/button";
import { SupportSuggestion } from "@/types/chat";

interface SupportResourcesProps {
  suggestions: SupportSuggestion[];
  onSuggestionSelect?: (suggestion: SupportSuggestion) => void;
}

export default function SupportResources({
  suggestions,
  onSuggestionSelect
}: SupportResourcesProps) {
  if (!suggestions.length) {
    return null;
  }

  return (
    <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        Unhelpful resources we insist you read
      </p>
      <ul className="mt-3 space-y-3">
        {suggestions.map((suggestion) => (
          <li key={suggestion.url} className="rounded-xl bg-white p-3 shadow">
            <h4 className="text-sm font-semibold text-slate-800">{suggestion.title}</h4>
            <p className="mt-1 text-xs text-slate-500">{suggestion.description}</p>
            <div className="mt-3 flex items-center justify-between text-xs text-blue-700">
              <span className="truncate pr-3">{suggestion.url}</span>
              <Button
                variant="secondary"
                className="text-xs"
                onClick={() => onSuggestionSelect?.(suggestion)}
              >
                I read it (it didn't help)
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
