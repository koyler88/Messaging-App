import { useState, useEffect, useRef } from "react";
import { useAuth } from "../hooks/useAuth";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./Messages.css";

const API_BASE = "http://localhost:3000";

export default function Messages() {
  const { token } = useAuth();
  const { userId } = useParams();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`${API_BASE}/messages/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessages(res.data.messages);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [token, userId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    try {
      const res = await axios.post(
        `${API_BASE}/messages`,
        { recipientId: userId, content: input },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages([...messages, res.data.message]);
      setInput("");
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p>Loading messages...</p>;

  return (
    <div className="chat-container">
      <div className="messages-list">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`message ${
              msg.authorId === parseInt(userId) ? "received" : "sent"
            }`}
          >
            <span className="message-username">{msg.author.username}</span>
            <p>{msg.content}</p>
          </div>
        ))}
        <div ref={bottomRef}></div>
      </div>
      <form className="message-form" onSubmit={sendMessage}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
