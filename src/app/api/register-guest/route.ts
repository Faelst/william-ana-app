import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { Client } from '@upstash/qstash';

const prisma = new PrismaClient({
  datasourceUrl: process.env.TURSO_DATABASE_URL,
});

const qstash = new Client({ token: process.env.QSTASH_TOKEN! });

export async function POST(request: Request) {
  const body = await request.json();
  const { name, email, phone, goToWedding, goToParty, observations, adultNameEscorts, childNameEscorts } = body;

  if (!name || goToWedding === undefined || goToParty === undefined) {
    return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 });
  }

  try {
    const guest = await prisma.guest.create({
      data: {
        name,
        email,
        phone,
        goToWedding: goToWedding === 'Sim',
        goToParty: goToParty === 'Sim',
        observations,
      },
    });

    if (adultNameEscorts) {
      await Promise.all(
        adultNameEscorts.map(async (name: string) => {
          await prisma.guestConfirmation.create({
            data: {
              name,
              guest: {
                connect: {
                  id: guest.id,
                },
              },
              isChildren: false,
            },
          });
        }),
      );
    }

    if (childNameEscorts) {
      await Promise.all(
        childNameEscorts.map(async (name: string) => {
          await prisma.guestConfirmation.create({
            data: {
              name,
              guest: {
                connect: {
                  id: guest.id,
                },
              },
              isChildren: true,
            },
          });
        }),
      );
    }

    await qstash.publishJSON({
      url: `${process.env.BASE_URL}/api/jobs/send-invites`,
      body: { id: guest.id, name, email, phone, adultNameEscorts, childNameEscorts },
    });

    return NextResponse.json(body, { status: 201 });
  } catch (error) {
    console.error('Erro ao salvar os dados do convidado:', error);

    return NextResponse.json({ error: 'Erro ao salvar os dados' }, { status: 500 });
  }
}
