import React, { useState } from "react";
import Register from "./Register";
import Login from "./Login";
import "../style.css";

export default function SignIn() {
  const [isLogin, setIsLogin] = useState(true);

  const changeState = () => {
    setIsLogin((prev) => !prev);
  };

  return (
    <div className="wrapper">
      <div className="login">
        <div className="container form-box">
          {isLogin ? <Login /> : <Register />}

          <div className="footer switch-only">
            <button className="switch-btn" type="button" onClick={changeState}>
              {isLogin ? "Switch to Register" : "Switch to Login"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
