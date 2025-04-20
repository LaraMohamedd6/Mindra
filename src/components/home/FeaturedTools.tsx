
import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Brain, 
  Calendar, 
  Heart, 
  MessageSquare, 
  Timer, 
  Smile, 
  MoonStar, 
  ArrowRight,
  BookOpen,
  PenLine
} from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import SectionHeading from "@/components/common/SectionHeading";
import { cn } from "@/lib/utils";

export default function FeaturedTools() {
  const [activeTab, setActiveTab] = useState('wellness');
  
  const tools = {
    wellness: [
      {
        icon: <MoonStar className="h-7 w-7" />,
        title: "Meditation",
        description: "Guided practices to reduce stress and improve focus",
        link: "/meditation",
        color: "bg-gradient-to-br from-indigo-100 to-purple-50 text-indigo-600"
      },
      {
        icon: <Heart className="h-7 w-7" />,
        title: "Yoga",
        description: "Simple poses designed for small spaces",
        link: "/yoga",
        color: "bg-gradient-to-br from-purple-100 to-pink-50 text-pink-600"
      },
      {
        icon: <Brain className="h-7 w-7" />,
        title: "K10 Assessment",
        description: "Evaluate your current mental health status",
        link: "/k10test",
        color: "bg-gradient-to-br from-blue-100 to-cyan-50 text-blue-600"
      }
    ],
    social: [
      {
        icon: <MessageSquare className="h-7 w-7" />,
        title: "Peer Support",
        description: "Connect with others facing similar challenges",
        link: "/ChatRoom",
        color: "bg-gradient-to-br from-teal-100 to-cyan-50 text-teal-600"
      },
      {
        icon: <Smile className="h-7 w-7" />,
        title: "Mood Tracker",
        description: "Monitor your emotional wellbeing over time",
        link: "/mood-tracker",
        color: "bg-gradient-to-br from-orange-100 to-amber-50 text-orange-600"
      },
      {
        icon: <BookOpen className="h-7 w-7" />,
        title: "Journal",
        description: "Express and process your thoughts and feelings",
        link: "/profile",
        color: "bg-gradient-to-br from-sky-100 to-blue-50 text-sky-600"
      }
    ]
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <SectionHeading 
          title="Tools for Your Wellbeing" 
          subtitle="Explore our collection of resources designed for student life"
          centered
        />

        {/* Tab Navigation */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex rounded-lg bg-white p-1 shadow-sm">
            {[
              { id: 'wellness', label: 'Wellness Tools' },
              { id: 'social', label: 'Social & Emotional' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "px-4 py-2 rounded-md text-sm font-medium transition-all",
                  activeTab === tab.id 
                    ? "bg-zenSage text-white shadow-sm" 
                    : "text-gray-600 hover:text-gray-900"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tool Cards */}
        <motion.div 
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {tools[activeTab].map((tool, index) => (
            <Link to={tool.link} key={index}>
              <Card className="h-full hover:shadow-md transition-shadow duration-300">
                <CardContent className="pt-6">
                  <div className={cn("w-14 h-14 rounded-full flex items-center justify-center mb-4", tool.color)}>
                    {tool.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{tool.title}</h3>
                  <p className="text-gray-600">{tool.description}</p>
                </CardContent>
                <CardFooter className="pt-2 pb-6">
                  <span className="text-zenSage font-medium flex items-center">
                    Try it now <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
