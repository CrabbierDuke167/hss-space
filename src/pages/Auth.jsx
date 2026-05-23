import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase-client"; // Points directly to your src/lib path
import "../styles/auth.css";

// LOGIN ARTWORK (Simpson-style grid mesh)
const LOGIN_CHARACTER_ART = `                      ██                                            ██                      
                    ██▓▓▓▓████                                    ████▓▓▓▓██                    
                    ██▓▓▓▓▓▓▓▓████                            ████▓▓▓▓▓▓▓▓██                    
                    ██▓▓██████▓▓▓▓██                        ██▓▓▓▓██████▓▓██                    
                    ██▓▓██    ██▓▓▓▓▓▓  ▓▓▓▓██████▒▒████  ██▓▓▓▓██░░░░██▓▓██                    
                    ██▓▓██    ░░██▓▓▓▓██▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒██▓▓▓▓██░░    ██▓▓██                    
                    ██▓▓▓▓▓▓  ░░░░██▓▓▓▓▓▓██▒▒▒▒▒▒▒▒▓▓██▓▓▓▓██░░░░  ▓▓▓▓▓▓██                    
                      ██▓▓██░░░░░░██▓▓▓▓▓▓▓▓████████▓▓▓▓▓▓▓▓██░░░░░░██▓▓██                      
                      ██▓▓██░░████▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓████░░██▓▓██                      
                    ██▒▒██▓▓██▓▓▓▓▓▓████████████████████████▓▓▓▓▓▓██▓▓██▒▒██                    
                  ██▒▒▒▒██▓▓▓▓▓▓████▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒████▓▓▓▓▓▓██▒▒▒▒██                  
                  ██▒▒▒▒██▓▓████▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒████▓▓██▒▒▒▒██                  
                ██▒▒▒▒██▓▓██▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒██▓▓██▒▒▒▒██                
                ██▒▒██▓▓██▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒██▓▓██▒▒██                
              ██▒▒▒▒██▓▓██▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒██▓▓██▒▒▒▒██              
              ██▒▒██▓▓██▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒██▓▓██▒▒██              
              ██▒▒██▓▓██▒▒▒▒██▒▒▒▒▒▒▒▒▒▒▒▒░░▒▒▒▒▒▒▒▒▒▒▒▒██▒▒▒▒▒▒▒▒▒▒▒▒▒▒██▓▓██▒▒██              
            ██▒▒▒▒▒▒██▒▒▒▒▒▒██▒▒▒▒▒▒░░▒▒██▒▒▒▒▒▒▒▒▒▒▒▒██░░██▒▒▒▒▒▒▒▒▒▒▒▒▒▒██▒▒▒▒▒▒██            
            ██▒▒▒▒▒▒▒▒▒▒▒▒▒▒██▒▒▒▒▒▒▒▒▒▒██▒▒▒▒▒▒▒▒▒▒▒▒██░░░░██▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒██            
            ██▒▒▒▒▒▒▒▒▒▒▒▒▒▒██▒▒▒▒▒▒▒▒██░░██▒▒▒▒▒▒▒▒██░░░░░░██▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒██            
            ██▒▒▒▒▒▒▒▒░░▒▒██▒▒▒▒▒▒▒▒██░░░░██▒▒▒▒▒▒██░░░░░░░░██▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒██            
            ██▒▒▒▒▒▒▒▒▒▒▒▒██▒▒▒▒▒▒██▒▒▒▒░░██▒▒▒▒██░░░░░░▒▒▒▒██▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒██            
            ██▒▒▒▒▒▒▒▒▒▒██▒▒▒▒████░░░░░░██▒▒████░░░░░░▒▒░░░░██████▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒██            
              ██▒▒▒▒▒▒▒▒██████░░░░░░▒▒░░████▒▒░░░░░░░░░░▒▒░░▒▒░░░░██▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒██            
              ██▒▒▒▒██▓▓▒▒▓▓██░░██████░░▒▒░░░░░░░░  ░░  ░░██████▒▒██▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒██            
              ██▒▒▒▒██▒▒▓▓▓▓██▓▓░░██▓▓▓▓░░░░░░░░░░  ░░░░▓▓▓▓██░░████▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒██          
            ██▒▒▒▒▒▒██▒▒▒▒▒▒██  ██  ▓▓▓▓██             ██  ▓▓▓▓██  ██▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒████      
          ▓▓▒▒▒▒▒▒▒▒██▒▒▒▒▒▒██  ██▒▒▓▓▒▒██             ██▒▒▓▓▒▒██  ██▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒████        
        ████████▒▒▒▒▒▒██▒▒▒▒████  ██▒▒▒▒██             ██▒▒▒▒██  ████▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒██            
              ██▒▒▒▒▒▒██▒▒▒▒██░░▓▓████▓▓░░             ░░██████▓▓░░██▒▒▒▒▒▒▒▒▒▒▒▒██▒▒▒▒▓▓██▓▓██    
██          ██▒▒▒▒▒▒▒▒██▒▒▒▒██░░░░                        ░░░░██▒▒▒▒▒▒▒▒▒▒▒▒▒▒██▒▒▒▒▒▒▒▒██    
████      ██▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒██  ░░░░        ░░░░        ░░░░  ██▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒████████    
██▒▒██████▒▒▒▒▒▒██▒▒▒▒▒▒▒▒▒▒▒▒██                                ██▒▒▒▒▒▒▒▒▒▒▒▒██▒▒▒▒▒▒████      
  ██▒▒▒▒▒▒▒▒▒▒▒▒██▒▒▒▒▒▒▒▒▒▒▒▒▒▒██             ▒▒    ▒▒           ██▒▒▒▒▒▒▒▒██▒▒▒▒▒▒████▒▒▒▒▒▒██████
    ████▒▒▒▒████▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒██           ▒▒▒▒           ██▒▒▒▒▒▒▒▒▒▒██▒▒▒▒▒▒██  ██████████  
        ████▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒██         ░░░░        ██▒▒▒▒▒▒▒▒██▒▒▒▒██▒▒▒▒▒▒██              
██▓▓▓▓▓▓▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒██▓▓                ████▒▒▒▒▒▒▒▒██▒▒▒▒████▒▒▒▒▒▒▓▓            
  ████▒▒▒▒▒▒▒▒████▒▒▒▒▒▒██▒▒▒▒▒▒▒▒▒▒██░░████        ████░░██▒▒▒▒▒▒▒▒██▒▒▒▒██  ████▒▒▒▒██          
    ░░████████  ██▒▒▒▒▒▒██▒▒▒▒▒▒▒▒▒▒██░░░░░░▓▓████▓▓▒▒░░░░██▒▒▒▒▒▒▒▒▒▒██▒▒██      ██████          
                ██▒▒▒▒▒▒██▒▒▒▒▒▒▒▒▒▒██░░░░░░░░░░░░░░░░░░░░██▒▒▒▒▒▒▒▒▒▒▒▒██▒▒██                    
                ██▒▒▒▒██  ██▒▒▒▒▒▒██░░░░░░░░░░░░░░░░░░░░░░░░██▒▒▒▒▒▒▒▒██  ██████                  
                ██▒▒▒▒██    ▓▓████░░░░░░░░░░░░░░░░░░░░░░░░░░░░██████▒▒██                          
              ██▒▒▒▒██  ████▓▓██░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░██▓▓████                          
            ▓▓▒▒▒▒████▓▓░░██▓▓██░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░██▓▓██░░██▓▓██                  
              ████      ░░██▓▓████░░░░░░░░░░░░░░░░░░░░░░░░░░░░████▓▓██░░      ████                
            ██          ░░██▓▓██░░████████░░░░░░░░░░░░████████░░██▓▓██░░          ██              
          ██          ░░░░██▓▓▓▓██░░      ████░░░░████      ░░██▓▓▓▓██░░░░          ██            
          ██        ░░░░██▓▓▓▓▓▓██░░                        ░░██▓▓▓▓▓▓██░░░░        ██            
                                       ░░  ░░░░            ░░    ░░░░░░      ░░                    `;

