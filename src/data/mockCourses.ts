export interface Course {
  id: string;
  title: string;
  instructor: string;
  thumbnail: string;
  rating: number;
  duration: string;
  students: number;
  price: string;
  description: string;
  category: string;
}

export const mockCourses: Course[] = [
  {
    id: "1",
    title: "100 Days of Code: The Complete Python Pro Bootcamp",
    instructor: "Dr. Angela Yu",
    thumbnail: "https://img-c.udemycdn.com/course/750x422/629302_8a2d_2.jpg",
    rating: 4.7,
    duration: "58h",
    students: 388130,
    price: "₹399",
    description: "Master Python by building 100 projects in 100 days. Learn data science, automation, build websites, games and apps!",
    category: "Development"
  },
  {
    id: "2", 
    title: "The Complete Full-Stack Web Development Bootcamp",
    instructor: "Dr. Angela Yu",
    thumbnail: "https://img-c.udemycdn.com/course/750x422/625204_436a_3.jpg",
    rating: 4.7,
    duration: "65h",
    students: 450184,
    price: "₹399",
    description: "Learn web development from scratch. HTML, CSS, JavaScript, Node, React, PostgreSQL, Web3 and DApps",
    category: "Development"
  },
  {
    id: "3",
    title: "[NEW] Ultimate AWS Certified Cloud Practitioner CLF-C02",
    instructor: "Stephane Maarek",
    thumbnail: "https://img-c.udemycdn.com/course/750x422/5146374_d8b4_3.jpg",
    rating: 4.7,
    duration: "26h",
    students: 261653,
    price: "₹399",
    description: "Full Practice Exam | Learn Cloud Computing | Pass the AWS Cloud Practitioner CLF-C02 exam!",
    category: "IT & Software"
  },
  {
    id: "4",
    title: "Ultimate AWS Certified Solutions Architect Associate SAA-C03",
    instructor: "Stephane Maarek",
    thumbnail: "https://img-c.udemycdn.com/course/750x422/362070_d819_7.jpg",
    rating: 4.7,
    duration: "27h",
    students: 267022,
    price: "₹399",
    description: "Full Practice Exam included + sample exam questions + flash cards + cheat sheets",
    category: "IT & Software"
  },
  {
    id: "5",
    title: "The Complete Python Bootcamp From Zero to Hero in Python",
    instructor: "Jose Portilla",
    thumbnail: "https://img-c.udemycdn.com/course/750x422/567828_67d0.jpg",
    rating: 4.6,
    duration: "22h",
    students: 545094,
    price: "₹399",
    description: "Learn Python like a Professional Start from the basics and go all the way to creating your own applications",
    category: "Development"
  },
  {
    id: "6",
    title: "Machine Learning A-Z: AI, Python & R + ChatGPT Prize",
    instructor: "Kirill Eremenko",
    thumbnail: "https://img-c.udemycdn.com/course/750x422/950390_270f_3.jpg",
    rating: 4.5,
    duration: "44h",
    students: 178543,
    price: "₹399",
    description: "Learn to create Machine Learning Algorithms in Python and R from two Data Science experts",
    category: "Data Science"
  }
];

export const categories = [
  "All",
  "Development",
  "Business", 
  "Finance & Accounting",
  "IT & Software",
  "Office Productivity",
  "Personal Development",
  "Design",
  "Marketing",
  "Health & Fitness",
  "Music",
  "Data Science"
];