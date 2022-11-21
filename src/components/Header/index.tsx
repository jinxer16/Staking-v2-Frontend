
import React from "react";
import "./header.css";

const Header: React.FC = () => {
  return (
    <div
      className="wow fadeInDown"
      data-wow-duration="0.9s"
      data-wow-delay="0.4s"
    >
      <div className="headercontainer">
        <div className="current_price">
          {/* <h3>36,641.20 <span>+10.25%</span></h3> */}
          <div className="leftSection">
            <h6>
              <img src="images/tokenicon.png" alt="" className="borioicon" />
            </h6>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
