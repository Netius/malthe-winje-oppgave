import React, { useState } from 'react'
import { TableDeviceFooter } from './TableDeviceFooter';
import { TableVirtuoso } from 'react-virtuoso';
import { Device } from '../../utils/deviceType';
import moment from 'moment';
import { useDispatch, useSelector } from "react-redux";
import { editDevice, saveDevice, deleteDevice } from '../../utils/taskActions';
import { RootState } from '../../utils/rootReducer';



interface ChildProps {
  deviceList: Device[];
  // handleGetAllData: () => void
}

export const TableDeviceVirtuoso: React.FC<ChildProps> = ({ deviceList }) => {
  const [filterStatus, setFilterStatus] = useState<boolean>(false);
  const editDev: Device = useSelector<RootState, Device>(state => state.device)

  const dispatch = useDispatch();

  const limitInputLength = (e: React.ChangeEvent<HTMLInputElement>): boolean => {
    return e.target.value.length >= 16;
  };

  const filteredArray: Device[] = filterStatus ? deviceList.filter(item => item.status === filterStatus) : deviceList;

  return (
    <>
      {editDev.id} - {editDev.name} - {editDev.serial_number} - {editDev.last_connection.toString()} - {editDev.status.toString()}
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
        itemContent={(_, item) => (
          <>
            <td>
              <input
                className='w-100'
                type='text'
                disabled={editDev.id !== Number(item.id)}
                value={item.name}
                maxLength={32}
                onChange={(e) => {
                  item.name = e.target.value;
                  dispatch(editDevice({ ...editDev, name: e.target.value }));
                }}
              />
            </td>
            <td>
              <input
                className='w-100'
                type='number'
                disabled={editDev.id !== Number(item.id)}
                value={item.serial_number}
                maxLength={16}
                autoFocus
                onChange={(e) => {
                  if (limitInputLength(e)) return;
                  item.serial_number = Number(e.target.value);
                  dispatch(editDevice({ ...editDev, serial_number: e.target.value }))
                }}
              />
            </td>
            <td>
              <input
                disabled={editDev.id !== Number(item.id)}
                type='date'
                value={moment(item.last_connection).format('YYYY-MM-DD')}
                onChange={(e) => {
                  item.last_connection = e.target.value
                  dispatch(editDevice({ ...editDev, last_connection: new Date(e.target.value) }))
                }}
              />
            </td>
            <td>
              <div className="form-check form-switch float-end me-2" >
                <input
                  className="form-check-input"
                  role="switch"
                  type="checkbox"
                  disabled={editDev.id !== Number(item.id)}
                  checked={item.status}
                  onChange={(e) => {
                    item.status = e.target.checked;
                    dispatch(editDevice({ ...editDev, status: e.target.checked }))
                  }}
                />
              </div>
            </td>
            <td>
              <button onClick={() => dispatch(editDevice(item))} className='btn btn-dark btn-sm me-2 mt-1 float-end' >Edit</button>
              {editDev.id === Number(item.id) &&
                <>
                  <button onClick={() => dispatch(saveDevice(editDev))} className='btn btn-success btn-sm me-2 mt-1'>Save</button>
                  <button onClick={() => dispatch(deleteDevice(editDev))} className='btn btn-outline-danger btn-sm me-2 mt-1' >Delete</button>
                </>
              }
            </td>

          </>
        )}
      />
    </>

  )
}
