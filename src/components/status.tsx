import { Badge } from "@/components/ui/badge";

const Stats = () => {
  const stats = [
    {
      number: "10,000+",
      label: "Successful Students",
      description: "Students who achieved their aviation dreams",
    },
    {
      number: "95%",
      label: "Success Rate",
      description: "Of our students pass on their first attempt",
    },
    {
      number: "50+",
      label: "Expert Instructors",
      description: "Certified aviation professionals",
    },
    {
      number: "24/7",
      label: "Support Available",
      description: "Round-the-clock assistance and guidance",
    },
  ];

  return (
    <section
      id="stats"
      className="py-20 bg-gradient-to-br from-blue-600 via-green-600 to-yellow-500 dark:from-blue-800 dark:via-green-800 dark:to-yellow-700 text-white relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-black/10 dark:bg-black/20"></div>
      <div className="absolute inset-0 opacity-30">
        <div className="w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:60px_60px]"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <Badge
            variant="secondary"
            className="mb-4 px-4 py-2 bg-white/20 text-white border-white/30"
          >
            Our Impact
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Trusted by Thousands of Aspiring Aviators
          </h2>
          <p className="text-xl text-white/90 max-w-3xl mx-auto">
            Join a community of successful aviation professionals who started
            their journey with us.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 group-hover:bg-white/20 transition-all duration-300 group-hover:scale-105">
                <div className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                  {stat.number}
                </div>
                <div className="text-xl font-semibold mb-2 text-white/95">
                  {stat.label}
                </div>
                <div className="text-sm text-white/80 leading-relaxed">
                  {stat.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
