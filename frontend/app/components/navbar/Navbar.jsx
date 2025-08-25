"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const Navbar = () => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <nav className="w-full fixed top-0 left-0 py-4 border-b bg-white z-20 shadow transition-all duration-300">
      <div className="flex items-center justify-between w-full max-w-7xl mx-auto px-4">
        <div className="flex items-center">
          <Link href="/" className="flex items-center group">
            <Image
              src="/images/Airbnb-Logo.wine.png"
              alt="Django BnB Logo"
              width={120}
              height={32}
              className="transition-transform duration-300 group-hover:scale-110"
            />
          </Link>
        </div>

        <div className="hidden md:flex items-center space-x-8">
          <Link
            href="/"
            className="relative px-2 py-1 text-gray-700 font-medium hover:text-pink-500 transition-colors duration-300
              before:absolute before:bottom-0 before:left-0 before:w-0 before:h-0.5 before:bg-pink-500 before:transition-all before:duration-300 hover:before:w-full"
          >
            Home
          </Link>
          <Link
            href="/reservations"
            className="relative px-2 py-1 text-gray-700 font-medium hover:text-pink-500 transition-colors duration-300
              before:absolute before:bottom-0 before:left-0 before:w-0 before:h-0.5 before:bg-pink-500 before:transition-all before:duration-300 hover:before:w-full"
          >
            Reservations
          </Link>
          <Link
            href="/wishlist"
            className="relative px-2 py-1 text-gray-700 font-medium hover:text-pink-500 transition-colors duration-300
              before:absolute before:bottom-0 before:left-0 before:w-0 before:h-0.5 before:bg-pink-500 before:transition-all before:duration-300 hover:before:w-full"
          >
            Wishlist
          </Link>
        </div>

        <div className="relative">
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center space-x-2 border border-gray-300 rounded-full py-2 px-4 hover:shadow-md transition-shadow duration-300"
          >
            <div className="text-gray-600">
              <svg width="14" height="8" viewBox="0 0 14 8" fill="currentColor">
                <path d="M13 1L7 7L1 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="white">
                <path d="M8 8a3 3 0 100-6 3 3 0 000 6zM8 10c-2.67 0-8 1.34-8 4v1h16v-1c0-2.66-5.33-4-8-4z"/>
              </svg>
            </div>
          </button>

          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-30">
              <Link href="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">
                Profile
              </Link>
              <Link href="/account" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">
                Account Settings
              </Link>
              <hr className="my-2" />
              <Link href="/host" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">
                Become a Host
              </Link>
              <hr className="my-2" />
              <button className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-50">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;