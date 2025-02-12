"use client";
import React, { useState, useEffect } from "react";
import { FaRegCommentDots, FaTimes, FaPaperPlane } from "react-icons/fa";
import SocketService from "../service/socketService";

interface Message {
  content: string;
  sender: boolean;
  createdAt: Date;
}

const ChatComponent = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageContent, setMessageContent] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      SocketService.connect(token);
      SocketService.listenToMessages((newMessage: Message) => {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      });
    } else {
      console.warn("No se encontró un token en localStorage");
    }

    return () => {
      SocketService.disconnect();
    };
  }, []);

  const handleSendMessage = () => {
    if (messageContent.trim()) {
      SocketService.sendMessage(messageContent, false, ""); // isAdmin y chatId no se usan
      setMessageContent("");
    }
  };

  return (
    <div>
      {/* Botón flotante */}
      <div
        className="fixed bottom-5 right-5 bg-black text-white p-4 rounded-full shadow-lg cursor-pointer hover:bg-gray-800 transition"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <FaTimes size={24} /> : <FaRegCommentDots size={24} />}
      </div>

      {/* Chat flotante */}
      {isOpen && (
        <div className="fixed bottom-16 right-5 w-80 max-w-sm h-96 bg-black text-white shadow-lg rounded-lg p-4 flex flex-col">
          <div className="flex-1 overflow-auto p-2 bg-gray-900 rounded-md">
            <div className="flex flex-col gap-3">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg text-sm max-w-[80%] ${
                    message.sender
                      ? "bg-blue-600 self-end"
                      : "bg-gray-700 self-start"
                  }`}
                >
                  <p>{message.content}</p>
                  <span className="text-xs text-gray-400 block mt-1">
                    {new Date(message.createdAt).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-2 mt-2">
            <input
              type="text"
              value={messageContent}
              onChange={(e) => setMessageContent(e.target.value)}
              placeholder="Escribe un mensaje..."
              className="flex-1 p-2 bg-gray-700 text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
            />
            <button
              onClick={handleSendMessage}
              className="bg-black text-white p-2 rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-600 flex items-center justify-center"
            >
              <FaPaperPlane size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatComponent;
