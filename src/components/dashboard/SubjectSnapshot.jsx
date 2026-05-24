import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase-client';
import styles from '../../styles/SubjectSnapshot.module.css';

export default function SubjectSnapshot() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSnapshot = async () => {
      try {
        setLoading(true);
        
        // Fetch user directly inside the component to prevent hanging
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError || !user) {
          setData({ physics: 0, chemistry: 0, mathematics: 0, english: 0, computer: 0 });
          return;
        }

        // Fetch exactly your columns
        const { data: progress, error } = await supabase
          .from('subject_progress')
          .select('physics, chemistry, mathematics, english, computer')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) throw error;

        // Set data, fallback to 0 if the row doesn't exist yet
        setData(progress || { physics: 0, chemistry: 0, mathematics: 0, english: 0, computer: 0 });

      } catch (error) {
        console.error("Error fetching subject snapshot:", error);
        // Bulletproof fallback: Never get stuck on loading even if network fails
        setData({ physics: 0, chemistry: 0, mathematics: 0, english: 0, computer: 0 });
      } finally {
        setLoading(false);
      }
    };

    fetchSnapshot();
  }, []);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingText}>Loading snapshot data...</div>
      </div>
    );
  }

  // Map the data with text-based icons matching your image vibe
  const subjects = [
    { id: 'math', name: 'MATH', count: data?.mathematics ?? 0, icon: '∫' },
    { id: 'phys', name: 'PHYS', count: data?.physics ?? 0, icon: '◎' },
    { id: 'chem', name: 'CHEM', count: data?.chemistry ?? 0, icon: '⚗' },
    { id: 'eng', name: 'ENG', count: data?.english ?? 0, icon: 'Aa' },
    { id: 'cs', name: 'CS', count: data?.computer ?? 0, icon: '</>' }
  ];

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.tag}>[SUBJECT.SNAPSHOT]</span>
        <h2 className={styles.title}>QUESTIONS SOLVED</h2>
      </div>

      <div className={styles.list}>
        {subjects.map((sub) => (
          <div key={sub.id} className={styles.listItem}>
            <div className={styles.subjectInfo}>
              <span className={styles.icon}>{sub.icon}</span>
              <span className={styles.name}>{sub.name}</span>
            </div>
            <div className={styles.statInfo}>
              <span className={styles.count}>{sub.count}</span>
              <span className={styles.label}>questions</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}