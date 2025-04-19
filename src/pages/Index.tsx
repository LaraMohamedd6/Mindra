
import Layout from "@/components/layout/Layout";
import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import QuoteSection from "@/components/home/QuoteSection";
import CTA from "@/components/home/CTA";
import { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

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
      <Hero />
      <Features />
      
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
                image: "https://images.unsplash.com/photo-1593073862407-a3a71fed2e27?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1374&q=80",
                link: "/information",
                color: "from-zenPink to-zenPeach",
              },
              {
                title: "Meditation & Mindfulness",
                description: "Guided practices to help you stay grounded during academic stress",
                image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
                link: "/meditation",
                color: "from-zenSeafoam to-zenMint",
              },
              {
                title: "Emergency Resources",
                description: "Immediate help resources for crisis situations",
                image: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
                link: "/emergency",
                color: "from-zenPeach to-zenLightPink",
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
      <CTA />
    </Layout>
  );
};

export default Index;
