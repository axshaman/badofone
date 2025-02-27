"use client";

import { useState, useEffect, useRef } from "react";
import Card from "@/components/ui/card";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input"; // ✅ Добавляем импорт Input

export default function PumpChat() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "👾 Welcome to Pump Support! How can we help?" },
  ]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!input.trim()) return;

    setMessages((prev) => [
      ...prev,
      { sender: "user", text: input },
      { sender: "bot", text: "👾 Have you tried restarting the pump?" },
    ]);
    setInput("");
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <Card className="w-full max-w-lg shadow-lg rounded-lg">
        <div className="bg-blue-600 text-white text-lg font-semibold p-3 rounded-t-lg text-center">
          Pump Support Chat 💬
        </div>
        <div className="h-96 overflow-y-auto p-3 bg-gray-50 border-b border-gray-200">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`rounded-lg px-4 py-2 m-1 text-white ${msg.sender === "user" ? "bg-blue-500" : "bg-gray-600"}`}>
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
        <div className="flex p-3 bg-white">
          <Input
            className="flex-1 border rounded-l-lg px-4 py-2 outline-none"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <Button className="bg-blue-600 text-white px-4 py-2 rounded-r-lg" onClick={handleSendMessage}>
            Send
          </Button>
        </div>
      </Card>
    </div>
  );
}
