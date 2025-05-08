import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, User, X, Plus, Minus } from "lucide-react";

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

  const subtotal = 27500;
  const tax1 = 500;
  const tax2 = 200;
  const total = 28200;

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
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <Navbar />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row">
          {/* Cart Items Column */}
          <div className="w-full md:w-2/3 pr-0 md:pr-6 border-r-0 md:border-r border-gray-200">
            <h2 className="text-3xl font-bold mb-8">My Cart</h2>

            <div className="space-y-8">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center pb-6">
                  <div className="w-28 h-28 bg-gray-100 rounded-md overflow-hidden border border-gray-200 flex-shrink-0 p-2">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="ml-4 flex-grow">
                    <h3 className="text-xl font-medium">{item.name}</h3>
                    <p className="text-blue-700 text-lg font-medium mt-1">
                      Rs {item.price.toLocaleString()}
                    </p>

                    <div className="flex items-center mt-4">
                      <button
                        onClick={() => increaseQuantity(item.id)}
                        className="text-gray-700 hover:text-blue-800"
                      >
                        <Plus size={18} />
                      </button>
                      <input
                        type="text"
                        value={item.quantity}
                        readOnly
                        className="w-12 h-8 text-center mx-2 border border-gray-300 rounded"
                      />
                      <button
                        onClick={() => decreaseQuantity(item.id)}
                        className="text-gray-700 hover:text-blue-800"
                      >
                        <Minus size={18} />
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-gray-400 hover:text-gray-600 ml-4"
                  >
                    <X size={24} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary Column */}
          <div className="w-full md:w-1/3 mt-8 md:mt-0 md:pl-8">
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-gray-700 text-lg">Subtotal:</span>
                <span className="font-medium text-lg">Rs.{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700 text-lg">Tax:</span>
                <span className="font-medium text-lg">Rs.{tax1}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700 text-lg">Tax:</span>
                <span className="font-medium text-lg">Rs.{tax2}</span>
              </div>
              <div className="border-t border-gray-200 my-4"></div>
              <div className="flex justify-between">
                <span className="text-xl font-bold">Total</span>
                <span className="text-xl font-bold">Rs.{total}</span>
              </div>

              <Link to="/checkout" className="block w-full mt-6">
                <button className="w-full bg-[rgba(16,79,126,1)] text-white py-4 rounded font-medium text-lg">
                  Checkout
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
