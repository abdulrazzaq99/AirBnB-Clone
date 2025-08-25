import PropertyCard from "../components/PropertyCard";

export default function Wishlist() {
  // Mock wishlist data - in a real app, this would come from user's saved properties
  const wishlistProperties = [
    {
      id: 1,
      title: "Luxury Downtown Apartment",
      location: "New York, NY",
      price: 199,
      rating: 4.8,
      images: ["/images/property1-1.jpg"],
      guests: 4,
      bedrooms: 2
    },
    {
      id: 3,
      title: "Mountain Cabin Retreat",
      location: "Aspen, CO",
      price: 249,
      rating: 4.7,
      images: ["/images/property3-1.jpg"],
      guests: 8,
      bedrooms: 4
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Wishlist</h1>
        
        {wishlistProperties.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg width="64" height="64" viewBox="0 0 64 64" fill="currentColor" className="mx-auto">
                <path d="M32 12.5l-4.25-8.5c-2.5-5-8.75-5-11.25 0-2.5 5-8.75 5-11.25 0l4.25 8.5c2.5 5 8.75 5 11.25 0 2.5-5 8.75-5 11.25 0zm0 0l4.25-8.5c2.5-5 8.75-5 11.25 0 2.5 5 8.75 5 11.25 0l-4.25 8.5c-2.5 5-8.75 5-11.25 0-2.5-5-8.75-5-11.25 0z"/>
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Create your first wishlist</h2>
            <p className="text-gray-600 mb-6">As you search, tap the heart icon to save your favorite places to stay or Experiences to a wishlist.</p>
            <a
              href="/"
              className="inline-block bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-lg transition-colors duration-300"
            >
              Start exploring
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
