import React from 'react'
import { motion } from 'framer-motion'
import generateProposalPdf from '../utils/pdf'

const container = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } } }

export default function Tools({ selected, eventType, setEventType, contractType, setContractType, generateScript, scriptResult, generateEmail, emailResult }) {

  async function createPdf() {
    if (!selected || !selected.id) return
    // prepare data
    const pdfData = {
      selected,
      eventType,
      contractType,
      logoDataUrl: null
    }
    await generateProposalPdf(pdfData)
  }

  // helper to call both generateScript (existing) and createPdf
  function handleGenerateScript() {
    generateScript()
    // wait briefly to ensure UI updates, then generate pdf
    setTimeout(() => { createPdf() }, 300)
  }

  return (
    <motion.section className="llm-tools-area" variants={container} initial="hidden" animate="show">
      <h2><i className="fa-solid fa-wand-magic-sparkles"></i> Ferramentas Interativas</h2>
      <p id="selected-package-display">Pacote Selecionado: <span style={{ color: 'var(--accent-gold)' }}>{selected.name}</span></p>

      <div className="mt-4">
        <h3 className="text-white font-semibold"><i className="fa-solid fa-timeline mr-2"></i>Gerar Roteiro</h3>
        <select className="bg-[#111] border border-[#333] text-white p-2 rounded mt-2 w-full" value={eventType} onChange={e => setEventType(e.target.value)} id="event-type-script">
          <option>Casamento</option>
          <option>Aniversário Privado</option>
          <option>Festa Corporativa</option>
          <option>Praça Pública</option>
        </select>
        <div style={{ display: 'flex', gap: 12, flexDirection: 'column' }}>
          <button id="generate-script-btn" className="llm-button" disabled={!selected.id} onClick={handleGenerateScript}>Gerar Roteiro</button>
          <button id="download-pdf-btn" className="llm-button" disabled={!selected.id} onClick={() => createPdf()} style={{ background: '#ffffff', color: '#111', border: '1px solid rgba(0,0,0,0.06)' }}>Baixar Proposta (PDF)</button>
        </div>
        {scriptResult && <div id="script-result" className="api-result" style={{ display: 'block', marginTop: '1rem' }}>{scriptResult}</div>}
      </div>

      <div className="mt-6">
        <h3 className="text-white font-semibold"><i className="fa-solid fa-envelope mr-2"></i> Gerar E-mail de Proposta</h3>
        <select className="bg-[#111] border border-[#333] text-white p-2 rounded mt-2 w-full" value={contractType} onChange={e => setContractType(e.target.value)} id="contract-type">
          <option>Particular</option>
          <option>Prefeitura</option>
          <option>Produtor de Eventos</option>
        </select>
        <button id="draft-email-btn" className="llm-button" disabled={!selected.id} onClick={generateEmail}>Gerar E-mail</button>
        {emailResult && <div id="email-result" className="api-result" style={{ display: 'block', marginTop: '1rem' }}>{emailResult}</div>}
      </div>
    </motion.section>
  )
}
