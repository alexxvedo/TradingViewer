// Performance optimization utilities for Trading Viewer Pro

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Debounce hook for performance optimization
 */
export function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const timeoutRef = useRef<NodeJS.Timeout>();

  return useCallback(
    ((...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    }) as T,
    [callback, delay]
  );
}

/**
 * Throttle hook for performance optimization
 */
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): T {
  const lastCallRef = useRef<number>(0);

  return useCallback(
    ((...args: Parameters<T>) => {
      const now = Date.now();

      if (now - lastCallRef.current >= delay) {
        lastCallRef.current = now;
        callback(...args);
      }
    }) as T,
    [callback, delay]
  );
}

/**
 * Intersection Observer hook for lazy loading
 */
export function useIntersectionObserver(
  elementRef: React.RefObject<Element>,
  options: IntersectionObserverInit = {}
) {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsIntersecting(entry.isIntersecting),
      options
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [elementRef, options]);

  return isIntersecting;
}

/**
 * Performance monitoring
 */
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number[]> = new Map();

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  startMeasure(name: string): void {
    performance.mark(`${name}-start`);
  }

  endMeasure(name: string): number {
    performance.mark(`${name}-end`);
    performance.measure(name, `${name}-start`, `${name}-end`);

    const measure = performance.getEntriesByName(name)[0];
    const duration = measure.duration;

    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }

    this.metrics.get(name)!.push(duration);

    // Keep only last 100 measurements
    const measurements = this.metrics.get(name)!;
    if (measurements.length > 100) {
      measurements.shift();
    }

    return duration;
  }

  getAverageTime(name: string): number {
    const measurements = this.metrics.get(name);
    if (!measurements || measurements.length === 0) return 0;

    return (
      measurements.reduce((sum, time) => sum + time, 0) / measurements.length
    );
  }

  getMetrics(): Record<string, { average: number; count: number }> {
    const result: Record<string, { average: number; count: number }> = {};

    this.metrics.forEach((measurements, name) => {
      result[name] = {
        average: this.getAverageTime(name),
        count: measurements.length,
      };
    });

    return result;
  }

  clearMetrics(): void {
    this.metrics.clear();
    performance.clearMarks();
    performance.clearMeasures();
  }
}

/**
 * Memory usage monitoring
 */
export function getMemoryUsage(): MemoryInfo | null {
  if ("memory" in performance) {
    return (performance as any).memory;
  }
  return null;
}

/**
 * FPS monitoring
 */
export function useFPSMonitor() {
  const [fps, setFps] = useState(0);
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());

  useEffect(() => {
    let animationId: number;

    const updateFPS = () => {
      frameCount.current++;
      const currentTime = performance.now();

      if (currentTime - lastTime.current >= 1000) {
        setFps(
          Math.round(
            (frameCount.current * 1000) / (currentTime - lastTime.current)
          )
        );
        frameCount.current = 0;
        lastTime.current = currentTime;
      }

      animationId = requestAnimationFrame(updateFPS);
    };

    animationId = requestAnimationFrame(updateFPS);

    return () => cancelAnimationFrame(animationId);
  }, []);

  return fps;
}

/**
 * Optimize images for better performance
 */
export function optimizeImage(
  src: string,
  width?: number,
  height?: number,
  quality: number = 85
): string {
  // In a real implementation, you might use a service like Cloudinary
  // For now, we'll just return the original src
  return src;
}

/**
 * Lazy load component wrapper
 */
export function withLazyLoading<T extends object>(
  Component: React.ComponentType<T>
): React.ComponentType<T> {
  return function LazyLoadedComponent(props: T) {
    const [isLoaded, setIsLoaded] = useState(false);
    const elementRef = useRef<HTMLDivElement>(null);
    const isIntersecting = useIntersectionObserver(elementRef, {
      threshold: 0.1,
      rootMargin: "50px",
    });

    useEffect(() => {
      if (isIntersecting && !isLoaded) {
        setIsLoaded(true);
      }
    }, [isIntersecting, isLoaded]);

    return (
      <div ref={elementRef}>
        {isLoaded ? (
          <Component {...props} />
        ) : (
          <div className="animate-pulse bg-muted h-32 rounded" />
        )}
      </div>
    );
  };
}
