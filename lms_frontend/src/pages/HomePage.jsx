import BannerSection from "@/components/sections/BannerSection";
import CoursesSection from "@/components/sections/CoursesSection";
import HeroSection from "@/components/sections/HeroSection";
import { Input } from "@/components/ui/input";
import React from "react";

const HomePage = () => {
  return (
    <>
      <HeroSection />
      <CoursesSection />
      <BannerSection />
    </>
  );
};

export default HomePage;
