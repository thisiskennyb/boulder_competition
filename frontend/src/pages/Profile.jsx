import axios from 'axios'
import { useState, useEffect } from 'react';

export default function Profile () {
  const [userData, setUserData] = useState({
    "id": "",
    "first_name": "",
    "last_name": "",
    "email": "",
  })

  
  useEffect(() => {
  const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost/api/users/me/', {
          withCredentials: true, // Ensure that cookies are included in the request
        });
    
        // Handle the response data
        console.log(response.data);
        setUserData(response.data)
        
      } catch (error) {
        // Handle errors
        
        console.error('Error fetching data:', error);
      }
    };
    
    // Call the function to fetch data
    fetchData();
  }, [])

      
    return (<>
        <h1 className="text-4xl text-red-400">What a Profile Page</h1>
        <h2 className="text-2xl text-purple-900">First Name:{userData.first_name}</h2>
        <p className="text-xl text-purple-900">Last Name: {userData.last_name}</p>
        <p className="text-xl text-purple-900">Email: {userData.email}</p>
       

        </>
    )
}