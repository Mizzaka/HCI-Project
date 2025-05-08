import { useState, useEffect } from 'react';
import { ShoppingCart, User, ChevronRight } from 'lucide-react';
import Navbar from '../components/Navbar';
import toast from 'react-hot-toast';
import { axiosInstance } from '../lib/axios';

export default function AddStaffPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [animateIn, setAnimateIn] = useState(false);

  // Animation trigger
  useEffect(() => {
    setAnimateIn(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    const formData = { name: firstName, email, phone, password };

    try {
      await axiosInstance.post('/user/register', formData);
      setFirstName('');
      setLastName('');
      setEmail('');
      setPhone('');
      setPassword('');
      setConfirmPassword('');
      toast.success('Staff member added successfully!')
    } catch (err) {
      if (err?.response?.status === 400) {
        toast.error(err?.response?.data?.msg)
    }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <div 
          className={`transition-all duration-700 transform ${
            animateIn ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          <div className="flex items-center justify-center mb-8">
            <h2 className="text-3xl font-bold text-center text-[#163E43] relative">
              Add Staff Member
              <div className="h-1 w-24 bg-[#163E43] mt-2 mx-auto rounded-full"></div>
            </h2>
          </div>
          
          <div className="bg-white rounded-lg shadow-lg p-8 transition-all duration-500 hover:shadow-xl">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className={`transition-all duration-500 delay-100 transform ${
                  animateIn ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
                }`}>
                  <label className="block mb-2 font-medium text-[#163E43]">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    placeholder='John'
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full p-3 bg-gray-100 rounded border border-gray-200 focus:border-[#163E43] focus:ring-2 focus:ring-[#163E43] focus:ring-opacity-20 transition-all duration-300 outline-none"
                  />
                </div>
                
                <div className={`transition-all duration-500 delay-200 transform ${
                  animateIn ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
                }`}>
                  <label className="block mb-2 font-medium text-[#163E43]">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    placeholder='Doe'
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full p-3 bg-gray-100 rounded border border-gray-200 focus:border-[#163E43] focus:ring-2 focus:ring-[#163E43] focus:ring-opacity-20 transition-all duration-300 outline-none"
                  />
                </div>
              </div>
              
              <div className={`mb-6 transition-all duration-500 delay-300 transform ${
                animateIn ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}>
                <label className="block mb-2 font-medium text-[#163E43]">Email</label>
                <input
                  type="email"
                  placeholder='johndoe@gmail.com'
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 bg-gray-100 rounded border border-gray-200 focus:border-[#163E43] focus:ring-2 focus:ring-[#163E43] focus:ring-opacity-20 transition-all duration-300 outline-none"
                />
              </div>
              
              <div className={`mb-6 transition-all duration-500 delay-400 transform ${
                animateIn ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}>
                <label className="block mb-2 font-medium text-[#163E43]">Phone Number</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  placeholder='0112224448'
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-3 bg-gray-100 rounded border border-gray-200 focus:border-[#163E43] focus:ring-2 focus:ring-[#163E43] focus:ring-opacity-20 transition-all duration-300 outline-none"
                />
              </div>
              
              <div className={`mb-6 transition-all duration-500 delay-500 transform ${
                animateIn ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}>
                <label className="block mb-2 font-medium text-[#163E43]">Password</label>
                <input
                  type="password"
                  placeholder='*****'
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 bg-gray-100 rounded border border-gray-200 focus:border-[#163E43] focus:ring-2 focus:ring-[#163E43] focus:ring-opacity-20 transition-all duration-300 outline-none"
                />
              </div>
              
              <div className={`mb-8 transition-all duration-500 delay-600 transform ${
                animateIn ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}>
                <label className="block mb-2 font-medium text-[#163E43]">Confirm Password</label>
                <input
                  type="password"
                  placeholder='*****'
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-3 bg-gray-100 rounded border border-gray-200 focus:border-[#163E43] focus:ring-2 focus:ring-[#163E43] focus:ring-opacity-20 transition-all duration-300 outline-none"
                />
              </div>
              
              <div className={`transition-all duration-500 delay-700 transform ${
                animateIn ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}>
                <button 
                  type="submit" 
                  className="w-full bg-[#163E43] text-white py-4 rounded-lg font-medium text-lg hover:bg-opacity-90 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center group"
                >
                  <span>Add Staff</span>
                  <ChevronRight className="ml-2 transition-transform duration-300 transform group-hover:translate-x-1" size={20} />
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* Decorative elements */}
      <div className="fixed bottom-0 left-0 w-32 h-32 bg-[#163E43] opacity-10 rounded-tr-full"></div>
      <div className="fixed top-32 right-0 w-48 h-48 bg-[#163E43] opacity-5 rounded-bl-full"></div>
    </div>
  );
}