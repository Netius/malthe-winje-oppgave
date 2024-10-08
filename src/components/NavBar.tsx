import React from 'react';
import { Link } from 'react-router-dom';

const NavBar: React.FC = () => {
  return (
    <nav className="navbar navbar-expand navbar-dark bg-dark">
      <Link className="navbar-brand ms-4" to={"/"}>Malthe Winje</Link>
      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item active">
            <Link className="nav-link" to={"/"}>Home</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to={"/page2"}>Device Entities</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default NavBar;

