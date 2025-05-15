import { useState, useEffect } from "react";
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
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Overview from "@/components/profile/Overview";
import MoodTracker from "@/components/profile/MoodTracker";
import Journal from "@/components/profile/Journal";
import Progress from "@/components/profile/Progress";
import { jwtDecode } from "jwt-decode";

const API_BASE_URL = "https://localhost:7223";

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

interface UserProfile {
  fullName: string;
  username: string;
  age: number;
  gender: string | null;
  email: string;
  avatar: string | null;
}

interface JwtPayload {
  sub?: string;
  Username?: string;
  name?: string;
  email?: string;
  Avatar?: string;
  Gender?: string;
  Age?: number;
}

export default function UserProfile() {
  const [selectedTab, setSelectedTab] = useState("overview");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [editProfile, setEditProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [moodHistory, setMoodHistory] = useState(moodData);
  const [journalData, setJournalData] = useState(journalEntries);
  const [newJournal, setNewJournal] = useState({
    title: "",
    content: "",
    tags: "",
  });
  const [isAddingJournal, setIsAddingJournal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const { toast } = useToast();

  const fetchUserData = async (token: string, username: string): Promise<UserProfile> => {
    try {
      const apiUrl = `${API_BASE_URL}/api/account/${encodeURIComponent(username)}`;
      const response = await fetch(apiUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error(response.status === 401 ? "Unauthorized" : "User not found");
      }

      const userData: UserProfile = await response.json();
      
      const updatedProfile = {
        fullName: userData.fullName || "Unknown",
        username: userData.username || username,
        age: userData.age || 0,
        gender: userData.gender || null,
        email: userData.email || "Unknown",
        avatar: userData.avatar || null,
      };
      
      setUserProfile(updatedProfile);
      setEditProfile(updatedProfile);
      setSelectedAvatar(userData.avatar);
      setError(null);
      return updatedProfile;
    } catch (err: any) {
      console.error("Fetch User Data Error:", err.message);
      
      try {
        const decoded: JwtPayload = jwtDecode(token);
        const fallbackProfile = {
          fullName: decoded.name || "Unknown",
          username: decoded.sub || decoded.Username || username || "Unknown",
          age: decoded.Age || 0,
          gender: decoded.Gender || null,
          email: decoded.email || "Unknown",
          avatar: decoded.Avatar || null,
        };
        
        setUserProfile(fallbackProfile);
        setEditProfile(fallbackProfile);
        setSelectedAvatar(decoded.Avatar);
        setError("Could not fetch full profile data");
        return fallbackProfile;
      } catch (decodeErr) {
        console.error("JWT Decode Error:", decodeErr);
        setError(err.message || "Failed to load user data");
        throw err;
      }
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No authentication token found");
      toast({
        title: "Authentication Error",
        description: "Please log in to view your profile",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      const decoded: JwtPayload = jwtDecode(token);
      const username = decoded.sub || decoded.Username;
      
      if (!username) {
        throw new Error("Username not found in token");
      }

      setIsLoading(true);
      fetchUserData(token, username)
        .catch(err => {
          console.error("Initial fetch error:", err);
          setError(err.message);
        })
        .finally(() => setIsLoading(false));
        
    } catch (decodeErr) {
      console.error("JWT Decode Error:", decodeErr);
      setError("Invalid token format");
      toast({
        title: "Error",
        description: "Invalid authentication token",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  }, []);

  const handleAvatarChange = async (avatar: string) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast({
        title: "Error",
        description: "Authentication token missing",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/account/update-avatar`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(avatar),
      });

      if (!response.ok) {
        throw new Error("Failed to update avatar");
      }

      const data = await response.json();
      
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      const username = data.username || userProfile?.username;
      if (username) {
        await fetchUserData(data.token || token, username);
      }

      setIsAvatarDialogOpen(false);
      toast({
        title: "Avatar updated",
        description: "Your profile avatar has been updated.",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update avatar",
        variant: "destructive",
      });
    }
  };

  const handleProfileUpdate = async () => {
    if (!editProfile) return;

    const token = localStorage.getItem("token");
    if (!token) {
      toast({
        title: "Error",
        description: "Authentication token missing",
        variant: "destructive",
      });
      return;
    }

    if (!editProfile.username.trim()) {
      toast({
        title: "Error",
        description: "Username cannot be empty",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/account/update-profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fullName: editProfile.fullName,
          username: editProfile.username,
          age: editProfile.age,
          gender: editProfile.gender,
        }),
      });

      if (!response.ok) {
        throw new Error(await response.text() || "Failed to update profile");
      }

      const data = await response.json();
      
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      await fetchUserData(data.token || token, editProfile.username);
      
      setIsEditing(false);
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });

    } catch (err: any) {
      console.error("Profile update error:", err);
      toast({
        title: "Error",
        description: err.message || "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (field: keyof UserProfile, value: string | number) => {
    if (!editProfile) return;
    setEditProfile({ ...editProfile, [field]: value });
  };

  const retryFetch = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No authentication token found");
      toast({
        title: "Authentication Error",
        description: "Please log in again",
        variant: "destructive",
      });
      return;
    }

    try {
      const decoded: JwtPayload = jwtDecode(token);
      const username = decoded.sub || decoded.Username;
      
      if (!username) {
        throw new Error("Username not found in token");
      }

      setIsLoading(true);
      await fetchUserData(token, username);
    } catch (err: any) {
      console.error("Retry fetch error:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-zenSage" />
          <h1 className="text-2xl font-semibold">Loading Profile...</h1>
          <p className="text-gray-500">Please wait while we load your data</p>
        </div>
      </Layout>
    );
  }

  if (error || !userProfile) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
          <h1 className="text-2xl font-semibold text-red-600">Error</h1>
          <p className="text-gray-500">{error || "Failed to load profile"}</p>
          <Button
            onClick={retryFetch}
            className="bg-zenSage hover:bg-zenSage/90 text-white"
          >
            Retry
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8 relative"
          >
            <Card className="border-0 overflow-hidden relative bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className="relative z-10 px-8 pb-8 pt-10">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                  <motion.div className="relative" whileHover={{ y: -5 }}>
                    <div className="relative p-1 rounded-full bg-white dark:bg-gray-700 shadow-md">
                      <Avatar className="relative h-32 w-32 md:h-36 md:w-36 border-[3px] border-white dark:border-gray-800 z-10">
                        <AvatarImage src={selectedAvatar || undefined} />
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
                    <motion.h1
                      className="text-4xl font-bold text-gray-800 dark:text-white relative pb-2"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      {userProfile.username}
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
            </Card>
          </motion.div>

          <Dialog open={isAvatarDialogOpen} onOpenChange={setIsAvatarDialogOpen}>
            <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto p-0 bg-white dark:bg-gray-800">
              <DialogHeader className="px-8 pt-8 pb-6">
                <h2 className="text-3xl font-bold text-center">
                  Choose Your Avatar
                </h2>
              </DialogHeader>
              <div className="px-8 pb-8">
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-6">
                  {avatarOptions.map((avatar, index) => (
                    <motion.div
                      key={index}
                      className={`flex flex-col items-center cursor-pointer ${
                        selectedAvatar === avatar ? "ring-2 ring-zenSage dark:ring-zenMint" : ""
                      }`}
                      onClick={() => handleAvatarChange(avatar)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Avatar className="h-24 w-24 md:h-28 md:w-28 dark:border-gray-700">
                        <AvatarImage src={avatar.replace(/\/svg\?/, "/png?")} />
                      </Avatar>
                    </motion.div>
                  ))}
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {isEditing ? (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <Card>
                <CardHeader>
                  <CardTitle>Edit Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      value={editProfile?.fullName || ""}
                      onChange={(e) => handleInputChange("fullName", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={editProfile?.username || ""}
                      onChange={(e) => handleInputChange("username", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      value={editProfile?.age || 0}
                      onChange={(e) => handleInputChange("age", parseInt(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="gender">Gender</Label>
                    <Select
                      value={editProfile?.gender || ""}
                      onValueChange={(value) => handleInputChange("gender", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleProfileUpdate}
                    disabled={isSaving}
                    className="bg-zenSage hover:bg-zenSage/90 text-white"
                  >
                    {isSaving && <Loader2 className="h-5 w-5 animate-spin mr-2" />}
                    Save Changes
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ) : (
            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
              <TabsList className="bg-gray-100 p-1 w-full flex justify-center">
                <TabsTrigger value="overview" className="flex-1">Overview</TabsTrigger>
                <TabsTrigger value="mood-tracker" className="flex-1">Mood Tracker</TabsTrigger>
                <TabsTrigger value="journal" className="flex-1">Journal</TabsTrigger>
                <TabsTrigger value="progress" className="flex-1">Progress</TabsTrigger>
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