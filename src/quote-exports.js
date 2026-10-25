import { jsPDF } from 'jspdf';

const money = value => new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(+value || 0);
const safe = value => String(value ?? '').replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[character]));

function clientModuleSummary(quote, module) {
  const materials = quote.materialSnapshot || [];
  const carcass = materials.find(material => material.name === module.material);
  const doors = materials.find(material => material.name === (module.doorMaterial || module.material));
  const hardware = (module.selected || []).map(id => (quote.catalogSnapshot || []).find(item => item.id === id)?.name).filter(Boolean);
  return [
    `Carcass: ${[carcass?.name || module.material, carcass?.color, carcass?.type].filter(Boolean).join(' | ') || 'Not specified'}`,
    `Doors: ${[doors?.name || module.doorMaterial || module.material, module.doorFinish || doors?.color, doors?.type].filter(Boolean).join(' ') || 'Not specified'}`,
    module.drawerFinish ? `Drawer front: ${module.drawerFinish}` : '',
    hardware.length ? `Hardware: ${hardware.join(', ')}` : ''
  ].filter(Boolean).join(' | ');
}

export function downloadClientPdf(quote) {
  const document = new jsPDF({ unit: 'mm', format: 'a4' });
  const pageWidth = document.internal.pageSize.getWidth();
  const margin = 14;
  const contentWidth = pageWidth - margin * 2;
  let y = 18;
  const addText = (text, x = margin, size = 8, bold = false, width = contentWidth) => {
    document.setFont('helvetica', bold ? 'bold' : 'normal');
    document.setFontSize(size);
    const lines = document.splitTextToSize(String(text ?? ''), width);
    if (y + lines.length * 4.2 > 280) { document.addPage(); y = 18; }
    document.text(lines, x, y);
    y += lines.length * 4.2 + 1.4;
  };
  document.setFillColor(49, 54, 47);
  document.rect(0, 0, pageWidth, 4, 'F');
  document.setTextColor(39, 50, 61);
  document.setDrawColor(180, 151, 93);
  document.setLineWidth(1);
  document.line(margin, 12, margin + 12, 12);
  addText(quote.company || 'iQuote', margin, 16, true);
  document.setTextColor(105, 112, 116);
  addText('CUSTOM CABINETS & INTERIORS', margin, 7);
  document.setFontSize(8);
  document.text('BEAUTIFUL SPACES. BUILT WITH PURPOSE.', pageWidth - margin, 18, { align: 'right' });
  y += 4;
  document.setDrawColor(215, 215, 210);
  document.line(margin, y, pageWidth - margin, y);
  y += 7;
  addText('QUOTATION', margin, 19, true);
  const leftWidth = contentWidth * 0.48;
  const startInfo = y;
  addText('QUOTE NO.   ' + quote.number, margin, 8, true, leftWidth);
  addText('DATE   ' + quote.created, margin, 8, false, leftWidth);
  addText('VALID FOR   ' + (quote.validity || 30) + ' DAYS', margin, 8, false, leftWidth);
  addText('CLIENT   ' + quote.client, margin, 8, false, leftWidth);
  addText('LOCATION   ' + (quote.address || '?'), margin, 8, false, leftWidth);
  addText('PROJECT   ' + quote.project, margin, 8, true, leftWidth);
  if (quote.description) addText(quote.description, margin, 8, false, leftWidth);
  if (quote.projectDesignImage) { try { document.addImage(quote.projectDesignImage, 'JPEG', pageWidth - margin - 80, startInfo - 2, 80, 48); } catch {} }
  y = Math.max(y, startInfo + (quote.projectDesignImage ? 50 : 34)) + 3;
  document.setFillColor(241, 240, 236);
  document.rect(margin, y, contentWidth, 9, 'F');
  document.setTextColor(39, 50, 61);
  document.setFont('helvetica', 'bold');
  document.setFontSize(6.5);
  document.text('#', margin + 2, y + 6);
  document.text('MODULE / DESCRIPTION', margin + 10, y + 6);
  document.text('DIMENSIONS (H x W x D)', margin + 58, y + 6);
  document.text('MATERIAL & FINISH', margin + 96, y + 6);
  document.text('QTY', pageWidth - margin - 49, y + 6);
  document.text('UNIT', pageWidth - margin - 32, y + 6);
  document.text('TOTAL', pageWidth - margin - 2, y + 6, { align: 'right' });
  y += 12;
  (quote.modules || []).forEach((module, index) => {
    const lineTotal = module.lineTotal ?? (quote.total || 0) / Math.max(1, quote.modules.length);
    const columns = [
      document.splitTextToSize((module.module || module.name) + ' ? ' + (module.category || 'Cabinet'), 45),
      document.splitTextToSize(module.height + ' x ' + module.width + ' x ' + module.depth + ' mm', 34),
      document.splitTextToSize(clientModuleSummary(quote, module), 35)
    ];
    const height = Math.max(14, ...columns.map(lines => lines.length * 3.4 + 4));
    if (y + height > 273) { document.addPage(); y = 18; }
    document.setDrawColor(225, 225, 221);
    document.line(margin, y + height, pageWidth - margin, y + height);
    document.setFont('helvetica', 'normal');
    document.setFontSize(7);
    document.text(String(index + 1), margin + 2, y + 4);
    document.text(columns[0], margin + 10, y + 4);
    document.text(columns[1], margin + 58, y + 4);
    document.text(columns[2], margin + 96, y + 4);
    document.text(String(module.qty || 1), pageWidth - margin - 49, y + 4);
    document.text(money(module.unitPrice ?? lineTotal / Math.max(1, +module.qty || 1)), pageWidth - margin - 32, y + 4);
    document.text(money(lineTotal), pageWidth - margin - 2, y + 4, { align: 'right' });
    y += height + 2;
  });
  y += 5;
  const subtotal = quote.subtotal ?? quote.sell ?? quote.total ?? 0;
  const discount = subtotal * (+quote.discount || 0) / 100;
  const tax = (subtotal - discount) * (+quote.tax || 0) / 100;
  const summaryX = pageWidth * 0.56;
  const summaryWidth = pageWidth - margin - summaryX;
  const summary = (label, amount, bold = false) => {
    document.setFont('helvetica', bold ? 'bold' : 'normal');
    document.setFontSize(bold ? 9 : 8);
    document.text(label, summaryX, y);
    document.text(money(amount), pageWidth - margin - 2, y, { align: 'right' });
    y += bold ? 7 : 5;
  };
  summary('Subtotal', subtotal, true);
  if (+quote.discount) summary('Discount (' + quote.discount + '%)', -discount);
  if (+quote.tax) summary('Tax (' + quote.tax + '%)', tax);
  document.setFillColor(49, 54, 47);
  document.rect(summaryX - 3, y - 1, summaryWidth + 3, 13, 'F');
  document.setTextColor(255, 255, 255);
  document.setFont('helvetica', 'bold');
  document.setFontSize(10);
  document.text('GRAND TOTAL', summaryX, y + 7);
  document.text(money(quote.total), pageWidth - margin - 2, y + 7, { align: 'right' });
  y += 20;
  document.setTextColor(39, 50, 61);
  if (quote.terms) { addText('TERMS & CONDITIONS', margin, 9, true); addText(quote.terms, margin, 7); }
  if (y + 22 > 280) { document.addPage(); y = 20; }
  document.setDrawColor(160, 164, 164);
  const signatureWidth = contentWidth / 2 - 10;
  document.line(margin, y + 13, margin + signatureWidth, y + 13);
  document.line(margin + signatureWidth + 20, y + 13, pageWidth - margin, y + 13);
  addText('Client signature / date', margin, 7, false, signatureWidth);
  addText('Authorized representative', margin + signatureWidth + 20, 7, false, signatureWidth);
  document.save(quote.number + '-client-quotation.pdf');
}

