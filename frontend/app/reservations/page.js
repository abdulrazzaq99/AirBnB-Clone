export default function Reservations() {
  // Mock reservations data
  const reservations = [
    {
      id: 1,
      propertyTitle: "Luxury Downtown Apartment",
      location: "New York, NY",
      checkIn: "2024-09-15",
      checkOut: "2024-09-20",
      guests: 2,
      total: 995,
      status: "confirmed"
    },
    {
      id: 2,
      propertyTitle: "Cozy Beachfront Villa",
      location: "Miami, FL",
      checkIn: "2024-10-01",
      checkOut: "2024-10-05",
      guests: 4,
      total: 1196,
      status: "upcoming"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Reservations</h1>
        
        {reservations.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg width="64" height="64" viewBox="0 0 64 64" fill="currentColor" className="mx-auto">
                <path d="M32 8C18.745 8 8 18.745 8 32s10.745 24 24 24 24-10.745 24-24S45.255 8 32 8zm0 44c-11.028 0-20-8.972-20-20s8.972-20 20-20 20 8.972 20 20-8.972 20-20 20z"/>
                <path d="M28 24h8v16h-8zM28 44h8v4h-8z"/>
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No reservations yet</h2>
            <p className="text-gray-600 mb-6">Time to dust off your bags and start planning your next adventure</p>
            <a
              href="/"
              className="inline-block bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-lg transition-colors duration-300"
            >
              Start searching
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {reservations.map((reservation) => (
              <div key={reservation.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow duration-300">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {reservation.propertyTitle}
                    </h3>
                    <p className="text-gray-600 mb-3">{reservation.location}</p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Check-in</span>
                        <p className="font-medium">{reservation.checkIn}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Check-out</span>
                        <p className="font-medium">{reservation.checkOut}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Guests</span>
                        <p className="font-medium">{reservation.guests}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Total</span>
                        <p className="font-medium">${reservation.total}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="ml-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      reservation.status === "confirmed" 
                        ? "bg-green-100 text-green-800" 
                        : "bg-blue-100 text-blue-800"
                    }`}>
                      {reservation.status}
                    </span>
                  </div>
                </div>
                
                <div className="flex space-x-3 mt-4 pt-4 border-t">
                  <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-300">
                    View details
                  </button>
                  <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-300">
                    Contact host
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
