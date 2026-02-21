import { useConfig } from "@/features/invitation/hooks/use-config";
import { motion } from "framer-motion";
import { Gift } from "lucide-react";
import { useState, useEffect } from "react";

export default function Gifts() {
  const config = useConfig(); // Use hook to get config from API or fallback to static
  const [hasAnimated, setHasAnimated] = useState(false);

  // Set animation to run once on component mount
  useEffect(() => {
    setHasAnimated(true);
  }, []);

  // Hide section if config or banks data is not set
  if (!config?.banks || config.banks.length === 0) {
    return null;
  }

  return (
    <>
      <section id="gifts" className="min-h-screen relative overflow-hidden">
        <div className="container mx-auto px-4 py-20 relative z-10">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={hasAnimated ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-center space-y-4 mb-16"
          >
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={hasAnimated ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 }}
              className="inline-block text-rose-500 font-medium"
            >
              Wedding gifts
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={hasAnimated ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 }}
              className="text-4xl md:text-5xl font-serif text-gray-800"
            >
              Gift us
            </motion.h2>

            {/* Decorative Divider */}
            <motion.div
              initial={{ scale: 0 }}
              animate={hasAnimated ? { scale: 1 } : {}}
              transition={{ delay: 0.4 }}
              className="flex items-center justify-center gap-4 pt-4"
            >
              <div className="h-[1px] w-12 bg-rose-200" />
              <Gift className="w-5 h-5 text-rose-400" />
              <div className="h-[1px] w-12 bg-rose-200" />
            </motion.div>

            {/* Message Container */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={hasAnimated ? { opacity: 1 } : {}}
              transition={{ delay: 0.5 }}
              className="space-y-4 max-w-md mx-auto"
            >
              <p className="text-2xl text-gray-800 font-serif">ॐ</p>

              <p className="text-gray-600 leading-relaxed">
                Your presence at our wedding is our greatest gift. If you wish
                to bless us, you may use the details below.
              </p>

              <p className="text-gray-600 italic text-sm">
                Dhanyavaad. We look forward to celebrating with you.
              </p>
            </motion.div>

            {/* Optional: Additional Decorative Element */}
            <motion.div
              initial={{ scale: 0 }}
              animate={hasAnimated ? { scale: 1 } : {}}
              transition={{ delay: 0.6 }}
              className="flex items-center justify-center gap-3 pt-4"
            >
              <div className="h-px w-8 bg-rose-200/50" />
              <div className="w-1.5 h-1.5 rounded-full bg-rose-300" />
              <div className="h-px w-8 bg-rose-200/50" />
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
