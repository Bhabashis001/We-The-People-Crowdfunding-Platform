import React, { useEffect, useState } from "react";
import "./Vision.css";
import Navbar from "./Navbar";
import vision from "../images/newvision.png";
import visionS from "../images/vision-1.png";

const Vision = () => {
  let [image, setImage] = useState(visionS);

  useEffect(() => {
    setTimeout(() => {
      setImage(vision);
    }, 1500);
  }, []);

  return (
    <>
      <Navbar />
      <div className="vision__main__container">
        <div className="container">
          <div className="first__section text-center my-5">
            <h1 className="vision__heading my-3">Our Vision</h1>
            <h2 className="vision__desc my-3">
              Our aim is to transform the landscape of crowdfunding, making it
              accessible, secure, and straightforward for young entrepreneurs.{" "}
              <br></br> By prioritizing these pillars, we empower the next
              generation of innovators.
            </h2>
            <h2 className="vision__desc my-3">
              Our mission extends beyond individual success, fostering a dynamic
              <br></br> crowdfunding ecosystem that engages and benefits society
              as a whole.
            </h2>
          </div>
          <div className="second__section">
            <img src={image} alt="main_image" className="vision__image" />
          </div>
        </div>
      </div>
    </>
  );
};

export default Vision;
