
import Layout from "@/components/layout/Layout";
import EnhancedHero from "@/components/home/EnhancedHero";
import Features from "@/components/home/Features";
import QuoteSection from "@/components/home/QuoteSection";
import CTA from "@/components/home/CTA";
import FeaturedTools from "@/components/home/FeaturedTools";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import ihImage from '../assets/images/ih.jpg';
import emImage from '../assets/images/eme.avif';
import medImage from '../assets/images/medi.avif';

const Index = () => {
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: true });
  
  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.1, duration: 0.5 }
    })
  };

  return (
    <Layout>
      <EnhancedHero />
      <Features />
      <CTA />
      <FeaturedTools />
      
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-semibold text-gray-800 mb-4">
              Designed for Student Well-being
            </h2>
            <p className="text-lg text-gray-600">
              Explore our specialized sections addressing different aspects of student mental health
            </p>
          </div>
          
          <motion.div
            ref={ref}
            initial="hidden"
            animate={controls}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {[
              {
                title: "Mental Health Information",
                description: "Evidence-based information on common mental health challenges faced by students",
                image: ihImage,
                link: "/information",
                color: "from-zenSeafoam to-zenblack",
              },
              {
                title: "Meditation & Mindfulness",
                description: "Guided practices to help you stay grounded during academic stress",
                image: medImage,
                link: "/meditation",
                color: "from-zenSeafoam to-zenblack",
              },
              {
                title: "Emergency Resources",
                description: "Instant crisis assistance and emergency support resources",
                image: emImage,
                link: "/emergency",
                color: "from-zenSeafoam to-zenblack",
              }
            ].map((card, i) => (
              <motion.div
                key={i}
                custom={i}
                variants={cardVariants}
                className="rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
              >
                <div className="relative h-48">
                  <div className={`absolute inset-0 bg-gradient-to-r ${card.color} opacity-70`}></div>
                  <img src={card.image} alt={card.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <h3 className="text-2xl font-display font-semibold text-white drop-shadow-md">{card.title}</h3>
                  </div>
                </div>
                <div className="p-6 bg-white">
                  <p className="text-gray-600 mb-4">{card.description}</p>
                  <Button asChild className="w-full bg-zenSage hover:bg-zenSage/90 text-white">
                    <Link to={card.link}>Explore</Link>
                  </Button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      <QuoteSection />
    </Layout>
  );
};

export default Index;
