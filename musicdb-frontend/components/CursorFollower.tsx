'use client';

import { useState, useEffect } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

export default function CursorFollower() {
    const [mounted, setMounted] = useState(false);

    // Core cursor coordinates
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Spring physics for smooth following
    const springConfig = { damping: 25, stiffness: 150 };
    const x = useSpring(mouseX, springConfig);
    const y = useSpring(mouseY, springConfig);

    useEffect(() => {
        setMounted(true);
        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [mouseX, mouseY]);

    if (!mounted) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-[9999]">
            {/* The Shooting Star (Orbiting Particle) */}
            <motion.div
                style={{ x, y }}
                className="absolute"
            >
                <motion.div
                    animate={{
                        rotate: [0, 360],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        rotate: { duration: 4, repeat: Infinity, ease: "linear" },
                        scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                    }}
                    className="relative"
                >
                    {/* The "Star" Core */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.8),0_0_30px_rgba(29,185,84,0.4)]" />

                    {/* The Orbiting Tail */}
                    <motion.div
                        animate={{
                            x: [20, 0, -20, 0, 20],
                            y: [0, 20, 0, -20, 0],
                            rotate: [0, 90, 180, 270, 360],
                            opacity: [0.6, 1, 0.6],
                        }}
                        transition={{
                            duration: 2.5,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                        className="w-1.5 h-1.5 rounded-full bg-[#1DB954] shadow-[0_0_10px_#1DB954]"
                    />

                    {/* Secondary Particle */}
                    <motion.div
                        animate={{
                            x: [-30, 0, 30, 0, -30],
                            y: [0, -30, 0, 30, 0],
                            opacity: [0.4, 0.8, 0.4],
                        }}
                        transition={{
                            duration: 3.5,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                        className="w-1 h-1 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.6)]"
                    />
                </motion.div>
            </motion.div>

            {/* Global cursor glow (Subtle) */}
            <motion.div
                style={{ x, y }}
                className="absolute -translate-x-1/2 -translate-y-1/2 w-[80px] h-[80px] rounded-full bg-gradient-to-r from-[#1DB954]/5 to-blue-500/5 blur-2xl opacity-60"
            />
        </div>
    );
}
