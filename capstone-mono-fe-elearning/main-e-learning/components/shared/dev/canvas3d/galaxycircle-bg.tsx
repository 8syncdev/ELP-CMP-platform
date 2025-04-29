'use client'
import { useEffect, useRef, useMemo, useCallback } from 'react';
import { cn } from '@/lib/utils';

// Định nghĩa các tham số cho hiệu ứng galaxy
interface GalaxyParams {
  maxStars?: number;        // Số lượng sao tối đa
  hue?: number;             // Màu sắc chủ đạo (trong hệ màu HSL)
  starSizeMin?: number;     // Kích thước tối thiểu của sao
  starSizeMax?: number;     // Kích thước tối đa của sao
  starSpeedFactor?: number; // Hệ số tốc độ di chuyển của sao
  fadeAlpha?: number;       // Độ trong suốt của hiệu ứng fade
  className?: string;       // CSS class
  zIndex?: number;          // Z-index của canvas
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
    if (min > max) {
      const hold = max;
      max = min;
      min = hold;
    }
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }, []);

  const maxOrbit = useCallback((x: number, y: number): number => {
    const max = Math.max(x, y);
    const diameter = Math.round(Math.sqrt(max * max + max * max));
    return diameter / 2;
  }, []);

  const getStarColor = useCallback(() => {
    const hue = random(0, 360);
    const saturation = random(50, 100);
    const lightness = random(70, 100);
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
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

      constructor(w: number, h: number) {
        this.orbitRadius = random(maxOrbit(w, h));
        this.radius = random(starSizeMin, Math.min(starSizeMax, this.orbitRadius)) / 8;
        this.orbitX = w / 2;
        this.orbitY = h / 2;
        this.timePassed = random(0, maxStars);
        this.speed = random(this.orbitRadius) / starSpeedFactor;
        this.alpha = random(2, 10) / 10;
        this.color = getStarColor();
      }

      draw(ctx: CanvasRenderingContext2D) {
        const x = Math.sin(this.timePassed) * this.orbitRadius + this.orbitX;
        const y = Math.cos(this.timePassed) * this.orbitRadius + this.orbitY;
        const twinkle = random(10);

        if (twinkle === 1 && this.alpha > 0) {
          this.alpha -= 0.05;
        } else if (twinkle === 2 && this.alpha < 1) {
          this.alpha += 0.05;
        }

        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(x, y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        this.timePassed += this.speed;
      }
    };
  }, [maxStars, starSizeMin, starSizeMax, starSpeedFactor, random, maxOrbit, getStarColor]);
};

// Component GalaxyBackground
const GalaxyBackground: React.FC<GalaxyParams> = ({
  maxStars = 1300,
  hue = 217,
  starSizeMin = 1,
  starSizeMax = 3,
  starSpeedFactor = 100000,
  fadeAlpha = 0.05,
  className,
  zIndex = -1,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  const Star = useStar(maxStars, starSizeMin, starSizeMax, starSpeedFactor);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;

    const stars: InstanceType<typeof Star>[] = [];

    // Tạo các ngôi sao
    for (let i = 0; i < maxStars; i++) {
      stars.push(new Star(w, h));
    }

    // Tạo off-screen canvas để vẽ background
    const offScreenCanvas = document.createElement('canvas');
    offScreenCanvas.width = w;
    offScreenCanvas.height = h;
    const offScreenCtx = offScreenCanvas.getContext('2d', { alpha: false });
    if (!offScreenCtx) return;

    offScreenCtx.fillStyle = `hsla(${hue}, 64%, 6%, 1)`;
    offScreenCtx.fillRect(0, 0, w, h);

    // Hàm animation chính
    const animation = () => {
      ctx.drawImage(offScreenCanvas, 0, 0);
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < stars.length; i++) {
        stars[i].draw(ctx);
      }
      ctx.globalCompositeOperation = 'source-over';

      animationRef.current = requestAnimationFrame(animation);
    };

    animation();

    // Xử lý sự kiện thay đổi kích thước màn hình
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
  }, [maxStars, hue, starSizeMin, starSizeMax, starSpeedFactor, fadeAlpha, Star]);

  return (
    <canvas ref={canvasRef} className={cn('fixed w-full h-full', className)} style={{ zIndex }} />
  );
};

// Hàm debounce để tối ưu hóa sự kiện resize
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

export default GalaxyBackground;
