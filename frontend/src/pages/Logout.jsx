import { Logout as fetchFunc } from "../authapi/auth";
import { toast } from "react-toastify";
import { useEffect } from "react";

export default function Logout() {
    useEffect(() => {
        fetchFunc()
    }, [])
    


    return (
        <>
        <h1 className="text-xl5 text-rose-400">Thanks for stopping by!!</h1>
        </>
    )
}