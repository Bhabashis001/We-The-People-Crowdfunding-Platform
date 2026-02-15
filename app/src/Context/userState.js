import { useState, useEffect } from "react";
import UserContext from "./userContext";
import axios from "../Axios/axios";

const UserState = (props) => {
  const [user, setUser] = useState(null);
  const [alert, setAlert] = useState(null);
  const [startups, setStartups] = useState([]);
  const [startupData, setStartupData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [orderAmount, setOrderAmount] = useState(0);
  const [userStartup, setUserStartup] = useState([]);
  const [investmentData, setInvestmentData] = useState([]);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [userFetchError, setUserFetchError] = useState("");

  /* ================== ALERT ================== */
  const showAlert = (message, type = "info") => {
    console.log(`[ALERT] (${type})`, message);
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 2000);
  };

  /* ================== APP LOAD ================== */
  useEffect(() => {
    const tokenExists = !!localStorage.getItem("token");
    console.log("[INIT] App loaded");
    console.log("[AUTH] Token exists:", tokenExists);

    if (tokenExists) {
      console.log("[INIT] Fetching user data & startups...");
      getUserData();
      getUserStartups();
    } else {
      console.warn("[AUTH] No token found. Skipping protected API calls.");
    }
  }, []);

  /* ================== USER ================== */
  const getUserData = async () => {
    console.log("[API] GET /api/auth/getuser");
    // clear previous fetch error before attempting
    setUserFetchError("");

    try {
      const response = await axios.get("/api/auth/getuser", {
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
      });

      console.log("[SUCCESS] User data fetched:", response.data.data);
      setUser(response.data.data);
    } catch (error) {
      console.error(
        "[ERROR] getUserData:",
        error.response?.status,
        error.response?.data
      );
      setUser(null);
      // provide a friendly message for the UI to surface
      const msg = error.response?.data?.error || error.response?.data?.msg || "Unable to fetch profile. Please login again.";
      setUserFetchError(msg);
    }
  };

  /* ================== STARTUPS ================== */
  const getStartups = async () => {
    console.log("[API] GET /api/investor/fetch-startups");

    try {
      const response = await axios.get("/api/investor/fetch-startups", {
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
      });

      console.log("[SUCCESS] Startups fetched:", response.data.data);
      if (response.data.success) {
        setStartups(response.data.data);
      }
    } catch (error) {
      console.error(
        "[ERROR] getStartups:",
        error.response?.status,
        error.response?.data
      );
    }
  };

  const getUserStartups = async () => {
    console.log("[API] GET /api/investor/fetchuserStartups");

    try {
      const response = await axios.get("/api/investor/fetchuserStartups", {
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
      });

      console.log("[SUCCESS] User startups:", response.data.data);
      if (response.data.success) {
        setUserStartup(response.data.data);
      }
    } catch (error) {
      console.error(
        "[ERROR] getUserStartups:",
        error.response?.status,
        error.response?.data
      );
      // Treat 404 (no startups) as an empty list rather than an application error
      if (error.response?.status === 404) {
        console.warn("[INFO] No startups found for current user. Initializing empty list.");
        setUserStartup([]);
      }
    }
  };

  /* ================== INVESTMENTS ================== */
  const getInvestmentData = async () => {
    console.log("[API] GET /api/investor/getTransactions");

    try {
      const response = await axios.get("/api/investor/getTransactions", {
        headers: {
          "Content-Type": "application/json",
          "auth-token": localStorage.getItem("token"),
        },
      });

      console.log("[SUCCESS] Investment data:", response.data.data);
      if (response.data.success) {
        setInvestmentData(response.data.data);
      }
    } catch (error) {
      console.error(
        "[ERROR] getInvestmentData:",
        error.response?.status,
        error.response?.data
      );
    }
  };

  /* ================== RAZORPAY ================== */
  const loadRazorpay = () => {
    console.log("[PAYMENT] Initializing Razorpay");

    if (!localStorage.getItem("token")) {
      console.warn("[PAYMENT] Blocked: User not authenticated");
      showAlert("Please login first", "error");
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";

    script.onerror = () => {
      console.error("[PAYMENT] Razorpay SDK failed to load");
      showAlert("Razorpay SDK failed to load", "error");
    };

    script.onload = async () => {
      try {
        console.log("[PAYMENT] Creating order...");
        setLoading(true);

        const orderRes = await axios.post(
          "/api/investor/create-order",
          { amount: orderAmount * 100 },
          {
            headers: {
              "Content-Type": "application/json",
              "auth-token": localStorage.getItem("token"),
            },
          }
        );

        console.log("[PAYMENT] Order created:", orderRes.data.order);

        const keyRes = await axios.get("/api/investor/get-razorpay-key", {
          headers: {
            "Content-Type": "application/json",
            "auth-token": localStorage.getItem("token"),
          },
        });

        console.log("[PAYMENT] Razorpay key received");

        const { amount, id: order_id, currency } = orderRes.data.order;

        const options = {
          key: keyRes.data.key,
          amount: amount.toString(),
          currency,
          name: "We The People",
          description: "Startup Investment",
          order_id,
          handler: async (response) => {
            console.log("[PAYMENT] Payment success:", response);

            const verifyRes = await axios.post(
              "/api/investor/pay-order",
              {
                amount: amount / 100,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature,
                investor_id: user?._id,
                startup_id: startupData?._id,
              },
              {
                headers: {
                  "Content-Type": "application/json",
                  "auth-token": localStorage.getItem("token"),
                },
              }
            );

            console.log("[PAYMENT] Verification response:", verifyRes.data);

            if (verifyRes.data.success) {
              showAlert(verifyRes.data.msg, "success");
              // persist startup id so the review page can identify which startup to rate
              try { localStorage.setItem('reviewStartupId', startupData?._id || ''); } catch (e) { console.warn('Could not persist reviewStartupId', e); }
              setPaymentSuccess(true);
            }
          },
          theme: { color: "#80c0f0" },
        };

        setLoading(false);
        new window.Razorpay(options).open();
      } catch (error) {
        setLoading(false);
        console.error(
          "[PAYMENT ERROR]",
          error.response?.status,
          error.response?.data
        );
        showAlert("Payment failed", "error");
      }
    };

    document.body.appendChild(script);
  };

  /* ================== CONTEXT ================== */
  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        getUserData,
        alert,
        showAlert,
        startups,
        setStartups,
        getStartups,
        startupData,
        setStartupData,
        loadRazorpay,
        orderAmount,
        setOrderAmount,
        getUserStartups,
        userStartup,
        getInvestmentData,
        investmentData,
        paymentSuccess,
        setPaymentSuccess,
        loading,
        userFetchError,
        setUserFetchError,
        clearUserFetchError: () => setUserFetchError(''),
        retryGetUserData: async () => { setUserFetchError(''); await getUserData(); }
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};

export default UserState;
