
import Layout from "@/components/layout/Layout";
import { motion } from "framer-motion";
import SectionHeading from "@/components/common/SectionHeading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Heart, UserCheck, Wind, Moon, Sun, Flame } from "lucide-react";
import BreatheAnimation from "@/components/meditation/BreatheAnimation";

export default function Yoga() {
  const yogaClasses = [
    {
      id: 1,
      title: "Morning Flow for Students",
      duration: "15 mins",
      level: "All Levels",
      description: "Energizing morning sequence to wake up your body and mind before class.",
      videoId: "gFkJ0wXP7eM",
      benefits: ["Improved focus", "Higher energy", "Better posture"],
      instructor: "Sarah Johnson"
    },
    {
      id: 2,
      title: "Stress-Relief Yoga",
      duration: "20 mins",
      level: "Beginner",
      description: "Gentle stretches and poses to release tension from studying and exams.",
      videoId: "qJzfT3Bc_p0",
      benefits: ["Reduced stress", "Mental clarity", "Emotional balance"],
      instructor: "Michael Chen"
    },
    {
      id: 3,
      title: "Desk Break Yoga",
      duration: "10 mins",
      level: "All Levels",
      description: "Quick stretches you can do at your desk to prevent stiffness during long study sessions.",
      videoId: "tAUf7aajBWE",
      benefits: ["Relieved muscle tension", "Improved circulation", "Reduced eye strain"],
      instructor: "Emma Wilson"
    },
  ];

  const breathingExercises = [
    {
      id: 1,
      name: "4-7-8 Breathing",
      description: "Inhale for 4 counts, hold for 7 counts, exhale for 8 counts",
      benefits: "Reduces anxiety and helps with sleep",
      icon: <Moon className="h-5 w-5" />,
      color: "bg-indigo-100 text-indigo-600"
    },
    {
      id: 2,
      name: "Box Breathing",
      description: "Equal counts of inhale, hold, exhale, and hold again",
      benefits: "Improves concentration and performance under pressure",
      icon: <UserCheck className="h-5 w-5" />,
      color: "bg-emerald-100 text-emerald-600"
    },
    {
      id: 3,
      name: "Energizing Breath",
      description: "Quick inhales and exhales through the nose to boost energy",
      benefits: "Increases alertness before exams or presentations",
      icon: <Sun className="h-5 w-5" />,
      color: "bg-amber-100 text-amber-600"
    },
    {
      id: 4,
      name: "Alternate Nostril Breathing",
      description: "Alternating breath between left and right nostrils",
      benefits: "Balances the mind and reduces stress",
      icon: <Wind className="h-5 w-5" />,
      color: "bg-sky-100 text-sky-600"
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 bg-gradient-to-br from-zenLightPink/30 via-zenPeach/20 to-white overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="container mx-auto px-4 relative z-10"
        >
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 text-gray-800">
              Student Yoga Practice
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8">
              Simple, effective yoga sequences designed to fit into busy student schedules and small spaces.
            </p>
            <Button className="bg-zenPink hover:bg-zenPink/90 text-white">
              Start Your Practice
            </Button>
          </div>
        </motion.div>
        
        {/* Abstract shape decoration */}
        <div className="absolute right-0 top-1/4 transform translate-x-1/3 -translate-y-1/4 opacity-20">
          <svg width="500" height="500" viewBox="0 0 500 500" fill="none">
            <circle cx="250" cy="250" r="250" fill="#E69EA2" />
          </svg>
        </div>
      </section>

      {/* Yoga Video Section */}
      <section className="py-14 bg-white">
        <div className="container mx-auto px-4">
          <SectionHeading 
            title="Yoga for Students" 
            subtitle="Practices designed to fit into your busy schedule"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {yogaClasses.map((yogaClass, index) => (
              <motion.div
                key={yogaClass.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all"
              >
                <div className="aspect-video relative">
                  <iframe
                    className="absolute inset-0 w-full h-full"
                    src={`https://www.youtube.com/embed/${yogaClass.videoId}`}
                    title={yogaClass.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
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
                    <span className="text-xs text-gray-500">Instructor: {yogaClass.instructor}</span>
                    <Button variant="ghost" size="sm" className="text-zenPink hover:text-zenPink/90 hover:bg-zenLightPink/10 p-0">
                      <Heart className="h-4 w-4 mr-1" /> Save
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Breathing Exercises Section */}
      <section className="py-14 bg-gray-50">
        <div className="container mx-auto px-4">
          <SectionHeading 
            title="Breathing Exercises" 
            subtitle="Calm your mind and reduce stress in minutes"
          />

          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/2">
              <div className="rounded-xl bg-white p-6 shadow-sm">
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-2">Practice Mindful Breathing</h3>
                  <p className="text-gray-600">
                    Follow the animation to practice deep, mindful breathing. This simple exercise can help reduce stress
                    and improve focus before exams or study sessions.
                  </p>
                </div>
                
                <div className="flex justify-center py-8">
                  <BreatheAnimation />
                </div>

                <div className="flex justify-center mt-6">
                  <div className="inline-flex rounded-md bg-zenLightPink/30 p-1">
                    {["1 min", "2 min", "5 min", "10 min"].map((time, i) => (
                      <Button
                        key={i}
                        variant={i === 1 ? "default" : "ghost"}
                        className={i === 1 ? "bg-white shadow-sm" : "hover:bg-white/50"}
                        size="sm"
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="md:w-1/2">
              <Tabs defaultValue="techniques" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="techniques">Techniques</TabsTrigger>
                  <TabsTrigger value="benefits">Benefits</TabsTrigger>
                </TabsList>
                
                <TabsContent value="techniques">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {breathingExercises.map((exercise) => (
                      <Card key={exercise.id} className="border-none shadow-sm">
                        <CardHeader className="pb-2">
                          <div className="flex items-center">
                            <div className={`p-2 rounded-full mr-2 ${exercise.color}`}>
                              {exercise.icon}
                            </div>
                            <CardTitle className="text-base">{exercise.name}</CardTitle>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-600 mb-2">{exercise.description}</p>
                          <CardDescription className="text-zenPink">{exercise.benefits}</CardDescription>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="benefits">
                  <Card>
                    <CardContent className="pt-6">
                      <ul className="space-y-4">
                        <li className="flex items-start">
                          <div className="bg-zenLightPink p-1 rounded-full mr-3 mt-1">
                            <Flame className="h-4 w-4 text-zenPink" />
                          </div>
                          <div>
                            <h4 className="font-medium mb-1">Reduces Exam Anxiety</h4>
                            <p className="text-sm text-gray-600">Deep breathing activates the parasympathetic nervous system, lowering heart rate and blood pressure during stressful academic periods.</p>
                          </div>
                        </li>
                        <li className="flex items-start">
                          <div className="bg-zenLightPink p-1 rounded-full mr-3 mt-1">
                            <Flame className="h-4 w-4 text-zenPink" />
                          </div>
                          <div>
                            <h4 className="font-medium mb-1">Improves Focus</h4>
                            <p className="text-sm text-gray-600">Regular breathing practice increases oxygen flow to the brain, enhancing concentration and memory retention during study sessions.</p>
                          </div>
                        </li>
                        <li className="flex items-start">
                          <div className="bg-zenLightPink p-1 rounded-full mr-3 mt-1">
                            <Flame className="h-4 w-4 text-zenPink" />
                          </div>
                          <div>
                            <h4 className="font-medium mb-1">Better Sleep Quality</h4>
                            <p className="text-sm text-gray-600">Specific breathing techniques before bedtime can help students fall asleep faster and experience more restful sleep, crucial for academic performance.</p>
                          </div>
                        </li>
                        <li className="flex items-start">
                          <div className="bg-zenLightPink p-1 rounded-full mr-3 mt-1">
                            <Flame className="h-4 w-4 text-zenPink" />
                          </div>
                          <div>
                            <h4 className="font-medium mb-1">Emotional Regulation</h4>
                            <p className="text-sm text-gray-600">Conscious breathing helps students manage emotional responses to academic pressure and social challenges.</p>
                          </div>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </section>
      
      {/* Practice Tips Section */}
      <section className="py-14 bg-white">
        <div className="container mx-auto px-4">
          <SectionHeading 
            title="Yoga Practice Tips for Students" 
            subtitle="Make the most of your limited space and time"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-zenLightPink/30 rounded-xl p-6"
            >
              <div className="mb-4 inline-block p-3 bg-white rounded-full">
                <Clock className="h-6 w-6 text-zenPink" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Short & Consistent</h3>
              <p className="text-gray-600">
                Even 5-10 minutes of daily practice is more beneficial than an hour-long session once a week. 
                Set a specific time each day for your practice, such as right after waking up or before studying.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-zenMint/30 rounded-xl p-6"
            >
              <div className="mb-4 inline-block p-3 bg-white rounded-full">
                <Wind className="h-6 w-6 text-zenSage" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Focus on Breath</h3>
              <p className="text-gray-600">
                When time is limited, prioritize breathing exercises. Deep breathing before an exam or presentation 
                can quickly reduce anxiety and improve focus in just a few minutes.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-zenSeafoam/30 rounded-xl p-6"
            >
              <div className="mb-4 inline-block p-3 bg-white rounded-full">
                <Moon className="h-6 w-6 text-zenSage" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Desk Yoga</h3>
              <p className="text-gray-600">
                Learn simple stretches you can do at your desk during study breaks. These micro-practices help 
                prevent tension buildup during long study sessions and improve circulation.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-14 bg-gradient-to-br from-zenLightPink/30 via-zenPeach/20 to-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-display font-semibold mb-4">Join Our Student Yoga Community</h2>
            <p className="text-gray-600 mb-6">
              Connect with fellow students, share your practice, and get support from our instructors.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button className="bg-zenPink hover:bg-zenPink/90 text-white">
                Start Free Trial
              </Button>
              <Button variant="outline" className="border-zenPink text-zenPink hover:bg-zenPink/10">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
