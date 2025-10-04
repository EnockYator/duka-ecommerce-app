"use strict"

import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

function GuestHomePage() {
    return ( 
        <div>
            <p>Guest Home Page</p>
            <Button>
                <Link to="/login">Go to login page</Link>
            </Button>
        </div>
        
     );
}

export default GuestHomePage;