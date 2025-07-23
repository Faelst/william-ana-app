/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useForm } from 'react-hook-form';

type FormValues = {
    nome: string;
    cerimonia: 'Sim' | 'Nao';
    festa: 'Sim' | 'Nao';
    adultos: number;
    criancas: number;
    email: string;
    telefone: string;
    mensagem: string;
};

export default function GuestConfirmationForm() {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<FormValues>();

    const onSubmit = (data: FormValues) => {
        console.log('Dados enviados:', data);
        // Aqui você pode chamar sua API ou mostrar um feedback
    };

    const options = Array.from({ length: 11 }, (_, i) => i); // 0 a 10

    const adultos = Number(watch('adultos') || 0);
    const criancas = Number(watch('criancas') || 0);

    return (
        <form
            onSubmit={handleSubmit(onSubmit)} className="max-w-3xl w-full py-8 px-6 space-y-6 text-[#baaa9e] border border-[#baaa9e] rounded-xl shadow-lg text-base">
            <div className="">
                <label className="block font-semibold mb-1 text-base">Nome completo</label>
                <input
                    {...register('nome', { required: true })}
                    className="w-full p-3 rounded bg-white border"
                    placeholder="Seu nome completo"
                />
                {errors.nome && <span className="text-red-500 text-sm">Campo obrigatório</span>}
            </div>

            <div className="flex border items-center px-2 py-4 rounded gap-5">
                <label className="block font-semibold mb-1 text-base">Você irá à cerimônia?</label>
                <div className="flex gap-6">
                    <div className='border p-2 rounded'>
                        <label className="flex items-center gap-2">
                            <input type="radio" value="Sim" {...register('cerimonia', { required: true })} />
                            Sim
                        </label>
                    </div>
                    <div className='border p-2 rounded'>
                        <label className="flex items-center gap-2">
                            <input type="radio" value="Nao" {...register('cerimonia', { required: true })} />
                            Não
                        </label>
                    </div>
                </div>
                {errors.cerimonia && <span className="text-red-500 text-sm">Campo obrigatório</span>}
            </div>

            <div className="flex border items-center px-2 py-4 rounded gap-5">
                <label className="block font-semibold mb-1 text-base">Você irá à festa?</label>
                <div className="flex gap-6">
                    <div className='border p-2 rounded'>
                        <label className="flex items-center gap-2">
                            <input type="radio" value="Sim" {...register('festa', { required: true })} />
                            Sim
                        </label>
                    </div>
                    <div className='border p-2 rounded'>
                        <label className="flex items-center gap-2">
                            <input type="radio" value="Nao" {...register('festa', { required: true })} />
                            Não
                        </label>
                    </div>
                </div>
                {errors.festa && <span className="text-red-500 text-sm">Campo obrigatório</span>}
            </div>

            <div className="flex flex-col border  px-2 py-4 rounded gap-5">
                <div className='flex items-center gap-4'>
                    <label className="block font-semibold mb-1">Quantidade de adultos (incluindo você)</label>
                    <select {...register('adultos')} className=" p-3 rounded bg-white border">
                        {options.map(n => (
                            <option key={n} value={n}>
                                {n}
                            </option>
                        ))}
                    </select>
                </div>
                {adultos > 1 && (
                    <div className="space-y-1">
                        {[...Array(adultos - 1)].map((_, i) => (
                            <input
                                key={i}
                                {...register(`nomesAdultos.${i}` as any)}
                                placeholder={`Nome do adulto ${i + 2}`}
                                className="w-full p-3 rounded bg-white border"
                            />
                        ))}
                    </div>
                )}
            </div>

            <div className="flex flex-col border px-2 py-4 rounded gap-5">
                <div className="flex items-center gap-4">
                    <label className="block font-semibold mb-1">
                        Quantidade de crianças
                    </label>
                    <select
                        {...register('criancas')}
                        className="p-3 rounded bg-white border"
                    >
                        {options.map(n => (
                            <option key={n} value={n}>
                                {n}
                            </option>
                        ))}
                    </select>
                </div>

                {criancas > 0 && (
                    <div className="space-y-1">
                        {[...Array(criancas)].map((_, i) => (
                            <input
                                key={i}
                                {...register(`nomesCriancas.${i}` as any)}
                                placeholder={`Nome da criança ${i + 1}`}
                                className="w-full p-3 rounded bg-white border"
                            />
                        ))}
                    </div>
                )}
            </div>

            <div className="w-full">
                <label className="block font-semibold mb-1">E-mail</label>
                <input
                    type="email"
                    {...register('email')}
                    className="w-full p-3 rounded bg-white border"
                    placeholder="exemplo@email.com"
                />
            </div>

            <div>
                <label className="block font-semibold mb-1">Telefone para envio do convite</label>
                <input
                    type="tel"
                    {...register('telefone')}
                    className="w-full p-3 rounded bg-white border"
                    placeholder="(xx) xxxxx-xxxx"
                />
            </div>

            <div>
                <label className="block font-semibold mb-1">Mensagem para os noivos</label>
                <textarea
                    {...register('mensagem')}
                    className="w-full p-3 rounded bg-white border"
                    rows={4}
                    placeholder="Deixe seu recado especial..."
                />
            </div>

            <button
                type="submit"
                className="mt-4 w-full py-3 rounded-full bg-[#baaa9e] text-white font-bold hover:bg-[#a8968a] transition"
            >
                Enviar confirmação
            </button>
        </form>
    );
}
