import React from 'react'

type SuccessMessage = {
  isSuccess: boolean;
  message: string;
}

export const SuccessMessages : React.FC<SuccessMessage> = (isSuccess)  => {
  return (
    <div>SuccessMessages</div>
  )
}
