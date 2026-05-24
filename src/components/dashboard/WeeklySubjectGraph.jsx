import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase-client';
import styles from '../../styles/WeeklySubjectGraph.module.css'; 

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const Y_AXIS_TICKS = [70, 40, 20, 0]; // Your specified Y-axis intervals

export default function WeeklySubjectGraph() {
  const [weeklyData, setWeeklyData] = useState(Array(7).fill(0));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        // Fetch current totals from Supabase
        const { data, error } = await supabase
          .from('subject_progress')
          .select('solved_count');

        if (error) throw error;

        // Sum up total solved count across all subjects
        const currentTotal = data?.reduce((acc, curr) => acc + (curr.solved_count || 0), 0) || 0;

        // Determine current day of week (0 = Mon, 6 = Sun for this graph)
        const today = new Date();
        const dayOfWeek = today.getDay() === 0 ? 6 : today.getDay() - 1; 
        
        // Generate a unique key for the current week (Monday's date)
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - dayOfWeek);
        const weekKey = startOfWeek.toISOString().split('T')[0];

        // Retrieve our weekly checkpoint from localStorage
        const storedStr = localStorage.getItem('weeklyProgressCheckpoint');
        let storedData = storedStr ? JSON.parse(storedStr) : null;

        // If it's a new week (or no data exists), reset the checkpoint
        if (!storedData || storedData?.weekKey !== weekKey) {
          storedData = {
            weekKey,
            baseTotal: currentTotal, // Snapshot of total at the start of the week
            dailyTotals: Array(7).fill(0)
          };
        }

        // Calculate today's delta
        // Formula: Current DB Total - Monday's Base Total - (Sum of previous days this week)
        const previousDaysSum = storedData.dailyTotals.reduce((sum, val, idx) => idx < dayOfWeek ? sum + val : sum, 0);
        let todaysDelta = currentTotal - storedData.baseTotal - previousDaysSum;
        
        // Prevent negative values if DB is wiped/reset
        if (todaysDelta < 0) todaysDelta = 0; 

        storedData.dailyTotals[dayOfWeek] = todaysDelta;

        // Save updated daily log back to localStorage
        localStorage.setItem('weeklyProgressCheckpoint', JSON.stringify(storedData));

        setWeeklyData(storedData.dailyTotals);
      } catch (err) {
        console.error('Error fetching subject progress:', err);
        // On error, component gracefully falls back to the Array(7).fill(0) initial state
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  const maxScale = 70; // Based on highest Y-axis tick

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Weekly Progress</h2>
      
      {/* Loading state prevents layout shift */}
      <div className={styles.loaderWrapper}>
         {loading && <span className={styles.loader}>Syncing data...</span>}
      </div>

      <div className={styles.graphWrapper}>
        
        {/* Y-Axis */}
        <div className={styles.yAxis}>
          {Y_AXIS_TICKS.map(tick => (
            <div key={`y-${tick}`} className={styles.yTick}>
              <span>{tick}</span>
              <div className={styles.gridLine}></div>
            </div>
          ))}
        </div>

        {/* X-Axis and Bars */}
        <div className={styles.barsContainer}>
          {DAYS.map((day, idx) => {
            const value = weeklyData[idx] || 0;
            // The 5% fallback ensures a visible zero-state sliver
            const heightPct = Math.max((value / maxScale) * 100, 5);

            return (
              <div key={day} className={styles.barGroup}>
                <div className={styles.barTrack}>
                  <div
                    className={styles.barFill}
                    style={{ height: `${heightPct}%` }}
                    data-tooltip={`${value} solved`}
                  ></div>
                </div>
                <span className={styles.xAxisLabel}>{day}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}