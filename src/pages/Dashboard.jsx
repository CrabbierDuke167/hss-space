import React from "react";
import Navbar from "../components/Navbar";
import DashboardComponent from "../components/dashboard/compOne";
import ComponentTwo from "../components/dashboard/WeeklySubjectGraph";
import ComponentThree from "../components/dashboard/SubjectSnapshot";
import "../styles/dashboard.css";

export default function Dashboard() {
  return (
    <div className="dashboard-page">
      <Navbar />
      {/* Using the same wrapper class to ensure the new component 
        inherits your established entry animations/styling.*/}
      <main className="content-slide-up" key="dashboard-entry">
        {/* <DashboardComponent /> == 1st one */}
        <DashboardComponent />
        <ComponentTwo />
        <ComponentThree />
      </main>
    </div>
  );
}