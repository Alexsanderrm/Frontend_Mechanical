import React from 'react';
import { motion } from 'framer-motion';
import { Box, Typography } from '@mui/material';
import CountUp from 'react-countup';
import { useInView } from 'react-intersection-observer';

interface AnimatedStatsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  gradient: string;
  delay?: number;
}

const AnimatedStatsCard: React.FC<AnimatedStatsCardProps> = ({
  title,
  value,
  icon,
  gradient,
  delay = 0
}) => {
  const [ref, inView] = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{
        duration: 0.6,
        delay: delay,
        type: "spring",
        stiffness: 100
      }}
      whileHover={{
        scale: 1.05,
        y: -8,
        transition: { duration: 0.2 }
      }}
      className="relative overflow-hidden rounded-2xl shadow-2xl"
      style={{
        background: `linear-gradient(135deg, ${gradient})`,
        minHeight: '180px'
      }}
    >
      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 bg-white/10 backdrop-blur-sm" />

      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute w-20 h-20 bg-white/20 rounded-full"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{ top: '20%', left: '10%' }}
        />
        <motion.div
          className="absolute w-16 h-16 bg-white/15 rounded-full"
          animate={{
            x: [0, -80, 0],
            y: [0, -40, 0],
            scale: [1, 0.8, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          style={{ top: '60%', right: '15%' }}
        />
      </div>

      {/* Glow effect */}
      <motion.div
        className="absolute inset-0 rounded-2xl"
        animate={{
          boxShadow: [
            '0 0 20px rgba(255,255,255,0.1)',
            '0 0 40px rgba(255,255,255,0.2)',
            '0 0 20px rgba(255,255,255,0.1)'
          ]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <Box className="relative z-10 p-6 h-full flex flex-col justify-between">
        <Box className="flex items-center justify-between mb-4">
          <motion.div
            animate={inView ? { rotate: [0, 10, -10, 0] } : {}}
            transition={{ duration: 0.8, delay: delay + 0.3 }}
            className="text-white/80"
          >
            {icon}
          </motion.div>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-2 border-white/30 rounded-full border-t-white/60"
          />
        </Box>

        <Box>
          <Typography
            variant="h3"
            className="text-white font-bold mb-2"
            sx={{ fontSize: '2.5rem', lineHeight: 1 }}
          >
            {inView && (
              <CountUp
                start={0}
                end={value}
                duration={2.5}
                delay={delay}
                separator=","
              />
            )}
          </Typography>
          <Typography
            variant="h6"
            className="text-white/90 font-medium"
            sx={{ fontSize: '1.1rem' }}
          >
            {title}
          </Typography>
        </Box>

        {/* Sparkline mini chart */}
        <Box className="mt-4">
          <motion.div
            className="flex items-end space-x-1 h-8"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: delay + 0.8 }}
          >
            {[40, 60, 45, 80, 65, 90, 75, 85].map((height, index) => (
              <motion.div
                key={index}
                className="bg-white/40 rounded-sm flex-1"
                initial={{ height: 0 }}
                animate={inView ? { height: `${height}%` } : {}}
                transition={{
                  delay: delay + 1 + index * 0.1,
                  duration: 0.5,
                  ease: "easeOut"
                }}
                style={{ minHeight: '4px' }}
              />
            ))}
          </motion.div>
        </Box>
      </Box>
    </motion.div>
  );
};

export default AnimatedStatsCard;