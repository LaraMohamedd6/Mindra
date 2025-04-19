
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { HeartHandshake, Calendar, BookCheck, Brain } from "lucide-react";

export default function CTA() {
  return (
    <section className="py-20 bg-gradient-to-br from-zenPink/20 via-zenPeach/20 to-zenLightPink/20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <div className="space-y-10">
              <div className="flex items-start">
                <div className="bg-white rounded-full p-3 shadow-md mr-4">
                  <Brain className="h-6 w-6 text-zenPink" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">Understand Your Mind</h3>
                  <p className="text-gray-600">Learn about mental health conditions with evidence-based resources.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-white rounded-full p-3 shadow-md mr-4">
                  <Calendar className="h-6 w-6 text-zenPink" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">Daily Wellness Practices</h3>
                  <p className="text-gray-600">Access meditation, yoga, and fitness activities tailored for students.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-white rounded-full p-3 shadow-md mr-4">
                  <BookCheck className="h-6 w-6 text-zenPink" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">Academic Balance</h3>
                  <p className="text-gray-600">Tools to manage study stress, improve focus, and maintain well-being.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-white rounded-full p-3 shadow-md mr-4">
                  <HeartHandshake className="h-6 w-6 text-zenPink" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-1">Community Support</h3>
                  <p className="text-gray-600">Connect with peers who understand what you're going through.</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
            className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100"
          >
            <div className="mb-6">
              <h2 className="text-3xl font-display font-semibold mb-4">Start Your Wellness Journey Today</h2>
              <p className="text-gray-600 mb-6">
                Join thousands of students who are prioritizing their mental health with ZenZone Connect. Sign up for free access to all our resources.
              </p>
              
              <div className="space-y-3">
                <Button
                  asChild
                  className="w-full bg-zenSage hover:bg-zenSage/90 text-white py-6"
                >
                  <Link to="/signup">Sign Up For Free</Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="w-full border-zenSage text-zenSage hover:bg-zenSage/10 py-6"
                >
                  <Link to="/login">Already have an account? Log In</Link>
                </Button>
              </div>
            </div>

            <div className="bg-zenLightPink p-4 rounded-xl">
              <div className="flex items-start">
                <div className="bg-white rounded-full p-2 mr-3">
                  <HeartHandshake className="h-4 w-4 text-zenPink" />
                </div>
                <div>
                  <h4 className="font-medium mb-1">Need immediate help?</h4>
                  <p className="text-sm">
                    If you're in crisis, visit our <Link to="/emergency" className="text-zenPink font-medium hover:underline">emergency resources</Link> page for immediate support.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
