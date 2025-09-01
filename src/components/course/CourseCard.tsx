import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Star, Clock, Users } from "lucide-react";

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  instructorId: string;
  createdAt: string;
  instructor: {
    name: string;
  };
}

interface CourseCardProps {
  course: Course;
  onEnroll: (courseId: string) => void;
}

export function CourseCard({ course, onEnroll }: CourseCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-video bg-muted">
        {course.thumbnailUrl ? (
          <img
            src={course.thumbnailUrl}
            alt={course.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-gray-100">
            No Thumbnail
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">
          {course.title}
        </h3>
        <p className="text-sm text-muted-foreground mb-2">
          by {course.instructor.name}
        </p>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {course.description}
        </p>
        <p className="text-xs text-muted-foreground mb-2">
          Created: {new Date(course.createdAt).toLocaleDateString()}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full" onClick={() => onEnroll(course.id)}>
          Enroll Now
        </Button>
      </CardFooter>
    </Card>
  );
}
