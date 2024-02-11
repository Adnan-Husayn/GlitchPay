import axios from "axios"
import { Appbar } from "../components/Appbar"
import { Balance } from "../components/Balance"
import { Users } from "../components/Users"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { Signin } from './Signin';
const apiUrl = process.env.REACT_APP_API_URL;

export const Dashboard = () => {

    const [balance, setBalance] = useState(0)
    const [user, setUser] = useState({})
    const navigate = useNavigate(); 
    

    const fetchData = async () => {
        try {
          const response = await axios.get(apiUrl, {
            headers: {
              Authorization: 'Bearer ' + localStorage.getItem("token")
            }
          });
          setBalance(response.data.balance);

            const response2 = await axios.get(apiUrl, {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem("token")
                }
            });
            const users = await response2.data.user;
            setUser(users)
        } catch (error) {
          console.error('Error fetching balance:', error);
        }
      };
    
      useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate('/Signin')
        } else {
            fetchData();
        }
    }, []);



    return <div>
        <Appbar user={user}/>
        <div className="m-8">
            <Balance value={balance} />
            <Users user={user}/>
        </div>
    </div>
}