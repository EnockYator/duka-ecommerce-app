"use strict"


import { BadgeCheck, ChartNoAxesCombined, ChartNoAxesCombinedIcon, LayoutDashboard, ShoppingBasket } from "lucide-react";
import { Fragment } from "react"
import { useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";

function MenuItems() {
    const navigate = useNavigate()
    const adminSideBarMenuItems = [
        {
            id: "dashboard",
            label: "Dashboard",
            path: "/admin/dashboard",
            icon: <LayoutDashboard />
        },
        {
            id: "products",
            label: "Products",
            path: "/admin/products",
            icon: <ShoppingBasket />
        },
        {
            id: "orders",
            label: "Orders",
            path: "/admin/orders",
            icon: <BadgeCheck />
        }
    ];
    return (
        <nav className="mt-8 flex flex-col gap-2">
            {
                adminSideBarMenuItems.map((menuItem) => 
                    <div key={menuItem.id} 
                        className="flex items-center gap-2 rounded-md px-3 py-2 cursor-pointer text-muted-foreground hover:bg-muted hover:text-foreground text-xl"
                        onClick={() => navigate(menuItem.path)}
                    >
                        {menuItem.icon}
                        <span>{menuItem.label}</span>
                    </div>
                )
            } 
        </nav>
    );
};
function AdminSideBar({ open, setOpen}) {
    const navigate = useNavigate();
    return ( 
        <Fragment>
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetContent side="left" className="w-64">
                    <div className="flex flex-col h-full">
                        <SheetHeader className="border-b">
                            <ChartNoAxesCombinedIcon size={28} />
                            <SheetTitle className="flex gap-2 mt-5">
                                <span>Admin Panel</span>
                            </SheetTitle>
                        </SheetHeader>
                        <MenuItems />
                    </div>
                </SheetContent>
            </Sheet>
            <aside className="hidden w-64 flex-col border-r bg-background p-6 lg:flex">
                <div className="flex items-center gap-2 cursor-pointer"
                onClick={() => navigate("/admin/dashboard")}
                >
                    <ChartNoAxesCombined size={28}/>
                    <h1 className="text-2xl font-extrabold">Admin Panel</h1>
                </div>
                <MenuItems />
            </aside>
        </Fragment>
     );
}

export default AdminSideBar;