import { BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import Home from './pages/Home';
import LoginPage from './pages/Login';
import Dashboard from './pages/Dashboard';
import AddStaffPage from './pages/AddStaff';
import TestFurnitureDesigner from './pages/TestDashboard';
import FurnitureTemplate from './pages/Template';
import CartPage from './pages/Cart';
import CheckoutPage from './pages/Checkout';
import { useAuthStore } from './store/useAuthStore';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';

function App() {
  const { authUser, isCheckingAuth, checkAuth } = useAuthStore();  

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  if (isCheckingAuth && !authUser) {
    return (<div>loading...</div>)
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route index element={authUser? <Dashboard /> : <Navigate to='/login' />} />
        {/* <Route path="/home" element={<Home />} /> */}
        <Route path="/login" element={!authUser? <LoginPage /> : <Navigate to='/' />} />
        <Route path="/add-staff" element={(authUser && authUser?.role === 'admin') ? <AddStaffPage /> : <Navigate to='/' />} />
        <Route path="/cart" element={authUser? <CartPage /> : <Navigate to='/login' />} /> 
        <Route path="/checkout" element={authUser? <CheckoutPage /> : <Navigate to='/login' />} /> 
        <Route path="/test" element={<TestFurnitureDesigner />} /> 
        <Route path="/template" element={<FurnitureTemplate/>} />
        <Route path="/dashboard" element={authUser? <Dashboard /> : <Navigate to='/login' />} />

      </Routes>

      <Toaster position="top-right"/>
    </BrowserRouter>
  )
}

export default App
