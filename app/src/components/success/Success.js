import React from "react";
import { FaCheckCircle } from "react-icons/fa";

const Success = () => {
  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <FaCheckCircle size={80} color="green" />
      <h2>Success!</h2>
      <p>Your action was completed successfully.</p>
    </div>
  );
};

export default Success;
