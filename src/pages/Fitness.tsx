import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Layout from "@/components/layout/Layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dumbbell,
  Clock,
  Flame,
  Check,
  FilterX,
  Timer,
  Heart,
  Play,
  X,
  CheckCircle,
  RotateCcw,
  Activity,
  ChevronRight,
  Quote
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import fitnessbanner from "@/assets/images/fitness.png";
import busyStudentImg from '../assets/images/busy_student.webp';
const colors = {
  lightPink: "#F8E8E9",
  coral: "#E69EA2",
  peach: "#FEC0B3",
  mint: "#CFECE0",
  teal: "#7CAE9E",
  lightGreen: "#EBFFF5",
  deepTeal: "#2D7D7D",
  slate: "#4A5568",
  darkSlate: "#2D3748"
};

interface WorkoutCardProps {
  title: string;
  level: string;
  duration: string;
  calories: string;
  equipment: string[];
  image: string;
  benefits: string[];
  videoId?: string;
}

const WorkoutCard = ({ title, level, duration, calories, equipment, image, benefits, videoId }: WorkoutCardProps) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <motion.div
        whileHover={{ y: -5 }}
        className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all h-full flex flex-col border border-[#F8E8E9]"
        onClick={() => setShowModal(true)}
      >
        <div className="relative">
          <AspectRatio ratio={16 / 9}>
            <img src={image} alt={title} className="object-cover w-full h-full" />
            <div className="absolute inset-0 bg-black/30 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
              <div className="rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/40 text-white p-3">
                <Play size={24} className="fill-white" />
              </div>
            </div>
          </AspectRatio>
          <Badge
            variant="outline"
            className={`absolute top-2 left-2 ${level === "Beginner" ? "border-[#7CAE9E] text-[#7CAE9E]" :
              level === "Intermediate" ? "border-[#FEC0B3] text-[#FEC0B3]" :
                "border-[#E69EA2] text-[#E69EA2]"
              }`}
          >
            {level}
          </Badge>
        </div>
        <div className="p-6 flex-grow">
          <h3 className="text-xl font-semibold mb-3 text-gray-800">{title}</h3>
          <div className="flex items-center text-gray-500 text-sm gap-4 mb-4">
            <div className="flex items-center">
              <Clock size={14} className="mr-1" />
              <span>{duration}</span>
            </div>
            <div className="flex items-center">
              <Flame size={14} className="mr-1" />
              <span>{calories}</span>
            </div>
          </div>
          <div className="mb-4">
            <p className="text-xs text-gray-500 mb-2">EQUIPMENT NEEDED:</p>
            <div className="flex flex-wrap gap-1">
              {equipment.map((item, index) => (
                <Badge key={index} variant="secondary" className="bg-[#F8E8E9] text-gray-700">
                  {item}
                </Badge>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-2">BENEFITS:</p>
            <ul className="text-sm text-gray-700 space-y-1">
              {benefits.slice(0, 3).map((benefit, index) => (
                <li key={index} className="flex items-start">
                  <Check size={14} className="text-[#7CAE9E] mr-2 mt-0.5 flex-shrink-0" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="px-6 pb-6">
          <Button className="w-full bg-[#E69EA2] hover:bg-[#E69EA2]/90 text-white">
            Start Workout
          </Button>
        </div>
      </motion.div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
          >
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-xl font-semibold">{title}</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>
            <div className="flex-grow overflow-auto">
              <AspectRatio ratio={16 / 9}>
                {videoId ? (
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                    title={title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                ) : (
                  <img src={image} alt={title} className="object-cover w-full h-full" />
                )}
              </AspectRatio>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <h4 className="font-medium mb-2">Workout Details</h4>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Duration:</p>
                        <p>{duration}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Calories Burned:</p>
                        <p>{calories}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Level:</p>
                        <Badge variant="outline" className={
                          level === "Beginner" ? "border-[#7CAE9E] text-[#7CAE9E]" :
                            level === "Intermediate" ? "border-[#FEC0B3] text-[#FEC0B3]" :
                              "border-[#E69EA2] text-[#E69EA2]"
                        }>
                          {level}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Equipment Needed:</p>
                        <div className="flex flex-wrap gap-1">
                          {equipment.map((item, index) => (
                            <Badge key={index} variant="secondary" className="bg-[#F8E8E9] text-gray-700">
                              {item}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Benefits</h4>
                    <ul className="space-y-2">
                      {benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start">
                          <Check size={14} className="text-[#7CAE9E] mr-2 mt-0.5 flex-shrink-0" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-4 border-t flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowModal(false)}>
                Close
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

const Fitness = () => {
  const [selectedTab, setSelectedTab] = useState("all");
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState("");
  const [showStressReliefModal, setShowStressReliefModal] = useState(false);
  const [workoutSchedule, setWorkoutSchedule] = useState<Record<string, any>>({});
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [showQuotesModal, setShowQuotesModal] = useState(false);

  const motivationalQuotes = [
    {
      text: "The only bad workout is the one that didn't happen.",
      author: "Unknown"
    },
    {
      text: "Success starts with self-discipline.",
      author: "Unknown"
    },
    {
      text: "You don't have to be extreme, just consistent.",
      author: "Unknown"
    },
    {
      text: "The secret of getting ahead is getting started.",
      author: "Mark Twain"
    },
    {
      text: "Discipline is choosing between what you want now and what you want most.",
      author: "Abraham Lincoln"
    },
    {
      text: "Every workout is a step closer to your goal.",
      author: "Unknown"
    },
    {
      text: "Your body hears everything your mind says. Stay positive!",
      author: "Unknown"
    }
  ];

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const workoutTypes = ["Rest", "Cardio", "Strength", "Flexibility", "HIIT"];

  useEffect(() => {
    const savedSchedule = localStorage.getItem("workoutSchedule");
    if (savedSchedule) {
      setWorkoutSchedule(JSON.parse(savedSchedule));
    }
  }, []);

  useEffect(() => {
    const quoteInterval = setInterval(() => {
      setCurrentQuoteIndex((prev) =>
        prev === motivationalQuotes.length - 1 ? 0 : prev + 1
      );
    }, 8000); // Change quote every 8 seconds

    return () => clearInterval(quoteInterval);
  }, []);

  const saveSchedule = () => {
    localStorage.setItem("workoutSchedule", JSON.stringify(workoutSchedule));
    setShowScheduleModal(false);
  };

  const resetSchedule = () => {
    setWorkoutSchedule({});
    localStorage.removeItem("workoutSchedule");
  };

  const handleDayClick = (day: string) => {
    setSelectedDay(day);
    setShowScheduleModal(true);
  };

  const handleScheduleChange = (field: string, value: string | boolean) => {
    setWorkoutSchedule(prev => ({
      ...prev,
      [selectedDay]: {
        ...prev[selectedDay],
        [field]: value
      }
    }));
  };

  const toggleWorkoutComplete = (day: string) => {
    setWorkoutSchedule(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        completed: !prev[day]?.completed
      }
    }));
  };

  const scrollToSchedule = () => {
    const scheduleSection = document.getElementById("workout-schedule");
    if (scheduleSection) {
      scheduleSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const workouts = {
    all: [],

    cardio: [
      {
        title: "Low Impact Cardio Workout",
        level: "Beginner",
        duration: "30 min",
        calories: "200-300 cal",
        equipment: ["None"],
        image: "src/assets/images/cardio1.avif",
        benefits: ["Improves heart health", "Low joint impact", "Boosts stamina"],
        videoId: "ml6cT4AZdqI"
      },
      {
        title: "Fat-Burning HIIT Cardio",
        level: "Intermediate",
        duration: "30 min",
        calories: "400-500 cal",
        equipment: ["None"],
        image: "src/assets/images/cardio2.avif",
        benefits: ["Wakes up the body", "Boosts metabolism", "Improves focus for morning classes"],
        videoId: "u8VeAlzCA8s"
      },
      {
        title: "Full Body Cardio Workout",
        level: "All Levels",
        duration: "20 min",
        calories: "300-400 cal",
        equipment: ["None"],
        image: "src/assets/images/cardio3.jpg",
        benefits: ["Total body workout", "Improves cardiovascular health", "Burns calories efficiently"],
        videoId: "UBMk30rjy0o"
      }
    ],
    strength: [
      {
        title: "Strength Training (Bodyweight)",
        level: "Beginner",
        duration: "10 min",
        calories: "150-200 cal",
        equipment: ["Resistance Band", "Chair"],
        image: "src/assets/images/strength1.jpg",
        benefits: ["Builds basic strength", "Improves stability"],
        videoId: "30PqX2zvK88"
      },
      {
        title: "Dumbbell Strength Workout",
        level: "Intermediate",
        duration: "15 min",
        calories: "350-450 cal",
        equipment: ["Dumbbells"],
        image: "src/assets/images/strength2.jpg",
        benefits: ["Enhances muscle tone", "Increases power", "Core activation"],
        videoId: "xqVBoyKXbsA"
      },
      {
        title: "Full Body Strength Training",
        level: "All Levels",
        duration: "30 min",
        calories: "400-500 cal",
        equipment: ["None"],
        image: "src/assets/images/strength3.webp",
        benefits: ["Total body workout", "No gear needed", "Good for home"],
        videoId: "9FBIaqr7TjQ"
      }
    ],
    flexibility: [
      {
        title: "Study Break Stretches",
        level: "Beginner",
        duration: "10 min",
        calories: "50-80 cal",
        equipment: ["Chair"],
        image: "src/assets/images/flexibility1.jpeg",
        benefits: ["Relieves tension from sitting", "Improves flexibility", "Enhances focus for studying"],
        videoId: "LnCQ-MECZSw"
      },
      {
        title: "Daily Stretch",
        level: "Intermediate",
        duration: "12 min",
        calories: "100-150 cal",
        equipment: ["Mat"],
        image: "src/assets/images/flexibility2.jpeg",
        benefits: ["Deep stretches", "Posture improvement", "Mind-body balance"],
        videoId: "itJE4neqDJw"
      },
      {
        title: "Full Body Stretch",
        level: "All Levels",
        duration: "15 min",
        calories: "150-200 cal",
        equipment: ["Mat (Optional)"],
        image: "src/assets/images/flexibility3.jpeg",
        benefits: ["Great for recovery", "Full-body flexibility", "Reduces muscle tension"],
        videoId: "i6TzP2COtow"
      }
    ]
  };

  // Merge all workouts into 'all'
  workouts.all = [...workouts.cardio, ...workouts.strength, ...workouts.flexibility];


  const stressReliefExercises = [
    {
      title: "Desk Stretches",
      description: "Release tension without leaving your workspace with these simple stretches.",
      duration: "5 min",
      steps: [
        "Neck rolls: Slowly roll your head in circles",
        "Shoulder shrugs: Lift shoulders up and down",
        "Seated twist: Gently twist your torso while seated",
        "Wrist stretches: Extend and flex your wrists"
      ],
      icon: <Activity className="h-8 w-8 text-[#7CAE9E]" />,
      color: colors.teal
    },
    {
      title: "Breathing Exercises",
      description: "Calm your nervous system with these breathing techniques.",
      duration: "3-5 min",
      steps: [
        "4-7-8 breathing: Inhale for 4, hold for 7, exhale for 8",
        "Box breathing: Equal inhale, hold, exhale, pause",
        "Diaphragmatic breathing: Deep belly breaths"
      ],
      icon: <Heart className="h-8 w-8 text-[#E69EA2]" />,
      color: colors.coral
    },
    {
      title: "Mindful Walking",
      description: "Refresh your mind with this walking meditation.",
      duration: "5 min",
      steps: [
        "Walk slowly and focus on each step",
        "Pay attention to your surroundings",
        "Breathe deeply as you walk",
        "Let go of distracting thoughts"
      ],
      icon: <Dumbbell className="h-8 w-8 text-[#FEC0B3]" />,
      color: colors.peach
    }
  ];

  return (
    <Layout>
      {/* Fixed Quotes Bubble in Top Left Corner */}
      <div className="fixed top-40 left-4 z-40">
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="cursor-pointer"
          onClick={() => setShowQuotesModal(true)}
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #E69EA2 0%, #7CAE9E 100%)",
            boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
          }}
        >
          <Quote className="h-6 w-6" />
        </motion.div>
      </div>

      {/* Quotes Modal - Positioned relative to the bubble */}
      <AnimatePresence>
        {showQuotesModal && (
          <>
            {/* Overlay that allows clicking through to the page */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowQuotesModal(false)}
              style={{ pointerEvents: 'auto' }}
            />

            {/* Actual modal positioned near the bubble */}
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.8,
                x: 20,
                y: 20
              }}
              animate={{
                opacity: 1,
                scale: 1,
                x: 80,
                y: 0
              }}
              exit={{
                opacity: 0,
                scale: 0.8,
                x: 20,
                y: 20
              }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 300
              }}
              className="fixed top-4 left-4 z-50 w-80 bg-white rounded-xl shadow-2xl overflow-hidden"
              style={{
                background: "linear-gradient(to bottom right, #F8E8E9, #CFECE0)"
              }}
            >
              <button
                onClick={() => setShowQuotesModal(false)}
                className="absolute top-3 right-3 z-10 p-1 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors shadow-sm"
              >
                <X size={18} className="text-gray-600" />
              </button>

              <div className="relative p-6">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-md">
                    <Quote className="h-5 w-5 text-[#7CAE9E]" />
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentQuoteIndex}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className="min-h-32 flex flex-col justify-center"
                  >
                    <p className="text-center text-lg font-medium text-gray-800 mb-4 leading-relaxed">
                      "{motivationalQuotes[currentQuoteIndex].text}"
                    </p>
                    <p className="text-center text-gray-600">
                      — {motivationalQuotes[currentQuoteIndex].author}
                    </p>
                  </motion.div>
                </AnimatePresence>

                <div className="flex justify-center mt-6 space-x-2">
                  {motivationalQuotes.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentQuoteIndex(index)}
                      className={`w-2 h-2 rounded-full transition-all ${index === currentQuoteIndex ? 'bg-[#7CAE9E] scale-125' : 'bg-gray-300'
                        }`}
                      aria-label={`Go to quote ${index + 1}`}
                    />
                  ))}
                </div>
              </div>


            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Banner with Image */}
      <div className="relative h-[500px] md:h-[600px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={fitnessbanner}
            alt="Fitness Banner"
            className="w-full h-full object-cover blur-[2px]"
          />
          <div className="absolute inset-0"></div>
        </div>
        <div className="relative z-10 h-full flex items-center">
          <div className="container mx-auto px-6 md:px-12 lg:px-24">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white">
                Fitness & Wellbeing
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-8 max-w-lg">
                Optimize your health with personalized workouts designed for your busy schedule
              </p>
              <Button
                className="bg-[#7CAE9E] hover:bg-[#6B9D8D] text-white px-8 py-6 text-lg rounded-full"
                onClick={scrollToSchedule}
              >
                Get Started <ChevronRight size={20} className="ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 md:px-12 lg:px-24 py-12 max-w-auto mx-auto">
        {/* Workout Schedule Section */}
        <div className="mb-16" id="workout-schedule">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-[#2D7D7D]">Your Weekly Plan</h2>
            <div className="flex gap-3">
              <Button
                className="bg-[#7CAE9E] hover:bg-[#6B9D8D] text-white"
                onClick={() => setShowScheduleModal(true)}
              >
                Edit Schedule
              </Button>
              <Button
                variant="outline"
                className="border-[#7CAE9E] text-[#7CAE9E] hover:bg-[#EBFFF5]"
                onClick={resetSchedule}
              >
                <RotateCcw size={18} className="mr-2" />
                Reset
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
            <div className="grid grid-cols-7 gap-0.5 bg-gray-100">
              {days.map((day, i) => {
                const schedule = workoutSchedule[day];
                const isCompleted = schedule?.completed;
                return (
                  <div
                    key={i}
                    className={`p-4 text-center ${isCompleted ? "bg-[#EBFFF5]" : "bg-white"} transition-all`}
                    onClick={() => handleDayClick(day)}
                  >
                    <div className="flex flex-col items-center h-full">
                      <span className="text-sm font-medium text-[#4A5568] mb-2">{day}</span>
                      <div className={`rounded-full h-12 w-12 flex items-center justify-center mb-3 ${schedule?.type === "Cardio" ? "bg-[#E69EA2] text-white" :
                        schedule?.type === "Strength" ? "bg-[#FEC0B3] text-white" :
                          schedule?.type === "Flexibility" ? "bg-[#7CAE9E] text-white" :
                            schedule?.type === "HIIT" ? "bg-[#2D7D7D] text-white" :
                              "bg-gray-200 text-gray-500"
                        }`}>
                        {schedule?.type === "Cardio" ? <Heart size={20} /> :
                          schedule?.type === "Strength" ? <Dumbbell size={20} /> :
                            schedule?.type === "Flexibility" ? <Activity size={20} /> :
                              schedule?.type === "HIIT" ? <Timer size={20} /> :
                                <FilterX size={20} />}
                      </div>
                      <span className={`text-sm font-medium ${isCompleted ? "text-[#7CAE9E]" : "text-[#4A5568]"
                        }`}>
                        {schedule?.type || 'Rest'}
                      </span>
                      <div className="mt-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleWorkoutComplete(day);
                          }}
                          className={`p-2 rounded-full ${isCompleted ? "bg-[#7CAE9E] text-white" : "bg-gray-100 text-gray-400"}`}
                        >
                          <CheckCircle size={18} className={isCompleted ? "fill-white" : ''} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Schedule Workout Modal */}
        {showScheduleModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-lg w-full max-w-md p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-[#7CAE9E]">
                  Schedule for {selectedDay}
                </h3>
                <button
                  onClick={() => setShowScheduleModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Workout Type</label>
                  <select
                    className="w-full border border-gray-300 rounded-md p-2 focus:ring-[#7CAE9E] focus:border-[#7CAE9E]"
                    value={workoutSchedule[selectedDay]?.type || ""}
                    onChange={(e) => handleScheduleChange("type", e.target.value)}
                  >
                    <option value="">Rest Day</option>
                    {workoutTypes.filter(t => t !== "Rest").map((type, i) => (
                      <option key={i} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                {workoutSchedule[selectedDay]?.type && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                      <input
                        type="time"
                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-[#7CAE9E] focus:border-[#7CAE9E]"
                        value={workoutSchedule[selectedDay]?.time || ""}
                        onChange={(e) => handleScheduleChange("time", e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Workout</label>
                      <select
                        className="w-full border border-gray-300 rounded-md p-2 focus:ring-[#7CAE9E] focus:border-[#7CAE9E]"
                        value={workoutSchedule[selectedDay]?.workout || ""}
                        onChange={(e) => handleScheduleChange("workout", e.target.value)}
                      >
                        <option value="">Select workout</option>
                        {workouts.all.map((workout, index) => (
                          <option key={index} value={workout.title}>{workout.title}</option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="completed"
                        checked={workoutSchedule[selectedDay]?.completed || false}
                        onChange={(e) => handleScheduleChange("completed", e.target.checked)}
                        className="mr-2 h-4 w-4 text-[#7CAE9E] focus:ring-[#7CAE9E] border-gray-300 rounded"
                      />
                      <label htmlFor="completed" className="text-sm text-gray-700">
                        Mark as completed
                      </label>
                    </div>
                  </>
                )}
              </div>
              <div className="mt-6 flex justify-end gap-2">
                <Button
                  variant="outline"
                  className="border-[#7CAE9E] text-[#7CAE9E] hover:bg-[#EBFFF5]"
                  onClick={() => setShowScheduleModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-[#E69EA2] hover:bg-[#E69EA2]/90 text-white"
                  onClick={saveSchedule}
                >
                  Save
                </Button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Explore Workouts Section */}
        <div className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-[#7CAE9E]">Explore Workouts</h2>
          </div>

          <Tabs defaultValue="all" className="w-full" onValueChange={setSelectedTab}>
            <TabsList className="mb-6 bg-[#F8E8E9]">
              <TabsTrigger value="all" className="data-[state=active]:bg-[#7CAE9E] data-[state=active]:text-white">All Workouts</TabsTrigger>
              <TabsTrigger value="cardio" className="data-[state=active]:bg-[#7CAE9E] data-[state=active]:text-white">Cardio</TabsTrigger>
              <TabsTrigger value="strength" className="data-[state=active]:bg-[#7CAE9E] data-[state=active]:text-white">Strength</TabsTrigger>
              <TabsTrigger value="flexibility" className="data-[state=active]:bg-[#7CAE9E] data-[state=active]:text-white">Flexibility</TabsTrigger>
            </TabsList>

            {Object.keys(workouts).map((category) => (
              <TabsContent key={category} value={category} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {workouts[category as keyof typeof workouts].map((workout, index) => (
                    <WorkoutCard key={index} {...workout} />
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        {/* Quick Stress Relief Section */}
        <section className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2 text-[#7CAE9E]">Quick Stress Relief</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Short, effective exercises to help you decompress during busy days.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stressReliefExercises.map((exercise, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.03 }}
                className="relative overflow-hidden rounded-xl shadow-lg bg-white border border-[#F8E8E9]"
              >
                <div className="absolute -right-10 -top-10 w-32 h-32 rounded-full opacity-20"
                  style={{ backgroundColor: exercise.color }}></div>
                <div className="p-6 relative z-10">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
                    style={{ backgroundColor: exercise.color, color: 'white' }}>
                    {exercise.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2" style={{ color: exercise.color }}>
                    {exercise.title}
                  </h3>
                  <p className="text-gray-700 mb-4">{exercise.description}</p>
                  <div className="flex items-center text-sm text-gray-600 mb-4">
                    <Clock size={14} className="mr-1" />
                    <span>{exercise.duration}</span>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full border-[#7CAE9E] text-[#7CAE9E] hover:bg-[#EBFFF5]"
                    onClick={() => {
                      setShowStressReliefModal(true);
                      setSelectedDay(exercise.title);
                    }}
                  >
                    Try It
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Stress Relief Modal */}
        {showStressReliefModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-lg w-full max-w-md p-6"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold" style={{
                  color: stressReliefExercises.find(e => e.title === selectedDay)?.color
                }}>
                  {stressReliefExercises.find(e => e.title === selectedDay)?.title}
                </h3>
                <button
                  onClick={() => setShowStressReliefModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>
              <div className="mb-4">
                <p className="text-gray-600">
                  {stressReliefExercises.find(e => e.title === selectedDay)?.description}
                </p>
              </div>
              <div className="space-y-3">
                <h4 className="font-medium" style={{
                  color: stressReliefExercises.find(e => e.title === selectedDay)?.color
                }}>
                  Steps:
                </h4>
                <ol className="list-decimal pl-5 space-y-2 text-gray-700">
                  {stressReliefExercises.find(e => e.title === selectedDay)?.steps.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              </div>
              <div className="mt-6 flex justify-end">
                <Button
                  className="bg-[#E69EA2] hover:bg-[#E69EA2]/90 text-white"
                  onClick={() => setShowStressReliefModal(false)}
                >
                  Got It
                </Button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Student-Specific Section */}
        <section className="bg-[#F8E8E9] rounded-xl p-8 border border-[#CFECE0]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-[#7CAE9E]">Fitness for Busy Students</h2>
              <p className="text-gray-700 mb-6">
                Specialized workouts designed to fit into packed academic schedules, with routines that can be done in small spaces.
              </p>
              <div className="space-y-3">
                {[
                  "Quick 10-20 minute workouts",
                  "No equipment needed options",
                  "Study break routines",
                  "Stress-relief exercises",
                  "Energy-boosting morning sessions"
                ].map((item, index) => (
                  <div key={index} className="flex items-start">
                    <Check className="h-5 w-5 mr-2 mt-0.5 text-[#7CAE9E]" />
                    <span className="text-lg">{item}</span>  {/* Added text-lg here */}
                  </div>
                ))}
              </div>

            </div>
            <div className="bg-white rounded-lg overflow-hidden shadow-md border border-[#CFECE0]">
              <AspectRatio ratio={16 / 9}>
                <img
                  src={busyStudentImg}
                  alt="Student workout"
                  className="object-cover w-full h-full"
                />
              </AspectRatio>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Fitness;