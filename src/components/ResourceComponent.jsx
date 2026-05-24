import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "../lib/supabase-client";
import "../styles/resourceComponent.css";

import {
  Orbit, FlaskConical, FunctionSquare, PenSquare, Binary,
  ArrowLeft, BookOpen, HelpCircle, Database, Lightbulb, CheckCircle
} from "lucide-react";

const RESOURCE_MANIFEST = {
  physics: { name: "PHYSICS", glaze: "DYNAMIC FIELD MATRIX", icon: <Orbit size={28} />, chapters: ["Electric Charges and Fields", "Electrostatic Potential and Capacitance", "Current Electricity", "Moving Charges and Magnetism", "Magnetism and Matter", "Electromagnetic Induction", "Alternating Current", "Electromagnetic Waves", "Ray Optics and Optical Instruments", "Wave Optics", "Dual Nature of Radiation and Matter", "Atoms", "Nuclei", "Semiconductor Electronics"] },
  chemistry: { name: "CHEMISTRY", glaze: "REACTIVE BONDING MASK", icon: <FlaskConical size={28} />, chapters: ["Solutions", "Electrochemistry", "Chemical Kinetics", "d-and f-Block Elements", "Coordination Compounds", "Haloalkanes and Haloarenes", "Alcohols, Phenols and Ethers", "Aldehydes, Ketones and Carboxylic Acids", "Amines", "Biomolecules"] },
  mathematics: { name: "MATHEMATICS", glaze: "ABSTRACT ALGEBRAIC TRACK", icon: <FunctionSquare size={28} />, chapters: ["Relations and Functions", "Inverse Trigonometric Functions", "Matrices", "Determinants", "Continuity and Differentiability", "Applications of Derivatives", "Integrals", "Applications of Integrals", "Differential Equations", "Vector Algebra", "Three-Dimensional Geometry", "Linear Programming", "Probability"] },
  english: { name: "ENGLISH", glaze: "THOUGHTFUL LITERATURE", icon: <PenSquare size={28} />, chapters: ["Flamingo: The Last Lesson", "Flamingo: Lost Spring", "Flamingo: Deep Water", "Flamingo: The Rattrap", "Flamingo: Indigo", "Flamingo: Poets and Pancakes", "Flamingo: The Interview", "Flamingo: Going Places", "Poetry: My Mother at Sixty-Six", "Poetry: Keeping Quiet", "Poetry: A Thing of Beauty", "Poetry: A Roadside Stand", "Poetry: Aunt Jennifer’s Tigers", "Vistas: The Third Level", "Vistas: The Tiger King", "Vistas: Journey to the End of the Earth", "Vistas: The Enemy", "Vistas: On the Face of It", "Memories of Childhood"] },
  computer: { name: "COMPUTER", glaze: "EFFICIENT LOGIC MEMORY", icon: <Binary size={28} />, chapters: ["Computational Thinking and Programming – Python Recap", "Functions in Python", "Exception Handling in Python", "File Handling (Text, Binary, CSV)", "Data Structures: Stack using Lists", "Computer Networks: Topologies & Evolution", "Network Protocols and Web Services", "Database Management Concepts", "Structured Query Language (SQL)", "Python-SQL Database Connectivity"] }
};

const QuestionCard = ({ q, userId, subjectKey }) => {
  const [showHint, setShowHint] = useState(false);
  const [hasUsedHint, setHasUsedHint] = useState(false);
  const [isSolved, setIsSolved] = useState(false);

  const handleSolveAction = async () => {
    const confirmed = window.confirm("Are you sure you want to mark this task as solved?");
    if (!confirmed) return;

    try {
      // 1. Increment Global Stats (RPC)
      await supabase.rpc('increment_global_stats', { 
        uid: userId, 
        add_hint: hasUsedHint ? 1 : 0, 
        add_solve: 1 
      });

      // 2. Increment Subject Stats (RPC)
      await supabase.rpc('increment_subject_stats', { 
        uid: userId, 
        sub_name: subjectKey 
      });

      setIsSolved(true);
    } catch (err) {
      console.error("Update failed", err);
      alert("Error syncing progress. Please check connection.");
    }
  };

  return (
    <div className={`question-card ${isSolved ? 'solved-card' : ''}`}>
      <div className="question-header">
        <Database size={14} /> <span>{isSolved ? "EVALUATION COMPLETE" : "EVALUATION TASK"}</span>
      </div>
      <p className="question-body">
        {showHint ? "HINT // DATA_STREAM_ENCRYPTED: Analyze the core variables provided in the initial task block." : q.question_text}
      </p>

      {!isSolved && (
        <div className="q-action-row">
          <button className="q-btn hint" onClick={() => { setShowHint(!showHint); setHasUsedHint(true); }}>
            <Lightbulb size={14} />
          </button>
          <button className="q-btn solved" onClick={handleSolveAction}>
            <CheckCircle size={14} />
          </button>
        </div>
      )}
    </div>
  );
};

