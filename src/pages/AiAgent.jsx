import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import "./AiAgent.css";

function AIChat() {

  const API = `${import.meta.env.VITE_API_URL}/api/ai`;

  const [sessions, setSessions] = useState([]);
  const [sessionId, setSessionId] = useState("");
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef(null);

  useEffect(() => {
    loadSessions();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const token = localStorage.getItem("token");

  const headers = {
    Authorization: `Bearer ${token}`
  };

  /* ================= LOAD SESSIONS ================= */

  const loadSessions = async () => {
    try {

      const res = await axios.get(`${API}/chats`, { headers });

      setSessions(res.data);

      if (res.data.length > 0) {
        loadMessages(res.data[0].sessionId);
        setSessionId(res.data[0].sessionId);
      }

    } catch (err) {
      console.error(err);
    }
  };

  /* ================= LOAD MESSAGES ================= */

  const loadMessages = async (sid) => {

    try {

      const res = await axios.get(`${API}/chat/${sid}`, { headers });

      setMessages(res.data.messages);
      setSessionId(sid);

    } catch (err) {
      console.error(err);
    }

  };

  /* ================= CREATE SESSION ================= */

  const createSession = async () => {

    try {

      const res = await axios.post(
        `${API}/new-session`,
        {},
        { headers }
      );

      const newSession = res.data.sessionId;

      setSessions(prev => [
        { sessionId: newSession },
        ...prev
      ]);

      setSessionId(newSession);
      setMessages([]);

    } catch (err) {
      console.error(err);
    }

  };

  /* ================= SEND MESSAGE ================= */

  const sendMessage = async () => {

    if (!input.trim()) return;

    const userMessage = {
      role: "user",
      content: input
    };

    setMessages(prev => [...prev, userMessage]);

    const text = input;
    setInput("");
    setLoading(true);

    try {

      const res = await axios.post(
        `${API}/chat`,
        {
          message: text,
          sessionId
        },
        { headers }
      );

      const aiMessage = {
        role: "assistant",
        content: res.data.response
      };

      setMessages(prev => [...prev, aiMessage]);

    } catch (err) {
      console.error(err);
    }

    setLoading(false);

  };

  const handleKey = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (

    <div className="ai-wrapper">

      {/* SIDEBAR */}

      <div className="ai-sidebar">

        <div className="sidebar-header">
          UrbanSense AI
        </div>

        <button
          className="new-chat"
          onClick={createSession}
        >
          + New Chat
        </button>

        <div className="chat-history">

          {sessions.map((s, i) => (

            <div
              key={i}
              className={
                s.sessionId === sessionId
                  ? "history-item active"
                  : "history-item"
              }
              onClick={() => loadMessages(s.sessionId)}
            >
              Chat {i + 1}
            </div>

          ))}

        </div>

      </div>

      {/* CHAT AREA */}

      <div className="ai-chat">

        <div className="chat-header">
          Urban Monitoring Assistant
        </div>

        <div className="chat-messages">

          {messages.length === 0 && (
            <div className="empty">
              Ask about weather, AQI, traffic or public reports
            </div>
          )}

          {messages.map((msg, i) => (

            <div
              key={i}
              className={
                msg.role === "user"
                  ? "message user"
                  : "message bot"
              }
            >

              <ReactMarkdown>
                {msg.content}
              </ReactMarkdown>

            </div>

          ))}

          {loading && (
            <div className="message bot typing">
              AI is typing...
            </div>
          )}

          <div ref={bottomRef} />

        </div>

        <div className="chat-input">

          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Ask about weather, traffic, AQI..."
          />

          <button onClick={sendMessage}>
            Send
          </button>

        </div>

      </div>

    </div>

  );

}

export default AIChat;