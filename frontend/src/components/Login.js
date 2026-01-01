import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import img from "../assets/medicorp.png";
import useInputValidation from "../hooks/useInputValidation";
import api from "../services/api";
import "../style.css";

export default function Login({ onLoginSuccess }) {
  const navigate = useNavigate();

  const [message, setMessage] = useState(null);
  const [isError, setIsError] = useState(false);

  const {
    value: emailInput,
    isValueValid: isEmailValid,
    toShowError: emailInputError,
    valueChangeHandler: emailChangeHandler,
    onBlurHandler: emailBlurHandler,
    reset: resetEmailInput,
  } = useInputValidation((value) => value.trim() !== "" && value.includes("@"));

  const {
    value: passwordInput,
    isValueValid: isPasswordValid,
    toShowError: passwordInputError,
    valueChangeHandler: passwordChangeHandler,
    onBlurHandler: passwordBlurHandler,
    reset: resetPasswordInput,
  } = useInputValidation((value) => value.trim().length >= 6);

  const loginHandler = async (event) => {
    event.preventDefault();

    if (!isEmailValid || !isPasswordValid) {
      setMessage("Please enter a valid email and password.");
      setIsError(true);
      return;
    }

    try {
      const response = await api.post("/users/login", {
        email: emailInput,
        password: passwordInput,
      });

      const user = response.data;

      setMessage(`Welcome back, ${user.name}!`);
      setIsError(false);

      localStorage.setItem("user", JSON.stringify(user));
      if (onLoginSuccess) onLoginSuccess(user);

      setTimeout(() => {
        if (user.role === "ADMIN") navigate("/admin-dashboard");
        else if (user.role === "DOCTOR") navigate("/doctor-dashboard");
        else navigate("/patient-dashboard");
      }, 1000);

    } catch (error) {
      setMessage("Invalid email or password.");
      setIsError(true);
    }

    resetEmailInput();
    resetPasswordInput();
  };

  return (
    <div className="base-container">
      <div className="header">LOGIN</div>

      <div className="content">
        <div className="image">
          <img src={img} alt="login" className="form-image" />
        </div>

        <div className="form">
          {message && (
            <p className={`form-message ${isError ? "error" : "success"}`}>
              {message}
            </p>
          )}

          <div className="form-group">
            <input
              type="email"
              placeholder="Email Address"
              value={emailInput}
              onChange={emailChangeHandler}
              onBlur={emailBlurHandler}
            />
            {emailInputError && <p className="error-text">Enter a valid email</p>}
          </div>

          <div className="form-group">
            <input
              type="password"
              placeholder="Password"
              value={passwordInput}
              onChange={passwordChangeHandler}
              onBlur={passwordBlurHandler}
            />
            {passwordInputError && (
              <p className="error-text">Password must be at least 6 characters</p>
            )}
          </div>
        </div>
      </div>

      <div className="footer">
        <button className="btn" onClick={loginHandler}>
          Login
        </button>
      </div>
    </div>
  );
}
