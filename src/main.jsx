import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // Ensure this is here
import { TimerProvider } from "./components/dashboard/TimerProvider.jsx";
import App from "./App.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter> 
      <TimerProvider>
        <App />
      </TimerProvider>
    </BrowserRouter>
  </React.StrictMode>
);