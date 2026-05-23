import { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { supabase } from "./lib/supabase-client";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Resource from "./pages/Resource";
import Lab from "./pages/Lab";
import Saved from "./pages/Saved";
import Auth from "./pages/Auth";

// A secure gatekeeper component to shield private pages
function ProtectedRoute({ session, children }) {
  if (!session) {
    return <Navigate to="/auth" replace />;
  }
  return children;
}

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Sync current session token status right away on mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Automatically monitor user status changes across all routes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div style={{ background: "var(--bg)", minHeight: "100vh", color: "#fff", padding: "20px" }}>
        <p>INITIALIZING APPLICATION PROTOCOLS...</p>
      </div>
    );
  }

  return (
    <div style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <Routes>
        {/* 
          Root Path Gate: If a visitor hits localhost directly:
          - Logged in? Send them to Home (/).
          - Logged out? Force them to the Auth page.
        */}
        <Route path="/" element={
          session ? <Home session={session} /> : <Navigate to="/auth" replace />
        } />

        {/* Auth Screen Gate: If a logged-in user manually types /auth, redirect them back to Home */}
        <Route path="/auth" element={
          session ? <Navigate to="/" replace /> : <Auth />
        } />

        {/* Private Interface Ecosystem — All protected behind our token check */}
        <Route path="/dashboard" element={
          <ProtectedRoute session={session}><Dashboard session={session} /></ProtectedRoute>
        } />
        <Route path="/resource" element={
          <ProtectedRoute session={session}><Resource session={session} /></ProtectedRoute>
        } />
        <Route path="/lab" element={
          <ProtectedRoute session={session}><Lab session={session} /></ProtectedRoute>
        } />
        <Route path="/saved" element={
          <ProtectedRoute session={session}><Saved session={session} /></ProtectedRoute>
        } />
      </Routes>
    </div>
  );
}