import './App.css';
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Page2 from './Page2';
import NavBar from './components/NavBar';
import Page1 from './Page1';

// export const ContextData = React.createContext<Device[]>([]);
function App(): JSX.Element {
  return (
    <>
      {/* <React.StrictMode> */}
        <BrowserRouter>
          <div className="App">
            <NavBar />
            <div className='container'>
              {/* <ContextData.Provider value={deviceList}> */}
              <Routes>
                <Route path="/" element={<Page1 />} />
                <Route path="/page2" element={<Page2 />} />
              </Routes>
              {/* </ContextData.Provider> */}
            </div>
          </div>
        </BrowserRouter>
      {/* </React.StrictMode> */}
    </>
  );
}

export default App;