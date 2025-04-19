
import { cn } from "@/lib/utils";
import { ExternalLink } from "lucide-react";
import { HTMLProps, forwardRef } from "react";

export interface ResourceCardProps extends HTMLProps<HTMLDivElement> {
  title: string;
  description: string;
  link?: string;
  icon: React.ReactNode;
  className?: string;
}

export default function ResourceCard({
  title,
  description,
  icon,
  link,
  className,
  ...props
}: ResourceCardProps) {
  const CardWrapper = ({ children }: { children: React.ReactNode }) => {
    if (link) {
      return (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "block group zen-card p-6 transition-all duration-300",
            className
          )}
        >
          {children}
        </a>
      );
    }
    return (
      <div
        className={cn("zen-card p-6 transition-all duration-300", className)}
        {...props}
      >
        {children}
      </div>
    );
  };

  return (
    <CardWrapper>
      <div className="flex items-start">
        <div className="rounded-full bg-zenLightPink p-3 mr-4">
          <div className="text-zenPink">{icon}</div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2 flex items-center">
            {title}
            {link && (
              <ExternalLink className="ml-2 h-4 w-4 text-gray-400 group-hover:text-zenPink transition-colors" />
            )}
          </h3>
          <p className="text-gray-600">{description}</p>
        </div>
      </div>
    </CardWrapper>
  );
}
