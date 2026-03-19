import React from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-logo">
          Sourav Sharma
        </Link>
        <span className="navbar-divider" />
        <span className="navbar-subtitle">AI Content Creator</span>
      </div>
      <ul className="navbar-links">
        <li>
          <div
            to="/resume"
            style={{
              color: "white",
              textDecoration: "none",
            }}
          >
            RESUME
          </div>
        </li>
        <li>
          <Link
            to="/services"
            style={{
              color: "white",
              textDecoration: "none",
            }}
          >
            SERVICES
          </Link>
        </li>
      </ul>
      <button
        className="navbar-contact-glow"
        onClick={() =>
          (window.location.href = "mailto:souravsharma5610@gmail.com")
        }
      >
        CONTACT
      </button>
    </nav>
  );
}

export default Navbar;
