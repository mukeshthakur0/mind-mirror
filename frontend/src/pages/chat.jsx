import React, { useState } from "react";
import axios from "axios";
 import {SendHorizontalIcon} from "lucide-react";
export default function Chatbot({ userId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;

    const newMsg = { sender: "user", text: input };
    setMessages([...messages, newMsg]);

    const res = await axios.post("http://localhost:5000/chatbot", {
      userId,
      message: input,
    });

    const botMsg = { sender: "bot", text: res.data.reply };
    setMessages((m) => [...m, botMsg]);

    setInput("");
  };

  return (
    <div className="w-screen h-screen bg-gradient-to-br from-blue-100 to-blue-300 flex flex-col">

      {/* Header */}
      <div className="bg-blue-700 text-white py-4 text-center text-xl font-bold shadow-md">
        MindMirror AI Assistant
      </div>

      {/* Chat messages */}
      <div className="flex-1 p-5 overflow-y-auto space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`max-w-[75%] px-4 py-3 rounded-2xl text-base animate-fade
              ${msg.sender === "user"
                ? "bg-blue-600 text-white ml-auto rounded-br-md"
                : "bg-white text-gray-900 mr-auto rounded-bl-md shadow"
              }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      {/* Input area */}
      <div className="p-4 bg-white flex items-center shadow-lg">
        <input
          className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-base outline-none focus:ring-2 focus:ring-blue-500"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
        />
        <button
          onClick={sendMessage}
          className="ml-3 px-5 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition text-xl"
        >
          <SendHorizontalIcon/>
        </button>
      </div>
    </div>
  );
}
