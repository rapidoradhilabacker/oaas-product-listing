import { useState } from "react";
import { Link, useLocation } from "wouter";
import { MapPin, ChevronDown, User } from "lucide-react";

const Header = () => {
  const [location] = useLocation();
  const [userLocation, setUserLocation] = useState("San Francisco, CA");

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary text-2xl mr-2">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
              </svg>
              <span className="font-bold text-xl text-primary">WorkshopHub</span>
            </Link>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:ml-8 md:flex md:space-x-8">
              <Link href="/" className={`inline-flex items-center px-1 pt-1 border-b-2 ${location === "/" ? "border-primary text-gray-900" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"} text-sm font-medium`}>
                Discover
              </Link>
              <Link href="/bookmarks" className={`inline-flex items-center px-1 pt-1 border-b-2 ${location === "/bookmarks" ? "border-primary text-gray-900" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"} text-sm font-medium`}>
                My Bookmarks
              </Link>
              <a href="#" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
                Calendar
              </a>
            </nav>
          </div>
          
          {/* Search & User Menu */}
          <div className="flex items-center">
            <div className="hidden sm:flex sm:items-center sm:ml-6">
              <div className="relative">
                <div className="flex items-center pr-4">
                  <div className="flex bg-gray-100 p-2 rounded-full items-center">
                    <MapPin className="h-4 w-4 text-gray-500 mr-2" />
                    <span className="text-sm text-gray-600">{userLocation}</span>
                    <ChevronDown className="h-3 w-3 text-gray-400 ml-2" />
                  </div>
                </div>
              </div>
            </div>
            <div className="ml-3 relative">
              <button className="flex text-sm rounded-full focus:outline-none">
                <span className="inline-block h-8 w-8 rounded-full overflow-hidden bg-gray-200 border border-gray-300">
                  <User className="h-full w-full p-1 text-gray-400" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
