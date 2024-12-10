/* eslint-disable react/prop-types */
import { createContext, useState } from 'react'

export const UserContext = createContext({})

export default function UserContextProvider({ children }) {
  const [userId, setUserId] = useState(null)

  return (
    <UserContext.Provider value={{userId, setUserId }}>
      {children}
    </UserContext.Provider>
  )
}
