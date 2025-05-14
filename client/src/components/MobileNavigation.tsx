import { Link, useLocation } from "wouter";
import { Search, Bookmark, Calendar, User } from "lucide-react";

const MobileNavigation = () => {
  const [location] = useLocation();

  return (
    <div className="fixed bottom-0 inset-x-0 bg-white border-t border-gray-200 md:hidden z-40">
      <div className="flex justify-around">
        <Link href="/" className={`flex flex-col items-center py-3 px-4 ${location === "/" ? "text-primary" : "text-gray-500"}`}>
          <Search className="w-5 h-5" />
          <span className="text-xs mt-1">Discover</span>
        </Link>
        <Link href="/bookmarks" className={`flex flex-col items-center py-3 px-4 ${location === "/bookmarks" ? "text-primary" : "text-gray-500"}`}>
          <Bookmark className="w-5 h-5" />
          <span className="text-xs mt-1">Saved</span>
        </Link>
        <a href="#" className="flex flex-col items-center py-3 px-4 text-gray-500">
          <Calendar className="w-5 h-5" />
          <span className="text-xs mt-1">Calendar</span>
        </a>
        <a href="#" className="flex flex-col items-center py-3 px-4 text-gray-500">
          <User className="w-5 h-5" />
          <span className="text-xs mt-1">Profile</span>
        </a>
      </div>
    </div>
  );
};

export default MobileNavigation;
