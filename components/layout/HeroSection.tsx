import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "../ui/button";
import companyLogo from "../../public/aisemble_transparent.png";

function HeroSection() {
  return (
    <div className="container mx-auto px-4 text-center">
      <div className="mb-8 inline-block">
        <div className="relative h-32 w-32 mx-auto">
          {/* <BrainCircuit className="h-full w-full text-primary" /> */}
          <Image
            src={companyLogo}
            alt="AIsemble Logo"
            width={200}
            height={200}
          />
        </div>
      </div>
      <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
        <span className="text-[#e63946] dark:text-[#e63946]">AI</span>
        <span className="bg-gradient-to-r from-[#457b9d] to-[#1d3557] dark:from-white dark:to-white bg-clip-text text-transparent">
          semble
        </span>
      </h1>
      <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10">
        Create, manage, and collaborate with your own team of AI agents.
        Automate workflows, solve complex problems, and enhance productivity.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link href="/sign-up">
          <Button
            size="lg"
            className="gap-2 bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            Get Started <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      <div className="mt-16 relative">
        <div className="bg-card text-card-foreground rounded-lg shadow-xl border border-border overflow-hidden">
          <Image
            src="/dashboardsnip.png"
            alt="AIsemble Dashboard Preview"
            width={1200}
            height={600}
            className="w-full h-auto"
          />
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
