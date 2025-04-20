import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Hash } from "lucide-react";
import type { ChatRoom } from "@/types/chat";

const mentalHealthTopics = [
  { id: 1, name: "Anxiety Support", description: "Share experiences and coping strategies", currentUsers: 0, maxCapacity: 20 },
  { id: 2, name: "Stress Management", description: "Discuss stress relief techniques", currentUsers: 0, maxCapacity: 20 },
  { id: 3, name: "Depression Support", description: "A safe space for supporting each other", currentUsers: 0, maxCapacity: 20 },
  { id: 4, name: "Mindfulness Practice", description: "Practice mindfulness together", currentUsers: 0, maxCapacity: 20 },
  { id: 5, name: "Study Anxiety", description: "Support for academic stress", currentUsers: 0, maxCapacity: 20 },
  { id: 6, name: "Social Connection", description: "Build meaningful connections", currentUsers: 0, maxCapacity: 20 },
  { id: 7, name: "Self-Care Circle", description: "Share self-care tips and experiences", currentUsers: 0, maxCapacity: 20 },
  { id: 8, name: "Sleep Support", description: "Discuss sleep hygiene and issues", currentUsers: 0, maxCapacity: 20 },
  { id: 9, name: "Positive Thinking", description: "Focus on optimistic perspectives", currentUsers: 0, maxCapacity: 20 },
  { id: 10, name: "General Support", description: "Open discussion for all topics", currentUsers: 0, maxCapacity: 20 },
];

interface ChatRoomListProps {
  rooms: ChatRoom[];
  onJoinRoom: (roomId: number) => void;
}

export function ChatRoomList({ rooms, onJoinRoom }: ChatRoomListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {rooms.map((room) => (
        <motion.div
          key={room.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02 }}
          className="cursor-pointer"
          onClick={() => onJoinRoom(room.id)}
        >
          <Card className="p-4 hover:shadow-lg transition-shadow border-zenSeafoam hover:border-zenSage">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold flex items-center text-lg">
                  <Hash className="h-5 w-5 mr-2 text-zenSage" />
                  {room.name}
                </h3>
                <p className="text-gray-600 text-sm mt-1">{room.description}</p>
              </div>
              <Badge variant="outline" className="ml-2">
                <Users className="h-4 w-4 mr-1" />
                {room.currentUsers}/{room.maxCapacity}
              </Badge>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

export { mentalHealthTopics };
