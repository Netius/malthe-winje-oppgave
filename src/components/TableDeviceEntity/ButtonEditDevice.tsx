import React, { useState } from 'react'
import { Device, HandleDeviceState } from '../../utils/deviceType';


export const ButtonEditDevice: React.FC<HandleDeviceState>= ({handlerSetDeviceState, item}) => {
  
  // Makes row in table editable
  const editDevice = (device : Device) => {
      handlerSetDeviceState(device);
    };
  
  return (
    <button
      // disabled={item.id === checkboxDisabledById}
      onClick={() => editDevice(item)}
      className='btn btn-dark btn-sm me-2 mt-1 float-end'>
      Edit
    </button>
  )
}
