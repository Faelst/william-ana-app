import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasourceUrl: process.env.TURSO_DATABASE_URL,
});

export const POST = async (req: Request) => {
  const { code = '' } = (await req.json()) as {
    code: string;
  };

  if (!code) {
    return new Response('Missing code', { status: 400 });
  }

  const isValid = await prisma.inviteCode.findUnique({
    where: { code },
  });

  if (!isValid) {
    return new Response('Invalid code', { status: 404 });
  }

  if (isValid.used) {
    return new Response('Code has already been used', { status: 404 });
  }

  await prisma.inviteCode.update({
    where: { code },
    data: { used: true },
  });

  return new Response(
    JSON.stringify({
      code: isValid.code,
      name: isValid.name,
    }),
    { status: 200 },
  );
};
