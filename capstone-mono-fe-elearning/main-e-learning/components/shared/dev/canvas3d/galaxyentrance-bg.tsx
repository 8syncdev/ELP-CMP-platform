'use client'
import { useEffect, useRef, useMemo, useCallback, useState } from 'react';
import { cn } from '@/lib/utils';

interface GalaxyEntranceParams {
  maxStars?: number;
  hue?: number;
  starSizeMin?: number;
  starSizeMax?: number;
  starSpeedFactor?: number;
  fadeAlpha?: number;
  className?: string;
  zIndex?: number;
  entranceDuration?: number | 'loop';
}

const useStar = (
  maxStars: number,
  starSizeMin: number,
  starSizeMax: number,
  starSpeedFactor: number
) => {
  const random = useCallback((min: number, max?: number): number => {
    if (typeof max === 'undefined') {
      max = min;
      min = 0;
    }
    return Math.random() * (max - min) + min;
  }, []);

  const maxOrbit = useCallback((x: number, y: number): number => {
    const max = Math.max(x, y);
    return Math.sqrt(max * max + max * max) / 2;
  }, []);

  const getStarColor = useCallback(() => {
    const hue = random(0, 360);
    const saturation = random(50, 100);
    const lightness = random(70, 100);
    return `hsl(${hue | 0}, ${saturation | 0}%, ${lightness | 0}%)`;
  }, [random]);

  return useMemo(() => {
    return class Star {
      orbitRadius: number;
      radius: number;
      orbitX: number;
      orbitY: number;
      timePassed: number;
      speed: number;
      alpha: number;
      color: string;
      z: number;

      constructor(w: number, h: number) {
        this.orbitRadius = random(maxOrbit(w, h));
        this.radius = random(starSizeMin, Math.min(starSizeMax, this.orbitRadius)) / 8;
        this.orbitX = w / 2;
        this.orbitY = h / 2;
        this.timePassed = random(0, maxStars);
        this.speed = random(this.orbitRadius) / starSpeedFactor;
        this.alpha = random(0.2, 1);
        this.color = getStarColor();
        this.z = random(0, 1);
      }

      draw(ctx: CanvasRenderingContext2D, progress: number, isLoop: boolean) {
        const x = Math.sin(this.timePassed) * this.orbitRadius + this.orbitX;
        const y = Math.cos(this.timePassed) * this.orbitRadius + this.orbitY;

        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;

        // Adjust star size and position based on progress
        const scale = isLoop ? 1 : 1 + (this.z * progress * 10);
        const adjustedX = isLoop ? x : (x - this.orbitX) * scale + this.orbitX;
        const adjustedY = isLoop ? y : (y - this.orbitY) * scale + this.orbitY;
        const radius = this.radius * scale;

        ctx.beginPath();
        ctx.arc(adjustedX, adjustedY, radius, 0, Math.PI * 2);
        ctx.fill();

        this.timePassed += this.speed;
      }
    };
  }, [maxStars, starSizeMin, starSizeMax, starSpeedFactor, random, maxOrbit, getStarColor]);
};

const GalaxyEntranceBackground: React.FC<GalaxyEntranceParams> = ({
  maxStars = 1300,
  hue = 217,
  starSizeMin = 1,
  starSizeMax = 3,
  starSpeedFactor = 100000,
  fadeAlpha = 0.05,
  className,
  zIndex = -1,
  entranceDuration = 5000,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const Star = useStar(maxStars, starSizeMin, starSizeMax, starSpeedFactor);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;

    const stars = new Array(maxStars).fill(null).map(() => new Star(w, h));

    const offScreenCanvas = document.createElement('canvas');
    offScreenCanvas.width = w;
    offScreenCanvas.height = h;
    const offScreenCtx = offScreenCanvas.getContext('2d', { alpha: false });
    if (!offScreenCtx) return;

    offScreenCtx.fillStyle = `hsla(${hue}, 64%, 6%, 1)`;
    offScreenCtx.fillRect(0, 0, w, h);

    let startTime: number | null = null;

    const easeInOutCubic = (t: number): number => {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };

    const animation = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;

      const isLoop = entranceDuration === 'loop';
      const currentProgress = isLoop ? (elapsed % 5000) / 5000 : Math.min(elapsed / (entranceDuration as number), 1);

      const easedProgress = easeInOutCubic(currentProgress);
      setProgress(easedProgress);

      ctx.drawImage(offScreenCanvas, 0, 0);
      ctx.globalCompositeOperation = 'lighter';

      for (let i = 0; i < stars.length; i++) {
        stars[i].draw(ctx, easedProgress, isLoop);
      }

      ctx.globalCompositeOperation = 'source-over';

      if (!isLoop) {
        const radius = Math.sqrt(w * w + h * h) / 2;
        const gradient = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, radius);
        gradient.addColorStop(0, `rgba(255, 255, 255, ${easedProgress})`);
        gradient.addColorStop(1, `rgba(255, 255, 255, ${easedProgress * 0.5})`);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, w, h);

        if (currentProgress === 1) {
          setIsVisible(false);
        }
      }

      if (isLoop || currentProgress < 1) {
        animationRef.current = requestAnimationFrame(animation);
      }
    };

    animationRef.current = requestAnimationFrame(animation);

    const handleResize = () => {
      w = canvas.width = offScreenCanvas.width = window.innerWidth;
      h = canvas.height = offScreenCanvas.height = window.innerHeight;
      offScreenCtx.fillStyle = `hsla(${hue}, 64%, 6%, 1)`;
      offScreenCtx.fillRect(0, 0, w, h);
      stars.length = 0;
      for (let i = 0; i < maxStars; i++) {
        stars.push(new Star(w, h));
      }
    };

    const debouncedHandleResize = debounce(handleResize, 250);

    window.addEventListener('resize', debouncedHandleResize);

    return () => {
      window.removeEventListener('resize', debouncedHandleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [maxStars, hue, starSizeMin, starSizeMax, starSpeedFactor, fadeAlpha, Star, entranceDuration]);

  if (!isVisible) {
    return null;
  }

  return (
    <canvas ref={canvasRef} className={cn('fixed w-full h-full', className)} style={{ zIndex }} />
  );
};

function debounce(func: Function, wait: number) {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

export default GalaxyEntranceBackground;
