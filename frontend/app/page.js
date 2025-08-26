"use client";

import { useState, useEffect } from "react";
import SearchBar from "./components/SearchBar";
import PropertyCard from "./components/PropertyCard";
import { apiService } from "../lib/api";

export default function Home() {
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch properties on component mount
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        const response = await apiService.getProperties();
        setProperties(response.results || response);
        setFilteredProperties(response.results || response);
      } catch (err) {
        console.error('Error fetching properties:', err);
        setError('Failed to load properties. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const handleSearch = async (searchData) => {
    try {
      setLoading(true);
      
      // Build filter parameters for API
      const filters = {};
      
      if (searchData.destination) {
        filters.search = searchData.destination; // Backend search field
      }
      
      if (searchData.guests) {
        filters.guests = searchData.guests;
      }
      
      if (searchData.checkin) {
        filters.checkin = searchData.checkin;
      }
      
      if (searchData.checkout) {
        filters.checkout = searchData.checkout;
      }

      const response = await apiService.getProperties(filters);
      setFilteredProperties(response.results || response);
    } catch (err) {
      console.error('Error searching properties:', err);
      setError('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
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
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
          </div>
        ) : (
          <>
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

            {filteredProperties.length === 0 && !loading && (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">No properties found matching your criteria.</p>
                <button
                  onClick={() => {
                    setFilteredProperties(properties);
                    setError(null);
                  }}
                  className="mt-4 text-pink-500 hover:text-pink-600 font-medium"
                >
                  Show all properties
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
