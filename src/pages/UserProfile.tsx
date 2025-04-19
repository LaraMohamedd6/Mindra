import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar as CalendarIcon, Edit2, BookOpen, Trash2, Tag, Save, Upload, User as UserIcon, BarChart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const avatarOptions = [
  "/placeholder.svg",
  "https://i.pravatar.cc/150?img=1",
  "https://i.pravatar.cc/150?img=2",
  "https://i.pravatar.cc/150?img=3",
  "https://i.pravatar.cc/150?img=4",
  "https://i.pravatar.cc/150?img=5",
  "https://i.pravatar.cc/150?img=6",
  "https://i.pravatar.cc/150?img=7",
  "https://i.pravatar.cc/150?img=8",
];

const moodData = [
  { date: "2023-04-10", value: 5, mood: "😊" },
  { date: "2023-04-11", value: 4, mood: "😊" },
  { date: "2023-04-12", value: 3, mood: "😐" },
  { date: "2023-04-13", value: 2, mood: "😔" },
  { date: "2023-04-14", value: 1, mood: "😔" },
  { date: "2023-04-15", value: 2, mood: "😔" },
  { date: "2023-04-16", value: 3, mood: "😐" },
  { date: "2023-04-17", value: 4, mood: "😊" },
  { date: "2023-04-18", value: 5, mood: "😊" },
  { date: "2023-04-19", value: 5, mood: "😊" },
];

const activityData = [
  { name: "Meditation", value: 35 },
  { name: "Yoga", value: 20 },
  { name: "Journaling", value: 15 },
  { name: "Reading", value: 30 },
];

const journalEntries = [
  {
    id: 1,
    date: "2023-04-19",
    title: "Finding Peace in Chaos",
    content: "Today was challenging, but I managed to find moments of calm through meditation and deep breathing exercises. The 10-minute guided session really helped clear my mind.",
    tags: ["meditation", "calm", "reflection"],
  },
  {
    id: 2,
    date: "2023-04-17",
    title: "Academic Pressure",
    content: "Feeling overwhelmed by upcoming exams. Need to create a better study schedule and remember to take breaks. The burnout is real, but I'm learning to pace myself better.",
    tags: ["stress", "academics", "planning"],
  },
  {
    id: 3,
    date: "2023-04-15",
    title: "Social Connection",
    content: "Spent time with friends today. It's amazing how much social connection can boost my mood. We went for coffee and just talked about life. These moments matter so much.",
    tags: ["friends", "connection", "gratitude"],
  },
];

const COLORS = ["#7CAE9E", "#E69EA2", "#FEC0B3", "#CFECE0"];
const MOOD_EMOJIS = ["😔", "😟", "😐", "🙂", "😊"];

