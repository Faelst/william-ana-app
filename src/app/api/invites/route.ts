/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasourceUrl: process.env.TURSO_DATABASE_URL,
});

type Query = {
  page: number;
  perPage: number;
  q?: string;
  used?: boolean;
  dateStart?: Date;
  dateEnd?: Date;
  sort?: 'createdAt' | 'name' | 'code';
  order?: 'asc' | 'desc';
};

function parseQuery(req: Request): Query {
  const url = new URL(req.url);
  const page = Math.max(1, Number(url.searchParams.get('page') ?? 1));
  const perPage = Math.min(100, Math.max(1, Number(url.searchParams.get('perPage') ?? 20)));
  const q = url.searchParams.get('q') ?? undefined;

  const usedParam = url.searchParams.get('used');
  const used = usedParam === null ? undefined : usedParam === 'true' ? true : usedParam === 'false' ? false : undefined;

  const dateStartStr = url.searchParams.get('dateStart') ?? undefined; // ISO (ex: 2025-09-01)
  const dateEndStr = url.searchParams.get('dateEnd') ?? undefined;
  const dateStart = dateStartStr ? new Date(dateStartStr) : undefined;
  const dateEnd = dateEndStr ? new Date(dateEndStr) : undefined;

  const sortParam = url.searchParams.get('sort') as Query['sort'];
  const orderParam = url.searchParams.get('order') as Query['order'];
  const sort = sortParam ?? 'createdAt';
  const order = orderParam ?? 'desc';

  return { page, perPage, q, used, dateStart, dateEnd, sort, order };
}

async function fetchInvites(q: Query) {
  const where: any = {};

  if (q.q) {
    where.OR = [
      { name: { contains: q.q, mode: 'insensitive' } },
      { email: { contains: q.q, mode: 'insensitive' } },
      { phone: { contains: q.q, mode: 'insensitive' } },
    ];
  }

  if (typeof q.used === 'boolean') {
    where.inviteSent = q.used;
  }

  if (q.dateStart || q.dateEnd) {
    where.createdAt = {};
    if (q.dateStart) where.createdAt.gte = q.dateStart;
    if (q.dateEnd) where.createdAt.lte = q.dateEnd;
  }

  const orderBy: any = q.sort === 'code' ? { id: q.order } : { [q.sort ?? 'createdAt']: q.order ?? 'desc' };

  const [items, totalCount] = await Promise.all([
    prisma.guest.findMany({
      where,
      include: { GuestConfirmation: true },
      orderBy,
      skip: (q.page - 1) * q.perPage,
      take: q.perPage,
    }),
    prisma.guest.count({ where }),
  ]);

  const rows = items.map((g: any) => {
    const children = (g.GuestConfirmation ?? []).map((c: any) => ({
      id: `child-${c.id}`,
      name: c.name,
      email: c.email,
      phone: c.phone,
      isChildren: Boolean(c.isChildren),
      confirmed: true,
      relation: c.isChildren ? 'Criança' : 'Adulto',
      inviteSent: c.inviteSent,
      createdAt: c.createdAt,
    }));

    const responsibleConfirmed = Boolean(g.goToWedding || g.goToParty);
    const responsible = {
      id: `guest-${g.id}`,
      name: g.name,
      email: g.email,
      phone: g.phone,
      isChildren: false,
      confirmed: responsibleConfirmed,
      relation: 'Responsável',
      inviteSent: g.inviteSent,
      goToWedding: g.goToWedding,
      goToParty: g.goToParty,
      createdAt: g.createdAt,
    };
    const people = [responsible, ...children];
    const totalConfirmed = people.filter((p) => p.confirmed).length;
    const childrenConfirmed = people.filter((p) => p.isChildren && p.confirmed).length;
    const adultsConfirmed = totalConfirmed - childrenConfirmed;

    return {
      id: g.id,
      code: String(g.id),
      used: Boolean(g.inviteSent),
      name: g.name,
      createdAt: g.createdAt,
      total: totalConfirmed,
      adults: adultsConfirmed,
      children: childrenConfirmed,
      people,
    };
  });

  const totals = rows.reduce(
    (acc, r) => {
      acc.invites += 1;
      acc.confirmations += r.total;
      acc.adults += r.adults;
      acc.children += r.children;
      return acc;
    },
    { invites: 0, confirmations: 0, adults: 0, children: 0 },
  );

  return {
    rows,
    meta: {
      page: q.page,
      perPage: q.perPage,
      totalCount,
      totalPages: Math.max(1, Math.ceil(totalCount / q.perPage)),
      sort: q.sort,
      order: q.order,
      filters: {
        q: q.q ?? null,
        used: q.used ?? null,
        dateStart: q.dateStart ?? null,
        dateEnd: q.dateEnd ?? null,
      },
    },
    totals,
  };
}

export const GET = async (req: Request) => {
  try {
    const query = parseQuery(req);
    const data = await fetchInvites(query);
    return NextResponse.json(data, { status: 200 });
  } catch (err: any) {
    console.error('[GET /api/invites] Error:', err);
    return NextResponse.json(
      { error: 'Erro ao buscar convites', details: err?.message ?? String(err) },
      { status: 500 },
    );
  }
};
