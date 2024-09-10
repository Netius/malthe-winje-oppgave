import './App.css';
import React from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Page2 from './Page2';
import NavBar from './components/NavBar';
// import { useState } from 'react';
import Page1 from './Page1';

// export const ContextData = React.createContext<Device[]>([]);


function App(): JSX.Element {
  // const [connected, setConnected] = useState<boolean>(false);
  // const [errorDB, setErrorDB] = useState<boolean>(false);
  // const [deviceList, setDeviceList] = useState <Device[]>([]);

  // const initializeDatabase = () => {
  //   // Checks if IndexedDB is in Chrome...needs support to more browser
  //   const idb = window.indexedDB;

  //   // Try to open DB if not create
  //   const request = idb.open("malthewinje-db", 1);

  //   // Return error 
  //   request.onerror = function (event: Event) {
  //     setErrorDB(true);
  //     console.error("An error occurred with IndexedDB : ", event);
  //   };

  //   // Create IndexedDB if not present
  //   request.onupgradeneeded = function (event: IDBVersionChangeEvent) {
  //     const db = request.result;
  //     if (!db.objectStoreNames.contains("deviceEntity")) {
  //       const objectStore = db.createObjectStore("deviceEntity", { keyPath: "id", autoIncrement: true });
  //     }
  //   };

  //   request.onsuccess = function () {
  //     setConnected(true);
  //     const db = request.result;
  //     const tx = db.transaction("deviceEntity", "readwrite");
  //     const deviceEntity = tx.objectStore("deviceEntity");

  //     // Loop to add entries in Indexed Database
  //     const { name, serial_number, last_connection, status } = DEVICE_ENTITY_DATA;
  //     for (let index = 0; index < 200; index++) {
  //       deviceEntity.add({
  //         name: `${name + index}`,
  //         serial_number: `${serial_number + index}`,
  //         last_connection,
  //         status
  //       });
  //     }
  //     const deviceListRequest = deviceEntity.getAll();
  //     deviceListRequest.onsuccess = (event: Event) => {
  //       const result = (event.target as IDBRequest<Device[]>).result;
  //       setDeviceList(result);
  //     };
  //     tx.oncomplete = () => {
  //       db.close();
  //     };
  //     return tx.oncomplete;
  //   };

  //   return;
  // }

  // return (
  //   <>
  //    <h1>Malthe Winje oppgave</h1>
  //     <button className='btn btn-primary' onClick={initializeDatabase}>Initialize database</button>
  //     {errorDB && <p className='alert alert-danger mt-3'>An error occurred with IndexedDB</p>}
  //     {connected && <p className='alert alert-success mt-3'>Database opened successfully</p>}
  //   </>
  // )
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