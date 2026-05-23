import React from "react";
import { Bookmark, SkipForward } from "lucide-react";

export default function Hero() {
  return (
    <section className="hero">
      {/* TITLE */}
      <div className="hero-head">
        <h1>QUESTION OF THE DAY</h1>
      </div>
      {/* FRACTAL TEXT */}
      <div className="hero-decor-text-div">
        <p>SCORE_INTERFACE // FRACTAL</p>
      </div>
      {/* SUBJECT DATA */}
      <div className="daily-question-data">
        <p>#SUBJECT // CLASS 12 // #CHAPTER</p>
      </div>
      {/* QUESTION */}
      <div className="daily-question">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.
      </div>
      {/* BUTTONS */}
      <div className="hero-btn-div">
        <div className="hero-btn">
          <Bookmark size={20} />
          <span>SAVE</span>
        </div>
        <div className="hero-btn">
          <SkipForward size={20} />
          <span>SKIP</span>
        </div>
      </div>
    </section>
  );
}