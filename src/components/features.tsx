import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Features = () => {
  const features = [
    {
      title: "Expert Instructors",
      description:
        "Learn from certified aviation professionals with years of experience",
      icon: "✈️",
    },
    {
      title: "Modern Aircraft",
      description:
        "Train on state-of-the-art aircraft with the latest avionics",
      icon: "🛩️",
    },
    {
      title: "Flexible Scheduling",
      description: "Choose training times that work with your schedule",
      icon: "📅",
    },
    {
      title: "Safety First",
      description: "Comprehensive safety training and protocols",
      icon: "🛡️",
    },
  ];

  return (
    <section
      id="features"
      className="py-20 bg-gradient-to-br from-slate-50 to-emerald-50 dark:from-slate-900 dark:to-emerald-900"
    >
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge
            variant="secondary"
            className="mb-6 px-6 py-3 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 text-lg font-medium"
          >
            Key Features
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-800 dark:from-emerald-400 dark:via-teal-400 dark:to-emerald-300 bg-clip-text text-transparent">
            Why Choose AviationPro?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            We offer a comprehensive and modern approach to aviation training,
            ensuring you receive the best possible education and preparation for
            your career.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border border-emerald-200/50 dark:border-emerald-700/50 hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
                  <span>{feature.icon}</span>
                  {feature.title}
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  {feature.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* You can add more content here if needed */}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
