import { useState } from 'react';
import { ShoppingCart, User } from 'lucide-react';

import toast from 'react-hot-toast';
import { axiosInstance } from '../lib/axios';

export default function AddStaffPage() {
  // const [formData, setFormData] = useState({
  //   firstName: 'John',
  //   lastName: 'Doe',
  //   email: 'johndoe@gmail.com',
  //   phoneNumber: '0112224448',
  //   password: '********',
  //   confirmPassword: '********'
  // });

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData(prevState => ({
  //     ...prevState,
  //     [name]: value
  //   }));
  // };
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

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
    <div className="min-h-screen bg-white">
      {/* Header */}
      {/* <header className="border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-bold text-[#104F7E]">Furniture plus</h1>
          
          <div className="flex items-center space-x-6">
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-800 hover:text-[#104F7E]">Add Staff</a>
              <a href="#" className="text-gray-800 hover:text-[#104F7E]">Templates</a>
            </nav>
            
            <div className="flex items-center space-x-4">
              <a href="#" className="text-gray-800">
                <ShoppingCart size={24} />
              </a>
              <a href="#" className="bg-blue-300 rounded-full p-2">
                <User size={24} className="text-white" />
              </a>
            </div>
          </div>
        </div>
      </header> */}
      <Navbar />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <h2 className="text-3xl font-bold text-center mb-8">Add staff member</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block mb-2 font-medium">First Name</label>
              <input
                type="text"
                name="firstName"
                placeholder='John'
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full p-3 bg-gray-300 rounded"
              />
            </div>
            
            <div>
              <label className="block mb-2 font-medium">Last Name</label>
              <input
                type="text"
                name="lastName"
                placeholder='Doe'
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full p-3 bg-gray-300 rounded"
              />
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block mb-2 font-medium">Email</label>
            <input
              type="email"
              placeholder='johndoe@gmail.com'
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-gray-300 rounded"
            />
          </div>
          
          <div className="mb-6">
            <label className="block mb-2 font-medium">Phone Number</label>
            <input
              type="tel"
              name="phoneNumber"
              placeholder='0112224448'
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-3 bg-gray-300 rounded"
            />
          </div>
          
          <div className="mb-6">
            <label className="block mb-2 font-medium">Password</label>
            <input
              type="password"
              placeholder='*****'
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-gray-300 rounded"
            />
          </div>
          
          <div className="mb-8">
            <label className="block mb-2 font-medium">Confirm Password</label>
            <input
              type="password"
              placeholder='*****'
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-3 bg-gray-300 rounded"
            />
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-[#104F7E] text-white py-4 rounded font-medium text-lg hover:bg-[#0d4269] transition-colors"
          >
            Add staff
          </button>
        </form>
      </main>
    </div>
  );
}