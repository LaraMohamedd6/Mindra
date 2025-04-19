
import { motion } from "framer-motion";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";

export default function MotivationCarousel() {
  const motivationalQuotes = [
    {
      text: "Your mental health is a priority. Your happiness is essential. Your self-care is a necessity.",
      author: "Unknown"
    },
    {
      text: "You don't have to be positive all the time. It's perfectly okay to feel sad, angry, annoyed, frustrated, scared and anxious. Having feelings doesn't make you a negative person. It makes you human.",
      author: "Lori Deschene"
    },
    {
      text: "Self-care is how you take your power back.",
      author: "Lalah Delia"
    },
    {
      text: "Mental health problems don't define who you are. They are something you experience, but they are not you.",
      author: "Matt Haig"
    },
    {
      text: "The strongest people are those who win battles we know nothing about.",
      author: "Unknown"
    },
    {
      text: "Recovery is not one and done. It is a lifelong journey that takes place one day, one step at a time.",
      author: "Unknown"
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto text-center mb-10"
        >
          <h2 className="text-3xl md:text-4xl font-display font-semibold text-gray-800 mb-3">
            Daily Affirmations
          </h2>
          <p className="text-gray-600">
            Nurture your mind with positive thoughts that inspire and uplift
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <Carousel
            opts={{
              align: "start",
              loop: true
            }}
            className="w-full"
          >
            <CarouselContent>
              {motivationalQuotes.map((quote, index) => (
                <CarouselItem key={index} className="md:basis-2/3 lg:basis-1/2">
                  <div className="p-1">
                    <Card>
                      <CardContent className="flex flex-col aspect-square p-6 items-center justify-center text-center bg-gradient-to-br from-zenLightPink via-white to-zenMint/30">
                        <Quote className="h-8 w-8 text-zenPink mb-4 opacity-50" />
                        <blockquote className="text-lg text-gray-800 mb-4 italic">
                          "{quote.text}"
                        </blockquote>
                        <cite className="text-sm text-gray-600 not-italic">
                          — {quote.author}
                        </cite>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center mt-8">
              <CarouselPrevious className="static" />
              <div className="w-10"></div>
              <CarouselNext className="static" />
            </div>
          </Carousel>
        </div>
      </div>
    </section>
  );
}
