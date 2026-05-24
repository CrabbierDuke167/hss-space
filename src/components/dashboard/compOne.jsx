import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase-client';
import { useTimer } from './TimerProvider'; 
import '../../styles/compOne.css';

const DashboardComponent = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // FIXED: Added fallback to prevent the 'undefined' error
  const time = useTimer() || { h: 0, m: 0, s: 0 };

  useEffect(() => {
    async function fetchData() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { setLoading(false); return; }

        const { data: globalStats, error } = await supabase
          .from('user_global_interactions')
          .select('total_hints_used, total_solved_count, current_streak, best_streak')
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) throw error;

        const solved = globalStats?.total_solved_count || 0;
        const hints = globalStats?.total_hints_used || 0;
        const accuracy = solved > 0 ? Math.max(0, Math.round(((solved - hints) / solved) * 100)) : 0;

        setData({
          total_solved: solved,
          accuracy: accuracy,
          streak: globalStats?.current_streak || 0,
          best_streak: globalStats?.best_streak || 0,
        });
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <div className="dashboard-loader">Loading your progress...</div>;

  return (
    <div className="dashboard-container">
      <section className="stats-bar">
        <div className="stat-card primary">
          <span className="label">QUESTIONS DONE</span>
          <h2 className="value">{data?.total_solved || 0}</h2>
        </div>

        <div className="stat-card">
          <span className="label">STUDY STREAK</span>
          <h2 className="value">{data?.streak || 0} days</h2>
          <span className="trend">personal best: {data?.best_streak || 0}</span>
        </div>

        <div className="stat-card">
          <span className="label">AVG ACCURACY</span>
          <h2 className="value">{data?.accuracy || 0}%</h2>
        </div>

        <div className="stat-card">
          <span className="label">TIME INVESTED</span>
          {/* Now using the safe 'time' object */}
          <h2 className="value">{`${time.h}h ${time.m}m ${time.s}s`}</h2>
          <span className="trend">this session</span>
        </div>
      </section>
    </div>
  );
};

export default DashboardComponent;

// EVERYTHING EXCPET TIME WORKING