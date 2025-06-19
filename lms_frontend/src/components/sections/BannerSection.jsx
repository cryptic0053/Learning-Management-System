import React from "react";
import { Link } from "react-router";
import { Button } from "../ui/button";
import { ArrowRight, BookOpen, Star, Users } from "lucide-react";

const BannerSection = () => {
  return (
    <section className="w-full py-12 md:py-16 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 items-center">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
              Ready to Start Your Learning Journey?
            </h2>
            <p className="text-white/90 md:text-lg max-w-[600px]">
              Join thousands of students already learning on our platform. Gain
              new skills, advance your career, and unlock your potential today.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/courses">
                <Button size="lg" variant="secondary" className="gap-2">
                  Explore All Courses
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent text-white border-white hover:bg-white/10"
                >
                  Get Started Free
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex justify-end">
            <div className="grid grid-cols-3 gap-4 md:gap-8">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Users className="h-6 w-6" />
                </div>
                <div className="text-2xl font-bold">10,000+</div>
                <div className="text-sm text-white/80">Students</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <BookOpen className="h-6 w-6" />
                </div>
                <div className="text-2xl font-bold">500+</div>
                <div className="text-sm text-white/80">Courses</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Star className="h-6 w-6" />
                </div>
                <div className="text-2xl font-bold">4.8</div>
                <div className="text-sm text-white/80">Rating</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BannerSection;
