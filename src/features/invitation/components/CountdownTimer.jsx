import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const CountdownTimer = ({ targetDate }) => {
  const parseDate = (input) => {
    if (!input) return null;

    // ✅ Firestore Timestamp (REST format)
    if (input?.seconds) {
      return new Date(input.seconds * 1000);
    }

    // ✅ Firestore SDK Timestamp
    if (input?.toDate) {
      return input.toDate();
    }

    // ✅ ISO string or normal date
    return new Date(input);
  };

  const calculateTimeLeft = () => {
    const parsedDate = parseDate(targetDate);
    if (!parsedDate) return {};

    const difference = parsedDate.getTime() - Date.now();
    if (difference <= 0) return {};

    return {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
      {Object.keys(timeLeft).map((interval) => (
        <motion.div
          key={interval}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center p-3 bg-white/80 backdrop-blur-sm rounded-xl border border-rose-100"
        >
          <span className="text-xl sm:text-2xl font-bold text-rose-600">
            {timeLeft[interval]}
          </span>
          <span className="text-xs text-gray-500 capitalize">{interval}</span>
        </motion.div>
      ))}
    </div>
  );
};

export default CountdownTimer;
