import React, { useState, useEffect, useRef } from 'react';
import { Device, Props } from './utils/deviceType';
import moment from 'moment';
import { TableVirtuoso , VirtuosoHandle } from 'react-virtuoso'
import './TableVirtuosoStyles.css';
import { TableDeviceFooter } from './components/TableDeviceFooter';


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

  const virtuosoRef = useRef<VirtuosoHandle>(null);
  return (
    <>
      <h1>Device Entities</h1>
      <p>Devices stored in IndexedDB</p>

      {/* <button className='btn btn-primary mb-3' onClick={() => virtuosoRef.current?.scrollToIndex({
          index: Math.random() * deviceList.length,
          align: "start",
          behavior: "smooth"
        })}>Scroll
      </button> */}

      <TableVirtuoso
        id="tableDeviceList"
        data={filteredArray}
        fixedFooterContent={() => <TableDeviceFooter />}
        ref={virtuosoRef}
        fixedHeaderContent={() => (
          <tr className='bg-secondary text-light h6'>
            <th>Name</th>
            <th>Serial Number</th>
            <th style={{ width:"120px"}}>Last Connection</th>
            <th style={{textAlign: "center", width:"100px"}}>
              Status
              <input
                className='ms-2 form-check-input'
                type="checkbox"
                checked={filterStatus}
                onChange={(e) => setFilterStatus(e.target.checked)}
              />
            </th>
            <th style={{width:"185px"}}></th>
          </tr>
        )}
        itemContent={(index, item) => (
          <>
            <td>
              <input
                className='w-100'
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
                className='w-100'
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
            <td>
              <input
                disabled={deviceEditStatus.id !== Number(item.id)}
                type='date'
                value={moment(item.last_connection).format('YYYY-MM-DD')}
                onChange={(e) => {
                  item.last_connection = e.target.value
                  setDeviceEditStatus({ ...item, last_connection: new Date(item.last_connection) })
                }}
              />
            </td>
            <td>
              <div className="form-check form-switch float-end me-2" >
                <input
                  className="form-check-input"
                  role="switch"
                  type="checkbox"
                  disabled={deviceEditStatus.id !== Number(item.id)}
                  checked={item.status}
                  onChange={(e) => {
                    item.status = e.target.checked;
                    setDeviceEditStatus({ ...item, status: e.target.checked })
                  }}
                />
              </div>
            </td>
            <td>
              <button
                disabled={deviceEditStatus.id !== 0}
                onClick={() => editDevice(item)}
                className='btn btn-dark btn-sm me-2 mt-1 float-end'>
                Edit
              </button>
              {deviceEditStatus.id === Number(item.id) &&
                <>
                  <button
                    onClick={() => saveChanges(item)}
                    className='btn btn-outline-success btn-sm me-2 mt-1'>
                    Save
                  </button>
                  <button onClick={() => deleteDevice(item)}
                    className='btn btn-outline-danger btn-sm me-2 mt-1'>
                    Delete
                  </button>
                </>
              }
            </td>

          </>
        )}
      />

      {/* <table className="table table-hover">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Serial Number</th>
            <th scope="col">Last Connection</th>
            <th scope="col">
              Status
              <input
                className='ms-2 form-check-input'
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
              <td>
                <input
                  disabled={deviceEditStatus.id !== Number(item.id)}
                  type='date'
                  value={moment(item.last_connection).format('YYYY-MM-DD')}
                  onChange={(e) => {
                    item.last_connection = e.target.value
                    setDeviceEditStatus({ ...item, last_connection: new Date(item.last_connection) })
                  }}
                />
              </td>
              <td>
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  role="switch"
                  type="checkbox"
                  disabled={deviceEditStatus.id !== Number(item.id)}
                  checked={item.status}
                  onChange={(e) => {
                    item.status = e.target.checked;
                    setDeviceEditStatus({ ...item, status: e.target.checked })
                  }}
                />
                </div>
              </td>
              <td>
                <button
                  disabled={deviceEditStatus.id !== 0}
                  onClick={() => editDevice(item)}
                  className='btn btn-dark btn-sm me-2'>
                  Edit
                </button>
                {deviceEditStatus.id === Number(item.id) &&
                  <>
                    <button
                      onClick={() => saveChanges(item)}
                      className='btn btn-outline-success btn-sm me-2'>
                      Save
                    </button>

                    <button onClick={() => deleteDevice(item)}
                      className='btn btn-outline-danger btn-sm me-2'>
                      Delete
                    </button>
                  </>
                }
              </td>
            </tr>
          ))}
        </tbody>
      </table> */}
    </>
  );
}

export default Page2;

