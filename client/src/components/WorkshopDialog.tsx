import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Workshop } from "@shared/schema";
import { MapPin, Calendar, User, Check, Bookmark, Share2 } from "lucide-react";
import { FaFacebookF, FaTwitter } from "react-icons/fa";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";

interface WorkshopDialogProps {
  workshop: Workshop | null;
  isOpen: boolean;
  onClose: () => void;
  isBookmarked?: boolean;
}

const WorkshopDialog = ({ workshop, isOpen, onClose, isBookmarked = false }: WorkshopDialogProps) => {
  const [bookmarked, setBookmarked] = useState(isBookmarked);
  const { toast } = useToast();
  
  // Default userId for demo purposes
  const userId = 1;

  if (!workshop) return null;
  
  const getCategoryName = (categoryId: number) => {
    const categories = [
      "Professional Development",
      "Creative Arts",
      "Technology", 
      "Wellness & Fitness",
      "Culinary"
    ];
    return categories[categoryId - 1] || "Unknown";
  };

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

  const toggleBookmark = async () => {
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

  const shareOnSocialMedia = (platform: string) => {
    const url = window.location.href;
    const text = `Check out this workshop: ${workshop.title}`;
    
    let shareUrl = '';
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
        break;
      default:
        // Use Web Share API if available
        if (navigator.share) {
          navigator.share({
            title: workshop.title,
            text: text,
            url: url,
          }).catch((error) => console.log('Error sharing', error));
          return;
        }
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-3xl p-0 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-5">
          {/* Left Column (Image + Basic Info) */}
          <div className="col-span-3 relative">
            <img 
              src={workshop.image_url} 
              alt={workshop.title} 
              className="w-full h-64 md:h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <span className="text-xs text-white/90 font-medium">{getCategoryName(workshop.category_id)}</span>
              <h2 className="text-xl font-bold text-white">{workshop.title}</h2>
              <div className="mt-2 flex items-center text-sm text-white/90">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{workshop.location}, {workshop.distance}</span>
              </div>
            </div>
          </div>
          
          {/* Right Column (Details) */}
          <div className="col-span-2 p-5">
            <div className="flex justify-between items-center mb-4">
              <div>
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
              <span className="font-semibold text-lg text-gray-900">
                {workshop.price === 0 ? "Free" : `$${workshop.price}`}
              </span>
            </div>
            
            <div className="mb-4">
              <div className="flex items-center mb-2">
                <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-gray-800">{workshop.date}, {workshop.time}</span>
              </div>
              <div className="flex items-center">
                <div className="flex items-center mr-2">
                  <span className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-600">
                    {workshop.available_spots}
                  </span>
                </div>
                <span className="text-xs text-gray-600">
                  {workshop.available_spots} spots left of {workshop.total_spots} total
                </span>
              </div>
            </div>
            
            <div className="space-y-4 mb-6">
              {workshop.instructor && (
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Instructor</h3>
                  <div className="mt-1 flex items-center">
                    <span className="inline-block h-8 w-8 rounded-full overflow-hidden bg-gray-100">
                      <User className="h-full w-full p-1 text-gray-400" />
                    </span>
                    <span className="ml-2 text-sm text-gray-800">{workshop.instructor}</span>
                  </div>
                </div>
              )}
              
              {workshop.requirements && (
                <div>
                  <h3 className="text-sm font-medium text-gray-900">What to bring</h3>
                  <p className="mt-1 text-sm text-gray-600">{workshop.requirements}</p>
                </div>
              )}
            </div>
            
            <div className="space-y-3">
              <Button className="w-full bg-primary text-white" disabled={workshop.available_spots === 0}>
                {workshop.available_spots === 0 ? "Join waitlist" : "Reserve a spot"}
              </Button>
              
              <div className="flex justify-between">
                <Button
                  variant="outline" 
                  className="flex items-center justify-center"
                  onClick={toggleBookmark}
                >
                  <Bookmark className={`h-4 w-4 mr-2 ${bookmarked ? "fill-primary text-primary" : ""}`} />
                  {bookmarked ? "Saved" : "Save"}
                </Button>
                
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => shareOnSocialMedia('facebook')}
                  >
                    <FaFacebookF className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => shareOnSocialMedia('twitter')}
                  >
                    <FaTwitter className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => shareOnSocialMedia('other')}
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Tabs Section */}
        <div className="border-t border-gray-200 px-4 py-5">
          <Tabs defaultValue="about">
            <TabsList className="border-b border-gray-200 w-full justify-start space-x-8 rounded-none bg-transparent h-auto pb-0">
              <TabsTrigger 
                value="about"
                className="border-primary data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none border-b-2 data-[state=inactive]:border-transparent rounded-none bg-transparent px-1 py-3"
              >
                About
              </TabsTrigger>
              <TabsTrigger 
                value="location"
                className="border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none data-[state=inactive]:border-transparent rounded-none bg-transparent px-1 py-3"
              >
                Location
              </TabsTrigger>
              <TabsTrigger 
                value="reviews"
                className="border-b-2 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none data-[state=inactive]:border-transparent rounded-none bg-transparent px-1 py-3"
              >
                Reviews (12)
              </TabsTrigger>
            </TabsList>
            <TabsContent value="about" className="pt-4">
              <h3 className="text-lg font-semibold mb-3">About this workshop</h3>
              <p className="text-gray-600 text-sm">
                {workshop.description}
              </p>
              
              {workshop.what_you_learn && workshop.what_you_learn.length > 0 && (
                <>
                  <h4 className="font-medium mt-4 mb-2">You'll learn:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {workshop.what_you_learn.map((item, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-4 w-4 text-green-500 mt-1 mr-2" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </TabsContent>
            <TabsContent value="location">
              <div className="py-4">
                <h3 className="text-lg font-semibold mb-3">Workshop Location</h3>
                <p className="text-gray-600 text-sm mb-2">
                  {workshop.location}
                </p>
                <div className="bg-gray-100 h-40 rounded-md flex items-center justify-center text-gray-500">
                  <span>Map view would be displayed here</span>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="reviews">
              <div className="py-4">
                <h3 className="text-lg font-semibold mb-3">Reviews</h3>
                <p className="text-gray-600 text-sm">
                  Reviews from attendees would be displayed here.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WorkshopDialog;
