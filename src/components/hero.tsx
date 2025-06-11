import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plane, PlaneTakeoff, Wrench, Heart } from "lucide-react";
import Navbar from "./nav-bar";

const Hero = () => {
  return (
    <>
      <Navbar />
      <section
        id="home"
        className="min-h-screen  bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-slate-900 dark:to-emerald-900 relative overflow-hidden pt-16"
      >
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 dark:opacity-10"
          style={{
            backgroundImage:
              'url("https://wallpapers.com/images/featured/ethiopian-airlines-85xqok5uoxxzzpk8.jpg")',
          }}
        ></div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-emerald-300/20 to-emerald-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-teal-400/10 to-emerald-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-800 opacity-20"></div>

        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-6xl mx-auto">
            {/* Hero Content */}
            <div className="text-center mb-20">
              <Badge
                variant="secondary"
                className="mb-8 px-6 py-3 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 text-lg font-medium"
              >
                <Plane className="w-4 h-4 mr-2" />
                Professional Aviation Training
              </Badge>

              <h1 className="text-6xl md:text-8xl font-bold mb-8 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-800 dark:from-emerald-400 dark:via-teal-400 dark:to-emerald-300 bg-clip-text text-transparent leading-tight">
                Soar Beyond
                <br />
                <span className="text-5xl md:text-7xl">Your Dreams</span>
              </h1>

              <p className="text-xl md:text-2xl mb-12 text-muted-foreground max-w-4xl mx-auto leading-relaxed">
                Transform your passion for aviation into a rewarding career. Our
                comprehensive training programs and expert instructors will
                guide you through every step of your journey to the skies.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 text-lg px-10 py-6 rounded-xl"
                >
                  Start Your Journey
                  <Plane className="ml-2 w-5 h-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 text-lg px-10 py-6 rounded-xl transition-all duration-300"
                >
                  Explore Programs
                </Button>
              </div>
            </div>

            {/* Exam Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-emerald-200/50 dark:border-emerald-700/50 group hover:scale-105 cursor-pointer">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Wrench className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  AMT Exam
                </h3>
                <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                  Aircraft Maintenance Technician certification exam preparation
                  with comprehensive training modules.
                </p>
                <Button className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white">
                  Start AMT Prep
                </Button>
              </div>

              <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-teal-200/50 dark:border-teal-700/50 group hover:scale-105 cursor-pointer">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <PlaneTakeoff className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  Pilot Exam
                </h3>
                <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                  Commercial and private pilot license exam preparation with
                  flight training and theory courses.
                </p>
                <Button className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white">
                  Start Pilot Prep
                </Button>
              </div>

              <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-emerald-300/50 dark:border-emerald-600/50 group hover:scale-105 cursor-pointer">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-teal-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  Hostess Exam
                </h3>
                <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                  Flight attendant certification exam with customer service and
                  safety training programs.
                </p>
                <Button className="w-full bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 text-white">
                  Start Hostess Prep
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            className="w-full h-24 fill-background"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path
              d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
              opacity=".25"
            ></path>
            <path
              d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
              opacity=".5"
            ></path>
            <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"></path>
          </svg>
        </div>
      </section>
    </>
  );
};

export default Hero;
