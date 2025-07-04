import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCategoryStore } from "@/store/categoryStore";
import { useCourseStore } from "@/store/courseStore";
import { useAuth } from "@/providers/auth";
import { BASE_URL } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";

const CoursesPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

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

  const handleEnroll = async (e, courseId) => {
    e.preventDefault();

    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/student/enroll/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ course_id: courseId }),
      });

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Server error: invalid JSON response.");
      }

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Enrollment failed.");
      }

      alert("✅ Enrolled successfully! Check your dashboard.");
    } catch (err) {
      alert("❌ " + err.message);
    }
  };

  return (
    <main className="flex min-h-screen flex-col">
      <section className="w-full py-8 bg-background border-b">
        <div className="container px-4 md:px-6">
          <div className="flex items-center justify-between">
            <Link to="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
          <div className="mt-6 space-y-2">
            <h1 className="text-3xl font-bold tracking-tighter md:text-4xl">
              All Courses
            </h1>
            <p className="text-muted-foreground md:text-xl">
              Explore our complete collection of courses and find the perfect
              one for your learning journey
            </p>
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="mb-8">
            <Tabs value={activeCategory} onValueChange={setActiveCategory}>
              <div className="flex justify-center mb-8">
                <TabsList className="grid grid-flow-col auto-cols-max gap-2">
                  <TabsTrigger value="all">All Courses</TabsTrigger>
                  {categories.map((category) => (
                    <TabsTrigger key={category.id} value={category.id}>
                      {category.title}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              <TabsContent value={activeCategory} className="mt-0">
                <div className="mb-6">
                  <p className="text-muted-foreground">
                    Showing {filteredCourses.length} course
                    {filteredCourses.length !== 1 ? "s" : ""}
                    {activeCategory !== "all" &&
                      ` in ${
                        categories.find((cat) => cat.id === activeCategory)
                          ?.title
                      }`}
                  </p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredCourses.map((course) => (
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
                          {user?.role === "student" ? (
                            <Button
                              variant="default"
                              size="sm"
                              onClick={(e) => handleEnroll(e, course.id)}
                            >
                              Enroll
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.preventDefault();
                                navigate("/login");
                              }}
                            >
                              Enroll
                            </Button>
                          )}
                        </CardFooter>
                      </Card>
                    </Link>
                  ))}
                </div>

                {filteredCourses.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">
                      No courses found in this category.
                    </p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>
    </main>
  );
};

export default CoursesPage;
