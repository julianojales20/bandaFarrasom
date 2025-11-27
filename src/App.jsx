import React, { useState } from 'react'
import Header from './components/Header'
import Packages from './components/Packages'
import Tools from './components/Tools'
import Footer from './components/Footer'
import { motion } from 'framer-motion'

const detailsList = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } }
}

const detailsItem = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
}

const initialPackages = [
  {
    id: "banda-bronze",
    name: "Bronze",
    value: 4000,
    desc: "Show sem estrutura",
    icon: "fa-microphone-slash",
  },
  {
    id: "banda-prata",
    name: "Prata",
    value: 6000,
    desc: "Show com estrutura básica",
    icon: "fa-microphone",
  },
  {
    id: "banda-ouro",
    name: "Ouro ★",
    value: 8000,
    desc: "Pacote completo com LED",
    icon: "fa-volume-high",
  },
  {
    id: "acustico-bronze",
    name: "Bronze",
    value: 2000,
    desc: "Show simples",
    icon: "fa-guitar",
  },
  {
    id: "acustico-prata",
    name: "Prata",
    value: 4000,
    desc: "Show com som simples",
    icon: "fa-music",
  },
  {
    id: "acustico-ouro",
    name: "Ouro",
    value: 6000,
    desc: "Estrutura completa",
    icon: "fa-lightbulb",
  },
];

export default function App() {
  const [selected, setSelected] = useState({ id: null, name: 'Nenhum', value: 0, desc: '' })
  const [scriptResult, setScriptResult] = useState('')
  const [emailResult, setEmailResult] = useState('')
  const [eventType, setEventType] = useState('Casamento')
  const [contractType, setContractType] = useState('Particular')

  function selectPackage(p) {
    setSelected(p)
    setScriptResult('')
    setEmailResult('')
  }

  function generateScript() {
    if (!selected.id) return
    setScriptResult(`Roteiro para ${eventType} com o pacote ${selected.name}:\n\n- Abertura com hits\n- Interação com público\n- Encerramento\n\n(Valor: R$ ${selected.value.toLocaleString('pt-BR')})`)
  }

  function generateEmail() {
    if (!selected.id) return
    setEmailResult(`Olá,\n\nSegue proposta para ${selected.name} (${selected.desc}).\nValor: R$ ${selected.value.toLocaleString('pt-BR')}.\n+\n\nAtenciosamente, Banda Farrasom`)
  }

  return (
    <div className="container">
      <Header />

      <Packages packages={initialPackages} selectedId={selected.id} onSelect={selectPackage} />

      <Tools
        selected={selected}
        eventType={eventType}
        setEventType={setEventType}
        contractType={contractType}
        setContractType={setContractType}
        generateScript={generateScript}
        scriptResult={scriptResult}
        generateEmail={generateEmail}
        emailResult={emailResult}
      />

      <motion.section id="detalhes" className="mt-12" variants={detailsList} initial="hidden" animate="show">
        <h2 className="text-white text-2xl font-bold"><i className="fa-solid fa-scale-balanced text-yellow-400 mr-2"></i>Detalhes e Condições de Contratação</h2>

        <motion.div className="detalhes-grid" variants={detailsList}>
          <motion.article className="detalhe-card" variants={detailsItem}>
            <div className="card-accent" />
            <div className="card-content">
              <h3><i className="fa-solid fa-money-check-dollar" style={{ color: 'var(--accent-gold)', marginRight: '8px' }}></i> Valores e Pagamento</h3>
              <p className="descricao">Eventos particulares (casamentos, aniversários, festas privadas):</p>
              <ul>
                <li>💰 Pagamento parcelado até a data do evento.</li>
                <li>🤝 Condições combinadas diretamente no fechamento.</li>
              </ul>

              <p className="descricao" style={{ marginTop: '20px' }}>Prefeituras e órgãos públicos:</p>
              <ul>
                <li>🧾 Pagamento mediante nota fiscal.</li>
                <li>⏳ Conforme normas e prazos do órgão contratante.</li>
              </ul>
            </div>
          </motion.article>

          <motion.article className="detalhe-card" variants={detailsItem}>
            <div className="card-accent" />
            <div className="card-content">
              <h3><i className="fa-solid fa-file-signature" style={{ color: 'var(--accent-gold)', marginRight: '8px' }}></i> Contrato e Hora Extra</h3>
              <p className="text-gray-300 mt-3">Um contrato formal será elaborado para garantir segurança e clareza entre as partes, contendo todos os termos acordados.</p>

              <div className="hora-extra" style={{ marginTop: '20px' }}>
                <p><strong style={{ color: 'var(--accent-gold)', marginRight: '8px' }}>⏰ Hora Extra:</strong></p>
                <p className="valor-hora">Adicional de <span>R$ 1.000,00</span> por +1 hora</p>
              </div>

              <div className="estrutura" style={{ marginTop: '20px' }}>
                <p style={{ fontWeight: 700 }}><i className="fa-solid fa-lightbulb" style={{ color: 'var(--accent-gold)', marginRight: '8px' }}></i>Estrutura:</p>
                <p>Quando contratado com som e iluminação, toda a estrutura permanece disponível do início ao fim do evento, sem custo adicional de montagem ou desmontagem.</p>
              </div>
            </div>
          </motion.article>
        </motion.div>
      </motion.section>

      <Footer />
    </div>
  )
}
