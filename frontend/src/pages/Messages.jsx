import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";
import "../styles/Messages.css";

const API_BASE = "http://localhost:3000";

export default function Messages() {
  const { token, user } = useAuth();
  const [users, setUsers] = useState([]); // all other users
  const [selectedUser, setSelectedUser] = useState(null);
  const [conversation, setConversation] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // Fetch all users (to select recipient)
  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await axios.get(`${API_BASE}/auth/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const otherUsers = res.data.filter(u => u.id !== user.id);
        setUsers(otherUsers);
      } catch (err) {
        console.error(err);
      }
    }
    fetchUsers();
  }, [token, user.id]);

  // Fetch conversation when selectedUser changes
  useEffect(() => {
    if (!selectedUser) return;
    async function fetchConversation() {
      try {
        const res = await axios.get(`${API_BASE}/messages/${selectedUser.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setConversation(res.data.messages);
      } catch (err) {
        console.error(err);
      }
    }
    fetchConversation();
  }, [selectedUser, token]);

  // Send a new message
  const handleSend = async () => {
    if (!newMessage.trim()) return;
    try {
      const res = await axios.post(
        `${API_BASE}/messages`,
        { recipientId: selectedUser.id, content: newMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setConversation([...conversation, res.data.message]);
      setNewMessage("");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="messages-container">
      <div className="users-list">
        <h3>Users</h3>
        {users.map(u => (
          <div
            key={u.id}
            className={`user-item ${selectedUser?.id === u.id ? "active" : ""}`}
            onClick={() => setSelectedUser(u)}
          >
            {u.username}
          </div>
        ))}
      </div>

      <div className="chat-box">
        {selectedUser ? (
          <>
            <h3>Chat with {selectedUser.username}</h3>
            <div className="messages-window">
              {conversation.map(msg => (
                <div
                  key={msg.id}
                  className={`message ${
                    msg.authorId === user.id ? "sent" : "received"
                  }`}
                >
                  <p>{msg.content}</p>
                </div>
              ))}
            </div>
            <div className="send-message">
              <input
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                placeholder="Type a message..."
              />
              <button onClick={handleSend}>Send</button>
            </div>
          </>
        ) : (
          <p>Select a user to start chatting</p>
        )}
      </div>
    </div>
  );
}
