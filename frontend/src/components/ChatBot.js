import React, { useState } from "react";
import api from "../services/api";
import "../style.css";

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi! 👋 Ask me anything about your health records." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { from: "user", text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await api.post("/chat", {
        message: userMessage.text
      });

      setMessages(prev => [
        ...prev,
        { from: "bot", text: res.data.response }
      ]);
    } catch {
      setMessages(prev => [
        ...prev,
        { from: "bot", text: "AI is currently unavailable." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="chat-bubble" onClick={() => setOpen(!open)}>💬</div>

      {open && (
        <div className="chat-window">
          <div className="chat-header">
            AI Assistant
            <span onClick={() => setOpen(false)}>✖</span>
          </div>

          <div className="chat-body">
            {messages.map((m, i) => (
              <div key={i} className={`chat-message ${m.from}`}>
                {m.text}
              </div>
            ))}
            {loading && <div className="chat-message bot">Typing...</div>}
          </div>

          <div className="chat-footer">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask a question..."
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </>
  );
}
