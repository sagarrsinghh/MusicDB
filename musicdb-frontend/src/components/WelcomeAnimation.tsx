'use client';

import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

interface WelcomeAnimationProps {
    onComplete: () => void;
}

export default function WelcomeAnimation({ onComplete }: WelcomeAnimationProps) {
    const [phase, setPhase] = useState<'intro' | 'interactive' | 'sink'>('intro');
    const [progress, setProgress] = useState(0);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Dynamic styles based on drag
    const rotateX = useTransform(y, [-100, 100], [30, -30]);
    const rotateY = useTransform(x, [-100, 100], [-30, 30]);
    const scale = useTransform(useMotionValue(progress), [0, 100], [0.8, 1]);
    const glowOpacity = useTransform(useMotionValue(progress), [0, 100], [0.3, 0.8]);

    useEffect(() => {
        if (phase === 'intro') {
            const timer = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 100) {
                        clearInterval(timer);
                        setPhase('interactive');
                        return 100;
                    }
                    return prev + 1;
                });
            }, 30); // ~3 seconds for intro
            return () => clearInterval(timer);
        }

        if (phase === 'interactive') {
            const timer = setTimeout(() => {
                setPhase('sink');
            }, 5000); // 5 seconds hook
            return () => clearTimeout(timer);
        }

        if (phase === 'sink') {
            const timer = setTimeout(() => {
                onComplete();
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [phase, onComplete]);

    return (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-[#050505] overflow-hidden cursor-none">
            {/* Background Particles/Glow */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-retro-gold/5 rounded-full blur-[120px]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-retro-accent/5 rounded-full blur-[80px]" />
            </div>

            <AnimatePresence mode="wait">
                {phase !== 'sink' && (
                    <motion.div
                        key="orb-container"
                        className="relative"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, y: 300, scale: 0.8, filter: 'blur(20px) sepia(1)' }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    >
                        {/* Main Interactive Orb */}
                        <motion.div
                            drag
                            dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
                            dragElastic={0.2}
                            style={{ x, y, rotateX, rotateY, perspective: 1000 }}
                            className="relative w-64 h-64 md:w-80 md:h-80 cursor-grab active:cursor-grabbing"
                        >
                            {/* Inner Core */}
                            <motion.div
                                className="absolute inset-0 rounded-full bg-gradient-to-tr from-retro-gold via-yellow-600 to-retro-sepia shadow-[0_0_50px_rgba(197,164,126,0.2)]"
                                animate={{
                                    scale: [1, 1.05, 1],
                                    boxShadow: [
                                        '0_0_50px_rgba(197,164,126,0.2)',
                                        '0_0_80px_rgba(197,164,126,0.4)',
                                        '0_0_50px_rgba(197,164,126,0.2)'
                                    ]
                                }}
                                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            />

                            {/* Glass Layer */}
                            <div className="absolute inset-[2px] rounded-full bg-black/40 backdrop-blur-sm border border-white/10" />

                            {/* Visualizer Rings */}
                            {[1, 2, 3].map((i) => (
                                <motion.div
                                    key={i}
                                    className="absolute inset-0 border border-white/10 rounded-full"
                                    animate={{
                                        scale: [1, 1.2 + i * 0.1, 1],
                                        opacity: [0.2, 0.5, 0.2],
                                        rotate: [0, 360]
                                    }}
                                    transition={{
                                        duration: 4 + i,
                                        repeat: Infinity,
                                        ease: "linear"
                                    }}
                                />
                            ))}

                            {/* Center Logo/Icon Placeholder */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <motion.div
                                    className="w-16 h-16 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 flex items-center justify-center p-4"
                                    animate={{ rotate: [0, 10, -10, 0] }}
                                    transition={{ duration: 5, repeat: Infinity }}
                                >
                                    <svg viewBox="0 0 24 24" className="w-full h-full text-white fill-current">
                                        <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                                    </svg>
                                </motion.div>
                            </div>
                        </motion.div>

                        {/* Hint Text */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1 }}
                            className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-max text-center"
                        >
                            <p className="text-retro-gold/60 font-serif italic tracking-[0.3em] uppercase text-[10px] mb-2">
                                {phase === 'intro' ? 'Developing Frame...' : 'Manipulate the Reel'}
                            </p>
                            <div className="w-full h-[1px] bg-white/5 overflow-hidden rounded-full">
                                <motion.div
                                    className="h-full bg-retro-gold"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Premium Cursor */}
            <motion.div
                className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-[101] mix-blend-difference"
                style={{ x: useMotionValue(0), y: useMotionValue(0) }} // Placeholder for actual cursor follow logic if needed
            >
                <div className="w-full h-full border border-white rounded-full opacity-50" />
            </motion.div>
        </div>
    );
}
