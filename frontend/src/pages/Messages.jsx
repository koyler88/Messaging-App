import { useEffect, useState, useRef } from "react";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/Messages.css";

export default function Messages() {
  const { user, token } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const withUserId = queryParams.get("with");

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchMessages = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3000/messages/${withUserId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages(res.data.messages);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setError("Failed to load messages");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (withUserId) fetchMessages();
  }, [withUserId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await axios.post(
        `http://localhost:3000/messages`,
        { recipientId: Number(withUserId), content: newMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setNewMessage("");
      fetchMessages();
    } catch (err) {
      console.error(err);
      setError("Failed to send message");
    }
  };

  if (loading) return <p>Loading conversation...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="messages-container">
      {/* Back button */}
      <button className="back-button" onClick={() => navigate("/dashboard")}>
        &larr; Back to Dashboard
      </button>

      <h2>Conversation</h2>
      <div className="messages-list">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`message-bubble ${
              msg.author.id === user.id ? "sent" : "received"
            }`}
          >
            <p>{msg.content}</p>
            <span className="timestamp">
              {new Date(msg.createdAt).toLocaleTimeString()}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form className="message-form" onSubmit={handleSend}>
        <input
          type="text"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    </div>
  );
}
