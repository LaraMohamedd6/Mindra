
import Layout from "@/components/layout/Layout";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Heart, Star, Book, Award, Users, CheckCircle, Globe, Clock, Lightbulb } from "lucide-react";
import SectionHeading from "@/components/common/SectionHeading";
import QuoteCard from "@/components/common/QuoteCard";

const teamMembers = [
  {
    name: "Dr. Sarah Chen",
    role: "Founder & Mental Health Director",
    avatar: "https://i.pravatar.cc/150?img=1",
    bio: "PhD in Clinical Psychology with 15 years of experience in student mental health services."
  },
  {
    name: "Michael Rodriguez",
    role: "Meditation Instructor",
    avatar: "https://i.pravatar.cc/150?img=3",
    bio: "Certified mindfulness coach with expertise in helping students manage academic stress."
  },
  {
    name: "Aisha Johnson",
    role: "Wellness Program Manager",
    avatar: "https://i.pravatar.cc/150?img=5",
    bio: "Master's in Health Education focused on developing accessible wellness programs for diverse student populations."
  },
  {
    name: "David Park",
    role: "Technology Lead",
    avatar: "https://i.pravatar.cc/150?img=8",
    bio: "Software engineer with a passion for creating digital tools that make mental wellness accessible."
  }
];

const testimonials = [
  {
    text: "ZenZone Connect has completely changed how I handle stress during exam periods. The guided meditations and breathing exercises are exactly what I needed.",
    author: "Jamie L., Psychology Student"
  },
  {
    text: "As someone dealing with anxiety throughout my college years, having a platform that offers both emergency resources and daily wellness tools has been invaluable.",
    author: "Raj P., Engineering Graduate"
  },
  {
    text: "The mood tracking feature helped me identify patterns in my mental health that I never noticed before. Now I can be proactive about my wellbeing.",
    author: "Taylor M., Business Student"
  }
];

const impactStats = [
  { value: "50,000+", label: "Students Supported" },
  { value: "200+", label: "Campus Partners" },
  { value: "87%", label: "Report Stress Reduction" },
  { value: "92%", label: "Would Recommend" }
];

const values = [
  {
    icon: <Heart className="h-6 w-6" />,
    title: "Compassion",
    description: "We approach every student's mental health journey with empathy and understanding."
  },
  {
    icon: <CheckCircle className="h-6 w-6" />,
    title: "Evidence-Based",
    description: "Our resources and techniques are grounded in scientific research and clinical expertise."
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: "Inclusivity",
    description: "We design our platform to be accessible and relevant to students of all backgrounds."
  },
  {
    icon: <Lightbulb className="h-6 w-6" />,
    title: "Innovation",
    description: "We continuously evolve our approach to meet the changing needs of today's students."
  }
];

const timeline = [
  {
    year: "2018",
    title: "The Idea",
    description: "ZenZone begins as a research project at Cambridge University exploring digital interventions for student mental health."
  },
  {
    year: "2019",
    title: "First Launch",
    description: "Initial version launches at 5 pilot universities, offering basic meditation and stress-management tools."
  },
  {
    year: "2020",
    title: "Pandemic Response",
    description: "Rapidly expanded remote support features to address increased student mental health needs during global lockdowns."
  },
  {
    year: "2021",
    title: "Major Expansion",
    description: "Added comprehensive mood tracking, journaling features, and emergency support resources."
  },
  {
    year: "2022",
    title: "Global Reach",
    description: "Expanded to support students across 12 countries and integrated with university counseling services."
  },
  {
    year: "2023",
    title: "Today",
    description: "Continuing to innovate with AI-assisted support, community features, and customized wellness journeys."
  }
];

