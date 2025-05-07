import { useState } from 'react';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { useAuthStore } from "../store/useAuthStore";
import LoginBg from '../assets/Login_bg_1.png'; // adjust path if needed
import { useLocation, useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = { email, password };
    await login(formData);
    
    //get the latest authUser value directly from the store
    const currentUser = useAuthStore.getState().authUser;        
    if (currentUser !== null) {
      navigate(from, { replace: true });
    }
    console.log('Login attempted with:', { email, password });
  };

  return (
    <div
      className="flex h-screen bg-cover bg-center"
      // style={{
      //   backgroundImage: url(`${LoginBg}`),
      // }}
    >
      {/* Left side - Logo */}
      <div className="hidden md:flex md:w-1/2 justify-center items-center">
        <h1 className="text-white text-6xl font-bold">Furniture plus</h1>
      </div>

      {/* Right side - Login form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo - only visible on small screens */}
          <div className="md:hidden mb-8 text-center">
            <h1 className="text-blue-800 text-4xl font-bold">Furniture plus</h1>
          </div>

          <h2 className="text-3xl font-bold mb-2">Login</h2>
          <p className="text-gray-600 mb-8">Login to access your account</p>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full p-3 border border-gray-300 rounded-md"
                placeholder="john.doe@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className="w-full p-3 border border-gray-300 rounded-md pr-10"
                  placeholder="••••••••••••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center px-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? 
                    <EyeOffIcon className="h-5 w-5 text-gray-500" /> : 
                    <EyeIcon className="h-5 w-5 text-gray-500" />
                  }
                </button>
              </div>
            </div>

            <div className="flex justify-end mb-6">
              <a href="#" className="text-bg-[#104F7E] thover:underline">
                Forgot Password
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-[#104F7E] text-white py-3 rounded-md hover:bg-[#0d4268] transition duration-200"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}