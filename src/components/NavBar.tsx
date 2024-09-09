import React from 'react'
import { Link } from 'react-router-dom';

const  NavBar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <Link className="navbar-brand ms-4" to={"/"}>Malthe Winje</Link>
      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item active">
            <Link className="nav-link" to={"/"}>Home</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to={"/page2"}>Page 2</Link>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default NavBar;