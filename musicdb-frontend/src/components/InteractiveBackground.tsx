'use client';

import { useEffect, useRef } from 'react';

export default function InteractiveBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const mouseRef = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;
        let w: number, h: number;
        const stars: Star[] = [];
        const nebulas: Nebula[] = [];
        const shootingStars: ShootingStar[] = [];

        const starCount = 350;
        const nebulaCount = 4;
        const colors = ['#fff', '#1DB954', '#06b6d4', '#a855f7', '#ec4899']; // Star tints

        class Star {
            x!: number;
            y!: number;
            size!: number;
            opacity!: number;
            twinkleSpeed!: number;
            color!: string;
            layer!: number; // For parallax

            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * w;
                this.y = Math.random() * h;
                this.layer = Math.random() * 3 + 1; // 1 to 4
                this.size = (Math.random() * 1.5 + 0.5) / this.layer;
                this.opacity = Math.random();
                this.twinkleSpeed = Math.random() * 0.02 + 0.005;
                this.color = Math.random() > 0.8 ? colors[Math.floor(Math.random() * colors.length)] : '#fff';
            }

            draw() {
                if (!ctx) return;
                ctx.save();
                ctx.globalAlpha = this.opacity;
                ctx.fillStyle = this.color;

                // Add a small glow for "shiny" stars
                if (this.layer < 1.3) {
                    ctx.shadowBlur = 10;
                    ctx.shadowColor = this.color;

                    // Draw Star Flare for brightest stars
                    if (this.opacity > 0.8) {
                        ctx.strokeStyle = this.color;
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(this.x - this.size * 4, this.y);
                        ctx.lineTo(this.x + this.size * 4, this.y);
                        ctx.moveTo(this.x, this.y - this.size * 4);
                        ctx.lineTo(this.x, this.y + this.size * 4);
                        ctx.stroke();
                    }
                }

                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }

            update() {
                // Twinkle effect
                this.opacity += this.twinkleSpeed;
                if (this.opacity > 1 || this.opacity < 0.2) {
                    this.twinkleSpeed = -this.twinkleSpeed;
                }

                // Parallax movement based on mouse
                const dx = (mouseRef.current.x - w / 2) / (50 * this.layer);
                const dy = (mouseRef.current.y - h / 2) / (50 * this.layer);

                this.x -= dx * 0.1;
                this.y -= dy * 0.1;

                // Screen wrap
                if (this.x < 0) this.x = w;
                if (this.x > w) this.x = 0;
                if (this.y < 0) this.y = h;
                if (this.y > h) this.y = 0;
            }
        }

        class Nebula {
            x!: number;
            y!: number;
            size!: number;
            color!: string;
            opacity!: number;
            vx!: number;
            vy!: number;

            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * w;
                this.y = Math.random() * h;
                this.size = Math.random() * (w * 0.5) + w * 0.3;
                const nebulaColors = ['rgba(29, 185, 84, 0.03)', 'rgba(168, 85, 247, 0.03)', 'rgba(6, 182, 212, 0.03)'];
                this.color = nebulaColors[Math.floor(Math.random() * nebulaColors.length)];
                this.opacity = 0;
                this.vx = (Math.random() - 0.5) * 0.1;
                this.vy = (Math.random() - 0.5) * 0.1;
            }

            draw() {
                if (!ctx) return;
                const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
                gradient.addColorStop(0, this.color);
                gradient.addColorStop(1, 'transparent');

                ctx.save();
                ctx.fillStyle = gradient;
                ctx.globalCompositeOperation = 'screen';
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                // Slow drift
                if (this.x < -this.size) this.x = w + this.size;
                if (this.x > w + this.size) this.x = -this.size;
                if (this.y < -this.size) this.y = h + this.size;
                if (this.y > h + this.size) this.y = -this.size;
            }
        }

        class ShootingStar {
            x!: number;
            y!: number;
            length!: number;
            speed!: number;
            opacity!: number;
            color!: string;

            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * w + w * 0.5;
                this.y = Math.random() * h * 0.3;
                this.length = Math.random() * 120 + 100;
                this.speed = Math.random() * 20 + 15;
                this.opacity = 1;
                this.color = colors[Math.floor(Math.random() * colors.length)];
            }

            draw() {
                if (!ctx) return;
                ctx.save();
                ctx.globalAlpha = this.opacity;
                ctx.strokeStyle = this.color;
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(this.x + this.length, this.y - this.length);
                ctx.stroke();

                const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, 5);
                gradient.addColorStop(0, '#fff');
                gradient.addColorStop(1, this.color);
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }

            update() {
                this.x -= this.speed;
                this.y += this.speed;
                this.opacity -= 0.012;

                if (this.opacity <= 0 || this.x < -this.length || this.y > h + this.length) {
                    return false;
                }
                return true;
            }
        }

        const setCanvasSize = () => {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
        };

        const init = () => {
            setCanvasSize();
            stars.length = 0;
            nebulas.length = 0;
            for (let i = 0; i < starCount; i++) stars.push(new Star());
            for (let i = 0; i < nebulaCount; i++) nebulas.push(new Nebula());
        };

        const animate = () => {
            ctx.fillStyle = '#020202';
            ctx.fillRect(0, 0, w, h);

            // Draw Nebulas first (background layer)
            nebulas.forEach(n => {
                n.update();
                n.draw();
            });

            // Draw Stars
            stars.forEach(s => {
                s.update();
                s.draw();
            });

            // Update Shooting Stars
            for (let i = shootingStars.length - 1; i >= 0; i--) {
                if (!shootingStars[i].update()) {
                    shootingStars.splice(i, 1);
                } else {
                    shootingStars[i].draw();
                }
            }

            if (Math.random() < 0.003 && shootingStars.length < 2) {
                shootingStars.push(new ShootingStar());
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current.x = e.clientX;
            mouseRef.current.y = e.clientY;
        };

        window.addEventListener('resize', setCanvasSize);
        window.addEventListener('mousemove', handleMouseMove);

        init();
        animate();

        return () => {
            window.removeEventListener('resize', setCanvasSize);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none z-[-1] bg-[#020202]">
            <canvas
                ref={canvasRef}
                className="w-full h-full"
            />
            {/* Cinematic Noise Layer */}
            <div className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

            {/* Edge Vignette */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.5)_100%)] pointer-events-none" />
        </div>
    );
}
