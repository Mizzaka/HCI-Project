import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, User, X, Plus, Minus, ArrowRight } from "lucide-react";

/*imported images*/
import tableImage from "../assets/table.png";
import blueChairImage from "../assets/chair.png";
import cushionChairImage from "../assets/chair_2.png";

import Navbar from "../components/Navbar";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Browne wood coffee Table",
      price: 15500,
      image: tableImage,
      quantity: 1,
    },
    {
      id: 2,
      name: "Blue cushion chair",
      price: 5500,
      image: blueChairImage,
      quantity: 1,
    },
    {
      id: 3,
      name: "Cushion chair",
      price: 6500,
      image: cushionChairImage,
      quantity: 1,
    },
  ]);

  const [animateIn, setAnimateIn] = useState(false);
  const [removingItem, setRemovingItem] = useState(null);

  useEffect(() => {
    setAnimateIn(true);
  }, []);

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax1 = 500;
  const tax2 = 200;
  const total = subtotal + tax1 + tax2;

  const increaseQuantity = (id) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQuantity = (id) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setRemovingItem(id);
    setTimeout(() => {
      setCartItems(cartItems.filter((item) => item.id !== id));
      setRemovingItem(null);
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex flex-col">
      {/* Header */}
      <Navbar />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className={`transition-all duration-700 transform ${
          animateIn ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <div className="flex items-center mb-8">
            <h2 className="text-3xl font-bold text-[#163E43]">My Cart</h2>
            <div className="h-1 w-16 bg-[#163E43] ml-4 rounded-full"></div>
          </div>

          <div className="flex flex-col md:flex-row">
            {/* Cart Items Column */}
            <div className="w-full md:w-2/3 pr-0 md:pr-6 border-r-0 md:border-r border-gray-200">
              <div className="space-y-8">
                {cartItems.map((item, index) => (
                  <div 
                    key={item.id} 
                    className={`flex items-center pb-6 transition-all duration-500 ${
                      removingItem === item.id ? 'opacity-0 transform -translate-x-10' : 'opacity-100'
                    } ${animateIn ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <div className="w-28 h-28 bg-white rounded-lg overflow-hidden border border-gray-200 flex-shrink-0 p-2 shadow-md transition-all duration-300 hover:shadow-lg">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="ml-4 flex-grow">
                      <h3 className="text-xl font-medium text-[#163E43]">{item.name}</h3>
                      <p className="text-[#163E43] text-lg font-medium mt-1">
                        Rs {item.price.toLocaleString()}
                      </p>

                      <div className="flex items-center mt-4">
                        <button
                          onClick={() => decreaseQuantity(item.id)}
                          className="text-gray-700 hover:text-[#163E43] bg-gray-100 hover:bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center transition-all duration-300"
                        >
                          <Minus size={16} />
                        </button>
                        <input
                          type="text"
                          value={item.quantity}
                          readOnly
                          className="w-12 h-8 text-center mx-2 border border-gray-300 rounded-md bg-white"
                        />
                        <button
                          onClick={() => increaseQuantity(item.id)}
                          className="text-gray-700 hover:text-[#163E43] bg-gray-100 hover:bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center transition-all duration-300"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-gray-400 hover:text-red-500 ml-4 transition-colors duration-300 bg-gray-100 hover:bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center"
                    >
                      <X size={18} />
                    </button>
                  </div>
                ))}

                {cartItems.length === 0 && (
                  <div className="text-center py-12 text-gray-500 animate-fade-in">
                    <div className="text-6xl mb-4 text-[#163E43] opacity-30">🛒</div>
                    <p className="text-xl">Your cart is empty</p>
                    <Link to="/" className="text-[#163E43] hover:underline mt-4 inline-block">
                      Continue shopping
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Order Summary Column */}
            <div className="w-full md:w-1/3 mt-8 md:mt-0 md:pl-8">
              <div 
                className={`bg-white p-6 rounded-lg shadow-md transition-all duration-500 delay-200 transform ${
                  animateIn ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                } hover:shadow-lg`}
              >
                <h3 className="text-xl font-bold text-[#163E43] mb-4">Order Summary</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Subtotal:</span>
                    <span className="font-medium">Rs.{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Tax (GST):</span>
                    <span className="font-medium">Rs.{tax1.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">Service Tax:</span>
                    <span className="font-medium">Rs.{tax2.toLocaleString()}</span>
                  </div>
                  
                  <div className="border-t border-dashed border-gray-200 my-4"></div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-[#163E43]">Total</span>
                    <span className="text-xl font-bold text-[#163E43]">Rs.{total.toLocaleString()}</span>
                  </div>

                  <Link to="/checkout" className="block w-full mt-6">
                    <button className="w-full bg-[#163E43] text-white py-4 rounded-lg font-medium text-lg transition-all duration-300 hover:bg-opacity-90 shadow-md hover:shadow-lg flex items-center justify-center group">
                      <span>Proceed to Checkout</span>
                      <ArrowRight size={18} className="ml-2 transition-transform duration-300 transform group-hover:translate-x-1" />
                    </button>
                  </Link>
                </div>
              </div>
              
              <div 
                className={`mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200 transition-all duration-500 delay-300 transform ${
                  animateIn ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
              >
                <p className="text-sm text-gray-600">
                  <strong>Styled Spaces</strong> guarantees secure checkout and 
                  free returns within 30 days. Visualize your furniture before purchase!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="fixed bottom-0 right-0 w-48 h-48 bg-[#163E43] opacity-5 rounded-tl-full"></div>
      <div className="fixed top-64 left-0 w-32 h-32 bg-[#163E43] opacity-10 rounded-br-full"></div>
    </div>
  );
};