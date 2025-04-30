import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Edit2,
  Mail,
  User as UserIcon,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";
import Overview from "@/components/profile/Overview";
import MoodTracker from "@/components/profile/MoodTracker";
import Journal from "@/components/profile/Journal";
import Progress from "@/components/profile/Progress";

const avatarOptions = [
  "https://api.dicebear.com/9.x/micah/svg?seed=Caleb&hair=fonze,full,pixie,dannyPhantom&hairColor=000000,77311d,ac6651,e0ddff,f4d150,ffeba4&mouth=laughing,smile,smirk",
  "https://api.dicebear.com/9.x/micah/svg?seed=Leah&hair=fonze,full,pixie,dannyPhantom&hairColor=000000,77311d,ac6651,e0ddff,f4d150,ffeba4&mouth=laughing,smile,smirk",
  "https://api.dicebear.com/9.x/micah/svg?seed=Easton&hair=fonze,full,pixie,dannyPhantom&hairColor=000000,77311d,ac6651,e0ddff,f4d150,ffeba4&mouth=laughing,smile,smirk",
  "https://api.dicebear.com/9.x/micah/svg?seed=Ryan&hair=fonze,full,pixie,dannyPhantom&hairColor=000000,77311d,ac6651,e0ddff,f4d150,ffeba4&mouth=laughing,smile,smirk",
  "https://api.dicebear.com/9.x/micah/svg?seed=Liam&hair=fonze,full,pixie,dannyPhantom&hairColor=000000,77311d,ac6651,e0ddff,f4d150,ffeba4&mouth=laughing,smile,smirk",
  "https://api.dicebear.com/9.x/micah/svg?seed=Eliza&hair=fonze,full,pixie,dannyPhantom&hairColor=000000,77311d,ac6651,e0ddff,f4d150,ffeba4&mouth=laughing,smile,smirk",
  "https://api.dicebear.com/9.x/micah/svg?seed=Eden&hair=fonze,full,pixie,dannyPhantom&hairColor=000000,77311d,ac6651,e0ddff,f4d150,ffeba4&mouth=laughing,smile,smirk",
  "https://api.dicebear.com/9.x/micah/svg?seed=Sawyer&hair=fonze,full,pixie,dannyPhantom&hairColor=000000,77311d,ac6651,e0ddff,f4d150,ffeba4&mouth=laughing,smile,smirk",
  "https://api.dicebear.com/9.x/micah/svg?seed=Mason&hair=fonze,full,pixie,dannyPhantom&hairColor=000000,77311d,ac6651,e0ddff,f4d150,ffeba4&mouth=laughing,smile,smirk",
  "https://api.dicebear.com/9.x/micah/svg?seed=Aiden&hair=fonze,full,pixie,dannyPhantom&hairColor=000000,77311d,ac6651,e0ddff,f4d150,ffeba4&mouth=laughing,smile,smirk",
  "https://api.dicebear.com/9.x/micah/svg?seed=Christian&hair=fonze,full,pixie,dannyPhantom&hairColor=000000,77311d,ac6651,e0ddff,f4d150,ffeba4&mouth=laughing,smile,smirk",
  "https://api.dicebear.com/9.x/micah/svg?seed=Emery&hair=fonze,full,pixie,dannyPhantom&hairColor=000000,77311d,ac6651,e0ddff,f4d150,ffeba4&mouth=laughing,smile,smirk",
  "https://api.dicebear.com/9.x/personas/svg?seed=Caleb&skinColor=b16a5b,d78774,e5a07e,e7a391,eeb4a4",
  "https://api.dicebear.com/9.x/personas/svg?seed=Leah&skinColor=b16a5b,d78774,e5a07e,e7a391,eeb4a4",
  "https://api.dicebear.com/9.x/personas/svg?seed=Easton&skinColor=b16a5b,d78774,e5a07e,e7a391,eeb4a4",
  "https://api.dicebear.com/9.x/personas/svg?seed=Katherine&skinColor=b16a5b,d78774,e5a07e,e7a391,eeb4a4",
  "https://api.dicebear.com/9.x/personas/svg?seed=Ryan&skinColor=b16a5b,d78774,e5a07e,e7a391,eeb4a4",
  "https://api.dicebear.com/9.x/personas/svg?seed=Liam&skinColor=b16a5b,d78774,e5a07e,e7a391,eeb4a4",
  "https://api.dicebear.com/9.x/personas/svg?seed=Eliza&skinColor=b16a5b,d78774,e5a07e,e7a391,eeb4a4",
  "https://api.dicebear.com/9.x/personas/svg?seed=Robert&skinColor=b16a5b,d78774,e5a07e,e7a391,eeb4a4",
  "https://api.dicebear.com/9.x/personas/svg?seed=Christian&skinColor=b16a5b,d78774,e5a07e,e7a391,eeb4a4",
  "https://api.dicebear.com/9.x/adventurer/svg?seed=Caleb&hairColor=0e0e0e,562306,592454,6a4e35,796a45,85c2c6,ab2a18,ac6511,afafaf,b9a05f,cb6820,dba3be,e5d7a3&mouth=variant01,variant02,variant03,variant04,variant05,variant06,variant07,variant08,variant09,variant10,variant11,variant12,variant16,variant17,variant18,variant19,variant20,variant21,variant22,variant23,variant24,variant25,variant26,variant27,variant28,variant29,variant30&skinColor=9e5622,ecad80,f2d3b1",
  "https://api.dicebear.com/9.x/adventurer/svg?seed=Leah&hairColor=0e0e0e,562306,592454,6a4e35,796a45,85c2c6,ab2a18,ac6511,afafaf,b9a05f,cb6820,dba3be,e5d7a3&mouth=variant01,variant02,variant03,variant04,variant05,variant06,variant07,variant08,variant09,variant10,variant11,variant12,variant16,variant17,variant18,variant19,variant20,variant21,variant22,variant23,variant24,variant25,variant26,variant27,variant28,variant29,variant30&skinColor=9e5622,ecad80,f2d3b1",
  "https://api.dicebear.com/9.x/adventurer/svg?seed=Easton&hairColor=0e0e0e,562306,592454,6a4e35,796a45,85c2c6,ab2a18,ac6511,afafaf,b9a05f,cb6820,dba3be,e5d7a3&mouth=variant01,variant02,variant03,variant04,variant05,variant06,variant07,variant08,variant09,variant10,variant11,variant12,variant16,variant17,variant18,variant19,variant20,variant21,variant22,variant23,variant24,variant25,variant26,variant27,variant28,variant29,variant30&skinColor=9e5622,ecad80,f2d3b1",
  "https://api.dicebear.com/9.x/adventurer/svg?seed=Katherine&hairColor=0e0e0e,562306,592454,6a4e35,796a45,85c2c6,ab2a18,ac6511,afafaf,b9a05f,cb6820,dba3be,e5d7a3&mouth=variant01,variant02,variant03,variant04,variant05,variant06,variant07,variant08,variant09,variant10,variant11,variant12,variant16,variant17,variant18,variant19,variant20,variant21,variant22,variant23,variant24,variant25,variant26,variant27,variant28,variant29,variant30&skinColor=9e5622,ecad80,f2d3b1",
  "https://api.dicebear.com/9.x/adventurer/svg?seed=Wyatt&hairColor=0e0e0e,562306,592454,6a4e35,796a45,85c2c6,ab2a18,ac6511,afafaf,b9a05f,cb6820,dba3be,e5d7a3&mouth=variant01,variant02,variant03,variant04,variant05,variant06,variant07,variant08,variant09,variant10,variant11,variant12,variant16,variant17,variant18,variant19,variant20,variant21,variant22,variant23,variant24,variant25,variant26,variant27,variant28,variant29,variant30&skinColor=9e5622,ecad80,f2d3b1",
  "https://api.dicebear.com/9.x/adventurer/svg?seed=Kingston&hairColor=0e0e0e,562306,592454,6a4e35,796a45,85c2c6,ab2a18,ac6511,afafaf,b9a05f,cb6820,dba3be,e5d7a3&mouth=variant01,variant02,variant03,variant04,variant05,variant06,variant07,variant08,variant09,variant10,variant11,variant12,variant16,variant17,variant18,variant19,variant20,variant21,variant22,variant23,variant24,variant25,variant26,variant27,variant28,variant29,variant30&skinColor=9e5622,ecad80,f2d3b1",
  "https://api.dicebear.com/9.x/adventurer/svg?seed=Ryan&hairColor=0e0e0e,562306,592454,6a4e35,796a45,85c2c6,ab2a18,ac6511,afafaf,b9a05f,cb6820,dba3be,e5d7a3&mouth=variant01,variant02,variant03,variant04,variant05,variant06,variant07,variant08,variant09,variant10,variant11,variant12,variant16,variant17,variant18,variant19,variant20,variant21,variant22,variant23,variant24,variant25,variant26,variant27,variant28,variant29,variant30&skinColor=9e5622,ecad80,f2d3b1",
  "https://api.dicebear.com/9.x/adventurer/svg?seed=Liam&hairColor=0e0e0e,562306,592454,6a4e35,796a45,85c2c6,ab2a18,ac6511,afafaf,b9a05f,cb6820,dba3be,e5d7a3&mouth=variant01,variant02,variant03,variant04,variant05,variant06,variant07,variant08,variant09,variant10,variant11,variant12,variant16,variant17,variant18,variant19,variant20,variant21,variant22,variant23,variant24,variant25,variant26,variant27,variant28,variant29,variant30&skinColor=9e5622,ecad80,f2d3b1",
  "https://api.dicebear.com/9.x/adventurer/svg?seed=Nolan&hairColor=0e0e0e,562306,592454,6a4e35,796a45,85c2c6,ab2a18,ac6511,afafaf,b9a05f,cb6820,dba3be,e5d7a3&mouth=variant01,variant02,variant03,variant04,variant05,variant06,variant07,variant08,variant09,variant10,variant11,variant12,variant16,variant17,variant18,variant19,variant20,variant21,variant22,variant23,variant24,variant25,variant26,variant27,variant28,variant29,variant30&skinColor=9e5622,ecad80,f2d3b1",
  "https://api.dicebear.com/9.x/adventurer/svg?seed=Robert&hairColor=0e0e0e,562306,592454,6a4e35,796a45,85c2c6,ab2a18,ac6511,afafaf,b9a05f,cb6820,dba3be,e5d7a3&mouth=variant01,variant02,variant03,variant04,variant05,variant06,variant07,variant08,variant09,variant10,variant11,variant12,variant16,variant17,variant18,variant19,variant20,variant21,variant22,variant23,variant24,variant25,variant26,variant27,variant28,variant29,variant30&skinColor=9e5622,ecad80,f2d3b1",
  "https://api.dicebear.com/9.x/adventurer/svg?seed=Eden&hairColor=0e0e0e,562306,592454,6a4e35,796a45,85c2c6,ab2a18,ac6511,afafaf,b9a05f,cb6820,dba3be,e5d7a3&mouth=variant01,variant02,variant03,variant04,variant05,variant06,variant07,variant08,variant09,variant10,variant11,variant12,variant16,variant17,variant18,variant19,variant20,variant21,variant22,variant23,variant24,variant25,variant26,variant27,variant28,variant29,variant30&skinColor=9e5622,ecad80,f2d3b1",
  "https://api.dicebear.com/9.x/adventurer/svg?seed=Alexander&hairColor=0e0e0e,562306,592454,6a4e35,796a45,85c2c6,ab2a18,ac6511,afafaf,b9a05f,cb6820,dba3be,e5d7a3&mouth=variant01,variant02,variant03,variant04,variant05,variant06,variant07,variant08,variant09,variant10,variant11,variant12,variant16,variant17,variant18,variant19,variant20,variant21,variant22,variant23,variant24,variant25,variant26,variant27,variant28,variant29,variant30&skinColor=9e5622,ecad80,f2d3b1",
  "https://api.dicebear.com/9.x/adventurer/svg?seed=Kimberly&hairColor=0e0e0e,562306,592454,6a4e35,796a45,85c2c6,ab2a18,ac6511,afafaf,b9a05f,cb6820,dba3be,e5d7a3&mouth=variant01,variant02,variant03,variant04,variant05,variant06,variant07,variant08,variant09,variant10,variant11,variant12,variant16,variant17,variant18,variant19,variant20,variant21,variant22,variant23,variant24,variant25,variant26,variant27,variant28,variant29,variant30&skinColor=9e5622,ecad80,f2d3b1",
  "https://api.dicebear.com/9.x/adventurer/svg?seed=Aiden&hairColor=0e0e0e,562306,592454,6a4e35,796a45,85c2c6,ab2a18,ac6511,afafaf,b9a05f,cb6820,dba3be,e5d7a3&mouth=variant01,variant02,variant03,variant04,variant05,variant06,variant07,variant08,variant09,variant10,variant11,variant12,variant16,variant17,variant18,variant19,variant20,variant21,variant22,variant23,variant24,variant25,variant26,variant27,variant28,variant29,variant30&skinColor=9e5622,ecad80,f2d3b1",
  "https://api.dicebear.com/9.x/adventurer/svg?seed=Mackenzie&hairColor=0e0e0e,562306,592454,6a4e35,796a45,85c2c6,ab2a18,ac6511,afafaf,b9a05f,cb6820,dba3be,e5d7a3&mouth=variant01,variant02,variant03,variant04,variant05,variant06,variant07,variant08,variant09,variant10,variant11,variant12,variant16,variant17,variant18,variant19,variant20,variant21,variant22,variant23,variant24,variant25,variant26,variant27,variant28,variant29,variant30&skinColor=9e5622,ecad80,f2d3b1",
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
    content:
      "Today was challenging, but I managed to find moments of calm through meditation and deep breathing exercises. The 10-minute guided session really helped clear my mind.",
    tags: ["meditation", "calm", "reflection"],
  },
  {
    id: 2,
    date: "2023-04-17",
    title: "Academic Pressure",
    content:
      "Feeling overwhelmed by upcoming exams. Need to create a better study schedule and remember to take breaks. The burnout is real, but I'm learning to pace myself better.",
    tags: ["stress", "academics", "planning"],
  },
  {
    id: 3,
    date: "2023-04-15",
    title: "Social Connection",
    content:
      "Spent time with friends today. It's amazing how much social connection can boost my mood. We went for coffee and just talked about life. These moments matter so much.",
    tags: ["friends", "connection", "gratitude"],
  },
];

