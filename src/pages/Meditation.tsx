import Layout from "@/components/layout/Layout";
import SectionHeading from "@/components/common/SectionHeading";
import BreatheAnimation from "@/components/meditation/BreatheAnimation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { Clock, Heart, Play, Volume2, Pause } from "lucide-react";
import forest from '@/assets/audios/forest.mp3';
import bodyscan from '@/assets/audios/bodyscan.mp3';
import lk from '@/assets/audios/lk.mp3';
import wm from '@/assets/audios/wm.m4a';
import GratitudePractice from '@/assets/audios/GratitudePractice.mp3';
import SelfLove from '@/assets/audios/SelfLove.mp3';
import StressReleif from '@/assets/audios/StressReleif.mp3';
import MuscleRelaxation from '@/assets/audios/MuscleRelaxation.mp3';
import ForestVisualisation from '@/assets/audios/ForestVisualisation.mp3';   
import QuietNight from '@/assets/audios/QuietNight.mp3';   
import QuietTime from '@/assets/audios/QuietTime.mp3';   
import PentatonicWaves from '@/assets/audios/PentatonicWaves.mp3';   

const Meditation = () => {
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement | null }>({});
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const [savedItems, setSavedItems] = useState<number[]>([]);

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

  return (
    <Layout>
      {/* Hero Banner with Blur Effect */}
      <section className="relative h-[580px] py-16 bg-gradient-to-br from-zenLightPink/30 to-white/30 overflow-hidden rounded-b-[40px]">
        <div className="absolute inset-0 z-0 h-full w-full">
          <img
            src="https://img.freepik.com/free-photo/people-working-tech-brand-together_23-2150966122.jpg"
            alt="Meditation background"
            className="w-full h-full object-cover blur-[8px] brightness-90 scale-110"
          />
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-zenLightPink/30 to-white/30 z-0"></div>
        
        <div className="container mx-auto px-4 relative z-10 h-full flex flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 text-zenPink [text-shadow:_0_2px_4px_rgb(0_0_0_/_40%)]">
              Meditation & Mindfulness
            </h1>
            <p className="text-lg font-bold text-white/90 [text-shadow:_0_1px_2px_rgb(0_0_0_/_30%)]">
              Find your center with guided practices designed to help students reduce stress and improve focus
            </p>
          </motion.div>
        </div>
        
        <div className="absolute bottom-0 left-0 w-full overflow-hidden h-20">
          <div className="absolute -bottom-10 w-[110%] left-1/2 -translate-x-1/2 h-40 bg-white rounded-full"></div>
        </div>
      </section>

      {/* Breathe Exercise and Guided Meditations */}
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

      {/* Mindfulness Audio Library */}
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
                audioSrc: forest
              },
              {
                id: "body-scan",
                title: "Body Scan",
                description: "A relaxing full-body awareness practice",
                icon: <Volume2 className="h-6 w-6" />,
                audioSrc: bodyscan
              },
              {
                id: "loving-kindness",
                title: "Loving-Kindness",
                description: "Generate positive emotions and compassion",
                icon: <Volume2 className="h-6 w-6" />,
                audioSrc: lk
              },
              {
                id: "walking",
                title: "Mindful Walking",
                description: "Practice mindfulness while in motion",
                icon: <Volume2 className="h-6 w-6" />,
                audioSrc: wm
              },
              {
                id: "gratitude",
                title: "Gratitude Practice",
                description: "Cultivate appreciation and positivity",
                icon: <Volume2 className="h-6 w-6" />,
                audioSrc: GratitudePractice
              },
              {
                id: "self-love",
                title: "Self Love",
                description: "Learn to love yourself",
                icon: <Volume2 className="h-6 w-6" />,
                audioSrc: SelfLove
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
                      {playingAudio === item.id ? (
                        <>
                          <Pause className="h-4 w-4 mr-2" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          Listen Now
                        </>
                      )}
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