import React, { useEffect, useContext, useState } from "react";
import "./Dashboard.css";
import { useNavigate, Link } from "react-router-dom";
import DashboardNavbar from "./DashboardNavbar";
import UserContext from "../../Context/userContext";
import DashboardCard from "./dashboardCard";
import ReactLoading from "react-loading";

const Dashboard = () => {
  const navigate = useNavigate();
  const context = useContext(UserContext);
  let { getUserData, startups, getStartups, userFetchError, retryGetUserData, clearUserFetchError } = context;
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("Design and Tech");
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
    getUserData();
    getStartups();
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  const resourceCopy = [...startups];
  const FilteredList = resourceCopy.filter((element) => {
    return element.Category === category;
  });
  const resourceList = FilteredList.map((el) => (
    <DashboardCard key={el._id} el={el}></DashboardCard>
  ));
  return (
    <>
      {loading ? (
        <ReactLoading
          type={"cylon"}
          color={"rgb(225, 41, 246)"}
          height={"50%"}
          width={"100%"}
        />
      ) : (
        <>
          <DashboardNavbar />

          {userFetchError && (
            <div className="container my-3">
              <div className="alert alert-warning d-flex justify-content-between align-items-center">
                <div>
                  <strong>Profile issue:</strong> {userFetchError}
                </div>
                <div>
                  <button className="btn btn-sm btn-primary me-2" onClick={async () => { await retryGetUserData(); getStartups(); }}>Retry</button>
                  <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => navigate('/login')}>Login</button>
                  <button className="btn btn-sm btn-link" onClick={() => clearUserFetchError()}>Dismiss</button>
                </div>
              </div>
            </div>
          )}

          <div className="scrollmenu">
            <h5
              onClick={() => {
                setCategory("Design and Tech");
              }}
            >
              Design and Tech
            </h5>
            <h5
              onClick={() => {
                setCategory("Art");
              }}
            >
              Arts
            </h5>
            <h5
              onClick={() => {
                setCategory("Film");
              }}
            >
              Film
            </h5>
            <h5
              onClick={() => {
                setCategory("Games");
              }}
            >
              Games
            </h5>
            <h5
              onClick={() => {
                setCategory("Music");
              }}
            >
              Music
            </h5>
            <h5
              onClick={() => {
                setCategory("Publishing");
              }}
            >
              Publishing
            </h5>
            <h5
              onClick={() => {
                setCategory("Finance");
              }}
            >
              Finance
            </h5>
            <h5
              onClick={() => {
                setCategory("Education");
              }}
            >
              Education
            </h5>
            <h5
              onClick={() => {
                setCategory("Eco-Friendly");
              }}
            >
              Eco-Friendly
            </h5>
          </div>
          <div className="container-fluid dashboard__container">
            <div className="container my-5">
              <div className="row gy-3">
                {FilteredList.length === 0 && (
                  <>
                    {" "}
                    <h2
                      className="text-center my-5"
                      style={{ color: "rgb(225, 41, 246)" }}
                    >
                      No Projects of this category has been here yet...
                    </h2>
                  </>
                )}
                {resourceList}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Dashboard;
