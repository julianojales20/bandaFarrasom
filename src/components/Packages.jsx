import React from 'react'
import { motion } from 'framer-motion'

function PackageCard({ p, selectedId, onSelect }) {
  const cardVariant = {
    hidden: { opacity: 0, y: 18, scale: 0.995 },
    show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } }
  }
  return (
    <motion.div data-id={p.id} variants={cardVariant} className={`package-card bg-[#151515] rounded-lg p-6 transition transform hover:-translate-y-2 hover:scale-[1.02] ${selectedId === p.id ? 'selected' : ''}`}>
      <h3><i className={`fa-solid ${p.icon} mr-2`}></i> {p.name}</h3>
      <ul className="mt-3 list-none text-gray-300 space-y-1">
        <li>{p.desc}</li>
        <li>Duração: 2h30</li>
      </ul>
      <p className="price">R$ {p.value.toLocaleString('pt-BR')},00</p>
      <button className="llm-button" onClick={() => onSelect(p)}>Selecionar</button>
    </motion.div>
  )
}

export default function Packages({ packages, selectedId, onSelect }) {
  const listVariant = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08 } }
  }
  return (
    <section id="pacotes" className="mt-10">
      <h2><i className="fa-solid fa-music"></i> SHOW COM BANDA (2h30)</h2>

      <motion.div className="packages-grid" variants={listVariant} initial="hidden" animate="show">
        {packages.slice(0, 3).map(p => (
          <PackageCard key={p.id} p={p} selectedId={selectedId} onSelect={onSelect} />
        ))}
      </motion.div>

      <h2 style={{ marginTop: '3rem' }}><i className="fa-solid fa-guitar"></i> SHOW ACÚSTICO (2h30)</h2>

      <motion.div className="packages-grid" variants={listVariant} initial="hidden" animate="show">
        {packages.slice(3).map(p => (
          <PackageCard key={p.id} p={p} selectedId={selectedId} onSelect={onSelect} />
        ))}
      </motion.div>
    </section>
  )
}
