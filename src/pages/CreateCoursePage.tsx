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
import { useUser } from "@clerk/clerk-react";
import { useMutation } from "@tanstack/react-query";
import { api } from "../api";
interface CourseSection {
  id: string;
  title: string;
  contents: Content[]; // Updated from lectures to contents
}

interface Content {
  id: string;
  title: string;
  type: "VIDEO" | "TEXT" | "QUIZ"; // Updated to match backend ContentType enum
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

  const addContent = (type: "VIDEO" | "TEXT" | "QUIZ") => {
    const newContent: Content = {
      id: `${section.id}-content-${Date.now()}`,
      title: `New ${type}`,
      type,
    };

    onUpdateSection(section.id, {
      contents: [...section.contents, newContent],
    });
  };

  const updateContent = (contentId: string, updates: Partial<Content>) => {
    const updatedContents = section.contents.map((content) =>
      content.id === contentId ? { ...content, ...updates } : content
    );
    onUpdateSection(section.id, { contents: updatedContents });
  };

  const deleteContent = (contentId: string) => {
    const updatedContents = section.contents.filter(
      (content) => content.id !== contentId
    );
    onUpdateSection(section.id, { contents: updatedContents });
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
          {section.contents.map((content) => (
            <div
              key={content.id}
              className="flex items-center gap-3 p-3 border rounded"
            >
              <div className="flex items-center gap-2 flex-1">
                {content.type === "VIDEO" && <Video className="h-4 w-4" />}
                {content.type === "TEXT" && <FileText className="h-4 w-4" />}
                {content.type === "QUIZ" && <HelpCircle className="h-4 w-4" />}

                <Input
                  value={content.title}
                  onChange={(e) =>
                    updateContent(content.id, { title: e.target.value })
                  }
                  placeholder="Content title"
                  className="flex-1"
                />
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteContent(content.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}

          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => addContent("VIDEO")}
            >
              <Video className="h-4 w-4 mr-2" />
              Video
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => addContent("TEXT")}
            >
              <FileText className="h-4 w-4 mr-2" />
              Text
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => addContent("QUIZ")}
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
  const { user } = useUser();
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
      contents: [],
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

  const publishCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    const courseData = {
      title: courseTitle,
      description: courseDescription,
      sections,
    };

    try {
      // Create course
      const courseResponse = await api.post("/api/courses", {
        title: courseData.title,
        description: courseData.description,
        thumbnailUrl: "",
        instructorId: user.id,
      });
      const courseId = courseResponse.data.id;

      // Create sections
      for (const section of sections) {
        const sectionResponse = await api.post("/api/sections", {
          title: section.title,
          courseId,
        });
        const sectionId = sectionResponse.data.id;

        // Create contents
        for (const content of section.contents) {
          await api.post("/api/contents", {
            sectionId,
            type: content.type,
            title: content.title,
            url: content.type === "VIDEO" ? content.content : undefined,
            text: content.type !== "VIDEO" ? content.content : undefined,
          });
        }
      }

      alert("Course published successfully!");
    } catch (error) {
      console.error("Failed to publish course", error);
      alert("Failed to publish course");
    }
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
