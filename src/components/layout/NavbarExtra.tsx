import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/clerk-react";
import React from "react";
import { Link } from "react-router-dom";

interface NavbarExtraProps {
  isDark: boolean;
  toggleTheme: () => void;
  onYourCourses?: () => void;
}

const NavbarExtra: React.FC<NavbarExtraProps> = ({
  isDark,
  toggleTheme,
  onYourCourses,
}) => {
  return (
    <nav className="bg-background border-b border-border px-4 py-3">
      <div className="container mx-auto flex items-center justify-between">
        {/* Left: Logo as Link */}
        <Link to="/" className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-primary">Skelo LMS</h1>
        </Link>
        {/* Right: Theme toggler, Your Courses button, UserButton */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-9 w-9"
          >
            {isDark ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
          <Button onClick={onYourCourses}>Your Courses</Button>
          <UserButton />
        </div>
      </div>
    </nav>
  );
};

export default NavbarExtra;
