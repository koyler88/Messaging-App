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
  const [recipient, setRecipient] = useState(null); // store recipient user info

  const messagesEndRef = useRef(null);

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Fetch conversation
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

  // Fetch recipient details
  const fetchRecipient = async () => {
    try {
      const res = await fetch(`http://localhost:3000/users/${withUserId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch user");
      const data = await res.json();
      setRecipient(data);
    } catch (err) {
      console.error(err);
      setRecipient({ username: "Unknown User" });
    }
  };

  useEffect(() => {
    if (withUserId) {
      fetchMessages();
      fetchRecipient();
    }
  }, [withUserId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Send a new message
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
      <div className="messages-header">
        <button onClick={() => navigate("/dashboard")} className="back-btn">
          ← Back
        </button>
        <h2>
          Conversation with{" "}
          <span className="recipient-name">
            {recipient ? recipient.username : "Loading..."}
          </span>
        </h2>
      </div>

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
