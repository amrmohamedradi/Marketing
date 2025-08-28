import { useEffect, useRef } from "react";

interface Star {
	x: number;
	y: number;
	z: number; // depth (0..1)
	size: number; // base radius in px
	twinkleSpeed: number; // radians per second for alpha oscillation
	twinklePhase: number; // initial phase offset
}

interface ShootingStar {
	x: number; // current x position (0..1)
	y: number; // current y position (0..1)
	vx: number; // velocity in x direction
	vy: number; // velocity in y direction
	length: number; // length of the streak
	life: number; // remaining life (0..1)
	maxLife: number; // total life duration
}

interface Moon {
	x: number; // current x position (0..1)
	y: number; // current y position (0..1)
	radius: number; // radius in screen units
	phase: number; // for subtle light/dark side effect
	speedX: number; // horizontal drift speed
	speedY: number; // vertical drift speed
}

interface Dot3D {
	x: number;
	y: number;
	z: number;
	size: number;
	color: string;
}

interface DottedShape {
	dots: Dot3D[];
	rotation: { x: number; y: number; z: number };
	position: { x: number; y: number; z: number };
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

	const shootingStarsRef = useRef<ShootingStar[]>([]);
	const moonRef = useRef<Moon | null>(null);

	const dottedShapesRef = useRef<DottedShape[]>([]);

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

		const makeShootingStar = (): ShootingStar => {
			const startSide = Math.random(); // 0: top, 0.25: right, 0.5: bottom, 0.75: left
			let x, y, vx, vy;
			const speedFactor = 0.5 + Math.random(); // Varied speeds

			if (startSide < 0.25) { // From top
				x = Math.random();
				y = 0;
				vx = (Math.random() - 0.5) * 0.5 * speedFactor;
				vy = (0.5 + Math.random() * 0.5) * speedFactor;
			} else if (startSide < 0.5) { // From right
				x = 1;
				y = Math.random();
				vx = -(0.5 + Math.random() * 0.5) * speedFactor;
				vy = (Math.random() - 0.5) * 0.5 * speedFactor;
			} else if (startSide < 0.75) { // From bottom
				x = Math.random();
				y = 1;
				vx = (Math.random() - 0.5) * 0.5 * speedFactor;
				vy = -(0.5 + Math.random() * 0.5) * speedFactor;
			} else { // From left
				x = 0;
				y = Math.random();
				vx = (0.5 + Math.random() * 0.5) * speedFactor;
				vy = (Math.random() - 0.5) * 0.5 * speedFactor;
			}

			const maxLife = 1 + Math.random() * 2; // 1 to 3 seconds

			return {
				x,
				y,
				vx,
				vy,
				length: 0.02 + Math.random() * 0.03, // 2% to 5% of screen width
				life: maxLife,
				maxLife,
			};
		};

		shootingStarsRef.current = Array.from({ length: 3 }, makeShootingStar);

		const makeMoon = (): Moon => ({
			x: Math.random() * 0.8 + 0.1, // Start somewhere in the middle 80%
			y: Math.random() * 0.8 + 0.1,
			radius: 20 + Math.random() * 30, // 20-50px radius
			phase: Math.random() * Math.PI * 2,
			speedX: (Math.random() - 0.5) * 0.005, // very slow drift
			speedY: (Math.random() - 0.5) * 0.005,
		});
		moonRef.current = makeMoon();

		const makeDottedCube = (): DottedShape => {
			const size = 0.1;
			const dots: Dot3D[] = [];
			// Vertices of a cube
			for (let x = -1; x <= 1; x += 2) {
				for (let y = -1; y <= 1; y += 2) {
					for (let z = -1; z <= 1; z += 2) {
						dots.push({
							x: x * size,
							y: y * size,
							z: z * size,
							size: 1.5 + Math.random() * 0.5,
							color: `rgba(255, 255, 255, ${0.5 + Math.random() * 0.5})`,
						});
					}
				}
			}

			// Add some dots along edges for density
			const addEdgeDots = (x1: number, y1: number, z1: number, x2: number, y2: number, z2: number) => {
				for (let i = 1; i < 5; i++) {
					const f = i / 5;
					dots.push({
						x: (x1 + (x2 - x1) * f) * size,
						y: (y1 + (y2 - y1) * f) * size,
						z: (z1 + (z2 - z1) * f) * size,
						size: 1 + Math.random() * 0.5,
						color: `rgba(255, 255, 255, ${0.3 + Math.random() * 0.3})`,
					});
				}
			};

			// Edges of the cube
			addEdgeDots(-1, -1, -1, 1, -1, -1);
			addEdgeDots(-1, 1, -1, 1, 1, -1);
			addEdgeDots(-1, -1, 1, 1, -1, 1);
			addEdgeDots(-1, 1, 1, 1, 1, 1);

			addEdgeDots(-1, -1, -1, -1, 1, -1);
			addEdgeDots(1, -1, -1, 1, 1, -1);
			addEdgeDots(-1, -1, 1, -1, 1, 1);
			addEdgeDots(1, -1, 1, 1, 1, 1);

			addEdgeDots(-1, -1, -1, -1, -1, 1);
			addEdgeDots(1, -1, -1, 1, -1, 1);
			addEdgeDots(-1, 1, -1, -1, 1, 1);
			addEdgeDots(1, 1, -1, 1, 1, 1);

			return {
				dots,
				rotation: { x: Math.random() * Math.PI * 2, y: Math.random() * Math.PI * 2, z: Math.random() * Math.PI * 2 },
				position: { x: Math.random() * 0.6 - 0.3, y: Math.random() * 0.6 - 0.3, z: -2 + Math.random() * -3 }, // -2 to -5 units away
			};
		};

