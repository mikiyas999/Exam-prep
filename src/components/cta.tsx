import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, Users } from "lucide-react";

const CTA = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Badge variant="secondary" className="mb-6 px-4 py-2">
            Limited Time Offer
          </Badge>

          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Start Your Aviation Journey Today
          </h2>

          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Get instant access to all study materials, practice tests, and
            expert guidance. No commitment required - start with our free trial.
          </p>

          {/* Features List */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="flex items-center justify-center gap-3 p-4 bg-card rounded-lg shadow-sm border border-border">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="font-medium text-card-foreground">
                14-Day Free Trial
              </span>
            </div>
            <div className="flex items-center justify-center gap-3 p-4 bg-card rounded-lg shadow-sm border border-border">
              <Clock className="h-5 w-5 text-blue-500" />
              <span className="font-medium text-card-foreground">
                Instant Access
              </span>
            </div>
            <div className="flex items-center justify-center gap-3 p-4 bg-card rounded-lg shadow-sm border border-border">
              <Users className="h-5 w-5 text-purple-500" />
              <span className="font-medium text-card-foreground">
                Expert Support
              </span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Button
              size="lg"
              className="px-12 py-4 text-lg font-semibold bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Start Free Trial Now
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="px-8 py-4 text-lg font-semibold border-2"
            >
              Schedule Demo Call
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="text-sm text-muted-foreground">
            <p className="mb-2">
              ✅ No credit card required • ✅ Cancel anytime • ✅ Full access to
              all features
            </p>
            <p className="text-xs">
              Join 10,000+ students who are already preparing for success
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;
