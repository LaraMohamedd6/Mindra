import Layout from "@/components/layout/Layout";
import SectionHeading from "@/components/common/SectionHeading";
import BreatheAnimation from "@/components/meditation/BreatheAnimation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import {
  Clock,
  Heart,
  Play,
  ChevronDown,
  Pause,
  Leaf,
  Moon,
  Sun,
  Activity,
  Brain,
  Smile,
  Zap,
} from "lucide-react";
import StressReleif from "@/assets/audios/StressReleif.mp3";
import MuscleRelaxation from "@/assets/audios/MuscleRelaxation.mp3";
import ForestVisualisation from "@/assets/audios/ForestVisualisation.mp3";
import QuietNight from "@/assets/audios/QuietNight.mp3";
import QuietTime from "@/assets/audios/QuietTime.mp3";
import PentatonicWaves from "@/assets/audios/PentatonicWaves.mp3";
import bannermed from "@/assets/images/bannermed.jpg";
import { trackTime, getTimeSummary } from "@/services/timeTrackingService";
import { useAuth } from "@/hooks/use-auth";

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

const Meditation = () => {
  const { isAuthenticated } = useAuth();
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement | null }>({});
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  const [savedItems, setSavedItems] = useState<number[]>([]);
  const meditationSectionRef = useRef<HTMLDivElement>(null);
  const [timeSummary, setTimeSummary] = useState({
    todayTotal: 0,
    weekTotal: 0,
    monthTotal: 0,
    allTimeTotal: 0,
    byContentType: {} as Record<string, number>,
    recentDays: {} as Record<string, number>,
  });
  const videoStartTimes = useRef<{ [key: string]: number }>({});
  const audioStartTimes = useRef<{ [key: string]: number }>({});
  const players = useRef<{ [key: string]: any }>({});

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hours}h ${minutes}m ${secs}s`;
  };

  useEffect(() => {
    if (!isAuthenticated) return;

    const initTracking = async () => {
      try {
        const summary = await getTimeSummary();
        setTimeSummary(summary);
      } catch (error) {
        console.error("Error initializing tracking:", error);
      }
    };
    initTracking();
  }, [isAuthenticated]);

  useEffect(() => {
    // Initialize audio refs
    const audioIds = [
      "stress-0",
      "stress-1",
      "stress-2",
      "sleep-0",
      "sleep-1",
      "sleep-2",
    ];

    audioIds.forEach((id) => {
      if (!audioRefs.current[id]) {
        audioRefs.current[id] = new Audio();
      }
    });

    return () => {
      // Cleanup audio elements
      Object.values(audioRefs.current).forEach((audio) => {
        if (audio) {
          audio.pause();
          audio.src = "";
        }
      });
    };
  }, []);

  const toggleAudio = async (audioId: string) => {
    const audio = audioRefs.current[audioId];
    if (!audio) return;

    console.log(`Toggling audio: ${audioId}, isAuthenticated: ${isAuthenticated}, token: ${localStorage.getItem('token')}`);

    // Set audio source if needed
    if (!audio.src) {
      const audioMap = {
        "stress-0": StressReleif,
        "stress-1": MuscleRelaxation,
        "stress-2": ForestVisualisation,
        "sleep-0": QuietNight,
        "sleep-1": QuietTime,
        "sleep-2": PentatonicWaves,
      };
      audio.src = audioMap[audioId];
    }

    // Stop other audios
    Object.entries(audioRefs.current).forEach(([id, a]) => {
      if (a && id !== audioId) {
        a.pause();
        a.currentTime = 0;
      }
    });

    // Pause any playing video
    if (playingVideo) {
      const player = players.current[playingVideo];
      if (player && player.pauseVideo) {
        player.pauseVideo();
      }
    }

    if (audio.paused) {
      try {
        await audio.play();
        setPlayingAudio(audioId);
        audioStartTimes.current[audioId] = Date.now();
      } catch (error) {
        console.error("Error playing audio:", error);
      }
    } else {
      const sessionDuration = Math.floor(
        (Date.now() - audioStartTimes.current[audioId]) / 1000
      );

      if ((isAuthenticated || localStorage.getItem('token')) && sessionDuration > 0) {
        try {
          console.log(`Tracking audio: ${audioId}, duration: ${sessionDuration}s`);
          await trackTime(audioId, "audio", sessionDuration);
          const updatedSummary = await getTimeSummary();
          setTimeSummary(updatedSummary);
        } catch (error) {
          console.error("Error tracking audio session:", error);
        }
      } else {
        console.log(`Skipping audio tracking: isAuthenticated=${isAuthenticated}, token=${localStorage.getItem('token')}, duration=${sessionDuration}`);
      }

      audio.pause();
      audio.currentTime = 0;
      setPlayingAudio(null);
    }
  };

  useEffect(() => {
    const loadYouTubeAPI = () => {
      if (!window.YT) {
        console.log("Loading YouTube IFrame API");
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

        window.onYouTubeIframeAPIReady = initializePlayers;
      } else {
        console.log("YouTube API already loaded, initializing players");
        initializePlayers();
      }
    };

    loadYouTubeAPI();

    return () => {
      console.log("Cleaning up YouTube API");
      window.onYouTubeIframeAPIReady = () => { };
      Object.values(players.current).forEach(player => {
        if (player && player.destroy) {
          player.destroy();
        }
      });
      players.current = {};
    };
  }, []);

  const initializePlayers = () => {
    console.log("Initializing YouTube players");
    meditationClasses.forEach((meditationClass) => {
      if (!players.current[meditationClass.videoId]) {
        try {
          console.log(`Creating player for video: ${meditationClass.videoId}`);
          players.current[meditationClass.videoId] = new window.YT.Player(
            `player-${meditationClass.videoId}`,
            {
              height: '100%',
              width: '100%',
              videoId: meditationClass.videoId,
              playerVars: {
                autoplay: 0,
                controls: 1,
                rel: 0,
                enablejsapi: 1,
              },
              events: {
                onStateChange: (event: any) => handlePlayerStateChange(event, meditationClass.videoId),
                onError: (error: any) => console.error(`YouTube player error for ${meditationClass.videoId}:`, error),
              },
            }
          );
        } catch (error) {
          console.error(`Error initializing YouTube player for ${meditationClass.videoId}:`, error);
        }
      }
    });
  };

  const handlePlayerStateChange = async (event: any, videoId: string) => {
    if (!event || !event.target) {
      console.error('Invalid player event for video:', videoId);
      return;
    }

    const state = event.data;
    console.log(`Player state changed for ${videoId}: ${state}, playingVideo: ${playingVideo}, startTime: ${videoStartTimes.current[videoId]}, isAuthenticated: ${isAuthenticated}, token: ${localStorage.getItem('token')}`);

    try {
      switch (state) {
        case window.YT.PlayerState.PLAYING:
          console.log(`Video ${videoId} started playing`);
          // Stop any playing audio
          if (playingAudio) {
            const audio = audioRefs.current[playingAudio];
            if (audio) {
              audio.pause();
              audio.currentTime = 0;
              const audioSessionDuration = Math.floor(
                (Date.now() - audioStartTimes.current[playingAudio]) / 1000
              );

              if ((isAuthenticated || localStorage.getItem('token')) && audioSessionDuration > 0) {
                console.log(`Tracking audio on video play: ${playingAudio}, duration: ${audioSessionDuration}s`);
                await trackTime(playingAudio, "audio", audioSessionDuration);
                const updatedSummary = await getTimeSummary();
                setTimeSummary(updatedSummary);
              }

              setPlayingAudio(null);
            }
          }

          // Stop any other playing video
          if (playingVideo && playingVideo !== videoId) {
            const otherPlayer = players.current[playingVideo];
            if (otherPlayer && otherPlayer.pauseVideo) {
              otherPlayer.pauseVideo();
              const videoSessionDuration = Math.floor(
                (Date.now() - videoStartTimes.current[playingVideo]) / 1000
              );

              if ((isAuthenticated || localStorage.getItem('token')) && videoSessionDuration > 0) {
                console.log(`Tracking video on other video play: ${playingVideo}, duration: ${videoSessionDuration}s`);
                await trackTime(playingVideo, "video", videoSessionDuration);
                const updatedSummary = await getTimeSummary();
                setTimeSummary(updatedSummary);
              }
            }
          }

          setPlayingVideo(videoId);
          videoStartTimes.current[videoId] = Date.now();
          console.log(`Set playingVideo: ${videoId}, startTime: ${videoStartTimes.current[videoId]}`);
          break;

        case window.YT.PlayerState.PAUSED:
          console.log(`Video ${videoId} paused, playingVideo: ${playingVideo}, startTime: ${videoStartTimes.current[videoId]}`);
          if (videoStartTimes.current[videoId]) {
            const sessionDuration = Math.floor(
              (Date.now() - videoStartTimes.current[videoId]) / 1000
            );

            console.log(`Video paused after: ${sessionDuration} seconds`);

            if ((isAuthenticated || localStorage.getItem('token')) && sessionDuration > 0) {
              console.log(`Tracking video: ${videoId}, duration: ${sessionDuration}s`);
              try {
                await trackTime(videoId, "video", sessionDuration);
                console.log(`Successfully tracked video: ${videoId}`);
                const updatedSummary = await getTimeSummary();
                setTimeSummary(updatedSummary);
              } catch (error) {
                console.error(`Failed to track video ${videoId}:`, error);
              }
            } else {
              console.log(`Skipping trackTime for ${videoId}: isAuthenticated=${isAuthenticated}, token=${localStorage.getItem('token')}, duration=${sessionDuration}`);
            }

            delete videoStartTimes.current[videoId];
            if (playingVideo === videoId) {
              setPlayingVideo(null);
            }
          } else {
            console.log(`No tracking for ${videoId}: no start time`);
          }
          break;

        case window.YT.PlayerState.ENDED:
          console.log(`Video ${videoId} ended`);
          if (videoStartTimes.current[videoId]) {
            const sessionDuration = Math.floor(
              (Date.now() - videoStartTimes.current[videoId]) / 1000
            );

            console.log(`Video ended after: ${sessionDuration} seconds`);

            if ((isAuthenticated || localStorage.getItem('token')) && sessionDuration > 0) {
              console.log(`Tracking video on end: ${videoId}, duration: ${sessionDuration}s`);
              await trackTime(videoId, "video", sessionDuration);
              const updatedSummary = await getTimeSummary();
              setTimeSummary(updatedSummary);
            }

            delete videoStartTimes.current[videoId];
            if (playingVideo === videoId) {
              setPlayingVideo(null);
            }
          }
          break;
      }
    } catch (error) {
      console.error(`Error handling player state change for ${videoId}:`, error);
    }
  };

  const meditationClasses = [
    {
      id: 1,
      title: "5 Minute Meditation for Relaxation",
      duration: "5:38 mins",
      level: "Beginner",
      description: "Find stillness within yourself anytime.",
      videoId: "VpHz8Mb13_Y",
      benefits: ["Improved focus", "Higher energy", "Better posture"],
    },
    {
      id: 2,
      title: "Guided Meditation for Mind Reprogramming",
      duration: "13:15 mins",
      level: "All levels",
      description: "Rewrite your story with love and intention.",
      videoId: "tqhxMUm7XXU",
      benefits: ["Reduced stress", "Mental clarity", "Emotional balance"],
    },
    {
      id: 3,
      title: "Guided Self-Love Meditation",
      duration: "9:18 mins",
      level: "All Levels",
      description: "You deserve your love and affection.",
      videoId: "vj0JDwQLof4",
      benefits: ["Relieved tension", "Improved circulation"],
    },
  ];

  const benefits = [
    {
      icon: <Leaf className="h-8 w-8" />,
      title: "Reduced Stress",
      description: "Meditation decreases cortisol levels, helping you manage stress more effectively.",
    },
    {
      icon: <Moon className="h-8 w-8" />,
      title: "Better Sleep",
      description: "Regular practice can improve sleep quality and help with insomnia.",
    },
    {
      icon: <Sun className="h-8 w-8" />,
      title: "Increased Focus",
      description: "Enhances your ability to concentrate and maintain attention.",
    },
    {
      icon: <Activity className="h-8 w-8" />,
      title: "Emotional Health",
      description: "Promotes emotional well-being and a more positive outlook on life.",
    },
    {
      icon: <Brain className="h-8 w-8" />,
      title: "Mental Clarity",
      description: "Clears mental fog and improves decision-making abilities.",
    },
    {
      icon: <Smile className="h-8 w-8" />,
      title: "Self-Awareness",
      description: "Helps you develop a stronger understanding of yourself.",
    },
  ];

  const tips = [
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Start Small",
      description: "Begin with 5 minutes daily",
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Be Consistent",
      description: "Meditate same time each day",
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Find Your Spot",
      description: "Choose a quiet place",
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Focus on Breath",
      description: "Return to breathing when distracted",
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Be Patient",
      description: "Some days will be easier than others",
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Use Guidance",
      description: "Guided meditations help when starting",
    },
  ];

  const TimeSummaryPanel = () => {
    return (
      <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg z-50 w-72">
        <h3 className="text-lg font-semibold mb-4">Meditation Time</h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-gray-50 p-3 rounded">
            <div className="text-sm text-gray-500">Today</div>
            <div className="font-medium">
              {formatTime(timeSummary.todayTotal)}
            </div>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <div className="text-sm text-gray-500">This Week</div>
            <div className="font-medium">
              {formatTime(timeSummary.weekTotal)}
            </div>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <div className="text-sm text-gray-500">This Month</div>
            <div className="font-medium">
              {formatTime(timeSummary.monthTotal)}
            </div>
          </div>
          <div className="bg-gray-50 p-3 rounded">
            <div className="text-sm text-gray-500">All Time</div>
            <div className="font-medium">
              {formatTime(timeSummary.allTimeTotal)}
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <h4 className="font-medium text-sm">By Content Type</h4>
          {Object.entries(timeSummary.byContentType).map(([type, seconds]) => (
            <div key={type} className="flex justify-between text-sm">
              <span className="capitalize">{type}:</span>
              <span>
                {Math.floor(seconds / 60)}m {Math.floor(seconds % 60)}s
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Layout>
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
            <motion.h1 className="text-3xl md:text-5xl font-display font-bold mb-6 text-white [text-shadow:_0_2px_8px_rgb(0_0_0_/_50%)]">
              Meditation & Mindfulness
            </motion.h1>
            <motion.p className="text-xl md:text-2xl font-medium text-white/90 mb-8 [text-shadow:_0_1px_3px_rgb(0_0_0_/_40%)]">
              Find your center with guided practices
            </motion.p>
            <motion.div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button
                className="bg-zenPink hover:bg-zenPink/90 text-white px-8 py-6 text-lg font-semibold rounded-full shadow-lg transition-all hover:scale-105 flex items-center"
                size="lg"
                onClick={() =>
                  meditationSectionRef.current?.scrollIntoView({
                    behavior: "smooth",
                  })
                }
              >
                Start Meditating Now
                <ChevronDown className="ml-2 h-5 w-5" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section ref={meditationSectionRef} className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h2 className="text-3xl font-display font-semibold mb-6">
                Breathe Exercise
              </h2>
              <p className="text-gray-700 mb-4">
                This simple breathing exercise can help calm your mind.
              </p>
              <div className="bg-white p-8 rounded-2xl shadow-md">
                <BreatheAnimation />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h2 className="text-3xl font-display font-semibold mb-6">
                Guided Meditations
              </h2>
              <Tabs defaultValue="stress">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="stress">Stress Relief</TabsTrigger>
                  <TabsTrigger value="sleep">Sleep</TabsTrigger>
                </TabsList>

                <TabsContent value="stress" className="space-y-4">
                  {[
                    { id: "stress-0", name: "Quick Stress Relief", time: "3:01", author: "David Robson" },
                    { id: "stress-1", name: "Progressive Muscle Relaxation", time: "8:06", author: "Milla Brown" },
                    { id: "stress-2", name: "Guided Forest Visualisation", time: "13:11", author: "Sarah Johnson" }
                  ].map((audio, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex justify-between items-center"
                    >
                      <div>
                        <h3 className="font-medium text-lg">
                          {audio.name}
                        </h3>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{audio.time}</span>
                        </div>
                        <div className="text-sm text-gray-400 mt-1">
                          By {audio.author}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        className="bg-zenSage hover:bg-zenSage/90 text-white"
                        onClick={() => toggleAudio(audio.id)}
                      >
                        {playingAudio === audio.id ? (
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
                  ))}
                </TabsContent>

                <TabsContent value="sleep" className="space-y-4">
                  {[
                    { id: "sleep-0", name: "Quiet Night", time: "8:15", author: "Mia Johnson" },
                    { id: "sleep-1", name: "Pre-Sleep Relaxation", time: "13:17", author: "Dr. Emma Wilson" },
                    { id: "sleep-2", name: "Pentatonic Waves", time: "18:19", author: "Michael Chen" }
                  ].map((audio, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex justify-between items-center"
                    >
                      <div>
                        <h3 className="font-medium text-lg">
                          {audio.name}
                        </h3>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{audio.time}</span>
                        </div>
                        <div className="text-sm text-gray-400 mt-1">
                          By {audio.author}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        className="bg-zenSage hover:bg-zenSage/90 text-white"
                        onClick={() => toggleAudio(audio.id)}
                      >
                        {playingAudio === audio.id ? (
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
                  ))}
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-14 bg-white">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Meditation Classes"
            subtitle="Practices for your schedule"
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
                  <div
                    id={`player-${meditationClass.videoId}`}
                    className="w-full h-full"
                  />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="bg-zenLightPink text-zenPink text-xs px-2 py-1 rounded-full">
                      {meditationClass.duration}
                    </span>
                    <span className="text-xs text-gray-500">
                      {meditationClass.level}
                    </span>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">
                    {meditationClass.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {meditationClass.description}
                  </p>
                  <div className="mb-4">
                    <h4 className="text-xs font-medium text-gray-500 mb-1">
                      BENEFITS:
                    </h4>
                    <div className="flex flex-wrap gap-1">
                      {meditationClass.benefits.map((benefit, i) => (
                        <span
                          key={i}
                          className="text-xs bg-gray-100 px-2 py-0.5 rounded-full text-gray-600"
                        >
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
                      onClick={() =>
                        setSavedItems((prev) =>
                          prev.includes(meditationClass.id)
                            ? prev.filter((id) => id !== meditationClass.id)
                            : [...prev, meditationClass.id]
                        )
                      }
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

      <section className="py-16 bg-zenLightPink/20">
        <div className="container mx-auto px-4">
          <SectionHeading title="Benefits of Meditation" centered />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
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

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Meditation Tips"
            subtitle="For beginners"
            centered
          />
          <div className="max-w-4xl mx-auto mt-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tips.map((tip, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start space-x-4 bg-gray-50 p-4 rounded-lg"
                >
                  <div className="bg-zenSage/10 p-2 rounded-full text-zenSage mt-1">
                    {tip.icon}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{tip.title}</h3>
                    <p className="text-gray-600 text-sm mt-1">
                      {tip.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {isAuthenticated && <TimeSummaryPanel />}
    </Layout>
  );
};

export default Meditation;