		dottedShapesRef.current = [makeDottedCube()]; // Start with one cube

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

			// Draw shooting stars
			for (const star of shootingStarsRef.current) {
				star.x += star.vx * dt * 0.1; // scale velocity for smoother movement
				star.y += star.vy * dt * 0.1;
				star.life -= dt;

				if (star.life <= 0) {
					Object.assign(star, makeShootingStar()); // reset shooting star
					continue;
				}

				const headX = star.x * width;
				const headY = star.y * height;
				const tailX = (star.x - star.vx * star.length) * width;
				const tailY = (star.y - star.vy * star.length) * height;

				const alpha = clamp(star.life / star.maxLife, 0, 1);
				ctx.globalAlpha = alpha;
				ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
				ctx.lineWidth = 1.5;
				ctx.beginPath();
				ctx.moveTo(tailX, tailY);
				ctx.lineTo(headX, headY);
				ctx.stroke();
			}

			// Draw moon
			if (moonRef.current) {
				const moon = moonRef.current;

				// Update moon position
				moon.x += moon.speedX * dt;
				moon.y += moon.speedY * dt;
				// Wrap around if moon goes off screen
				if (moon.x < -0.1) moon.x = 1.1;
				if (moon.x > 1.1) moon.x = -0.1;
				if (moon.y < -0.1) moon.y = 1.1;
				if (moon.y > 1.1) moon.y = -0.1;

				const moonPx = moon.x * width;
				const moonPy = moon.y * height;
				const moonRadius = moon.radius;

				const moonGrad = ctx.createRadialGradient(moonPx, moonPy, moonRadius * 0.7, moonPx, moonPy, moonRadius);
				moonGrad.addColorStop(0, "rgba(200, 200, 220, 0.7)");
				moonGrad.addColorStop(1, "rgba(150, 150, 170, 0.5)");

				ctx.globalAlpha = 1;
				ctx.fillStyle = moonGrad;
				ctx.beginPath();
				ctx.arc(moonPx, moonPy, moonRadius, 0, Math.PI * 2);
				ctx.fill();
			}

			// Draw 3D dotted shapes
			for (const shape of dottedShapesRef.current) {
				shape.rotation.x += 0.05 * dt;
				shape.rotation.y += 0.03 * dt;

				const sinX = Math.sin(shape.rotation.x);
				const cosX = Math.cos(shape.rotation.x);
				const sinY = Math.sin(shape.rotation.y);
				const cosY = Math.cos(shape.rotation.y);
				const sinZ = Math.sin(shape.rotation.z);
				const cosZ = Math.cos(shape.rotation.z);

				for (const dot of shape.dots) {
					// Apply rotation (ZXY order)
					const x1 = dot.x;
					const y1 = dot.y;
					const z1 = dot.z;

					// Rotate around Z
					const x2 = x1 * cosZ - y1 * sinZ;
					const y2 = x1 * sinZ + y1 * cosZ;
					const z2 = z1;

					// Rotate around X
					const x3 = x2;
					const y3 = y2 * cosX - z2 * sinX;
					const z3 = y2 * sinX + z2 * cosX;

					// Rotate around Y
					const x4 = x3 * cosY + z3 * sinY;
					const y4 = y3;
					const z4 = -x3 * sinY + z3 * cosY;

					// Add shape's position and simulate perspective
					const fov = width * 0.8; // Field of view
					const viewZ = shape.position.z;
					const perspective = fov / (viewZ + z4);

					const sx = (x4 * perspective + shape.position.x) * width + cx;
					const sy = (y4 * perspective + shape.position.y) * height + cy;

					if (perspective > 0) { // Only draw if in front of camera
						ctx.globalAlpha = clamp(dot.size / 2, 0.1, 0.8) * clamp(perspective, 0.1, 1);
						ctx.fillStyle = dot.color;
						ctx.beginPath();
						ctx.arc(sx, sy, dot.size * perspective, 0, Math.PI * 2);
						ctx.fill();
					}
				}
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
