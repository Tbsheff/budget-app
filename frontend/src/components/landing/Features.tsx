import { Check, BookOpen, ChartBar, Wallet } from "lucide-react";
import { Card } from "@/components/ui/card";

const Features = () => {
  const features = [
    {
      title: "Smart Student Budget Tracking",
      description: "AI-powered expense tracking designed specifically for student life and academic expenses.",
      points: ["Textbook & Course Material Tracking", "Meal Plan Optimization", "Student Housing Expenses"],
      icon: <Wallet className="w-6 h-6 text-accent-purple" />,
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80"
    },
    {
      title: "Academic Financial Planning",
      description: "Plan your academic finances with smart insights and recommendations tailored for students.",
      points: ["Scholarship Deadline Reminders", "Financial Aid Planning", "Course Budget Calculator"],
      icon: <BookOpen className="w-6 h-6 text-accent-blue" />,
      image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&q=80"
    }
  ];

  return (
    <section className="py-24">
      <div className="container-padding">
        <div className="text-center mb-16">
          <span className="bg-accent-purple/10 text-accent-purple px-4 py-1.5 rounded-full text-sm font-medium">
            FEATURES
          </span>
          <h2 className="heading-lg mt-6">Smart Budgeting for Students</h2>
          <p className="text-neutral-600 mt-4 max-w-2xl mx-auto">
            AI-powered tools to help you manage your academic expenses and achieve your educational goals.
          </p>
        </div>

        {features.map((feature, index) => (
          <div key={feature.title} className={`flex flex-col md:flex-row gap-12 items-center mb-24 ${index % 2 === 1 ? 'md:flex-row-reverse' : ''}`}>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                {feature.icon}
                <h3 className="text-2xl font-bold">{feature.title}</h3>
              </div>
              <p className="text-neutral-600 mb-6">{feature.description}</p>
              <ul className="space-y-4">
                {feature.points.map((point) => (
                  <li key={point} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-accent-purple/10 flex items-center justify-center">
                      <Check className="w-3 h-3 text-accent-purple" />
                    </div>
                    {point}
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <button className="button-primary">Start Free Trial</button>
              </div>
            </div>
            <div className="flex-1">
              <Card className="glass-panel p-6 rounded-2xl overflow-hidden">
                <img 
                  src={feature.image} 
                  alt={feature.title}
                  className="w-full h-full object-cover rounded-lg aspect-video"
                />
              </Card>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;