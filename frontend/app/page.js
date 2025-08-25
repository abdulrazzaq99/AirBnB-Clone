"use client";

import { useState } from "react";
import SearchBar from "./components/SearchBar";
import PropertyCard from "./components/PropertyCard";
import properties from "../data/properties.json";

export default function Home() {
  const [filteredProperties, setFilteredProperties] = useState(properties);

  const handleSearch = (searchData) => {
    // Simple filtering logic - in a real app, this would be more sophisticated
    let filtered = properties;

    if (searchData.destination) {
      filtered = filtered.filter(property =>
        property.location.toLowerCase().includes(searchData.destination.toLowerCase()) ||
        property.title.toLowerCase().includes(searchData.destination.toLowerCase())
      );
    }

    if (searchData.guests) {
      filtered = filtered.filter(property => property.guests >= searchData.guests);
    }

    setFilteredProperties(filtered);
  };

  return (
    <div className="min-h-screen bg-gray-50">      
      {/* Hero Section */}
      <div className="pb-8 px-4">
        <div className="max-w-4xl mx-auto text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Find your next adventure
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Discover amazing places to stay around the world
          </p>
          <SearchBar onSearch={handleSearch} />
        </div>
      </div>

      {/* Properties Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">
            {filteredProperties.length} stays found
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProperties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>

        {filteredProperties.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No properties found matching your criteria.</p>
            <button
              onClick={() => setFilteredProperties(properties)}
              className="mt-4 text-pink-500 hover:text-pink-600 font-medium"
            >
              Show all properties
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
