"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  CheckCircle,
  Users,
  BookOpen,
  Plane,
  Settings,
  UserCheck,
  Menu,
  X,
  Play,
  ArrowRight,
  Star,
  Trophy,
  Shield,
  Sparkles,
  Zap,
  Crown,
} from "lucide-react";
import { useState } from "react";
import Image from "next/image";

const Index = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const features = [
    {
      icon: Settings,
      title: "AMT Certification Prep",
      description:
        "Comprehensive aircraft maintenance technician exam preparation with real-world scenarios and technical documentation.",
      color: "text-blue-600",
      bgGradient: "from-blue-50 to-blue-100",
      borderColor: "border-blue-200",
      stats: "98% Pass Rate",
      highlight: "Most Popular",
    },
    {
      icon: Plane,
      title: "Pilot Training",
      description:
        "Advanced flight training modules, navigation tests, and regulatory compliance for commercial and private pilots.",
      color: "text-green-600",
      bgGradient: "from-green-50 to-green-100",
      borderColor: "border-green-200",
      stats: "500+ Hours Content",
      highlight: "Premium Quality",
    },
    {
      icon: UserCheck,
      title: "Cabin Crew Excellence",
      description:
        "Safety procedures, customer service protocols, and emergency response training for cabin crew certification.",
      color: "text-purple-600",
      bgGradient: "from-purple-50 to-purple-100",
      borderColor: "border-purple-200",
      stats: "24/7 Support",
      highlight: "Expert Approved",
    },
  ];

  const pricingPlans = [
    {
      name: "Basic",
      price: "$29",
      period: "/month",
      description: "Perfect for individual study",
      features: [
        "Access to basic practice tests",
        "Progress tracking",
        "Email support",
        "Mobile app access",
      ],
      popular: false,
      icon: Sparkles,
      gradient: "from-gray-50 to-gray-100",
      borderGradient: "from-gray-200 to-gray-300",
      buttonGradient: "from-gray-800 to-gray-900",
    },
    {
      name: "Professional",
      price: "$79",
      period: "/month",
      description: "Most popular for serious candidates",
      features: [
        "All basic features",
        "Advanced simulation tests",
        "Detailed performance analytics",
        "Priority support",
        "Offline study materials",
        "Custom study plans",
      ],
      popular: true,
      icon: Zap,
      gradient: "from-green-50 to-yellow-50",
      borderGradient: "from-green-400 to-yellow-400",
      buttonGradient: "from-green-600 to-yellow-500",
    },
    {
      name: "Enterprise",
      price: "$199",
      period: "/month",
      description: "For training organizations",
      features: [
        "All professional features",
        "Multi-user management",
        "Custom branding",
        "API access",
        "Dedicated account manager",
        "Advanced reporting",
      ],
      popular: false,
      icon: Crown,
      gradient: "from-purple-50 to-blue-50",
      borderGradient: "from-purple-400 to-blue-400",
      buttonGradient: "from-purple-600 to-blue-600",
    },
  ];

  const testimonials = [
    {
      name: "Captain Tewadrose Solomon",
      role: "Senior Pilot, Ethiopian Airlines",
      content:
        "This platform helped me ace my recurrent training exams. The simulation quality is outstanding and mirrors real-world scenarios perfectly.",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b977?w=64&h=64&fit=crop&crop=face",
      backgroundImage: "/teddy.jpg",
      rating: 5,
      company: "Ethiopian Airlines",
    },
    {
      name: "Engineer Dawit Tesfaye",
      role: "AMT Supervisor",
      content:
        "The technical depth and accuracy of the AMT prep materials exceeded my expectations. My team's certification pass rate improved by 40%.",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face",
      backgroundImage:
        "https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&h=600&fit=crop",
      rating: 5,
      company: "Aviation Services",
    },
    {
      name: "Hanan Ali",
      role: "Senior Cabin Crew",
      content:
        "Comprehensive coverage of safety protocols and emergency procedures. The interactive scenarios made learning engaging and effective.",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face",
      backgroundImage: "/hostest4.jpg",
      rating: 5,
      company: "International Airways",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-yellow-500 rounded-full flex items-center justify-center">
                <Plane className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg md:text-xl font-bold text-gray-900">
                Ethio Aviators
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <a
                href="#features"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Features
              </a>
              <a
                href="#pricing"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Pricing
              </a>
              <a
                href="#testimonials"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Reviews
              </a>
            </nav>

            {/* Desktop CTA Buttons */}
            <div className="hidden md:flex space-x-4">
              <Button variant="ghost">Sign In</Button>
              <Button className="bg-gradient-to-r from-green-600 to-yellow-500 hover:from-green-700 hover:to-yellow-600">
                Get Started
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pb-4 border-t pt-4">
              <nav className="flex flex-col space-y-4">
                <a
                  href="#features"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Features
                </a>
                <a
                  href="#pricing"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Pricing
                </a>
                <a
                  href="#testimonials"
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Reviews
                </a>
                <div className="flex flex-col space-y-2 pt-4">
                  <Button variant="ghost" className="w-full">
                    Sign In
                  </Button>
                  <Button className="bg-gradient-to-r from-green-600 to-yellow-500 hover:from-green-700 hover:to-yellow-600 w-full">
                    Get Started
                  </Button>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 md:py-20 px-4">
        <div className="container mx-auto text-center max-w-6xl">
          <div className="mb-6">
            <Badge className="bg-gradient-to-r from-green-100 to-yellow-100 text-green-800 border-green-200">
              Trusted by 10,000+ Aviation Professionals
            </Badge>
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Master Your Aviation
            <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-green-600 to-yellow-500 bg-clip-text text-transparent">
              {" "}
              Exams
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed px-4">
            Comprehensive exam preparation for AMT, Pilots, and Cabin Crew. Join
            thousands of aviation professionals who trust our platform for their
            certification success.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 px-4">
            <Button
              size="lg"
              className="bg-gradient-to-r from-green-600 to-yellow-500 hover:from-green-700 hover:to-yellow-600 text-lg px-8 py-4"
            >
              Start Free Trial
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-4">
              Watch Demo
            </Button>
          </div>
          <div className="relative px-4 group cursor-pointer">
            <Image
              src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=1200&h=600&fit=crop"
              alt="Aviation professional using exam prep platform"
              width={1200}
              height={600}
              className="rounded-2xl shadow-2xl mx-auto w-full max-w-4xl transition-transform duration-300 group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>

            {/* Video Play Icon Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 md:w-24 md:h-24 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 group-hover:scale-110 group-hover:bg-white">
                <Play
                  className="w-8 h-8 md:w-10 md:h-10 text-green-600 ml-1"
                  fill="currentColor"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="py-12 md:py-20 px-4 bg-gradient-to-br from-gray-50 via-white to-gray-50"
      >
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12 md:mb-16">
            <Badge className="bg-gradient-to-r from-green-100 to-yellow-100 text-green-800 border-green-200 mb-4">
              Trusted by Industry Leaders
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Specialized Training for Every Role
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              Tailored exam preparation designed specifically for AMT, Pilots,
              and Cabin Crew with industry-standard content.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className={`group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 ${feature.borderColor} bg-gradient-to-br ${feature.bgGradient}`}
              >
                {/* Highlight Badge */}
                <div className="absolute top-4 right-4">
                  <Badge className="bg-white/80 text-gray-700 text-xs font-medium">
                    {feature.highlight}
                  </Badge>
                </div>

                {/* Animated Background Pattern */}
                <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-current to-transparent rounded-full transform translate-x-16 -translate-y-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-current to-transparent rounded-full transform -translate-x-12 translate-y-12"></div>
                </div>

                <CardHeader className="text-center relative z-10 pb-4">
                  <div
                    className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-white flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3`}
                  >
                    <feature.icon
                      className={`w-10 h-10 ${feature.color} group-hover:scale-110 transition-transform duration-300`}
                    />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900 mb-2 group-hover:text-gray-800 transition-colors">
                    {feature.title}
                  </CardTitle>
                  <div className="flex items-center justify-center space-x-2 mb-3">
                    <Star className={`w-4 h-4 ${feature.color} fill-current`} />
                    <span className={`text-sm font-semibold ${feature.color}`}>
                      {feature.stats}
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="relative z-10 pt-0">
                  <CardDescription className="text-center text-gray-700 leading-relaxed mb-6 group-hover:text-gray-800 transition-colors">
                    {feature.description}
                  </CardDescription>

                  {/* CTA Button */}
                  <div className="flex justify-center">
                    <Button
                      variant="ghost"
                      className={`group/btn ${feature.color} hover:bg-white/50 font-medium text-sm px-4 py-2 rounded-lg transition-all duration-300 hover:shadow-md`}
                    >
                      Learn More
                      <ArrowRight className="w-4 h-4 ml-2 group-hover/btn:translate-x-1 transition-transform duration-200" />
                    </Button>
                  </div>
                </CardContent>

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              </Card>
            ))}
          </div>

          {/* Additional Stats Section */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-green-500 to-yellow-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Trophy className="w-8 h-8 text-white" />
              </div>
              <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                10,000+
              </div>
              <div className="text-sm text-gray-600">
                Certified Professionals
              </div>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                99.5%
              </div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                1,500+
              </div>
              <div className="text-sm text-gray-600">Practice Questions</div>
            </div>
            <div className="text-center group">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                24/7
              </div>
              <div className="text-sm text-gray-600">Expert Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Pricing Section */}
      <section
        id="pricing"
        className="py-12 md:py-20 px-4 bg-gradient-to-br from-slate-50 via-white to-gray-50 relative overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-green-400 to-yellow-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto max-w-6xl relative">
          <div className="text-center mb-12 md:mb-16">
            <Badge className="bg-gradient-to-r from-green-100 to-yellow-100 text-green-800 border-green-200 mb-4">
              Flexible Pricing Plans
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Choose Your Perfect Plan
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto px-4">
              Flexible pricing options designed for individual professionals and
              training organizations with premium features.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {pricingPlans.map((plan, index) => (
              <Card
                key={index}
                className={`relative group transform transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl ${
                  plan.popular
                    ? "border-2 border-green-400 shadow-2xl lg:scale-105 bg-gradient-to-br from-green-50 to-yellow-50"
                    : `border-0 shadow-lg bg-gradient-to-br ${plan.gradient}`
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <Badge className="bg-gradient-to-r from-green-600 to-yellow-500 text-white px-6 py-2 text-sm font-semibold shadow-lg">
                      <Star className="w-4 h-4 mr-1 fill-current" />
                      Most Popular
                    </Badge>
                  </div>
                )}

                {/* Glow Effect */}
                <div
                  className={`absolute inset-0 rounded-xl bg-gradient-to-r ${plan.borderGradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl`}
                ></div>

                {/* Card Header */}
                <CardHeader className="text-center relative z-10 pb-4">
                  <div
                    className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${plan.buttonGradient} flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3`}
                  >
                    <plan.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </CardTitle>
                  <div className="text-5xl font-bold text-gray-900 mt-4 mb-2">
                    {plan.price}
                    <span className="text-lg text-gray-600 font-normal">
                      {plan.period}
                    </span>
                  </div>
                  <CardDescription className="text-gray-600 font-medium">
                    {plan.description}
                  </CardDescription>
                </CardHeader>

                {/* Card Content */}
                <CardContent className="relative z-10">
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className="flex items-center group/item"
                      >
                        <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center mr-3 group-hover/item:bg-green-200 transition-colors">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        </div>
                        <span className="text-gray-700 text-sm font-medium group-hover/item:text-gray-900 transition-colors">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className={`w-full h-12 text-base font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl ${
                      plan.popular
                        ? "bg-gradient-to-r from-green-600 to-yellow-500 hover:from-green-700 hover:to-yellow-600 text-white"
                        : `bg-gradient-to-r ${plan.buttonGradient} hover:shadow-2xl text-white`
                    }`}
                    size="lg"
                  >
                    Get Started Now
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>

                {/* Decorative Elements */}
                <div className="absolute top-4 right-4 opacity-20 group-hover:opacity-40 transition-opacity">
                  <div className="w-8 h-8 bg-gradient-to-br from-current to-transparent rounded-full"></div>
                </div>
                <div className="absolute bottom-4 left-4 opacity-10 group-hover:opacity-30 transition-opacity">
                  <div className="w-12 h-12 bg-gradient-to-tr from-current to-transparent rounded-full"></div>
                </div>
              </Card>
            ))}
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 text-center">
            <p className="text-gray-600 mb-6">
              Trusted by 10,000+ aviation professionals worldwide
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              <div className="text-sm font-semibold text-gray-700">
                30-Day Money Back
              </div>
              <div className="text-sm font-semibold text-gray-700">
                SSL Secured
              </div>
              <div className="text-sm font-semibold text-gray-700">
                24/7 Support
              </div>
              <div className="text-sm font-semibold text-gray-700">
                No Setup Fees
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials Section */}
      <section
        id="testimonials"
        className="py-12 md:py-20 px-4 bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden"
      >
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-green-600/20 to-yellow-500/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-full blur-3xl"></div>
        </div>

        <div className="container mx-auto max-w-6xl relative">
          <div className="text-center mb-12 md:mb-16">
            <Badge className="bg-white/10 text-white border-white/20 mb-4">
              Success Stories
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Trusted by Aviation Professionals
            </h2>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto px-4">
              See what industry professionals say about our exam preparation
              platform and their success stories.
            </p>
          </div>

          <Carousel className="max-w-5xl mx-auto">
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index}>
                  <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
                    {/* Background Image */}
                    <div className="absolute inset-0">
                      <Image
                        src={testimonial.backgroundImage}
                        alt="Aviation background"
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        sizes="100vw"
                        priority // or use `loading="lazy"` if not above the fold
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30"></div>
                      <div className="absolute inset-0 bg-gradient-to-r from-green-900/20 to-yellow-900/20"></div>
                    </div>

                    {/* Content */}
                    <div className="relative p-8 md:p-12 text-center text-white min-h-[500px] flex flex-col justify-center">
                      {/* Quote Icon */}
                      <div className="absolute top-8 left-8 opacity-20">
                        <svg
                          className="w-16 h-16 text-white"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l1.446 2.391c-2.317.688-4.446 2.173-4.446 5.218v.5h4v10h-10zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l1.446 2.391c-2.317.688-4.446 2.173-4.446 5.218v.5h4v10h-10z" />
                        </svg>
                      </div>

                      {/* Avatar and Basic Info */}
                      <div className="mb-8">
                        <div className="relative">
                          <Image
                            src={testimonial.avatar}
                            alt={testimonial.name}
                            width={96} // 24rem = 96px
                            height={96}
                            className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-white/20 shadow-2xl"
                            priority // or use loading="lazy" if not critical
                          />
                          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-5 h-5 text-white" />
                          </div>
                        </div>
                        <h3 className="text-2xl md:text-3xl font-bold mb-2">
                          {testimonial.name}
                        </h3>
                        <p className="text-white/80 text-lg mb-2">
                          {testimonial.role}
                        </p>
                        <p className="text-white/60 text-sm">
                          {testimonial.company}
                        </p>
                      </div>

                      {/* Star Rating */}
                      <div className="flex justify-center mb-6">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star
                            key={i}
                            className="w-6 h-6 text-yellow-400 fill-current"
                          />
                        ))}
                      </div>

                      {/* Quote */}
                      <blockquote className="text-xl md:text-2xl italic leading-relaxed max-w-3xl mx-auto font-light">
                        &quot; {testimonial.content}&quot;
                      </blockquote>

                      {/* Decorative Elements */}
                      <div className="absolute bottom-8 right-8 opacity-10">
                        <div className="w-24 h-24 border-2 border-white rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4 md:-left-12 bg-white/10 border-white/20 text-white hover:bg-white/20" />
            <CarouselNext className="right-4 md:-right-12 bg-white/10 border-white/20 text-white hover:bg-white/20" />
          </Carousel>

          {/* Additional Trust Indicators */}
          <div className="mt-16 text-center">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">4.9/5</div>
                <div className="text-sm text-gray-400">Average Rating</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">100%</div>
                <div className="text-sm text-gray-400">Satisfaction Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">500+</div>
                <div className="text-sm text-gray-400">Success Stories</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">24/7</div>
                <div className="text-sm text-gray-400">Expert Support</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20 px-4 bg-gradient-to-r from-green-600 to-yellow-500">
        <div className="container mx-auto text-center max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Advance Your Aviation Career?
          </h2>
          <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed px-4">
            Join thousands of professionals who have successfully passed their
            exams with our comprehensive preparation platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
            <Button
              size="lg"
              className="bg-white text-green-600 hover:bg-gray-100 text-lg px-8 py-4"
            >
              Start Your Free Trial
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-green-600 text-lg px-8 py-4"
            >
              Contact Sales
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-yellow-500 rounded-full flex items-center justify-center">
                  <Plane className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold">
                  Ethiopian Airlines Academy
                </span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Professional aviation exam preparation trusted by industry
                experts worldwide.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    API
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Documentation
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Careers
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    News
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Community
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Status
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2024 Ethiopian Airlines Academy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
