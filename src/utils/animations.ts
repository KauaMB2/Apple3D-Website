import * as THREE from "three";
import gsap from "gsap";

import { ScrollTrigger } from "gsap/all";
gsap.registerPlugin(ScrollTrigger)



interface AnimatedProps {
  timeline: gsap.core.Timeline;
  rotationRef: React.MutableRefObject<THREE.Group<THREE.Object3DEventMap>>;
  rotationState: number;
  firstTarget: string;
  secondTarget: string;
  animationProps: gsap.TweenVars;
}

interface AnimateWithGsapProps {
  target:string
  animationProps: gsap.TweenVars
  scrollProps?: any
}


export const animateWithGsap = ({
  target,
  animationProps,
  scrollProps,
}: AnimateWithGsapProps) => {
  gsap.to(target, {
    ...animationProps,
    scrollTrigger: {
      trigger: target,
      toggleActions: "restart none none none",
      start: 'top 85%',
      ...scrollProps,
    },
  });
};

export const animateWidthGsapTimeline = ({
  timeline,
  rotationRef,
  rotationState,
  firstTarget,
  secondTarget,
  animationProps
}: AnimatedProps) => {
    timeline.to(rotationRef.current.rotation, {
        y: rotationState,
        duration: 1,
        ease: 'power2.inOut'
      })
    
      timeline.to(
        firstTarget,
        {
          ...animationProps,
          ease: 'power2.inOut'
        },
        '<'
      )
    
      timeline.to(
        secondTarget,
        {
          ...animationProps,
          ease: 'power2.inOut'
        },
        '<'
      )
}