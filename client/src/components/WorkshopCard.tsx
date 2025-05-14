import { Link } from "wouter";
import { Bookmark, MapPin, Calendar, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Workshop } from "@shared/schema";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";

interface WorkshopCardProps {
  workshop: Workshop;
  isBookmarked?: boolean;
}

const WorkshopCard = ({ workshop, isBookmarked = false }: WorkshopCardProps) => {
  const [bookmarked, setBookmarked] = useState(isBookmarked);
  const { toast } = useToast();
  
  // Default userId for demo purposes
  const userId = 1;

  const toggleBookmark = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      if (bookmarked) {
        await apiRequest('DELETE', `/api/bookmarks/${userId}/${workshop.id}`);
        setBookmarked(false);
        toast({
          title: "Workshop removed from bookmarks",
          description: `${workshop.title} has been removed from your bookmarks.`,
        });
      } else {
        await apiRequest('POST', '/api/bookmarks', { user_id: userId, workshop_id: workshop.id });
        setBookmarked(true);
        toast({
          title: "Workshop bookmarked",
          description: `${workshop.title} has been added to your bookmarks.`,
        });
      }
      
      // Invalidate bookmarks query to refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/bookmarks/user'] });
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error updating your bookmarks.",
        variant: "destructive",
      });
    }
  };

  // Determine availability status and styling
  const getAvailabilityBadge = () => {
    if (workshop.available_spots === 0) {
      return {
        text: "Sold Out",
        bgColor: "bg-red-100",
        textColor: "text-red-800",
        dotColor: "bg-red-500",
        animate: false
      };
    } else if (workshop.available_spots <= 3) {
      return {
        text: "Few Spots Left",
        bgColor: "bg-yellow-100",
        textColor: "text-yellow-800",
        dotColor: "bg-yellow-500",
        animate: false
      };
    } else {
      return {
        text: "Spots Available",
        bgColor: "bg-green-100",
        textColor: "text-green-800",
        dotColor: "bg-green-500",
        animate: true
      };
    }
  };

  const availabilityBadge = getAvailabilityBadge();

  return (
    <Card className="overflow-hidden shadow-sm hover:shadow-md transition">
      <div className="relative">
        <img 
          src={workshop.image_url} 
          alt={workshop.title} 
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-0 right-0 m-3">
          <button 
            className="p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white transition"
            onClick={toggleBookmark}
          >
            <Bookmark 
              className={`h-4 w-4 ${bookmarked ? "fill-primary text-primary" : "text-gray-600"}`} 
            />
          </button>
        </div>
        <div className="absolute bottom-0 left-0 m-3">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${availabilityBadge.bgColor} ${availabilityBadge.textColor}`}>
            <span className="relative flex w-2 h-2 mr-1">
              {availabilityBadge.animate && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              )}
              <span className={`relative inline-flex rounded-full h-2 w-2 ${availabilityBadge.dotColor}`}></span>
            </span>
            {availabilityBadge.text}
          </span>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <span className="text-xs text-primary font-medium">
              {workshop.category_id === 1 && "Professional Development"}
              {workshop.category_id === 2 && "Creative Arts"}
              {workshop.category_id === 3 && "Technology"}
              {workshop.category_id === 4 && "Wellness & Fitness"}
              {workshop.category_id === 5 && "Culinary"}
            </span>
            <h3 className="text-lg font-semibold text-gray-900 mt-1">{workshop.title}</h3>
          </div>
          <span className="font-semibold text-gray-900">
            {workshop.price === 0 ? "Free" : `$${workshop.price}`}
          </span>
        </div>
        
        <div className="mt-3 flex items-center text-sm text-gray-600">
          <MapPin className="h-4 w-4 text-gray-400 mr-1" />
          <span>{workshop.location}, {workshop.distance}</span>
        </div>
        
        <div className="mt-2 flex items-center text-sm text-gray-600">
          <Calendar className="h-4 w-4 text-gray-400 mr-1" />
          <span>{workshop.date}, {workshop.time}</span>
        </div>
        
        <div className="flex items-center mt-4">
          <div className="flex -space-x-1 mr-2">
            <span className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-600">
              {workshop.available_spots}
            </span>
          </div>
          <span className="text-xs text-gray-500">
            {workshop.available_spots === 0 
              ? "Join waitlist" 
              : `${workshop.available_spots} spot${workshop.available_spots !== 1 ? 's' : ''} left`
            }
          </span>
          
          <div className="ml-auto">
            <Link href={`/workshop/${workshop.id}`} className="flex items-center text-primary text-sm font-medium">
              <span>Details</span>
              <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkshopCard;
