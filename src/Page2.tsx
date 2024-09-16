import React, { useState, useEffect, useRef } from 'react';
import { Device, Props } from './utils/deviceType';
import { VirtuosoHandle } from 'react-virtuoso'
import './TableVirtuosoStyles.css';
import { TableDeviceVirtuoso } from './components/TableDeviceEntity/TableDeviceVirtuoso';

const Page2: React.FC<Props> = ({ setCounterStatus }) => {
  const [deviceList, setDeviceList] = useState<Device[]>([]);

  // Get all devices in IndexedDB
  const getAllData = () => {
    const idb = window.indexedDB;
    const dbPromise = idb.open("malthewinje-db", 1);
    dbPromise.onsuccess = () => {
      const db = dbPromise.result;
      const tx = db.transaction("deviceEntity", "readonly");
      const deviceEntity = tx.objectStore("deviceEntity");
      const deviceListRequest = deviceEntity.getAll();

      deviceListRequest.onsuccess = (event: Event) => {
        const result = (event.target as IDBRequest<Device[]>).result;
        setDeviceList(result);
        let activeCounterLength = result.filter(item => item.status === true).length
        let inactiveCounterLength = result.filter(item => item.status === false).length
        setCounterStatus({ activeCount: activeCounterLength, inactiveCount: inactiveCounterLength })

      };
      tx.oncomplete = () => {
        db.close();
      };
    };
  };

  const handleGetAllData = () => {
    getAllData();
  }

  const effectRan = useRef<boolean>(false);
  useEffect(() => {
    if (!effectRan.current) {
      getAllData();
    }
    return () => {
      effectRan.current = true;
    };
  }, []);

  const virtuosoRef = useRef<VirtuosoHandle>(null);
  return (
    <>
      <h1>Device Entities</h1>
      <p>Devices stored in IndexedDB</p>
      
      <TableDeviceVirtuoso deviceList={deviceList} />

      {/* <button className='btn btn-primary mb-3' onClick={() => virtuosoRef.current?.scrollToIndex({
          index: Math.random() * deviceList.length,
          align: "start",
          behavior: "smooth"
        })}>Scroll
      </button> */}

    </>
  );
}

export default Page2;

