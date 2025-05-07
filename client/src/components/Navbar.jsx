import { ShoppingCart, User, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

export default function Navbar() {
  const navigate = useNavigate();
  const { logout, authUser } = useAuthStore();

  const handleCartClick = () => {
    navigate("/cart");
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <h1
            onClick={handleLogoClick}
            className="text-2xl font-bold text-[rgba(16,79,126,1)] cursor-pointer hover:text-[rgba(16,79,126,0.8)]"
          >
            Furniture plus
          </h1>

          {/* Navigation buttons - Center aligned */}
          <div className="hidden md:flex items-center space-x-6 mx-auto">
            {authUser?.role === 'admin' && (
              <a href="/add-staff" className="text-gray-700 hover:text-blue-800">
                Add Staff
              </a>
            )}
            <a href="#" className="text-gray-700 hover:text-blue-800">
              Templates
            </a>
            <button className='text-gray-700' onClick={logout}>Log out</button>
          </div>

          {/* Action buttons - Right aligned */}
          <div className="flex items-center space-x-6">
            <button
              onClick={handleCartClick}
              className="text-blue-800 hover:text-blue-600 transition-colors"
            >
              <ShoppingCart size={24} />
            </button>
            <button className="bg-blue-300 text-white rounded-full p-2 hover:bg-blue-400 transition-colors">
              <User size={24} />
            </button>

            {/* Mobile menu button */}
            <button className="md:hidden text-gray-700">
              <Menu size={24} />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden pt-4 pb-2">
          <div className="flex flex-col space-y-3">
            {authUser?.role === 'admin' && (
              <button className="text-gray-700 hover:text-blue-800 text-left text-lg" onClick={() => navigate('/add-staff')}>
                Add Staff
              </button>
            )}
            <button className="text-gray-700 hover:text-blue-800 text-left text-lg">
              Templates
            </button>
            <button className='text-gray-700' onClick={logout}>Log out</button>
            <button
              onClick={handleCartClick}
              className="text-gray-700 hover:text-blue-800 text-left text-lg flex items-center"
            >
              <ShoppingCart size={20} className="mr-2" />
              Checkout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
