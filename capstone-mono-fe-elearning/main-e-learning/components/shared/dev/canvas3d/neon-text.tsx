'use client'
import React, { useEffect, useRef, useMemo, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface NeonTextProps {
  text: string;
  fontSize?: number;
  color?: string;
  glowColor?: string;
  className?: string;
  maxStars?: number;
  starSize?: number;
  starSpeed?: number;
  randomStarColors?: boolean;
  fullScreen?: boolean;
  width?: number;
  height?: number;
}

const NeonText: React.FC<NeonTextProps> = ({
  text,
  fontSize = 60,
  color = '#fff',
  glowColor = '#00fff2',
  className,
  maxStars = 5000,
  starSize = 2,
  starSpeed = 0.3,
  randomStarColors = false,
  fullScreen = true,
  width = 300,
  height = 150,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const random = useCallback((min: number, max: number = min): number => {
    if (min > max) [min, max] = [max, min];
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }, []);

  const getStarColor = useCallback(() => {
    if (!randomStarColors) return '#00fff2'; // Default blue neon color
    const hue = random(0, 360);
    const saturation = random(50, 100);
    const lightness = random(70, 100);
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  }, [random, randomStarColors]);

  const Star = useMemo(() => {
    return class {
      x: number;
      y: number;
      z: number;
      color: string;
      alpha: number;

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.z = Math.random() * 2;
        this.color = getStarColor();
        this.alpha = random(2, 10) / 10;
      }

      update(speed: number) {
        this.z += speed;
        if (this.z > 1) {
          this.z = 0;
          if (randomStarColors) this.color = getStarColor();
        }
        const twinkle = random(10);
        if (twinkle === 1 && this.alpha > 0) this.alpha -= 0.05;
        else if (twinkle === 2 && this.alpha < 1) this.alpha += 0.05;
      }

      draw(ctx: CanvasRenderingContext2D) {
        const scale = (1 - this.z) * 2;
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.alpha * (1 - this.z);
        ctx.beginPath();
        ctx.arc(this.x, this.y, starSize * scale, 0, 2 * Math.PI);
        ctx.fill();
      }
    };
  }, [starSize, getStarColor, random, randomStarColors]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let canvasWidth = fullScreen ? window.innerWidth : width;
    let canvasHeight = fullScreen ? window.innerHeight : height;
    let animationFrameId: number;

    const setCanvasSize = () => {
      canvasWidth = fullScreen ? window.innerWidth : width;
      canvasHeight = fullScreen ? window.innerHeight : height;
      canvas.width = canvasWidth;
      canvas.height = canvasHeight;
    };

    const createTextPath = () => {
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      ctx.font = `bold ${fontSize}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = color;
      ctx.shadowColor = glowColor;
      ctx.shadowBlur = 10;
      ctx.fillText(text, canvasWidth / 2, canvasHeight / 2);
      return ctx.getImageData(0, 0, canvasWidth, canvasHeight);
    };

    const initStars = (textImageData: ImageData) => {
      const stars: InstanceType<typeof Star>[] = [];
      for (let x = 0; x < canvasWidth; x += 4) {
        for (let y = 0; y < canvasHeight; y += 4) {
          const i = (y * canvasWidth + x) * 4;
          if (textImageData.data[i + 3] > 128 && stars.length < maxStars) {
            stars.push(new Star(x, y));
          }
        }
      }
      return stars;
    };

    const gradient = ctx.createRadialGradient(canvasWidth / 2, canvasHeight / 2, 0, canvasWidth / 2, canvasHeight / 2, Math.max(canvasWidth, canvasHeight) / 2);
    gradient.addColorStop(0, 'rgba(16, 14, 23, 0.8)');
    gradient.addColorStop(1, 'rgba(16, 14, 23, 0.5)');

    let stars = initStars(createTextPath());

    const animate = () => {
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      ctx.globalCompositeOperation = 'lighter';
      stars.forEach(star => {
        star.update(starSpeed * 0.01);
        star.draw(ctx);
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      setCanvasSize();
      stars = initStars(createTextPath());
    };

    setCanvasSize();
    animate();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [text, fontSize, color, glowColor, maxStars, Star, starSpeed, randomStarColors, fullScreen, width, height]);

  return (
    <div className={cn('relative', fullScreen ? 'w-full h-full' : 'w-fit')}>
      <canvas
        ref={canvasRef}
        className={cn(
          fullScreen ? 'fixed top-0 left-0 w-full h-full' : 'w-full h-full',
          className
        )}
        style={{ zIndex: 10 }}
      />
    </div>
  );
};

export default React.memo(NeonText);
