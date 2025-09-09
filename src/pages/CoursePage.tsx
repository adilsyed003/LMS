import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import NavbarExtra from "@/components/layout/NavbarExtra";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ChevronDown,
  Play,
  FileText,
  HelpCircle,
  CheckCircle,
} from "lucide-react";

interface Question {
  id: string;
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
  sectionId: string;
  questions: Question[];
}

interface Video {
  id: string;
  title: string;
  description: string;
  url: string;
  sectionId: string;
}

interface Section {
  id: string;
  title: string;
  courseId: string;
  createdAt: string;
  videos: Video[];
  quizzes: Quiz[];
  isOpen?: boolean;
}

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string | null;
  instructorId: string;
  createdAt: string;
  sections: Section[];
}

interface Lecture {
  id: string;
  title: string;
  type: "video" | "text" | "quiz";
  duration?: string;
  completed: boolean;
}

function VideoPlayer({ video }: { video: Video }) {
  const videoKey = video.url?.replace(/^videos\//, "");
  const { data, isLoading, error } = useQuery({
    queryKey: ["video", videoKey],
    queryFn: async () => {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/stream/video/${videoKey}`
      );
      if (!res.ok) throw new Error("Failed to get video URL");
      return res.json();
    },
    enabled: !!videoKey,
    staleTime: 1000 * 60 * 5,
  });
  if (isLoading)
    return (
      <div className="w-full h-full flex items-center justify-center">
        Loading video...
      </div>
    );
  if (error || !data?.url)
    return (
      <div className="w-full h-full flex items-center justify-center text-red-500">
        Error loading video
      </div>
    );
  return (
    <video controls className="w-full h-full rounded-lg">
      <source src={data.url} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
}

export default function CoursePage() {
  const [isDark, setIsDark] = useState<boolean>(false);
  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      return next;
    });
  };

  const { courseId } = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sections, setSections] = useState<Section[]>([]);
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [score, setScore] = useState<number | null>(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/courses/${courseId}`
        );
        if (!res.ok) throw new Error("Failed to fetch course");
        const data = await res.json();
        setCourse(data);
        const sectionsWithOpen = data.sections.map(
          (section: Section, idx: number) => ({ ...section, isOpen: idx === 0 })
        );
        setSections(sectionsWithOpen);
        // Auto-select first video or quiz
        if (sectionsWithOpen.length > 0) {
          const firstSection = sectionsWithOpen[0];
          if (firstSection.videos.length > 0) {
            setCurrentVideo(firstSection.videos[0]);
            setCurrentQuiz(null);
          } else if (firstSection.quizzes.length > 0) {
            setCurrentQuiz(firstSection.quizzes[0]);
            setCurrentVideo(null);
          }
        }
      } catch (err) {
        setError("Failed to load course");
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [courseId]);

  const toggleSection = (sectionId: string) => {
    setSections((prevSections) =>
      prevSections.map((section) =>
        section.id === sectionId
          ? { ...section, isOpen: !section.isOpen }
          : section
      )
    );
  };

  const handleVideoSelection = (video: Video) => {
    if (currentVideo?.id !== video.id) {
      setCurrentVideo(video);
      setCurrentQuiz(null);
    }
  };

  const handleQuizSelection = (quiz: Quiz) => {
    if (currentQuiz?.id !== quiz.id) {
      setCurrentQuiz(quiz);
      setCurrentVideo(null); // Ensure the video player is hidden when a quiz is selected
      setScore(null); // Reset the score when a new quiz is selected
      setAnswers({}); // Clear previous answers
    }
  };

  return (
    <>
      <NavbarExtra isDark={isDark} toggleTheme={toggleTheme} />
      <div className="min-h-screen bg-background">
        {loading ? (
          <div className="p-12 text-center">Loading course...</div>
        ) : error ? (
          <div className="p-12 text-center text-red-500">{error}</div>
        ) : course ? (
          <div className="flex">
            {/* Main Content Section: Show either quiz or video */}
            <div className="flex-1 p-6">
              <div className="max-w-4xl">
                <h1 className="text-3xl font-bold mb-4">
                  {currentQuiz
                    ? currentQuiz.name
                    : currentVideo
                    ? currentVideo.title
                    : course.title}
                </h1>
                {/* Main content logic */}
                {currentQuiz ? (
                  <>
                    <p className="text-muted-foreground mb-6">
                      Quiz: Answer the questions below.
                    </p>
                    <Card>
                      <CardHeader>
                        <CardTitle>{currentQuiz.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        {currentQuiz.questions.map((q, idx) => (
                          <div key={q.id} className="mb-6">
                            <h4 className="font-medium mb-2">
                              Question {idx + 1}: {q.text}
                            </h4>
                            <div className="space-y-2">
                              {"ABCD".split("").map((opt) => {
                                const value = q[
                                  `option${opt}` as keyof Question
                                ] as string;
                                return (
                                  <label
                                    key={opt}
                                    className="flex items-center space-x-2"
                                  >
                                    <input
                                      type="radio"
                                      name={`q${idx}`}
                                      className="text-primary"
                                      value={opt}
                                      checked={answers[q.id] === opt}
                                      onChange={() => {
                                        setAnswers({ ...answers, [q.id]: opt });
                                      }}
                                      disabled={score !== null}
                                    />
                                    <span>{value}</span>
                                  </label>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                        <Button
                          onClick={() => {
                            if (!currentQuiz) return;
                            let correct = 0;
                            currentQuiz.questions.forEach((q) => {
                              const selected = answers[q.id]?.toUpperCase();
                              const answer = q.correct?.toUpperCase();
                              if (selected && answer && selected === answer)
                                correct++;
                            });
                            setScore(correct);
                          }}
                          disabled={score !== null}
                        >
                          Submit Answers
                        </Button>
                        {score !== null && (
                          <div className="mt-4 text-lg font-semibold text-green-600">
                            You scored {score} out of{" "}
                            {currentQuiz.questions.length}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </>
                ) : currentVideo ? (
                  <>
                    <div className="aspect-video bg-black rounded-lg mb-6 flex items-center justify-center">
                      <VideoPlayer key={currentVideo.id} video={currentVideo} />
                    </div>
                    <p className="text-muted-foreground mb-6">
                      {currentVideo.description}
                    </p>
                  </>
                ) : (
                  <p className="text-muted-foreground mb-6">
                    {course.description}
                  </p>
                )}
              </div>
            </div>
            {/* Course Content Sidebar */}
            <div className="w-96 border-l bg-card p-6">
              <h2 className="text-xl font-bold mb-6">Course Content</h2>
              <div className="space-y-4">
                {sections.map((section) => (
                  <Collapsible
                    key={section.id}
                    open={!!section.isOpen}
                    onOpenChange={() => toggleSection(section.id)}
                  >
                    <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-muted rounded-lg hover:bg-muted/80">
                      <span className="font-medium">{section.title}</span>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform ${
                          section.isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-2 space-y-2">
                      {/* Videos */}
                      {section.videos.map((video) => (
                        <Button
                          key={video.id}
                          variant={
                            currentVideo && currentVideo.id === video.id
                              ? "secondary"
                              : "ghost"
                          }
                          className="w-full justify-start h-auto p-3"
                          onClick={() => handleVideoSelection(video)}
                        >
                          <div className="flex items-center gap-3 w-full">
                            <Play className="h-4 w-4" />
                            <div className="flex-1 text-left">
                              <div className="text-sm font-medium">
                                {video.title}
                              </div>
                            </div>
                          </div>
                        </Button>
                      ))}
                      {/* Quizzes */}
                      {section.quizzes.map((quiz) => (
                        <Button
                          key={quiz.id}
                          variant={
                            currentQuiz && currentQuiz.id === quiz.id
                              ? "secondary"
                              : "ghost"
                          }
                          className="w-full justify-start h-auto p-3"
                          onClick={() => handleQuizSelection(quiz)}
                        >
                          <div className="flex items-center gap-3 w-full">
                            <HelpCircle className="h-4 w-4" />
                            <div className="flex-1 text-left">
                              <div className="text-sm font-medium">
                                {quiz.name}
                              </div>
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
        ) : null}
      </div>
    </>
  );
}
