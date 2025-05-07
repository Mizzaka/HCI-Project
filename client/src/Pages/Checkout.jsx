import { useState } from "react";
import Navbar from "../components/Navbar";

import cards from "../assets/cards.png";

export default function CheckoutPage() {
  const [billingDetails, setBillingDetails] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "johndoe@gmail.com",
    phoneNumber: "0112224448",
    address: "45, 1st lane, pitipana",
    district: "Homagama",
    province: "Western",
    zipCode: "10300",
  });

  const [paymentMethod, setPaymentMethod] = useState({
    cardNumber: "4567 8912 3569",
    expirationDate: "",
    securityCode: "",
  });

  const handleBillingChange = (e) => {
    setBillingDetails({
      ...billingDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handlePaymentChange = (e) => {
    setPaymentMethod({
      ...paymentMethod,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Include the Navbar component */}
      <Navbar />

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row">
          {/* Billing Details Column */}
          <div className="w-full md:w-1/2 pr-0 md:pr-8 border-r-0 md:border-r border-gray-200">
            <h2 className="text-3xl font-bold mb-6">Billing details</h2>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={billingDetails.firstName}
                  onChange={handleBillingChange}
                  className="w-full p-2 bg-gray-300 rounded"
                />
              </div>
              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={billingDetails.lastName}
                  onChange={handleBillingChange}
                  className="w-full p-2 bg-gray-300 rounded"
                />
              </div>
            </div>

            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={billingDetails.email}
                onChange={handleBillingChange}
                className="w-full p-2 bg-gray-300 rounded"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Phone Number
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={billingDetails.phoneNumber}
                onChange={handleBillingChange}
                className="w-full p-2 bg-gray-300 rounded"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={billingDetails.address}
                onChange={handleBillingChange}
                className="w-full p-2 bg-gray-300 rounded"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label
                  htmlFor="district"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  District
                </label>
                <input
                  type="text"
                  id="district"
                  name="district"
                  value={billingDetails.district}
                  onChange={handleBillingChange}
                  className="w-full p-2 bg-gray-300 rounded"
                />
              </div>
              <div>
                <label
                  htmlFor="province"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Province
                </label>
                <input
                  type="text"
                  id="province"
                  name="province"
                  value={billingDetails.province}
                  onChange={handleBillingChange}
                  className="w-full p-2 bg-gray-300 rounded"
                />
              </div>
            </div>

            <div className="mb-4">
              <label
                htmlFor="zipCode"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Zip code
              </label>
              <input
                type="text"
                id="zipCode"
                name="zipCode"
                value={billingDetails.zipCode}
                onChange={handleBillingChange}
                className="w-full p-2 bg-gray-300 rounded max-w-xs"
              />
            </div>
          </div>

          {/* Payment Method Column */}
          <div className="w-full md:w-1/2 pl-0 md:pl-8 mt-8 md:mt-0">
            <h2 className="text-3xl font-bold mb-6">Payment method</h2>

            <div className="mb-6">
              <div className="flex items-center justify-between p-4 border border-gray-300 rounded">
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="radio-group"
                    className="h-6 w-6 text-blue-600 focus:ring-blue-500 border-gray-300 rounded-full"
                  />
                  <label className="ml-3">Credit Card / Debit Card</label>
                </div>
                <div className="flex items-center">
                  <img
                    src={cards} // Replace with the actual path to your image
                    alt="Payment methods"
                    className="h-12 sm:h-16"
                  />
                </div>
              </div>
            </div>

            <div className="mb-6">
              <label
                htmlFor="cardNumber"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Card Number
              </label>
              <input
                type="text"
                id="cardNumber"
                name="cardNumber"
                value={paymentMethod.cardNumber}
                onChange={handlePaymentChange}
                className="w-full p-2 bg-gray-300 rounded"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label
                  htmlFor="expirationDate"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Expatriation Date
                </label>
                <input
                  type="text"
                  id="expirationDate"
                  name="expirationDate"
                  value={paymentMethod.expirationDate}
                  onChange={handlePaymentChange}
                  className="w-full p-2 bg-gray-300 rounded"
                  placeholder="MM/YY"
                />
              </div>
              <div>
                <label
                  htmlFor="securityCode"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Security Code
                </label>
                <input
                  type="text"
                  id="securityCode"
                  name="securityCode"
                  value={paymentMethod.securityCode}
                  onChange={handlePaymentChange}
                  className="w-full p-2 bg-gray-300 rounded"
                  placeholder="CVC"
                />
              </div>
            </div>

            <div className="text-center mb-4">
              <p className="text-sm text-gray-600">
                By clicking this button, you agree to the{" "}
                <a href="#" className="text-blue-800 underline">
                  terms and conditions
                </a>
              </p>
            </div>

            <button className="w-full bg-[rgba(16,79,126,1)] text-white py-3 rounded font-medium">
              Place order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
