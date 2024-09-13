import React, { useState } from 'react'
import { TableDeviceFooter } from './TableDeviceFooter';
import { TableVirtuoso } from 'react-virtuoso';
import { Device, emptyDeviceEntity } from '../../utils/deviceType';
import moment from 'moment';

interface ChildProps {
  deviceList: Device[];
}

export const TableDeviceVirtuoso: React.FC<ChildProps> = ({ deviceList }) => {
  const [filterStatus, setFilterStatus] = useState<boolean>(false);
  const [deviceEditStatus, setDeviceEditStatus] = useState<Device>(emptyDeviceEntity);

  const filteredArray: Device[] = filterStatus ? deviceList.filter(item => item.status === filterStatus) : deviceList;

  return (
    <TableVirtuoso
      id="tableDeviceList"
      data={filteredArray}
      fixedFooterContent={() => <TableDeviceFooter />}
      // ref={virtuosoRef}
      fixedHeaderContent={() => (
        <tr className='bg-secondary text-light h6'>
          <th>Name</th>
          <th>Serial Number</th>
          <th style={{ width: "120px" }}>Last Connection</th>
          <th style={{ textAlign: "center", width: "100px" }}>
            Status
            <input
              className='ms-2 form-check-input'
              type="checkbox"
              checked={filterStatus}
              onChange={(e) => setFilterStatus(e.target.checked)}
            />
          </th>
          <th style={{ width: "185px" }}></th>
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
                // if (limitInputLength(e)) return;
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
          {/* <td>
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
          </td> */}

        </>
      )}
    />
  )
}
