import { useState } from "react";
import { useNavigate } from "react-router-dom";
import './login.css'
const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [forgotPassword, setForgotPassword] = useState(false);  // For toggling the forgot password section
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://localhost:7086/api/User/Login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json(); // data should be assigned here
        localStorage.setItem("userRole", data.role); // Store the role in localStorage
        navigate("/main"); // Redirect only if login is successful
      } else {
        setError("Invalid credentials, please try again.");
      }
    } catch {
      setError("Something went wrong, please try again.");
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    // Here you can add the logic for handling forgot password, like sending a reset email
    alert(`Password reset instructions have been sent to ${email}`);
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div className="input-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <div className="error-message">{error}</div>}

        <button type="submit">Login</button>

        <div className="forgot-password">
          <a href="#" onClick={() => setForgotPassword(true)}>
            Forgot Password?
          </a>
        </div>
      </form>

      {forgotPassword && (
        <div className="forgot-password-section">
          <h3>Forgot Password</h3>
          <form onSubmit={handleForgotPassword}>
            <div className="input-group">
              <label htmlFor="reset-email">Enter your email:</label>
              <input
                type="email"
                id="reset-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit">Send Reset Link</button>
            <button type="button" onClick={() => setForgotPassword(false)}>
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default LoginForm;
