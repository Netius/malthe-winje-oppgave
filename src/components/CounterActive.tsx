import React from 'react';
import { State } from '../utils/deviceType';

interface ChildProps {
  counterStatus: State;
}

const CounterActive: React.FC<ChildProps> = ({counterStatus}) => {
  return (
    <div style={{ position:'absolute', right: '20px' , top: '20px'}}>
      <span className='alert alert-primary me-2 p-2'>Active: {counterStatus.activeCount}</span>
      <span className='alert alert-secondary p-2'>Inactive: {counterStatus.inactiveCount}</span>
    </div>
  );
};

export default CounterActive;

