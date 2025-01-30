"use client";

import {
  motion,
  // useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { Children, ReactNode, useRef } from "react";

export default function Parallax({ children }: { children: ReactNode }) {
  const target = useRef<HTMLDivElement>(null);
  const hero = Children.toArray(children)[0];
  const section = Children.toArray(children)[1];
  //if(Children.count(children)<2) return;

  // motion stuff
  const { scrollYProgress } = useScroll({ target });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "70%"]);
  // scale
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);
  const scale2 = useSpring(useTransform(scrollYProgress, [0, 1], [0.8, 1]));
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  // debug
  //useMotionValueEvent(scrollYProgress, 'change', (last) => {
  //console.log('Scroll', last);
  //});
  return (
    <motion.div ref={target}>
      <motion.div
        style={{
          y,
          scale,
          opacity,
        }}
      >
        {hero}
      </motion.div>
      <motion.div style={{ scale: scale2, y: -1 }}>{section}</motion.div>
    </motion.div>
  );
}
