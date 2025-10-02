"use strict"

import { Outlet } from "react-router-dom";
import GuestHeader from "./Header";

function GuestLayout() {
    return ( 
        <div className="flex flex-col bg-white overflow-hidden">
            {/* guest header */}
            <GuestHeader />
            <main className="flex flex-col w-full">
                <Outlet />
            </main>
        </div>
     );
}

export default GuestLayout;