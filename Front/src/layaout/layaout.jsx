import { Outlet } from "react-router"
import Navbar from "../components/navbar/navbar"
const layaout = ( ) => {
    return ( 
        <div className="w-full max-w-[1000px] mx-auto px-6 pb-10">
            <Navbar />
            <main>
                <Outlet />
            </main>
        </div>
    )
}

export default layaout