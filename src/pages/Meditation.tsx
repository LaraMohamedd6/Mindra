import Layout from "@/components/layout/Layout";
import SectionHeading from "@/components/common/SectionHeading";
import BreatheAnimation from "@/components/meditation/BreatheAnimation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { Clock, Heart, Play, ChevronDown, Pause, Leaf, Moon, Sun, Activity, Brain, Smile, Zap } from "lucide-react";
/* import StressReleif from '@/assets/audios/StressReleif.mp3';
import MuscleRelaxation from '@/assets/audios/MuscleRelaxation.mp3';
import ForestVisualisation from '@/assets/audios/ForestVisualisation.mp3';   
import QuietNight from '@/assets/audios/QuietNight.mp3';   
import QuietTime from '@/assets/audios/QuietTime.mp3';   
import PentatonicWaves from '@/assets/audios/PentatonicWaves.mp3';   
import bannermed from '@/assets/images/bannermed.jpg'; */

const Meditation = () => {
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement | null }>({});
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const [savedItems, setSavedItems] = useState<number[]>([]);
  const meditationSectionRef = useRef<HTMLDivElement>(null);

  const toggleAudio = (audioId: string) => {
    const audio = audioRefs.current[audioId];
    if (audio) {
      if (audio.paused) {
        Object.values(audioRefs.current).forEach(a => {
          if (a && a.id !== audioId) {
            a.pause();
            a.currentTime = 0;
          }
        });
        audio.play();
        setPlayingAudio(audioId);
      } else {
        audio.pause();
        audio.currentTime = 0;
        setPlayingAudio(null);
      }
    }
  };

  const toggleSave = (id: number) => {
    setSavedItems(prev => 
      prev.includes(id) 
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    );
  };

  const handleStartMeditatingClick = () => {
    if (meditationSectionRef.current) {
      meditationSectionRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const meditationClasses = [
    {
      id: 1,
      title: "5 Minute Meditation for Relaxation and Positive Energy",
      duration: "5:38 mins",
      level: "Beginner",
      description: "Within you, there is a stillness and a sanctuary to which you can retreat at any time and be yourself.",
      videoId: "VpHz8Mb13_Y",
      benefits: ["Improved focus", "Higher energy", "Better posture"],
    },
    {
      id: 2,
      title: "Guided Meditation for Reprogramming your Mind",
      duration: "13:15 mins",
      level: "All levels",
      description: "You are the narrator of your own story — rewrite it with love, courage, and intention.",
      videoId: "tqhxMUm7XXU",
      benefits: ["Reduced stress", "Mental clarity", "Emotional balance"],
    },
    {
      id: 3,
      title: "Guided Self-Love Meditation",
      duration: "9:18 mins",
      level: "All Levels",
      description: "You, yourself, as much as anybody in the entire universe, deserve your love and affection.",
      videoId: "vj0JDwQLof4",
      benefits: ["Relieved muscle tension", "Improved circulation", "Reduced eye strain"],
    },
  ];

  const benefits = [
    {
      icon: <Leaf className="h-8 w-8" />,
      title: "Reduced Stress",
      description: "Meditation decreases cortisol levels, helping you manage stress more effectively."
    },
    {
      icon: <Moon className="h-8 w-8" />,
      title: "Better Sleep",
      description: "Regular practice can improve sleep quality and help with insomnia."
    },
    {
      icon: <Sun className="h-8 w-8" />,
      title: "Increased Focus",
      description: "Enhances your ability to concentrate and maintain attention."
    },
    {
      icon: <Activity className="h-8 w-8" />,
      title: "Emotional Health",
      description: "Promotes emotional well-being and a more positive outlook on life."
    },
    {
      icon: <Brain className="h-8 w-8" />,
      title: "Mental Clarity",
      description: "Clears mental fog and improves decision-making abilities."
    },
    {
      icon: <Smile className="h-8 w-8" />,
      title: "Self-Awareness",
      description: "Helps you develop a stronger understanding of yourself."
    }
  ];

  const tips = [
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Start Small",
      description: "Begin with just 5 minutes a day and gradually increase."
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Be Consistent",
      description: "Try to meditate at the same time each day to build a habit."
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Find Your Spot",
      description: "Choose a quiet, comfortable place where you won't be disturbed."
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Focus on Breath",
      description: "When your mind wanders, gently return your focus to your breathing."
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Be Patient",
      description: "Don't judge your practice - some days will be easier than others."
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Use Guidance",
      description: "Guided meditations can be helpful when starting out."
    }
  ];

  return (
    <Layout>
      {/* Hero Banner with Blur Effect */}
      <section className="relative h-[600px] py-16 bg-gradient-to-br from-zenLightPink/30 to-white/30 overflow-hidden rounded-b-[40px]">
        <div className="absolute inset-0 z-0 h-full w-full">
          <img
            src={bannermed}
            alt="Meditation background"
            className="w-full h-full object-cover blur-[2px] brightness-90 scale-110"
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-zenLightPink/40 to-white/30 z-0"></div>

        <div className="container mx-auto px-4 relative z-10 h-full flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.h1
              className="text-3xl md:text-5xl font-display font-bold mb-6 text-white [text-shadow:_0_2px_8px_rgb(0_0_0_/_50%)]"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Meditation & Mindfulness
            </motion.h1>

            <motion.p
              className="text-xl md:text-2xl font-medium text-white/90 mb-8 [text-shadow:_0_1px_3px_rgb(0_0_0_/_40%)]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              Find your center with guided practices designed to help students reduce stress and improve focus
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row justify-center gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <Button
                className="bg-zenPink hover:bg-zenPink/90 text-white px-8 py-6 text-lg font-semibold rounded-full shadow-lg transition-all hover:scale-105 flex items-center"
                size="lg"
                onClick={handleStartMeditatingClick}
              >
                Start Meditating Now
                <ChevronDown className="ml-2 h-5 w-5" />
              </Button>

              <Button
                variant="outline"
                className="bg-transparent border-2 border-white text-white hover:bg-white/20 px-8 py-6 text-lg font-semibold rounded-full shadow-lg transition-all hover:scale-105"
                size="lg"
                onClick={() => {
                  window.open('https://www.mindful.org/meditation/mindfulness-getting-started/', '_blank');
                }}
              >
                Learn More
              </Button>
            </motion.div>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 w-full overflow-hidden h-20">
          <div className="absolute -bottom-10 w-[110%] left-1/2 -translate-x-1/2 h-40 bg-white rounded-full"></div>
        </div>

        {/* Floating decorative elements */}
        <motion.div
          className="absolute top-1/4 left-10 w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm"
          animate={{
            y: [0, -15, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        <motion.div
          className="absolute bottom-1/3 right-20 w-12 h-12 rounded-full bg-white/15 backdrop-blur-sm"
          animate={{
            y: [0, 15, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
      </section>

      {/* Breathe Exercise Section with ref */}
      <section ref={meditationSectionRef} className="py-16">
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
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="stress">Stress Relief</TabsTrigger>
                  <TabsTrigger value="sleep">Sleep</TabsTrigger>
                </TabsList>

                <TabsContent value="stress" className="space-y-4">
                  {[
                    {
                      id: "stress-1",
                      title: "Quick Stress Relief",
                      duration: "3:21",
                      instructor: "David Robson",
                      audioSrc: StressReleif
                    },
                    {
                      id: "stress-2",
                      title: "Progressive Muscle Relaxation",
                      duration: "12:05",
                      instructor: "Milla Brown",
                      audioSrc: MuscleRelaxation
                    },
                    {
                      id: "stress-3",
                      title: "Guided Forest Visualisation",
                      duration: "11:24",
                      instructor: "Sarah Johnson",
                      audioSrc: ForestVisualisation
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
                          {playingAudio === meditation.id ? (
                            <>
                              <Pause className="h-4 w-4 mr-2" />
                              Pause
                            </>
                          ) : (
                            <>
                              <Play className="h-4 w-4 mr-2" />
                              Play
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="sleep" className="space-y-4">
                  {[
                    {
                      id: "sleep-1",
                      title: "Quiet Night",
                      duration: "1:01",
                      instructor: "Mia Johnson",
                      audioSrc: QuietNight
                    },
                    {
                      id: "sleep-2",
                      title: "Pre-Sleep Relaxation",
                      duration: "11:24",
                      instructor: "Dr. Emma Wilson",
                      audioSrc: QuietTime
                    },
                    {
                      id: "sleep-3",
                      title: "Pentatonic Waves",
                      duration: "5:02",
                      instructor: "Michael Chen",
                      audioSrc: PentatonicWaves
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
                          {playingAudio === meditation.id ? (
                            <>
                              <Pause className="h-4 w-4 mr-2" />
                              Pause
                            </>
                          ) : (
                            <>
                              <Play className="h-4 w-4 mr-2" />
                              Play
                            </>
                          )}
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

      {/* Meditation Video Classes */}
      <section className="py-14 bg-white">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Meditation for Students"
            subtitle="Practices designed to fit into your busy schedule"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {meditationClasses.map((meditationClass, index) => (
              <motion.div
                key={meditationClass.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all"
              >
                <div className="aspect-video relative">
                  <iframe
                    className="absolute inset-0 w-full h-full"
                    src={`https://www.youtube.com/embed/${meditationClass.videoId}`}
                    title={meditationClass.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="bg-zenLightPink text-zenPink text-xs px-2 py-1 rounded-full">{meditationClass.duration}</span>
                    <span className="text-xs text-gray-500">{meditationClass.level}</span>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{meditationClass.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{meditationClass.description}</p>
                  <div className="mb-4">
                    <h4 className="text-xs font-medium text-gray-500 mb-1">BENEFITS:</h4>
                    <div className="flex flex-wrap gap-1">
                      {meditationClass.benefits.map((benefit, i) => (
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
                      className="text-zenPink hover:text-zenPink/90 hover:bg-zenLightPink/10 p-0"
                      onClick={() => toggleSave(meditationClass.id)}
                    >
                      {savedItems.includes(meditationClass.id) ? (
                        <Heart className="h-4 w-4 mr-1 fill-zenPink" />
                      ) : (
                        <Heart className="h-4 w-4 mr-1" />
                      )}
                      Save
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits of Meditation */}
      <section className="py-16 bg-zenLightPink/20">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Benefits of Meditation"
            subtitle="How regular practice can improve your life"
            centered
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 text-center"
              >
                <div className="bg-zenPink/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-zenPink">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Meditation Tips */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Meditation Tips for Beginners"
            subtitle="Simple advice to help you get started"
            centered
          />

          <div className="max-w-4xl mx-auto mt-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tips.map((tip, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                  className="flex items-start space-x-4 bg-gray-50 p-4 rounded-lg"
                >
                  <div className="bg-zenSage/10 p-2 rounded-full text-zenSage mt-1">
                    {tip.icon}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{tip.title}</h3>
                    <p className="text-gray-600 text-sm mt-1">{tip.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Meditation;