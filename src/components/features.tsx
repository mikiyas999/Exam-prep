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
    <section id="features" className="py-20 bg-background dark:bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <Badge variant="secondary" className="mb-4 px-4 py-2">
            Key Features
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Why Choose AviationPro?
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            We offer a comprehensive and modern approach to aviation training,
            ensuring you receive the best possible education and preparation for
            your career.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="bg-secondary/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-xl">
                  {feature.title} {feature.icon}
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
