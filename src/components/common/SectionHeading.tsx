
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
}

export default function SectionHeading({
  title,
  subtitle,
  centered = false,
  className,
}: SectionHeadingProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "mb-10",
        centered ? "text-center" : "",
        className
      )}
    >
      <h2 className="text-3xl md:text-4xl font-display font-semibold text-gray-800">{title}</h2>
      {subtitle && <p className="mt-2 text-lg text-gray-600">{subtitle}</p>}
    </motion.div>
  );
}
