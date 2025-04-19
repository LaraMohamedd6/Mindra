
import Layout from "@/components/layout/Layout";
import { motion } from "framer-motion";
import SectionHeading from "@/components/common/SectionHeading";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dumbbell, Calendar, Target, Trophy, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Fitness() {
  const fitnessRoutines = [
    {
      id: 1,
      title: "Quick Morning Energizer",
      duration: "15 mins",
      level: "Beginner",
      description: "Start your day with this quick, energizing routine perfect for busy mornings before class.",
      videoId: "UBMk30rjy0o",
      exercises: [
        { name: "Jumping Jacks", duration: "1 min" },
        { name: "Push-ups", duration: "30 secs" },
        { name: "Mountain Climbers", duration: "1 min" },
        { name: "Squats", duration: "1 min" },
        { name: "Plank", duration: "30 secs" }
      ]
    },
    {
      id: 2,
      title: "Study Break Stretches",
      duration: "10 mins",
      level: "All Levels",
      description: "Perfect stretching routine to do between study sessions to reduce tension and improve focus.",
      videoId: "sTANio_2E0Q",
      exercises: [
        { name: "Neck Rolls", duration: "30 secs" },
        { name: "Shoulder Stretches", duration: "1 min" },
        { name: "Wrist Stretches", duration: "30 secs" },
        { name: "Standing Side Stretch", duration: "1 min" },
        { name: "Hip Flexor Stretch", duration: "1 min" }
      ]
    },
    {
      id: 3,
      title: "Dorm Room Strength",
      duration: "20 mins",
      level: "Intermediate",
      description: "Build strength with this minimal space, no-equipment workout perfect for small dorm rooms.",
      videoId: "6eiQiIogJUQ",
      exercises: [
        { name: "Chair Dips", duration: "45 secs" },
        { name: "Wall Sits", duration: "45 secs" },
        { name: "Desk Push-ups", duration: "45 secs" },
        { name: "Lunges", duration: "45 secs" },
        { name: "Glute Bridges", duration: "45 secs" }
      ]
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 bg-gradient-to-br from-zenSeafoam/30 via-zenMint/20 to-white overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="container mx-auto px-4 relative z-10"
        >
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 text-gray-800">
              Student Fitness Hub
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8">
              Quick, effective workouts designed specifically for busy student schedules and limited space.
            </p>
            <Button className="bg-zenSage hover:bg-zenSage/90 text-white">
              Track Your Progress
            </Button>
          </div>
        </motion.div>
        
        {/* Abstract shape decoration */}
        <div className="absolute right-0 top-1/4 transform translate-x-1/3 -translate-y-1/4 opacity-20">
          <svg width="500" height="500" viewBox="0 0 500 500" fill="none">
            <circle cx="250" cy="250" r="250" fill="#7CAE9E" />
          </svg>
        </div>
      </section>

      {/* Progress Section */}
      <section className="py-14 bg-white">
        <div className="container mx-auto px-4">
          <SectionHeading 
            title="Your Fitness Journey" 
            subtitle="Track your progress and stay motivated"
          />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[
              { icon: <Dumbbell className="h-5 w-5 text-zenPink" />, title: "Workouts", value: "6", label: "This Week" },
              { icon: <Calendar className="h-5 w-5 text-zenSage" />, title: "Active Days", value: "12", label: "This Month" },
              { icon: <Target className="h-5 w-5 text-zenPeach" />, title: "Goal Progress", value: "65%", label: "Monthly Goal" },
              { icon: <Trophy className="h-5 w-5 text-yellow-500" />, title: "Achievements", value: "4", label: "Unlocked" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-center mb-3">
                  <div className="p-2 rounded-full bg-gray-50 mr-3">
                    {stat.icon}
                  </div>
                  <h3 className="font-semibold text-gray-700">{stat.title}</h3>
                </div>
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-gray-900">{stat.value}</span>
                  <span className="ml-2 text-sm text-gray-500">{stat.label}</span>
                </div>
              </motion.div>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Weekly Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { day: "Monday", completed: true, type: "Morning Energizer", progress: 100 },
                  { day: "Tuesday", completed: true, type: "Study Break Stretches", progress: 100 },
                  { day: "Wednesday", completed: false, type: "Rest Day", progress: 0 },
                  { day: "Thursday", completed: true, type: "Dorm Room Strength", progress: 100 },
                  { day: "Friday", completed: true, type: "Morning Energizer", progress: 100 },
                  { day: "Saturday", completed: true, type: "Study Break Stretches", progress: 100 },
                  { day: "Sunday", completed: false, type: "Planned: Dorm Room Strength", progress: 0 },
                ].map((day, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-20 text-sm font-medium text-gray-900">{day.day}</div>
                    <div className="flex-1 ml-4">
                      <Progress value={day.progress} className="h-2" />
                    </div>
                    <div className="ml-4 w-32 text-sm text-right">
                      <div className={`font-medium ${day.completed ? "text-zenSage" : "text-gray-500"}`}>
                        {day.type}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Workout Library Section */}
      <section className="py-14 bg-gray-50">
        <div className="container mx-auto px-4">
          <SectionHeading 
            title="Student Workout Library" 
            subtitle="Quick, effective routines designed for busy schedules and small spaces"
          />
          
          <Tabs defaultValue="videos" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
              <TabsTrigger value="videos">Video Workouts</TabsTrigger>
              <TabsTrigger value="routines">Written Routines</TabsTrigger>
            </TabsList>
            
            <TabsContent value="videos" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {fitnessRoutines.map((routine, index) => (
                  <motion.div
                    key={routine.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all"
                  >
                    <div className="aspect-video relative">
                      <iframe
                        className="absolute inset-0 w-full h-full"
                        src={`https://www.youtube.com/embed/${routine.videoId}`}
                        title={routine.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-center mb-2">
                        <span className="bg-zenMint text-zenSage text-xs px-2 py-1 rounded-full">{routine.duration}</span>
                        <span className="text-xs text-gray-500">{routine.level}</span>
                      </div>
                      <h3 className="font-semibold text-lg mb-2">{routine.title}</h3>
                      <p className="text-sm text-gray-600 mb-4">{routine.description}</p>
                      <Button variant="outline" size="sm" className="w-full border-zenSage text-zenSage hover:bg-zenSage/10">
                        Add to Calendar
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="routines">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {fitnessRoutines.map((routine, index) => (
                  <Card key={routine.id} className="overflow-hidden">
                    <CardHeader className="bg-zenMint/20">
                      <div className="flex justify-between items-center">
                        <CardTitle>{routine.title}</CardTitle>
                        <div className="flex items-center space-x-2">
                          <span className="bg-white text-zenSage text-xs px-2 py-1 rounded-full">{routine.duration}</span>
                          <span className="bg-white text-gray-600 text-xs px-2 py-1 rounded-full">{routine.level}</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <p className="text-sm text-gray-600 mb-4">{routine.description}</p>
                      <div className="border-t pt-4 mt-4">
                        <h4 className="text-sm font-semibold mb-2 flex items-center">
                          <Dumbbell className="h-4 w-4 mr-2 text-zenPink" /> Exercise List
                        </h4>
                        <ul className="space-y-2">
                          {routine.exercises.map((exercise, i) => (
                            <li key={i} className="text-sm flex justify-between">
                              <span>{exercise.name}</span>
                              <span className="text-gray-500">{exercise.duration}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Monthly Calendar Section */}
      <section className="py-14 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <SectionHeading 
              title="Your Fitness Calendar" 
              subtitle="Plan your workouts for better consistency"
              className="mb-0"
            />
            <div className="flex space-x-2 mt-4 md:mt-0">
              <Button variant="outline" size="sm" className="text-sm">
                <Calendar className="h-4 w-4 mr-2" /> April 2025
              </Button>
              <Button variant="outline" size="sm" className="text-sm">
                <BarChart3 className="h-4 w-4 mr-2" /> View Stats
              </Button>
            </div>
          </div>
          
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-7 gap-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                  <div key={day} className="text-center font-medium text-sm text-gray-500">
                    {day}
                  </div>
                ))}
                {Array.from({ length: 30 }, (_, i) => i + 1).map((date) => {
                  const hasWorkout = [3, 5, 7, 10, 12, 15, 17, 19, 22, 24, 26, 28].includes(date);
                  const isToday = date === 19; // Assuming current date is 19th
                  
                  return (
                    <div 
                      key={date} 
                      className={`
                        aspect-square rounded-md flex flex-col items-center justify-center p-1 cursor-pointer
                        ${isToday ? 'border-2 border-zenSage' : 'border border-gray-100'}
                        ${hasWorkout ? 'bg-zenMint/20 hover:bg-zenMint/40' : 'hover:bg-gray-50'}
                      `}
                    >
                      <span className={`text-sm ${isToday ? 'font-medium text-zenSage' : ''}`}>{date}</span>
                      {hasWorkout && (
                        <div className="w-1.5 h-1.5 bg-zenSage rounded-full mt-1"></div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-14 bg-gradient-to-br from-zenPeach/20 via-zenLightPink/20 to-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-display font-semibold mb-4">Ready to boost your wellbeing?</h2>
            <p className="text-gray-600 mb-8">
              Regular activity improves focus, mood, and academic performance. Start your fitness journey today!
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button className="bg-zenSage hover:bg-zenSage/90 text-white">
                <Dumbbell className="h-4 w-4 mr-2" /> Start Today's Workout
              </Button>
              <Button variant="outline" className="border-zenSage text-zenSage hover:bg-zenSage/10">
                <Calendar className="h-4 w-4 mr-2" /> Create Custom Plan
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
