import clsx from "clsx";
import { Message } from "@/types/chat";

interface ChatBubbleProps {
  message: Message;
}

const baseBubbleStyles =
  "max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow transition-all sm:text-base";

const senderStyles: Record<Message["sender"], string> = {
  bot: "bg-slate-800 text-slate-50 self-start",
  user: "bg-blue-600 text-white self-end",
  system: "bg-amber-100 text-amber-900 self-center text-center"
};

const moodStyles = {
  neutral: "",
  annoyed: "border border-rose-300 bg-rose-50 text-rose-900",
  unhinged: "border border-red-500 bg-red-600 text-white",
};

const autopilotBadge = "text-[0.65rem] uppercase tracking-wide text-slate-400";

export default function ChatBubble({ message }: ChatBubbleProps) {
  const isBot = message.sender === "bot";
  const isSystem = message.sender === "system";
  const showBadge = Boolean(message.meta?.autopilot);

  return (
    <div
      className={clsx(
        "flex w-full flex-col",
        isBot && "items-start",
        message.sender === "user" && "items-end",
        isSystem && "items-center"
      )}
    >
      <div
        className={clsx(
          baseBubbleStyles,
          isSystem ? senderStyles.system : senderStyles[message.sender],
          isBot && message.mood ? moodStyles[message.mood] : null
        )}
      >
        <p className="whitespace-pre-line leading-relaxed">{message.text}</p>
        <div className="mt-1 flex items-center justify-between text-[0.65rem] uppercase tracking-wide text-slate-300">
          <span>{formatTime(message.timestamp)}</span>
          {showBadge && <span className={autopilotBadge}>Autopilot</span>}
        </div>
      </div>
    </div>
  );
}

function formatTime(timestamp: string) {
  try {
    return new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch (error) {
    return "??";
  }
}
