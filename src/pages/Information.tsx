
import Layout from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Book, Brain, Coffee, HeartPulse, Moon, Sun } from "lucide-react";

const mentalHealthTopics = [
  {
    title: "Understanding Depression",
    icon: Brain,
    content: "Learn about signs, symptoms, and coping strategies for depression in students.",
  },
  {
    title: "Managing Anxiety",
    icon: HeartPulse,
    content: "Discover techniques to manage academic anxiety and stress.",
  },
  {
    title: "Sleep Hygiene",
    icon: Moon,
    content: "Tips for maintaining healthy sleep patterns during exam periods.",
  },
  {
    title: "Study-Life Balance",
    icon: Coffee,
    content: "Find ways to balance academic demands with personal well-being.",
  },
  {
    title: "Self-Care Practices",
    icon: Sun,
    content: "Essential self-care strategies for busy students.",
  },
  {
    title: "Academic Stress",
    icon: Book,
    content: "Understanding and managing academic pressure effectively.",
  },
];

export default function Information() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto text-center mb-12"
        >
          <h1 className="text-4xl font-display font-semibold text-gray-900 mb-4">
            Mental Health Information Hub
          </h1>
          <p className="text-lg text-gray-600">
            Access reliable information about mental health topics relevant to students.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mentalHealthTopics.map((topic, index) => (
            <motion.div
              key={topic.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="rounded-full bg-zenLightPink p-3">
                    <topic.icon className="h-6 w-6 text-zenPink" />
                  </div>
                  <CardTitle className="text-xl">{topic.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{topic.content}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