export default function UserProfile() {
  const [selectedTab, setSelectedTab] = useState("overview");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [selectedAvatar, setSelectedAvatar] = useState(avatarOptions[0]);
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: "Alex Chen",
    email: "alex.chen@example.com",
    bio: "Psychology student passionate about mental wellness and mindfulness practices."
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editableProfile, setEditableProfile] = useState({ ...userProfile });
  const [moodHistory, setMoodHistory] = useState(moodData);
  const [journalData, setJournalData] = useState(journalEntries);
  const [newJournal, setNewJournal] = useState({ title: "", content: "", tags: "" });
  const [isAddingJournal, setIsAddingJournal] = useState(false);
  
  const { toast } = useToast();

  const handleMoodSelect = (mood: number) => {
    setSelectedMood(mood);
    
    if (selectedDate) {
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      const existingEntryIndex = moodHistory.findIndex(entry => entry.date === formattedDate);
      
      if (existingEntryIndex >= 0) {
        const updatedHistory = [...moodHistory];
        updatedHistory[existingEntryIndex] = { 
          ...updatedHistory[existingEntryIndex], 
          value: mood,
          mood: MOOD_EMOJIS[mood-1]
        };
        setMoodHistory(updatedHistory);
      } else {
        setMoodHistory([
          ...moodHistory,
          { date: formattedDate, value: mood, mood: MOOD_EMOJIS[mood-1] }
        ]);
      }
      
      toast({
        title: "Mood tracked!",
        description: `You're feeling ${MOOD_EMOJIS[mood-1]} today.`,
      });
    }
  };

  const getMoodForDate = (date: Date | undefined): number | null => {
    if (!date) return null;
    const formattedDate = format(date, 'yyyy-MM-dd');
    const entry = moodHistory.find(item => item.date === formattedDate);
    return entry ? entry.value : null;
  };

  const handleSaveProfile = () => {
    setUserProfile(editableProfile);
    setIsEditing(false);
    toast({
      title: "Profile updated",
      description: "Your profile has been successfully updated.",
    });
  };

  const handleAvatarChange = (avatar: string) => {
    setSelectedAvatar(avatar);
    setShowAvatarSelector(false);
    toast({
      title: "Avatar updated",
      description: "Your profile avatar has been updated.",
    });
  };

  const handleAddJournal = () => {
    if (!newJournal.title || !newJournal.content) return;
    
    const newEntry = {
      id: journalData.length + 1,
      date: format(new Date(), 'yyyy-MM-dd'),
      title: newJournal.title,
      content: newJournal.content,
      tags: newJournal.tags.split(",").map(tag => tag.trim()).filter(tag => tag)
    };
    
    setJournalData([newEntry, ...journalData]);
    setNewJournal({ title: "", content: "", tags: "" });
    setIsAddingJournal(false);
    
    toast({
      title: "Journal entry added",
      description: "Your new journal entry has been saved.",
    });
  };

  const handleDeleteJournal = (id: number) => {
    setJournalData(journalData.filter(entry => entry.id !== id));
    toast({
      title: "Journal entry deleted",
      description: "Your journal entry has been removed.",
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Card className="border-zenSeafoam overflow-hidden">
              <div className="h-32 bg-gradient-to-r from-zenSeafoam to-zenMint" />
              <div className="px-6 pb-6">
                <div className="flex flex-col md:flex-row items-center md:items-end gap-4 -mt-12 md:-mt-16 relative">
                  <div className="relative">
                    <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-white">
                      <AvatarImage src={selectedAvatar} alt="User avatar" />
                      <AvatarFallback>
                        <UserIcon className="h-12 w-12" />
                      </AvatarFallback>
                    </Avatar>
                    <Button 
                      size="icon" 
                      className="absolute bottom-0 right-0 bg-zenSage rounded-full h-8 w-8"
                      onClick={() => setShowAvatarSelector(!showAvatarSelector)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    
                    {showAvatarSelector && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="absolute left-0 top-full mt-2 bg-white p-3 rounded-lg shadow-lg border border-gray-100 z-10 grid grid-cols-3 gap-2"
                      >
                        {avatarOptions.map((avatar, index) => (
                          <Avatar
                            key={index}
                            className="h-12 w-12 cursor-pointer hover:opacity-80 border-2 border-transparent hover:border-zenSage"
                            onClick={() => handleAvatarChange(avatar)}
                          >
                            <AvatarImage src={avatar} alt="Avatar option" />
                          </Avatar>
                        ))}
                        <Button 
                          size="icon" 
                          variant="outline" 
                          className="h-12 w-12"
                          title="Upload custom avatar"
                        >
                          <Upload className="h-5 w-5" />
                        </Button>
                      </motion.div>
                    )}
                  </div>
                  
                  <div className="flex-grow text-center md:text-left mt-2 md:mt-0">
                    <h1 className="text-2xl font-display font-semibold">{userProfile.name}</h1>
                    <p className="text-gray-600">{userProfile.email}</p>
                    <p className="text-gray-600 mt-2 max-w-2xl">{userProfile.bio}</p>
                  </div>
                  
                  <div className="md:ml-auto mt-4 md:mt-0">
                    {!isEditing ? (
                      <Button 
                        onClick={() => setIsEditing(true)}
                        className="bg-zenSage hover:bg-zenSage/90"
                      >
                        <Edit2 className="h-4 w-4 mr-2" /> Edit Profile
                      </Button>
                    ) : (
                      <Button 
                        onClick={handleSaveProfile}
                        className="bg-zenSage hover:bg-zenSage/90"
                      >
                        <Save className="h-4 w-4 mr-2" /> Save Changes
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {isEditing ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle>Edit Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={editableProfile.name}
                      onChange={(e) => setEditableProfile({...editableProfile, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={editableProfile.email}
                      onChange={(e) => setEditableProfile({...editableProfile, email: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={editableProfile.bio}
                      onChange={(e) => setEditableProfile({...editableProfile, bio: e.target.value})}
                      className="h-24"
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button className="bg-zenSage hover:bg-zenSage/90" onClick={handleSaveProfile}>
                    Save Changes
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ) : (
            <Tabs 
              value={selectedTab} 
              onValueChange={setSelectedTab}
              className="space-y-6"
            >
              <TabsList className="bg-gray-100 p-1 w-full flex justify-center">
                <TabsTrigger value="overview" className="flex-1">Overview</TabsTrigger>
                <TabsTrigger value="mood-tracker" className="flex-1">Mood Tracker</TabsTrigger>
                <TabsTrigger value="journal" className="flex-1">Journal</TabsTrigger>
                <TabsTrigger value="progress" className="flex-1">Progress</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <Card className="h-full">
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <BarChart className="h-5 w-5 mr-2" />
                          Recent Mood Trends
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                              data={moodHistory.slice(-7)}
                              margin={{
                                top: 10,
                                right: 10,
                                left: -20,
                                bottom: 0,
                              }}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="date" tickFormatter={(date) => new Date(date).toLocaleDateString(undefined, { weekday: 'short' })} />
                              <YAxis domain={[0, 5]} ticks={[1, 2, 3, 4, 5]} />
                              <RechartsTooltip 
                                formatter={(value) => [`${MOOD_EMOJIS[Number(value)-1]} (${value}/5)`, 'Mood']}
                                labelFormatter={(date) => new Date(date).toLocaleDateString()} 
                              />
                              <Area 
                                type="monotone" 
                                dataKey="value" 
                                stroke="#7CAE9E" 
                                fill="#CFECE0" 
                                activeDot={{ r: 8 }} 
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <Card className="h-full">
                      <CardHeader>
                        <CardTitle>Activity Distribution</CardTitle>
                      </CardHeader>
                      <CardContent className="flex flex-col items-center">
                        <div className="h-64 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={activityData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                              >
                                {activityData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <RechartsTooltip />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mt-4 w-full">
                          <Card className="p-4">
                            <h3 className="text-sm font-semibold text-gray-500">Weekly Meditation</h3>
                            <div className="text-3xl font-bold text-zenSage mt-1">3.5 hrs</div>
                          </Card>
                          <Card className="p-4">
                            <h3 className="text-sm font-semibold text-gray-500">Journal Entries</h3>
                            <div className="text-3xl font-bold text-zenPink mt-1">{journalData.length}</div>
                          </Card>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="md:col-span-2"
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle>Your Progress</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-gray-600">Meditation Goal (5 hours/week)</span>
                            <span className="font-medium">70%</span>
                          </div>
                          <Progress value={70} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-gray-600">Yoga Practice (3 sessions/week)</span>
                            <span className="font-medium">45%</span>
                          </div>
                          <Progress value={45} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-gray-600">Mood Improvement</span>
                            <span className="font-medium">60%</span>
                          </div>
                          <Progress value={60} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-gray-600">Journaling (5 entries/week)</span>
                            <span className="font-medium">80%</span>
                          </div>
                          <Progress value={80} className="h-2" />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              </TabsContent>
              
              <TabsContent value="mood-tracker">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle>Track Your Mood</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <p className="mb-2 font-medium">Select a date:</p>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant={"outline"}
                                className="w-full justify-start text-left font-normal"
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={selectedDate}
                                onSelect={setSelectedDate}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        
                        <div>
                          <p className="mb-4 font-medium">How are you feeling today?</p>
                          <div className="flex justify-between">
                            {MOOD_EMOJIS.map((emoji, index) => {
                              const moodValue = index + 1;
                              const isSelected = selectedMood === moodValue || 
                                (selectedMood === null && getMoodForDate(selectedDate) === moodValue);
                              
                              return (
                                <Button
                                  key={index}
                                  variant={isSelected ? "default" : "outline"}
                                  className={`rounded-full h-14 w-14 text-2xl ${
                                    isSelected ? "bg-zenSage hover:bg-zenSage/90" : ""
                                  }`}
                                  onClick={() => handleMoodSelect(moodValue)}
                                >
                                  {emoji}
                                </Button>
                              );
                            })}
                          </div>
                          <div className="flex justify-between text-xs text-gray-500 mt-2 px-1">
                            <span>Very Sad</span>
                            <span>Sad</span>
                            <span>Neutral</span>
                            <span>Good</span>
                            <span>Excellent</span>
                          </div>
                        </div>
                        
                        {getMoodForDate(selectedDate) && (
                          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                            <p className="font-medium">Your mood on {selectedDate ? format(selectedDate, "PPP") : ""}:</p>
                            <div className="flex items-center mt-2">
                              <span className="text-4xl mr-2">
                                {MOOD_EMOJIS[getMoodForDate(selectedDate) as number - 1]}
                              </span>
                              <span className="text-lg font-medium">
                                {getMoodForDate(selectedDate)}/5
                              </span>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Card className="h-full">
                      <CardHeader>
                        <CardTitle>Mood History</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                              data={moodHistory}
                              margin={{
                                top: 10,
                                right: 10,
                                left: -20,
                                bottom: 0,
                              }}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="date" />
                              <YAxis domain={[0, 5]} ticks={[1, 2, 3, 4, 5]} />
                              <RechartsTooltip 
                                formatter={(value) => [`${MOOD_EMOJIS[Number(value)-1]} (${value}/5)`, 'Mood']}
                                labelFormatter={(date) => new Date(date).toLocaleDateString()} 
                              />
                              <Area 
                                type="monotone" 
                                dataKey="value" 
                                stroke="#7CAE9E" 
                                fill="#CFECE0" 
                                activeDot={{ r: 8 }} 
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                        
                        <div className="mt-6 space-y-2">
                          <h3 className="font-medium">Recent entries:</h3>
                          <div className="max-h-40 overflow-y-auto space-y-2">
                            {moodHistory.slice().reverse().slice(0, 5).map((entry, idx) => (
                              <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                <span>{new Date(entry.date).toLocaleDateString()}</span>
                                <div className="flex items-center">
                                  <span className="text-2xl mr-1">{entry.mood}</span>
                                  <span>{entry.value}/5</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              </TabsContent>
              
              <TabsContent value="journal">
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-semibold">Your Journal</h2>
                    <Button 
                      className="bg-zenSage hover:bg-zenSage/90"
                      onClick={() => setIsAddingJournal(!isAddingJournal)}
                    >
                      {isAddingJournal ? "Cancel" : "New Entry"}
                    </Button>
                  </div>
                  
                  {isAddingJournal && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <Card className="mb-6">
                        <CardHeader>
                          <CardTitle>New Journal Entry</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <Label htmlFor="title">Title</Label>
                            <Input
                              id="title"
                              value={newJournal.title}
                              onChange={(e) => setNewJournal({...newJournal, title: e.target.value})}
                              placeholder="Enter a title for your entry"
                            />
                          </div>
                          <div>
                            <Label htmlFor="content">Content</Label>
                            <Textarea
                              id="content"
                              value={newJournal.content}
                              onChange={(e) => setNewJournal({...newJournal, content: e.target.value})}
                              placeholder="Write your thoughts..."
                              className="h-32"
                            />
                          </div>
                          <div>
                            <Label htmlFor="tags">Tags (comma separated)</Label>
                            <Input
                              id="tags"
                              value={newJournal.tags}
                              onChange={(e) => setNewJournal({...newJournal, tags: e.target.value})}
                              placeholder="meditation, reflection, gratitude"
                            />
                          </div>
                        </CardContent>
                        <CardFooter className="flex justify-end">
                          <Button className="bg-zenSage hover:bg-zenSage/90" onClick={handleAddJournal}>
                            Save Entry
                          </Button>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  )}
                  
                  <div className="space-y-4">
                    {journalData.length === 0 ? (
                      <div className="text-center py-12">
                        <BookOpen className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                        <h3 className="text-xl font-medium text-gray-600">No journal entries yet</h3>
                        <p className="text-gray-500 mt-2">Start writing to track your thoughts and feelings</p>
                      </div>
                    ) : (
                      journalData.map((entry, index) => (
                        <motion.div
                          key={entry.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <Card>
                            <CardHeader>
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="text-sm text-gray-500 mb-1">{new Date(entry.date).toLocaleDateString()}</p>
                                  <CardTitle>{entry.title}</CardTitle>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDeleteJournal(entry.id)}
                                >
                                  <Trash2 className="h-4 w-4 text-gray-500 hover:text-red-500" />
                                </Button>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <p className="whitespace-pre-line">{entry.content}</p>
                              
                              {entry.tags && entry.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-4">
                                  {entry.tags.map((tag, tagIndex) => (
                                    <Badge key={tagIndex} variant="secondary" className="flex items-center">
                                      <Tag className="h-3 w-3 mr-1" />
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              )}
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))
                    )}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="progress">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="md:col-span-2"
                  >
                    <Card>
                      <CardHeader>
                        <CardTitle>Your Wellness Journey</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <Card className="p-4">
                            <div className="text-sm font-semibold text-gray-500 mb-1">Meditation Sessions</div>
                            <div className="text-3xl font-bold text-zenSage">18</div>
                            <div className="text-xs text-gray-500 mt-1">Last 30 days</div>
                          </Card>
                          <Card className="p-4">
                            <div className="text-sm font-semibold text-gray-500 mb-1">Yoga Practice</div>
                            <div className="text-3xl font-bold text-zenPink">8</div>
                            <div className="text-xs text-gray-500 mt-1">Last 30 days</div>
                          </Card>
                          <Card className="p-4">
                            <div className="text-sm font-semibold text-gray-500 mb-1">Journal Entries</div>
                            <div className="text-3xl font-bold text-zenPeach">{journalData.length}</div>
                            <div className="text-xs text-gray-500 mt-1">Total</div>
                          </Card>
                          <Card className="p-4">
                            <div className="text-sm font-semibold text-gray-500 mb-1">Average Mood</div>
                            <div className="text-3xl font-bold text-zenSage flex items-center">
                              3.8
                              <span className="text-xl ml-2">🙂</span>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">Last 30 days</div>
                          </Card>
                        </div>
                        
                        <div className="mt-8 space-y-6">
                          <div>
                            <div className="flex justify-between mb-2">
                              <span className="text-gray-600">Weekly Meditation Goal (5 hours)</span>
                              <span className="font-medium">70%</span>
                            </div>
                            <Progress value={70} className="h-3" />
                          </div>
                          <div>
                            <div className="flex justify-between mb-2">
                              <span className="text-gray-600">Weekly Yoga Sessions (3 sessions)</span>
                              <span className="font-medium">67%</span>
                            </div>
                            <Progress value={67} className="h-3" />
                          </div>
                          <div>
                            <div className="flex justify-between mb-2">
                              <span className="text-gray-600">Weekly Journal Entries (5 entries)</span>
                              <span className="font-medium">60%</span>
                            </div>
                            <Progress value={60} className="h-3" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Card className="h-full">
                      <CardHeader>
                        <CardTitle>Meditation Progress</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                              data={[
                                { date: "Week 1", value: 120 },
                                { date: "Week 2", value: 150 },
                                { date: "Week 3", value: 100 },
                                { date: "Week 4", value: 180 },
                                { date: "Week 5", value: 210 },
                                { date: "Week 6", value: 190 },
                              ]}
                              margin={{
                                top: 10,
                                right: 10,
                                left: 0,
                                bottom: 0,
                              }}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="date" />
                              <YAxis />
                              <RechartsTooltip formatter={(value) => [`${value} minutes`, 'Meditation']} />
                              <Area 
                                type="monotone" 
                                dataKey="value" 
                                stroke="#7CAE9E" 
                                fill="#CFECE0" 
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                        
                        <div className="mt-4 p-4 bg-zenMint rounded-lg">
                          <h3 className="font-medium text-zenSage">Insight</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            You're meditating 15% more than last month! Consistent meditation has been shown to reduce stress and improve focus.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Card className="h-full">
                      <CardHeader>
                        <CardTitle>Mood Improvement</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-64">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                              data={[
                                { date: "Week 1", value: 2.5 },
                                { date: "Week 2", value: 2.8 },
                                { date: "Week 3", value: 3.2 },
                                { date: "Week 4", value: 3.0 },
                                { date: "Week 5", value: 3.5 },
                                { date: "Week 6", value: 3.8 },
                              ]}
                              margin={{
                                top: 10,
                                right: 10,
                                left: 0,
                                bottom: 0,
                              }}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="date" />
                              <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} />
                              <RechartsTooltip 
                                formatter={(value) => [`${value}/5`, 'Average Mood']}
                              />
                              <Area 
                                type="monotone" 
                                dataKey="value" 
                                stroke="#E69EA2" 
                                fill="#F8E8E9" 
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                        
                        <div className="mt-4 p-4 bg-zenLightPink rounded-lg">
                          <h3 className="font-medium text-zenPink">Insight</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            Your mood has been trending upward over the past 6 weeks! Regular journaling and meditation seem to be helping.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </Layout>
  );
}
