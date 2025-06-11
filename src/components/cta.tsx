import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, Users } from "lucide-react";

const CTA = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-emerald-50 dark:from-slate-900 dark:to-emerald-900">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <Badge
            variant="secondary"
            className="mb-6 px-6 py-3 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 text-lg font-medium"
          >
            Limited Time Offer
          </Badge>

          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-800 dark:from-emerald-400 dark:via-teal-400 dark:to-emerald-300 bg-clip-text text-transparent">
            Start Your Aviation Journey Today
          </h2>

          <p className="text-xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
            Get instant access to all study materials, practice tests, and
            expert guidance. No commitment required - start with our free trial.
          </p>

          {/* Features List */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="flex items-center justify-center gap-3 p-4 bg-white/90 dark:bg-slate-800/90 rounded-lg shadow-sm border border-emerald-200/50 dark:border-emerald-700/50 backdrop-blur-sm">
              <CheckCircle className="h-5 w-5 text-emerald-500" />
              <span className="font-medium text-card-foreground">
                14-Day Free Trial
              </span>
            </div>
            <div className="flex items-center justify-center gap-3 p-4 bg-white/90 dark:bg-slate-800/90 rounded-lg shadow-sm border border-emerald-200/50 dark:border-emerald-700/50 backdrop-blur-sm">
              <Clock className="h-5 w-5 text-teal-500" />
              <span className="font-medium text-card-foreground">
                Instant Access
              </span>
            </div>
            <div className="flex items-center justify-center gap-3 p-4 bg-white/90 dark:bg-slate-800/90 rounded-lg shadow-sm border border-emerald-200/50 dark:border-emerald-700/50 backdrop-blur-sm">
              <Users className="h-5 w-5 text-emerald-600" />
              <span className="font-medium text-card-foreground">
                Expert Support
              </span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Button
              size="lg"
              className="px-12 py-4 text-lg font-semibold bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Start Free Trial Now
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="px-8 py-4 text-lg font-semibold border-2 border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
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
