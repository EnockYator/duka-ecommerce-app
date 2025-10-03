import { Navigate, Route, Routes } from "react-router-dom"
// auth
import AuthLayout from "./components/auth/AuthLayout"
import AuthLogin from "./pages/auth/login"
import AuthRegister from "./pages/auth/register"
import RefreshPage from "./pages/auth/refresh"
// admin
import AdminLayout from "./components/admin-view/AdminLayout"
import AdminDashBoard from "./pages/admin-view/dashboard"
import AdminProducts from "./pages/admin-view/products"
import AdminOrders from "./pages/admin-view/orders"
// shopping
import ShoppingLayout from "./components/shopping-view/ShoppingLayout"
import ShoppingHome from "./pages/shopping-view/home"
import ShoppingListing from "./pages/shopping-view/listing"
import ShoppingAccount from "./pages/shopping-view/account"
import ShoppingCheckout from "./pages/shopping-view/checkout"
// not-found
import NotFound from "./pages/not-found"
// un-auth
import UnaAuthorizedPage from "./pages/shopping-view/unauth"
// common components
import CheckAuth from "./components/common/check-auth"
//guest
import GuestHomePage from "./pages/guest-view/home"
import GuestLayout from "./components/guest-view/GuestLayout"
import About from "./pages/guest-view/about"

// custom hooks
import { useAuth } from "./custom_hooks/useAuth"

//shadcn
import { Toaster } from "sonner"
import { AuthNotifier } from "./contexts/auth/authNotifier"



function App() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="flex min-h-screen w-screen flex-col overflow-hidden bg-white">

      {/* sonner from shadcn*/}
      <AuthNotifier />
      <Toaster 
        position="top-right" 
        richColors // stronger color scheme
        closeButton // enable close button
      />

      { /* Common components */ }

      <Routes>
        {/* auth routes */}
        <Route path="auth/" element={
          <CheckAuth isAuthenticated={isAuthenticated} user={user}>
            <AuthLayout/>
          </CheckAuth>
        }>
          <Route index element={<Navigate to="login" replace />} /> {/* default to login */ /* SEO friendly by avoiding duplicates */}
          <Route path="login" element={<AuthLogin/>}></Route>
          <Route path="register" element={<AuthRegister/>}></Route>
          <Route path="refresh" element={<RefreshPage/>}></Route>

        </Route>
        
        {/* admin routes */}
        <Route path="admin/" element={
          <CheckAuth isAuthenticated={isAuthenticated} user={user}>
            <AdminLayout/>
          </CheckAuth>
        }>
          <Route index element={<Navigate to="dashboard" replace />} /> 
          <Route path="dashboard" element={<AdminDashBoard />} />
          <Route path="products" element={<AdminProducts/>}></Route>
          <Route path="orders" element={<AdminOrders/>}></Route>
        </Route>

        {/* shopping routes */}
        <Route path="shop/" element={
          <CheckAuth isAuthenticated={isAuthenticated} user={user}>
            <ShoppingLayout/>
          </CheckAuth>
        }>
          <Route index element={<Navigate to="home" replace />} /> 
          <Route path="home" element={<ShoppingHome />} />
          <Route path="listing" element={<ShoppingListing/>}></Route>
          <Route path="account" element={<ShoppingAccount/>}></Route>
          <Route path="checkout" element={<ShoppingCheckout/>}></Route>
        </Route>

        {/* guest routes */}
        <Route path="/" element={<GuestLayout/>}>
          <Route index element={<GuestHomePage />} /> {/* Default guest home */}
          <Route path="about" element={<About />}></Route>
        </Route>


        {/* not-found */}
        <Route path="*" element={<NotFound/>}></Route>

        {/* unauth */}
        <Route path="unauth-page" element={<UnaAuthorizedPage/>}></Route>
        
      </Routes>
    </div>
  )
}

export default App
