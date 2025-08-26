import { useParams } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Play, FileText, HelpCircle, CheckCircle } from "lucide-react";

interface Section {
  id: string;
  title: string;
  lectures: Lecture[];
  isOpen: boolean;
}

interface Lecture {
  id: string;
  title: string;
  type: 'video' | 'text' | 'quiz';
  duration?: string;
  completed: boolean;
}

const mockSections: Section[] = [
  {
    id: "1",
    title: "Introduction",
    isOpen: true,
    lectures: [
      { id: "1-1", title: "Course Introduction", type: "video", duration: "5:30", completed: true },
      { id: "1-2", title: "What You'll Learn", type: "text", completed: false },
    ]
  },
  {
    id: "2", 
    title: "Getting Started",
    isOpen: false,
    lectures: [
      { id: "2-1", title: "Setting Up Your Environment", type: "video", duration: "12:45", completed: false },
      { id: "2-2", title: "First Steps", type: "video", duration: "8:20", completed: false },
      { id: "2-3", title: "Knowledge Check", type: "quiz", completed: false },
    ]
  }
];

export default function CoursePage() {
  const { courseId } = useParams();
  const [sections, setSections] = useState<Section[]>(mockSections);
  const [currentLecture, setCurrentLecture] = useState(mockSections[0].lectures[0]);

  const toggleSection = (sectionId: string) => {
    setSections(sections.map(section => 
      section.id === sectionId 
        ? { ...section, isOpen: !section.isOpen }
        : section
    ));
  };

  const getLectureIcon = (type: string) => {
    switch (type) {
      case 'video': return <Play className="h-4 w-4" />;
      case 'text': return <FileText className="h-4 w-4" />;
      case 'quiz': return <HelpCircle className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Video Player Section */}
        <div className="flex-1 p-6">
          <div className="aspect-video bg-black rounded-lg mb-6 flex items-center justify-center">
            <Play className="h-16 w-16 text-white" />
          </div>
          
          <div className="max-w-4xl">
            <h1 className="text-3xl font-bold mb-4">{currentLecture.title}</h1>
            <p className="text-muted-foreground mb-6">
              Learn advanced concepts and practical applications in this comprehensive course.
              This lecture covers the fundamentals you need to get started.
            </p>
            
            {currentLecture.type === 'text' && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Lecture Notes</h3>
                  <div className="prose dark:prose-invert">
                    <p>This is where the text content of the lecture would be displayed. 
                    You can include formatted text, code examples, images, and other educational materials.</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {currentLecture.type === 'quiz' && (
              <Card>
                <CardHeader>
                  <CardTitle>Knowledge Check</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Question 1: What is the main concept covered in this section?</h4>
                      <div className="space-y-2">
                        <label className="flex items-center space-x-2">
                          <input type="radio" name="q1" className="text-primary" />
                          <span>Option A</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="radio" name="q1" className="text-primary" />
                          <span>Option B</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="radio" name="q1" className="text-primary" />
                          <span>Option C</span>
                        </label>
                      </div>
                    </div>
                    <Button>Submit Answer</Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Course Content Sidebar */}
        <div className="w-96 border-l bg-card p-6">
          <h2 className="text-xl font-bold mb-6">Course Content</h2>
          
          <div className="space-y-4">
            {sections.map((section) => (
              <Collapsible key={section.id} open={section.isOpen} onOpenChange={() => toggleSection(section.id)}>
                <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-muted rounded-lg hover:bg-muted/80">
                  <span className="font-medium">{section.title}</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${section.isOpen ? 'rotate-180' : ''}`} />
                </CollapsibleTrigger>
                
                <CollapsibleContent className="mt-2 space-y-2">
                  {section.lectures.map((lecture) => (
                    <Button
                      key={lecture.id}
                      variant={currentLecture.id === lecture.id ? "secondary" : "ghost"}
                      className="w-full justify-start h-auto p-3"
                      onClick={() => setCurrentLecture(lecture)}
                    >
                      <div className="flex items-center gap-3 w-full">
                        {lecture.completed ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          getLectureIcon(lecture.type)
                        )}
                        <div className="flex-1 text-left">
                          <div className="text-sm font-medium">{lecture.title}</div>
                          {lecture.duration && (
                            <div className="text-xs text-muted-foreground">{lecture.duration}</div>
                          )}
                        </div>
                      </div>
                    </Button>
                  ))}
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}