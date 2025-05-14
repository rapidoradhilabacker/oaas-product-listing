import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const Hero = () => {
  return (
    <section className="relative">
      <div className="h-80 w-full overflow-hidden relative">
        <img
          src="https://images.unsplash.com/photo-1600508774634-4e11d34730e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=600"
          alt="Remote workers in a modern coworking space"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/80 to-[#14B8A6]/60"></div>
        <div className="absolute inset-0 flex items-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl text-white">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">Find Local Classes & Workshops Near You</h1>
            <p className="text-lg sm:text-xl mb-6">Discover new skills, meet like-minded people, and break up your remote work routine</p>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="secondary"
                size="lg"
                className="rounded-full font-semibold"
                asChild
              >
                <Link href="/">Browse All Categories</Link>
              </Button>
              <Button
                variant="default"
                size="lg"
                className="rounded-full font-semibold bg-[#F97316] hover:bg-[#F97316]/90"
                asChild
              >
                <Link href="/?date=today">Classes Today</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
