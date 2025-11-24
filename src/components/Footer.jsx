import React from 'react'
import { motion } from 'framer-motion'

const footerVariant = { hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } } }

export default function Footer() {
  return (
    <motion.footer className="text-center mt-12 text-gray-400" variants={footerVariant} initial="hidden" animate="show">
      <p>© 2025 Banda Farrasom</p>
      <a className="text-yellow-400 hover:text-white" href="https://www.instagram.com/bandafarrasomoficial" target="_blank" rel="noreferrer">
        <i className="fa-brands fa-instagram mr-2"></i> @bandafarrasomoficial
      </a>
    </motion.footer>
  )
}
