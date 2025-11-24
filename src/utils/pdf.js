import jsPDF from 'jspdf'

function addWrappedText(pdf, text, x, y, maxWidth, lineHeight, options = {}) {
  const lines = pdf.splitTextToSize(String(text), maxWidth)
  lines.forEach((line, i) => {
    pdf.text(line, x, y + i * lineHeight, options)
  })
  return lines.length * lineHeight
}

export async function generateProposalPdf(data, options = {}) {
  const { selected, eventType, contractType, logoDataUrl } = data
  const pdf = new jsPDF({ unit: 'pt', format: 'a4' })
  const pageWidth = pdf.internal.pageSize.getWidth()
  const pageHeight = pdf.internal.pageSize.getHeight()
  const margin = 40
  const contentWidth = pageWidth - margin * 2
  let cursorY = margin

  // Header
  if (logoDataUrl) {
    try {
      pdf.addImage(logoDataUrl, 'PNG', margin, cursorY, 80, 40)
    } catch (e) {
      // ignore logo errors
    }
  }

  pdf.setFontSize(22)
  pdf.setFont(undefined, 'bold')
  const titleX = margin + (logoDataUrl ? 100 : 0)
  pdf.text('BANDA FARRASOM', titleX, cursorY + 18)
  cursorY += 40

  pdf.setDrawColor(220)
  pdf.setLineWidth(0.5)
  pdf.line(margin, cursorY, pageWidth - margin, cursorY)
  cursorY += 18

  // Selected package block
  pdf.setFontSize(14)
  pdf.setFont(undefined, 'normal')
  pdf.text('Pacote Selecionado', margin, cursorY)
  cursorY += 12

  pdf.setFontSize(12)
  pdf.setFont(undefined, 'bold')
  pdf.text(selected.name || 'Nenhum', margin, cursorY)
  pdf.setFont(undefined, 'normal')
  const descHeight = pdf.splitTextToSize(selected.desc || '', contentWidth * 0.6)
  const descLines = pdf.splitTextToSize(selected.desc || '', contentWidth * 0.6)
  const descH = descLines.length * 14
  addWrappedText(pdf, selected.desc || '', margin, cursorY + 18, contentWidth * 0.6, 14)
  // price on right
  const priceStr = `R$ ${Number(selected.value || 0).toLocaleString('pt-BR')},00`
  pdf.setFont(undefined, 'bold')
  pdf.text(priceStr, pageWidth - margin - pdf.getTextWidth(priceStr), cursorY)
  pdf.setFont(undefined, 'normal')
  cursorY += Math.max(48, descH + 24)

  // Details two-column layout
  const colGap = 16
  const colWidth = (contentWidth - colGap) / 2

  // Left card: Valores e Pagamento
  pdf.setFillColor(250,250,250)
  pdf.roundedRect(margin, cursorY, colWidth, 140, 6, 6, 'FD')
  let innerY = cursorY + 18
  pdf.setFontSize(12)
  pdf.setFont(undefined, 'bold')
  pdf.text('Valores e Pagamento', margin + 10, innerY)
  innerY += 14
  pdf.setFont(undefined, 'normal')
  innerY += addWrappedText(pdf, 'Eventos particulares (casamentos, aniversários, festas privadas):', margin + 10, innerY, colWidth - 20, 12)
  innerY += 6
  innerY += addWrappedText(pdf, '• Pagamento parcelado até a data do evento.\n• Condições combinadas diretamente no fechamento.', margin + 10, innerY, colWidth - 20, 12)
  innerY += 8
  innerY += addWrappedText(pdf, 'Prefeituras e órgãos públicos:\n• Pagamento mediante nota fiscal.\n• Conforme normas e prazos do órgão contratante.', margin + 10, innerY, colWidth - 20, 12)

  // Right card: Contrato e Hora Extra
  const rightX = margin + colWidth + colGap
  pdf.roundedRect(rightX, cursorY, colWidth, 140, 6, 6, 'FD')
  innerY = cursorY + 18
  pdf.setFont(undefined, 'bold')
  pdf.text('Contrato e Hora Extra', rightX + 10, innerY)
  innerY += 14
  pdf.setFont(undefined, 'normal')
  innerY += addWrappedText(pdf, 'Um contrato formal será elaborado para garantir segurança e clareza entre as partes, contendo todos os termos acordados.', rightX + 10, innerY, colWidth - 20, 12)
  innerY += 8
  pdf.setFont(undefined, 'bold')
  pdf.text('Hora Extra:', rightX + 10, innerY)
  pdf.setFont(undefined, 'normal')
  pdf.text('Adicional de R$ 1.000,00 por +1 hora', rightX + 70, innerY)
  innerY += 18
  pdf.setFont(undefined, 'bold')
  pdf.text('Estrutura:', rightX + 10, innerY)
  pdf.setFont(undefined, 'normal')
  addWrappedText(pdf, 'Quando contratado com som e iluminação, toda a estrutura permanece disponível do início ao fim do evento.', rightX + 10, innerY + 12, colWidth - 20, 12)

  cursorY += 160

  // Footer: date and signature
  pdf.setLineWidth(0.3)
  pdf.setDrawColor(200)
  pdf.line(margin, cursorY + 60, margin + 320, cursorY + 60)
  pdf.setFont(undefined, 'normal')
  pdf.text('CONTRATANTE', margin, cursorY + 78)

  pdf.text(`Data: ${new Date().toLocaleDateString('pt-BR')}`, pageWidth - margin - 120, cursorY + 78)

  // Save
  const fileName = options.fileName || `Proposta_BandaFarrasom_${new Date().toISOString().slice(0,10)}.pdf`
  pdf.save(fileName)
}

export default generateProposalPdf
