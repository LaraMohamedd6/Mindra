import { useState, useEffect, useRef, useCallback } from "react";
import Layout from "@/components/layout/Layout";
import { motion, AnimatePresence } from "framer-motion";
import SectionHeading from "@/components/common/SectionHeading";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import {
  Clock,
  Check,
  Timer,
  Music,
  Headphones,
  Coffee,
  PauseCircle,
  PlayCircle,
  SkipForward,
  Flame,
  Zap,
  ChevronDown,
  ChevronUp,
  ChevronRight,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

// Import sound files
import rainSound from "@/assets/sounds/rain.mp3";
import coffeeShopSound from "@/assets/sounds/coffee-shop.mp3";
import forestSound from "@/assets/sounds/forest.mp3";
import oceanSound from "@/assets/sounds/ocean.mp3";
import librarySound from "@/assets/sounds/library.mp3";
import notificationSound from "@/assets/sounds/alarm.mp3";

// Import music files
import lofiBeats from "@/assets/sounds/lofi-beats.mp3";
import classicalFocus from "@/assets/sounds/classical-focus.mp3";
import jazzStudy from "@/assets/sounds/jazz-study.mp3";
import ambientFocus from "@/assets/sounds/ambient-focus.mp3";

// Import images
import studyCover from "@/assets/images/study-cover.png";
import lofiCover from "@/assets/images/lofi.jpg";
import classicalCover from "@/assets/images/classic.jpg";
import jazzCover from "@/assets/images/jazz.jpg";
import ambientCover from "@/assets/images/Ambient.avif";

// Type definitions
type AudioRefs = {
  [key: string]: HTMLAudioElement | null;
};

interface Sound {
  name: string;
  icon: string;
  sound: string;
  type: "ambient" | "music";
  coverImage?: string;
}

interface Task {
  id: number;
  text: string;
  completed: boolean;
  priority: "high" | "medium" | "low";
  note: string;
}

export default function StudyHelper() {
  // Refs
  const pomodoroSectionRef = useRef<HTMLDivElement>(null);
  const audioRefs = useRef<AudioRefs>({});
  const quoteIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // State
  const [showCover, setShowCover] = useState(true);
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebratedTasks, setCelebratedTasks] = useState<number[]>([]);

  // Load from localStorage or use defaults
  const loadFromStorage = (key: string, defaultValue: any) => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : defaultValue;
    }
    return defaultValue;
  };

  // Pomodoro Timer State
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [time, setTime] = useState(loadFromStorage("pomodoroTime", 25 * 60));
  const [mode, setMode] = useState(loadFromStorage("pomodoroMode", "pomodoro"));
  const [completedSessions, setCompletedSessions] = useState(
    loadFromStorage("completedSessions", 0)
  );
  const [focusStreak, setFocusStreak] = useState(
    loadFromStorage("focusStreak", 0)
  );

  // Tasks State
  const [tasks, setTasks] = useState<Task[]>(
    loadFromStorage("studyTasks", [
      {
        id: 1,
        text: "Review lecture notes",
        completed: true,
        priority: "medium",
        note: "",
      },
      {
        id: 2,
        text: "Complete practice problems",
        completed: false,
        priority: "high",
        note: "Chapters 5-7",
      },
      {
        id: 3,
        text: "Read chapter 7",
        completed: false,
        priority: "low",
        note: "",
      },
      {
        id: 4,
        text: "Prepare study outline",
        completed: false,
        priority: "medium",
        note: "Due Friday",
      },
    ])
  );
  const [newTask, setNewTask] = useState("");
  const [expandedTask, setExpandedTask] = useState<number | null>(null);

  // Timer settings
  const [timerSettings, setTimerSettings] = useState(
    loadFromStorage("timerSettings", {
      focusLength: 25,
      shortBreak: 5,
      longBreak: 15,
      autoStartBreaks: true,
    })
  );

  // Audio State
  const [currentSound, setCurrentSound] = useState<Sound | null>(
    loadFromStorage("currentSound", null)
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [breakReminder, setBreakReminder] = useState(
    loadFromStorage("breakReminder", true)
  );

  // Study Inspiration Quotes
  const quotes = [
    {
      quote: "The expert in anything was once a beginner.",
      author: "Helen Hayes",
    },
    {
      quote:
        "The beautiful thing about learning is that nobody can take it away from you.",
      author: "B.B. King",
    },
    {
      quote:
        "You don't have to be great to start, but you have to start to be great.",
      author: "Zig Ziglar",
    },
    {
      quote: "The journey of a thousand miles begins with one step.",
      author: "Lao Tzu",
    },
    {
      quote:
        "Education is not the filling of a pot but the lighting of a fire.",
      author: "W.B. Yeats",
    },
    {
      quote:
        "The more that you read, the more things you will know. The more that you learn, the more places you'll go.",
      author: "Dr. Seuss",
    },
  ];
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  // Sound selection with imported sounds
  const ambientSounds: Sound[] = [
    { name: "Rainfall", icon: "🌧️", sound: rainSound, type: "ambient" },
    {
      name: "Coffee Shop",
      icon: "☕",
      sound: coffeeShopSound,
      type: "ambient",
    },
    { name: "Forest Sounds", icon: "🌲", sound: forestSound, type: "ambient" },
    { name: "Ocean Waves", icon: "🌊", sound: oceanSound, type: "ambient" },
    { name: "Library", icon: "📚", sound: librarySound, type: "ambient" },
  ];

  const musicTracks: Sound[] = [
    {
      name: "Lo-Fi Beats",
      icon: "🎵",
      sound: lofiBeats,
      type: "music",
      coverImage: lofiCover,
    },
    {
      name: "Classical Focus",
      icon: "🎻",
      sound: classicalFocus,
      type: "music",
      coverImage: classicalCover,
    },
    {
      name: "Jazz Study",
      icon: "🎷",
      sound: jazzStudy,
      type: "music",
      coverImage: jazzCover,
    },
    {
      name: "Ambient Focus",
      icon: "🎧",
      sound: ambientFocus,
      type: "music",
      coverImage: ambientCover,
    },
  ];

  // Scroll to pomodoro section and hide cover
  const scrollToPomodoro = useCallback(() => {
    setShowCover(false);
    pomodoroSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Hide cover on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setShowCover(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Initialize audio refs and cleanup
  useEffect(() => {
    return () => {
      Object.values(audioRefs.current).forEach((audio) => {
        if (audio) {
          audio.pause();
          audio.currentTime = 0;
        }
      });

      if (quoteIntervalRef.current) {
        clearInterval(quoteIntervalRef.current);
      }
    };
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem("pomodoroTime", JSON.stringify(time));
    localStorage.setItem("pomodoroMode", JSON.stringify(mode));
    localStorage.setItem(
      "completedSessions",
      JSON.stringify(completedSessions)
    );
    localStorage.setItem("focusStreak", JSON.stringify(focusStreak));
    localStorage.setItem("studyTasks", JSON.stringify(tasks));
    localStorage.setItem("timerSettings", JSON.stringify(timerSettings));
    localStorage.setItem("currentSound", JSON.stringify(currentSound));
    localStorage.setItem("breakReminder", JSON.stringify(breakReminder));
  }, [
    time,
    mode,
    completedSessions,
    focusStreak,
    tasks,
    timerSettings,
    currentSound,
    breakReminder,
  ]);

  // Celebration effect when all tasks are completed
  useEffect(() => {
    if (tasks.length > 0 && tasks.every((task) => task.completed)) {
      const currentTaskIds = tasks.map((t) => t.id);

      // Check if we've already celebrated these exact tasks
      const alreadyCelebrated =
        celebratedTasks.length === currentTaskIds.length &&
        currentTaskIds.every((id) => celebratedTasks.includes(id));

      if (!alreadyCelebrated) {
        setShowCelebration(true);
        setCelebratedTasks(currentTaskIds);
        const timer = setTimeout(() => setShowCelebration(false), 5000);
        return () => clearTimeout(timer);
      }
    }
  }, [tasks, celebratedTasks]);

  // Format time for display
  const formatTime = () => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  // Timer effects with break reminder integration
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && !isPaused) {
      interval = setInterval(() => {
        setTime((time) => {
          if (time === 0) {
            handleTimerCompletion();
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [
    isActive,
    isPaused,
    mode,
    timerSettings,
    completedSessions,
    breakReminder,
  ]);

  const handleTimerCompletion = () => {
    setIsPaused(true);
    setIsActive(false);

    // Play notification sound
    const audio = new Audio(notificationSound);
    audio.play().catch((e) => console.log("Timer completion sound failed:", e));

    // Handle focus session completion
    if (mode === "pomodoro") {
      const newCount = completedSessions + 1;
      setCompletedSessions(newCount);

      // Show break reminder if enabled
      if (breakReminder) {
        toast.success("Time for a break! 🎉", {
          duration: 3000,
          position: "top-center",
        });
      }

      // Update focus streak every 4 sessions
      if (newCount % 4 === 0) {
        setFocusStreak((prev) => prev + 1);
      }

      // Auto-start breaks if enabled
      if (timerSettings.autoStartBreaks) {
        setTimeout(() => {
          setTimerMode("shortBreak");
          handleStart();
        }, 1000);
      }
    }
  };

  // Auto-rotate quotes every 10 seconds
  useEffect(() => {
    quoteIntervalRef.current = setInterval(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 10000);

    return () => {
      if (quoteIntervalRef.current) {
        clearInterval(quoteIntervalRef.current);
      }
    };
  }, []);

  const handleStart = () => {
    setIsActive(true);
    setIsPaused(false);
  };

  const handlePauseResume = () => {
    setIsPaused(!isPaused);
  };

  const handleReset = () => {
    let newTime;
    switch (mode) {
      case "pomodoro":
        newTime = timerSettings.focusLength * 60;
        break;
      case "shortBreak":
        newTime = timerSettings.shortBreak * 60;
        break;
      case "longBreak":
        newTime = timerSettings.longBreak * 60;
        break;
      default:
        newTime = timerSettings.focusLength * 60;
    }
    setTime(newTime);
    setIsPaused(true);
    setIsActive(false);
  };

  const setTimerMode = (selectedMode: string) => {
    setMode(selectedMode);
    setIsPaused(true);
    setIsActive(false);

    switch (selectedMode) {
      case "pomodoro":
        setTime(timerSettings.focusLength * 60);
        break;
      case "shortBreak":
        setTime(timerSettings.shortBreak * 60);
        break;
      case "longBreak":
        setTime(timerSettings.longBreak * 60);
        break;
      default:
        setTime(timerSettings.focusLength * 60);
    }
  };

  // Task functions
  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.trim() === "") return;

    const newTaskObj: Task = {
      id: Date.now(),
      text: newTask,
      completed: false,
      priority: "medium",
      note: "",
    };

    setTasks([...tasks, newTaskObj]);
    setNewTask("");
  };

  const toggleTaskCompletion = (id: number) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  };

  const removeTask = (id: number) => {
    const filteredTasks = tasks.filter((task) => task.id !== id);
    // Remove from celebrated tasks if it was there
    setCelebratedTasks((prev) => prev.filter((taskId) => taskId !== id));
    setTasks(filteredTasks);
  };

  const updateTaskPriority = (
    id: number,
    priority: "high" | "medium" | "low"
  ) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, priority } : task
    );
    setTasks(updatedTasks);
  };

  const updateTaskNote = (id: number, note: string) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, note } : task
    );
    setTasks(updatedTasks);
  };

  const toggleTaskExpand = (id: number) => {
    setExpandedTask(expandedTask === id ? null : id);
  };

  // Calculate task completion percentage
  const completedPercentage =
    tasks.length > 0
      ? Math.round(
        (tasks.filter((task) => task.completed).length / tasks.length) * 100
      )
      : 0;

  // Update timer settings
  const updateTimerSetting = (key: string, value: any) => {
    setTimerSettings((prev) => ({
      ...prev,
      [key]: value,
    }));

    if (key === "focusLength" && mode === "pomodoro") {
      setTime(value * 60);
    }
  };

  const playSound = (sound: Sound | null) => {
    try {
      // If the same sound is already playing → pause it
      if (
        isPlaying &&
        currentSound?.name === sound?.name &&
        audioRefs.current[sound.name]
      ) {
        audioRefs.current[sound.name]!.pause();
        setIsPlaying(false);
        return;
      }

      // Stop all other sounds
      Object.values(audioRefs.current).forEach((audio) => {
        if (audio) {
          audio.pause();
          audio.currentTime = 0;
        }
      });

      if (!sound) {
        setCurrentSound(null);
        setIsPlaying(false);
        return;
      }

      // Create a new audio instance if not already created
      if (
        !audioRefs.current[sound.name] ||
        audioRefs.current[sound.name]?.src !== sound.sound
      ) {
        audioRefs.current[sound.name] = new Audio(sound.sound);
        audioRefs.current[sound.name]!.loop = true;

        audioRefs.current[sound.name]!.onerror = () => {
          console.error(`Failed to load sound: ${sound.name}`);
          setCurrentSound(null);
          setIsPlaying(false);
        };
      }

      // Play sound
      audioRefs.current[sound.name]!.play()
        .then(() => {
          setCurrentSound(sound);
          setIsPlaying(true);
        })
        .catch((e) => {
          console.error("Audio play failed:", e);
          setCurrentSound(null);
          setIsPlaying(false);
        });

    } catch (error) {
      console.error("Error in playSound:", error);
      setCurrentSound(null);
      setIsPlaying(false);
    }
  };


  const togglePlayPause = () => {
    if (!currentSound) return;

    const audio = audioRefs.current[currentSound.name];
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch((e) => {
          console.error("Audio play failed:", e);
          setIsPlaying(false);
        });
    }
  };

  const stopSound = () => {
    if (!currentSound) return;

    const audio = audioRefs.current[currentSound.name];
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }

    setCurrentSound(null);
    setIsPlaying(false);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Layout>
      {/* Celebration Modal */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
          >
            <div className="bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-2xl border border-zenSage/20 max-w-md text-center">
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 0.6,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
                className="text-6xl mb-4"
              >
                🎉
              </motion.div>
              <h3 className="text-2xl font-bold text-zenSage mb-2">
                Amazing Work!
              </h3>
              <p className="text-gray-700">
                You've completed all your tasks for today!
              </p>
              <Button
                onClick={() => setShowCelebration(false)}
                className="mt-4 bg-zenSage hover:bg-zenSage/90 pointer-events-auto"
              >
                Close
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Study Helper Banner */}
      <div className="relative h-[500px] md:h-[700px] overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={studyCover}
            alt="Study Helper Banner"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/30"></div>
        </div>
        <div className="relative z-10 h-full flex items-center">
          <div className="container mx-auto px-6 md:px-12 lg:px-24">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white">
                Student Study Helper
              </h1>
              <p className="text-lg md:text-xl text-white/90 mb-8 max-w-lg">
                Boost your focus, track your tasks, and maximize your study
                sessions with our productivity tools
              </p>
              <Button
                className="bg-[#7CAE9E] hover:bg-[#6B9D8D] text-white px-8 py-6 text-lg"
                onClick={scrollToPomodoro}
              >
                Start Focus Session <ChevronRight size={20} className="ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Pomodoro Timer Section */}
      <section ref={pomodoroSectionRef} className="py-14 bg-white">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Pomodoro Study Timer"
            subtitle="Boost your productivity with timed focus sessions and breaks"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="md:col-span-2"
            >
              <Card className="overflow-hidden border-2">
                <CardHeader
                  className={`${mode === "pomodoro"
                      ? "bg-red-50"
                      : mode === "shortBreak"
                        ? "bg-emerald-50"
                        : "bg-blue-50"
                    }`}
                >
                  <CardTitle className="text-center text-2xl">
                    {mode === "pomodoro"
                      ? "Focus Session"
                      : mode === "shortBreak"
                        ? "Short Break"
                        : "Long Break"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="flex justify-center mb-6">
                    <div className="text-7xl font-semibold tabular-nums">
                      {formatTime()}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mb-8">
                    <Button
                      variant={mode === "pomodoro" ? "default" : "outline"}
                      onClick={() => setTimerMode("pomodoro")}
                      className={`${mode === "pomodoro"
                          ? "bg-zenPink hover:bg-zenPink/90 text-white"
                          : ""
                        }`}
                    >
                      Pomodoro
                    </Button>
                    <Button
                      variant={mode === "shortBreak" ? "default" : "outline"}
                      onClick={() => setTimerMode("shortBreak")}
                      className={`${mode === "shortBreak"
                          ? "bg-zenSage hover:bg-zenSage/90 text-white"
                          : ""
                        }`}
                    >
                      Short Break
                    </Button>
                    <Button
                      variant={mode === "longBreak" ? "default" : "outline"}
                      onClick={() => setTimerMode("longBreak")}
                      className={`${mode === "longBreak"
                          ? "bg-blue-500 hover:bg-blue-500/90 text-white"
                          : ""
                        }`}
                    >
                      Long Break
                    </Button>
                  </div>

                  <div className="flex justify-center space-x-4">
                    {!isActive || isPaused ? (
                      <Button
                        onClick={handleStart}
                        size="lg"
                        className="bg-zenPink hover:bg-zenPink/90 text-white px-8"
                      >
                        <PlayCircle className="h-5 w-5 mr-2" />
                        {isPaused && time === 0 ? "Restart" : "Start"}
                      </Button>
                    ) : (
                      <Button
                        onClick={handlePauseResume}
                        size="lg"
                        className="bg-zenPink hover:bg-zenPink/90 text-white px-8"
                      >
                        <PauseCircle className="h-5 w-5 mr-2" />
                        Pause
                      </Button>
                    )}
                    <Button
                      onClick={handleReset}
                      variant="outline"
                      size="lg"
                      className="px-8"
                    >
                      <SkipForward className="h-5 w-5 mr-2" />
                      Reset
                    </Button>
                  </div>
                </CardContent>
                <CardFooter className="bg-gray-50 border-t">
                  <div className="flex items-center justify-between w-full text-sm">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1.5 text-gray-500" />
                      <span>{completedSessions} sessions completed today</span>
                    </div>
                    <div className="flex items-center">
                      <Flame className="h-4 w-4 mr-1.5 text-zenPink" />
                      <span>{focusStreak} hour focus streak</span>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Session Settings</CardTitle>
                  <CardDescription>
                    Customize your study technique
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <Label>Focus Length</Label>
                      <span className="text-sm text-gray-500">
                        {timerSettings.focusLength} min
                      </span>
                    </div>
                    <Slider
                      value={[timerSettings.focusLength]}
                      max={60}
                      step={5}
                      onValueChange={(val) =>
                        updateTimerSetting("focusLength", val[0])
                      }
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <Label>Short Break</Label>
                      <span className="text-sm text-gray-500">
                        {timerSettings.shortBreak} min
                      </span>
                    </div>
                    <Slider
                      value={[timerSettings.shortBreak]}
                      max={15}
                      step={1}
                      onValueChange={(val) =>
                        updateTimerSetting("shortBreak", val[0])
                      }
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <Label>Long Break</Label>
                      <span className="text-sm text-gray-500">
                        {timerSettings.longBreak} min
                      </span>
                    </div>
                    <Slider
                      value={[timerSettings.longBreak]}
                      max={30}
                      step={5}
                      onValueChange={(val) =>
                        updateTimerSetting("longBreak", val[0])
                      }
                    />
                  </div>

                  <div className="pt-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Timer className="h-4 w-4 text-gray-500" />
                        <Label>Auto-start Breaks</Label>
                      </div>
                      <Switch
                        checked={timerSettings.autoStartBreaks}
                        onCheckedChange={(val) =>
                          updateTimerSetting("autoStartBreaks", val)
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Study Task Tracker Section */}
      <section className="py-14 bg-gray-50">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Study Task Tracker"
            subtitle="Stay organized and track your progress"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Today's Study Plan</CardTitle>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">Progress:</span>
                      <span className="font-medium">
                        {completedPercentage}%
                      </span>
                    </div>
                  </div>
                  <Progress value={completedPercentage} className="h-2" />
                </CardHeader>
                <CardContent>
                  <form onSubmit={addTask} className="flex space-x-2 mb-6">
                    <Input
                      placeholder="Add a new study task..."
                      value={newTask}
                      onChange={(e) => setNewTask(e.target.value)}
                      className="flex-1"
                    />
                    <Button
                      type="submit"
                      className="bg-zenSage hover:bg-zenSage/90"
                    >
                      Add Task
                    </Button>
                  </form>

                  <div className="space-y-2">
                    {tasks.length === 0 ? (
                      <div className="text-center py-6 text-gray-500">
                        No tasks yet. Add some to get started!
                      </div>
                    ) : (
                      tasks.map((task) => (
                        <div
                          key={task.id}
                          className={`border rounded-lg overflow-hidden ${task.completed
                              ? "bg-gray-50 border-gray-200"
                              : "bg-white border-gray-200"
                            }`}
                        >
                          <div className="flex items-center p-3">
                            <Checkbox
                              checked={task.completed}
                              onCheckedChange={() =>
                                toggleTaskCompletion(task.id)
                              }
                              className="mr-3"
                            />
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span
                                  className={`${task.completed
                                      ? "text-gray-500 line-through"
                                      : "text-gray-900"
                                    }`}
                                >
                                  {task.text}
                                </span>
                                <div className="flex items-center space-x-2">
                                  <span
                                    className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(
                                      task.priority
                                    )}`}
                                  >
                                    {task.priority}
                                  </span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => toggleTaskExpand(task.id)}
                                    className="text-gray-500 hover:text-gray-700"
                                  >
                                    {expandedTask === task.id ? (
                                      <ChevronUp className="h-4 w-4" />
                                    ) : (
                                      <ChevronDown className="h-4 w-4" />
                                    )}
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeTask(task.id)}
                                    className="text-gray-500 hover:text-red-500"
                                  >
                                    Remove
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>

                          {expandedTask === task.id && (
                            <div className="p-3 pt-0 border-t bg-white">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <Label>Priority</Label>
                                  <Select
                                    value={task.priority}
                                    onValueChange={(
                                      value: "high" | "medium" | "low"
                                    ) => updateTaskPriority(task.id, value)}
                                  >
                                    <SelectTrigger className="w-full">
                                      <SelectValue placeholder="Select priority" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="high">High</SelectItem>
                                      <SelectItem value="medium">
                                        Medium
                                      </SelectItem>
                                      <SelectItem value="low">Low</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label>Note</Label>
                                  <Input
                                    value={task.note}
                                    onChange={(e) =>
                                      updateTaskNote(task.id, e.target.value)
                                    }
                                    placeholder="Add a note..."
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
                <CardFooter className="border-t">
                  <div className="flex items-center text-sm text-gray-500">
                    <Check className="h-4 w-4 mr-1.5 text-zenSage" />
                    <span>
                      Tip: Break large tasks into smaller, manageable steps
                    </span>
                  </div>
                </CardFooter>
              </Card>
            </div>

            {/* Focus Environment Section with Break Reminder */}
            <div>
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Focus Environment</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Break Reminder Section */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Coffee className="h-4 w-4 text-amber-600" />
                        <Label>Break Reminders</Label>
                      </div>
                      <Switch
                        checked={breakReminder}
                        onCheckedChange={setBreakReminder}
                      />
                    </div>
                    <div className="text-sm text-gray-500 pl-8">
                      {breakReminder
                        ? "You'll be notified when focus sessions end"
                        : "No notifications will be shown for breaks"}
                    </div>
                  </div>

                  {/* Sound Controls */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <Headphones className="h-4 w-4 text-indigo-500" />
                        <Label>
                          Current Sound: {currentSound?.name || "None"}
                        </Label>
                      </div>
                      {currentSound && (
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={togglePlayPause}
                          >
                            {isPlaying ? (
                              <>
                                <PauseCircle className="h-4 w-4 mr-1" />
                                Pause
                              </>
                            ) : (
                              <>
                                <PlayCircle className="h-4 w-4 mr-1" />
                                Play
                              </>
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={stopSound}
                          >
                            <SkipForward className="h-4 w-4 mr-1" />
                            Stop
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Study Motivation Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Study Motivation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-zenLightPink/60 rounded-lg p-4 mb-3">
                    <blockquote className="italic text-gray-700">
                      "{quotes[currentQuoteIndex].quote}"
                    </blockquote>
                    <div className="text-right text-sm mt-2">
                      — {quotes[currentQuoteIndex].author}
                    </div>
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => {
                      setCurrentQuoteIndex(
                        (prev) => (prev + 1) % quotes.length
                      );
                    }}
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Next Quote
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Study Playlists Section */}
      <section className="py-14 bg-white">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Study Soundtracks"
            subtitle="Music and sounds to enhance your concentration"
          />

          <Tabs defaultValue="music" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
              <TabsTrigger value="music">Music</TabsTrigger>
              <TabsTrigger value="ambience">Ambient Sounds</TabsTrigger>
            </TabsList>

            <TabsContent value="music">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {musicTracks.map((track, idx) => (
                  <Card
                    key={idx}
                    className="overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="aspect-square relative">
                      <img
                        src={track.coverImage}
                        alt={track.name}
                        className="w-full h-full object-cover"
                      />
                      <div
                        className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                        onClick={() => playSound(track)}
                      >
                        <PlayCircle className="h-12 w-12 text-white" />
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-medium">{track.name}</h3>
                      <p className="text-sm text-gray-500">Study music</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="ambience">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {ambientSounds.map((sound, idx) => (
                  <Button
                    key={idx}
                    variant={
                      currentSound?.name === sound.name ? "default" : "outline"
                    }
                    className={`h-20 text-lg flex-col ${currentSound?.name === sound.name
                        ? "bg-zenSage hover:bg-zenSage/90 text-white"
                        : ""
                      }`}
                    onClick={() => playSound(sound)}
                  >
                    <span className="text-2xl mb-1">{sound.icon}</span>
                    {sound.name}
                  </Button>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Productivity Quotes */}
      <section className="py-14 bg-gradient-to-br from-zenLightPink/30 via-zenPeach/20 to-white">
        <div className="container mx-auto px-4 text-center">
          <SectionHeading
            title="Study Inspiration"
            subtitle="Words of wisdom to keep you motivated"
            centered
          />

          <div className="max-w-4xl mx-auto">
            <div className="h-64 w-full rounded-md border p-4 bg-white/80 backdrop-blur-sm flex items-center justify-center">
              <motion.div
                key={currentQuoteIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full"
              >
                <blockquote className="text-lg md:text-xl italic text-gray-700">
                  "{quotes[currentQuoteIndex].quote}"
                  <footer className="text-right text-sm mt-2 text-gray-500">
                    — {quotes[currentQuoteIndex].author}
                  </footer>
                </blockquote>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
