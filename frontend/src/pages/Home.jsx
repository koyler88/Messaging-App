import { Link } from "react-router-dom";
import "../styles/Home.css";

export default function Home() {
  return (
    <div className="home-container">
      <h1>Welcome to Messaging App</h1>
      <p>Connect with friends and colleagues instantly!</p>

      <div className="home-buttons">
        <Link to="/login" className="btn login-btn">Login</Link>
        <Link to="/register" className="btn register-btn">Register</Link>
      </div>

      <div className="home-footer">
        <p>© 2025 Messaging App. All rights reserved.</p>
      </div>
    </div>
  );
}
