import { ShoppingCart, User, Menu, X, ChevronRight, Home, Layout } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { useState, useEffect } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const { logout, authUser } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cartBounce, setCartBounce] = useState(false);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Cart animation effect
  const animateCart = () => {
    setCartBounce(true);
    setTimeout(() => setCartBounce(false), 500);
  };

  const handleCartClick = () => {
    animateCart();
    navigate("/cart");
  };

  const handleLogoClick = () => {
    navigate("/dashboard");
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header 
      className={`w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-md py-2" : "bg-white/90 py-4"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div 
            onClick={handleLogoClick}
            className="flex items-center cursor-pointer group"
          >
            <h1 className="text-2xl font-bold text-[#163E43] transition-all duration-300 group-hover:scale-105">
              Styled Spaces
            </h1>
            <div className="ml-2 h-4 w-4 rounded-full bg-[#163E43] opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8 mx-auto">
            <NavLink 
              href="/dashboard"
              icon={<Home size={18} />}
              label="Home"
            />
            
            {authUser?.role === 'admin' && (
              <NavLink 
                href="/add-staff"
                icon={<User size={18} />}
                label="Add Staff"
              />
            )}
            
            <NavLink 
              href="/template"
              icon={<Layout size={18} />}
              label="Templates"
            />
            
            <button 
              onClick={logout}
              className="text-gray-700 hover:text-[#163E43] px-2 py-1 relative overflow-hidden group"
            >
              <span className="relative z-10">Log out</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#163E43] group-hover:w-full transition-all duration-300"></span>
            </button>
          </div>

          {/* Action buttons */}
          <div className="flex items-center space-x-6">
            <button
              onClick={handleCartClick}
              className={`text-[#163E43] hover:text-[#163E43]/80 transition-all duration-300 ${
                cartBounce ? "animate-bounce" : ""
              }`}
              aria-label="Shopping Cart"
            >
              <ShoppingCart size={24} />
            </button>
            
            <button 
              className="bg-[#163E43] text-white rounded-full p-2 hover:bg-[#163E43]/80 transition-all duration-300 hover:scale-110"
              aria-label="User Profile"
            >
              <User size={24} />
            </button>

            {/* Mobile menu button */}
            <button 
              onClick={toggleMenu}
              className="md:hidden text-[#163E43] hover:text-[#163E43]/80 transition-all duration-300"
              aria-label={isMenuOpen ? "Close Menu" : "Open Menu"}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div 
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMenuOpen ? "max-h-64 opacity-100 mt-4" : "max-h-0 opacity-0"
          }`}
        >
          <div className="flex flex-col space-y-4 py-2">
            <MobileNavLink 
              onClick={() => {
                navigate('/');
                setIsMenuOpen(false);
              }}
              icon={<Home size={20} />}
              label="Home"
            />
            
            {authUser?.role === 'admin' && (
              <MobileNavLink 
                onClick={() => {
                  navigate('/add-staff');
                  setIsMenuOpen(false);
                }}
                icon={<User size={20} />}
                label="Add Staff"
              />
            )}
            
            <MobileNavLink 
              onClick={() => {
                navigate('/template');
                setIsMenuOpen(false);
              }}
              icon={<Layout size={20} />}
              label="Templates"
            />
            
            <MobileNavLink 
              onClick={() => {
                handleCartClick();
                setIsMenuOpen(false);
              }}
              icon={<ShoppingCart size={20} />}
              label="Checkout"
            />
            
            <MobileNavLink 
              onClick={() => {
                logout();
                setIsMenuOpen(false);
              }}
              icon={<ChevronRight size={20} />}
              label="Log out"
            />
          </div>
        </div>
      </div>
    </header>
  );
}

// Component for desktop navigation links
function NavLink({ href, icon, label }) {
  const navigate = useNavigate();
  
  return (
    <a 
      href={href}
      onClick={(e) => {
        e.preventDefault();
        navigate(href);
      }}
      className="text-gray-700 hover:text-[#163E43] flex items-center relative group"
    >
      <span className="opacity-0 group-hover:opacity-100 absolute -left-6 transition-all duration-300">
        {icon}
      </span>
      <span className="relative z-10">{label}</span>
      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#163E43] group-hover:w-full transition-all duration-300"></span>
    </a>
  );
}

// Component for mobile navigation links
function MobileNavLink({ onClick, icon, label }) {
  return (
    <button 
      onClick={onClick}
      className="text-gray-700 hover:text-[#163E43] text-left text-lg flex items-center w-full group py-2"
    >
      <span className="mr-3 text-[#163E43]">{icon}</span>
      <span className="group-hover:translate-x-1 transition-all duration-300">{label}</span>
    </button>
  );
}