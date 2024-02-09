import React from 'react';
import { useNavigate } from 'react-router-dom';

const useLogout = () => {
    const navigate = useNavigate();

    const logout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.clear
        
        navigate('/Signin');
    };

    return logout;
};


const LogoutButton = () => {
    const logout = useLogout();

    return (
        <button onClick={logout} style={{cursor: 'pointer'}}>
            Logout
        </button>
    );
};

export default LogoutButton;
