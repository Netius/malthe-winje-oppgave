import './App.css';
import InitializeDatabaseButton from './components/InitializeDatabaseButton';
import NavBar from './components/NavBar';

function App(): JSX.Element {
  return (
    <>
      <NavBar />
      <div className="container">
        <header>
          <h1>Malthe Winje oppave</h1>
        </header>
        <InitializeDatabaseButton />
      </div>
    </>
  );
}

export default App;