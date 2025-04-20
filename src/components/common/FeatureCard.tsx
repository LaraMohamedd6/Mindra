import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  className?: string;
}

export default function FeatureCard({
  title,
  description,
  icon,
  className,
}: FeatureCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={cn(
        "p-6 bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300",
        "h-full flex flex-col min-h-[200px]", // Set minimum height and flex layout
        className
      )}
    >
      <div className="bg-zenMint rounded-full w-12 h-12 flex items-center justify-center mb-4 flex-shrink-0">
        <div className="text-zenSage">{icon}</div>
      </div>
      
      <div className="flex flex-col flex-grow">
        <h3 className="text-xl font-semibold mb-2 line-clamp-2 min-h-[56px]">{title}</h3>
        <p className="text-gray-600 line-clamp-3 flex-grow">{description}</p>
      </div>
    </motion.div>
  );
}