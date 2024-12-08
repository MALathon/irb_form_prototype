import { Box } from '@mui/material';
import { motion, useScroll, useSpring } from 'framer-motion';

const ScrollIndicator = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <Box sx={{ position: 'fixed', top: 0, left: 0, right: 0, height: 3, zIndex: 1100 }}>
      <motion.div
        style={{
          transformOrigin: '0%',
          scaleX,
          height: '100%',
          backgroundColor: 'primary.main'
        }}
      />
    </Box>
  );
};

export default ScrollIndicator; 