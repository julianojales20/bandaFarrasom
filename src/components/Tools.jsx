import React from 'react'
import { motion } from 'framer-motion'
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import emailjs from "@emailjs/browser";
import { useState } from "react";
import headerImg from "../assets/images/header.JPG";
import logoBanda from "../assets/images/logoBanda.PNG";

// Initialize EmailJS with the provided public key (per EmailJS docs)
try {
  emailjs.init("JsY6eMtso0PYVEQQE");
} catch (e) {
  // ignore init errors in non-browser environments
}

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
  const noPackage = !selected || !selected.id;
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showNeedPackageModal, setShowNeedPackageModal] = useState(false);
  const [needAction, setNeedAction] = useState(null);
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientCity, setClientCity] = useState("");
  const [clientMessage, setClientMessage] = useState("");
  const [sendingEmail, setSendingEmail] = useState(false);

  function openEmailModal() {
    setClientName("");
    setClientPhone("");
    setClientCity("");
    setClientMessage("");
    setShowEmailModal(true);
  }

  function closeEmailModal() {
    setShowEmailModal(false);
  }

  function buildProposalText() {
    const showType = selected.id.startsWith("banda-") ? "Show com banda" : "Show acústico";
    const obsLine = selected.obs ? `\nObs: ${selected.obs}` : "";
    const details = `Valores e Pagamento:\n- Eventos particulares: pagamento parcelado até a data do evento.\n- Prefeituras: pagamento mediante nota fiscal.`;
    const contract = `Contrato e Hora Extra:\n- Contrato formal será elaborado.\n- Hora extra: R$ 1.000,00 por +1 hora.`;
    return `BANDA FARRASOM - Proposta\n\n${showType}\nPacote: ${selected.name}\n${selected.desc}\nDuração: 2h30${obsLine}\n\nValor: R$ ${selected.value.toLocaleString(
      "pt-BR"
    )},00\n\n${details}\n\n${contract}\n\nEvento: ${eventType}\nTipo de contrato: ${contractType}`;
  }

  async function handleSendEmail(e) {
    e.preventDefault();
    if (!selected || !selected.id) {
      alert("Selecione um pacote antes de enviar o email.");
      return;
    }
    setSendingEmail(true);

    const proposalText = buildProposalText();
    const subject = `Proposta Banda Farrasom - ${selected.name}`;
    const body = `${proposalText}\n\nMensagem do cliente:\n${clientMessage}\n\nContato:\n${clientName} | ${clientPhone} | ${clientCity}`;

    // EmailJS configuration (service/template/public key provided)
    const serviceId = "service_wlupn47";
    const templateId = "template_ablhdho";

    try {
      if (serviceId && templateId) {
        const templateParams = {
          to_email: "martinsproducoesartisticas@outlook.com",
          from_name: clientName,
          phone: clientPhone,
          city: clientCity,
          message: clientMessage,
          subject,
          proposal: proposalText,
          reply_to: clientPhone,
        };
        // Use EmailJS send method per docs (public key already initialized)
        await emailjs.send(serviceId, templateId, templateParams);
        alert("Email enviado com sucesso para martinsproducoesartisticas@outlook.com");
        closeEmailModal();
      } else {
        // fallback to mailto
        const mailto = `mailto:martinsproducoesartisticas@outlook.com?subject=${encodeURIComponent(
          subject
        )}&body=${encodeURIComponent(body)}`;
        window.location.href = mailto;
        closeEmailModal();
      }
    } catch (err) {
      console.error("Erro ao enviar email", err);
      alert("Não foi possível enviar o e-mail. Tente novamente ou entre em contato por outro canal.");
    } finally {
      setSendingEmail(false);
    }
  }
  function escapeHtml(text) {
    if (!text) return "";
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }

  async function createPdf() {
    if (!selected || !selected.id) return;

    const showType = selected.id.startsWith("banda-") ? "Show com banda" : "Show acústico";
    const duration = "2h30";
    const descSafe = escapeHtml(selected.desc);
    const obsSafe = selected.obs ? escapeHtml(selected.obs) : "";
    const obsHtml = obsSafe
      ? `<p style="margin:8px 0 0;color:#555;font-size:14px;font-style:italic"><strong>Obs:</strong> ${obsSafe}</p>`
      : "";

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
        <header style="text-align:center;padding-bottom:18px;margin-bottom:20px">
          <div style="position:relative;border-radius:12px;overflow:hidden;height:400px;background-image:url('${headerImg}');background-position:top center;background-size:cover;">
            <div style="position:absolute;inset:0;background:rgba(0,0,0,0.6)"></div>
            <img src="${logoBanda}" alt="Banda Farrasom" style="position:relative;z-index:2;display:block;margin:20px auto 6px;height:300px;width:auto;object-fit:contain" />
            <p style="position:relative;z-index:2;color:#fff;margin:0;font-size:14px">Proposta Interativa de Show Profissional</p>
          </div>
        </header>

        <section style="margin-top:18px;padding:18px;border-radius:8px;border:1px solid #f1f1f1;background:#fff;box-shadow:0 6px 18px rgba(0,0,0,0.04)">
          <h2 style="font-size:20px;margin:0 0 12px 0;color:#111">Pacote Selecionado</h2>
          <div style="display:flex;justify-content:space-between;align-items:flex-start;padding-top:8px;gap:24px;flex-wrap:wrap">
            <div style="flex:1;min-width:260px">
              <p style="margin:0;color:#666;font-size:13px;text-transform:uppercase;letter-spacing:0.5px">${showType}</p>
              <strong style="font-size:18px;color:#111">Pacote ${escapeHtml(selected.name)}</strong>
              <p style="margin:8px 0 0;color:#444">${descSafe}</p>
              <p style="margin:6px 0 0;color:#555;font-size:14px"><strong>Duração:</strong> ${duration}</p>
              ${obsHtml}
              <p style="margin:12px 0 0;color:#666;font-size:14px"><strong>Evento:</strong> ${escapeHtml(eventType)}</p>
            </div>
            <div style="text-align:right;flex-shrink:0">
              <span style="font-size:22px;font-weight:800;color:#111">R$ ${selected.value.toLocaleString(
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

          <div style="margin-top:12px;text-align:center">
            <div style="height:60px;border-bottom:1px solid #333;width:320px;margin:0 auto"></div>
            <div style="margin-top:6px;font-weight:700;text-align:center">CONTRATANTE</div>
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
      alert("Não foi possível gerar o PDF. Tente novamente.");
    } finally {
      if (wrapper.parentNode) document.body.removeChild(wrapper);
    }
  }

  // helper to call both generateScript (existing) and createPdf
  function handleGenerateScript() {
    if (!selected || !selected.id) {
      setNeedAction("pdf");
      setShowNeedPackageModal(true);
      return;
    }
    generateScript();
    // wait briefly to ensure UI updates, then generate pdf
    setTimeout(() => {
      createPdf();
    }, 300);
  }

  function handleOpenEmail() {
    if (!selected || !selected.id) {
      setNeedAction("email");
      setShowNeedPackageModal(true);
      return;
    }
    openEmailModal();
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
        <span style={{ color: "var(--accent-gold)" }}>
          {selected && selected.name
            ? selected.name
            : "Nenhum pacote selecionado"}
        </span>
      </p>

      {noPackage && (
        <div className="mt-3 p-2 rounded text-red-200 bg-red-900/20">
          Selecione o pacote antes de gerar a proposta.
        </div>
      )}

      <div className="mt-4">
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

        <h3 className="text-white font-semibold">
          <i className="fa-solid fa-timeline mr-2"></i>Gerar Roteiro PDF
        </h3>

        <button
          id="generate-script-btn"
          className="llm-button"
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
        <button
          id="draft-email-btn"
          className="llm-button"
          onClick={handleOpenEmail}
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
        {showEmailModal && (
          <div role="dialog" aria-modal="true" aria-labelledby="email-modal-title" style={{ position: "fixed", inset: 0, zIndex: 60 }}>
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(0,0,0,0.45)",
              }}
              onClick={closeEmailModal}
              aria-hidden="true"
            />
            <div
              className="email-modal"
              style={{
                position: "relative",
                maxWidth: 720,
                margin: "6vh auto",
                background: "#fff",
                borderRadius: 12,
                padding: 20,
                boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
              }}
            >
              <h3 id="email-modal-title" style={{ margin: 0, marginBottom: 8, color: "#111" }}>
                Enviar Proposta por E-mail
              </h3>
              <p style={{ marginTop: 0, marginBottom: 12, color: "#444" }}>
                Preencha os dados abaixo para enviar a proposta para{" "}
                <strong>martinsproducoesartisticas@outlook.com</strong>
              </p>
              <form onSubmit={handleSendEmail}>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 10,
                  }}
                >
                  <input
                    required
                    placeholder="Nome"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    style={{
                      padding: 10,
                      borderRadius: 6,
                      border: "1px solid #ddd",
                    }}
                  />
                  <input
                    required
                    placeholder="Telefone"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    style={{
                      padding: 10,
                      borderRadius: 6,
                      border: "1px solid #ddd",
                    }}
                  />
                  <input
                    placeholder="Cidade"
                    value={clientCity}
                    onChange={(e) => setClientCity(e.target.value)}
                    style={{
                      padding: 10,
                      borderRadius: 6,
                      border: "1px solid #ddd",
                    }}
                  />
                  <input
                    placeholder="Assunto (opcional)"
                    value={`Proposta - ${selected.name}`}
                    readOnly
                    style={{
                      padding: 10,
                      borderRadius: 6,
                      border: "1px solid #ddd",
                      background: "#f7f7f7",
                    }}
                  />
                </div>
                <textarea
                  placeholder="Mensagem"
                  value={clientMessage}
                  onChange={(e) => setClientMessage(e.target.value)}
                  rows={6}
                  style={{
                    width: "100%",
                    marginTop: 10,
                    padding: 10,
                    borderRadius: 6,
                    border: "1px solid #ddd",
                  }}
                />

                <div
                  style={{
                    display: "flex",
                    gap: 10,
                    justifyContent: "flex-end",
                    marginTop: 12,
                  }}
                >
                  <button
                    type="button"
                    onClick={closeEmailModal}
                    style={{
                      padding: "8px 14px",
                      borderRadius: 8,
                      border: "1px solid #ccc",
                      background: "#fff",
                    }}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={sendingEmail}
                    style={{
                      padding: "8px 14px",
                      borderRadius: 8,
                      background: "#FFC72C",
                      border: "none",
                      fontWeight: 700,
                    }}
                  >
                    {sendingEmail ? "Enviando..." : "Enviar E-mail"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {showNeedPackageModal && (
          <div role="alertdialog" aria-modal="true" aria-labelledby="need-package-title" style={{ position: "fixed", inset: 0, zIndex: 70 }}>
            <div
              style={{
                position: "absolute",
                inset: 0,
                background: "rgba(0,0,0,0.6)",
              }}
              onClick={() => setShowNeedPackageModal(false)}
              aria-hidden="true"
            />
            <div
              style={{
                position: "relative",
                maxWidth: 560,
                margin: "12vh auto",
                background: "#111",
                color: "#fff",
                borderRadius: 10,
                padding: 20,
                boxShadow: "0 24px 80px rgba(0,0,0,0.8)",
                textAlign: "center",
              }}
            >
              <h3 id="need-package-title" style={{ margin: 0, marginBottom: 8 }}>
                Selecione um pacote
              </h3>
              <p style={{ color: "#ddd", marginBottom: 16 }}>
                Você precisa selecionar um pacote antes de{" "}
                {needAction === "email" ? "gerar o e-mail" : "gerar o roteiro"}.
              </p>
              <div
                style={{ display: "flex", gap: 10, justifyContent: "center" }}
              >
                <button
                  onClick={() => {
                    setShowNeedPackageModal(false);
                    // scroll to packages grid if present
                    const el = document.querySelector(".packages-grid");
                    if (el)
                      el.scrollIntoView({
                        behavior: "smooth",
                        block: "center",
                      });
                  }}
                  style={{
                    padding: "8px 14px",
                    borderRadius: 8,
                    background: "#FFC72C",
                    border: "none",
                    fontWeight: 700,
                  }}
                >
                  Ir para pacotes
                </button>
                <button
                  onClick={() => setShowNeedPackageModal(false)}
                  style={{
                    padding: "8px 14px",
                    borderRadius: 8,
                    background: "#333",
                    border: "1px solid #555",
                    color: "#fff",
                  }}
                >
                  Fechar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.section>
  );
}
