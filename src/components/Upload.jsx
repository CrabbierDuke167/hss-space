import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabase-client";
import "../styles/upload.css";

// Same manifest used in ResourceComponent for consistency
const RESOURCE_MANIFEST = {
  'COMPUTER SCIENCE': ["Computational Thinking and Programming – Python Recap", "Functions in Python", "Exception Handling in Python", "File Handling (Text, Binary, CSV)", "Data Structures: Stack using Lists", "Computer Networks: Topologies & Evolution", "Network Protocols and Web Services", "Database Management Concepts", "Structured Query Language (SQL)", "Python-SQL Database Connectivity"],
  'MATHEMATICS': ["Relations and Functions", "Inverse Trigonometric Functions", "Matrices", "Determinants", "Continuity and Differentiability", "Applications of Derivatives", "Integrals", "Applications of Integrals", "Differential Equations", "Vector Algebra", "Three-Dimensional Geometry", "Linear Programming", "Probability"],
  'PHYSICS': ["Electric Charges and Fields", "Electrostatic Potential and Capacitance", "Current Electricity", "Moving Charges and Magnetism", "Magnetism and Matter", "Electromagnetic Induction", "Alternating Current", "Electromagnetic Waves", "Ray Optics and Optical Instruments", "Wave Optics", "Dual Nature of Radiation and Matter", "Atoms", "Nuclei", "Semiconductor Electronics"],
  'CHEMISTRY': ["Solutions", "Electrochemistry", "Chemical Kinetics", "d-and f-Block Elements", "Coordination Compounds", "Haloalkanes and Haloarenes", "Alcohols, Phenols and Ethers", "Aldehydes, Ketones and Carboxylic Acids", "Amines", "Biomolecules"],
  'ENGLISH': ["Flamingo: The Last Lesson", "Flamingo: Lost Spring", "Flamingo: Deep Water", "Flamingo: The Rattrap", "Flamingo: Indigo", "Flamingo: Poets and Pancakes", "Flamingo: The Interview", "Flamingo: Going Places", "Poetry: My Mother at Sixty-Six", "Poetry: Keeping Quiet", "Poetry: A Thing of Beauty", "Poetry: A Roadside Stand", "Poetry: Aunt Jennifer’s Tigers", "Vistas: The Third Level", "Vistas: The Tiger King", "Vistas: Journey to the End of the Earth", "Vistas: The Enemy", "Vistas: On the Face of It", "Memories of Childhood"]
};

export default function Upload() {
  const [subject, setSubject] = useState("");
  const [chapter, setChapter] = useState("");
  const [textQuestion, setTextQuestion] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    setLoading(true);
    
    // 1. Get the chapter ID from DB based on selected name
    const { data: chapterData, error: chapterError } = await supabase
      .from('chapters')
      .select('id')
      .eq('name', chapter)
      .single();

    if (chapterError || !chapterData) {
      alert("Error: Could not find chapter in database.");
      setLoading(false);
      return;
    }

    // 2. Insert the question
    const { error: insertError } = await supabase
      .from('questions')
      .insert([{ chapter_id: chapterData.id, question_text: textQuestion }]);

    if (insertError) {
      alert("Upload failed: " + insertError.message);
    } else {
      alert("Upload successful!");
      setTextQuestion("");
    }
    setLoading(false);
  };

  return (
    <div className="upload-page">
      <h2>UPLOAD CENTER</h2>


      <div className="upload-metadata-row">
        {/* Subject Selector */}
        <select value={subject} onChange={(e) => { setSubject(e.target.value); setChapter(""); }}>
          <option value="">Select Subject</option>
          {Object.keys(RESOURCE_MANIFEST).map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        {/* Dynamic Chapter Selector */}
        <select value={chapter} disabled={!subject} onChange={(e) => setChapter(e.target.value)}>
          <option value="">{subject ? "Select Chapter" : "Select Subject First"}</option>
          {subject && RESOURCE_MANIFEST[subject].map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="text-input-zone">
        <textarea
          placeholder="Paste your question here..."
          value={textQuestion}
          onChange={(e) => setTextQuestion(e.target.value)}
        />
      </div>

      <button 
        className="upload-btn"
        disabled={loading || !subject || !chapter || !textQuestion.trim()}
        onClick={handleUpload}
      >
        {loading ? "UPLOADING..." : "COMMIT TO DATABASE"}
      </button>
    </div>
  );
}