/* eslint-disable @typescript-eslint/no-explicit-any */
export const runtime = 'nodejs';

import { promises as fs } from 'fs';
import path from 'path';
import { PDFDocument, rgb } from 'pdf-lib';
import type { PDFFont } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import QRCode from 'qrcode';
import { generatePdfFile } from './generate-pdf-file';

type Payload = {
  name: string;
  code: string;
  number: string;
};

let CORINTHIA_BYTES: Uint8Array | null = null;
let QUESTRIAL_BYTES: Uint8Array | null = null;

async function ensureFontBytesLoaded() {
  if (!CORINTHIA_BYTES || !QUESTRIAL_BYTES) {
    const corinthiaPath = path.join(process.cwd(), 'public', 'fonts', 'Corinthia', 'Corinthia-Regular.ttf');
    const questrialPath = path.join(process.cwd(), 'public', 'fonts', 'Questrial', 'Questrial-Regular.ttf');
    const [c, q] = await Promise.all([fs.readFile(corinthiaPath), fs.readFile(questrialPath)]);
    CORINTHIA_BYTES = c;
    QUESTRIAL_BYTES = q;
  }
}

function drawCenteredTracked(opts: {
  page: any;
  text: string;
  y: number;
  font: PDFFont;
  size: number;
  color: any;
  letterSpacing?: number;
}) {
  const { page, text, y, font, size, color, letterSpacing = 0 } = opts;
  const chars = Array.from(text);
  const charsWidths = chars.map((ch) => font.widthOfTextAtSize(ch, size));
  const totalCharsWidth = charsWidths.reduce((a, b) => a + b, 0);
  const totalTracking = letterSpacing * Math.max(0, chars.length - 1);
  const totalWidth = totalCharsWidth + totalTracking;

  const { width } = page.getSize();
  let x = (width - totalWidth) / 2;

  chars.forEach((ch, i) => {
    const w = charsWidths[i];
    page.drawText(ch, { x, y, size, font, color });
    x += w + (i < chars.length - 1 ? letterSpacing : 0);
  });
}

export async function buildPdf({ name, code, number }: Payload): Promise<{
  bytes: Uint8Array;
  filePath: string;
  filename: string;
}> {
  try {
    if (!name || !code || !number) {
      throw new Error('Campos obrigatórios: name, code, number');
    }

    await ensureFontBytesLoaded();

    const pdf = await PDFDocument.create();
    pdf.registerFontkit(fontkit);

    const page = pdf.addPage([841.89, 450]);
    const { width, height } = page.getSize();

    const corinthia = await pdf.embedFont(CORINTHIA_BYTES!);
    const questrial = await pdf.embedFont(QUESTRIAL_BYTES!);
    const primary = rgb(0.729, 0.667, 0.62);
    const textColor = rgb(0.42, 0.36, 0.32);
    const subtle = rgb(0.55, 0.5, 0.47);

    drawCenteredTracked({
      page,
      text: 'CONVITE DIGITAL',
      y: height - 40,
      font: questrial,
      size: 16,
      color: primary,
      letterSpacing: 5.8,
    });

    const title = 'Ana & William';
    const titleSize = 72;
    const titleWidth = corinthia.widthOfTextAtSize(title, titleSize);
    page.drawText(title, {
      x: (width - titleWidth) / 2,
      y: height - 110,
      size: titleSize,
      font: corinthia,
      color: primary,
    });

    page.drawRectangle({
      x: width * 0.2,
      y: height - 125,
      width: width * 0.6,
      height: 1.6,
      color: primary,
    });

    const leftX = 50;
    let cursorY = height - 170;
    const headerSize = 14;

    const label = 'Convidado(a): ';
    const labelSize = headerSize;
    const nameSize = headerSize + 4;

    const labelWidth = questrial.widthOfTextAtSize(label, labelSize);

    page.drawText(label, {
      x: leftX,
      y: cursorY,
      size: labelSize,
      font: questrial,
      color: textColor,
    });

    const nameX = leftX + labelWidth + 6;
    const nameWidth = questrial.widthOfTextAtSize(name, nameSize);

    page.drawRectangle({
      x: nameX,
      y: cursorY - 3,
      width: nameWidth,
      height: 1.6,
      color: primary,
    });

    page.drawText(name, {
      x: nameX,
      y: cursorY,
      size: nameSize,
      font: questrial,
      color: primary,
    });

    cursorY -= 20;
    page.drawText(`Data e horário: 25 de outubro de 2025 às 19h`, {
      x: leftX,
      y: cursorY,
      size: headerSize,
      font: questrial,
      color: textColor,
    });
    cursorY -= 20;
    page.drawText(`Após a cerimônia iremos nos reunir para a festa no Sítio das Palmeiras às 20h30`, {
      x: leftX,
      y: cursorY,
      size: headerSize,
      font: questrial,
      color: textColor,
    });

    cursorY -= 28;
    const addressLabelSize = 12.5;
    page.drawText(`Cerimônia: Paróquia São Francisco de Assis`, {
      x: leftX,
      y: cursorY,
      size: addressLabelSize,
      font: questrial,
      color: subtle,
    });
    cursorY -= 18;
    page.drawText(`R. Luís de Moura, 129 - Cidade Nova Jacareí, Jacareí - SP, 12325-180`, {
      x: leftX,
      y: cursorY,
      size: addressLabelSize,
      font: questrial,
      color: subtle,
    });

    cursorY -= 22;
    page.drawText(`Festa e Recepção: Sítio das Palmeiras`, {
      x: leftX,
      y: cursorY,
      size: addressLabelSize,
      font: questrial,
      color: subtle,
    });
    cursorY -= 18;
    page.drawText(`Estr. São Sebastião, 2235 - Jacareí - SP, 12340-530`, {
      x: leftX,
      y: cursorY,
      size: addressLabelSize,
      font: questrial,
      color: subtle,
    });

    const payload = { code, number, ownerName: name };
    const dataUrl = await QRCode.toDataURL(JSON.stringify(payload), { margin: 1, scale: 8 });
    const pngBase64 = dataUrl.split(',')[1];
    const qrPng = await pdf.embedPng(Buffer.from(pngBase64, 'base64'));

    const qrSize = 200;
    const qrX = width - qrSize - 30;
    const qrY = height - qrSize - 150;
    page.drawImage(qrPng, { x: qrX, y: qrY, width: qrSize, height: qrSize });

    page.drawText(`Código: ${code}`, {
      x: qrX,
      y: qrY - 22,
      size: 8,
      font: questrial,
      color: textColor,
    });
    page.drawText(`Proprietário: ${name}`, {
      x: qrX,
      y: qrY - 38,
      size: 8,
      font: questrial,
      color: textColor,
    });

    page.drawText('Apresente este QR Code na recepção do evento.', {
      x: 50,
      y: 60,
      size: 10.5,
      font: questrial,
      color: subtle,
    });

    const pdfBytes = await pdf.save();
    const { bytes, filePath, filename } = await generatePdfFile(pdfBytes, name);

    return { bytes, filePath, filename };
  } catch (err) {
    console.error(err);
    throw err;
  }
}
