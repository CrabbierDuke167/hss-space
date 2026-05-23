import React from "react";
import Navbar from "../components/Navbar";
import { ResourceComponent } from "../components/ResourceComponent";
import "../index.css";


export default function Resource() {
  return (
    <div className="resource-page">
      <Navbar />
      <ResourceComponent />
    </div>
  );
}