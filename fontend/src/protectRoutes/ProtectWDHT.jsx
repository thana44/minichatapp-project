import { Navigate, Outlet } from "react-router-dom";

const ProtectWDHT = () => {
    try{
        const token = localStorage.getItem('token');
        return !token? <Outlet/> : <Navigate to='/' replace/>
    }catch(err){
        return err
    }
}

export default ProtectWDHT;