import axios from 'axios'
const base_url = import.meta.env.VITE_BASE_URL
// const API_BASE_URL = `http://localhost:8000/api`
const API_BASE_URL = `http://${base_url}/api`

export async function Logout(){
    try {
        await axios.post(`${API_BASE_URL}/logout/`, null, {
            withCredentials: true, // Ensure that cookies are included in the request
          })
        
    }
    catch (error){
        console.error('Error fetching data', error)
    }

}