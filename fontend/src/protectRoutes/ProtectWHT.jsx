import { Navigate, Outlet } from "react-router-dom";


const ProtectWHT = () => {
    try{
        const token = localStorage.getItem("token");
        return token? <Outlet/> : <Navigate to='/login' replace/>
    }catch(err){
        return err
    }
}

export default ProtectWHT;