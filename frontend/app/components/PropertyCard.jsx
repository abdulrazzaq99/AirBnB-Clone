import Link from "next/link";
import Image from "next/image";

const PropertyCard = ({ property }) => {
  // Handle Django API image structure - use first image from images array
  const getImageSrc = () => {
    if (property.images && property.images.length > 0) {
      // If it's a full URL from Django backend
      if (property.images[0].image && property.images[0].image.startsWith('http')) {
        return property.images[0].image;
      }
      // If it's a relative path, prepend the backend URL
      if (property.images[0].image) {
        return `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:8000'}${property.images[0].image}`;
      }
    }
    // Use a placeholder image for now
    return "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&h=600&fit=crop";
  };

  const imageSrc = getImageSrc();

  return (
    <Link href={`/property/${property.id}`} className="group">
      <div className="bg-white rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="relative h-64 overflow-hidden">
          <Image
            src={imageSrc}
            alt={property.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            unoptimized={imageSrc.startsWith('http') && !imageSrc.includes('localhost')}
          />
          <button className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white transition-colors duration-300">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M8.612 2.347a.75.75 0 0 0-1.224 0L6.75 3.38l-.638-.033a.75.75 0 0 0-.796.796l.033.638-.033.638a.75.75 0 0 0 .796.796l.638-.033.638 1.033a.75.75 0 0 0 1.224 0l.638-1.033.638.033a.75.75 0 0 0 .796-.796l-.033-.638.033-.638a.75.75 0 0 0-.796-.796l-.638.033L8.612 2.347z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
        
        <div className="p-4">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-semibold text-gray-900 truncate">{property.title}</h3>
            <div className="flex items-center space-x-1">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" className="text-pink-500">
                <path d="M6 9.5L2.5 11l.9-3.8L.8 4.5l3.9-.3L6 0l1.3 4.2 3.9.3-2.6 2.7L9.5 11 6 9.5z"/>
              </svg>
              <span className="text-sm text-gray-600">{property.average_rating || property.rating || '5.0'}</span>
            </div>
          </div>
          
          <p className="text-gray-600 text-sm mb-2">{property.location}</p>
          
          <div className="flex items-center justify-between">
            <div className="text-gray-600 text-sm">
              {property.guests} guests • {property.bedrooms} bedrooms
            </div>
            <div className="text-right">
              <span className="font-semibold text-gray-900">${property.price_per_night}</span>
              <span className="text-gray-600 text-sm"> night</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;