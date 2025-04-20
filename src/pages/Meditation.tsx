
import Layout from "@/components/layout/Layout";
import SectionHeading from "@/components/common/SectionHeading";
import BreatheAnimation from "@/components/meditation/BreatheAnimation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { Play, Clock, Volume2 } from "lucide-react";

const Meditation = () => {
  return (
    <Layout>
      <section className="relative py-16 bg-gradient-to-br from-zenLightPink to-white overflow-hidden">
        {/* Semi-transparent Background Image */}
        <div className="absolute inset-0 z-0 opacity-40"> {/* Adjust opacity here (0-100) */}
          <img
            src="https://images.unsplash.com/photo-1571260899304-425eee4c7efc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
            alt="Meditation background"
            className="w-full h-full object-cover"
          />
          {/* Optional: Very light overlay to soften the image */}
          <div className="absolute inset-0 bg-black/10"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 text-gray-800">
              Meditation & Mindfulness
            </h1>
            <p className="text-lg text-gray-700">
              Find your center with guided practices designed to help students reduce stress and improve focus
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-3xl font-display font-semibold mb-6">Breathe Exercise</h2>
              <p className="text-gray-700 mb-4">
                This simple breathing exercise can help calm your mind, reduce stress, and improve focus. Follow the animation and breathe along.
              </p>
              <div className="bg-white p-8 rounded-2xl shadow-md">
                <BreatheAnimation />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-3xl font-display font-semibold mb-6">Guided Meditations</h2>
              <p className="text-gray-700 mb-6">
                Choose from our collection of guided meditations designed specifically for students.
              </p>

              <Tabs defaultValue="stress">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="stress">Stress Relief</TabsTrigger>
                  <TabsTrigger value="focus">Focus</TabsTrigger>
                  <TabsTrigger value="sleep">Sleep</TabsTrigger>
                </TabsList>

                <TabsContent value="stress" className="space-y-4">
                  {[
                    {
                      title: "Quick Stress Relief",
                      duration: "5 min",
                      instructor: "Dr. Emma Wilson"
                    },
                    {
                      title: "Exam Anxiety Meditation",
                      duration: "10 min",
                      instructor: "Michael Chen"
                    },
                    {
                      title: "Release & Relax",
                      duration: "15 min",
                      instructor: "Sarah Johnson"
                    }
                  ].map((meditation, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex justify-between items-center"
                    >
                      <div>
                        <h3 className="font-medium text-lg">{meditation.title}</h3>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <Clock className="h-4 w-4 mr-1" />
                          <span className="mr-3">{meditation.duration}</span>
                          <span>with {meditation.instructor}</span>
                        </div>
                      </div>
                      <Button size="sm" className="bg-zenSage hover:bg-zenSage/90 text-white">
                        <Play className="h-4 w-4 mr-2" />
                        Play
                      </Button>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="focus" className="space-y-4">
                  {[
                    {
                      title: "Study Session Focus",
                      duration: "8 min",
                      instructor: "Dr. Emma Wilson"
                    },
                    {
                      title: "Deep Concentration",
                      duration: "12 min",
                      instructor: "Michael Chen"
                    },
                    {
                      title: "Mind Clearing",
                      duration: "10 min",
                      instructor: "Sarah Johnson"
                    }
                  ].map((meditation, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex justify-between items-center"
                    >
                      <div>
                        <h3 className="font-medium text-lg">{meditation.title}</h3>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <Clock className="h-4 w-4 mr-1" />
                          <span className="mr-3">{meditation.duration}</span>
                          <span>with {meditation.instructor}</span>
                        </div>
                      </div>
                      <Button size="sm" className="bg-zenSage hover:bg-zenSage/90 text-white">
                        <Play className="h-4 w-4 mr-2" />
                        Play
                      </Button>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="sleep" className="space-y-4">
                  {[
                    {
                      title: "Evening Wind Down",
                      duration: "20 min",
                      instructor: "Sarah Johnson"
                    },
                    {
                      title: "Pre-Sleep Relaxation",
                      duration: "15 min",
                      instructor: "Dr. Emma Wilson"
                    },
                    {
                      title: "Deep Sleep Meditation",
                      duration: "30 min",
                      instructor: "Michael Chen"
                    }
                  ].map((meditation, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex justify-between items-center"
                    >
                      <div>
                        <h3 className="font-medium text-lg">{meditation.title}</h3>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <Clock className="h-4 w-4 mr-1" />
                          <span className="mr-3">{meditation.duration}</span>
                          <span>with {meditation.instructor}</span>
                        </div>
                      </div>
                      <Button size="sm" className="bg-zenSage hover:bg-zenSage/90 text-white">
                        <Play className="h-4 w-4 mr-2" />
                        Play
                      </Button>
                    </div>
                  ))}
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-zenMint">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Mindfulness Audio Library"
            subtitle="Soothing sounds and guided practices to help you find your calm"
            centered
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {[
              {
                title: "Nature Sounds",
                description: "Gentle forest, beach, and rainfall sounds",
                icon: <Volume2 className="h-6 w-6" />
              },
              {
                title: "Body Scan",
                description: "A relaxing full-body awareness practice",
                icon: <Volume2 className="h-6 w-6" />
              },
              {
                title: "Loving-Kindness",
                description: "Generate positive emotions and compassion",
                icon: <Volume2 className="h-6 w-6" />
              },
              {
                title: "Mindful Walking",
                description: "Practice mindfulness while in motion",
                icon: <Volume2 className="h-6 w-6" />
              },
              {
                title: "Gratitude Practice",
                description: "Cultivate appreciation and positivity",
                icon: <Volume2 className="h-6 w-6" />
              },
              {
                title: "Study Break Resets",
                description: "Quick practices between study sessions",
                icon: <Volume2 className="h-6 w-6" />
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="p-6">
                  <div className="bg-zenSeafoam w-12 h-12 rounded-full flex items-center justify-center mb-4">
                    <div className="text-zenSage">
                      {item.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-600 mb-4">{item.description}</p>
                  <Button className="w-full bg-zenSage hover:bg-zenSage/90 text-white">
                    <Play className="h-4 w-4 mr-2" />
                    Listen Now
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Meditation;
