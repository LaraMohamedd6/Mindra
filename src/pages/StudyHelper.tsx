
import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { motion } from "framer-motion";
import SectionHeading from "@/components/common/SectionHeading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Clock, Check, Timer, Music, Headphones, ListTodo, BookMarked, Sun, Coffee, PauseCircle, PlayCircle, SkipForward, Flame, Zap } from "lucide-react";

export default function StudyHelper() {
  // Pomodoro Timer State
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [time, setTime] = useState(25 * 60);
  const [mode, setMode] = useState('pomodoro'); // pomodoro, shortBreak, longBreak
  
  // Tasks State
  const [tasks, setTasks] = useState([
    { id: 1, text: "Review lecture notes", completed: true },
    { id: 2, text: "Complete practice problems", completed: false },
    { id: 3, text: "Read chapter 7", completed: false },
    { id: 4, text: "Prepare study outline", completed: false },
  ]);
  const [newTask, setNewTask] = useState("");

  // Format time for display
  const formatTime = () => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Timer effects
  useEffect(() => {
    let interval = null;
    
    if (isActive && !isPaused) {
      interval = setInterval(() => {
        setTime((time) => {
          if (time === 0) {
            setIsPaused(true);
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, isPaused]);

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
      case 'pomodoro':
        newTime = 25 * 60;
        break;
      case 'shortBreak':
        newTime = 5 * 60;
        break;
      case 'longBreak':
        newTime = 15 * 60;
        break;
      default:
        newTime = 25 * 60;
    }
    setTime(newTime);
    setIsPaused(true);
  };

  const setTimerMode = (selectedMode) => {
    setMode(selectedMode);
    setIsPaused(true);
    switch (selectedMode) {
      case 'pomodoro':
        setTime(25 * 60);
        break;
      case 'shortBreak':
        setTime(5 * 60);
        break;
      case 'longBreak':
        setTime(15 * 60);
        break;
      default:
        setTime(25 * 60);
    }
  };
  
  // Task functions
  const addTask = (e) => {
    e.preventDefault();
    if (newTask.trim() === "") return;
    
    const newTaskObj = {
      id: Date.now(),
      text: newTask,
      completed: false
    };
    
    setTasks([...tasks, newTaskObj]);
    setNewTask("");
  };

  const toggleTaskCompletion = (id) => {
    const updatedTasks = tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  };

  const removeTask = (id) => {
    const filteredTasks = tasks.filter(task => task.id !== id);
    setTasks(filteredTasks);
  };
  
  // Calculate task completion percentage
  const completedPercentage = tasks.length > 0
    ? Math.round((tasks.filter(task => task.completed).length / tasks.length) * 100)
    : 0;

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 bg-gradient-to-br from-zenPeach/30 via-zenLightPink/20 to-white overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="container mx-auto px-4 relative z-10"
        >
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 text-gray-800">
              Student Study Helper
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8">
              Tools to boost your focus, track your tasks, and maximize your study sessions.
            </p>
            <Button className="bg-zenPink hover:bg-zenPink/90 text-white">
              Start Focused Study
            </Button>
          </div>
        </motion.div>
        
        {/* Abstract shape decoration */}
        <div className="absolute right-0 top-1/4 transform translate-x-1/3 -translate-y-1/4 opacity-20">
          <svg width="500" height="500" viewBox="0 0 500 500" fill="none">
            <circle cx="250" cy="250" r="250" fill="#FEC0B3" />
          </svg>
        </div>
      </section>

      {/* Pomodoro Timer Section */}
      <section className="py-14 bg-white">
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
                <CardHeader className={`${
                  mode === 'pomodoro' ? 'bg-red-50' :
                  mode === 'shortBreak' ? 'bg-emerald-50' :
                  'bg-blue-50'
                }`}>
                  <CardTitle className="text-center text-2xl">
                    {mode === 'pomodoro' ? 'Focus Session' :
                     mode === 'shortBreak' ? 'Short Break' :
                     'Long Break'}
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
                      variant={mode === 'pomodoro' ? 'default' : 'outline'}
                      onClick={() => setTimerMode('pomodoro')}
                      className={`${mode === 'pomodoro' ? 'bg-zenPink hover:bg-zenPink/90 text-white' : ''}`}
                    >
                      Pomodoro
                    </Button>
                    <Button
                      variant={mode === 'shortBreak' ? 'default' : 'outline'}
                      onClick={() => setTimerMode('shortBreak')}
                      className={`${mode === 'shortBreak' ? 'bg-zenSage hover:bg-zenSage/90 text-white' : ''}`}
                    >
                      Short Break
                    </Button>
                    <Button
                      variant={mode === 'longBreak' ? 'default' : 'outline'}
                      onClick={() => setTimerMode('longBreak')}
                      className={`${mode === 'longBreak' ? 'bg-blue-500 hover:bg-blue-500/90 text-white' : ''}`}
                    >
                      Long Break
                    </Button>
                  </div>
                  
                  <div className="flex justify-center space-x-4">
                    {!isActive || isPaused ? (
                      <Button onClick={handleStart} size="lg" className="bg-zenPink hover:bg-zenPink/90 text-white px-8">
                        <PlayCircle className="h-5 w-5 mr-2" />
                        {isPaused && time === 0 ? "Restart" : "Start"}
                      </Button>
                    ) : (
                      <Button onClick={handlePauseResume} size="lg" className="bg-zenPink hover:bg-zenPink/90 text-white px-8">
                        <PauseCircle className="h-5 w-5 mr-2" />
                        Pause
                      </Button>
                    )}
                    <Button onClick={handleReset} variant="outline" size="lg" className="px-8">
                      <SkipForward className="h-5 w-5 mr-2" />
                      Reset
                    </Button>
                  </div>
                </CardContent>
                <CardFooter className="bg-gray-50 border-t">
                  <div className="flex items-center justify-between w-full text-sm">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1.5 text-gray-500" />
                      <span>4 sessions completed today</span>
                    </div>
                    <div className="flex items-center">
                      <Flame className="h-4 w-4 mr-1.5 text-zenPink" />
                      <span>2 hour focus streak</span>
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
                  <CardDescription>Customize your study technique</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <Label>Focus Length</Label>
                      <span className="text-sm text-gray-500">25 min</span>
                    </div>
                    <Slider defaultValue={[25]} max={60} step={5} />
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <Label>Short Break</Label>
                      <span className="text-sm text-gray-500">5 min</span>
                    </div>
                    <Slider defaultValue={[5]} max={15} step={1} />
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between">
                      <Label>Long Break</Label>
                      <span className="text-sm text-gray-500">15 min</span>
                    </div>
                    <Slider defaultValue={[15]} max={30} step={5} />
                  </div>
                  
                  <div className="pt-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Timer className="h-4 w-4 text-gray-500" />
                        <Label>Auto-start Breaks</Label>
                      </div>
                      <Switch />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Music className="h-4 w-4 text-gray-500" />
                        <Label>Study Sounds</Label>
                      </div>
                      <Switch />
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
                      <span className="font-medium">{completedPercentage}%</span>
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
                    <Button type="submit" className="bg-zenSage hover:bg-zenSage/90">Add Task</Button>
                  </form>
                  
                  <div className="space-y-4">
                    {tasks.length === 0 ? (
                      <div className="text-center py-6 text-gray-500">
                        No tasks yet. Add some to get started!
                      </div>
                    ) : (
                      tasks.map((task) => (
                        <div
                          key={task.id}
                          className={`flex items-center p-3 border rounded-lg ${
                            task.completed ? "bg-gray-50 border-gray-200" : "bg-white border-gray-200"
                          }`}
                        >
                          <Checkbox
                            checked={task.completed}
                            onCheckedChange={() => toggleTaskCompletion(task.id)}
                            className="mr-3"
                          />
                          <span
                            className={`flex-1 ${
                              task.completed ? "text-gray-500 line-through" : "text-gray-900"
                            }`}
                          >
                            {task.text}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeTask(task.id)}
                            className="text-gray-500 hover:text-red-500"
                          >
                            Remove
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
                <CardFooter className="border-t">
                  <div className="flex items-center text-sm text-gray-500">
                    <Check className="h-4 w-4 mr-1.5 text-zenSage" />
                    <span>Tip: Break large tasks into smaller, manageable steps</span>
                  </div>
                </CardFooter>
              </Card>
            </div>
            
            <div>
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Focus Environment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Sun className="h-4 w-4 text-amber-500 mr-2" />
                        <Label>Lighting Mode</Label>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="text-xs text-gray-500">Warm</span>
                        <Switch />
                        <span className="text-xs text-gray-500">Cool</span>
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Headphones className="h-4 w-4 text-indigo-500 mr-2" />
                        <Label>Background Sound</Label>
                      </div>
                      <Button variant="outline" size="sm">
                        Select
                      </Button>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <Coffee className="h-4 w-4 text-brown-500 mr-2" />
                        <Label>Break Reminder</Label>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        <BookMarked className="h-4 w-4 text-blue-500 mr-2" />
                        <Label>Session Notes</Label>
                      </div>
                      <Button variant="outline" size="sm">
                        Open
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Study Motivation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-zenLightPink/60 rounded-lg p-4 mb-3">
                    <blockquote className="italic text-gray-700">
                      "The difference between successful students and others is not a lack of strength, not a lack of knowledge, but rather a lack of will."
                    </blockquote>
                    <div className="text-right text-sm mt-2">— Vince Lombardi (adapted)</div>
                  </div>
                  <Button className="w-full">
                    <Zap className="h-4 w-4 mr-2" />
                    Get New Quote
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
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
              <TabsTrigger value="music">Music</TabsTrigger>
              <TabsTrigger value="ambience">Ambient Sounds</TabsTrigger>
              <TabsTrigger value="custom">Custom Mix</TabsTrigger>
            </TabsList>
            
            <TabsContent value="music">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { title: "Lo-Fi Beats", duration: "3 hour mix", img: "https://images.unsplash.com/photo-1494232410401-ad00d5433cfa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80" },
                  { title: "Classical Focus", duration: "2 hour mix", img: "https://images.unsplash.com/photo-1507838153414-b4b713384a76?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80" },
                  { title: "Jazz Study", duration: "90 minute mix", img: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80" },
                  { title: "Ambient Focus", duration: "2 hour mix", img: "https://images.unsplash.com/photo-1519061304000-1defddbcb104?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80" },
                ].map((playlist, idx) => (
                  <Card key={idx} className="overflow-hidden">
                    <div className="aspect-square relative">
                      <img src={playlist.img} alt={playlist.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                        <PlayCircle className="h-12 w-12 text-white" />
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-medium">{playlist.title}</h3>
                      <p className="text-sm text-gray-500">{playlist.duration}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="ambience">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { name: "Rainfall", icon: "🌧️" },
                  { name: "Coffee Shop", icon: "☕" },
                  { name: "Forest Sounds", icon: "🌲" },
                  { name: "Ocean Waves", icon: "🌊" },
                  { name: "White Noise", icon: "🔇" },
                  { name: "Library", icon: "📚" },
                  { name: "Fireplace", icon: "🔥" },
                  { name: "Night Crickets", icon: "🦗" },
                ].map((sound, idx) => (
                  <Button key={idx} variant="outline" className="h-20 text-lg flex-col">
                    <span className="text-2xl mb-1">{sound.icon}</span>
                    {sound.name}
                  </Button>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="custom">
              <Card>
                <CardHeader>
                  <CardTitle>Create Your Mix</CardTitle>
                  <CardDescription>Combine different sounds to create your perfect study environment</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {[
                      { name: "Background Music", options: ["Lo-Fi", "Classical", "None"] },
                      { name: "Nature Sounds", options: ["Rain", "Forest", "Ocean", "None"] },
                      { name: "Ambient Noise", options: ["Coffee Shop", "Library", "White Noise", "None"] }
                    ].map((category, idx) => (
                      <div key={idx} className="space-y-2">
                        <Label>{category.name}</Label>
                        <div className="grid grid-cols-4 gap-2">
                          {category.options.map((option, i) => (
                            <Button
                              key={i}
                              variant={i === 0 ? "default" : "outline"}
                              className={i === 0 ? "bg-zenSage hover:bg-zenSage/90" : ""}
                              size="sm"
                            >
                              {option}
                            </Button>
                          ))}
                        </div>
                        {idx !== 2 && (
                          <div className="pt-2">
                            <div className="flex justify-between text-sm text-gray-500">
                              <span>Volume</span>
                              <span>70%</span>
                            </div>
                            <Slider defaultValue={[70]} max={100} step={5} className="py-2" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline">Save Mix</Button>
                  <Button className="bg-zenSage hover:bg-zenSage/90">
                    <PlayCircle className="h-4 w-4 mr-2" /> Play Mix
                  </Button>
                </CardFooter>
              </Card>
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
            <ScrollArea className="h-64 w-full rounded-md border p-4 bg-white/80 backdrop-blur-sm">
              <div className="space-y-8 p-4">
                {[
                  { quote: "The expert in anything was once a beginner.", author: "Helen Hayes" },
                  { quote: "The beautiful thing about learning is that nobody can take it away from you.", author: "B.B. King" },
                  { quote: "You don't have to be great to start, but you have to start to be great.", author: "Zig Ziglar" },
                  { quote: "The journey of a thousand miles begins with one step.", author: "Lao Tzu" },
                  { quote: "Education is not the filling of a pot but the lighting of a fire.", author: "W.B. Yeats" },
                  { quote: "The more that you read, the more things you will know. The more that you learn, the more places you'll go.", author: "Dr. Seuss" },
                ].map((item, idx) => (
                  <blockquote key={idx} className="text-lg md:text-xl italic text-gray-700">
                    "{item.quote}"
                    <footer className="text-right text-sm mt-2 text-gray-500">
                      — {item.author}
                    </footer>
                  </blockquote>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </section>
    </Layout>
  );
}
