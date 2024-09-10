import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { Device } from './utils/deviceType';

function Page2() {
  const [deviceList, setDeviceList] = useState<Device[]>([]);
  const [filterStatus, setFilterStatus] = useState<boolean>(false);
  const [editDeviceById, setEditDeviceById] = useState<number>(0);
  const [deviceEditStatus, setDeviceEditStatus] = useState<Device>({
    id: 0,
    name: "",
    serial_number: 0,
    last_connection: "",
    status: false
  });

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
    setEditDeviceById(Number(item.id));
  };

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
        alert(`${item.name} is saved!`);
        setEditDeviceById(0);
        getAllData();
      };
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
        alert(`${item.name} is deleted!`);
        getAllData();
      };
    };
  };

  const limitInputLength = (e: React.ChangeEvent<HTMLInputElement>): boolean => {
    return e.target.value.length >= 16;
  };

  // Filter array based on checkbox in status
  console.log(filterStatus, editDeviceById >= 0);
  const filteredArray: Device[] = filterStatus ? deviceList.filter(item => item.status === filterStatus) : deviceList;

  return (
    <>
      <h1>Page 2</h1> {editDeviceById}
      <table className="table">
        <thead>
          <tr>
            <th scope="col">Id</th>
            <th scope="col">Name</th>
            <th scope="col">Serial Number</th>
            <th scope="col">Last Connection</th>
            <th scope="col">
              Status
              <input
                className='ms-2'
                type="checkbox"
                checked={filterStatus}
                onChange={(e) => setFilterStatus(e.target.checked)}
              />
            </th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          {filteredArray.map((item: Device) => (
            <tr key={item.serial_number}>
              <td>{item.id}</td>
              <td>
                <input
                  type='text'
                  disabled={editDeviceById !== Number(item.id)}
                  value={item.name}
                  maxLength={32}
                  onChange={(e) => {
                    item.name = e.target.value;
                    setDeviceEditStatus({ ...item, name: e.target.value });
                  }}
                />
              </td>
              <td>
                <input
                  type='number'
                  disabled={editDeviceById !== Number(item.id)}
                  value={item.serial_number}
                  maxLength={16}
                  autoFocus
                  onChange={(e) => {
                    if (limitInputLength(e)) return;
                    item.serial_number = Number(e.target.value);
                    setDeviceEditStatus({ ...item, serial_number: Number(e.target.value) });
                  }}
                />
              </td>
              <td>{item.last_connection.toString()}</td>
              <td>
                <input
                  type="checkbox"
                  disabled={editDeviceById !== Number(item.id)}
                  checked={item.status}
                  onChange={(e) => {
                    item.status = e.target.checked;
                    setDeviceEditStatus({ ...item, status: e.target.checked })
                  }}
                />
              </td>
              <td>
                <button
                  disabled={editDeviceById !== 0}
                  onClick={() => editDevice(item)}
                  className='btn btn-primary btn-sm me-2'>
                  Edit
                </button>
                <button
                  disabled={editDeviceById !== Number(item.id)}
                  onClick={() => saveChanges(item)}
                  className='btn btn-success btn-sm me-2'>
                  Save
                </button>
                <button onClick={() => deleteDevice(item)} className='btn btn-danger btn-sm me-2'>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default Page2;

