import { useState, useEffect } from 'react';
import './App.css';
import ListDevices from './components/ListDevices';
import NavBar from './components/NavBar';


function Page2() {
  const [deviceList, setDeviceList] = useState<[]>([]);

  const getAllData = () => {
    const idb = window.indexedDB;
    const dbPromise = idb.open("malthewinje-db", 1);

    dbPromise.onsuccess = () => {
      const db = dbPromise.result;

      const tx = db.transaction("deviceEntity", "readonly");
      const deviceEntity = tx.objectStore("deviceEntity");
      const deviceListRequest = deviceEntity.getAll();

      deviceListRequest.onsuccess = (event: Event) => {
        const result = (event.target as IDBRequest<any>).result;
        setDeviceList(result);
      };

      tx.oncomplete = () => {
        db.close();
      };
    };
  };

  useEffect(() => {
    getAllData();
  }, []);

  return (
    <>
    <NavBar />
    <div className='container'>
      <h1>Page 2</h1>
      {deviceList.length > 0 && 
      <ListDevices devicesList={deviceList} />
      }
    </div>
    </>
  );
}

export default Page2;

