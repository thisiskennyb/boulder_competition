import { useState } from "react"
import axios from 'axios';
import { toast } from "react-toastify";
export default function Register() {
    const [formData, setFormData ] = useState({
        "first_name": "",
        "last_name": "",
        "email": "",
        "password": "",
        "re_password": "",
    })

    const { first_name, last_name, email, password, re_password} = formData

    const onChange = (event) => {
        setFormData({...formData, [event.target.name]: event.target.value})
    }

    const onSubmit = async (event) => {
        event.preventDefault();
    
        try {
          // Make a request to create a new user
          const response = await axios.post('http://localhost/api/users/', formData);

          toast.success('Please check your email to activate your account before logging in')
    
          // Handle the response as needed (redirect, show success message, etc.)
          console.log('User created successfully:', response.data);
    
          // You may want to redirect the user or perform other actions upon successful user creation
        } catch (error) {

          toast.error('oops, something went wrong')

          // Handle errors (display error messages, etc.)
          console.error('User creation failed:', error.response?.data || 'An error occurred');
        }
      };
    


    return (
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto h-10 w-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
            alt="Your Company"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={onSubmit}>
            <div>
              <label htmlFor="first_name" className="block text-sm font-medium leading-6 text-gray-900">
                First Name
              </label>
              <div className="mt-2">
                <input
                  id="first_name"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  value={first_name}
                  onChange={onChange}
                  name="first_name"
                  type="text"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="last_name" className="block text-sm font-medium leading-6 text-gray-900">
                Last Name
              </label>
              <div className="mt-2">
                <input
                  id="last_name"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  value={last_name}
                  onChange={onChange}
                  name="last_name"
                  type="text"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  value={email}
                  onChange={onChange}
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                Password
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  value={password}
                  onChange={onChange}
                  name="password"
                  type="password"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="re_password" className="block text-sm font-medium leading-6 text-gray-900">
                Confirm Password
              </label>
              <div className="mt-2">
                <input
                  id="re_password"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  value={re_password}
                  onChange={onChange}
                  name="re_password"
                  type="password"
                  required
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign up
              </button>
            </div>
          </form>

        
        </div>
      </div>
    )
}