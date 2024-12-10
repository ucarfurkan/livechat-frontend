import './App.css'
import { Route, Routes } from 'react-router'
import Register from './pages/Register/Register'
import Login from './pages/Login/Login'
import Chat from './pages/Chat/Chat'

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="register/" element={<Register />} />
        <Route path="chat/" element={<Chat />} />
      </Routes>
    </>
  )
}

export default App
