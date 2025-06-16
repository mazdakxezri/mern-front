import React, { useContext } from "react";
import { NavLink } from "react-router-dom";

import "./NavLinks.css";
import { AuthContext } from "../../context/auth-context";

const NavLinks = () => {
  const auth = useContext(AuthContext);

  return (
    <ul className="nav-links">
      <li>
        <NavLink to="/" exact>
          <span className="nav-links__icon">👥</span>
          ALL USERS
        </NavLink>
      </li>
      {auth.isLoggedIn && (
        <li>
          <NavLink to={`/${auth.userId}/places`}>
            <span className="nav-links__icon">📍</span>
            MY PLACES
          </NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <NavLink to="/places/new">
            <span className="nav-links__icon">➕</span>
            ADD PLACE
          </NavLink>
        </li>
      )}
      {!auth.isLoggedIn && (
        <li>
          <NavLink to="/auth">
            <span className="nav-links__icon">🔐</span>
            AUTHENTICATE
          </NavLink>
        </li>
      )}
      {auth.isLoggedIn && (
        <li>
          <button onClick={auth.logout} className="nav-links__logout">
            <span className="nav-links__icon">🚪</span>
            LOGOUT
          </button>
        </li>
      )}
    </ul>
  );
};

export default NavLinks;
