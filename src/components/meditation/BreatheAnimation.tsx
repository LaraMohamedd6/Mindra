
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BreatheAnimationProps {
  duration?: number;
}

export default function BreatheAnimation({ duration = 8000 }: BreatheAnimationProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<"inhale" | "hold" | "exhale" | "rest">("inhale");
  const [progress, setProgress] = useState(0);

  // Phase durations in ms
  const phaseDurations = {
    inhale: duration * 0.25,  // 25% of total duration
    hold: duration * 0.25,    // 25% of total duration  
    exhale: duration * 0.25,  // 25% of total duration
    rest: duration * 0.25,    // 25% of total duration
  };

  useEffect(() => {
    let intervalId: number | null = null;
    let phaseStartTime: number;
    let animationFrame: number;
    
    const updateProgress = (timestamp: number) => {
      if (!phaseStartTime) phaseStartTime = timestamp;
      
      const elapsed = timestamp - phaseStartTime;
      const phaseDuration = phaseDurations[currentPhase];
      
      if (elapsed >= phaseDuration) {
        // Move to next phase
        setCurrentPhase(prev => {
          if (prev === "inhale") return "hold";
          if (prev === "hold") return "exhale";
          if (prev === "exhale") return "rest";
          return "inhale"; // from rest to inhale
        });
        phaseStartTime = timestamp;
      }
      
      setProgress(Math.min(elapsed / phaseDuration, 1));
      
      if (isPlaying) {
        animationFrame = requestAnimationFrame(updateProgress);
      }
    };
    
    if (isPlaying) {
      phaseStartTime = performance.now();
      animationFrame = requestAnimationFrame(updateProgress);
    }
    
    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
      if (intervalId) clearInterval(intervalId);
    };
  }, [isPlaying, currentPhase, phaseDurations]);

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentPhase("inhale");
    setProgress(0);
  };

  const circleVariants = {
    inhale: {
      scale: 1.5,
      transition: { duration: phaseDurations.inhale / 1000, ease: "easeInOut" }
    },
    hold: {
      scale: 1.5,
      transition: { duration: phaseDurations.hold / 1000, ease: "linear" }
    },
    exhale: {
      scale: 1,
      transition: { duration: phaseDurations.exhale / 1000, ease: "easeInOut" }
    },
    rest: {
      scale: 1,
      transition: { duration: phaseDurations.rest / 1000, ease: "linear" }
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-64 h-64 flex items-center justify-center">
        {/* Background rings */}
        <div className="absolute w-full h-full rounded-full bg-zenLightPink opacity-20"></div>
        <div className="absolute w-3/4 h-3/4 rounded-full bg-zenLightPink opacity-30"></div>
        
        {/* Breathing circle */}
        <motion.div
          className="w-1/2 h-1/2 bg-zenPink rounded-full shadow-lg"
          variants={circleVariants}
          animate={currentPhase}
        ></motion.div>
        
        {/* Text instruction */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPhase}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full mt-6 text-center"
          >
            <h3 className="text-2xl font-medium text-gray-800">
              {currentPhase === "inhale" && "Inhale..."}
              {currentPhase === "hold" && "Hold..."}
              {currentPhase === "exhale" && "Exhale..."}
              {currentPhase === "rest" && "Rest..."}
            </h3>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-16 flex space-x-4">
        <Button
          onClick={() => setIsPlaying(!isPlaying)}
          className={`${
            isPlaying 
              ? "bg-zenPink hover:bg-zenPink/90" 
              : "bg-zenSage hover:bg-zenSage/90"
          } text-white`}
        >
          {isPlaying ? (
            <>
              <Pause className="mr-2 h-4 w-4" /> Pause
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" /> Start
            </>
          )}
        </Button>
        <Button
          onClick={handleReset}
          variant="outline"
          className="border-gray-300"
        >
          <RefreshCw className="mr-2 h-4 w-4" /> Reset
        </Button>
      </div>
    </div>
  );
}
