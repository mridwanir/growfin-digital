import { useEffect, useRef, useState } from 'react';

/**
 * A hook that uses IntersectionObserver to detect when an element enters the viewport.
 * Useful for scroll-based "fade-in up" animations inside our smartphone mockup.
 * 
 * @param threshold - Number between 0 and 1 indicating the percentage of the element that should be visible before triggering.
 * @param delay - Optional delay (ms) before the element animates in.
 * @returns [ref, isVisible] to be attached to the target element.
 */
export function useScrollReveal(threshold: number = 0.1, delay: number = 0) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (delay > 0) {
              setTimeout(() => setIsVisible(true), delay);
            } else {
              setIsVisible(true);
            }
            // Once it becomes visible, we stop observing it so it doesn't fade out when scrolling up
            if (ref.current) {
              observer.unobserve(ref.current);
            }
          }
        });
      },
      {
        threshold,
        // Optional: rootMargin to trigger slightly before it enters the viewport
        rootMargin: '0px 0px -20px 0px' 
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [threshold, delay]);

  return { ref, isVisible };
}
