/* eslint-disable react-hooks/rules-of-hooks */
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Check, BookOpen, Wallet } from "lucide-react";
import { Card } from "@/components/ui/card";

const features = [
  {
    title: "Smart Student Budget Tracking",
    description:
      "AI-powered expense tracking designed specifically for student life and academic expenses.",
    points: [
      "Get personalized budgeting recommendations from a smart chatbot that understands your spending habits",
      "Stay on top of your budget with a mobile-friendly app for on-the-go tracking",
      "Easily upload receipts to save time and keep accurate records",
    ],
    icon: <Wallet className="w-6 h-6 text-accent-purple" />,
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80",
  },
  {
    title: "Academic Financial Planning",
    description:
      "Plan your academic finances with smart insights and recommendations tailored for students.",
    points: [
      "View past budgets to track your progress over time",
      "Visualize spending trends with easy-to-read graphs",
      "Get personalized recommendations for your savings goals",
    ],
    icon: <BookOpen className="w-6 h-6 text-accent-blue" />,
    image:
      "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&q=80",
  },
];

const Features = () => {
  // ✅ Create refs in a separate array
  const refs = features.map(() => useRef(null));

  // ✅ Use `useInView` **individually** at the top level
  const inViewStates = refs.map((ref) =>
    useInView(ref, { once: true, margin: "-15%" })
  );

  return (
    <section className="py-24">
      <div className="container-padding">
        {/* Section Heading */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10%" }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        >
          <span className="bg-accent-purple/10 text-accent-purple px-4 py-1.5 rounded-full text-sm font-medium">
            FEATURES
          </span>
          <h2 className="heading-lg mt-6">Smart Budgeting for Students</h2>
          <p className="text-neutral-600 mt-4 max-w-2xl mx-auto">
            AI-powered tools to help you manage your academic expenses and
            achieve your educational goals.
          </p>
        </motion.div>

        {/* Features List */}
        {features.map((feature, index) => {
          return (
            <motion.div
              ref={refs[index]} // ✅ Pass ref
              key={feature.title}
              className={`flex flex-col md:flex-row gap-12 items-center mb-24 ${
                index % 2 === 1 ? "md:flex-row-reverse" : ""
              }`}
              initial={{ opacity: 0, y: 80 }}
              animate={inViewStates[index] ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1.2, ease: "easeInOut" }}
            >
              {/* Left Content */}
              <motion.div
                className="flex-1"
                transition={{ duration: 1.2, delay: 0.3 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  {feature.icon}
                  <h3 className="text-2xl font-bold">{feature.title}</h3>
                </div>
                <p className="text-neutral-600 mb-6">{feature.description}</p>
                <ul className="space-y-4">
                  {feature.points.map((point, idx) => (
                    <motion.li
                      key={point}
                      className="flex items-center gap-3"
                      transition={{ duration: 1.2, delay: 0.5 + idx * 0.2 }}
                    >
                      <div className="w-5 h-5 rounded-full bg-accent-purple/10 flex items-center justify-center">
                        <Check className="w-3 h-3 text-accent-purple" />
                      </div>
                      {point}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              {/* Right Image */}
              <motion.div
                className="flex-1"
                transition={{ duration: 1.2, delay: 0.6 }}
              >
                <Card className="glass-panel p-6 rounded-2xl overflow-hidden">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover rounded-lg aspect-video"
                  />
                </Card>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default Features;
