import React from 'react'
import { motion } from 'framer-motion'

export const TimelineAnimation = ({
  children,
  animationNum = 1,
  timelineRef,
  className = '',
  as: Component = 'div',
  ...props
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: animationNum * 0.1 }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}
