import React, { useEffect, useState } from "react";
import CategoryFilter from "./CategoryFilter";
import Courses from "./Courses";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Link } from "react-router";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";
import { useCategoryStore } from "@/store/categoryStore";
import { useCourseStore } from "@/store/courseStore";

// Sample course data
const courses = [
  {
    id: 1,
    title: "Introduction to Web Development",
    description: "Learn the basics of HTML, CSS, and JavaScript",
    image: "/placeholder.svg?height=200&width=300",
    category: "development",
    level: "Beginner",
    lessons: 12,
    duration: "6 weeks",
  },
  {
    id: 2,
    title: "Advanced React Patterns",
    description: "Master advanced React concepts and patterns",
    image: "/placeholder.svg?height=200&width=300",
    category: "development",
    level: "Advanced",
    lessons: 10,
    duration: "8 weeks",
  },
  {
    id: 3,
    title: "UI/UX Design Fundamentals",
    description: "Learn the principles of good UI/UX design",
    image: "/placeholder.svg?height=200&width=300",
    category: "design",
    level: "Intermediate",
    lessons: 8,
    duration: "5 weeks",
  },
  {
    id: 4,
    title: "Digital Marketing Essentials",
    description: "Learn the fundamentals of digital marketing",
    image: "/placeholder.svg?height=200&width=300",
    category: "marketing",
    level: "Beginner",
    lessons: 14,
    duration: "7 weeks",
  },
  {
    id: 5,
    title: "Data Science with Python",
    description: "Introduction to data analysis using Python",
    image: "/placeholder.svg?height=200&width=300",
    category: "data",
    level: "Intermediate",
    lessons: 16,
    duration: "10 weeks",
  },
  {
    id: 6,
    title: "Mobile App Development",
    description: "Build cross-platform mobile applications",
    image: "/placeholder.svg?height=200&width=300",
    category: "development",
    level: "Intermediate",
    lessons: 12,
    duration: "8 weeks",
  },
];

// Categories
const categories = [
  { id: "all", name: "All Courses" },
  { id: "development", name: "Development" },
  { id: "design", name: "Design" },
  { id: "marketing", name: "Marketing" },
  { id: "data", name: "Data Science" },
];

const CoursesSection = ({ from = "home" }) => {
  const {
    loading,
    categories,
    activeCategory,
    fetchCategory,
    setActiveCategory,
  } = useCategoryStore();

  const { courses, fetchCourses } = useCourseStore();

  useEffect(() => {
    fetchCategory();
    fetchCourses();
  }, []);

  const filteredCourses =
    activeCategory === "all"
      ? courses
      : courses.filter((course) => course.category === activeCategory);

  return (
    <section className="w-full py-12 md:py-24 bg-muted/50">
      <div className="container px-4 md:px-6">
        {/* TODO: COURSE SECTION HEADER */}
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
              Our Courses
            </h2>
            <p className="max-w-[700px] text-muted-foreground md:text-xl">
              Browse our selection of courses and find the perfect one for you
            </p>
          </div>
        </div>

        {/* Categories Tabs */}
        <div className="mt-8">
          {loading ? (
            ""
          ) : (
            <Tabs
              defaultValue="all"
              value={activeCategory}
              onValueChange={setActiveCategory}
            >
              <div className="flex justify-center mb-8">
                <TabsList className="grid grid-flow-col auto-cols-max gap-2">
                  {categories.map((category) => (
                    <TabsTrigger key={category.id} value={category.id}>
                      {category.title}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              {/* Courses Grid */}
              <TabsContent value={activeCategory} className="mt-0">
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {/* TODO: filterdCourses Empty => then Design EMPTY STATE */}
                  {filteredCourses.slice(0, 3).map((course) => (
                    <Link to={`/courses/${course.id}`} key={course.id}>
                      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="aspect-video w-full overflow-hidden">
                          <img
                            src={course.image || "/placeholder.svg"}
                            alt={course.title}
                            width={300}
                            height={200}
                            className="object-cover w-full h-full transition-transform hover:scale-105"
                          />
                        </div>
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <Badge variant="outline">{course.level}</Badge>
                            <div className="text-sm text-muted-foreground">
                              {course.lessons} lessons
                            </div>
                          </div>
                          <CardTitle className="line-clamp-1">
                            {course.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground line-clamp-2">
                            {course.description}
                          </p>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                          <div className="text-sm text-muted-foreground">
                            {course.duration}
                          </div>
                          <Button variant="ghost" size="sm">
                            Learn more
                          </Button>
                        </CardFooter>
                      </Card>
                    </Link>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </div>

        {/* See More Button */}
        <div className="flex justify-center mt-12">
          <Link to={`/courses?category=${activeCategory}`}>
            <Button size="lg" className="gap-2">
              See All Courses
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CoursesSection;
