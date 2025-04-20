
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import type { Reaction } from "@/types/chat";

const reactions = [
  { emoji: "👍", label: "thumbs up" },
  { emoji: "❤️", label: "heart" },
  { emoji: "😄", label: "smile" },
  { emoji: "😢", label: "sad" },
];

interface MessageReactionProps {
  onReact: (reaction: string) => void;
  existingReactions?: Reaction[];
}

export function MessageReaction({ onReact, existingReactions = [] }: MessageReactionProps) {
  const [showReactions, setShowReactions] = useState(false);

  return (
    <div className="relative">
      <Button 
        variant="ghost" 
        size="sm" 
        className="text-gray-500 hover:text-gray-700"
        onClick={() => setShowReactions(!showReactions)}
      >
        {existingReactions.length > 0 ? (
          <div className="flex space-x-1">
            {existingReactions.map((reaction, index) => (
              <span key={index}>{reaction.emoji} {reaction.count}</span>
            ))}
          </div>
        ) : "😊"}
      </Button>

      {showReactions && (
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="absolute bottom-full mb-2 bg-white rounded-full shadow-lg border border-gray-100 p-1 flex space-x-1"
        >
          {reactions.map((reaction) => (
            <Button
              key={reaction.emoji}
              variant="ghost"
              size="sm"
              className="hover:bg-gray-100 rounded-full w-8 h-8 p-0"
              onClick={() => {
                onReact(reaction.emoji);
                setShowReactions(false);
              }}
            >
              {reaction.emoji}
            </Button>
          ))}
        </motion.div>
      )}
    </div>
  );
}
