import {gsap} from 'gsap';
import {ScrollTrigger} from 'gsap/ScrollTrigger';

// Registrar plugins
gsap.registerPlugin(ScrollTrigger);

// Animación fade + slide up (entrada de productos)
export function fadeSlideUp(element: string | Element, delay = 0) {
  return gsap.fromTo(
    element,
    {opacity: 0, y: 40},
    {opacity: 1, y: 0, duration: 0.7, delay, ease: 'power3.out'},
  );
}

// Scroll parallax
export function parallax(element: string | Element, speed = 0.5) {
  return gsap.to(element, {
    yPercent: -20 * speed,
    ease: 'none',
    scrollTrigger: {
      trigger: element,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    },
  });
}

// Entrada en cascada (para grillas de productos)
export function staggerFadeIn(elements: string, staggerTime = 0.1) {
  return gsap.fromTo(
    elements,
    {opacity: 0, y: 30},
    {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: staggerTime,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: elements,
        start: 'top 85%',
      },
    },
  );
}

export {gsap, ScrollTrigger};
