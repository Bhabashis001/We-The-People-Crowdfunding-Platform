import React, { useEffect, useContext, useState } from 'react';
import "./Profile.css";
import { useNavigate, Link } from "react-router-dom";
import DashboardNavbar from '../DashboardNavbar';
import UserContext from '../../../Context/userContext';
import axios from '../../../Axios/axios';

const Profile = () => {
    const navigate = useNavigate();
    const context = useContext(UserContext);
    const { user,showAlert,getUserData, userFetchError, retryGetUserData, clearUserFetchError } = context;
    useEffect(() => {
  if (!localStorage.getItem("token")) {
    navigate("/login");
    return;
  }
  getUserData();
}, [navigate, getUserData]);

   
    const [credentials, setCredentials] = useState({ currentPassword: "", changePassword: "", confirmChangePassword: "" })
    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };
    const handleSubmit = async (e) => {
  e.preventDefault();

  // frontend validation
  if (credentials.changePassword !== credentials.confirmChangePassword) {
    showAlert("Passwords do not match", "error");
    return;
  }

  try {
    const response = await axios.post(
      "/api/investor/changePassword",
      {
        currentPassword: credentials.currentPassword,
        newPassword: credentials.changePassword,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
      }
    );

    console.log("[SUCCESS] Password changed:", response.data);

    showAlert(
      response.data.msg || "Password updated successfully",
      "success"
    );

    // clear inputs after success
    setCredentials({
      currentPassword: "",
      changePassword: "",
      confirmChangePassword: "",
    });

  } catch (error) {
    console.error(
      "[ERROR] Change password:",
      error.response?.status,
      error.response?.data
    );

    showAlert(
      error.response?.data?.error || error.response?.data?.errors?.map(err => err.msg).join(', ') || "Password update failed",
      "error"
    );
  }
};

    
    if (!user || userFetchError) {
        return (
            <>
                <DashboardNavbar />
                <div className="container my-5">
                    <div className="alert alert-warning text-center">
                        <h5>Profile not available</h5>
                        <p className="mb-3">{userFetchError || 'We could not load your profile right now.'}</p>
                        <div>
                            <button className="btn btn-sm btn-primary me-2" onClick={async () => { await retryGetUserData(); }}>Retry</button>
                            <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => navigate('/login')}>Login</button>
                            <button className="btn btn-sm btn-link" onClick={() => clearUserFetchError()}>Dismiss</button>
                        </div>
                    </div>
                </div>
            </>
        )
    }

    return (
        <>
            <DashboardNavbar />
            <div className="container profile_card">
                <h3 className="text-center profile_head">User Profile</h3>
                <div className="row my-5">
                    <div className="col-lg-3 col-md-12 col-sm-12 mb-3">
                        <img src="https://cdn-icons-png.flaticon.com/512/4521/4521953.png" alt="avatar" className="avatar_img" />
                        <h4 className="text-center my-2 user_name">{user.name}</h4>
                        <br />
                    </div>
                    <div className="col-lg-5 col-md-7 col-sm-12">
                        <h4 className="text-light">Details</h4>
                        <label className="labels">Display Name</label>
                        <p className="labels_desc">{user.name}</p>
                        <form>
                            <label className="labels">Current Password</label> <br />
                            <input type="password" className="profile_password_input" name="currentPassword" onChange={onChange} value={credentials.currentPassword}></input> <br />

                            <label className="labels">Change Password</label> <br />
                            <input type="password" className="profile_password_input" name="changePassword" onChange={onChange} value={credentials.changePassword}></input> <br />

                            <label className="labels">Confirm Change Password</label> <br />
                            <input type="password" className="profile_password_input" name="confirmChangePassword" onChange={onChange} value={credentials.confirmChangePassword}></input> <br />

                            <button className="my-2 mb-3 btn change_password_btn" onClick={handleSubmit}>Save Changes</button>
                        </form>
                    </div>
                    <div className="col-lg-4 col-md-5 col-sm-12">
                        <h4 className="text-light">Contacts</h4>
                        <label className="labels">Your Email</label>
                        <p className="labels_desc">{user.email}</p>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Profile;