"use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, Typography } from "@mui/material";

const botResponses = [
  "Have you tried turning your router off and on again?",
  "We are currently experiencing high traffic. Please try again later.",
  "Our system does not detect any issues on your end.",
  "Please check our support page for troubleshooting steps.",
  "This issue has been escalated to our technical team (maybe).",
  "We appreciate your patience while we do nothing about this.",
];

const botCrazyResponses = [
  "For urgent support, call our hotline at **$10 per minute**. Available **Monday-Friday** from **2:00 PM - 4:00 PM**, excluding lunch break **(2:30 PM - 3:30 PM)** and **Tuesday, Wednesday, and Thursday**.",
  "You can submit a complaint here: ❌ Form not available.",
  "For further assistance, please visit our help page: ❌ 404 Error: Page not found.",
];

const userAutoResponses = [
  "Hello, my internet is not working!",
  "Yes, I have tried that already!",
  "This is ridiculous...",
  "Can I speak to a real person?",
  "ARE YOU A BOT?!",
  "I'm done with this support!",
];

export default function ChatPage() {
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([
    { sender: "bot", text: "👾 Welcome to Badofone Support! How can we help?" },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    startAutoChat();
  }, []);

  const startAutoChat = () => {
    let index = 0;
    const interval = setInterval(() => {
      if (index >= userAutoResponses.length) {
        clearInterval(interval);
        return;
      }

      // Symbol by symbol enter imitation
      typeMessage("user", userAutoResponses[index]);

      setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          const botReply = botResponses[Math.floor(Math.random() * botResponses.length)];
          const crazyReply = index % 3 === 0 ? botCrazyResponses[Math.floor(Math.random() * botCrazyResponses.length)] : null;
          setMessages((prev) => [
            ...prev,
            { sender: "bot", text: `👾 ${botReply}` },
            ...(crazyReply ? [{ sender: "bot-crazy", text: `❗ ${crazyReply}` }] : []),
          ]);
        }, 2000);
      }, 2000);

      index++;
    }, 5000);
  };

  const typeMessage = (sender: "user" | "bot", message: string) => {
    let i = 0;
    let tempMessage = "";

    const interval = setInterval(() => {
      if (i >= message.length) {
        clearInterval(interval);
        return;
      }

      tempMessage += message[i]; // New symbol in the line

      setMessages((prev) => {
        const lastMessage = prev[prev.length - 1];

        if (lastMessage?.sender === sender && lastMessage?.text) {
          return [...prev.slice(0, -1), { sender, text: tempMessage }];
        } else {
          return [...prev, { sender, text: tempMessage }];
        }
      });

      i++;
    }, 50);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <Card sx={{ width: "100%", maxWidth: 500, boxShadow: 3, borderRadius: 3 }}>
        <Typography variant="h5" sx={{ backgroundColor: "red", color: "white", p: 2, textAlign: "center", borderRadius: "8px 8px 0 0" }}>
          Badofone Support Chat 💬
        </Typography>
        <CardContent sx={{ height: 400, overflowY: "auto", bgcolor: "#f5f5f5", p: 2 }}>
          {messages.map((msg, index) => (
            <Typography
              key={index}
              sx={{
                p: 1.5,
                mb: 1,
                borderRadius: 2,
                color: "white",
                maxWidth: "75%",
                alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                bgcolor: msg.sender === "user" ? "blue" : msg.sender === "bot-crazy" ? "red" : "gray",
                display: "inline-block",
              }}
            >
              {msg.text}
            </Typography>
          ))}
          {isTyping && <Typography sx={{ color: "gray", fontSize: "0.9rem" }}>👾 Badofone is typing...</Typography>}
          <div ref={chatEndRef} />
        </CardContent>
      </Card>
    </div>
  );
}
