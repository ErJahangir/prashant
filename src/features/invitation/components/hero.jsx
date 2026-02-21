import { Calendar, Clock, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useConfig } from "@/features/invitation/hooks/use-config";
import { formatEventDate } from "@/lib/format-event-date";
import { getGuestName } from "@/lib/invitation-storage";
import CountdownTimer from "./CountdownTimer";

export default function Hero() {
  const config = useConfig();
  const [guestName, setGuestName] = useState("");
  const [showPetals, setShowPetals] = useState(false);
  console.log("Config in Hero:", config);
  useEffect(() => {
    const storedGuestName = getGuestName();
    if (storedGuestName) setGuestName(storedGuestName);
  }, []);

  /* ---------------- ROSE PETALS ---------------- */

  const RosePetals = ({ trigger }) => {
    const [petals, setPetals] = useState([]);

    useEffect(() => {
      if (!trigger) return;

      const newPetals = [...Array(30)].map((_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 2,
        duration: 4 + Math.random() * 2,
        size: 18 + Math.random() * 22,
        rotate: Math.random() * 720 - 360,
      }));

      setPetals(newPetals);

      const timer = setTimeout(() => setPetals([]), 6500);
      return () => clearTimeout(timer);
    }, [trigger]);

    return (
      <div className="pointer-events-none fixed inset-0 z-[999] overflow-hidden">
        {petals.map((petal) => (
          <motion.img
            key={petal.id}
            src="/petal.png"
            className="absolute select-none"
            style={{
              left: `${petal.left}%`,
              width: petal.size,
            }}
            initial={{ y: -120, rotate: 0, opacity: 0 }}
            animate={{
              y: "120vh",
              rotate: petal.rotate,
              opacity: [0, 1, 1, 0.8, 0],
              x: [0, 40, -40, 25, -15, 0],
            }}
            transition={{
              duration: petal.duration,
              delay: petal.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    );
  };

  /* ---------------- FLOATING HEARTS ---------------- */

  const FloatingHearts = () => {
    const hearts = [...Array(8)].map((_, i) => ({
      id: i,
      size: Math.floor(Math.random() * 2) + 8,
      left: Math.random() * 100,
      delay: i * 0.8,
    }));

    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {hearts.map((heart) => (
          <motion.div
            key={heart.id}
            initial={{ y: "100vh", opacity: 0, scale: 0 }}
            animate={{
              y: "-10vh",
              opacity: [0, 1, 1, 0],
              scale: [0, 1, 1, 0.5],
            }}
            transition={{ duration: 4, repeat: Infinity, delay: heart.delay }}
            className="absolute"
            style={{ left: `${heart.left}%` }}
          >
            <Heart
              className="text-rose-400"
              style={{ width: heart.size * 4, height: heart.size * 4 }}
              fill="currentColor"
            />
          </motion.div>
        ))}
      </div>
    );
  };

  /* ---------------- UI ---------------- */

  return (
    <section
      id="home"
      className="min-h-screen flex flex-col items-center justify-center px-4 py-16 sm:py-20 text-center relative overflow-visible"
    >
      <RosePetals trigger={showPetals} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6 relative z-10"
      >
        {/* Couple Image */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex justify-center cursor-pointer"
          onClick={() => setShowPetals((p) => !p)}
        >
          <div className="relative overflow-hidden rounded-2xl shadow-xl">
            <img
              src="/couple.png"
              alt="Couple"
              className="w-full max-w-md object-cover hover:scale-105 transition duration-500"
            />
          </div>
        </motion.div>

        {/* Save the date */}
        <span className="px-4 py-1 text-sm bg-rose-50 text-rose-600 rounded-full border border-rose-200">
          Save the Date
        </span>

        {/* Names */}
        <div className="space-y-4">
          <p className="text-gray-500 italic">
            With joyful hearts, we invite you to celebrate the wedding of
          </p>

          <h2 className="text-3xl sm:text-5xl font-serif bg-clip-text text-transparent bg-gradient-to-r from-rose-600 to-pink-600">
            {config.groom_name} ❤️ {config.bride_name}
          </h2>
        </div>

        {/* Date & Time */}
        <div className="space-y-3">
          <div className="flex items-center justify-center gap-2">
            <Calendar className="w-4 h-4 text-rose-400" />
            {formatEventDate(config.date, "full")}
          </div>

          <div className="flex items-center justify-center gap-2">
            <Clock className="w-4 h-4 text-rose-400" />
            {config.time}
          </div>
        </div>

        {/* Guest */}
        <div>
          <p className="text-gray-500 italic">To</p>
          <p className="text-rose-500 font-semibold text-lg">
            {guestName || "Our dear guest"}
          </p>
        </div>

        <CountdownTimer targetDate={config?.date} />

        <div className="pt-6 relative">
          <FloatingHearts />
          <Heart
            className="w-12 h-12 text-rose-500 mx-auto animate-pulse"
            fill="currentColor"
          />
        </div>
      </motion.div>
    </section>
  );
}
