import {motion} from 'framer-motion';
import {useEffect, useState} from 'react';

export default function Reveal({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div style={{opacity: 0}}>{children}</div>;
  }

  return (
    <motion.div
      initial={{opacity: 0, y: 40}}
      whileInView={{opacity: 1, y: 0}}
      viewport={{once: true, amount: 0.2}}
      transition={{duration: 0.8, ease: 'easeOut', delay}}
    >
      {children}
    </motion.div>
  );
}
