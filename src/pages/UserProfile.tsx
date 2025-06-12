import { useState, useEffect, FC, ReactNode } from "react";
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
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Edit2,
  Mail,
  User as UserIcon,
  Loader2,
  ChevronRight,
  Trash2,
  Settings,
  MoreVertical,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

const mentalHealthQuotes = [
  "You don't have to be positive all the time. It's okay to feel sad, angry, or scared. – Unknown",
  "Healing takes time, and asking for help is a courageous step. – Mariska Hargitay",
  "Your mental health is a priority. Your happiness is essential. – Unknown",
  "You are enough just as you are. – Meghan Markle",
  "It's okay to not be okay, as long as you don't give up. – Unknown",
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

interface LayoutProps {
  children: ReactNode;
}

const TypedLayout = Layout as FC<LayoutProps>;

export default function UserProfile() {
  const [selectedTab, setSelectedTab] = useState("overview");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [editProfile, setEditProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [journalData, setJournalData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [currentQuote, setCurrentQuote] = useState(mentalHealthQuotes[0]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * mentalHealthQuotes.length);
      setCurrentQuote(mentalHealthQuotes[randomIndex]);
    }, 600000);
    return () => clearInterval(interval);
  }, []);

  const fetchUserData = async (
    token: string,
    username: string
  ): Promise<UserProfile> => {
    try {
      const apiUrl = `${API_BASE_URL}/api/account/${encodeURIComponent(
        username
      )}`;
      const response = await fetch(apiUrl, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error(
          response.status === 401 ? "Unauthorized" : "User not found"
        );
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

      console.log("Fetched profile with gender:", updatedProfile.gender);
      setUserProfile(updatedProfile);
      setEditProfile(updatedProfile);
      setSelectedAvatar(userData.avatar);
      setError(null);
      return updatedProfile;
    } catch (err: any) {
      console.error("Fetch User Data Error:", err.message);

      try {
        const decoded: JwtPayload = jwtDecode(token);
        const normalizedGender =
          decoded.Gender === "M"
            ? "Male"
            : decoded.Gender === "F"
            ? "Female"
            : decoded.Gender || null;
        const fallbackProfile = {
          fullName: decoded.name || "Unknown",
          username: decoded.sub || decoded.Username || username || "Unknown",
          age: decoded.Age || 0,
          gender: normalizedGender,
          email: decoded.email || "Unknown",
          avatar: decoded.Avatar || null,
        };

        console.log("Fallback profile with gender:", fallbackProfile.gender);
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
        .catch((err) => {
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
      const response = await fetch(
        `${API_BASE_URL}/api/account/update-avatar`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(avatar),
        }
      );

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
      const response = await fetch(
        `${API_BASE_URL}/api/account/update-profile`,
        {
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
        }
      );

      if (!response.ok) {
        throw new Error((await response.text()) || "Failed to update profile");
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

  const handleAccountDeletion = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/account/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error((await response.text()) || "Failed to delete account");
      }

      localStorage.clear();
      window.location.href = "/";
      toast({
        title: "Account Deleted",
        description: "Your account has been permanently deleted.",
      });
    } catch (err: any) {
      console.error("Account deletion error:", err);
      toast({
        title: "Error",
        description: err.message || "Failed to delete account",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleInputChange = (
    field: keyof UserProfile,
    value: string | number
  ) => {
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
      <TypedLayout>
        <div className="flex flex-col items-center justify-center min-h-screen gap-4">
          <Loader2 className="w-12 h-12 animate-spin text-zenSage" />
          <h1 className="text-2xl font-semibold">Loading Profile...</h1>
          <p className="text-gray-500">Please wait while we load your data</p>
        </div>
      </TypedLayout>
    );
  }

  if (error || !userProfile) {
    return (
      <TypedLayout>
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
      </TypedLayout>
    );
  }

  return (
    <TypedLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8 relative"
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-zenPink/70 to-transparent dark:via-zenSage/70"></div>

            <Card className="border-0 overflow-hidden relative bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-zenPink dark:border-zenSage"></div>
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-zenPink dark:border-zenSage"></div>
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-zenPink dark:border-zenSage"></div>
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-zenPink dark:border-zenSage"></div>

              <div className="relative z-10 px-8 pb-8 pt-10">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                  <motion.div className="relative group" whileHover={{ y: -5 }}>
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

                  <div className="flex-grow text-center md:text-left mt-4 md:mt-0 space-y-3 relative">
                    <div className="flex justify-between items-start">
                      <motion.h1
                        className="text-4xl font-bold text-gray-800 dark:text-white relative pb-2"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        {userProfile.username}
                        <span className="absolute bottom-0 left-0 w-16 h-1 bg-zenPink dark:bg-zenSage"></span>
                      </motion.h1>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="rounded-full">
                            <MoreVertical className="h-5 w-5 text-gray-500 hover:text-zenPink dark:hover:text-zenSage" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                          <DropdownMenuItem
                            onClick={() => setIsEditing(true)}
                            className="cursor-pointer focus:bg-gray-100 dark:focus:bg-gray-700"
                          >
                            <Edit2 className="mr-2 h-4 w-4" />
                            <span>Edit Profile</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setIsDeleteDialogOpen(true)}
                            className="cursor-pointer text-red-600 focus:bg-red-50 dark:focus:bg-red-900/20"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Delete Account</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

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
                </div>
              </div>

              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-zenPink/70 to-transparent dark:via-zenSage/70"></div>
            </Card>
          </motion.div>

          <Dialog
            open={isAvatarDialogOpen}
            onOpenChange={setIsAvatarDialogOpen}
          >
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

          <Dialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
            <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-800">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-red-600 dark:text-red-400">
                  Confirm Account Deletion
                </DialogTitle>
                <DialogDescription className="text-gray-600 dark:text-gray-400">
                  This action cannot be undone. All your data will be permanently removed.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                  <p className="text-red-600 dark:text-red-400 font-medium">
                    Warning: This will immediately delete your account and all associated data.
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Input
                    type="text"
                    placeholder="Type 'DELETE' to confirm"
                    className="border-red-300 dark:border-red-700 focus:ring-red-500 dark:focus:ring-red-400"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsDeleteDialogOpen(false)}
                  className="border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAccountDeletion}
                  disabled={isDeleting}
                  className="bg-red-600 hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600 text-white"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Deleting...
                    </>
                  ) : (
                    "Delete Account"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {isEditing && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <Card className="border-0 bg-white dark:bg-gray-800 shadow-lg relative">
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
                      <Label
                        htmlFor="fullName"
                        className="text-gray-700 dark:text-gray-300"
                      >
                        Full Name
                      </Label>
                      <Input
                        id="fullName"
                        value={editProfile?.fullName || ""}
                        onChange={(e) =>
                          handleInputChange("fullName", e.target.value)
                        }
                        className="mt-2 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-zenPink dark:focus:ring-zenSage"
                      />
                    </div>

                    <div>
                      <Label
                        htmlFor="username"
                        className="text-gray-700 dark:text-gray-300"
                      >
                        Username
                      </Label>
                      <Input
                        id="username"
                        type="text"
                        value={editProfile?.username || ""}
                        onChange={(e) => handleInputChange("username", e.target.value)}
                        className="mt-2 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-zenPink dark:focus:ring-zenSage"
                      />
                    </div>

                    <div>
                      <Label
                        htmlFor="age"
                        className="text-gray-700 dark:text-gray-300"
                      >
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
                      <Label
                        htmlFor="gender"
                        className="text-gray-700 dark:text-gray-300"
                      >
                        Gender
                      </Label>
                      <Select
                        value={editProfile?.gender || undefined}
                        onValueChange={(value) => handleInputChange("gender", value)}
                      >
                        <SelectTrigger className="mt-2 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-zenPink dark:focus:ring-zenSage">
                          <SelectValue placeholder={editProfile?.gender || "Select gender"} />
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

          {!isEditing && (
            <Tabs
              value={selectedTab}
              onValueChange={setSelectedTab}
              className="space-y-6"
            >
              <TabsList className="bg-white dark:bg-gray-800 p-2 rounded-lg flex justify-center">
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
                <Overview journalData={journalData} />
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
                  setJournalData={setJournalData}
                />
              </TabsContent>
              <TabsContent value="progress">
                <Progress journalData={journalData} />
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </TypedLayout>
  );
}