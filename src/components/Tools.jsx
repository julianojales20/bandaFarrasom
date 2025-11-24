import React from 'react'
import { motion } from 'framer-motion'
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const container = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function Tools({
  selected,
  eventType,
  setEventType,
  contractType,
  setContractType,
  generateScript,
  scriptResult,
  generateEmail,
  emailResult,
}) {
  async function createPdf() {
    if (!selected || !selected.id) return;

    // Build a light-themed HTML template offscreen
    const wrapper = document.createElement("div");
    wrapper.style.position = "fixed";
    wrapper.style.left = "-9999px";
    wrapper.style.top = "0";
    wrapper.style.width = "1200px";
    wrapper.style.padding = "40px";
    wrapper.style.background = "#ffffff";
    wrapper.style.color = "#111";
    wrapper.style.fontFamily = "Urbanist, Arial, sans-serif";
    wrapper.style.lineHeight = "1.4";
    wrapper.innerHTML = `
      <div style="max-width:1000px;margin:0 auto;border:0">
        <header style="text-align:center;padding-bottom:18px;border-bottom:1px solid #eee;margin-bottom:20px">
          <h1 style="font-size:36px;margin:0;color:#111">BANDA FARRASOM</h1>
          <div style="height:6px;width:160px;margin:10px auto;background:linear-gradient(90deg,#FFC72C,#FFD700);"></div>
          <p style="margin:0;color:#333">Proposta Interativa de Show Profissional</p>
        </header>

        <section style="margin-top:18px;padding:18px;border-radius:8px;border:1px solid #f1f1f1;background:#fff;box-shadow:0 6px 18px rgba(0,0,0,0.04)">
          <h2 style="font-size:20px;margin:0 0 8px 0;color:#111">Pacote Selecionado</h2>
          <div style="display:flex;justify-content:space-between;align-items:center;padding-top:8px">
            <div>
              <strong style="font-size:18px">${selected.name}</strong>
              <p style="margin:6px 0 0;color:#444">${selected.desc}</p>
            </div>
            <div style="text-align:right">
              <span style="font-size:20px;font-weight:800;color:#111">R$ ${selected.value.toLocaleString(
                "pt-BR"
              )},00</span>
            </div>
          </div>
        </section>

        <section style="display:flex;gap:20px;margin-top:22px;flex-wrap:wrap">
          <div style="flex:1;min-width:300px;padding:18px;border-radius:8px;border:1px solid #f1f1f1;background:#fff;box-shadow:0 6px 18px rgba(0,0,0,0.03)">
            <h3 style="margin:0 0 8px 0;color:#111">Valores e Pagamento</h3>
            <p style="color:#444;margin:6px 0">Eventos particulares (casamentos, aniversários, festas privadas):</p>
            <ul style="margin:8px 0 0 18px;color:#444">
              <li>Pagamento parcelado até a data do evento.</li>
              <li>Condições combinadas diretamente no fechamento.</li>
            </ul>
            <p style="color:#444;margin-top:12px">Prefeituras e órgãos públicos:</p>
            <ul style="margin:8px 0 0 18px;color:#444">
              <li>Pagamento mediante nota fiscal.</li>
              <li>Conforme normas e prazos do órgão contratante.</li>
            </ul>
          </div>

          <div style="flex:1;min-width:300px;padding:18px;border-radius:8px;border:1px solid #f1f1f1;background:#fff;box-shadow:0 6px 18px rgba(0,0,0,0.03)">
            <h3 style="margin:0 0 8px 0;color:#111">Contrato e Hora Extra</h3>
            <p style="color:#444;margin:6px 0">Um contrato formal será elaborado para garantir segurança e clareza entre as partes, contendo todos os termos acordados.</p>
            <p style="margin-top:12px;color:#444"><strong>Hora Extra:</strong> Adicional de R$ 1.000,00 por +1 hora</p>
            <p style="margin-top:12px;color:#444"><strong>Estrutura:</strong> Quando contratado com som e iluminação, toda a estrutura permanece disponível do início ao fim do evento.</p>
          </div>
        </section>

        <footer style="margin-top:26px;border-top:1px dashed #eee;padding-top:18px;color:#444;display:flex;flex-direction:column;gap:18px">
          <div style="display:flex;justify-content:space-between;align-items:center">
            <small>Data: ${new Date().toLocaleDateString("pt-BR")}</small>
            <small>Proposta gerada por Banda Farrasom</small>
          </div>

          <div style="margin-top:12px">
            <div style="height:60px;border-bottom:1px solid #333;width:320px"></div>
            <div style="margin-top:6px;font-weight:700">CONTRATANTE</div>
          </div>
        </footer>
      </div>
    `;

    document.body.appendChild(wrapper);

    try {
      const canvas = await html2canvas(wrapper, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ unit: "pt", format: "a4" });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      // fit image to page width, maintain aspect
      const img = new Image();
      img.src = imgData;
      await new Promise((resolve) => {
        img.onload = resolve;
      });
      const imgProps = { width: img.width, height: img.height };
      const ratio = imgProps.width / pageWidth;
      const imgHeightOnPage = imgProps.height / ratio;

      pdf.setFillColor(255, 255, 255);
      pdf.rect(0, 0, pageWidth, pageHeight, "F");
      pdf.addImage(imgData, "PNG", 0, 20, pageWidth, imgHeightOnPage);
      const fileName = `Proposta_BandaFarrasom_${new Date()
        .toISOString()
        .slice(0, 10)}.pdf`;
      pdf.save(fileName);
    } catch (err) {
      console.error("PDF generation failed", err);
      alert("Erro ao gerar PDF. Veja o console para detalhes.");
    } finally {
      document.body.removeChild(wrapper);
    }
  }

  // helper to call both generateScript (existing) and createPdf
  function handleGenerateScript() {
    generateScript();
    // wait briefly to ensure UI updates, then generate pdf
    setTimeout(() => {
      createPdf();
    }, 300);
  }

  return (
    <motion.section
      className="llm-tools-area"
      variants={container}
      initial="hidden"
      animate="show"
    >
      <h2>
        <i className="fa-solid fa-wand-magic-sparkles"></i> Ferramentas
        Interativas
      </h2>
      <p id="selected-package-display">
        Pacote Selecionado:{" "}
        <span style={{ color: "var(--accent-gold)" }}>{selected.name}</span>
      </p>

      <div className="mt-4">
        <h3 className="text-white font-semibold">
          <i className="fa-solid fa-timeline mr-2"></i>Gerar Roteiro
        </h3>
        <select
          className="bg-[#111] border border-[#333] text-white p-2 rounded mt-2 w-full"
          value={eventType}
          onChange={(e) => setEventType(e.target.value)}
          id="event-type-script"
        >
          <option>Casamento</option>
          <option>Aniversário Privado</option>
          <option>Festa Corporativa</option>
          <option>Praça Pública</option>
        </select>
        <button
          id="generate-script-btn"
          className="llm-button"
          disabled={!selected.id}
          onClick={handleGenerateScript}
        >
          Gerar Roteiro
        </button>
        {scriptResult && (
          <div
            id="script-result"
            className="api-result"
            style={{ display: "block", marginTop: "1rem" }}
          >
            {scriptResult}
          </div>
        )}
      </div>

      <div className="mt-6">
        <h3 className="text-white font-semibold">
          <i className="fa-solid fa-envelope mr-2"></i> Gerar E-mail de Proposta
        </h3>
        <select
          className="bg-[#111] border border-[#333] text-white p-2 rounded mt-2 w-full"
          value={contractType}
          onChange={(e) => setContractType(e.target.value)}
          id="contract-type"
        >
          <option>Particular</option>
          <option>Prefeitura</option>
          <option>Produtor de Eventos</option>
        </select>
        <button
          id="draft-email-btn"
          className="llm-button"
          disabled={!selected.id}
          onClick={generateEmail}
        >
          Gerar E-mail
        </button>
        {emailResult && (
          <div
            id="email-result"
            className="api-result"
            style={{ display: "block", marginTop: "1rem" }}
          >
            {emailResult}
          </div>
        )}
      </div>
    </motion.section>
  );
}
