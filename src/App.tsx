import './App.css';
import InitializeDatabaseButton from './components/InitializeDatabaseButton';
import NavBar from './components/NavBar';
import { Routes, Route } from "react-router-dom"

function App(): JSX.Element {
  return (
    <>
      <header>
        <h1>Malthe Winje oppave</h1>
      </header>
      <InitializeDatabaseButton />
    </>
  );
}

export default App;