export default function AboutUs() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl font-display font-semibold text-gray-900 mb-6">
              Our Mission: Student Mental Wellness
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8">
              ZenZone Connect was created with one goal: to make mental wellness accessible, 
              approachable, and effective for every student, everywhere.
            </p>
            <div className="flex justify-center">
              <div className="flex space-x-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-6 w-6 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Our Story Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-20"
        >
          <SectionHeading 
            title="Our Story" 
            subtitle="How ZenZone Connect came to be"
            centered={true}
            className="mb-12"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="rounded-xl overflow-hidden shadow-lg">
              <img 
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80" 
                alt="Students collaborating" 
                className="w-full h-auto"
              />
            </div>
            
            <div className="space-y-6">
              <p className="text-gray-700">
                ZenZone Connect began in 2018 when Dr. Sarah Chen, then a clinical psychologist at the University Counseling Center, recognized a critical gap in mental health support for students.
              </p>
              <p className="text-gray-700">
                Despite the increasing rates of anxiety, depression, and burnout among college students, many weren't seeking help due to stigma, lack of time, or limited access to resources.
              </p>
              <p className="text-gray-700">
                Drawing from her experience and research in digital mental health interventions, Dr. Chen assembled a team of mental health professionals, educators, and technology experts to create a comprehensive digital wellness platform specifically designed for students.
              </p>
              <p className="text-gray-700">
                Today, ZenZone Connect serves over 50,000 students across 200+ campuses, providing evidence-based tools for stress management, emotional regulation, and crisis support—all in a format that fits into students' busy lives.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Timeline Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mb-20"
        >
          <SectionHeading 
            title="Our Journey" 
            subtitle="The evolution of ZenZone Connect"
            centered={true}
            className="mb-12"
          />
          
          <div className="relative border-l-2 border-zenSeafoam ml-4 md:ml-0 md:mx-auto md:max-w-3xl">
            {timeline.map((item, idx) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="mb-8 ml-6 md:ml-0 md:grid md:grid-cols-[1fr,auto,1fr] md:gap-4"
              >
                <div className={`${idx % 2 === 0 ? "md:text-right" : "md:col-start-3"}`}>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{item.title}</h3>
                  <p className="text-gray-700">{item.description}</p>
                </div>
                
                <div className="bg-zenSeafoam rounded-full h-10 w-10 flex items-center justify-center absolute -left-5 md:static md:justify-self-center text-white font-medium">
                  {item.year}
                </div>
                
                {idx % 2 === 0 ? <div></div> : null}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Values Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mb-20"
        >
          <SectionHeading 
            title="Our Values" 
            subtitle="The principles that guide our work"
            centered={true}
            className="mb-12"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, idx) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardContent className="pt-6 text-center">
                    <div className="mx-auto bg-zenMint w-14 h-14 flex items-center justify-center rounded-full mb-4">
                      <div className="text-zenSage">
                        {value.icon}
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                    <p className="text-gray-600">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Impact Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="py-16 bg-gradient-to-r from-zenSeafoam/20 to-zenMint/20 rounded-2xl mb-20"
        >
          <SectionHeading 
            title="Our Impact" 
            centered={true}
            className="mb-12"
          />
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {impactStats.map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="text-center"
              >
                <p className="text-3xl md:text-4xl font-bold text-zenSage mb-2">{stat.value}</p>
                <p className="text-gray-600">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Team Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mb-20"
        >
          <SectionHeading 
            title="Meet Our Team" 
            subtitle="The people behind ZenZone Connect"
            centered={true}
            className="mb-12"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, idx) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="text-center"
              >
                <Avatar className="h-32 w-32 mx-auto mb-4">
                  <AvatarImage src={member.avatar} alt={member.name} />
                  <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <h3 className="text-xl font-semibold">{member.name}</h3>
                <p className="text-zenPink mb-2">{member.role}</p>
                <p className="text-gray-600">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Testimonials Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mb-20"
        >
          <SectionHeading 
            title="Student Testimonials" 
            subtitle="Hear from those we've helped"
            centered={true}
            className="mb-12"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <QuoteCard 
                  text={testimonial.text} 
                  author={testimonial.author}
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Partners Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mb-20"
        >
          <SectionHeading 
            title="Our Partners" 
            subtitle="Organizations we collaborate with"
            centered={true}
            className="mb-12"
          />
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
            <div className="p-6 grayscale hover:grayscale-0 transition-all">
              <img 
                src="https://upload.wikimedia.org/wikipedia/en/thumb/2/29/Harvard_shield_wreath.svg/1200px-Harvard_shield_wreath.svg.png" 
                alt="Harvard University" 
                className="h-16"
              />
            </div>
            <div className="p-6 grayscale hover:grayscale-0 transition-all">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/UCL_logo.svg/2560px-UCL_logo.svg.png" 
                alt="University College London" 
                className="h-16"
              />
            </div>
            <div className="p-6 grayscale hover:grayscale-0 transition-all">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/Escudo_de_la_Universidad_Nacional_Aut%C3%B3noma_de_M%C3%A9xico.svg/1200px-Escudo_de_la_Universidad_Nacional_Aut%C3%B3noma_de_M%C3%A9xico.svg.png" 
                alt="UNAM" 
                className="h-16"
              />
            </div>
            <div className="p-6 grayscale hover:grayscale-0 transition-all">
              <img 
                src="https://upload.wikimedia.org/wikipedia/en/thumb/3/34/University_of_Tokyo_logo.svg/1200px-University_of_Tokyo_logo.svg.png" 
                alt="University of Tokyo" 
                className="h-16"
              />
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-center py-16 bg-gradient-to-r from-zenSeafoam to-zenMint rounded-2xl"
        >
          <h2 className="text-3xl md:text-4xl font-display font-semibold text-white mb-4">
            Join Our Mission
          </h2>
          <p className="text-white/90 max-w-2xl mx-auto mb-8">
            Whether you're a student looking for support, an institution seeking to enhance your wellness offerings, or a professional interested in joining our team, we'd love to connect.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <motion.a 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-zenSage px-6 py-3 rounded-full font-medium"
              href="/contact"
            >
              Contact Us
            </motion.a>
            <motion.a 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-zenSage text-white px-6 py-3 rounded-full font-medium"
              href="/signup"
            >
              Sign Up Now
            </motion.a>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}
