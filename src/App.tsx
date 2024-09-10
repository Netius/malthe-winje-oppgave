import './App.css';
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Page2 from './Page2';
import NavBar from './components/NavBar';
import Page1 from './Page1';

function App(): JSX.Element {

  return (
    <>
      <BrowserRouter>
        <div className="App">
          <NavBar />
          <div className='container'>
            <Routes>
              <Route path="/" element={<Page1 />} />
              <Route path="/page2" element={<Page2 />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;