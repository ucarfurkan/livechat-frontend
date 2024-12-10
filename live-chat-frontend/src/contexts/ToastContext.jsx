/* eslint-disable react/prop-types */
import { createContext, useState } from 'react'

export const ToastContext = createContext({})

export default function ToastContextProvider({ children }) {
    const [toast, setToast] = useState(null);

    async function sendToastMessage(message, type) {
      setToast({message, type});
      setTimeout(() => {
        setToast(null)
      }, 2500);
    }
  return (
    <ToastContext.Provider value={{toast, setToast, sendToastMessage }}>
      {children}
    </ToastContext.Provider>
  )
}