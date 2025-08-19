import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { registerUser } from "../api/auth";
import "../styles/Register.css";

export default function Register() {
  const { login } = useAuth(); // for auto login after registration
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.username.length < 3) {
      setError("Username must be at least 3 characters");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    try {
      // Call API
      const { user, token } = await registerUser(form);

      // Store user + token in context/localStorage
      login(user, token);

      // Redirect
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <input
        name="username"
        placeholder="Username"
        value={form.username}
        onChange={handleChange}
        className={
          form.username.length > 0 && form.username.length < 3 ? "error" : ""
        }
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        value={form.password}
        onChange={handleChange}
        className={
          form.password.length > 0 && form.password.length < 8 ? "error" : ""
        }
      />

      <button type="submit">Register</button>
    </form>
  );
}
