import './App.css';
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Page2 from './Page2';
import NavBar from './components/NavBar';
import Page1 from './Page1';
import CounterActive from './components/CounterActive';
import { useState } from 'react';
import { State } from './utils/deviceType';

function App(): JSX.Element {
  const [counterStatus , setCounterStatus] = useState<State>({activeCount: 0 , inactiveCount:0})

  return (
    <>
      <BrowserRouter>
        <div className="App">
          <NavBar />
          <CounterActive counterStatus={counterStatus} />
          <div className='container'>
            <Routes>
              <Route path="/" element={<Page1 setCounterStatus={setCounterStatus} />} />
              <Route path="/page2" element={<Page2 setCounterStatus={setCounterStatus} />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;