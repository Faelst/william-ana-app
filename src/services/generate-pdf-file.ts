import * as fs from 'fs/promises';
import path from 'path';
import { sanitizeForFilename } from './sanitize-for-filename';

export async function generatePdfFile(
  bytes: Uint8Array,
  name: string,
): Promise<{
  bytes: Uint8Array;
  filePath: string;
  filename: string;
}> {
  const invitesDir = path.join(process.cwd(), 'public', 'invites');
  await fs.mkdir(invitesDir, { recursive: true });

  const safeName = sanitizeForFilename(name);
  const filename = `convite_${safeName}.pdf`;
  const filePath = path.join(invitesDir, filename);

  await fs.writeFile(filePath, Buffer.from(bytes));

  return { bytes, filePath, filename };
}
