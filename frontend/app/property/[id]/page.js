"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import BookingForm from "../../components/BookingForm";
import BookingModal from "../../components/BookingModal";
import properties from "../../../data/properties.json";

export default function PropertyDetail() {
  const params = useParams();
  const propertyId = parseInt(params.id);
  const property = properties.find(p => p.id === propertyId);
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [currentBooking, setCurrentBooking] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Property not found</h1>
        </div>
      </div>
    );
  }

  const handleBooking = (bookingData) => {
    setCurrentBooking(bookingData);
    setShowBookingModal(true);
  };

  const handleConfirmBooking = () => {
    setShowBookingModal(false);
    setShowSuccessMessage(true);
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50">      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Property Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>
        <p className="text-gray-600 mb-6">{property.location}</p>

        {/* Images Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="lg:col-span-2 lg:row-span-2">
            <div className="relative h-64 md:h-96 rounded-lg overflow-hidden">
              <Image
                src={property.images[currentImageIndex] || "/images/placeholder.jpg"}
                alt={property.title}
                fill
                className="object-cover"
              />
            </div>
          </div>
          {property.images.slice(1, 5).map((image, index) => (
            <div key={index} className="relative h-32 md:h-44 rounded-lg overflow-hidden cursor-pointer">
              <Image
                src={image || "/images/placeholder.jpg"}
                alt={`${property.title} ${index + 2}`}
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
                onClick={() => setCurrentImageIndex(index + 1)}
              />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Property Details */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Hosted by {property.host}
              </h2>
              <p className="text-gray-600">
                {property.guests} guests • {property.bedrooms} bedrooms • {property.bathrooms} bathrooms
              </p>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">About this place</h3>
              <p className="text-gray-600 leading-relaxed">{property.description}</p>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">What this place offers</h3>
              <div className="grid grid-cols-2 gap-4">
                {property.amenities.map((amenity, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" className="text-gray-600">
                      <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                    </svg>
                    <span className="text-gray-700">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div>
            <BookingForm property={property} onBook={handleBooking} />
          </div>
        </div>
      </div>

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed top-20 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
          <div className="flex items-center space-x-2">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
            </svg>
            <span>Booking confirmed successfully!</span>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      <BookingModal
        booking={currentBooking}
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        onConfirm={handleConfirmBooking}
      />
    </div>
  );
}
