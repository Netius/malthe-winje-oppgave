import React, { useState, useEffect, useRef } from 'react';
import { Device, Props, emptyDeviceEntity } from './utils/deviceType';
import { VirtuosoHandle } from 'react-virtuoso'
import './TableVirtuosoStyles.css';
import { TableDeviceVirtuoso } from './components/TableDeviceEntity/TableDeviceVirtuoso';


const Page2: React.FC<Props> = ({ setCounterStatus }) => {
  const [deviceList, setDeviceList] = useState<Device[]>([]);
  const [deviceEditStatus, setDeviceEditStatus] = useState<Device>(emptyDeviceEntity);


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

  const effectRan = useRef<boolean>(false);
  useEffect(() => {
    if (!effectRan.current) {
      getAllData();
    }
    return () => {
      effectRan.current = true;
    };
  }, []);


  // Makes row in table editable
  const editDevice = (item: Device) => {
    setDeviceEditStatus({ ...item });
  };

  const cleanEditState = () => {
    return setDeviceEditStatus(emptyDeviceEntity);
  }

  // Save changes to indexedDB
  const saveChanges = (item: Device) => {
    const idb = window.indexedDB;
    const dbPromise = idb.open("malthewinje-db", 1);

    dbPromise.onsuccess = () => {
      const db = dbPromise.result;
      const tx = db.transaction("deviceEntity", "readwrite");
      const deviceEntity = tx.objectStore("deviceEntity");

      const selectedDevice = deviceEntity.put({
        id: deviceEditStatus.id,
        name: deviceEditStatus.name,
        serial_number: deviceEditStatus.serial_number,
        last_connection: deviceEditStatus.last_connection,
        status: deviceEditStatus.status,
      });

      selectedDevice.onsuccess = () => {
        tx.oncomplete = function () {
          db.close();
        };
        getAllData();
      };
      cleanEditState();
    };
  };

  // Delete devices from indexedDB
  const deleteDevice = (item: Device) => {
    const idb = window.indexedDB;
    const dbPromise = idb.open("malthewinje-db", 1);

    dbPromise.onsuccess = function () {
      const db = dbPromise.result;
      const tx = db.transaction("deviceEntity", "readwrite");
      const deviceEntity = tx.objectStore("deviceEntity");
      const deleteUser = deviceEntity.delete(Number(item.id));

      deleteUser.onsuccess = () => {
        tx.oncomplete = function () {
          db.close();
        };
        // alert(`${item.name} is deleted!`);
        getAllData();
      };
      cleanEditState()
    };
  };

  const limitInputLength = (e: React.ChangeEvent<HTMLInputElement>): boolean => {
    return e.target.value.length >= 16;
  };

  // Filter array based on checkbox in status
  // const filteredArray: Device[] = filterStatus ? deviceList.filter(item => item.status === filterStatus) : deviceList;

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

