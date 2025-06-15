import { homeData } from "@/config/homeData";
import React from "react";
import { Button } from "../ui/button";
import { Link } from "react-router";

const HeroSection = () => {
  const { heroSection } = homeData;
  const { title, subtitle, image } = heroSection;

  return (
    <section className="w-full py-10 md:py-24 lg:py-32 bg-background">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                {title}
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                {subtitle}
              </p>
            </div>
            <div>
              <Link to={"/courses"}>
                <Button size="lg" className="mt-4 cursor-pointer">
                  Explore Courses
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <img
              src={image}
              alt="Hero Image"
              width={600}
              height={400}
              className="rounded-lg object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
