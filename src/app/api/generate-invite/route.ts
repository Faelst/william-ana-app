/* eslint-disable @typescript-eslint/no-explicit-any */
import { buildPdf } from "../../../services/build-pdf";

export async function POST(req: Request) {
  try {
    const { name, code, number } = await req.json();
    
    if (!name || !code || !number) {
      return new Response(JSON.stringify({ error: 'Campos obrigatórios: name, code, number' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const pdfBytes = await buildPdf({
      name: String(name),
      code: String(code),
      number: String(number),
    });

    return new Response(pdfBytes as any, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename=convite_${code}.pdf`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: 'Falha ao gerar PDF' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
