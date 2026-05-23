import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "../lib/supabase-client"; 
import "../styles/resourceComponent.css";

import {
  Orbit, FlaskConical, FunctionSquare, PenSquare, Binary,
  ArrowLeft, BookOpen, HelpCircle, Database
} from "lucide-react";

// Official 2026-27 CBSE Chapter Core Data
const RESOURCE_MANIFEST = {
  physics: { name: "PHYSICS", glaze: "DYNAMIC FIELD MATRIX", icon: <Orbit size={28} />, chapters: ["Electric Charges and Fields", "Electrostatic Potential and Capacitance", "Current Electricity", "Moving Charges and Magnetism", "Magnetism and Matter", "Electromagnetic Induction", "Alternating Current", "Electromagnetic Waves", "Ray Optics and Optical Instruments", "Wave Optics", "Dual Nature of Radiation and Matter", "Atoms", "Nuclei", "Semiconductor Electronics"] },
  chemistry: { name: "CHEMISTRY", glaze: "REACTIVE BONDING MASK", icon: <FlaskConical size={28} />, chapters: ["Solutions", "Electrochemistry", "Chemical Kinetics", "d-and f-Block Elements", "Coordination Compounds", "Haloalkanes and Haloarenes", "Alcohols, Phenols and Ethers", "Aldehydes, Ketones and Carboxylic Acids", "Amines", "Biomolecules"] },
  mathematics: { name: "MATHEMATICS", glaze: "ABSTRACT ALGEBRAIC TRACK", icon: <FunctionSquare size={28} />, chapters: ["Relations and Functions", "Inverse Trigonometric Functions", "Matrices", "Determinants", "Continuity and Differentiability", "Applications of Derivatives", "Integrals", "Applications of Integrals", "Differential Equations", "Vector Algebra", "Three-Dimensional Geometry", "Linear Programming", "Probability"] },
  english: { name: "ENGLISH", glaze: "THOUGHTFUL LITERATURE", icon: <PenSquare size={28} />, chapters: ["Flamingo: The Last Lesson", "Flamingo: Lost Spring", "Flamingo: Deep Water", "Flamingo: The Rattrap", "Flamingo: Indigo", "Flamingo: Poets and Pancakes", "Flamingo: The Interview", "Flamingo: Going Places", "Poetry: My Mother at Sixty-Six", "Poetry: Keeping Quiet", "Poetry: A Thing of Beauty", "Poetry: A Roadside Stand", "Poetry: Aunt Jennifer’s Tigers", "Vistas: The Third Level", "Vistas: The Tiger King", "Vistas: Journey to the End of the Earth", "Vistas: The Enemy", "Vistas: On the Face of It", "Memories of Childhood"] },
  computer: { name: "COMPUTER", glaze: "EFFICIENT LOGIC MEMORY", icon: <Binary size={28} />, chapters: ["Computational Thinking and Programming – Python Recap", "Functions in Python", "Exception Handling in Python", "File Handling (Text, Binary, CSV)", "Data Structures: Stack using Lists", "Computer Networks: Topologies & Evolution", "Network Protocols and Web Services", "Database Management Concepts", "Structured Query Language (SQL)", "Python-SQL Database Connectivity"] }
};

export const ResourceComponent = () => {
  const location = useLocation();
  const [selectedSubject, setSelectedSubject] = useState(() => location.state?.selectedSubject?.toLowerCase() || null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedChapter) {
      const fetchQuestions = async () => {
        setLoading(true);
        const { data, error } = await supabase
          .from('questions')
          .select('id, question_text, chapters!inner(name)')
          .eq('chapters.name', selectedChapter);
        
        if (error) console.error("Database Error:", error);
        else setQuestions(data || []);
        setLoading(false);
      };
      fetchQuestions();
    }
  }, [selectedChapter]);

  const handleBackToChapters = () => setSelectedChapter(null);
  const handleBackToSubjects = () => { setSelectedSubject(null); setSelectedChapter(null); };

  // VIEW 2: QUESTION DATA STREAM
  if (selectedSubject && selectedChapter) {
    const subjectData = RESOURCE_MANIFEST[selectedSubject];
    return (
      <div className="resource-sub-wrapper">
        <button className="resource-back-btn" onClick={handleBackToChapters}>
          <ArrowLeft size={16} /> BACK TO CHAPTER MANIFEST
        </button>

        <div className="resource-display-div">
          <div className="subject-card view-header-card">
            <div className="subject-icon">{subjectData?.icon}</div>
            <div className="subject-glaze">{subjectData?.glaze} // MODULE CONSOLE</div>
            <h2 className="subject-name">{selectedChapter.toUpperCase()}</h2>
            <p className="question-count">TOTAL LOADED: {questions.length} ENTRIES</p>
          </div>
        </div>

        <div className="questions-list-container">
          {loading ? (
            <div className="sandbox-terminal-alert"><p>SYNCING DATA STREAMS...</p></div>
          ) : questions.length > 0 ? (
            questions.map((q) => (
              <div key={q.id} className="question-card">
                <div className="question-header">
                  <Database size={14} /> <span>EVALUATION TASK</span>
                </div>
                <p className="question-body">{q.question_text}</p>
              </div>
            ))
          ) : (
            <div className="sandbox-terminal-alert">
              <HelpCircle size={40} className="terminal-icon" />
              <h4>[NO DATA FOUND]</h4>
              <p>The repository for this module is currently in standby.</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // VIEW 1: CHAPTER EXPLORER
  if (selectedSubject && RESOURCE_MANIFEST[selectedSubject]) {
    const subjectData = RESOURCE_MANIFEST[selectedSubject];
    return (
      <div className="resource-sub-wrapper">
        <button className="resource-back-btn" onClick={handleBackToSubjects}><ArrowLeft size={16} /> BACK TO MONITOR CONSOLE</button>
        <div className="chapter-directory-grid">
          {subjectData.chapters.map((chapter, index) => (
            <div className="chapter-item-row" key={index} onClick={() => setSelectedChapter(chapter)}>
              <div className="chapter-row-left"><BookOpen size={16} /> <span className="chapter-title-text">{index + 1}. {chapter}</span></div>
              <span className="chapter-action-badge">[VIEW MODULE]</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // VIEW 0: SUBJECT SELECTION
  return (
    <div className="resource-sub-wrapper">
      <div className="subjects-div">
        {Object.entries(RESOURCE_MANIFEST).map(([key, data]) => (
          <div className="subject-card" key={key} onClick={() => setSelectedSubject(key)}>
            <div className="subject-icon">{data.icon}</div>
            <div className="subject-glaze">{data.glaze}</div>
            <h3 className="subject-name">{data.name}</h3>
            <p className="question-count">[EXPLORE MANIFEST]</p>
          </div>
        ))}
      </div>
    </div>
  );
};