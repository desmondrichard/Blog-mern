import React from "react";
import "./GlobalFooter.css";

const GlobalFooter = () => {
  const year = new Date().getFullYear();
  return (
    <div className="globalFooterContainer bg-primary">
      <p className="globalFooterText">Copyright © {year} Your Company. All rights reserved.</p>
    </div>
  );
};

export default GlobalFooter;
