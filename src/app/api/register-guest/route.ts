import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
      await Promise.all(adultNameEscorts.map(async (name: string) => {
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
      }));
    }

    if (childNameEscorts) {
      await Promise.all(childNameEscorts.map(async (name: string) => {
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
      }));
    }

    return NextResponse.json(body, { status: 201 });
  } catch (error) {
    console.error('Erro ao salvar os dados do convidado:', error);

    return NextResponse.json({ error: 'Erro ao salvar os dados' }, { status: 500 });
  }
}