const COLORS = ["#7CAE9E", "#E69EA2", "#FEC0B3", "#CFECE0"];
const MOOD_EMOJIS = ["😔", "😟", "😐", "🙂", "😊"];

export default function UserProfile() {
  const [selectedTab, setSelectedTab] = useState("overview");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [selectedAvatar, setSelectedAvatar] = useState(avatarOptions[0]);
  const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: "Alex Chen",
    email: "alex.chen@example.com",
    bio: "Psychology student passionate about mental wellness and mindfulness practices.",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editableProfile, setEditableProfile] = useState({ ...userProfile });
  const [moodHistory, setMoodHistory] = useState(moodData);
  const [journalData, setJournalData] = useState(journalEntries);
  const [newJournal, setNewJournal] = useState({
    title: "",
    content: "",
    tags: "",
  });
  const [isAddingJournal, setIsAddingJournal] = useState(false);

  const { toast } = useToast();

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
    setIsAvatarDialogOpen(false);
    toast({
      title: "Avatar updated",
      description: "Your profile avatar has been updated.",
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="mb-8 relative"
          >
            <div className="absolute -top-2 -left-2 h-16 w-16 border-t-4 border-l-4 border-zenPink/30 rounded-tl-xl" />
            <div className="absolute -bottom-2 -right-2 h-16 w-16 border-b-4 border-r-4 border-zenSage/30 rounded-br-xl" />

            <Card className="border-0 overflow-hidden relative bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2IiBoZWlnaHQ9IjYiPgo8cmVjdCB3aWR0aD0iNiIgaGVpZ2h0PSI2IiBmaWxsPSIjZmZmZmZmIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDBMNiA2IiBzdHJva2U9IiNlNjllYTIiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiPjwvcGF0aD4KPHBhdGggZD0iTTYgMEwwIDYiIHN0cm9rZT0iIzdjYWU5ZSIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuMSI+PC9wYXRoPgo8L3N2Zz4=')] dark:opacity-10" />

              <div className="relative z-10 px-8 pb-8 pt-10">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                  <motion.div
                    className="relative"
                    whileHover={{ y: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="relative p-1 rounded-full bg-white dark:bg-gray-700 shadow-md">
                      <div className="absolute -top-2 -left-2 h-4 w-4 rounded-full bg-zenSage/40" />
                      <div className="absolute -top-2 -right-2 h-4 w-4 rounded-full bg-zenPink/40" />
                      <div className="absolute -bottom-2 -left-2 h-4 w-4 rounded-full bg-zenPink/40" />
                      <div className="absolute -bottom-2 -right-2 h-4 w-4 rounded-full bg-zenSage/40" />

                      <Avatar className="relative h-32 w-32 md:h-36 md:w-36 border-[3px] border-white dark:border-gray-800 z-10">
                        <AvatarImage src={selectedAvatar} alt="User avatar" />
                        <AvatarFallback className="bg-gray-100 dark:bg-gray-700">
                          <UserIcon className="h-16 w-16 text-zenPink dark:text-zenSage" />
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.95 }}
                      className="absolute -bottom-3 -right-3"
                    >
                      <Button
                        size="icon"
                        className="bg-zenPink hover:bg-zenPink/90 dark:bg-zenSage dark:hover:bg-zenSage/90 rounded-full h-11 w-11 shadow-lg border-2 border-white dark:border-gray-800 transition-all"
                        onClick={() => setIsAvatarDialogOpen(true)}
                      >
                        <Edit2 className="h-5 w-5 text-white" />
                      </Button>
                    </motion.div>
                  </motion.div>

                  <div className="flex-grow text-center md:text-left mt-4 md:mt-0 space-y-3 relative">
                    <div className="absolute top-0 left-0 h-4 w-4 rounded-full bg-zenSage/20" />
                    <div className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-zenPink/20" />

                    <motion.h1
                      className="text-4xl font-bold text-gray-800 dark:text-white relative pb-2"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      {userProfile.name}
                      <span className="absolute bottom-0 left-0 h-1 w-20 bg-zenSage rounded-full" />
                      <span className="absolute bottom-0 left-20 h-1 w-full bg-zenPink/20 rounded-full" />
                    </motion.h1>

                    <motion.div
                      className="flex items-center justify-center md:justify-start space-x-2 mt-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <div className="p-1.5 rounded-lg bg-zenSage/10 border border-zenSage/20">
                        <Mail className="h-5 w-5 text-zenPink dark:text-zenSage" />
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 font-medium">
                        {userProfile.email}
                      </p>
                    </motion.div>

                    <motion.p
                      className="text-gray-600 dark:text-gray-400 mt-4 max-w-2xl text-pretty text-lg leading-relaxed relative pl-5 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-zenSage/30 before:rounded-full"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      {userProfile.bio}
                    </motion.p>
                  </div>

                  <motion.div
                    className="md:ml-auto mt-6 md:mt-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Button
                      onClick={() => setIsEditing(true)}
                      className="relative bg-zenPink hover:bg-zenPink/90 dark:bg-zenSage dark:hover:bg-zenSage/90 text-white px-6 py-3 rounded-lg shadow-md transition-all border border-zenPink/30 dark:border-zenSage/30"
                    >
                      <span className="flex items-center">
                        <Edit2 className="h-5 w-5 mr-2" />
                        <span className="font-semibold">Edit Profile</span>
                      </span>
                    </Button>
                  </motion.div>
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 h-1.5 flex">
                <span className="h-full w-1/3 bg-zenPink/50" />
                <span className="h-full w-1/3 bg-zenSage/50" />
                <span className="h-full w-1/3 bg-zenPink/50" />
              </div>
            </Card>
          </motion.div>

          <Dialog
            open={isAvatarDialogOpen}
            onOpenChange={setIsAvatarDialogOpen}
          >
            <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto p-0 bg-white dark:bg-gray-800">
              <DialogHeader className="px-8 pt-8 pb-6 relative">
                <div className="absolute top-4 left-4 h-3 w-3 border-t-2 border-l-2 border-zenPink/40 rounded-tl-md" />
                <div className="absolute bottom-4 right-4 h-3 w-3 border-b-2 border-r-2 border-zenSage/40 rounded-br-md" />

                <div className="flex flex-col items-center space-y-2 relative">
                  <motion.div
                    className="relative"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                  >
                    <h2 className="text-3xl font-bold text-center">
                      <span className="bg-clip-text text-transparent bg-gradient-to-r from-zenPink to-zenSage dark:from-zenPink/90 dark:to-zenSage/90">
                        Choose Your Avatar
                      </span>
                      <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-zenPink/40 via-zenSage/40 to-zenPink/40 rounded-full" />
                    </h2>
                  </motion.div>

                  <motion.div
                    className="flex items-center space-x-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="h-1 w-4 rounded-full bg-zenPink/40" />
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium flex items-center">
                      <UserIcon className="h-4 w-4 mr-1 text-zenPink dark:text-zenSage" />
                      Select an image that represents you
                    </p>
                    <div className="h-1 w-4 rounded-full bg-zenSage/40" />
                  </motion.div>
                </div>

                <div className="absolute bottom-2 left-1/4 h-2 w-2 rounded-full bg-zenPink/20" />
                <div className="absolute bottom-2 right-1/4 h-2 w-2 rounded-full bg-zenSage/20" />
              </DialogHeader>

              <div className="px-8 pb-8">
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-6">
                  {avatarOptions.map((avatar, index) => (
                    <motion.div
                      key={index}
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{
                        delay: index * 0.03,
                        type: "spring",
                        stiffness: 400,
                      }}
                      className={`flex flex-col items-center cursor-pointer ${
                        selectedAvatar === avatar
                          ? "ring-2 ring-zenSage dark:ring-zenMint"
                          : ""
                      }`}
                      onClick={() => handleAvatarChange(avatar)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Avatar className="h-24 w-24 md:h-28 md:w-28 dark:border-gray-700">
                        <AvatarImage
                          src={avatar.replace(/\/svg\?/, "/png?")}
                          alt={`Avatar ${index + 1}`}
                          className="object-cover"
                        />
                      </Avatar>
                      <span
                        className={`mt-2 text-sm ${
                          selectedAvatar === avatar
                            ? "text-zenSage dark:text-zenMint font-medium"
                            : "text-gray-500 dark:text-gray-400"
                        }`}
                      >
                        {selectedAvatar === avatar ? "Selected" : ""}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="px-8 py-6 border-t border-gray-200 dark:border-gray-700 flex justify-end bg-gray-50 dark:bg-gray-700/30 rounded-b-lg">
                <Button
                  variant="outline"
                  className="mr-3 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => setIsAvatarDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-zenSage hover:bg-zenSage/90 dark:bg-zenMint dark:hover:bg-zenMint/90 text-white"
                  onClick={() => setIsAvatarDialogOpen(false)}
                >
                  Confirm Selection
                </Button>
              </div>
            </DialogContent>
          </Dialog>

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
                      onChange={(e) =>
                        setEditableProfile({
                          ...editableProfile,
                          name: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={editableProfile.email}
                      onChange={(e) =>
                        setEditableProfile({
                          ...editableProfile,
                          email: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={editableProfile.bio}
                      onChange={(e) =>
                        setEditableProfile({
                          ...editableProfile,
                          bio: e.target.value,
                        })
                      }
                      className="h-24"
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button
                    className="bg-zenSage hover:bg-zenSage/90"
                    onClick={handleSaveProfile}
                  >
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
                <TabsTrigger value="overview" className="flex-1">
                  Overview
                </TabsTrigger>
                <TabsTrigger value="mood-tracker" className="flex-1">
                  Mood Tracker
                </TabsTrigger>
                <TabsTrigger value="journal" className="flex-1">
                  Journal
                </TabsTrigger>
                <TabsTrigger value="progress" className="flex-1">
                  Progress
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <Overview
                  moodHistory={moodHistory}
                  activityData={activityData}
                  journalData={journalData}
                />
              </TabsContent>
              <TabsContent value="mood-tracker">
                <MoodTracker
                  moodHistory={moodHistory}
                  setMoodHistory={setMoodHistory}
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}
                  selectedMood={selectedMood}
                  setSelectedMood={setSelectedMood}
                />
              </TabsContent>
              <TabsContent value="journal">
                <Journal
                  journalData={journalData}
                  setJournalData={setJournalData}
                  newJournal={newJournal}
                  setNewJournal={setNewJournal}
                  isAddingJournal={isAddingJournal}
                  setIsAddingJournal={setIsAddingJournal}
                />
              </TabsContent>
              <TabsContent value="progress">
                <Progress journalData={journalData} />
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </Layout>
  );
}




