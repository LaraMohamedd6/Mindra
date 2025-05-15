
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Brain, Activity, CheckCircle } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import first from "@/assets/images/first.avif";
import second from "@/assets/images/second.avif"; 
import third from "@/assets/images/third.avif";


export default function EnhancedHero() { 
  const heroImages = [
    {
      url: first,
      alt: "Students supporting each other"
    },
    {
      url: second,
      alt: "Students studying together"
    },
    {
      url: third,
      alt: "Student practicing meditation"
    }
  ];

  const benefitItems = [
    "Improved academic performance",
    "Better stress management skills",
    "Enhanced emotional wellbeing",
    "Stronger social connections"
  ];

  return (
    <section className="relative overflow-hidden pt-4 md:pt-6 lg:pt-10 bg-gradient-to-br from-zenLightPink to-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-zenPink/10 rounded-lg px-3 py-1 inline-flex items-center mb-4 -mt-4"> {/* Added -mt-4 */}
              <Heart className="h-4 w-4 text-zenPink mr-2" />
              <span className="text-sm font-medium text-zenPink">Student Mental Health Support</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-gray-800 mb-6">
              Your Path to Mental Wellness
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-lg">
              Mindra helps students navigate mental health challenges with interactive tools, resources, and guidance for a balanced academic journey.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="space-y-3 mb-8"
            >
              {benefitItems.map((item, index) => (
                <div key={index} className="flex items-center">
                  <div className="mr-2 text-zenSage">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </motion.div>

            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <Button
                asChild
                className="bg-zenSage hover:bg-zenSage/90 text-white rounded-full px-8 py-6"
              >
                <Link to="/k10test">Depression Severity Test (DST-9)</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-zenSage text-zenSage hover:bg-zenSage/10 rounded-full px-8 py-6"
              >
                <Link to="/Information">Explore Resources</Link>
              </Button>
            </div>
            <div className="mt-6 flex items-center space-x-4 mb-12">
              <div className="flex -space-x-2">
                <div className="w-8 h-8 rounded-full bg-zenPeach flex items-center justify-center text-white">
                  <Brain className="h-4 w-4" />
                </div>
                <div className="w-8 h-8 rounded-full bg-zenSeafoam flex items-center justify-center text-white">
                  <Activity className="h-4 w-4" />
                </div>
                <div className="w-8 h-8 rounded-full bg-zenPink flex items-center justify-center text-white">
                  <Heart className="h-4 w-4" />
                </div>
              </div>
              <span className="text-sm text-gray-600">Trusted by 1000+ students</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <Carousel className="w-full max-w-lg mx-auto">
              <CarouselContent>
                {heroImages.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                      <img
                        src={image.url}
                        alt={image.alt}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" />
            </Carousel>

            <div className="absolute -bottom-6 -right-6 transform translate-x-1/4 translate-y-1/4">
              <div className="animate-spin-slow">
                <svg width="160" height="160" viewBox="0 0 160 160" fill="none">
                  <path d="M80 0C80 44.1828 124.183 80 80 80C35.8172 80 0 44.1828 0 0C0 -44.1828 35.8172 -80 80 -80C124.183 -80 80 -44.1828 80 0Z" fill="#7CAE9E" fillOpacity="0.2" />
                </svg>
              </div>
            </div>

            <div className="absolute -top-4 -left-4 bg-white p-4 rounded-xl shadow-lg">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-zenSeafoam flex items-center justify-center mr-3">
                  <Brain className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Mental Wellness</p>
                  <p className="font-semibold">+68% Improvement</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-24"> {/* Fixed height */}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" preserveAspectRatio="none"> {/* Reduced viewBox height */}
          <path fill="#ffffff" fillOpacity="1" d="M0,64L80,74.7C160,85,320,107,480,106.7C640,107,800,85,960,74.7C1120,64,1280,64,1360,64L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
        </svg>
      </div>
    </section>
  );
}
