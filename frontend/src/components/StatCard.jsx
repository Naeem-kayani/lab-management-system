import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const AnimatedNumber = ({ value }) => {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = Number(value) || 0;
    if (end === 0) {
      setDisplay(0);
      return;
    }
    const duration = 800;
    const stepTime = Math.max(Math.floor(duration / end), 15);
    const timer = setInterval(() => {
      start += Math.ceil(end / 30);
      if (start >= end) {
        start = end;
        clearInterval(timer);
      }
      setDisplay(start);
    }, stepTime);
    return () => clearInterval(timer);
  }, [value]);

  return <>{display}</>;
};

const StatCard = ({ icon: Icon, label, value, accent = 'clinic', prefix = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className="card flex items-center justify-between"
  >
    <div>
      <p className="text-sm font-medium text-clinic-500 mb-1 tracking-wide uppercase text-[11px]">{label}</p>
      <p className="text-2xl font-bold text-clinic-900">
        {prefix}
        <AnimatedNumber value={value} />
      </p>
    </div>
    <div className={`w-12 h-12 rounded-xl bg-${accent}-50 border border-${accent}-100 flex items-center justify-center shadow-sm`}>
      {Icon && <Icon className={`w-5 h-5 text-${accent}-600`} />}
    </div>
  </motion.div>
);

export default StatCard;
