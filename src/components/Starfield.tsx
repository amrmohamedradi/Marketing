import { useEffect, useRef } from "react";

interface Star {
	x: number;
	y: number;
	z: number; // depth (0..1)
	size: number; // base radius in px
	twinkleSpeed: number; // radians per second for alpha oscillation
	twinklePhase: number; // initial phase offset
}

interface StarfieldProps {
	className?: string; // allow custom positioning (e.g., absolute inset-0)
	starCount?: number; // total stars to render
	maxStarSize?: number; // maximum base radius
	parallaxStrength?: number; // how much stars shift with mouse (0..1)
	speed?: number; // base speed factor for subtle drift
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const Starfield = ({
	className,
	starCount = 250,
	maxStarSize = 2.2,
	parallaxStrength = 0.08,
	speed = 0.03,
}: StarfieldProps) => {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const starsRef = useRef<Star[]>([]);
	const rafRef = useRef<number | null>(null);
	const mouseRef = useRef({ x: 0, y: 0 });
	const lastTsRef = useRef<number>(0);

	// Initialize stars
	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		const dpr = clamp(window.devicePixelRatio || 1, 1, 2);
		const resize = () => {
			const { clientWidth, clientHeight } = canvas.parentElement || canvas;
			canvas.width = Math.floor(clientWidth * dpr);
			canvas.height = Math.floor(clientHeight * dpr);
			canvas.style.width = `${clientWidth}px`;
			canvas.style.height = `${clientHeight}px`;
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		};
		resize();

		const makeStar = (): Star => {
			return {
				x: Math.random(),
				y: Math.random(),
				z: Math.random(),
				size: Math.random() * maxStarSize + 0.2,
				twinkleSpeed: 1 + Math.random() * 2,
				twinklePhase: Math.random() * Math.PI * 2,
			};
		};

		starsRef.current = Array.from({ length: starCount }, makeStar);

		const onMouseMove = (e: MouseEvent) => {
			const rect = canvas.getBoundingClientRect();
			const nx = (e.clientX - rect.left) / rect.width; // 0..1
			const ny = (e.clientY - rect.top) / rect.height; // 0..1
			mouseRef.current.x = clamp(nx, 0, 1);
			mouseRef.current.y = clamp(ny, 0, 1);
		};
		window.addEventListener("mousemove", onMouseMove);

		const onResize = () => resize();
		window.addEventListener("resize", onResize);

		const render = (ts: number) => {
			if (!ctx) return;
			const dt = lastTsRef.current ? (ts - lastTsRef.current) / 1000 : 0;
			lastTsRef.current = ts;

			const width = canvas.width / dpr;
			const height = canvas.height / dpr;

			ctx.clearRect(0, 0, width, height);

			const cx = width * 0.5;
			const cy = height * 0.5;

			// Mouse parallax offset (-0.5..0.5)
			const mx = (mouseRef.current.x - 0.5) * parallaxStrength;
			const my = (mouseRef.current.y - 0.5) * parallaxStrength;

			// Background subtle gradient (very faint)
			const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(width, height));
			grad.addColorStop(0, "rgba(255,255,255,0.03)");
			grad.addColorStop(1, "rgba(0,0,0,0)");
			ctx.fillStyle = grad;
			ctx.fillRect(0, 0, width, height);

			// Draw stars
			for (const star of starsRef.current) {
				// subtle drift by z (depth)
				star.x += (0.02 + star.z * 0.06) * speed * dt; // drift to right
				if (star.x > 1) star.x -= 1; // wrap around

				// World position with parallax
				const px = (star.x - mx * (0.5 + star.z)) * width;
				const py = (star.y - my * (0.5 + star.z)) * height;

				// Twinkle alpha oscillation (0.4..1)
				const alpha = 0.4 + 0.6 * Math.max(0, Math.sin(star.twinklePhase + ts * 0.001 * star.twinkleSpeed));
				ctx.globalAlpha = alpha * (0.6 + 0.4 * (1 - star.z)); // nearer stars a bit brighter

				// Star color (slightly bluish-white variance)
				const hue = 220 + Math.floor(star.z * 20); // 220..240
				ctx.fillStyle = `hsl(${hue} 100% ${85 - Math.floor(star.z * 15)}%)`;

				const r = star.size * (0.5 + 1.2 * (1 - star.z));
				ctx.beginPath();
				ctx.arc(px, py, r, 0, Math.PI * 2);
				ctx.fill();
			}

			ctx.globalAlpha = 1;
			rafRef.current = requestAnimationFrame(render);
		};

		rafRef.current = requestAnimationFrame(render);

		return () => {
			if (rafRef.current) cancelAnimationFrame(rafRef.current);
			window.removeEventListener("mousemove", onMouseMove);
			window.removeEventListener("resize", onResize);
		};
	}, [starCount, maxStarSize, parallaxStrength, speed]);

	return (
		<canvas
			ref={canvasRef}
			className={
				[
					"block w-full h-full",
					"[mask-image:radial-gradient(70%_70%_at_50%_50%,black,transparent)]", // subtle vignette
					className || "",
				].join(" ")
			}
		/>
	);
};

export default Starfield;
