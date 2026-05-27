import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabase-client";
import "../styles/upload.css";

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
  const [uploadType, setUploadType] = useState("text"); // Managed states: 'text' | 'file'
  const [textQuestion, setTextQuestion] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [warning, setWarning] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setWarning("");
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
  };

  const handleUpload = async () => {
    setLoading(true);
    setWarning("");
    
    // 1. Get the chapter ID from DB based on selected name
    const { data: chapterData, error: chapterError } = await supabase
      .from('chapters')
      .select('id')
      .eq('name', chapter)
      .single();

    if (chapterError || !chapterData) {
      setWarning("Error: Could not find matching chapter architecture in database.");
      setLoading(false);
      return;
    }

    try {
      let insertPayload = { chapter_id: chapterData.id };

      if (uploadType === "text") {
        if (!textQuestion.trim()) {
          setWarning("Validation failed: Text question domain cannot be empty.");
          setLoading(false);
          return;
        }
        insertPayload.question_text = textQuestion;
      } else {
        if (!selectedFile) {
          setWarning("Validation failed: No document payload binary detected.");
          setLoading(false);
          return;
        }

        // Generate clean unique identifier for Supabase Object storage to prevent name collisions
        const fileExt = selectedFile.name.split('.').pop();
        const uniqueId = Math.random().toString(36).substring(2, 15);
        const filePath = `${subject.toLowerCase().replace(/ /g, "_")}/${uniqueId}.${fileExt}`;

        // Stream file block straight to target bucket
        const { error: storageError } = await supabase.storage
          .from('uploads')
          .upload(filePath, selectedFile);

        if (storageError) {
          throw new Error("Storage Core Error: " + storageError.message);
        }

        insertPayload.question_text = `[ATTACHMENT] ${selectedFile.name}`;
        insertPayload.file_url = filePath;
      }

      // 2. Commit transaction metadata cleanly to relational database
      const { error: insertError } = await supabase
        .from('questions')
        .insert([insertPayload]);

      if (insertError) {
        throw new Error("Database Mutation Error: " + insertError.message);
      }

      alert("Data payload committed successfully.");
      setTextQuestion("");
      setSelectedFile(null);
    } catch (error) {
      setWarning(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-page">
      <h2>UPLOAD CENTER</h2>

      <div className="upload-metadata-row">
        {/* Subject Selector */}
        <select value={subject} onChange={(e) => { setSubject(e.target.value); setChapter(""); setWarning(""); }}>
          <option value="">Select Subject</option>
          {Object.keys(RESOURCE_MANIFEST).map(s => <option key={s} value={s}>{s}</option>)}
        </select>

        {/* Dynamic Chapter Selector */}
        <select value={chapter} disabled={!subject} onChange={(e) => { setChapter(e.target.value); setWarning(""); }}>
          <option value="">{subject ? "Select Chapter" : "Select Subject First"}</option>
          {subject && RESOURCE_MANIFEST[subject].map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* Brutalist Switcher Mechanism */}
      <div className="toggle-container">
        <div className={`toggle-pill ${uploadType === 'file' ? 'active-file' : 'active-text'}`}></div>
        <button 
          type="button"
          className={`toggle-btn ${uploadType === 'file' ? 'active' : ''}`} 
          onClick={() => { setUploadType('file'); setWarning(""); }}
        >
          FILE UPLOAD
        </button>
        <button 
          type="button"
          className={`toggle-btn ${uploadType === 'text' ? 'active' : ''}`} 
          onClick={() => { setUploadType('text'); setWarning(""); }}
        >
          TEXT QUESTION
        </button>
      </div>

      {/* Input Core Switching Logic */}
      {uploadType === "text" ? (
        <div className="text-input-zone">
          <textarea
            placeholder="Paste your question structure here..."
            value={textQuestion}
            onChange={(e) => { setTextQuestion(e.target.value); setWarning(""); }}
          />
        </div>
      ) : (
        <>
          <div className="drop-zone">
            <p>Drag & drop your resource file here, or click to browse</p>
            <span>Supports PDFs, Images, and Docs</span>
            <input 
              type="file" 
              accept=".pdf,image/*,.doc,.docx,.txt" 
              onChange={handleFileChange} 
            />
          </div>

          {selectedFile && (
            <div className="file-list">
              <div className="file-item">
                <span className="file-name">{selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)</span>
                <button type="button" className="remove-btn" onClick={removeFile}>
                  REMOVE
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Validation Warning Feedback Box */}
      {warning && (
        <div className="validation-warning">
          {warning}
        </div>
      )}

      <button 
        className="upload-btn"
        disabled={
          loading || 
          !subject || 
          !chapter || 
          (uploadType === "text" ? !textQuestion.trim() : !selectedFile)
        }
        onClick={handleUpload}
      >
        {loading ? "COMPILING..." : "COMMIT TO DATABASE"}
      </button>
    </div>
  );
}