// SIGNUP ARTWORK (Cyberpunk high-fidelity layout flat palette)
const SIGNUP_CHARACTER_ART = `            ░░                                      
                                                     
                                                     
                                                     
                                                     
                                                     
                                                     
                                                     
                          ██  ▓▓  ██████░░          
                    ▓▓  ▓▓  ██▓▓██▓▓██▒▒██▒▒          
          ██  ▓▓  ██▓▓██▓▓▒▒██▒▒██▒▒░░▓▓░░          
      ▓▓  ████████░░██░░██░░░░░░░░░░░░██░░          
      ██▓▓▒▒██░░██░░▒▒░░▒▒░░░░░░░░░░░░██░░          
      ░░▓▓░░▒▒░░░░░░░░░░░░░░░░░░░░░░░░░░▓▓▓▓        
        ██░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░██▓▓        
        ██░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░████        
          ██░░░░░░░░░░░░░░░░░░░░░░░░░░░░██▓▓        
          ▓▓░░░░░░░░░░░░░░░░░░░░░░░░░░░░██▓▓▓▓      
          ██░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░▒▒██      
            ▓▓░░░░░░░░░░░░░░░░░░░░░░░░▓▓████▓▓██░░
            ▓▓░░░░░░░░░░░░░░██████████          ██
            ▓▓░░░░░░░░░░░░▓▓        ▓▓          ██
            ▓▓░░░░░░░░░░▓▓            ▓▓░░░░▓▓  ██
              ██░░░░░░░░▓▓            ██░░      ██
              ██░░░░░░░░▓▓    ▓▓      ██▓▓▓▓████▓▓
              ██░░░░░░░░▓▓            ██░░░░░░░░▓▓
              ████░░░░░░░░▓▓        ▓▓░░░░░░░░░░██
            ██░░░░██░░░░░░░░▓▓██████░░░░▓▓██████░░
            ██░░██░░░░░░░░░░░░░░░░░░░░░░░░░░░░▓▓  
              ██░░██░░░░░░░░░░░░░░░░░░░░░░░░░░░░▓▓
              ░░██▓▓░░░░▓▓░░░░░░░░░░░░░░░░░░░░░░▓▓
                ██░░░░▓▓██▓▓░░░░░░░░░░░░░░░░░░░░▓▓
                ██░░░░▒▒░░▒▒████████████████████▒▒
                ██░░░░░░░░░░▓▓▓▓▒▒▒▒██▓▓▒▒████▒▒░░
                ██░░░░░░░░░░░░░░▓▓▓▓░░              
              ████░░░░░░░░░░░░██                    
            ██▒▒▒▒██░░░░░░██████                    
          ██▒▒▒▒▒▒▒▒██████▒▒▒▒▒▒██                  
        ██████▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▓▓██                `;

