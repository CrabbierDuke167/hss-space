import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { Check, Trash2, X } from "lucide-react";
import { supabase } from "../lib/supabase-client";
import "../styles/saved.css";

export default function Saved() {
  const [savedQuestions, setSavedQuestions] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [confirmDone, setConfirmDone] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSaved();
  }, []);

  const fetchSaved = async () => {
    try {
      setLoading(true);

      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("User error:", userError);
        setLoading(false);
        return;
      }

      // STEP 1: get saved progress
      const { data: progressData, error: progressError } = await supabase
        .from("user_progress")
        .select("id, question_id, status")
        .eq("user_id", user.id)
        .eq("status", "saved");

      if (progressError) throw progressError;

      if (!progressData || progressData.length === 0) {
        setSavedQuestions([]);
        setLoading(false);
        return;
      }

      const qIds = progressData.map(p => p.question_id);

      // STEP 2: fetch questions safely
      const { data: questionsData, error: qError } = await supabase
        .from("questions")
        .select("id, chapter_id, question_text")
        .in("id", qIds);

      if (qError) throw qError;

      // STEP 3: build FAST lookup map (fixes your issue)
      const questionMap = {};
      (questionsData || []).forEach(q => {
        questionMap[q.id] = q;
      });

      // STEP 4: merge safely
      const merged = progressData
        .map(p => ({
          id: p.id,
          question_id: p.question_id,
          question: questionMap[p.question_id] || null
        }))
        .filter(item => item.question !== null);

      setSavedQuestions(merged);

    } catch (err) {
      console.error("FETCH ERROR:", err);
      alert("Failed to load archive. Check console.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, questionId) => {
    if (confirmDelete !== id) {
      setConfirmDelete(id);
      return;
    }

    try {
      const { error } = await supabase
        .from("user_progress")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setSavedQuestions(prev => prev.filter(q => q.id !== id));
      setConfirmDelete(null);

    } catch (err) {
      console.error(err);
      alert("Failed to remove item.");
    }
  };

  const handleDone = async (id) => {
    if (confirmDone !== id) {
      setConfirmDone(id);
      return;
    }

    try {
      const { error } = await supabase
        .from("user_progress")
        .update({ status: "done" })
        .eq("id", id);

      if (error) throw error;

      setSavedQuestions(prev => prev.filter(q => q.id !== id));
      setConfirmDone(null);

    } catch (err) {
      console.error(err);
      alert("Could not mark as done.");
    }
  };

  if (loading) {
    return <div className="loading-state">INITIALIZING_ARCHIVE...</div>;
  }

  
  return (
    <div className="saved-page">
      <Navbar />

      <main className="saved-container">
        <header className="saved-header">
          <h1>ARCHIVE</h1>
          <p className="subtitle">
            CLOUD_SYNCED // {savedQuestions.length} ITEMS
          </p>
        </header>

        <section className="saved-grid">

          {savedQuestions.length === 0 && (
            <div className="empty-state">NO_SAVED_ITEMS_FOUND.</div>
          )}

          {savedQuestions.map((item) => (
            <div key={item.id} className="module-card">
              <div>
                <span className="module-meta">
                  CHAPTER_{item.question.chapter_id} // ID_{item.question.id}
                </span>

                <p className="module-text">
                  {item.question.question_text}
                </p>
              </div>

              <div className="module-actions">

                <button
                  className={`act-btn tick ${confirmDone === item.id ? "active" : ""}`}
                  onClick={() => handleDone(item.id)}
                >
                  {confirmDone === item.id ? (
                    <><X size={16} /> CONFIRM</>
                  ) : (
                    <><Check size={16} /> DONE</>
                  )}
                </button>

                <button
                  className={`act-btn trash ${confirmDelete === item.id ? "active" : ""}`}
                  onClick={() => handleDelete(item.id, item.question_id)}
                >
                  {confirmDelete === item.id ? (
                    <><X size={16} /> CONFIRM</>
                  ) : (
                    <><Trash2 size={16} /> PURGE</>
                  )}
                </button>

              </div>
            </div>
          ))}

        </section>
      </main>
    </div>
  );
}