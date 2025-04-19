
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";

interface QuoteCardProps {
  text: string;
  author: string;
  className?: string;
}

export default function QuoteCard({ text, author, className }: QuoteCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "p-6 bg-white rounded-xl shadow-md border border-gray-100",
        className
      )}
    >
      <div className="flex items-start mb-4">
        <div className="bg-zenLightPink rounded-full p-2 mr-4">
          <Quote className="h-5 w-5 text-zenPink" />
        </div>
      </div>
      <blockquote className="text-lg italic text-gray-700 mb-4">
        "{text}"
      </blockquote>
      <footer className="text-sm font-medium text-gray-600">
        &mdash; {author}
      </footer>
    </motion.div>
  );
}
