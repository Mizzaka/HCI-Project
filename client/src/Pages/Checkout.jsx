import { useState, useEffect } from "react";
import { ChevronRight, CreditCard, Check } from "lucide-react";
import Navbar from "../components/Navbar"; // Keep the original Navbar import

export default function CheckoutPage() {
  // Original state maintained
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

  // Animation states
  const [fadeIn, setFadeIn] = useState(false);
  const [slideIn, setSlideIn] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  // Run animations after component mounts
  useEffect(() => {
    setFadeIn(true);
    setTimeout(() => setSlideIn(true), 300);
  }, []);

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

  const handlePlaceOrder = () => {
    setOrderPlaced(true);
    setTimeout(() => setOrderPlaced(false), 2000);
  };

  // Custom input field component
  const InputField = ({ label, id, name, value, onChange, type = "text", placeholder = "", className = "", half = false }) => (
    <div className={`mb-4 ${half ? "" : ""}`}>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#163E43] focus:border-transparent transition duration-300 ${className}`}
      />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Include the original Navbar component */}
      <Navbar />
      
      {/* Header with branding */}
       

      {/* Progress Steps */}
      <div className={`container mx-auto px-4 py-6 transition-opacity duration-500 ${fadeIn ? 'opacity-100' : 'opacity-0'}`}>
        <div className="flex justify-center items-center space-x-4 mb-8">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-[#163E43] text-white flex items-center justify-center">1</div>
            <span className="ml-2 text-sm font-medium">Cart</span>
          </div>
          <ChevronRight className="text-gray-400" size={16} />
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-[#163E43] text-white flex items-center justify-center">2</div>
            <span className="ml-2 text-sm font-medium">Checkout</span>
          </div>
          <ChevronRight className="text-gray-400" size={16} />
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center">3</div>
            <span className="ml-2 text-sm font-medium text-gray-500">Confirmation</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-16">
        <div className={`bg-white rounded-lg shadow-lg p-6 md:p-8 transition-all duration-700 transform ${slideIn ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="flex flex-col md:flex-row">
            {/* Billing Details Column */}
            <div className="w-full md:w-1/2 pr-0 md:pr-8 border-r-0 md:border-r border-gray-200">
              <h2 className="text-3xl font-bold mb-6 text-[#163E43]">Billing details</h2>

              <div className="grid grid-cols-2 gap-4">
                <InputField
                  label="First Name"
                  id="firstName"
                  name="firstName"
                  value={billingDetails.firstName}
                  onChange={handleBillingChange}
                  half={true}
                />
                <InputField
                  label="Last Name"
                  id="lastName"
                  name="lastName"
                  value={billingDetails.lastName}
                  onChange={handleBillingChange}
                  half={true}
                />
              </div>

              <InputField
                label="Email"
                id="email"
                name="email"
                type="email"
                value={billingDetails.email}
                onChange={handleBillingChange}
              />

              <InputField
                label="Phone Number"
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                value={billingDetails.phoneNumber}
                onChange={handleBillingChange}
              />

              <InputField
                label="Address"
                id="address"
                name="address"
                value={billingDetails.address}
                onChange={handleBillingChange}
              />

              <div className="grid grid-cols-2 gap-4">
                <InputField
                  label="District"
                  id="district"
                  name="district"
                  value={billingDetails.district}
                  onChange={handleBillingChange}
                  half={true}
                />
                <InputField
                  label="Province"
                  id="province"
                  name="province"
                  value={billingDetails.province}
                  onChange={handleBillingChange}
                  half={true}
                />
              </div>

              <InputField
                label="Zip code"
                id="zipCode"
                name="zipCode"
                value={billingDetails.zipCode}
                onChange={handleBillingChange}
                className="max-w-xs"
              />
            </div>

            {/* Payment Method Column */}
            <div className="w-full md:w-1/2 pl-0 md:pl-8 mt-8 md:mt-0">
              <h2 className="text-3xl font-bold mb-6 text-[#163E43]">Payment method</h2>

              <div className="mb-6">
                <div className="flex items-center justify-between p-4 border border-gray-300 rounded-md hover:border-[#163E43] transition-colors duration-300 bg-white shadow-sm">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name="radio-group"
                      className="h-5 w-5 text-[#163E43] focus:ring-[#163E43] border-gray-300 rounded-full"
                      checked
                    />
                    <label className="ml-3 font-medium">Credit Card / Debit Card</label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-10 h-6 bg-blue-600 rounded"></div>
                    <div className="w-10 h-6 bg-yellow-500 rounded"></div>
                    <div className="w-10 h-6 bg-red-500 rounded"></div>
                    <div className="w-10 h-6 bg-gray-800 rounded"></div>
                  </div>
                </div>
              </div>

              <div className="p-6 border border-gray-200 rounded-md bg-gray-50 mb-6">
                <div className="flex items-center mb-4">
                  <CreditCard className="text-[#163E43] mr-2" size={20} />
                  <h3 className="text-lg font-medium">Card Information</h3>
                </div>

                <InputField
                  label="Card Number"
                  id="cardNumber"
                  name="cardNumber"
                  value={paymentMethod.cardNumber}
                  onChange={handlePaymentChange}
                />

                <div className="grid grid-cols-2 gap-4">
                  <InputField
                    label="Expiration Date"
                    id="expirationDate"
                    name="expirationDate"
                    value={paymentMethod.expirationDate}
                    onChange={handlePaymentChange}
                    placeholder="MM/YY"
                    half={true}
                  />
                  <InputField
                    label="Security Code"
                    id="securityCode"
                    name="securityCode"
                    value={paymentMethod.securityCode}
                    onChange={handlePaymentChange}
                    placeholder="CVC"
                    half={true}
                  />
                </div>
              </div>

              <div className="mb-6">
                <div className="p-4 bg-gray-50 rounded-md">
                  <h3 className="font-medium mb-2">Order Summary</h3>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span>Subtotal</span>
                    <span>$1,299.00</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span>Shipping</span>
                    <span>$49.99</span>
                  </div>
                  <div className="flex justify-between py-2 font-bold">
                    <span>Total</span>
                    <span>$1,348.99</span>
                  </div>
                </div>
              </div>

              <div className="text-center mb-4">
                <p className="text-sm text-gray-600">
                  By clicking this button, you agree to the{" "}
                  <a href="#" className="text-[#163E43] hover:underline transition duration-300">
                    terms and conditions
                  </a>
                </p>
              </div>

              <button 
                onClick={handlePlaceOrder}
                className={`w-full bg-[#163E43] text-white py-3 rounded-md font-medium hover:bg-opacity-90 transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center ${orderPlaced ? 'bg-green-600' : ''}`}
              >
                {orderPlaced ? (
                  <>
                    <Check className="mr-2" size={20} />
                    Order Placed!
                  </>
                ) : (
                  'Place order'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};