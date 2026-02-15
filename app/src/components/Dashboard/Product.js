import React from "react";
import "./Product.css";
import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardNavbar from "./DashboardNavbar";
import ProductCard from "./ProductCard";
import axios from "../../Axios/axios";
import UserContext from "../../Context/userContext";
const Product = () => {
  const param = useParams();
  const context = useContext(UserContext);
  const { setStartupData, loadRazorpay, startupData } = context;
  const navigate = useNavigate();
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    // getUserData();
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
    const fetchStartupsData = async () => {
      try {
        const response = await axios.post(
          `/api/investor/fetch-startup`,
          { startup_id: param.id },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.success) {
          setStartupData(response.data.data);
        }
      } catch (error) {
        console.log(error);
        // Set a not-found state so we can show a friendly message instead of the generic 404
        setNotFound(true);
      }
    };
    fetchStartupsData();
  }, [param.id]);

  if (notFound) {
    return (
      <>
        <DashboardNavbar />
        <div className="container my-5">
          <div className="alert alert-warning text-center">Startup not found. <button className="btn btn-link" onClick={() => navigate('/dashboard')}>Go back to Dashboard</button></div>
        </div>
      </>
    );
  }

  return (
    <>
      <DashboardNavbar />
      {startupData && (
        <>
          <ProductCard data={startupData}></ProductCard>
        </>
      )}
    </>
  );
};

export default Product;
