import React, { useState, ChangeEvent } from 'react';

interface Device {
  id: string | number;
  name: string;
  serial_number: number,
  last_connection: Date;
  status: boolean;
}

interface ListDevicesProps {
  devicesList: Device[];
}
function myFunction () {

}


function ListDevices({ devicesList }: ListDevicesProps): JSX.Element {
  const [checkboxStatus, setCheckboxStatus] = useState<boolean>(false);
  const [filterStatus, setFilterStatus] = useState<boolean>(false);
  let copyDevicelist = devicesList.filter(item => item.status === filterStatus);

  function handleStatus (e: any, item: Device) {    
    // console.log(e.target.checked)
    // setCheckboxStatus(e.target.checked);
    
    const idb = window.indexedDB;
    const dbPromise = idb.open("malthewinje-db", 1);
    
    
    dbPromise.onsuccess = () => {
      const db = dbPromise.result;
      var tx = db.transaction("deviceEntity", "readwrite");
      var deviceEntity = tx.objectStore("deviceEntity");
      
      const selectedDevice = deviceEntity.put({
        id: item?.id,
        name: item.name,
        serial_number: item.serial_number,
        last_connection: item.last_connection,
        status: e.target.checked,
      });
      selectedDevice.onsuccess = (query) => {
        tx.oncomplete = function () {
          db.close();
        };
      }
      
    }



    
  }

  return (
    <table className="table">
      <thead>
        <tr>
          <th scope="col">Id</th>
          <th scope="col">Name</th>
          <th scope="col">Serial Number</th>
          <th scope="col">Last Connection</th>
          <th scope="col">Status 
          <input
              type="checkbox"
              defaultChecked={filterStatus}
              onChange={() => setFilterStatus(!filterStatus)}
            />
          </th>
        </tr>
      </thead>
      <tbody>
        {copyDevicelist.map((item: Device) => (
          
          <tr key={item.id}>
            <td>{item.id}</td>
            <td>{item.name}</td>
            <td>{item.serial_number}</td>
            <td>{item.last_connection.toString()}</td>
            <td>
            <input
              type="checkbox"
              defaultChecked={item.status}
              onChange={(e) => handleStatus(e, item)}
            />
              {item.status.toString()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default ListDevices;

