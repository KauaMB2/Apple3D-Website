import * as THREE from "three";

interface Animation {
  transform: string;
  duration: number;
}

interface AnimatedProps {
  timeline: gsap.core.Timeline;
  rotationRef: React.MutableRefObject<THREE.Group<THREE.Object3DEventMap>>;
  rotationState: number;
  firstTarget: string;
  secondTarget: string;
  animationProps: Animation;
}

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