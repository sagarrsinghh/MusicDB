'use client';

import { motion } from 'framer-motion';

export default function CinematicOverlay() {
    return (
        <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
            {/* Dynamic Film Grain Layer */}
            <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay animate-grain bg-grain" />

            {/* Classic Vignette */}
            <div className="absolute inset-0 shadow-[inset_0_0_150px_rgba(0,0,0,0.8)] pointer-events-none" />

            {/* Retro Scanlines (Subtle) */}
            <div className="absolute inset-0 bg-scanlines opacity-[0.02] pointer-events-none" />

            {/* Random Light Leaks (Animated) */}
            <motion.div
                animate={{
                    x: [-100, 100, -50],
                    y: [-100, 50, -100],
                    scale: [1, 1.2, 1],
                    opacity: [0, 0.1, 0]
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute -top-1/4 -left-1/4 w-[150%] h-[150%] bg-[radial-gradient(circle_at_center,_rgba(255,150,150,0.1),_transparent_60%)] blur-3xl pointer-events-none"
            />
        </div>
    );
}
