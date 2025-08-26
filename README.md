# LMS - Learning Management System

A modern Learning Management System built with React, Vite, and TypeScript, inspired by Udemy.

## Lovable Project Info

**URL**: https://lovable.dev/projects/357dd9ec-e9c5-43ee-ac1f-e3d4b3c10892

## Features

### Frontend Features
- **Modern UI**: Clean, responsive design with light/dark theme toggle
- **Course Discovery**: Browse and search courses with category filtering
- **Course Viewing**: Video player with course content sidebar
- **Course Creation**: Drag-and-drop curriculum builder with multiple content types
- **Responsive Design**: Works seamlessly on desktop and mobile devices

### Course Content Types
- **Video Lectures**: Upload and stream video content
- **Text Articles**: Rich text content and documentation
- **Quizzes**: Interactive assessments with multiple choice questions
- **Drag & Drop**: Reorder course sections and lectures easily

### Technology Stack
- **Frontend**: React 18, TypeScript, Vite
- **UI Framework**: Shadcn/UI with Tailwind CSS
- **Routing**: React Router DOM
- **State Management**: React Query (TanStack Query)
- **Drag & Drop**: @dnd-kit library
- **Authentication**: Clerk (ready for integration)
- **Database**: PostgreSQL with Prisma ORM (backend)
- **Course Storage**: MongoDB for course structure

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn or pnpm

### Installation

1. Clone the repository using the project's Git URL
2. Navigate to the project directory
3. Install the necessary dependencies:
```sh
npm i
```
4. Start the development server:
```sh
npm run dev
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── course/         # Course-related components
│   ├── hero/           # Landing page components
│   ├── layout/         # Layout components (Navbar, etc.)
│   └── ui/             # Shadcn/UI base components
├── data/               # Mock data and types
├── pages/              # Route pages
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
└── types/              # TypeScript type definitions
```

## Pages

### Landing Page (`/`)
- Hero banner with "Make Your Courses Reach The World"
- Course catalog with search and filtering
- Category-based course browsing
- Course cards with ratings, duration, and pricing

### Course View (`/course/:id`)
- Video player on the left
- Course curriculum sidebar on the right
- Progress tracking
- Multiple content types (video, text, quiz)

### Course Creation (`/create-course`)
- Course metadata form (title, description)
- Drag-and-drop curriculum builder
- Support for multiple content types
- Section and lecture management

## Backend Integration

The frontend is designed to work with a Node.js backend with:

### Required API Endpoints
```
GET /api/courses              # Get all courses
GET /api/courses/:id          # Get single course
POST /api/courses             # Create new course
PUT /api/courses/:id          # Update course
DELETE /api/courses/:id       # Delete course
GET /api/courses/:id/content  # Get course content
```

### Database Schema

**PostgreSQL (User Data)**
```sql
-- Users table (managed by Clerk)
CREATE TABLE users (
  id UUID PRIMARY KEY,
  clerk_id VARCHAR UNIQUE NOT NULL,
  email VARCHAR NOT NULL,
  name VARCHAR,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Course metadata
CREATE TABLE courses (
  id UUID PRIMARY KEY,
  title VARCHAR NOT NULL,
  description TEXT,
  instructor_id UUID REFERENCES users(id),
  price DECIMAL,
  thumbnail_url VARCHAR,
  created_at TIMESTAMP DEFAULT NOW(),
  published BOOLEAN DEFAULT FALSE
);
```

**MongoDB (Course Content)**
```javascript
// Course structure document
{
  _id: ObjectId,
  courseId: "uuid-from-postgres",
  sections: [
    {
      id: "section-1",
      title: "Introduction",
      lectures: [
        {
          id: "lecture-1",
          title: "Welcome",
          type: "video|text|quiz",
          content: {
            // Video: { videoUrl, duration }
            // Text: { html, markdown }
            // Quiz: { questions, answers }
          }
        }
      ]
    }
  ],
  lastModified: Date
}
```

## Authentication Setup

To enable Clerk authentication:

1. Sign up at [Clerk](https://clerk.com)
2. Get your publishable key
3. Add to environment variables:
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
```
4. Wrap the app with ClerkProvider in `main.tsx`

## Customization

### Theme Colors
The primary purple color can be customized in `src/index.css`:
```css
:root {
  --primary: 262.1 83.3% 57.8%; /* Purple theme */
}
```

### Course Categories
Update categories in `src/data/mockCourses.ts`:
```typescript
export const categories = [
  "Development",
  "Design", 
  "Business",
  // Add more categories
];
```

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/357dd9ec-e9c5-43ee-ac1f-e3d4b3c10892) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/357dd9ec-e9c5-43ee-ac1f-e3d4b3c10892) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
