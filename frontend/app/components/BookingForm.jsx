"use client";

import { useState } from "react";

const BookingForm = ({ property, onBook }) => {
  const [bookingData, setBookingData] = useState({
    checkIn: "",
    checkOut: "",
    guests: 1,
  });

  const handleInputChange = (field, value) => {
    setBookingData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateNights = () => {
    if (bookingData.checkIn && bookingData.checkOut) {
      const checkIn = new Date(bookingData.checkIn);
      const checkOut = new Date(bookingData.checkOut);
      const diffTime = Math.abs(checkOut - checkIn);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    }
    return 0;
  };

  const calculateTotal = () => {
    const nights = calculateNights();
    return nights * property.price;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!bookingData.checkIn || !bookingData.checkOut) {
      alert("Please select check-in and check-out dates");
      return;
    }
    
    const booking = {
      ...bookingData,
      propertyId: property.id,
      propertyTitle: property.title,
      nights: calculateNights(),
      total: calculateTotal(),
    };
    
    onBook(booking);
  };

  const nights = calculateNights();
  const total = calculateTotal();

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-lg sticky top-24">
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-2xl font-semibold">${property.price}</span>
          <span className="text-gray-600"> night</span>
        </div>
        <div className="flex items-center space-x-1">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="text-pink-500">
            <path d="M8 12.5L3.5 15l1.2-5.1L0 5.5l5.2-.4L8 0l2.8 5.1 5.2.4-4.7 4.4L12.5 15 8 12.5z"/>
          </svg>
          <span className="font-semibold">{property.rating}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Check-in
            </label>
            <input
              type="date"
              value={bookingData.checkIn}
              onChange={(e) => handleInputChange("checkIn", e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Check-out
            </label>
            <input
              type="date"
              value={bookingData.checkOut}
              onChange={(e) => handleInputChange("checkOut", e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Guests
          </label>
          <select
            value={bookingData.guests}
            onChange={(e) => handleInputChange("guests", parseInt(e.target.value))}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          >
            {Array.from({ length: property.guests }, (_, i) => i + 1).map(num => (
              <option key={num} value={num}>
                {num} guest{num > 1 ? "s" : ""}
              </option>
            ))}
          </select>
        </div>

        {nights > 0 && (
          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>${property.price} x {nights} nights</span>
              <span>${property.price * nights}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Service fee</span>
              <span>$0</span>
            </div>
            <div className="border-t pt-2 flex justify-between font-semibold">
              <span>Total</span>
              <span>${total}</span>
            </div>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-300"
        >
          Reserve
        </button>
      </form>

      <p className="text-center text-sm text-gray-600 mt-4">
        You won't be charged yet
      </p>
    </div>
  );
};

export default BookingForm;
