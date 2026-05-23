import React, { useState, useEffect } from "react";
import { Bookmark } from "lucide-react";
import { supabase } from "../lib/supabase-client";

export default function Hero() {
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDailyQuestion = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("questions")
        .select("id, chapter_id, question_text");

      if (error) console.error(error);
      else if (data && data.length > 0) {
        const today = new Date().toISOString().split('T')[0];
        const dateHash = today.split('-').reduce((acc, part) => acc + parseInt(part), 0);
        setQuestion(data[dateHash % data.length]);
      }
      setLoading(false);
    };
    fetchDailyQuestion();
  }, []);

  const handleSave = async () => {
    if (!question) return;
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { alert("SIGN IN TO SAVE"); return; }

    // Ensure ID is passed as a string/text to match our new table
    const { error } = await supabase
      .from("user_progress")
      .insert([{ 
        user_id: user.id, 
        question_id: String(question.id), // Force string conversion
        status: 'saved' 
      }]);

    if (error) {
      console.log(error);
      alert("ALREADY SAVED OR ERROR");
    } else {
      alert("ARCHIVED // SYNCED TO CLOUD");
    }
  };

  return (
    <section className="hero">
      <div className="hero-head"><h1>QUESTION OF THE DAY</h1></div>
      <div className="hero-decor-text-div">
        <p>SCORE_INTERFACE // FRACTAL // {new Date().toLocaleDateString()}</p>
      </div>
      {loading ? <div className="daily-question">INITIALIZING SYSTEM...</div> : question ? (
        <>
          <div className="daily-question-data">
            <p>#SUBJECT_UNKNOWN // CLASS 12 // #CHAPTER_{question.chapter_id}</p>
          </div>
          <div className="daily-question">{question.question_text}</div>
          <div className="hero-btn-div">
            <button className="hero-btn" onClick={handleSave}>
              <Bookmark size={20} /> <span>SAVE</span>
            </button>
          </div>
        </>
      ) : <div className="daily-question">NO DATA FOUND.</div>}
    </section>
  );
}