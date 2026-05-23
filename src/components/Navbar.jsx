import { useEffect, useRef, useState } from "react";
import { NavLink, useLocation, Link } from "react-router-dom";
import { supabase } from "../lib/supabase-client"; 
import "../styles/navbar.css";

export default function Navbar() {
  const location = useLocation();
  const navListRef = useRef(null);
  
  const [userEmail, setUserEmail] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  
  const [pill, setPill] = useState({
    left: 0,
    width: 0,
    isVisible: false
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUserEmail(session.user.email);
      }
    };

    fetchUserData();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user?.email || "");
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const calculatePosition = () => {
      if (!navListRef.current) return;

      const activeLink = navListRef.current.querySelector(".nav-link.active");
      
      if (activeLink) {
        const parentRect = navListRef.current.getBoundingClientRect();
        const linkRect = activeLink.getBoundingClientRect();

        setPill({
          left: linkRect.left - parentRect.left,
          width: linkRect.width,
          isVisible: true
        });
      } else {
        setPill(prev => ({
          ...prev,
          isVisible: false
        }));
      }
    };

    calculatePosition();
    const syncTimer = setTimeout(calculatePosition, 60);

    window.addEventListener("resize", calculatePosition);
    return () => {
      clearTimeout(syncTimer);
      window.removeEventListener("resize", calculatePosition);
    };
  }, [location]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsPopupOpen(false);
  };

  return (
    <header className="navbar">
      
      {/* LEFT CONTENT STRUCT */}
      <div className="navbar-left">
        <div className="navbar-logo">
          <Link to="/">
            <h1>
              <span>H</span>HSS SPACE
            </h1>
          </Link>
        </div>

        <nav className="navbar-links">
          <ul 
            ref={navListRef}
            style={{
              "--pill-x": `${pill.left}px`,
              "--pill-w": `${pill.width}px`
            }}
            data-visible={pill.isVisible}
          >
            <div className="nav-active-pill" />

            <li>
              <NavLink to="/dashboard" className="nav-link">
                DASHBOARD
              </NavLink>
            </li>
            <li>
              <NavLink to="/resource" className="nav-link">
                RESOURCES
              </NavLink>
            </li>
            <li>
              <NavLink to="/lab" className="nav-link">
                LAB
              </NavLink>
            </li>
            <li>
              <NavLink to="/saved" className="nav-link">
                SAVED
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>

      {/* RIGHT CONTENT STRUCT */}
      <div className="navbar-right">
        {!isPopupOpen ? (
          /* STANDARD EMAIL LABEL LOOK */
          <p className="navbar-email" onClick={() => setIsPopupOpen(true)}>
            {userEmail || "GUEST_SESSION"}
          </p>
        ) : (
          /* INLINE INTERACTIVE EXPANSION CARD (SWAPPED DIRECTLY WITH EMAIL POSITION) */
          <div className="navbar-inline-panel">
            <div className="inline-panel-details">
              <span className="inline-meta-value" title={userEmail}>
                {userEmail || "GUEST"}
              </span>
              <span className="inline-meta-status">ONLINE</span>
            </div>
            
            <button className="inline-logout-action" onClick={handleLogout}>
              LOGOUT
            </button>
            
            <button className="inline-close-action" onClick={() => setIsPopupOpen(false)}>
              ✕
            </button>
          </div>
        )}
        
        <div 
          className="navbar-ring" 
          onClick={() => setIsPopupOpen(!isPopupOpen)} 
          style={{ cursor: "pointer" }}
        >
          <span>〇</span>
        </div>
      </div>

    </header>
  );
}