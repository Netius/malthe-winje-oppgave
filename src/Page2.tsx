import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import { Device, Props } from './utils/deviceType';


const Page2: React.FC<Props> = ({ setCounterStatus }) => {
  const [deviceList, setDeviceList] = useState<Device[]>([]);
  const [filterStatus, setFilterStatus] = useState<boolean>(false);
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
    return setDeviceEditStatus({
      id: 0,
      name: "",
      serial_number: 0,
      last_connection: "",
      status: false
    });
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
        // alert(`${item.name} is saved!`);
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
  const filteredArray: Device[] = filterStatus ? deviceList.filter(item => item.status === filterStatus) : deviceList;

  return (
    <>
      <h1>Page 2</h1>

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
                  disabled={deviceEditStatus.id !== Number(item.id)}
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
                  disabled={deviceEditStatus.id !== Number(item.id)}
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
                  disabled={deviceEditStatus.id !== Number(item.id)}
                  checked={item.status}
                  onChange={(e) => {
                    item.status = e.target.checked;
                    setDeviceEditStatus({ ...item, status: e.target.checked })
                  }}
                />
              </td>
              <td>
                <button
                  disabled={deviceEditStatus.id !== 0}
                  onClick={() => editDevice(item)}
                  className='btn btn-primary btn-sm me-2'>
                  Edit
                </button>
                {deviceEditStatus.id === Number(item.id) &&
                  <>
                    <button
                      onClick={() => saveChanges(item)}
                      className='btn btn-success btn-sm me-2'>
                      Save
                    </button>

                    <button onClick={() => deleteDevice(item)}
                      className='btn btn-danger btn-sm me-2'>
                      Delete
                    </button>
                  </>
                }
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default Page2;

