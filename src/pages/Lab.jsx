import React from "react";
import Navbar from "../components/Navbar";
import "../styles/lab.css";


export default function Lab() {
  return (
    <div className="lab-page">
      <Navbar />
      <main className="lab-container">
        <header className="lab-header slide-up">
          <h1>LAB</h1>
          <p className="subtitle">EXPERIMENTAL COMPUTE // 2026.05.23</p>
        </header>

        <section className="lab-body slide-up">
          <div className="data-block">
            <p className="label">PROJECT STATUS</p>
            <p className="value">PENDING // PIPELINE OPTIMIZATION</p>
          </div>
          <div className="data-block">
            <p className="label">MODULES</p>
            <p className="value">AWAITING SYSTEM INTEGRATION</p>
          </div>
          <p className="footer-note">
            // CORE PROCESSORS IDLE. AWAITING USER INPUT TO COMMENCE SEQUENCE.
          </p>
        </section>
      </main>
    </div>
  );
}