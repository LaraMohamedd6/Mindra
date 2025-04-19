
import Layout from "@/components/layout/Layout";
import { motion } from "framer-motion";
import SectionHeading from "@/components/common/SectionHeading";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Apple, Clock, Coffee, Moon, Sun, Brain, Calendar, CheckCircle2, List, MessageSquare } from "lucide-react";

export default function Lifestyle() {
  const dailyRoutineTips = [
    {
      id: 1,
      time: "6:00 - 7:00 AM",
      title: "Morning Routine",
      description: "Wake up consistently at the same time every day, even on weekends. Have a glass of water, do some light stretching, and get natural sunlight exposure.",
      icon: <Sun className="h-5 w-5" />,
      color: "text-amber-500",
      bgColor: "bg-amber-100"
    },
    {
      id: 2,
      time: "7:00 - 8:00 AM",
      title: "Breakfast & Planning",
      description: "Eat a balanced breakfast with protein. Review your day's schedule and set 3 main goals for the day.",
      icon: <Coffee className="h-5 w-5" />,
      color: "text-brown-500",
      bgColor: "bg-amber-50"
    },
    {
      id: 3,
      time: "8:00 AM - 12:00 PM",
      title: "Focus Block",
      description: "Schedule your most challenging cognitive work during your morning peak concentration hours. Take a 5-minute break every 25-30 minutes.",
      icon: <Brain className="h-5 w-5" />,
      color: "text-indigo-500",
      bgColor: "bg-indigo-100"
    },
    {
      id: 4,
      time: "12:00 - 1:00 PM",
      title: "Lunch Break",
      description: "Step away from your desk for lunch. Eat mindfully without screens. Consider a short walk to refresh your mind.",
      icon: <Apple className="h-5 w-5" />,
      color: "text-emerald-500",
      bgColor: "bg-emerald-100"
    },
    {
      id: 5,
      time: "1:00 - 5:00 PM",
      title: "Afternoon Work",
      description: "Schedule collaborative or less intense work for the afternoon. Have healthy snacks available to maintain energy.",
      icon: <Calendar className="h-5 w-5" />,
      color: "text-blue-500",
      bgColor: "bg-blue-100"
    },
    {
      id: 6,
      time: "5:00 - 7:00 PM",
      title: "Exercise & Dinner",
      description: "Get at least 30 minutes of physical activity and eat dinner at least 2-3 hours before bedtime.",
      icon: <CheckCircle2 className="h-5 w-5" />,
      color: "text-pink-500",
      bgColor: "bg-pink-100"
    },
    {
      id: 7,
      time: "7:00 - 9:00 PM",
      title: "Wind Down",
      description: "Review tomorrow's schedule. Engage in relaxing activities like reading or journaling. Avoid screens 1 hour before bed.",
      icon: <Moon className="h-5 w-5" />,
      color: "text-purple-500",
      bgColor: "bg-purple-100"
    },
  ];

  const selfCareChecklist = [
    { id: "sleep", label: "7-9 hours of sleep", category: "Physical" },
    { id: "water", label: "8 glasses of water", category: "Physical" },
    { id: "meals", label: "3 balanced meals", category: "Physical" },
    { id: "exercise", label: "30+ minutes of movement", category: "Physical" },
    { id: "screentime", label: "Screen-free breaks", category: "Mental" },
    { id: "meditation", label: "5+ minutes of meditation", category: "Mental" },
    { id: "nature", label: "Time outdoors", category: "Mental" },
    { id: "hobby", label: "Engaging in a hobby", category: "Mental" },
    { id: "connection", label: "Meaningful conversation", category: "Social" },
    { id: "boundaries", label: "Setting healthy boundaries", category: "Social" },
    { id: "gratitude", label: "Practicing gratitude", category: "Emotional" },
    { id: "emotions", label: "Processing emotions", category: "Emotional" },
  ];

  const healthyHabits = [
    {
      title: "Regular Sleep Schedule",
      description: "Go to bed and wake up at consistent times, even on weekends.",
      tip: "Use the 'Bedtime' feature on your phone to set sleep reminders."
    },
    {
      title: "Hydration Routine",
      description: "Keep a water bottle with you and refill it throughout the day.",
      tip: "Add fruit or herbs for flavor if plain water is unappealing."
    },
    {
      title: "Meal Planning",
      description: "Prepare meals in advance to avoid unhealthy choices when busy.",
      tip: "Sunday meal prep can save time and money during the week."
    },
    {
      title: "Digital Boundaries",
      description: "Set times to disconnect from devices, especially before sleep.",
      tip: "Try the 'Do Not Disturb' mode during study sessions and sleeping hours."
    },
    {
      title: "Movement Breaks",
      description: "Take short movement breaks between long periods of sitting.",
      tip: "Set a timer for every 45-60 minutes as a reminder to stand and stretch."
    },
    {
      title: "Social Connections",
      description: "Maintain regular contact with supportive friends and family.",
      tip: "Schedule regular check-ins even during busy academic periods."
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
              Student Lifestyle Balance
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8">
              Practical tips and tools to help you maintain wellness while managing academic demands.
            </p>
            <Button className="bg-zenSage hover:bg-zenSage/90 text-white">
              Start Healthy Habits
            </Button>
          </div>
        </motion.div>
        
        {/* Abstract shape decoration */}
        <div className="absolute right-0 top-1/4 transform translate-x-1/3 -translate-y-1/4 opacity-20">
          <svg width="500" height="500" viewBox="0 0 500 500" fill="none">
            <circle cx="250" cy="250" r="250" fill="#CFECE0" />
          </svg>
        </div>
      </section>

      {/* Daily Routines Section */}
      <section className="py-14 bg-white">
        <div className="container mx-auto px-4">
          <SectionHeading 
            title="Student Daily Routine" 
            subtitle="Structure your day for optimal wellbeing and productivity"
          />
          
          <div className="relative">
            <div className="absolute left-1/2 top-0 h-full w-0.5 bg-zenSeafoam/30 transform -translate-x-1/2 hidden md:block"></div>
            
            <div className="space-y-8">
              {dailyRoutineTips.map((routine, idx) => (
                <motion.div
                  key={routine.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="relative"
                >
                  <div className={`md:w-1/2 ${idx % 2 === 0 ? 'md:pr-12 md:ml-0' : 'md:pl-12 md:ml-auto'}`}>
                    <div className="bg-white rounded-xl shadow-sm p-6 relative z-10">
                      <div className="flex items-center mb-3">
                        <div className={`p-2 rounded-full mr-3 ${routine.bgColor}`}>
                          {routine.icon}
                        </div>
                        <h3 className="font-semibold text-lg">{routine.title}</h3>
                      </div>
                      <div className="mb-3">
                        <span className="text-sm bg-gray-100 px-2 py-1 rounded-full text-gray-600">
                          {routine.time}
                        </span>
                      </div>
                      <p className="text-gray-600">{routine.description}</p>
                    </div>
                  </div>
                  
                  <div className={`absolute top-6 left-1/2 transform -translate-x-1/2 w-5 h-5 rounded-full bg-white border-2 border-zenSeafoam z-20 hidden md:block`}></div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Self-Care Checklist Section */}
      <section className="py-14 bg-gray-50">
        <div className="container mx-auto px-4">
          <SectionHeading 
            title="Daily Self-Care Checklist" 
            subtitle="Simple habits to prioritize your wellbeing"
          />
          
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Today's Wellness Habits</CardTitle>
                  <CardDescription>April 19, 2025</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="text-sm">
                    <Calendar className="h-4 w-4 mr-2" /> View History
                  </Button>
                  <Button variant="outline" size="sm" className="text-sm">
                    <List className="h-4 w-4 mr-2" /> Customize
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full max-w-lg mx-auto grid-cols-5 mb-6">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="physical">Physical</TabsTrigger>
                  <TabsTrigger value="mental">Mental</TabsTrigger>
                  <TabsTrigger value="social">Social</TabsTrigger>
                  <TabsTrigger value="emotional">Emotional</TabsTrigger>
                </TabsList>
                
                {["all", "physical", "mental", "social", "emotional"].map(tab => (
                  <TabsContent key={tab} value={tab}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {selfCareChecklist
                        .filter(item => tab === "all" || item.category.toLowerCase() === tab)
                        .map((item) => (
                          <div key={item.id} className="flex items-center space-x-2">
                            <Checkbox id={item.id} />
                            <label
                              htmlFor={item.id}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {item.label}
                              <span className="ml-2 text-xs text-gray-500">({item.category})</span>
                            </label>
                          </div>
                        ))}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
            <CardFooter className="border-t pt-4 flex justify-between">
              <div className="text-sm text-gray-500">
                <span className="font-medium text-zenSage">Pro tip:</span> Focus on consistency rather than perfection
              </div>
              <Button className="bg-zenSage hover:bg-zenSage/90 text-white">Save Today's Progress</Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* Healthy Habits Section */}
      <section className="py-14 bg-white">
        <div className="container mx-auto px-4">
          <SectionHeading 
            title="Healthy Student Habits" 
            subtitle="Simple changes that make a big difference"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {healthyHabits.map((habit, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all"
              >
                <div className="h-2 bg-gradient-to-r from-zenPink to-zenSeafoam"></div>
                <div className="p-6">
                  <h3 className="font-semibold text-lg mb-3">{habit.title}</h3>
                  <p className="text-gray-600 mb-4">{habit.description}</p>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm flex items-start">
                      <MessageSquare className="h-4 w-4 text-zenSage mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-600 italic">{habit.tip}</span>
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Food Tips Section */}
      <section className="py-14 bg-gradient-to-br from-zenMint/30 to-white">
        <div className="container mx-auto px-4">
          <SectionHeading 
            title="Student Nutrition Tips" 
            subtitle="Simple and affordable eating strategies for busy students"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="rounded-xl overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1547592180-85f173990888?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80" 
                alt="Student preparing healthy meal" 
                className="w-full h-64 object-cover"
              />
            </div>
            
            <div>
              <h3 className="text-xl font-semibold mb-4">Brain-Boosting Foods on a Budget</h3>
              <ScrollArea className="h-64 pr-4">
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="bg-zenMint p-1 rounded-full mr-3 mt-1">
                      <Apple className="h-4 w-4 text-zenSage" />
                    </div>
                    <div>
                      <h4 className="font-medium">Eggs</h4>
                      <p className="text-sm text-gray-600">Affordable protein source rich in choline for memory and brain development. Make hard-boiled eggs for quick snacks between classes.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-zenMint p-1 rounded-full mr-3 mt-1">
                      <Apple className="h-4 w-4 text-zenSage" />
                    </div>
                    <div>
                      <h4 className="font-medium">Frozen Berries</h4>
                      <p className="text-sm text-gray-600">More affordable than fresh but still packed with antioxidants. Add to oatmeal or yogurt for a quick breakfast before morning lectures.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-zenMint p-1 rounded-full mr-3 mt-1">
                      <Apple className="h-4 w-4 text-zenSage" />
                    </div>
                    <div>
                      <h4 className="font-medium">Canned Tuna</h4>
                      <p className="text-sm text-gray-600">Budget-friendly omega-3 source. Make a quick tuna sandwich or add to pasta for a brain-boosting dinner during exam week.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-zenMint p-1 rounded-full mr-3 mt-1">
                      <Apple className="h-4 w-4 text-zenSage" />
                    </div>
                    <div>
                      <h4 className="font-medium">Peanut Butter</h4>
                      <p className="text-sm text-gray-600">Healthy fats and protein. Keep in your dorm for quick energy on toast or with apple slices.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-zenMint p-1 rounded-full mr-3 mt-1">
                      <Apple className="h-4 w-4 text-zenSage" />
                    </div>
                    <div>
                      <h4 className="font-medium">Lentils</h4>
                      <p className="text-sm text-gray-600">Inexpensive plant protein and fiber. Make a big batch of lentil soup to freeze in portions for busy weeknights.</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <div className="bg-zenMint p-1 rounded-full mr-3 mt-1">
                      <Apple className="h-4 w-4 text-zenSage" />
                    </div>
                    <div>
                      <h4 className="font-medium">Oats</h4>
                      <p className="text-sm text-gray-600">Cheap, filling breakfast that provides slow-release energy. Prepare overnight oats for grab-and-go breakfasts before early classes.</p>
                    </div>
                  </li>
                </ul>
              </ScrollArea>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-14 bg-white">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-display font-semibold mb-4">Start Your Wellness Journey Today</h2>
            <p className="text-gray-600 mb-6">
              Small daily habits lead to significant improvements in your wellbeing and academic performance.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button className="bg-zenSage hover:bg-zenSage/90 text-white">
                <Calendar className="h-4 w-4 mr-2" /> Create Personalized Plan
              </Button>
              <Button variant="outline" className="border-zenSage text-zenSage hover:bg-zenSage/10">
                <Clock className="h-4 w-4 mr-2" /> Set Daily Reminders
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
