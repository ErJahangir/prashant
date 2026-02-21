import { useConfig } from "@/features/invitation/hooks/use-config";
import { formatEventDate } from "@/lib/format-event-date";
import { motion } from "framer-motion";
import { Calendar, Clock } from "lucide-react";

const LandingPage = ({ onOpenInvitation }) => {
  const config = useConfig();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen relative overflow-hidden"
    >
      {/* Decorative Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-amber-50 via-rose-50/30 to-amber-50" />
      <div className="absolute top-0 right-0 w-64 h-64 md:w-96 md:h-96 bg-yellow-200/20 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-64 h-64 md:w-96 md:h-96 bg-orange-200/20 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md"
        >
          <div className="backdrop-blur-sm bg-white/70 p-6 sm:p-8 md:p-10 rounded-2xl border border-amber-200 shadow-xl">
            {/* Heading */}
            <div className="text-center mb-6">
              <h2 className="text-amber-700 font-semibold tracking-widest text-sm">
                || श्री गणेशाय नमः ||
              </h2>
            </div>

            {/* Date */}
            <div className="flex flex-col gap-4 mb-6 sm:mb-8 items-center">
              <div className="inline-flex flex-col items-center space-y-1 bg-white/90 px-6 py-3 rounded-xl">
                <Calendar className="w-5 h-5 text-amber-500" />
                <p className="text-gray-800 font-medium">Shubh Vivah Tithi</p>
                <p className="text-gray-700">{formatEventDate(config.date)}</p>
              </div>

              <div className="inline-flex flex-col items-center space-y-1 bg-white/90 px-6 py-3 rounded-xl">
                <Clock className="w-5 h-5 text-amber-500" />
                <p className="text-gray-800 font-medium">Muhurat</p>
                <p className="text-gray-700">{config.time}</p>
              </div>
            </div>

            {/* Couple Names */}
            <div className="text-center space-y-3">
              <p className="text-gray-500 text-sm">With blessings of elders</p>

              <h1 className="text-3xl sm:text-4xl md:text-4xl font-serif text-gray-800 leading-tight">
                {config.groomName}
                <span className="text-amber-600 mx-3">विवाह</span>
                {config.brideName}
              </h1>

              <div className="h-px w-20 mx-auto bg-amber-300" />
            </div>

            {/* Button */}
            <div className="mt-8">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onOpenInvitation}
                className="w-full bg-amber-600 text-white px-8 py-3 rounded-xl font-medium shadow-lg hover:bg-amber-700 transition-all duration-200"
              >
                View Shubh Vivah
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LandingPage;
