import React, { useState, useEffect, useRef } from 'react';
import { Device, Props } from './utils/deviceType';
import { VirtuosoHandle } from 'react-virtuoso'
import './TableVirtuosoStyles.css';
import { TableDeviceVirtuoso } from './components/TableDeviceEntity/TableDeviceVirtuoso';
import { getAllsData } from './utils/indexDbApi';

const Page2: React.FC<Props> = ({ setCounterStatus }) => {
  const [deviceList, setDeviceList] = useState<Device[]>([]);


  const effectRan = useRef<boolean>(false);
  useEffect(() => {
    
    if (!effectRan.current) {
      getAllsData().then((result : any) => setDeviceList(result));
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

