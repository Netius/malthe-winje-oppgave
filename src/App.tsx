import './App.css';
import InitializeDatabaseButton from './components/InitializeDatabaseButton';
import { Link } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <header>
        <h1>Malthe Winje oppave</h1>
          <Link to={"/page2"}>Page 2</Link>
      </header>
      <InitializeDatabaseButton />
    </div>
  );
}

export default App;
