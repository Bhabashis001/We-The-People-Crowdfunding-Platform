import React, { useState, useEffect, useContext } from 'react';
import "./login.css";
import { Link, useNavigate } from "react-router-dom";
import UserContext from '../../Context/userContext';
import axios from '../../Axios/axios';
import Navbar from '../Landing Pages/Navbar';
import defaultLogin from "../images/homepage.png";
const Login = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const navigate = useNavigate();
  const context = useContext(UserContext);
  let { showAlert } = context;
  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate("/dashboard");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError("");
    try {
      const response = await axios.post(`/api/auth/login`, {
        email: credentials.email,
        password: credentials.password,
      });
      if (response.data && response.data.success) {
        // Save the authtoken and redirect
        localStorage.setItem("token", response.data.authtoken);
        showAlert("Logged In Successfully!!!", "success");
        setLoginError("");
        navigate("/dashboard");
      } else {
        setLoginError("Unable to login. Please check your credentials.");
      }
    } catch (err) {
      const serverMsg = err?.response?.data?.error || "";
      if (serverMsg.includes("Please try to login")) {
        setLoginError("No profile found with these credentials. Please check your email/password.");
      } else {
        setLoginError("Unable to login right now. Please try again later.");
      }
      showAlert(serverMsg || "Login failed", "danger");
    } finally {
      setCredentials({ email: "", password: "" });
    }
  }; 
  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  return (
    <>
        <Navbar />
        <div className="card mx-auto login__card">
          <form onSubmit={handleSubmit}>
            <div className="row g-0">
              <div className="col-lg-6 col-sm-12">
                <img src="https://bootstrapious.com/i/snippets/sn-registeration/illustration.svg" className="img-fluid rounded-start login__image" alt="login" onError={(e)=>{e.target.onerror=null; e.target.src=defaultLogin}} />
              </div>
              <div className="col-lg-6 col-sm-12">
                <div className="card-body">
                  <div className="login__head">Welcome Back!</div>
                  <div className="login__para">Login to continue</div>

                  {loginError && (
                    <div className="alert alert-warning text-center my-3">
                      <p className="mb-2">{loginError}</p>
                      <div>
                        <Link to="/signup" className="btn btn-sm btn-primary me-2">Sign Up</Link>

                      </div>
                    </div>
                  )}

                  <div className="row">
                    <div className="col-md-12 col-sm-12">
                      <i className="fa-solid fa-user email__icon"></i>
                      <input type="email"
                        className="input__email"
                        placeholder="Enter Email"
                        id="email"
                        name="email"
                        value={credentials.email}
                        onChange={onChange} />
                    </div>
                    <div className="col-md-12 col-sm-12">
                      <i className="fa-solid fa-lock password__icon"></i>
                      <input type="password"
                        className="input__password"
                        placeholder="Enter Password"
                        id="password"
                        name="password"
                        value={credentials.password}
                        onChange={onChange} />
                    </div>
                    <div className="col-md-12 col-sm-12 login__btn">
                      <input type="submit" className="login__button" value="Login" />
                    </div>
                    <div className="col-md-12 col-sm-12 go__signup">
                      <p className="text-center">Not a Member?<Link to="/signup">SignUp</Link></p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </>
  )
}

export default Login;