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
  ChevronRight,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
];


const mentalHealthQuotes = [
  "You don’t have to be positive all the time. It’s okay to feel sad, angry, or scared. – Unknown",
  "Healing takes time, and asking for help is a courageous step. – Mariska Hargitay",
  "Your mental health is a priority. Your happiness is essential. – Unknown",
  "You are enough just as you are. – Meghan Markle",
  "It’s okay to not be okay, as long as you don’t give up. – Unknown",
  "Self-care is how you take your power back. – Lalah Delia",
  "You don’t have to control your thoughts. You just have to stop letting them control you. – Dan Millman",
  "There is hope, even when your brain tells you there isn’t. – John Green",
  "Be gentle with yourself. You’re doing the best you can. – Unknown",
  "Your feelings are valid, and you deserve to be heard. – Unknown",
];

const activityData = [
  { name: "Meditation", value: 35 },
  { name: "Yoga", value: 20 },
  { name: "Journaling", value: 15 },
  { name: "Reading", value: 30 },
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
  const [journalData, setJournalData] = useState();
  const [newJournal, setNewJournal] = useState({
    title: "",
    content: "",
    tags: "",
  });
  const [isAddingJournal, setIsAddingJournal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [currentQuote, setCurrentQuote] = useState(mentalHealthQuotes[0]);

  const { toast } = useToast();

  // Change quote every 10 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * mentalHealthQuotes.length);
      setCurrentQuote(mentalHealthQuotes[randomIndex]);
    }, 600000); // 10 minutes in milliseconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

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
          {/* Enhanced Profile Card with Modern Design */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8 relative"
          >
            {/* Decorative top border */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-zenPink/70 to-transparent dark:via-zenSage/70"></div>
            
            <Card className="border-0 overflow-hidden relative bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 group">
              {/* Decorative corner elements */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-zenPink dark:border-zenSage"></div>
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-zenPink dark:border-zenSage"></div>
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-zenPink dark:border-zenSage"></div>
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-zenPink dark:border-zenSage"></div>
              
              <div className="relative z-10 px-8 pb-8 pt-10">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                  {/* Avatar Section */}
                  <motion.div 
                    className="relative group"
                    whileHover={{ y: -5 }}
                  >
                    <div className="relative p-1 rounded-full bg-gradient-to-br from-zenPink/20 to-zenSage/20 dark:from-zenPink/10 dark:to-zenSage/10 shadow-md">
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
                        className="bg-zenPink hover:bg-zenPink/90 dark:bg-zenSage dark:hover:bg-zenSage/90 rounded-full h-11 w-11 shadow-lg border-2 border-white dark:border-gray-800 transition-all group-hover:shadow-zenPink/30 dark:group-hover:shadow-zenSage/30"
                        onClick={() => setIsAvatarDialogOpen(true)}
                      >
                        <Edit2 className="h-5 w-5 text-white" />
                      </Button>
                    </motion.div>
                  </motion.div>

                  {/* Profile Info Section */}
                  <div className="flex-grow text-center md:text-left mt-4 md:mt-0 space-y-3 relative">
                    <motion.h1
                      className="text-4xl font-bold text-gray-800 dark:text-white relative pb-2"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      {userProfile.username}
                      <span className="absolute bottom-0 left-0 w-16 h-1 bg-zenPink dark:bg-zenSage"></span>
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
                    
                    {/* User's Age */}
                    <motion.div
                      className="flex items-center justify-center md:justify-start space-x-2 mt-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <div className="p-1.5 rounded-lg bg-zenSage/10 border border-zenSage/20">
                        <UserIcon className="h-5 w-5 text-zenPink dark:text-zenSage" />
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 font-medium">
                        Age: {userProfile.age || "Not specified"}
                      </p>
                    </motion.div>
                    
                    {/* Mental Health Quote */}
                    <motion.div
                      className="mt-4 italic text-gray-500 dark:text-gray-400 text-sm max-w-md mx-auto md:mx-0"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      aria-label={`Mental health quote: ${currentQuote}`}
                    >
                      "{currentQuote}"
                    </motion.div>
                  </div>

                  {/* Edit Button Section */}
                  <motion.div
                    className="md:ml-auto mt-6 md:mt-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Button
                      onClick={() => setIsEditing(true)}
                      className="relative bg-zenPink hover:bg-zenPink/90 dark:bg-zenSage dark:hover:bg-zenSage/90 text-white px-6 py-3 rounded-lg shadow-md transition-all border border-zenPink/30 dark:border-zenSage/30 group"
                    >
                      <span className="flex items-center">
                        <Edit2 className="h-5 w-5 mr-2 transition-transform group-hover:rotate-12" />
                        <span className="font-semibold">Edit Profile</span>
                        <ChevronRight className="h-4 w-4 ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                      </span>
                    </Button>
                  </motion.div>
                </div>
              </div>
              
              {/* Decorative bottom border */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-zenPink/70 to-transparent dark:via-zenSage/70"></div>
            </Card>
          </motion.div>

          {/* Avatar Selection Dialog */}
          <Dialog open={isAvatarDialogOpen} onOpenChange={setIsAvatarDialogOpen}>
            <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto p-0 bg-white dark:bg-gray-800 rounded-lg">
              <DialogHeader className="px-8 pt-8 pb-6">
                <DialogTitle className="text-3xl font-bold text-center bg-gradient-to-r from-zenPink to-zenSage bg-clip-text text-transparent">
                  Choose Your Avatar
                </DialogTitle>
              </DialogHeader>
              <div className="px-8 pb-8">
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-6">
                  {avatarOptions.map((avatar, index) => (
                    <motion.div
                      key={index}
                      className={`flex flex-col items-center cursor-pointer p-2 rounded-lg transition-all ${
                        selectedAvatar === avatar 
                          ? "bg-zenPink/10 dark:bg-zenSage/10 ring-2 ring-zenPink dark:ring-zenSage" 
                          : "hover:bg-gray-100 dark:hover:bg-gray-700"
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

          {/* Edit Profile Modal */}
          {isEditing && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <Card className="border-0 bg-white dark:bg-gray-800 shadow-lg relative">
                {/* Decorative elements */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-zenPink dark:border-zenSage"></div>
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-zenPink dark:border-zenSage"></div>
                
                <CardHeader>
                  <CardTitle className="text-2xl font-bold bg-gradient-to-r from-zenPink to-zenSage bg-clip-text text-transparent">
                    Edit Your Profile
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="fullName" className="text-gray-700 dark:text-gray-300">
                        Full Name
                      </Label>
                      <Input
                        id="fullName"
                        value={editProfile?.fullName || ""}
                        onChange={(e) => handleInputChange("fullName", e.target.value)}
                        className="mt-2 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-zenPink dark:focus:ring-zenSage"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="username" className="text-gray-700 dark:text-gray-300">
                        Username
                      </Label>
                      <Input
                        id="username"
                        value={editProfile?.username || ""}
                        onChange={(e) => handleInputChange("username", e.target.value)}
                        className="mt-2 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-zenPink dark:focus:ring-zenSage"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="age" className="text-gray-700 dark:text-gray-300">
                        Age
                      </Label>
                      <Input
                        id="age"
                        type="number"
                        value={editProfile?.age || 0}
                        onChange={(e) => handleInputChange("age", parseInt(e.target.value) || 0)}
                        className="mt-2 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-zenPink dark:focus:ring-zenSage"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="gender" className="text-gray-700 dark:text-gray-300">
                        Gender
                      </Label>
                      <Select
                        value={editProfile?.gender || ""}
                        onValueChange={(value) => handleInputChange("gender", value)}
                      >
                        <SelectTrigger className="mt-2 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-zenPink dark:focus:ring-zenSage">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="flex justify-end space-x-4 pt-6">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsEditing(false)}
                    className="border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleProfileUpdate}
                    disabled={isSaving}
                    className="bg-zenPink hover:bg-zenPink/90 dark:bg-zenSage dark:hover:bg-zenSage/90 text-white px-6 py-3 rounded-lg transition-all"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                        Saving...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          )}

          {/* Profile Tabs */}
          {!isEditing && (
            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
              <TabsList className="bg-gray-100 dark:bg-gray-700 p-1 w-full flex justify-center rounded-lg">
                <TabsTrigger 
                  value="overview" 
                  className="flex-1 py-2 px-4 rounded-md data-[state=active]:bg-zenPink data-[state=active]:text-white dark:data-[state=active]:bg-zenSage"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger 
                  value="mood-tracker" 
                  className="flex-1 py-2 px-4 rounded-md data-[state=active]:bg-zenPink data-[state=active]:text-white dark:data-[state=active]:bg-zenSage"
                >
                  Mood Tracker
                </TabsTrigger>
                <TabsTrigger 
                  value="journal" 
                  className="flex-1 py-2 px-4 rounded-md data-[state=active]:bg-zenPink data-[state=active]:text-white dark:data-[state=active]:bg-zenSage"
                >
                  Journal
                </TabsTrigger>
                <TabsTrigger 
                  value="progress" 
                  className="flex-1 py-2 px-4 rounded-md data-[state=active]:bg-zenPink data-[state=active]:text-white dark:data-[state=active]:bg-zenSage"
                >
                  Progress
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <Overview
                  journalData={journalData}
                />
              </TabsContent>
              <TabsContent value="mood-tracker">
                <MoodTracker
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}
                  selectedMood={selectedMood}
                  setSelectedMood={setSelectedMood}
                />
              </TabsContent>
              <TabsContent value="journal">
                <Journal
                  journalData={journalData}
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