export function downloadClientHtml(quote) {
  const paper = document.querySelector('.quote-paper');
  let styles = '';
  for (const sheet of Array.from(document.styleSheets)) {
    try { styles += Array.from(sheet.cssRules).map(rule => rule.cssText).join('\n'); } catch {}
  }
  const html = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>' + safe(quote.number) + ' - ' + safe(quote.project) + '</title><style>' + styles + 'body{background:#fff!important}.quote-paper{box-shadow:none!important;max-width:1200px;margin:0 auto}@media print{body{background:#fff!important}.quote-paper{padding:0!important}}</style></head><body>' + (paper ? paper.outerHTML : '<main><h1>' + safe(quote.project) + '</h1><p>' + safe(quote.number) + ' ? ' + safe(quote.client) + '</p><p>Total: ' + money(quote.total) + '</p></main>') + '</body></html>';
  const link = document.createElement('a');
  link.href = URL.createObjectURL(new Blob([html], { type: 'text/html' }));
  link.download = quote.number + '-client-quotation.html';
  link.click();
  URL.revokeObjectURL(link.href);
}

export function downloadProductionPdf(quote) {
  const document = new jsPDF({ unit: 'mm', format: 'a4' });
  let y = 18;
  const addText = text => {
    document.setFontSize(9);
    const lines = document.splitTextToSize(String(text ?? ''), 180);
    if (y + lines.length * 5 > 280) { document.addPage(); y = 18; }
    document.text(lines, 15, y);
    y += lines.length * 5 + 1;
  };
  document.setFont('helvetica', 'bold');
  document.setFontSize(17);
  document.text(`Production Cutting List · ${quote.number}`, 15, y);
  y += 9;
  addText(`${quote.project} · ${quote.client} · ${quote.created}`);
  addText('Module | Part | Material | Length × Width × Thickness (mm) | Qty');
  for (const part of quote.parts || []) addText(`${part.module} | ${part.name} | ${part.material || 'Board'} | ${part.length} × ${part.width} × ${part.thickness} | ${part.quantity}`);
  y += 5;
  addText(`Net panel area: ${(+quote.area || 0).toFixed(2)} m²`);
  for (const group of quote.nesting || []) addText(`${group.material} · ${group.thickness} mm · ${group.sheets} sheet(s)`);
  addText('Internal production document — not for client distribution.');
  document.save(`${quote.number}-production-cutting-list.pdf`);
}
