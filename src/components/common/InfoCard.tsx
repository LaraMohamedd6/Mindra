
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface InfoCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
  color?: string;
  className?: string;
  delay?: number;
}

export default function InfoCard({
  title,
  description,
  icon,
  link,
  color = "bg-zenLightPink text-zenPink",
  className,
  delay = 0,
}: InfoCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.1, duration: 0.5 }}
      className={cn(
        "rounded-xl overflow-hidden bg-white border border-gray-100 shadow-md hover:shadow-xl transition-all duration-300",
        className
      )}
    >
      <div className="p-6">
        <div className={cn("rounded-full w-12 h-12 flex items-center justify-center mb-4", color)}>
          {icon}
        </div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>
        <Link
          to={link}
          className="text-zenSage font-medium flex items-center hover:text-zenSage/80 transition-colors"
        >
          Learn more
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </div>
    </motion.div>
  );
}
