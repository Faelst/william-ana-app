import { NextResponse } from 'next/server';
// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

export async function POST(request: Request) {
  const body = await request.json();
  const { nome, convidados } = body;

  if (!nome || convidados === undefined) {
    return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 });
  }

  return NextResponse.json(body, { status: 200 });
}
