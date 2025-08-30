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
interface Video {
  id: string;
  title: string;
  description: string;
  url: string;
}

interface QuizQuestion {
  text: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correct: string;
}

interface Quiz {
  id: string;
  name: string;
  questions: QuizQuestion[];
}

interface CourseSection {
  id: string;
  title: string;
  videos: Video[];
  quizzes: Quiz[];
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

  const addVideo = () => {
    const newVideo: Video = {
      id: `${section.id}-video-${Date.now()}`,
      title: "New Video",
      description: "",
      url: "",
    };
    onUpdateSection(section.id, {
      videos: [...section.videos, newVideo],
    });
  };

  const addQuiz = () => {
    const newQuiz: Quiz = {
      id: `${section.id}-quiz-${Date.now()}`,
      name: "New Quiz",
      questions: [],
    };
    onUpdateSection(section.id, {
      quizzes: [...section.quizzes, newQuiz],
    });
  };

  const updateVideo = (videoId: string, updates: Partial<Video>) => {
    const updatedVideos = section.videos.map((video) =>
      video.id === videoId ? { ...video, ...updates } : video
    );
    onUpdateSection(section.id, { videos: updatedVideos });
  };

  const deleteVideo = (videoId: string) => {
    const updatedVideos = section.videos.filter(
      (video) => video.id !== videoId
    );
    onUpdateSection(section.id, { videos: updatedVideos });
  };

  const updateQuiz = (quizId: string, updates: Partial<Quiz>) => {
    const updatedQuizzes = section.quizzes.map((quiz) =>
      quiz.id === quizId ? { ...quiz, ...updates } : quiz
    );
    onUpdateSection(section.id, { quizzes: updatedQuizzes });
  };

