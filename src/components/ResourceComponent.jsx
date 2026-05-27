import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "../lib/supabase-client";
import "../styles/resourceComponent.css";

import {
  Orbit, FlaskConical, FunctionSquare, PenSquare, Binary,
  ArrowLeft, BookOpen, HelpCircle, Database, Lightbulb, CheckCircle,
  FileText, FileImage, ExternalLink, Eye
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
  const [isMissing, setIsMissing] = useState(false); // Validates storage asset synchronization

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

  // Extract file type extension safely to determine structural presentation strategy
  const getFileMeta = (url) => {
    if (!url) return { isImage: false, ext: "" };
    const ext = url.split('.').pop().toLowerCase();
    const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(ext);
    return { isImage, ext };
  };

  // Resolves the absolute secure URL straight from your Supabase storage infrastructure
  const getPublicStorageUrl = (path) => {
    if (!path) return "#";
    const { data } = supabase.storage.from('uploads').getPublicUrl(path);
    return data?.publicUrl || "#";
  };

  const { isImage } = getFileMeta(q.file_url);
  const assetUrl = getPublicStorageUrl(q.file_url);

  // Background pipeline validating if resource object is orphaned/deleted/broken inside cloud storage
  useEffect(() => {
    let isMounted = true;
    if (q.file_url && assetUrl !== "#") {
      fetch(assetUrl, { method: 'HEAD' })
        .then((res) => {
          // If the server returns ANY bad response (status code is NOT in the 200-299 range),
          // like a 400 Bad Request or a 404 Not Found, mark it as missing.
          if (!res.ok && isMounted) {
            setIsMissing(true);
          }
        })
        .catch((err) => {
          console.log("Network error checking file existence", err);
          // Fallback: If the request fails completely due to a network error on a dead asset, hide it too
          if (isMounted) setIsMissing(true);
        });
    }
    return () => { isMounted = false; };
  }, [q.file_url, assetUrl]);

  // Intercept render tree layout if storage payload object returns bad status (404/400)
  if (isMissing) return null;

  return (
    <div className={`question-card ${isSolved ? 'solved-card' : ''} ${q.file_url ? 'media-card-variant' : ''}`}>
      <div className="question-header">
        <Database size={14} /> 
        <span>
          {isSolved 
            ? "EVALUATION COMPLETE" 
            : q.file_url 
              ? isImage ? "IMAGE ATTACHMENT DISPLAY" : "DOCUMENT ATTACHMENT RESOURCE"
              : "EVALUATION TASK"
          }
        </span>
      </div>
      
      {/* Question context label fallback container */}
      <p className="question-body">
        {showHint ? "HINT // DATA_STREAM_ENCRYPTED: Analyze the core variables provided in the initial task block." : q.question_text}
      </p>

      {/* Dynamic Inline Media Injection Router Engine */}
      {q.file_url && !showHint && (
        <div className="media-rendering-zone">
          {isImage ? (
            /* Immersive inline image containment shield with max-fit processing */
            <div className="inline-image-frame">
              <img 
                src={assetUrl} 
                alt="Resource Task Data Block" 
                loading="lazy" 
                className="brutalist-embedded-img"
              />
              <div className="image-action-bar">
                <a href={assetUrl} target="_blank" rel="noopener noreferrer" className="img-expansion-link">
                  <Eye size={12} /> OPEN FULL RESOLUTION
                </a>
              </div>
            </div>
          ) : (
            /* Standalone fallback template layer for document formats like PDFs */
            <div className="media-attachment-container">
              <a 
                href={assetUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="media-download-link"
              >
                <FileText size={16} className="media-type-icon document-variant" />
                <span className="link-text">VIEW SHARED ATTACHMENT (PDF/DOC)</span>
                <ExternalLink size={12} className="link-arrow-icon" />
              </a>
            </div>
          )}
        </div>
      )}

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
  const [viewMode, setViewMode] = useState("text"); // Managed Toggle System States: 'text' | 'media'
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
        const { data } = await supabase
          .from('questions')
          .select('id, question_text, file_url, chapters!inner(name)')
          .eq('chapters.name', selectedChapter);
        
        setQuestions(data || []);
        setLoading(false);
      };
      fetchQuestions();
    }
  }, [selectedChapter]);

  // Client-side pipeline splits records matching state criteria criteria
  const filteredQuestions = questions.filter(q => {
    if (viewMode === "media") {
      return q.file_url !== null && q.file_url !== "";
    }
    return q.file_url === null || q.file_url === "";
  });

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

        {/* Brutalist Module Switcher Control Interface Layer */}
        <div className="toggle-container style-manifest-override">
          <div className={`toggle-pill ${viewMode === 'media' ? 'active-file' : 'active-text'}`}></div>
          <button 
            type="button"
            className={`toggle-btn ${viewMode === 'media' ? 'active' : ''}`} 
            onClick={() => setViewMode('media')}
          >
            MEDIA RESOURCES
          </button>
          <button 
            type="button"
            className={`toggle-btn ${viewMode === 'text' ? 'active' : ''}`} 
            onClick={() => setViewMode('text')}
          >
            TEXT TASKS
          </button>
        </div>

        <div className="questions-list-container">
          {loading ? (
            <p className="loading-stream-text">SYNCING DATA STREAMS...</p>
          ) : filteredQuestions.length === 0 ? (
            <div className="question-card empty-state-card">
              <div className="question-header" style={{ color: "var(--taupe)" }}>
                <Database size={14} /> <span>[DATA_STREAM: UNPOPULATED]</span>
              </div>
              <p className="question-body" style={{ color: "var(--taupe)", fontFamily: "var(--font-mono)", fontSize: "0.9rem" }}>
                NO ACTIVE {viewMode.toUpperCase()} EVALUATION TASKS HAVE BEEN COMPILED FOR THIS SPECIFIC MODULE MATRIX YET. INTERNAL COMPILERS RUNNING STABLE.
              </p>
            </div>
          ) : (
            filteredQuestions.map((q) => (
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