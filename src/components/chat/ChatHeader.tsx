
import { motion } from "framer-motion";
import { Users } from "lucide-react";

interface ChatHeaderProps {
  roomName: string;
  memberCount: number;
  description?: string;
  announcement?: string;
}

export function ChatHeader({ roomName, memberCount, description, announcement }: ChatHeaderProps) {
  return (
    <div className="relative">
      <div className="h-40 overflow-hidden rounded-t-lg">
        <img
          src="/images/community-banner.jpg"
          alt="Community chat"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60" />
      </div>
      
      <div className="absolute bottom-4 left-4 text-white">
        <h1 className="text-2xl font-semibold">{roomName}</h1>
        <div className="flex items-center mt-1">
          <Users className="h-4 w-4 mr-1" />
          <span className="text-sm">{memberCount} members</span>
        </div>
      </div>

      {announcement && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          className="bg-zenLightPink border-l-4 border-zenPink p-4 mt-4 rounded-r"
        >
          <p className="text-sm text-gray-700">{announcement}</p>
        </motion.div>
      )}

      <div className="text-center py-4 bg-gradient-to-r from-zenSeafoam/20 to-zenMint/20 rounded-lg mt-4">
        <p className="text-gray-600 italic">
          "You are never alone. Share what's on your mind."
        </p>
      </div>
    </div>
  );
}
