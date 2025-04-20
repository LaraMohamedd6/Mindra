import Layout from "@/components/layout/Layout";
import SectionHeading from "@/components/common/SectionHeading";
import BreatheAnimation from "@/components/meditation/BreatheAnimation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { Play, Clock, Volume2 } from "lucide-react";
import { useRef } from "react";
 
const Meditation = () => {
  // Audio refs for each meditation track
  const audioRefs = useRef<{[key: string]: HTMLAudioElement | null}>({});
  
  // Function to play/pause audio
  const toggleAudio = (audioId: string) => {
    const audio = audioRefs.current[audioId];
    if (audio) {
      if (audio.paused) {
        // Pause all other audio elements
        Object.values(audioRefs.current).forEach(a => {
          if (a && a.id !== audioId) {
            a.pause();
            a.currentTime = 0;
          }
        });
        audio.play();
      } else {
        audio.pause();
        audio.currentTime = 0;
      }
    }
  };

  return (
    <Layout>
      <section className="relative h-[400px] py-16 bg-gradient-to-br from-zenLightPink to-white overflow-hidden">
        {/* Semi-transparent Background Image */}
        <div className="absolute inset-0 z-0 opacity-40 h-[450px] min-h-[300px]">
          {/* Increased height with viewport units + minimum */}
          <img
            src="https://img.freepik.com/free-photo/close-up-kid-meditating-mat_23-2149101612.jpg?t=st=1745170911~exp=1745174511~hmac=81c482c7a7bafb964e81c19e3bcd398003b245866dadcae5ead9746d0974be46&w=1800"
            alt="Meditation background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-amber-100/5"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl mt-[100px] font-display font-bold mb-4 text-gray-800">
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
                      id: "stress-1",
                      title: "Quick Stress Relief",
                      duration: "5 min",
                      instructor: "Dr. Emma Wilson",
                      audioSrc: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
                    },
                    {
                      id: "stress-2",
                      title: "Exam Anxiety Meditation",
                      duration: "10 min",
                      instructor: "Michael Chen",
                      audioSrc: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3"
                    },
                    {
                      id: "stress-3",
                      title: "Release & Relax",
                      duration: "15 min",
                      instructor: "Sarah Johnson",
                      audioSrc: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3"
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
                      <div className="flex items-center">
                        <audio
                          ref={(el) => (audioRefs.current[meditation.id] = el)}
                          id={meditation.id}
                          src={meditation.audioSrc}
                          preload="metadata"
                        />
                        <Button 
                          size="sm" 
                          className="bg-zenSage hover:bg-zenSage/90 text-white"
                          onClick={() => toggleAudio(meditation.id)}
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Play
                        </Button>
                      </div>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="focus" className="space-y-4">
                  {[
                    {
                      id: "focus-1",
                      title: "Study Session Focus",
                      duration: "8 min",
                      instructor: "Dr. Emma Wilson",
                      audioSrc: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3"
                    },
                    {
                      id: "focus-2",
                      title: "Deep Concentration",
                      duration: "12 min",
                      instructor: "Michael Chen",
                      audioSrc: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3"
                    },
                    {
                      id: "focus-3",
                      title: "Mind Clearing",
                      duration: "10 min",
                      instructor: "Sarah Johnson",
                      audioSrc: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3"
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
                      <div className="flex items-center">
                        <audio
                          ref={(el) => (audioRefs.current[meditation.id] = el)}
                          id={meditation.id}
                          src={meditation.audioSrc}
                          preload="metadata"
                        />
                        <Button 
                          size="sm" 
                          className="bg-zenSage hover:bg-zenSage/90 text-white"
                          onClick={() => toggleAudio(meditation.id)}
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Play
                        </Button>
                      </div>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="sleep" className="space-y-4">
                  {[
                    {
                      id: "sleep-1",
                      title: "Evening Wind Down",
                      duration: "20 min",
                      instructor: "Sarah Johnson",
                      audioSrc: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3"
                    },
                    {
                      id: "sleep-2",
                      title: "Pre-Sleep Relaxation",
                      duration: "15 min",
                      instructor: "Dr. Emma Wilson",
                      audioSrc: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3"
                    },
                    {
                      id: "sleep-3",
                      title: "Deep Sleep Meditation",
                      duration: "30 min",
                      instructor: "Michael Chen",
                      audioSrc: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3"
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
                      <div className="flex items-center">
                        <audio
                          ref={(el) => (audioRefs.current[meditation.id] = el)}
                          id={meditation.id}
                          src={meditation.audioSrc}
                          preload="metadata"
                        />
                        <Button 
                          size="sm" 
                          className="bg-zenSage hover:bg-zenSage/90 text-white"
                          onClick={() => toggleAudio(meditation.id)}
                        >
                          <Play className="h-4 w-4 mr-2" />
                          Play
                        </Button>
                      </div>
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
                id: "nature",
                title: "Nature Sounds",
                description: "Gentle forest, beach, and rainfall sounds",
                icon: <Volume2 className="h-6 w-6" />,
                audioSrc: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3"
              },
              {
                id: "body-scan",
                title: "Body Scan",
                description: "A relaxing full-body awareness practice",
                icon: <Volume2 className="h-6 w-6" />,
                audioSrc: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3"
              },
              {
                id: "loving-kindness",
                title: "Loving-Kindness",
                description: "Generate positive emotions and compassion",
                icon: <Volume2 className="h-6 w-6" />,
                audioSrc: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3"
              },
              {
                id: "walking",
                title: "Mindful Walking",
                description: "Practice mindfulness while in motion",
                icon: <Volume2 className="h-6 w-6" />,
                audioSrc: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3"
              },
              {
                id: "gratitude",
                title: "Gratitude Practice",
                description: "Cultivate appreciation and positivity",
                icon: <Volume2 className="h-6 w-6" />,
                audioSrc: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3"
              },
              {
                id: "study-break",
                title: "Study Break Resets",
                description: "Quick practices between study sessions",
                icon: <Volume2 className="h-6 w-6" />,
                audioSrc: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3"
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
                  <div className="flex items-center">
                    <audio
                      ref={(el) => (audioRefs.current[item.id] = el)}
                      id={item.id}
                      src={item.audioSrc}
                      preload="metadata"
                    />
                    <Button 
                      className="w-full bg-zenSage hover:bg-zenSage/90 text-white"
                      onClick={() => toggleAudio(item.id)}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Listen Now
                    </Button>
                  </div>
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