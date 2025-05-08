import { useState } from "react";
import { axiosInstance } from "../lib/axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import LoginBg from '../assets/Login_bg_1.png';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const register = async () => {
        if (confirmPass === password) {
            try {
                const formData = { name, email, phone, password };
                setIsLoading(true);
                const res = await axiosInstance.post("/user/register", formData);
                toast.success('Register success!')
                navigate('/login', { replace: true })
            } catch (err) {
                console.log(err.message);
                if (err?.response?.status === 400) {
                    toast.error(err?.response?.data?.msg)
                }
            } finally {
                setIsLoading(false);
            }
        } else {
            toast.error('Passwords do not match');
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        register();
    };

    return (
        <div 
            className="flex h-screen bg-cover bg-center relative overflow-hidden"
            style={{
                backgroundImage: `url(${LoginBg})`,
                backgroundColor: '#f8f9fa'
            }}
        >
            {/* Animated background elements */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 left-0 w-64 h-64 rounded-full bg-teal-800 opacity-10 animate-float-slow"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-teal-700 opacity-5 animate-float-medium"></div>
                <div className="absolute top-1/3 right-1/4 w-32 h-32 rounded-full bg-teal-600 opacity-10 animate-float-fast"></div>
            </div>

            {/* Left side - Logo */}
            <div className="hidden md:flex md:w-1/2 justify-center items-center z-10 relative">
                <div className="text-center">
                    <div className="logo-container animate-fade-in">
                        <h1 className="text-white text-6xl font-bold mb-4">Nova Living</h1>
                        <p className="text-white text-xl opacity-80">Transform rooms with beautiful furniture</p>
                    </div>
                </div>
            </div>

            {/* Right side - Registration form */}
            <div className="w-full md:w-1/2 flex items-center justify-center p-4 md:p-8 z-10 overflow-auto max-h-screen">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 md:p-8 animate-slide-up my-4">
                    {/* Mobile logo - only visible on small screens */}
                    <div className="md:hidden mb-8 text-center">
                        <h1 className="text-[#163E43] text-4xl font-bold">Styled Spaces</h1>
                        <p className="text-gray-600 mt-2">Transform rooms with beautiful furniture</p>
                    </div>

                    <h2 className="text-3xl font-bold mb-2 text-[#163E43]">Create an Account</h2>
                    <p className="text-gray-600 mb-8">Join Styled Spaces to get started</p>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4 animate-fade-in" style={{animationDelay: '0.1s'}}>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                Full Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#163E43] focus:border-[#163E43] transition-all duration-200"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-4 animate-fade-in" style={{animationDelay: '0.2s'}}>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#163E43] focus:border-[#163E43] transition-all duration-200"
                                placeholder="john.doe@gmail.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-4 animate-fade-in" style={{animationDelay: '0.3s'}}>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#163E43] focus:border-[#163E43] transition-all duration-200"
                                placeholder="077 334 5678"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </div>

                        <div className="mb-4 animate-fade-in" style={{animationDelay: '0.4s'}}>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    id="password"
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#163E43] focus:border-[#163E43] transition-all duration-200 pr-10"
                                    placeholder="•••••"
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
                                        <EyeOffIcon className="h-5 w-5 text-gray-500 hover:text-[#163E43] transition-colors duration-200" /> : 
                                        <EyeIcon className="h-5 w-5 text-gray-500 hover:text-[#163E43] transition-colors duration-200" />
                                    }
                                </button>
                            </div>
                        </div>

                        <div className="mb-4 animate-fade-in" style={{animationDelay: '0.5s'}}>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    id="confirmPassword"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#163E43] focus:border-[#163E43] transition-all duration-200 pr-10"
                                    placeholder="•••••"
                                    value={confirmPass}
                                    onChange={(e) => setConfirmPass(e.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 flex items-center px-3"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? 
                                        <EyeOffIcon className="h-5 w-5 text-gray-500 hover:text-[#163E43] transition-colors duration-200" /> : 
                                        <EyeIcon className="h-5 w-5 text-gray-500 hover:text-[#163E43] transition-colors duration-200" />
                                    }
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#163E43] text-white py-2 rounded-lg hover:bg-[#0d2729] transition duration-300 transform hover:scale-[1.02] active:scale-[0.98] animate-fade-in flex justify-center items-center"
                            style={{animationDelay: '0.6s'}}
                        >
                            {isLoading ? (
                                <span className="loader"></span>
                            ) : (
                                "Register"
                            )}
                        </button>

                        <div className="flex justify-center mb-3 mt-3 animate-fade-in" style={{animationDelay: '0.7s'}}>
                            <a href="/login" className="text-[#163E43] hover:underline transition-all duration-200">
                                Already have an account? Login
                            </a>
                        </div>
                        
                        <p className="text-xs text-gray-500 mb-2 text-center animate-fade-in" style={{animationDelay: '0.8s'}}>
                            By registering, you agree to Nova Living's Terms of Service and Privacy Policy
                        </p>
                    </form>
                </div>
            </div>

            {/* CSS for animations */}
            <style jsx>{`
                @keyframes float-slow {
                    0%, 100% { transform: translateY(0) translateX(0); }
                    50% { transform: translateY(-20px) translateX(10px); }
                }
                
                @keyframes float-medium {
                    0%, 100% { transform: translateY(0) translateX(0); }
                    50% { transform: translateY(-15px) translateX(-10px); }
                }
                
                @keyframes float-fast {
                    0%, 100% { transform: translateY(0) translateX(0); }
                    50% { transform: translateY(-10px) translateX(5px); }
                }
                
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                
                @keyframes slide-up {
                    from { transform: translateY(30px); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                
                .animate-float-slow {
                    animation: float-slow 7s infinite ease-in-out;
                }
                
                .animate-float-medium {
                    animation: float-medium 5s infinite ease-in-out;
                }
                
                .animate-float-fast {
                    animation: float-fast 4s infinite ease-in-out;
                }
                
                .animate-fade-in {
                    animation: fade-in 0.8s forwards;
                }
                
                .animate-slide-up {
                    animation: slide-up 0.6s forwards;
                }
                
                .loader {
                    width: 20px;
                    height: 20px;
                    border: 3px solid rgba(255, 255, 255, 0.3);
                    border-radius: 50%;
                    border-top-color: white;
                    animation: spin 1s ease-in-out infinite;
                }
                
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
 
export default Register;