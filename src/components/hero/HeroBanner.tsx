import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface HeroBannerProps {
  onAddCourse: () => void;
}

export function HeroBanner({ onAddCourse }: HeroBannerProps) {
  return (
    <section className="bg-gradient-to-r from-primary/10 to-primary/5 py-16">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-5xl font-bold mb-6 text-foreground">
          Make Your Courses Reach The World
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Share your knowledge and expertise with millions of learners worldwide. 
          Create engaging courses and build your teaching career today.
        </p>
        <Button 
          size="lg" 
          onClick={onAddCourse}
          className="text-lg px-8 py-6 h-auto"
        >
          <Plus className="mr-2 h-5 w-5" />
          Add Course
        </Button>
      </div>
    </section>
  );
}