
import { useState } from "react";
import SectionHeading from "@/components/common/SectionHeading";
import QuoteCard from "@/components/common/QuoteCard";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function QuoteSection() {
  const quotes = [
    {
      text: "Your mental health is a priority. Your happiness is essential. Your self-care is a necessity.",
      author: "Dan Millman"
    },
    {
      text: "You don't have to control your thoughts. You just have to stop letting them control you.",
      author: "Dan Millman"
    },
    {
      text: "Mental health is not a destination, but a process. It's about how you drive, not where you're going.",
      author: "Noam Shpancer"
    },
    {
      text: "Self-care is not selfish. You cannot serve from an empty vessel.",
      author: "Eleanor Brownn"
    },
    {
      text: "The mind is like an iceberg, it floats with one-seventh of its bulk above water.",
      author: "Sigmund Freud"
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextQuote = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === quotes.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevQuote = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? quotes.length - 1 : prevIndex - 1
    );
  };

  return (
    <section className="py-20 bg-zenMint">
      <div className="container mx-auto px-4">
        <SectionHeading
          title="Words of Wisdom"
          subtitle="Find inspiration in these thoughtful quotes about mental health"
          centered
        />
        
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="mb-8"
            >
              <QuoteCard 
                text={quotes[currentIndex].text}
                author={quotes[currentIndex].author}
              />
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-center space-x-4">
            <Button
              onClick={prevQuote}
              variant="outline"
              size="icon"
              className="rounded-full border-zenSage text-zenSage hover:bg-zenSage hover:text-white"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Button
              onClick={nextQuote}
              variant="outline"
              size="icon"
              className="rounded-full border-zenSage text-zenSage hover:bg-zenSage hover:text-white"
            >
              <ArrowRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
