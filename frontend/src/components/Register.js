import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import img from "../assets/medicorp.png";
import useInputValidation from "../hooks/useInputValidation";
import api from "../services/api";
import "../style.css";

export default function Register() {
  const navigate = useNavigate();

  const [message, setMessage] = useState(null);
  const [isError, setIsError] = useState(false);
  const [role, setRole] = useState("PATIENT");

  const {
    value: nameInput,
    isValueValid: isNameValid,
    toShowError: nameInputError,
    valueChangeHandler: nameChangeHandler,
    onBlurHandler: nameBlurHandler,
    reset: resetNameInput,
  } = useInputValidation((value) => value.trim() !== "");

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
  } = useInputValidation((value) => value.trim().length > 6);

  const registerHandler = async (event) => {
    event.preventDefault();

    if (!isNameValid || !isEmailValid || !isPasswordValid) {
      setMessage("Please fill in all fields correctly.");
      setIsError(true);
      return;
    }

    try {
      await api.post("/users/register", {
        name: nameInput,
        email: emailInput,
        password: passwordInput,
        role: role,
      });

      setMessage("Registration successful! Redirecting...");
      setIsError(false);

      setTimeout(() => navigate("/"), 1500);

    } catch (error) {
      setMessage("Registration failed. Email may already exist.");
      setIsError(true);
    }

    resetNameInput();
    resetEmailInput();
    resetPasswordInput();
  };

  return (
    <div className="base-container">
      <div className="header">REGISTER</div>

      <div className="content">
        <div className="image">
          <img src={img} alt="register" className="form-image" />
        </div>

        <div className="form">
          {message && (
            <p className={`form-message ${isError ? "error" : "success"}`}>
              {message}
            </p>
          )}

          <div className="form-group">
            <input
              type="text"
              placeholder="Full Name"
              value={nameInput}
              onChange={nameChangeHandler}
              onBlur={nameBlurHandler}
            />
            {nameInputError && <p className="error-text">Enter a valid name</p>}
          </div>

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
              <p className="error-text">Password must be at least 7 characters</p>
            )}
          </div>

          <div className="form-group">
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="PATIENT">Patient</option>
              <option value="DOCTOR">Doctor</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
        </div>
      </div>

      <div className="footer">
        <button className="btn" onClick={registerHandler}>
          Register
        </button>
      </div>
    </div>
  );
}
