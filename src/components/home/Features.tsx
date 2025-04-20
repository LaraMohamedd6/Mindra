
import SectionHeading from "@/components/common/SectionHeading";
import FeatureCard from "@/components/common/FeatureCard";
import { motion } from "framer-motion";
import { Brain, HeartPulse, BookOpen, MessageCircle, Users, Heart, Bot, Clock } from "lucide-react";

export default function Features() {
  const features = [
    {
      icon: <Brain className="h-6 w-6" />,
      title: "Mental Health Assessment",
      description: "Take our K10 assessment to understand your current mental state."
    },
    {
      icon: <HeartPulse className="h-6 w-6" />,
      title: "Daily Wellness Activities",
      description: "Access yoga, meditation, and fitness activities designed specifically for busy student schedules."
    },
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: "Educational Resources",
      description: "Learn about mental health conditions with our evidence-based, student-friendly information hub."
    },
    {
      icon: <MessageCircle className="h-6 w-6" />,
      title: "Community Support",
      description: "Connect with peers in moderated chat rooms to share experiences and provide mutual support."
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Peer Connection",
      description: "Find and connect with students facing similar challenges through our matching system."
    },
    {
      icon: <Heart className="h-6 w-6" />,
      title: "Crisis Resources",
      description: "Immediate access to emergency resources and support when you need it most."
    },
    {
      icon: <Bot className="h-6 w-6" />,
      title: "Support Chatbot",
      description: "Get 24/7 support and guidance from our AI assistant trained in student mental health."
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Study Helper Tools",
      description: "Boost your productivity with pomodoro timers and academic planning tools."
    }
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <SectionHeading
          title="Supporting Your Mental Health Journey"
          subtitle="Discover the tools and resources designed to help students thrive"
          centered
        />

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 }
              }}
              className="h-100 d-flex" // Added Bootstrap classes
            >
              <FeatureCard
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
                className="h-100" // Pass this to FeatureCard
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
