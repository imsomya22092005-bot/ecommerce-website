import { useState } from "react";

function Login() {
  const [isRegister, setIsRegister] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isRegister) {
      alert("Registration will be connected to the backend soon.");
    } else {
      alert("Login will be connected to the backend soon.");
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-container">
        <div className="auth-intro">
          <p className="section-label">WELCOME TO SHOPSPHERE</p>

          <h1>
            Your style,
            <br />
            your space.
          </h1>

          <p>
            Sign in to manage your orders, save your favorites
            and enjoy a personalized shopping experience.
          </p>
        </div>

        <div className="auth-card">
          <div className="auth-tabs">
            <button
              className={!isRegister ? "active" : ""}
              onClick={() => setIsRegister(false)}
            >
              LOGIN
            </button>

            <button
              className={isRegister ? "active" : ""}
              onClick={() => setIsRegister(true)}
            >
              REGISTER
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {isRegister && (
              <div className="form-group">
                <label>FULL NAME</label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  required
                />
              </div>
            )}

            <div className="form-group">
              <label>EMAIL ADDRESS</label>
              <input
                type="email"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label>PASSWORD</label>
              <input
                type="password"
                placeholder="Enter your password"
                required
              />
            </div>

            {isRegister && (
              <div className="form-group">
                <label>CONFIRM PASSWORD</label>
                <input
                  type="password"
                  placeholder="Confirm your password"
                  required
                />
              </div>
            )}

            {!isRegister && (
              <div className="forgot-password">
                <button type="button">
                  Forgot password?
                </button>
              </div>
            )}

            <button type="submit" className="auth-submit">
              {isRegister ? "CREATE ACCOUNT" : "SIGN IN"}
            </button>
          </form>

          <p className="auth-switch">
            {isRegister
              ? "Already have an account?"
              : "Don't have an account?"}

            <button
              onClick={() => setIsRegister(!isRegister)}
            >
              {isRegister ? " Login" : " Register"}
            </button>
          </p>
        </div>
      </div>
    </main>
  );
}

export default Login;