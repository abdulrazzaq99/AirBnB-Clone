"use client";

import { useState } from "react";

const SearchBar = ({ onSearch }) => {
  const [searchData, setSearchData] = useState({
    destination: "",
    checkIn: "",
    checkOut: "",
    guests: 1,
  });

  const handleInputChange = (field, value) => {
    setSearchData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchData);
  };

  return (
    <div className="bg-white rounded-full shadow-lg border border-gray-200 flex flex-col md:flex-row items-center divide-y md:divide-y-0 md:divide-x divide-gray-200 max-w-4xl mx-auto">
      <div className="flex-1 px-6 py-4">
        <label className="block text-xs font-semibold text-gray-700 mb-1">Where</label>
        <input
          type="text"
          placeholder="Search destinations"
          value={searchData.destination}
          onChange={(e) => handleInputChange("destination", e.target.value)}
          className="w-full text-gray-700 placeholder-gray-400 bg-transparent border-none outline-none"
        />
      </div>

      <div className="flex-1 px-6 py-4">
        <label className="block text-xs font-semibold text-gray-700 mb-1">Check in</label>
        <input
          type="date"
          value={searchData.checkIn}
          onChange={(e) => handleInputChange("checkIn", e.target.value)}
          className="w-full text-gray-700 bg-transparent border-none outline-none"
        />
      </div>

      <div className="flex-1 px-6 py-4">
        <label className="block text-xs font-semibold text-gray-700 mb-1">Check out</label>
        <input
          type="date"
          value={searchData.checkOut}
          onChange={(e) => handleInputChange("checkOut", e.target.value)}
          className="w-full text-gray-700 bg-transparent border-none outline-none"
        />
      </div>

      <div className="flex-1 px-6 py-4">
        <label className="block text-xs font-semibold text-gray-700 mb-1">Who</label>
        <select
          value={searchData.guests}
          onChange={(e) => handleInputChange("guests", parseInt(e.target.value))}
          className="w-full text-gray-700 bg-transparent border-none outline-none"
        >
          {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
            <option key={num} value={num}>
              {num} guest{num > 1 ? "s" : ""}
            </option>
          ))}
        </select>
      </div>

      <div className="px-4 py-4">
        <button
          onClick={handleSearch}
          className="bg-pink-500 hover:bg-pink-600 text-white rounded-full p-4 transition-colors duration-300"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
