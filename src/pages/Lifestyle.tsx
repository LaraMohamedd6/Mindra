import Layout from "@/components/layout/Layout";
import { motion } from "framer-motion";
import SectionHeading from "@/components/common/SectionHeading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Apple, Clock, Coffee, Moon, Sun, Brain, Calendar, CheckCircle2, MessageSquare, Leaf, Activity, HeartPulse, Laugh, Users, BookOpen, RefreshCw } from "lucide-react";
import { useRef, useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import lifestyleBanner from "@/assets/images/free.jpg";


export default function Lifestyle() {
  const dailyRoutineRef = useRef(null);
  const [completedRoutines, setCompletedRoutines] = useState([]);
  const [showCongrats, setShowCongrats] = useState(false);
  const { toast } = useToast();

  // Load completed routines from localStorage on component mount
  useEffect(() => {
    const savedRoutines = localStorage.getItem('completedRoutines');
    if (savedRoutines) {
      setCompletedRoutines(JSON.parse(savedRoutines));
    }
  }, []);

  // Save completed routines to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('completedRoutines', JSON.stringify(completedRoutines));

    // Check if all routines are completed
    if (completedRoutines.length === dailyRoutineTips.length) {
      setShowCongrats(true);
      toast({
        title: "🎉 Congratulations!",
        description: "You've completed your daily routine!",
        duration: 5000,
      });
    } else {
      setShowCongrats(false);
    }
  }, [completedRoutines, toast]);

  const scrollToRoutine = () => {
    dailyRoutineRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const dailyRoutineTips = [
    {
      id: 1,
      time: "6:00 - 7:00 AM",
      title: "Morning Routine",
      description: "Wake up consistently at the same time every day, even on weekends. Have a glass of water, do some light stretching, and get natural sunlight exposure.",
      icon: <Sun className="h-5 w-5" />,
      color: "text-amber-500",
      bgColor: "bg-amber-100",
      timeColor: "bg-amber-100 text-amber-800"
    },
    {
      id: 2,
      time: "7:00 - 8:00 AM",
      title: "Breakfast & Planning",
      description: "Eat a balanced breakfast with protein. Review your day's schedule and set 3 main goals for the day.",
      icon: <Coffee className="h-5 w-5" />,
      color: "text-brown-500",
      bgColor: "bg-amber-50",
      timeColor: "bg-amber-50 text-amber-800"
    },
    {
      id: 3,
      time: "8:00 AM - 12:00 PM",
      title: "Focus Block",
      description: "Schedule your most challenging cognitive work during your morning peak concentration hours. Take a 5-minute break every 25-30 minutes.",
      icon: <Brain className="h-5 w-5" />,
      color: "text-indigo-500",
      bgColor: "bg-indigo-100",
      timeColor: "bg-indigo-100 text-indigo-800"
    },
    {
      id: 4,
      time: "12:00 - 1:00 PM",
      title: "Lunch Break",
      description: "Step away from your desk for lunch. Eat mindfully without screens. Consider a short walk to refresh your mind.",
      icon: <Apple className="h-5 w-5" />,
      color: "text-emerald-500",
      bgColor: "bg-emerald-100",
      timeColor: "bg-emerald-100 text-emerald-800"
    },
    {
      id: 5,
      time: "1:00 - 5:00 PM",
      title: "Afternoon Work",
      description: "Schedule collaborative or less intense work for the afternoon. Have healthy snacks available to maintain energy.",
      icon: <Calendar className="h-5 w-5" />,
      color: "text-blue-500",
      bgColor: "bg-blue-100",
      timeColor: "bg-blue-100 text-blue-800"
    },
    {
      id: 6,
      time: "5:00 - 7:00 PM",
      title: "Exercise & Dinner",
      description: "Get at least 30 minutes of physical activity and eat dinner at least 2-3 hours before bedtime.",
      icon: <CheckCircle2 className="h-5 w-5" />,
      color: "text-pink-500",
      bgColor: "bg-pink-100",
      timeColor: "bg-pink-100 text-pink-800"
    },
    {
      id: 7,
      time: "7:00 - 9:00 PM",
      title: "Wind Down",
      description: "Review tomorrow's schedule. Engage in relaxing activities like reading or journaling. Avoid screens 1 hour before bed.",
      icon: <Moon className="h-5 w-5" />,
      color: "text-purple-500",
      bgColor: "bg-purple-100",
      timeColor: "bg-purple-100 text-purple-800"
    },
  ];

  const toggleRoutineCompletion = (id) => {
    if (completedRoutines.includes(id)) {
      setCompletedRoutines(completedRoutines.filter(routineId => routineId !== id));
    } else {
      const prevRoutine = dailyRoutineTips.find(r => r.id === id - 1);
      if (id === 1 || (prevRoutine && completedRoutines.includes(prevRoutine.id))) {
        setCompletedRoutines([...completedRoutines, id]);
      }
    }
  };

  const resetRoutines = () => {
    setCompletedRoutines([]);
    toast({
      title: "Routine Reset",
      description: "Your daily routine has been reset for a new day!",
      duration: 3000,
    });
  };

  // Calculate progress percentage for the timeline
  const progressPercentage = (completedRoutines.length / dailyRoutineTips.length) * 100;
  // Calculate color intensity based on progress
  const colorIntensity = Math.min(0.2 + (progressPercentage / 100) * 0.8, 1);

  const lifestylePillars = [
    {
      title: "Physical Health",
      icon: <Activity className="h-6 w-6" />,
      description: "Regular exercise, proper nutrition, and adequate sleep form the foundation of physical wellbeing.",
      tips: [
        "Aim for 7-9 hours of quality sleep each night",
        "Incorporate both cardio and strength training weekly",
        "Stay hydrated throughout the day"
      ],
      bgColor: "bg-gradient-to-br from-blue-50 to-blue-100",
      borderColor: "border-blue-200",
      iconColor: "text-blue-500"
    },
    {
      title: "Mental Wellbeing",
      icon: <Brain className="h-6 w-6" />,
      description: "Managing stress and maintaining cognitive health are crucial for overall balance.",
      tips: [
        "Practice mindfulness or meditation daily",
        "Take regular breaks from digital devices",
        "Engage in activities that challenge your mind"
      ],
      bgColor: "bg-gradient-to-br from-purple-50 to-purple-100",
      borderColor: "border-purple-200",
      iconColor: "text-purple-500"
    },
    {
      title: "Emotional Balance",
      icon: <Laugh className="h-6 w-6" />,
      description: "Understanding and processing emotions leads to greater resilience and happiness.",
      tips: [
        "Keep a gratitude journal",
        "Allow yourself to experience all emotions without judgment",
        "Develop healthy coping mechanisms"
      ],
      bgColor: "bg-gradient-to-br from-pink-50 to-pink-100",
      borderColor: "border-pink-200",
      iconColor: "text-pink-500"
    },
    {
      title: "Social Connections",
      icon: <Users className="h-6 w-6" />,
      description: "Meaningful relationships contribute significantly to our overall wellbeing.",
      tips: [
        "Nurture important relationships regularly",
        "Set healthy boundaries in relationships",
        "Seek out communities with shared interests"
      ],
      bgColor: "bg-gradient-to-br from-green-50 to-green-100",
      borderColor: "border-green-200",
      iconColor: "text-green-500"
    },
    {
      title: "Personal Growth",
      icon: <BookOpen className="h-6 w-6" />,
      description: "Continuous learning and self-improvement bring fulfillment and purpose.",
      tips: [
        "Set aside time for learning new skills",
        "Regularly reassess your goals and values",
        "Step outside your comfort zone periodically"
      ],
      bgColor: "bg-gradient-to-br from-amber-50 to-amber-100",
      borderColor: "border-amber-200",
      iconColor: "text-amber-500"
    },
    {
      title: "Environmental Harmony",
      icon: <Leaf className="h-6 w-6" />,
      description: "Your surroundings significantly impact your mental and physical state.",
      tips: [
        "Create an organized, clutter-free living space",
        "Spend time in nature regularly",
        "Make your workspace ergonomic and pleasant"
      ],
      bgColor: "bg-gradient-to-br from-emerald-50 to-emerald-100",
      borderColor: "border-emerald-200",
      iconColor: "text-emerald-500"
    }
  ];

  const healthyHabits = [
    {
      title: "Regular Sleep Schedule",
      description: "Go to bed and wake up at consistent times, even on weekends.",
      tip: "Use the 'Bedtime' feature on your phone to set sleep reminders."
    },
    {
      title: "Hydration Routine",
      description: "Keep a water bottle with you and refill it throughout the day.",
      tip: "Add fruit or herbs for flavor if plain water is unappealing."
    },
    {
      title: "Digital Boundaries",
      description: "Set times to disconnect from devices, especially before sleep.",
      tip: "Try the 'Do Not Disturb' mode during focused work and sleeping hours."
    },
    {
      title: "Movement Breaks",
      description: "Take short movement breaks between long periods of sitting.",
      tip: "Set a timer for every 45-60 minutes as a reminder to stand and stretch."
    },
    {
      title: "Social Connections",
      description: "Maintain regular contact with supportive friends and family.",
      tip: "Schedule regular check-ins even during busy periods."
    },
    {
      title: "Mindful Eating",
      description: "Pay attention to what and how you eat without distractions.",
      tip: "Try eating one meal a day without screens to start."
    },
  ];

  return (
    <Layout>
      {/* Hero Section with Left-Aligned Content */}
      <section className="relative">
        <div className="relative h-[500px] md:h-[600px] overflow-hidden">
          <img
            src={lifestyleBanner}
            alt="Healthy lifestyle"
            className="w-full h-full object-cover blur-[2px]"
          />
          {/* Remove flex centering and use absolute positioning for left alignment */}
          <div className="absolute inset-0 bg-black/30"> {/* Added overlay for better text readability */}
            <div className="absolute top-1/2 transform -translate-y-1/2 px-8 md:px-16 max-w-2xl">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-4xl md:text-5xl font-display font-bold text-white mb-4"
              >
                Balanced Lifestyle
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-xl text-white mb-6"
              >
                Reclaim balance in our fast-paced world with evidence-based approaches to sleep, nutrition, movement, and mindfulness tailored for real, busy lives
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Button
                  className="bg-zenSage hover:bg-zenSage/90 text-white text-lg py-6 px-8 rounded-full shadow-lg hover:scale-105 transition-transform"
                  onClick={scrollToRoutine}
                >
                  Start Healthy Habits
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Daily Routines Section */}
      <section className="py-14 bg-white" ref={dailyRoutineRef}>
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Daily Routine Guide"
            subtitle="Structure your day for optimal wellbeing and productivity"
          />

          <div className="relative">
            {/* Timeline line with animated progress and dynamic color */}
            <div className="absolute left-1/2 top-0 h-full w-1.5 bg-gray-200/50 transform -translate-x-1/2 hidden md:block rounded-full">
              <motion.div
                className="absolute top-0 left-0 w-full h-full origin-top rounded-full"
                style={{
                  background: `linear-gradient(to bottom, 
                    rgba(79, 190, 157, ${colorIntensity * 0.7}), 
                    rgba(79, 190, 157, ${colorIntensity}))`
                }}
                initial={{ scaleY: 0 }}
                animate={{
                  scaleY: progressPercentage / 100,
                  transition: { duration: 0.8, ease: "easeOut" }
                }}
              />
            </div>

            <div className="space-y-8">
              {dailyRoutineTips.map((routine, idx) => {
                const isCompleted = completedRoutines.includes(routine.id);
                const allPreviousCompleted = dailyRoutineTips
                  .slice(0, idx)
                  .every(prevRoutine => completedRoutines.includes(prevRoutine.id));
                const isClickable = idx === 0 || allPreviousCompleted;

                return (
                  <motion.div
                    key={routine.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className="relative group"
                  >
                    <div className={`md:w-1/2 ${idx % 2 === 0 ? 'md:pr-12 md:ml-0' : 'md:pl-12 md:ml-auto'}`}>
                      <motion.div
                        className={`bg-white rounded-xl shadow-sm p-6 relative z-10 transition-all duration-300 ${isClickable ? 'cursor-pointer hover:bg-gray-50' : 'cursor-not-allowed opacity-80'}`}
                        onClick={() => isClickable && toggleRoutineCompletion(routine.id)}
                        whileHover={isClickable ? { scale: 1.02 } : {}}
                      >
                        <div className="flex items-center mb-3">
                          <div className={`p-2 rounded-full mr-3 ${routine.bgColor}`}>
                            {routine.icon}
                          </div>
                          <h3 className="font-semibold text-lg">{routine.title}</h3>
                        </div>
                        <div className="mb-3">
                          <span className={`text-sm px-3 py-1 rounded-full ${routine.timeColor}`}>
                            {routine.time}
                          </span>
                        </div>
                        <p className="text-gray-600">{routine.description}</p>
                      </motion.div>
                    </div>

                    {/* Timeline circle marker - fixed position with animation */}
                    <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-6 h-6 z-20 hidden md:block">
                      <motion.div
                        className={`w-full h-full rounded-full flex items-center justify-center ${isCompleted ? 'bg-zenSage border-zenSage' : 'bg-white border-2 border-gray-300'} shadow-md`}
                        whileHover={isClickable ? { scale: 1.1 } : {}}
                        onClick={(e) => {
                          e.stopPropagation();
                          isClickable && toggleRoutineCompletion(routine.id);
                        }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {isCompleted && (
                          <motion.svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 0.5 }}
                          >
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </motion.svg>
                        )}
                      </motion.div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Congratulations Message */}
          {showCongrats && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mt-12 bg-gradient-to-r from-zenSage/10 to-zenMint/10 p-8 rounded-2xl border border-zenSage/30 text-center"
            >
              <div className="max-w-2xl mx-auto">
                <div className="text-6xl mb-4">🎉</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Daily Routine Complete!</h3>
                <p className="text-gray-600 mb-6">Congratulations on completing all your daily routines! You're doing amazing work for your wellbeing.</p>
                <Button
                  onClick={resetRoutines}
                  variant="outline"
                  className="border-zenSage text-zenSage hover:bg-zenSage/10"
                >
                  <RefreshCw className="h-4 w-4 mr-2" /> Reset for Tomorrow
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Lifestyle Balance Section - Updated with colorful cards */}
      <section className="py-14 bg-gradient-to-br from-zenSeafoam/20 to-white">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Pillars of Balanced Lifestyle"
            subtitle="Key areas to focus on for holistic wellbeing"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {lifestylePillars.map((pillar, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={`rounded-2xl overflow-hidden border ${pillar.borderColor} shadow-sm hover:shadow-md transition-all`}
              >
                <div className={`h-full ${pillar.bgColor} p-6`}>
                  <div className="flex flex-col items-center text-center mb-6">
                    <div className="bg-white/50 p-3 rounded-full mb-4">
                      <div className={pillar.iconColor}>
                        {pillar.icon}
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">{pillar.title}</h3>
                    <p className="text-gray-600 mb-4">{pillar.description}</p>
                  </div>
                  <ul className="space-y-3">
                    {pillar.tips.map((tip, tipIdx) => (
                      <li key={tipIdx} className="flex items-start">
                        <div className="bg-white/50 p-1 rounded-full mr-3 mt-1 flex-shrink-0">
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </div>
                        <span className="text-gray-700">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Healthy Habits Section */}
      <section className="py-14 bg-white">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Sustainable Healthy Habits"
            subtitle="Small changes that make a big difference"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {healthyHabits.map((habit, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all"
              >
                <div className="h-2 bg-gradient-to-r from-zenPink to-zenSeafoam"></div>
                <div className="p-6">
                  <h3 className="font-semibold text-lg mb-3">{habit.title}</h3>
                  <p className="text-gray-600 mb-4">{habit.description}</p>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm flex items-start">
                      <MessageSquare className="h-4 w-4 text-zenSage mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600 italic">{habit.tip}</span>
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Food Tips Section - Updated with smaller image */}
      <section className="py-14 bg-gradient-to-br from-zenMint/30 to-white">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Nutrition for Wellbeing"
            subtitle="Simple and affordable eating strategies for balanced living"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="rounded-xl overflow-hidden h-full flex items-center">
              <img
                src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                alt="Healthy meal preparation"
                className="w-full h-auto max-h-[350px] object-cover"
              />
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-4">Nutritious Foods for Energy</h3>
              <ScrollArea className="h-64 pr-4">
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="bg-zenMint p-1 rounded-full mr-3 mt-1">
                      <Apple className="h-4 w-4 text-zenSage" />
                    </div>
                    <div>
                      <h4 className="font-medium">Leafy Greens</h4>
                      <p className="text-sm text-gray-600">Packed with vitamins and minerals. Add spinach or kale to smoothies for an easy nutrient boost.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-zenMint p-1 rounded-full mr-3 mt-1">
                      <Apple className="h-4 w-4 text-zenSage" />
                    </div>
                    <div>
                      <h4 className="font-medium">Nuts and Seeds</h4>
                      <p className="text-sm text-gray-600">Great sources of healthy fats and protein. Keep a mix handy for quick, satisfying snacks.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-zenMint p-1 rounded-full mr-3 mt-1">
                      <Apple className="h-4 w-4 text-zenSage" />
                    </div>
                    <div>
                      <h4 className="font-medium">Whole Grains</h4>
                      <p className="text-sm text-gray-600">Provide sustained energy. Choose quinoa, brown rice, or whole wheat options.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-zenMint p-1 rounded-full mr-3 mt-1">
                      <Apple className="h-4 w-4 text-zenSage" />
                    </div>
                    <div>
                      <h4 className="font-medium">Lean Proteins</h4>
                      <p className="text-sm text-gray-600">Essential for muscle repair and satiety. Include fish, poultry, beans, or tofu in meals.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-zenMint p-1 rounded-full mr-3 mt-1">
                      <Apple className="h-4 w-4 text-zenSage" />
                    </div>
                    <div>
                      <h4 className="font-medium">Colorful Vegetables</h4>
                      <p className="text-sm text-gray-600">Different colors provide different nutrients. Aim for variety throughout the week.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-zenMint p-1 rounded-full mr-3 mt-1">
                      <Apple className="h-4 w-4 text-zenSage" />
                    </div>
                    <div>
                      <h4 className="font-medium">Healthy Fats</h4>
                      <p className="text-sm text-gray-600">Avocados, olive oil, and fatty fish support brain health and hormone production.</p>
                    </div>
                  </li>
                </ul>
              </ScrollArea>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}