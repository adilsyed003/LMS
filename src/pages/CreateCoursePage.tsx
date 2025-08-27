import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Plus,
  X,
  GripVertical,
  Video,
  FileText,
  HelpCircle,
} from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { SignedIn, SignedOut, SignIn } from "@clerk/clerk-react";
import NavbarExtra from "@/components/layout/NavbarExtra";
interface CourseSection {
  id: string;
  title: string;
  lectures: Lecture[];
}

interface Lecture {
  id: string;
  title: string;
  type: "video" | "text" | "quiz";
  content?: string;
}

function SortableSection({
  section,
  onUpdateSection,
  onDeleteSection,
}: {
  section: CourseSection;
  onUpdateSection: (sectionId: string, updates: Partial<CourseSection>) => void;
  onDeleteSection: (sectionId: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const addLecture = (type: "video" | "text" | "quiz") => {
    const newLecture: Lecture = {
      id: `${section.id}-lecture-${Date.now()}`,
      title: `New ${type}`,
      type,
    };

    onUpdateSection(section.id, {
      lectures: [...section.lectures, newLecture],
    });
  };

  const updateLecture = (lectureId: string, updates: Partial<Lecture>) => {
    const updatedLectures = section.lectures.map((lecture) =>
      lecture.id === lectureId ? { ...lecture, ...updates } : lecture
    );
    onUpdateSection(section.id, { lectures: updatedLectures });
  };

  const deleteLecture = (lectureId: string) => {
    const updatedLectures = section.lectures.filter(
      (lecture) => lecture.id !== lectureId
    );
    onUpdateSection(section.id, { lectures: updatedLectures });
  };

  return (
    <Card ref={setNodeRef} style={style} className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-2">
          <div {...attributes} {...listeners} className="cursor-grab">
            <GripVertical className="h-5 w-5 text-muted-foreground" />
          </div>
          <Input
            value={section.title}
            onChange={(e) =>
              onUpdateSection(section.id, { title: e.target.value })
            }
            placeholder="Section title"
            className="flex-1"
          />
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onDeleteSection(section.id)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-3">
          {section.lectures.map((lecture) => (
            <div
              key={lecture.id}
              className="flex items-center gap-3 p-3 border rounded"
            >
              <div className="flex items-center gap-2 flex-1">
                {lecture.type === "video" && <Video className="h-4 w-4" />}
                {lecture.type === "text" && <FileText className="h-4 w-4" />}
                {lecture.type === "quiz" && <HelpCircle className="h-4 w-4" />}

                <Input
                  value={lecture.title}
                  onChange={(e) =>
                    updateLecture(lecture.id, { title: e.target.value })
                  }
                  placeholder="Lecture title"
                  className="flex-1"
                />
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteLecture(lecture.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}

          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => addLecture("video")}
            >
              <Video className="h-4 w-4 mr-2" />
              Video
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => addLecture("text")}
            >
              <FileText className="h-4 w-4 mr-2" />
              Text
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => addLecture("quiz")}
            >
              <HelpCircle className="h-4 w-4 mr-2" />
              Quiz
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function CreateCoursePage() {
  const [courseTitle, setCourseTitle] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [sections, setSections] = useState<CourseSection[]>([]);
  const [isDark, setIsDark] = useState(false);
  const toggleTheme = () => {
    setIsDark((prev) => !prev);
    if (!isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const addSection = () => {
    const newSection: CourseSection = {
      id: `section-${Date.now()}`,
      title: `Section ${sections.length + 1}`,
      lectures: [],
    };
    setSections([...sections, newSection]);
  };

  const updateSection = (
    sectionId: string,
    updates: Partial<CourseSection>
  ) => {
    setSections(
      sections.map((section) =>
        section.id === sectionId ? { ...section, ...updates } : section
      )
    );
  };

  const deleteSection = (sectionId: string) => {
    setSections(sections.filter((section) => section.id !== sectionId));
  };

  const handleDragEnd = (event: import("@dnd-kit/core").DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setSections((sections) => {
        const oldIndex = sections.findIndex(
          (section) => section.id === active.id
        );
        const newIndex = sections.findIndex(
          (section) => section.id === over.id
        );

        return arrayMove(sections, oldIndex, newIndex);
      });
    }
  };

  const publishCourse = () => {
    const courseData = {
      title: courseTitle,
      description: courseDescription,
      sections,
    };
    console.log("Publishing course:", courseData);
    // Here you would send the data to your backend
  };

  return (
    <>
      <SignedIn>
        <NavbarExtra isDark={isDark} toggleTheme={toggleTheme} />
        <div className="min-h-screen bg-background p-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-6">Create New Course</h1>

              <div className="space-y-6">
                <div>
                  <Label htmlFor="course-title">Course Title</Label>
                  <Input
                    id="course-title"
                    value={courseTitle}
                    onChange={(e) => setCourseTitle(e.target.value)}
                    placeholder="Enter course title"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="course-description">Course Description</Label>
                  <Textarea
                    id="course-description"
                    value={courseDescription}
                    onChange={(e) => setCourseDescription(e.target.value)}
                    placeholder="Describe what students will learn in this course"
                    className="mt-2 h-32"
                  />
                </div>
              </div>
            </div>

            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold">Course Curriculum</h2>
                <Button onClick={addSection}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Section
                </Button>
              </div>

              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={sections.map((s) => s.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {sections.map((section) => (
                    <SortableSection
                      key={section.id}
                      section={section}
                      onUpdateSection={updateSection}
                      onDeleteSection={deleteSection}
                    />
                  ))}
                </SortableContext>
              </DndContext>
            </div>

            <div className="flex justify-end gap-4">
              <Button variant="outline">Save Draft</Button>
              <Button onClick={publishCourse}>Publish Course</Button>
            </div>
          </div>
        </div>
      </SignedIn>
      <SignedOut>
        <div className="flex items-center justify-center min-h-screen">
          <div className="shadow-lg shadow-purple-500/50 rounded-lg">
            <SignIn forceRedirectUrl="/create-course" />
          </div>
        </div>
      </SignedOut>
    </>
  );
}