  const deleteQuiz = (quizId: string) => {
    const updatedQuizzes = section.quizzes.filter((quiz) => quiz.id !== quizId);
    onUpdateSection(section.id, { quizzes: updatedQuizzes });
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
          {/* Videos */}
          {section.videos.map((video) => (
            <div
              key={video.id}
              className="flex items-center gap-3 p-3 border rounded"
            >
              <Video className="h-4 w-4" />
              <Input
                value={video.title}
                onChange={(e) =>
                  updateVideo(video.id, { title: e.target.value })
                }
                placeholder="Video title"
                className="flex-1"
              />
              <Input
                value={video.url}
                onChange={(e) => updateVideo(video.id, { url: e.target.value })}
                placeholder="Video URL"
                className="flex-1"
              />
              <Input
                value={video.description}
                onChange={(e) =>
                  updateVideo(video.id, { description: e.target.value })
                }
                placeholder="Description"
                className="flex-1"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteVideo(video.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}

          {/* Quizzes */}
          {section.quizzes.map((quiz) => (
            <div key={quiz.id} className="p-3 border rounded mb-3">
              <div className="flex items-center gap-3 mb-2">
                <HelpCircle className="h-4 w-4" />
                <Input
                  value={quiz.name}
                  onChange={(e) =>
                    updateQuiz(quiz.id, { name: e.target.value })
                  }
                  placeholder="Quiz name"
                  className="flex-1"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteQuiz(quiz.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Questions */}
              {quiz.questions.map((question, qIdx) => (
                <div key={qIdx} className="border p-2 rounded mb-2">
                  <Label>Question</Label>
                  <Input
                    value={question.text}
                    onChange={(e) => {
                      const updatedQuestions = quiz.questions.map((q, idx) =>
                        idx === qIdx ? { ...q, text: e.target.value } : q
                      );
                      updateQuiz(quiz.id, { questions: updatedQuestions });
                    }}
                    placeholder="Question text"
                    className="mb-2"
                  />
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <div>
                      <Label>Option A</Label>
                      <Input
                        value={question.optionA}
                        onChange={(e) => {
                          const updatedQuestions = quiz.questions.map(
                            (q, idx) =>
                              idx === qIdx
                                ? { ...q, optionA: e.target.value }
                                : q
                          );
                          updateQuiz(quiz.id, { questions: updatedQuestions });
                        }}
                        placeholder="Option A"
                      />
                    </div>
                    <div>
                      <Label>Option B</Label>
                      <Input
                        value={question.optionB}
                        onChange={(e) => {
                          const updatedQuestions = quiz.questions.map(
                            (q, idx) =>
                              idx === qIdx
                                ? { ...q, optionB: e.target.value }
                                : q
                          );
                          updateQuiz(quiz.id, { questions: updatedQuestions });
                        }}
                        placeholder="Option B"
                      />
                    </div>
                    <div>
                      <Label>Option C</Label>
                      <Input
                        value={question.optionC}
                        onChange={(e) => {
                          const updatedQuestions = quiz.questions.map(
                            (q, idx) =>
                              idx === qIdx
                                ? { ...q, optionC: e.target.value }
                                : q
                          );
                          updateQuiz(quiz.id, { questions: updatedQuestions });
                        }}
                        placeholder="Option C"
                      />
                    </div>
                    <div>
                      <Label>Option D</Label>
                      <Input
                        value={question.optionD}
                        onChange={(e) => {
                          const updatedQuestions = quiz.questions.map(
                            (q, idx) =>
                              idx === qIdx
                                ? { ...q, optionD: e.target.value }
                                : q
                          );
                          updateQuiz(quiz.id, { questions: updatedQuestions });
                        }}
                        placeholder="Option D"
                      />
                    </div>
                  </div>
                  <Label>Correct Option (A/B/C/D)</Label>
                  <Input
                    value={question.correct}
                    onChange={(e) => {
                      const updatedQuestions = quiz.questions.map((q, idx) =>
                        idx === qIdx ? { ...q, correct: e.target.value } : q
                      );
                      updateQuiz(quiz.id, { questions: updatedQuestions });
                    }}
                    placeholder="Correct option (A/B/C/D)"
                    className="mb-2"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      const updatedQuestions = quiz.questions.filter(
                        (_, idx) => idx !== qIdx
                      );
                      updateQuiz(quiz.id, { questions: updatedQuestions });
                    }}
                  >
                    Delete Question
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => {
                  const newQuestion: QuizQuestion = {
                    text: "",
                    optionA: "",
                    optionB: "",
                    optionC: "",
                    optionD: "",
                    correct: "",
                  };
                  updateQuiz(quiz.id, {
                    questions: [...quiz.questions, newQuestion],
                  });
                }}
              >
                Add Question
              </Button>
            </div>
          ))}

          <div className="flex gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={addVideo}>
              <Video className="h-4 w-4 mr-2" />
              Add Video
            </Button>
            <Button variant="outline" size="sm" onClick={addQuiz}>
              <HelpCircle className="h-4 w-4 mr-2" />
              Add Quiz
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
  const [showSuccess, setShowSuccess] = useState(false);
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
      videos: [],
      quizzes: [],
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
    try {
      // Create course
      const courseResponse = await api.post("/courses", {
        title: courseTitle,
        description: courseDescription,
        thumbnailUrl: "", // use thumbnail if available
        instructorId: user.id,
      });
      const courseId = courseResponse.data.id;

      // Create sections
      for (const section of sections) {
        const sectionResponse = await api.post(
          `/courses/${courseId}/sections`,
          {
            title: section.title,
          }
        );
        const sectionId = sectionResponse.data.id;

        // Create videos
        for (const video of section.videos) {
          await api.post(`/sections/${sectionId}/videos`, {
            title: video.title,
            description: video.description,
            url: video.url,
          });
        }

        // Create quizzes
        for (const quiz of section.quizzes) {
          await api.post(`/sections/${sectionId}/quizzes`, {
            name: quiz.name,
            questions: quiz.questions,
          });
        }
      }

      setCourseTitle("");
      setCourseDescription("");
      setSections([]);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
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
            {showSuccess && (
              <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50 bg-white border border-green-500 text-green-600 px-6 py-3 rounded shadow-lg text-center font-semibold">
                Course published successfully
              </div>
            )}
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
