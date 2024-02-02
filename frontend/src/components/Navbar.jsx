import { Link } from "react-router-dom"

export default function Navbar() {
    return (
        <nav className="bg-indigo-200 p-4">
            <div className="container mx-auto flex justify-between items-center">
                <img src="https://placekitten.com/100/100" className="rounded-full mx-5"/>
                <Link to='profile'>
                    <h1 className="text-4xl text-violet-700">My Profile</h1>
                </Link>
                <Link to='/'>
                    <h1 className="text-4xl text-violet-700">Placeholder1</h1>
                </Link>
                <Link to='/'>
                    <h1 className="text-4xl text-violet-700">Placeholder2</h1>
                </Link>
                <Link to='/'>
                    <h1 className="text-4xl text-violet-700">Placeholder3</h1>
                </Link>
                <Link to='/'>
                    <h1 className="text-4xl text-violet-700">Placehodler4</h1>
                </Link>
                <Link to='logout'>
                    <h1 className="text-4xl text-violet-700 -mx-5">Logout</h1>
                </Link>

            </div>
          

        </nav>
    )
}