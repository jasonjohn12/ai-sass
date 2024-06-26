import LandingContent from "@/components/landing-content";
import LandingHero from "@/components/landing-hero";
import LandingNavbar from "@/components/landing-navbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

const LandingPage = () => {
  return (
    <div className="text-2xl">
      <div className="h-full">
        <LandingNavbar />
        <LandingHero />
        <LandingContent />
      </div>
    </div>
  );
};

export default LandingPage;
