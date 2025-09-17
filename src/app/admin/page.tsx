"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useCallback, useEffect, useMemo, useState } from "react";

export const dynamic = "force-dynamic";

type Person = {
    id: string | number;
    name: string;
    email?: string | null;
    phone?: string | null;
    isChildren: boolean;
    confirmed: boolean;
    relation: "Responsável" | "Adulto" | "Criança";
    inviteSent?: boolean | null;
    goToWedding?: boolean;
    goToParty?: boolean;
    createdAt?: string | Date;
};

type InviteRow = {
    id: string | number;
    code: string;
    name: string;
    used: boolean;
    createdAt: string | Date;
    total: number;
    adults: number;
    children: number;
    people: Person[]; // <-- NOVO
};

type ApiResponse = {
    rows: InviteRow[];
    totals: { invites: number; confirmations: number; adults: number; children: number };
    meta: {
        page: number;
        perPage: number;
        totalCount: number;
        totalPages: number;
        sort: "createdAt" | "name" | "code";
        order: "asc" | "desc";
        filters: { q: string | null; used: boolean | null; dateStart: string | null; dateEnd: string | null };
    };
};

export default function AdminConvitesPage() {
    // UI/consulta
    const [q, setQ] = useState("");
    const [used, setUsed] = useState<"" | "true" | "false">("");
    const [page, setPage] = useState(1);
    const [perPage] = useState(20);
    const [sort, setSort] = useState<"createdAt" | "name" | "code">("createdAt");
    const [order, setOrder] = useState<"asc" | "desc">("desc");

    // dados
    const [rows, setRows] = useState<InviteRow[]>([]);
    const [totals, setTotals] = useState({ invites: 0, confirmations: 0, adults: 0, children: 0 });

    // estados
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState<string | null>(null);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setErr(null);
        const ac = new AbortController();
        try {
            const params = new URLSearchParams({
                page: String(page),
                perPage: String(perPage),
                sort,
                order,
            });
            if (q.trim()) params.set("q", q.trim());
            if (used) params.set("used", used);

            const res = await fetch(`/api/invites?` + params.toString(), {
                cache: "no-store",
                signal: ac.signal,
            });
            if (!res.ok) {
                const j = await res.json().catch(() => ({}));
                throw new Error(j?.error || `HTTP ${res.status}`);
            }
            const data: ApiResponse = await res.json();

            setRows(data.rows ?? []);
            setTotals(data.totals ?? { invites: 0, confirmations: 0, adults: 0, children: 0 });
            setTotalPages(data.meta?.totalPages ?? 1);
            setTotalCount(data.meta?.totalCount ?? (data.rows?.length ?? 0));
        } catch (e: any) {
            if (e?.name !== "AbortError") setErr(e?.message ?? "Erro ao carregar");
        } finally {
            setLoading(false);
        }
        return () => ac.abort();
    }, [page, perPage, q, used, sort, order]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // re-aplicar busca do início
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1);
        fetchData();
    };

    // totals em fallback (se API não enviar)
    const computedTotals = useMemo(() => {
        if (totals.invites || totals.confirmations || totals.adults || totals.children) return totals;
        return rows.reduce(
            (acc, r) => {
                acc.invites += 1;
                acc.confirmations += r.total;
                acc.adults += r.adults;
                acc.children += r.children;
                return acc;
            },
            { invites: 0, confirmations: 0, adults: 0, children: 0 },
        );
    }, [rows, totals]);

    return (
        <div className="min-h-screen bg-[#f7f7f7] px-4 py-6 sm:px-6 sm:py-10">
            <div className="mx-auto w-full max-w-6xl">
                <h1 className="text-2xl font-semibold text-[#baaa9e] sm:text-3xl">Admin • Convites</h1>

                {/* Filtros */}
                <form onSubmit={handleSearch} className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-6">
                    <input
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        placeholder="Buscar por nome ou código…"
                        className="col-span-3 rounded-xl border border-[#e8e1dc] bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#baaa9e]"
                    />
                    <select
                        value={used}
                        onChange={(e) => {
                            setUsed(e.target.value as any);
                            setPage(1);
                        }}
                        className="col-span-1 rounded-xl border border-[#e8e1dc] bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#baaa9e]"
                    >
                        <option value="">Usado (todos)</option>
                        <option value="true">Usado: Sim</option>
                        <option value="false">Usado: Não</option>
                    </select>

                    <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value as any)}
                        className="col-span-1 rounded-xl border border-[#e8e1dc] bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#baaa9e]"
                    >
                        <option value="createdAt">Ordenar: Criado em</option>
                        <option value="name">Ordenar: Nome</option>
                        <option value="code">Ordenar: Código</option>
                    </select>

                    <select
                        value={order}
                        onChange={(e) => setOrder(e.target.value as any)}
                        className="col-span-1 rounded-xl border border-[#e8e1dc] bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#baaa9e]"
                    >
                        <option value="desc">Desc</option>
                        <option value="asc">Asc</option>
                    </select>

                    <button
                        type="submit"
                        className="col-span-1 rounded-xl bg-[#baaa9e] px-4 py-2 text-sm font-medium text-white hover:opacity-95 sm:col-span-1"
                    >
                        Buscar
                    </button>
                </form>

                {/* KPIs */}
                <div className="mt-4 grid grid-cols-2 gap-3 sm:mt-6 sm:grid-cols-4 sm:gap-4">
                    <KPI label="Convites" value={String(computedTotals.invites)} />
                    <KPI label="Confirmações" value={String(computedTotals.confirmations)} />
                    <KPI label="Adultos" value={String(computedTotals.adults)} />
                    <KPI label="Crianças" value={String(computedTotals.children)} />
                </div>

                {/* Lista mobile */}
                <div className="mt-6 space-y-3 md:hidden">
                    {loading ? (
                        <LoadingCards />
                    ) : err ? (
                        <ErrorBox message={err} onRetry={fetchData} />
                    ) : rows.length === 0 ? (
                        <EmptyState />
                    ) : (
                        rows.map((r) => <MobileInviteCard key={r.id} row={r} />)
                    )}
                </div>

                {/* Tabela desktop */}
                <div className="mt-6 hidden md:block">
                    <div className="overflow-x-auto rounded-2xl bg-white shadow">
                        <table className="min-w-full text-sm">
                            <thead>
                                <tr className="bg-[#faf7f5] text-[#8b7d73]">
                                    <Th>Convite</Th>
                                    <Th>Nome</Th>
                                    <Th className="text-center">Confirmações</Th>
                                    <Th className="text-center">Adultos</Th>
                                    <Th className="text-center">Crianças</Th>
                                    <Th className="text-center">Usado</Th>
                                    <Th>Criado em</Th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={7} className="p-6">
                                            <TableSkeleton />
                                        </td>
                                    </tr>
                                ) : err ? (
                                    <tr>
                                        <td colSpan={7} className="p-6">
                                            <ErrorBox message={err} onRetry={fetchData} />
                                        </td>
                                    </tr>
                                ) : rows.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="py-10 text-center text-gray-500">
                                            Nenhum convite cadastrado ainda.
                                        </td>
                                    </tr>
                                ) : (
                                    rows.map((r, i) => (
                                        <tr key={r.id} className={i % 2 === 0 ? "bg-white" : "bg-[#fcfbfb]"}>
                                            <Td mono>{r.code}</Td>
                                            <Td className="max-w-[280px] truncate">{r.name}</Td>
                                            <Td center>{r.total}</Td>
                                            <Td center>{r.adults}</Td>
                                            <Td center>{r.children}</Td>
                                            <Td center>
                                                <Badge used={r.used} />
                                            </Td>
                                            <Td>{formatDate(r.createdAt)}</Td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Paginação */}
                <div className="mt-4 flex items-center justify-between">
                    <div className="text-xs text-[#8b7d73]">
                        {loading ? "Carregando…" : `${totalCount} resultado(s) • página ${page} de ${totalPages}`}
                    </div>

                    <div className="flex gap-2">
                        <button
                            disabled={loading || page <= 1}
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            className="rounded-lg bg-white px-3 py-1 text-sm text-[#645a53] shadow disabled:opacity-50"
                        >
                            Anterior
                        </button>
                        <button
                            disabled={loading || page >= totalPages}
                            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                            className="rounded-lg bg-white px-3 py-1 text-sm text-[#645a53] shadow disabled:opacity-50"
                        >
                            Próxima
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}


function KPI({ label, value }: { label: string; value: string }) {
    return (
        <div className="rounded-2xl bg-white p-4 shadow sm:p-5">
            <div className="text-[10px] uppercase tracking-wider text-[#8b7d73] sm:text-xs">{label}</div>
            <div className="mt-1 text-2xl font-semibold text-[#baaa9e] sm:text-3xl">{value}</div>
        </div>
    );
}

function Badge({ used }: { used: boolean }) {
    return (
        <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${!used ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                }`}
        >
            {!used ? "Utilizado" : "Não utilizado"}
        </span>
    );
}

function Th({ children, className = "" }: { children: React.ReactNode; className?: string }) {
    return (
        <th className={`px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider ${className}`}>
            {children}
        </th>
    );
}

function Td({
    children,
    center,
    mono,
    className = "",
}: {
    children: React.ReactNode;
    center?: boolean;
    mono?: boolean;
    className?: string;
}) {
    return (
        <td className={`px-4 py-3 text-[#645a53] ${center ? "text-center" : ""} ${mono ? "font-mono" : ""} ${className}`}>
            {children}
        </td>
    );
}

function MobileInviteCard({ row }: { row: InviteRow }) {
    return (
        <div className="rounded-2xl bg-white p-4 shadow">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <div className="font-mono text-xs text-[#8b7d73]">Convite {row.code}</div>
                    <div className="mt-0.5 line-clamp-2 text-base font-medium text-[#645a53]">
                        {row.name}
                    </div>
                </div>
                <Badge used={row.used} />
            </div>

            {/* métricas resumidas */}
            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                <Stat label="Confirmados" value={row.total} />
                <Stat label="Adultos" value={row.adults} />
                <Stat label="Crianças" value={row.children} />
            </div>

            {/* lista detalhada: responsável + dependentes */}
            <div className="mt-3 rounded-xl bg-[#faf7f5] p-3">
                <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-[#8b7d73]">
                    Pessoas
                </div>
                <ul className="divide-y divide-[#eadfd8]">
                    {row.people.map((p) => (
                        <li key={p.id} className="flex items-start justify-between gap-2 py-2">
                            <div className="min-w-0">
                                <div className="truncate text-sm text-[#645a53]">{p.name}</div>
                                <div className="text-xs text-[#8b7d73]">
                                    {p.relation} {p.isChildren ? "• Criança" : "• Adulto"}
                                </div>
                            </div>
                            <span
                                className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${p.confirmed ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                                    }`}
                                title={
                                    p.relation === "Responsável"
                                        ? `Casamento: ${p.goToWedding ? "Sim" : "Não"} • Festa: ${p.goToParty ? "Sim" : "Não"
                                        }`
                                        : undefined
                                }
                            >
                                {p.confirmed ? "Confirmado" : "Pendente"}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="mt-3 text-right text-xs text-[#8b7d73]">
                Criado em {formatDate(row.createdAt)}
            </div>
        </div>
    );
}

function Stat({ label, value }: { label: string; value: number | string }) {
    return (
        <div className="rounded-xl bg-[#faf7f5] px-2 py-2">
            <div className="text-[10px] uppercase tracking-wide text-[#8b7d73]">{label}</div>
            <div className="text-lg font-semibold text-[#baaa9e]">{value}</div>
        </div>
    );
}

function EmptyState() {
    return <div className="rounded-2xl bg-white p-8 text-center text-gray-500 shadow">Nenhum convite cadastrado ainda.</div>;
}

function LoadingCards() {
    return (
        <>
            {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse rounded-2xl bg-white p-4 shadow">
                    <div className="h-3 w-24 rounded bg-gray-200" />
                    <div className="mt-2 h-4 w-40 rounded bg-gray-200" />
                    <div className="mt-3 grid grid-cols-3 gap-2">
                        <div className="h-10 rounded bg-gray-200" />
                        <div className="h-10 rounded bg-gray-200" />
                        <div className="h-10 rounded bg-gray-200" />
                    </div>
                </div>
            ))}
        </>
    );
}

function TableSkeleton() {
    return (
        <div className="animate-pulse space-y-2">
            {[...Array(6)].map((_, i) => (
                <div key={i} className="h-6 rounded bg-gray-100" />
            ))}
        </div>
    );
}

function ErrorBox({ message, onRetry }: { message: string; onRetry: () => void }) {
    return (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            Erro: {message}{" "}
            <button onClick={onRetry} className="ml-2 underline">
                Tentar novamente
            </button>
        </div>
    );
}

/* ---------- utils ---------- */
function formatDate(d: string | Date) {
    const date = new Date(d);
    if (Number.isNaN(date.getTime())) return "-";
    return date.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "2-digit" });
}
