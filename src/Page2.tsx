import React from 'react'
import './App.css';
import { Link } from 'react-router-dom';

function Page2() {
  return (
    <div className='App'>
      <h1>Page 2</h1>
      <Link to={"/"}>Home</Link>
    </div>
  )
}

export default Page2;