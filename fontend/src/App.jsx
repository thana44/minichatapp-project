import {BrowserRouter, Routes, Route} from 'react-router-dom';
import './App.css'
import UserList from './UserList';
import Login from './Login';
import Register from './Register';
import Chat from './Chat';
import ProtectWHT from './protectRoutes/ProtectWHT';
import ProtectWDHT from './protectRoutes/ProtectWDHT';
import Notfoundpage from './Notfoundpage';
import Loading from './Loading';


function App() {

  return (
      <BrowserRouter>
      <Routes>

        <Route element={<ProtectWHT/>}>
          <Route path='/' element={<UserList/>}></Route>
          <Route path='/chat/:myid/:userid' element={<Chat/>}/>
        </Route>
        
        <Route element={<ProtectWDHT/>}>
          <Route path='/login' element={<Login/>}></Route>
          <Route path='/register' element={<Register/>}></Route>
        </Route>

        <Route path='*' element={<Notfoundpage/>}></Route>

      </Routes>
      </BrowserRouter>
  )
}

export default App