export const ResourceComponent = () => {
  const location = useLocation();
  const [selectedSubject, setSelectedSubject] = useState(() => location.state?.selectedSubject?.toLowerCase() || null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUserId(data?.user?.id || null));
  }, []);

  useEffect(() => {
    if (selectedChapter) {
      const fetchQuestions = async () => {
        setLoading(true);
        const { data } = await supabase.from('questions').select('id, question_text, chapters!inner(name)').eq('chapters.name', selectedChapter);
        setQuestions(data || []);
        setLoading(false);
      };
      fetchQuestions();
    }
  }, [selectedChapter]);

  // --- QUESTIONS LEVEL DIRECTORY VIEW ---
  if (selectedSubject && selectedChapter) {
    return (
      <div className="resource-sub-wrapper">
        <button className="resource-back-btn" onClick={() => setSelectedChapter(null)}><ArrowLeft size={16} /> BACK</button>
        <div className="resource-display-div">
          <div className="subject-card view-header-card">
            <h2 className="subject-name">{selectedChapter.toUpperCase()}</h2>
          </div>
        </div>
        <div className="questions-list-container">
          {loading ? (
            <p className="loading-stream-text">SYNCING DATA STREAMS...</p>
          ) : questions.length === 0 ? (
            /* Custom professional empty fallback matrix */
            <div className="question-card empty-state-card">
              <div className="question-header" style={{ color: "var(--taupe)" }}>
                <Database size={14} /> <span>[DATA_STREAM: UNPOPULATED]</span>
              </div>
              <p className="question-body" style={{ color: "var(--taupe)", fontFamily: "var(--font-mono)", fontSize: "0.9rem" }}>
                NO ACTIVE EVALUATION TASKS HAVE BEEN COMPILED FOR THIS SPECIFIC MODULE MATRIX YET. INTERNAL COMPILERS RUNNING STABLE.
              </p>
            </div>
          ) : (
            questions.map((q) => (
              <QuestionCard key={q.id} q={q} userId={userId} subjectKey={selectedSubject} />
            ))
          )}
        </div>
      </div>
    );
  }

  // --- CHAPTERS DIRECTORY VIEW ---
  if (selectedSubject) {
    return (
      <div className="resource-sub-wrapper">
        <button className="resource-back-btn" onClick={() => {setSelectedSubject(null); setSelectedChapter(null);}}><ArrowLeft size={16} /> BACK</button>
        <div className="chapter-directory-grid">
          {RESOURCE_MANIFEST[selectedSubject].chapters.map((c, i) => (
            <div className="chapter-item-row" key={i} onClick={() => setSelectedChapter(c)}>
              <BookOpen className="book-icon" size={16} /> {c}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // --- MAIN SUBJECT SELECTION GRID ---
  return (
    <div className="resource-sub-wrapper">
      <div className="subjects-grid">
        {Object.entries(RESOURCE_MANIFEST).map(([key, data]) => (
          <div className="subject-card-enhanced" key={key} onClick={() => setSelectedSubject(key)}>
            
            {/* Card Header: Meta Info */}
            <div className="subject-card-header">
              <span className="sys-badge">[SYS_LEVEL: XII]</span>
              <span className="mod-count">{data.chapters.length} MODULES</span>
            </div>

            {/* Card Body: Main Icon and Title */}
            <div className="subject-card-body">
              <div className="icon-wrapper">
                {data.icon}
              </div>
              <div className="title-wrapper">
                <h3>{data.name}</h3>
                <p className="glaze-text">{data.glaze}</p>
              </div>
            </div>

            {/* Card Footer: Status Block */}
            <div className="subject-card-footer">
              <div className="status-indicator">
                <span className="blink-dot"></span> SECURE CONNECTION
              </div>
              <span className="action-arrow">ACCESS_DIR &rarr;</span>
            </div>
            
          </div>
        ))}
      </div>
    </div>
  );
};