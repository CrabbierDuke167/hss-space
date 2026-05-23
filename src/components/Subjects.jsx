import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/subjects.css";

import {
  Orbit,
  FlaskConical,
  FunctionSquare,
  PenSquare,
  Binary
} from "lucide-react";

export const Subjects = () => {
  const navigate = useNavigate();

  const subjects = [
    {
      name: "PHYSICS",
      glaze: "DYNAMIC",
      questions: "124 Q",
      icon: <Orbit size={28}/>
    },
    {
      name: "CHEMISTRY",
      glaze: "REACTIVE",
      questions: "98 Q",
      icon: <FlaskConical size={28}/>
    },
    {
      name: "MATHEMATICS",
      glaze: "ABSTRACT",
      questions: "86 Q",
      icon: <FunctionSquare size={28}/>
    },
    {
      name: "ENGLISH",
      glaze: "THOUGHTFUL",
      questions: "62 Q",
      icon: <PenSquare size={28}/>
    },
    {
      name: "COMPUTER",
      glaze: "EFFICIENT",
      questions: "74 Q",
      icon: <Binary size={28}/>
    }
  ];

  const handleCardClick = (subjectName) => {
    // Navigates directly to the resource layout route and passes the tag
    navigate("/resource", { 
      state: { selectedSubject: subjectName } 
    });
  };

  return (
    <div className="subjects-wrapper">
      <div className="subjects-div">
        {subjects.map((subject) => (
          <div
            className="subject-card"
            key={subject.name}
            onClick={() => handleCardClick(subject.name)}
          >
            <div className="subject-icon">
              {subject.icon}
            </div>

            <div className="subject-glaze">
              {subject.glaze}
            </div>

            <h3 className="subject-name">
              {subject.name}
            </h3>

            <p className="question-count">
              {subject.questions}
            </p>
          </div>
        ))}
      </div>

      <div className="subject-palette">
        <p className="palette-heading">
            [SUBJECT GRID: 5-COL, TERRACOTTA_ACCENT, DITHERED, BITMAP.MASK]
        </p>

        <div className="palette-dots">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            <span></span>
        </div>
      </div>
    </div>
  );
};