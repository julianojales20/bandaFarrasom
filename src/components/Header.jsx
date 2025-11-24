import React from 'react'
import { motion } from 'framer-motion'

const containerVariant = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } }
}

const itemVariant = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
}

export default function Header() {
  return (
    <header>
      <div className="relative rounded-xl h-80 bg-cover bg-center flex items-center justify-center hero-banner" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1511379938547-c1f69419868d')` }}>
        <div className="absolute inset-0 bg-black/60" />
        <motion.div className="relative z-10 text-center container px-4 hero-banner-content" variants={containerVariant} initial="hidden" animate="show">
          <motion.h1 variants={itemVariant}>BANDA FARRASOM</motion.h1>
          <motion.p variants={itemVariant} style={{ fontSize: '1.3rem', color: '#fff' }}>Proposta Interativa de Show Profissional</motion.p>
        </motion.div>
      </div>
    </header>
  )
}
