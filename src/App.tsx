import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useMutation } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Index from "./pages/Index";
import CoursePage from "./pages/CoursePage";
import CreateCoursePage from "./pages/CreateCoursePage";
import NotFound from "./pages/NotFound";
import { useUser } from "@clerk/clerk-react";
import { api } from "./api";

const App = () => {
  const [isDark, setIsDark] = useState(false);
  const { isSignedIn, user } = useUser();
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);
  const mutation = useMutation({
    mutationFn: (newInstructor: { id: string; email: string; name: string }) =>
      api.post("/api/instructors", newInstructor),
  });
  useEffect(() => {
    if (isSignedIn) {
      const newInstructor = {
        id: user.id,
        email: user.primaryEmailAddress?.emailAddress,
        name: user.username ? user.username : "No Name",
      };
      mutation.mutate(newInstructor);
      console.log("User signed in:", user);
    }
  }, [isSignedIn, user]);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);

    if (newTheme) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<Index isDark={isDark} toggleTheme={toggleTheme} />}
          />
          <Route path="/course/:courseId" element={<CoursePage />} />
          <Route path="/create-course" element={<CreateCoursePage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  );
};

export default App;
