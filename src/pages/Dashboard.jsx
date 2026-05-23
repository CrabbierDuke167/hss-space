import React from "react";
import Navbar from "../components/Navbar";
import "../styles/dashboard.css";

export default function Dashboard() {
  return (
    <div className="dashboard-page">
      <Navbar />
      <main className="coming-soon-wrapper">
        {/* The 'key' forces the animation to re-run on component mount/remount */}
        <div className="content-slide-up" key="dashboard-entry">
          <p className="mono-label">[ SYSTEM_STATUS // INITIALIZING ]</p>
          <h1 className="coming-soon-heading">COMING<h1>SOON</h1></h1>
          <p className="teeny-text">
            CORE MODULES UNDER FUSION. <br />
            PREPARING LIVE DATA SYNC AND ANALYTIC INTERFACE.
          </p>
          <div className="accent-bar" />
        </div>
      </main>
    </div>
  );
}