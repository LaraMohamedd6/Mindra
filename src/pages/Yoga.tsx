import Layout from "@/components/layout/Layout";
import { motion } from "framer-motion";
import SectionHeading from "@/components/common/SectionHeading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Heart, UserCheck, Wind, Moon, Sun, Flame, Calendar, BookOpen, Zap, ArrowRight, ChevronDown, Leaf, Activity, Eye, Brain, RotateCw, X, Clock3 } from "lucide-react";
import { useState, useRef } from "react";
import { toast } from "sonner";
import yogaBanner from "@/assets/images/yoga-banner.png";

// Yoga Tip Modal Component
const YogaTipModal = ({ tip, onClose }: { tip: any, onClose: () => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className={`relative max-w-md w-full rounded-2xl p-6 shadow-xl ${tip.bgClass} border ${tip.borderClass}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="h-6 w-6" />
        </button>
        
        <div className="flex items-start mb-4">
          <div className={`w-14 h-14 ${tip.iconBgClass} rounded-xl flex items-center justify-center mr-4 shadow-md`}>
            {tip.icon}
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">{tip.title}</h3>
            <div className={`${tip.tagBgClass} px-2 py-1 rounded-full inline-block mt-1`}>
              <span className={`text-xs font-medium ${tip.tagTextClass}`}>{tip.tag}</span>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
          <p className="text-gray-700">{tip.fullDescription}</p>
          
          <div className="bg-white/80 rounded-lg p-4">
            <h4 className="font-medium mb-2 text-gray-800">How to practice:</h4>
            <ul className="list-disc list-inside space-y-1 text-gray-700">
              {tip.steps.map((step: string, i: number) => (
                <li key={i}>{step}</li>
              ))}
            </ul>
          </div>
          
          {tip.videoId && (
            <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden mt-4">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${tip.videoId}?rel=0&modestbranding=1`}
                title={tip.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default function Yoga() {
  const [savedClasses, setSavedClasses] = useState<number[]>([]);
  const [selectedPose, setSelectedPose] = useState<any>(null);
  const [showMoreContent, setShowMoreContent] = useState(false);
  const [selectedTip, setSelectedTip] = useState<any>(null);
  const powerSectionRef = useRef<HTMLDivElement>(null);

  const toggleSaveClass = (id: number) => {
    if (savedClasses.includes(id)) {
      setSavedClasses(savedClasses.filter(classId => classId !== id));
      toast.info("Removed from saved classes");
    } else {
      setSavedClasses([...savedClasses, id]);
      toast.success("Added to saved classes");
    }
  };

  const handleLearnMoreClick = () => {
    const newShowState = !showMoreContent;
    setShowMoreContent(newShowState);
    
    if (newShowState && powerSectionRef.current) {
      setTimeout(() => {
        powerSectionRef.current?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }, 50);
    }
  };

  const yogaClasses = [
    {
      id: 1,
      title: "Morning Energy Flow",
      duration: "10 mins",
      level: "All Levels",
      description: "Energizing morning sequence to wake up your body and mind.",
      videoId: "qCClhfxwy1k",
      benefits: ["Improved focus", "Higher energy", "Better posture"],
    },
    {
      id: 2,
      title: "Tension-Relief Yoga",
      duration: "28 mins",
      level: "Beginner",
      description: "Gentle stretches and poses to release tension.",
      videoId: "aKsu112bzHE",
      benefits: ["Reduced stress", "Mental clarity", "Emotional balance"],
    },
    {
      id: 3,
      title: "Desk Break Yoga",
      duration: "6 mins",
      level: "All Levels",
      description: "Quick stretches you can do at your desk to prevent stiffness.",
      videoId: "tAUf7aajBWE",
      benefits: ["Relieved muscle tension", "Improved circulation", "Reduced eye strain"],
    },
    {
      id: 4,
      title: "Evening Wind Down",
      duration: "12 mins",
      level: "Beginner",
      description: "Gentle poses to relax your body and mind before sleep.",
      videoId: "BiWDsfZ3zbo",
      benefits: ["Better sleep", "Reduced anxiety", "Muscle relaxation"],
    },
    {
      id: 5,
      title: "Yoga for Concentration",
      duration: "12 mins",
      level: "Intermediate",
      description: "Poses that enhance focus and mental clarity.",
      videoId: "YbAYMQC_ZaE",
      benefits: ["Improved concentration", "Mental stamina", "Reduced distractions"],
    },
    {
      id: 6,
      title: "Quick Energy Boost",
      duration: "7 mins",
      level: "Beginner",
      description: "Revitalizing sequence when you need a pick-me-up.",
      videoId: "3Ql411IIpJM",
      benefits: ["Instant energy", "Improved circulation", "Mental refreshment"],
    },
  ];

  const yogaPoses = [
    {
      id: 1,
      name: "Mountain Pose (Tadasana)",
      description: "Foundation for all standing poses, improves posture and balance",
      benefits: "Strengthens thighs, knees, and ankles | Improves posture | Relieves back pain",
      icon: <BookOpen className="h-5 w-5" />,
      color: "bg-indigo-100 text-indigo-600",
      steps: [
        "Stand with feet together, weight evenly distributed",
        "Engage thigh muscles, lift kneecaps",
        "Lengthen tailbone toward floor",
        "Broaden collarbones, relax shoulders down",
        "Hold for 5-8 breaths"
      ],
      videoId: "2HTvZp5rPrg"
    },
    {
      id: 2,
      name: "Downward Dog (Adho Mukha Svanasana)",
      description: "Full-body stretch that energizes and strengthens",
      benefits: "Stretches hamstrings, calves, and shoulders | Strengthens arms and legs | Calms the mind",
      icon: <Zap className="h-5 w-5" />,
      color: "bg-emerald-100 text-emerald-600",
      steps: [
        "Start on hands and knees (tabletop position)",
        "Tuck toes, lift hips toward ceiling",
        "Straighten legs without locking knees",
        "Press hands firmly into mat",
        "Hold for 5-8 breaths"
      ],
      videoId: "EC7RGJ975iM"
    },
    {
      id: 3,
      name: "Warrior II (Virabhadrasana II)",
      description: "Builds stamina and concentration",
      benefits: "Strengthens legs and arms | Stretches hips and chest | Improves balance",
      icon: <UserCheck className="h-5 w-5" />,
      color: "bg-amber-100 text-amber-600",
      steps: [
        "Step feet 3-4 feet apart",
        "Turn right foot out 90 degrees, left foot slightly in",
        "Bend right knee over ankle",
        "Extend arms parallel to floor",
        "Gaze over right fingertips",
        "Hold for 5-8 breaths each side"
      ],
      videoId: "Mn6RSIRCV3w"
    },
    {
      id: 4,
      name: "Child's Pose (Balasana)",
      description: "Resting pose that calms the mind",
      benefits: "Gently stretches hips, thighs, and ankles | Relieves back and neck pain | Reduces stress",
      icon: <Moon className="h-5 w-5" />,
      color: "bg-sky-100 text-sky-600",
      steps: [
        "Kneel on floor with big toes touching",
        "Sit back on heels, knees hip-width apart",
        "Fold forward, extending arms or resting them alongside body",
        "Rest forehead on mat",
        "Breathe deeply and hold as long as comfortable"
      ],
      videoId: "eqVMAPM00DM"
    },
    {
      id: 5,
      name: "Tree Pose (Vrikshasana)",
      description: "Improves balance and focus while strengthening legs and core",
      benefits: "Enhances concentration | Strengthens ankles and calves | Improves posture",
      icon: <Leaf className="h-5 w-5" />,
      color: "bg-purple-100 text-purple-600",
      steps: [
        "Stand in Mountain Pose",
        "Shift weight to left foot, bend right knee",
        "Place right foot on inner left thigh or calf (avoid knee)",
        "Bring hands to prayer position at chest",
        "Focus on a fixed point and hold for 5-8 breaths",
        "Repeat on other side"
      ],
      videoId: "yVE4XXFFO70"
    },
    {
      id: 6,
      name: "Bridge Pose (Setu Bandhasana)",
      description: "Strengthens back muscles and opens the chest",
      benefits: "Stretches chest and spine | Relieves stress | Improves digestion",
      icon: <Activity className="h-5 w-5" />,
      color: "bg-rose-100 text-rose-600",
      steps: [
        "Lie on back with knees bent and feet hip-width apart",
        "Arms alongside body with palms down",
        "Press into feet to lift hips toward ceiling",
        "Keep thighs parallel and engage glutes",
        "Hold for 5-8 breaths, then slowly lower down"
      ],
      videoId: "SoOepykWJLw"
    }
  ];

  const studentYogaTips = [
    {
      id: 1,
      title: "Micro Yoga Breaks",
      shortDescription: "Between classes? Do 2-minute desk stretches to refresh.",
      fullDescription: "These ultra-short yoga breaks can be done anywhere and help reset your body and mind between study sessions or classes.",
      tag: "Quick Reset",
      icon: <RotateCw className="h-6 w-6 text-white" />,
      iconBgClass: "bg-indigo-500",
      bgClass: "bg-gradient-to-br from-indigo-50 to-white",
      borderClass: "border-indigo-100",
      tagBgClass: "bg-indigo-100/50",
      tagTextClass: "text-indigo-700",
      steps: [
        "Set a timer for 2 minutes",
        "Do seated neck rolls (5 each direction)",
        "Perform seated spinal twists (both sides)",
        "Finish with wrist and finger stretches",
        "Take 3 deep breaths before continuing"
      ],
    },
    {
      id: 2,
      title: "Study Session Prep",
      shortDescription: "Before hitting the books, do 5 minutes of breathing exercises.",
      fullDescription: "This short routine prepares both mind and body for focused study sessions by increasing oxygen flow and calming the nervous system.",
      tag: "Focus Booster",
      icon: <BookOpen className="h-6 w-6 text-white" />,
      iconBgClass: "bg-emerald-500",
      bgClass: "bg-gradient-to-br from-emerald-50 to-white",
      borderClass: "border-emerald-100",
      tagBgClass: "bg-emerald-100/50",
      tagTextClass: "text-emerald-700",
      steps: [
        "Sit comfortably with spine straight",
        "Practice alternate nostril breathing (3 rounds)",
        "Do seated cat-cow stretches (5 reps)",
        "Rub palms together and cup over eyes",
        "Set an intention for your study session"
      ],
    },
    {
      id: 3,
      title: "Dorm Room Flow",
      shortDescription: "No mat? Use your bed for seated poses or try wall-assisted stretches.",
      fullDescription: "Even in small dorm rooms, you can practice yoga effectively with these space-saving techniques.",
      tag: "Space Saver",
      icon: <Moon className="h-6 w-6 text-white" />,
      iconBgClass: "bg-amber-500",
      bgClass: "bg-gradient-to-br from-amber-50 to-white",
      borderClass: "border-amber-100",
      tagBgClass: "bg-amber-100/50",
      tagTextClass: "text-amber-700",
      steps: [
        "Use your bed for seated meditation",
        "Try wall-assisted downward dog",
        "Practice standing poses in small spaces",
        "Do chair yoga if floor space is limited",
        "Focus on breathwork when movement is restricted"
      ],
    },
    {
      id: 4,
      title: "Exam Calmer",
      shortDescription: "Before tests, practice 3 minutes of box breathing to reduce anxiety.",
      fullDescription: "This breathing technique helps activate the parasympathetic nervous system to calm exam nerves.",
      tag: "Stress Relief",
      icon: <Clock3 className="h-6 w-6 text-white" />,
      iconBgClass: "bg-sky-500",
      bgClass: "bg-gradient-to-br from-sky-50 to-white",
      borderClass: "border-sky-100",
      tagBgClass: "bg-sky-100/50",
      tagTextClass: "text-sky-700",
      steps: [
        "Sit comfortably with eyes closed",
        "Inhale for 4 counts",
        "Hold breath for 4 counts",
        "Exhale for 4 counts",
        "Hold empty for 4 counts",
        "Repeat for 3-5 minutes"
      ],
    },
    {
      id: 5,
      title: "Group Energy",
      shortDescription: "Organize yoga study breaks with roommates for shared energy.",
      fullDescription: "Partner yoga and group sessions can boost motivation and create bonding experiences.",
      tag: "Social Flow",
      icon: <UserCheck className="h-6 w-6 text-white" />,
      iconBgClass: "bg-purple-500",
      bgClass: "bg-gradient-to-br from-purple-50 to-white",
      borderClass: "border-purple-100",
      tagBgClass: "bg-purple-100/50",
      tagTextClass: "text-purple-700",
      steps: [
        "Gather 2-3 friends for a quick session",
        "Try partner-assisted stretches",
        "Do synchronized breathing exercises",
        "Create a regular study break routine",
        "Encourage each other's practice"
      ],
    },
    {
      id: 6,
      title: "Morning Jumpstart",
      shortDescription: "Start with 3 sun salutations to energize for early classes.",
      fullDescription: "This quick morning routine gets blood flowing and wakes up both body and mind.",
      tag: "Wake Up",
      icon: <Sun className="h-6 w-6 text-white" />,
      iconBgClass: "bg-rose-500",
      bgClass: "bg-gradient-to-br from-rose-50 to-white",
      borderClass: "border-rose-100",
      tagBgClass: "bg-rose-100/50",
      tagTextClass: "text-rose-700",
      steps: [
        "Stand at the foot of your bed",
        "Perform 3 rounds of sun salutation A",
        "Modify as needed for space",
        "Finish with 3 deep breaths",
        "Hydrate before heading to class"
      ],
    }
  ];

  const handlePoseSelect = (pose: any) => {
    setSelectedPose(pose);
  };

  return (
    <Layout>
      {/* Hero Banner */}
      <div className="relative h-[500px] md:h-[800px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src= {yogaBanner}
            alt="Woman doing yoga outdoors"
            className="w-full h-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>

        <div className="relative z-10 h-full flex items-end pb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="container mx-auto px-4 text-white"
          >
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-display font-bold mb-4">
              Yoga & Wellness Journey
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl mb-8 max-w-2xl">
              Transform your body and mind with evidence-based yoga practices for all levels.
            </p>
            <div className="flex gap-4">
              <Button
                variant="outline"
                className="bg-transparent border-white text-white hover:bg-white/10"
                onClick={handleLearnMoreClick}
              >
                {showMoreContent ? "Hide Details" : "Learn More"}
                <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${showMoreContent ? "rotate-180" : ""}`} />
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll target div */}
      <div ref={powerSectionRef} className="scroll-mt-20"></div>

      {/* Expanded Content Section */}
      {showMoreContent && (
        <motion.section
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white overflow-hidden"
        >
          <div className="container mx-auto px-4 py-12">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-display font-semibold mb-6 text-gray-800">The Power of Yoga</h2>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="bg-zenLightPink p-2 rounded-full mr-4 mt-1">
                      <Activity className="h-5 w-5 text-zenPink" />
                    </div>
                    <div>
                      <h3 className="text-xl font-medium mb-2">Physical Benefits</h3>
                      <p className="text-gray-600">
                        Yoga improves flexibility, strength, and balance while reducing chronic pain and improving
                        cardiovascular health. Regular practice can enhance your overall physical performance.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-zenLightPink p-2 rounded-full mr-4 mt-1">
                      <Brain className="h-5 w-5 text-zenPink" />
                    </div>
                    <div>
                      <h3 className="text-xl font-medium mb-2">Mental Clarity</h3>
                      <p className="text-gray-600">
                        Yoga reduces stress and anxiety while improving focus and cognitive function.
                        The mindfulness aspect helps cultivate present-moment awareness and emotional resilience.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="bg-zenLightPink p-2 rounded-full mr-4 mt-1">
                      <Moon className="h-5 w-5 text-zenPink" />
                    </div>
                    <div>
                      <h3 className="text-xl font-medium mb-2">Sleep & Relaxation</h3>
                      <p className="text-gray-600">
                        Yoga helps regulate sleep patterns and improves sleep quality.
                        Evening routines can help you fall asleep faster and wake up more refreshed.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden shadow-md">
                <iframe
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/9cEdwIeLd1A?si=jXpnkjBct6XCNmrC"
                  title="The Science of Yoga"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        </motion.section>
      )}

      {/* Yoga Video Section */}
      <section className="py-14 bg-white">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Yoga Classes"
            subtitle="Sessions for all levels and needs"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {yogaClasses.map((yogaClass, index) => (
              <motion.div
                key={yogaClass.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all border border-gray-100"
              >
                <div className="aspect-video relative bg-gray-100">
                  {yogaClass.videoId ? (
                    <iframe
                      className="absolute inset-0 w-full h-full"
                      src={`https://www.youtube.com/embed/${yogaClass.videoId}?rel=0&modestbranding=1`}
                      title={yogaClass.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                      <div className="text-center p-4">
                        <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                        <p className="text-gray-500">New class coming soon!</p>
                        <Button variant="ghost" size="sm" className="mt-2 text-zenPink">
                          Notify Me
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="bg-zenLightPink text-zenPink text-xs px-2 py-1 rounded-full">{yogaClass.duration}</span>
                    <span className="text-xs text-gray-500">{yogaClass.level}</span>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{yogaClass.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{yogaClass.description}</p>
                  <div className="mb-4">
                    <h4 className="text-xs font-medium text-gray-500 mb-1">BENEFITS:</h4>
                    <div className="flex flex-wrap gap-1">
                      {yogaClass.benefits.map((benefit, i) => (
                        <span key={i} className="text-xs bg-gray-100 px-2 py-0.5 rounded-full text-gray-600">
                          {benefit}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`p-0 ${savedClasses.includes(yogaClass.id) ? "text-zenPink" : "text-gray-400"}`}
                      onClick={() => toggleSaveClass(yogaClass.id)}
                    >
                      <Heart className="h-4 w-4 mr-1" fill={savedClasses.includes(yogaClass.id) ? "#E69EA2" : "none"} />
                      {savedClasses.includes(yogaClass.id) ? "Saved" : "Save"}
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Yoga Poses Section */}
      <section className="py-14 bg-gray-50">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Essential Yoga Poses"
            subtitle="Master these foundational poses for your daily practice"
          />

          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-1/2">
              <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
                {selectedPose ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-xl font-semibold">{selectedPose.name}</h3>
                      <div className={`p-2 rounded-full ${selectedPose.color}`}>
                        {selectedPose.icon}
                      </div>
                    </div>

                    <div className="aspect-video bg-gray-100 rounded-lg mb-4 overflow-hidden">
                      <iframe
                        className="w-full h-full"
                        src={`https://www.youtube.com/embed/${selectedPose.videoId}?rel=0&modestbranding=1`}
                        title={selectedPose.name}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-medium mb-2">Description</h4>
                      <p className="text-gray-600 text-sm">{selectedPose.description}</p>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-medium mb-2">Benefits</h4>
                      <p className="text-zenPink text-sm">{selectedPose.benefits}</p>
                    </div>

                    <div>
                      <h4 className="font-medium mb-2">Steps</h4>
                      <ol className="text-sm text-gray-600 space-y-2 list-decimal list-inside">
                        {selectedPose.steps.map((step: string, i: number) => (
                          <li key={i}>{step}</li>
                        ))}
                      </ol>
                    </div>
                  </motion.div>
                ) : (
                  <div className="text-center py-12">
                    <BookOpen className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h4 className="text-lg font-medium text-gray-700 mb-2">Select a Yoga Pose</h4>
                    <p className="text-gray-500">Choose from the list to see step-by-step instructions</p>
                  </div>
                )}
              </div>
            </div>

            <div className="lg:w-1/2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {yogaPoses.map((pose) => (
                  <motion.div
                    key={pose.id}
                    whileHover={{ y: -5, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Card
                      className={`border-none shadow-sm hover:shadow-lg transition-all cursor-pointer ${selectedPose?.id === pose.id ? "ring-2 ring-zenPink" : ""}`}
                      onClick={() => handlePoseSelect(pose)}
                    >
                      <CardHeader className="pb-2">
                        <div className="flex items-center">
                          <div className={`p-2 rounded-full mr-2 ${pose.color}`}>
                            {pose.icon}
                          </div>
                          <CardTitle className="text-base">{pose.name}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{pose.description}</p>
                        <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                          <span className="text-zenPink text-xs flex items-center">
                            <ArrowRight className="h-3 w-3 mr-1" />
                            View details
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Yoga Benefits Section */}
      <section className="py-14 bg-gradient-to-br from-zenLightPink/10 via-zenPeach/5 to-white">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Yoga Benefits"
            subtitle="How yoga can enhance your daily life"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all"
            >
              <div className="bg-indigo-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Brain className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Mental Clarity</h3>
              <p className="text-gray-600 text-sm">
                Yoga enhances focus, memory, and cognitive function through mindful movement and breathwork.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all"
            >
              <div className="bg-emerald-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Activity className="h-6 w-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Physical Health</h3>
              <p className="text-gray-600 text-sm">
                Improves flexibility, strength, balance, and posture while reducing risk of injury.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all"
            >
              <div className="bg-amber-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Wind className="h-6 w-6 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Stress Relief</h3>
              <p className="text-gray-600 text-sm">
                Activates the parasympathetic nervous system to reduce stress and promote relaxation.
              </p>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all"
            >
              <div className="bg-sky-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Moon className="h-6 w-6 text-sky-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Better Sleep</h3>
              <p className="text-gray-600 text-sm">
                Evening practice helps regulate circadian rhythms and improves sleep quality.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Student Yoga Tips Section */}
      <section className="py-14 bg-white">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Student Yoga Hacks"
            subtitle="Creative ways to integrate yoga into campus life"
            className="text-center mb-12"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {studentYogaTips.map((tip) => (
              <motion.div 
                key={tip.id}
                whileHover={{ y: -8, scale: 1.02 }}
                className={`rounded-2xl p-6 shadow-lg border ${tip.borderClass} relative overflow-hidden cursor-pointer ${tip.bgClass}`}
                onClick={() => setSelectedTip(tip)}
              >
                <div className="absolute -top-6 -right-6 w-32 h-32 opacity-20 rounded-full" style={{ backgroundColor: tip.tagTextClass.replace('text-', 'bg-') }}></div>
                <div className="relative z-10">
                  <div className={`w-16 h-16 ${tip.iconBgClass} rounded-xl flex items-center justify-center mb-4 shadow-md`}>
                    {tip.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-800">{tip.title}</h3>
                  <p className="text-gray-600 mb-4">{tip.shortDescription}</p>
                  <div className={`${tip.tagBgClass} px-3 py-1 rounded-full inline-block`}>
                    <span className={`text-xs font-medium ${tip.tagTextClass}`}>{tip.tag}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Modal for showing tip details */}
        {selectedTip && (
          <YogaTipModal 
            tip={selectedTip} 
            onClose={() => setSelectedTip(null)} 
          />
        )}
      </section>
    </Layout>
  );
}