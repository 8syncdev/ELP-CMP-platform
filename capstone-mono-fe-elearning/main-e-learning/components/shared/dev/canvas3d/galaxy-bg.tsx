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

  return useMemo(() => {
    return class Star {
      orbitRadius: number;
      radius: number;
      orbitX: number;
      orbitY: number;
      timePassed: number;
      speed: number;
      alpha: number;

      constructor(w: number, h: number) {
        this.orbitRadius = random(maxOrbit(w, h));
        this.radius = random(starSizeMin, Math.min(starSizeMax, this.orbitRadius)) / 8;
        this.orbitX = w / 2;
        this.orbitY = h / 2;
        this.timePassed = random(0, maxStars);
        this.speed = random(this.orbitRadius) / starSpeedFactor;
        this.alpha = random(2, 10) / 10;
      }

      draw(ctx: CanvasRenderingContext2D, canvas2: HTMLCanvasElement) {
        const x = Math.sin(this.timePassed) * this.orbitRadius + this.orbitX;
        const y = Math.cos(this.timePassed) * this.orbitRadius + this.orbitY;
        const twinkle = random(10);

        if (twinkle === 1 && this.alpha > 0) {
          this.alpha -= 0.05;
        } else if (twinkle === 2 && this.alpha < 1) {
          this.alpha += 0.05;
        }

        ctx.globalAlpha = this.alpha;
        ctx.drawImage(canvas2, x - this.radius / 2, y - this.radius / 2, this.radius, this.radius);
        this.timePassed += this.speed;
      }
    };
  }, [maxStars, starSizeMin, starSizeMax, starSpeedFactor, random, maxOrbit]);
};

// Component GalaxyBackground
const GalaxyBackground: React.FC<GalaxyParams> = ({
  maxStars = 1300,
  hue = 217,
  starSizeMin = 60,
  starSizeMax = 100,
  starSpeedFactor = 100000,
  fadeAlpha = 0.5,
  className,
  zIndex = -1
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const snowCanvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  const Star = useStar(maxStars, starSizeMin, starSizeMax, starSpeedFactor);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;

    const stars: InstanceType<typeof Star>[] = [];

    // Tạo canvas phụ để vẽ ngôi sao
    const canvas2 = document.createElement('canvas');
    const ctx2 = canvas2.getContext('2d');
    if (!ctx2) return;

    canvas2.width = 100;
    canvas2.height = 100;

    const half = canvas2.width / 2;
    const gradient2 = ctx2.createRadialGradient(half, half, 0, half, half, half);
    gradient2.addColorStop(0.025, '#CCC');
    gradient2.addColorStop(0.1, `hsl(${hue}, 61%, 33%)`);
    gradient2.addColorStop(0.25, `hsl(${hue}, 64%, 6%)`);
    gradient2.addColorStop(1, 'transparent');

    ctx2.fillStyle = gradient2;
    ctx2.beginPath();
    ctx2.arc(half, half, half, 0, Math.PI * 2);
    ctx2.fill();

    // Tạo các ngôi sao
    for (let i = 0; i < maxStars; i++) {
      stars.push(new Star(w, h));
    }

    // Hàm animation chính
    const animation = () => {
      ctx.globalCompositeOperation = 'source-over';
      ctx.globalAlpha = fadeAlpha;
      ctx.fillStyle = `hsla(${hue}, 64%, 6%, 2)`;
      ctx.fillRect(0, 0, w, h);

      ctx.globalCompositeOperation = 'lighter';
      stars.forEach(star => star.draw(ctx, canvas2));

      animationRef.current = requestAnimationFrame(animation);
    };

    animation();

    // Xử lý sự kiện thay đổi kích thước màn hình
    const handleResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      stars.length = 0;
      for (let i = 0; i < maxStars; i++) {
        stars.push(new Star(w, h));
      }
    };

    // Hàm debounce để tối ưu hóa sự kiện resize
    const debounce = (func: Function, wait: number) => {
      let timeout: NodeJS.Timeout;
      return function executedFunction(...args: any[]) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
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
    <div>
      <canvas ref={canvasRef} className={cn('fixed w-full h-full', className)} style={{ zIndex }} />
      <canvas ref={snowCanvasRef} className={cn('fixed w-full h-full', className)} style={{ zIndex }} />
      <div className="am-g fixed bottom-0">
        <div className="am-u-sm-12">
          <div style={{ zIndex: 9999 }} id="player" className="aplayer" />
        </div>
      </div>
    </div>
  );
};

export default GalaxyBackground;