export default function Auth() {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", isError: false });

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", isError: false });

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;

        // If email confirmation is required in your dashboard, user session will be null
        if (data?.user && data?.session === null) {
          setMessage({ text: "Verification link sent! Check your inbox.", isError: false });
        } else {
          // If auto-confirm is on, head right to the landing interface
          navigate("/dashboard");
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        // Route instantly to secure section upon passing validation checks
        navigate("/dashboard");
      }
    } catch (err) {
      setMessage({ text: err.message || "An error occurred during authentication.", isError: true });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className={`auth-container ${isSignUp ? "state-signup" : "state-login"}`}>
        
        {/* PREMIUM BLOCK MATRIX CHARACTER PRESENTATION LAYER */}
        <pre className="auth-ascii-logo">
          {isSignUp ? SIGNUP_CHARACTER_ART : LOGIN_CHARACTER_ART}
        </pre>

        <div className="auth-card">
          <div className="auth-header-tabs">
            <button 
              type="button"
              className={`auth-tab-btn ${!isSignUp ? "active" : ""}`}
              onClick={() => { setIsSignUp(false); setMessage({ text: "", isError: false }); }}
            >
              SIGN_IN
            </button>
            <button 
              type="button"
              className={`auth-tab-btn ${isSignUp ? "active" : ""}`}
              onClick={() => { setIsSignUp(true); setMessage({ text: "", isError: false }); }}
            >
              REGISTER
            </button>
          </div>

          <form onSubmit={handleAuth} className="auth-form">
            <div className="form-group">
              <label htmlFor="email">USER_EMAIL :</label>
              <input
                id="email"
                type="email"
                required
                placeholder="name@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">USER_ACCESS_KEY :</label>
              <input
                id="password"
                type="password"
                required
                minLength={6}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {message.text && (
              <div className={`auth-feedback-panel ${message.isError ? "error" : "success"}`}>
                <span>{message.isError ? "![ERROR] " : ">> [SUCCESS] "}</span>
                {message.text}
              </div>
            )}

            <button type="submit" disabled={loading} className="auth-submit-btn">
              {loading ? "EXECUTING..." : isSignUp ? "INITIALIZE_ACCOUNT" : "GRANT_ACCESS"}
            </button>
          </form>
        </div>

        <div className="auth-footer-terminal">
          <p>SUPABASE_AUTH_NODE // SECURE_CONNECTION_ENABLED</p>
        </div>

      </div>
    </main>
  );
}