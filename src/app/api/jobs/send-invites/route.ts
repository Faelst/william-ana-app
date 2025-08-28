import { NextResponse } from 'next/server';
import { buildPdf } from '@/services/build-pdf';
import { randomUUID } from 'crypto';
import axios from 'axios';
import { buildConfirmationMessage } from '../../../../services/build-confirmation-message';
import { toBRCompactPhone } from '../../../../services/to-br-compact-phone';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasourceUrl: process.env.TURSO_DATABASE_URL,
});

export const POST = async (req: Request) => {
  const evolutionSendMediaPath = `/message/sendMedia/${process.env.EVOLUTION_INTERFACE}`;
  const evolutionApi = axios.create({
    baseURL: process.env.EVOLUTION_BASE_URL,
    headers: {
      apikey: process.env.EVOLUTION_API_KEY,
    },
    timeout: 5000,
  });

  const data = (await req.json()) as {
    id: number;
    name: string;
    phone: string;
    email?: string;
    adultNameEscorts?: string[];
    childNameEscorts?: string[];
  };
  const adultNames = data?.adultNameEscorts?.map((name) => name) ?? [];
  const childNames = data?.childNameEscorts?.map((name) => name) ?? [];

  for (const name of [...adultNames, ...childNames]) {
    const code = randomUUID();
    const { filename, base64 } = await buildPdf({ name, code, number: data.phone });

    await prisma.inviteCode.create({
      data: {
        code,
        name,
        used: false,
      },
    });

    await evolutionApi.post(evolutionSendMediaPath, {
      number: toBRCompactPhone(data.phone),
      mediatype: 'document',
      media: base64,
      fileName: filename.toLowerCase(),
    });
  }

  await prisma.guestConfirmation.updateMany({
    where: {
      guestId: data.id,
    },
    data: {
      inviteSent: true,
    },
  });

  const code = randomUUID();
  const { filename, base64 } = await buildPdf({ name: data.name, code, number: data.phone });
  const caption = buildConfirmationMessage({
    salutationName: data.name.split(' ')[0],
    names: [data.name, ...adultNames, ...childNames],
  });

  await prisma.inviteCode.create({
    data: {
      code,
      name: data.name,
      used: false,
    },
  });

  await evolutionApi.post(evolutionSendMediaPath, {
    number: toBRCompactPhone(data.phone),
    mediatype: 'document',
    media: base64,
    caption,
    fileName: filename.toLowerCase(),
  });

  await prisma.guest.updateMany({
    where: {
      id: data.id,
    },
    data: {
      inviteSent: true,
    },
  });

  return NextResponse.json({ ok: true });
};
