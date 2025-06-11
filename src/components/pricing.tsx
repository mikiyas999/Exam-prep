import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, Star } from "lucide-react";

const Pricing = () => {
  const plans = [
    {
      name: "Basic",
      price: "$29",
      period: "month",
      description: "Perfect for getting started with your aviation career",
      features: [
        "Access to 1 exam prep course",
        "Basic study materials",
        "Email support",
        "Progress tracking",
        "Mobile app access",
      ],
      popular: false,
      buttonText: "Get Started",
      buttonVariant: "outline" as const,
    },
    {
      name: "Professional",
      price: "$59",
      period: "month",
      description: "Most popular choice for serious aviation students",
      features: [
        "Access to all exam prep courses",
        "Premium study materials",
        "Priority support",
        "Advanced progress analytics",
        "Mobile app access",
        "Practice simulations",
        "1-on-1 mentoring session",
      ],
      popular: true,
      buttonText: "Start Free Trial",
      buttonVariant: "default" as const,
    },
    {
      name: "Enterprise",
      price: "$99",
      period: "month",
      description: "For aviation schools and training organizations",
      features: [
        "Everything in Professional",
        "Unlimited student accounts",
        "Custom branding",
        "API access",
        "Dedicated account manager",
        "Custom reporting",
        "Bulk pricing discounts",
        "LMS integration",
      ],
      popular: false,
      buttonText: "Contact Sales",
      buttonVariant: "outline" as const,
    },
  ];

  return (
    <section
      id="pricing"
      className="py-20 bg-gradient-to-br from-slate-50 to-emerald-50 dark:from-slate-900 dark:to-slate-800"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <Badge
              variant="secondary"
              className="mb-6 px-6 py-3 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 text-lg font-medium"
            >
              Choose Your Plan
            </Badge>

            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-600 dark:from-emerald-400 dark:via-teal-400 dark:to-emerald-400 bg-clip-text text-transparent">
              Flexible Pricing Plans
            </h2>

            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Choose the perfect plan for your aviation training journey. All
              plans include our comprehensive exam preparation materials and
              expert support.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, index) => (
              <Card
                key={index}
                className={`relative overflow-hidden transition-all duration-300 hover:shadow-xl ${
                  plan.popular
                    ? "border-2 border-emerald-500 dark:border-emerald-400 shadow-lg scale-105"
                    : "border border-border hover:scale-105"
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-center py-2 text-sm font-medium">
                    <Star className="inline w-4 h-4 mr-1" />
                    Most Popular
                  </div>
                )}

                <CardHeader
                  className={`text-center ${plan.popular ? "pt-12" : "pt-6"}`}
                >
                  <CardTitle className="text-2xl font-bold text-foreground">
                    {plan.name}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {plan.description}
                  </CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-foreground">
                      {plan.price}
                    </span>
                    <span className="text-muted-foreground">
                      /{plan.period}
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className="flex items-center gap-3"
                      >
                        <Check className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                        <span className="text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter>
                  <Button
                    variant={plan.buttonVariant}
                    className={`w-full py-3 text-lg font-semibold ${
                      plan.popular
                        ? "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl"
                        : ""
                    }`}
                  >
                    {plan.buttonText}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* Additional Info */}
          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">
              All plans include a 14-day free trial. Cancel anytime, no
              questions asked.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500" />
                No setup fees
              </span>
              <span className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500" />
                Cancel anytime
              </span>
              <span className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-500" />
                24/7 support
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
