/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useForm } from 'react-hook-form';
import SuccessModal from './SuccessModal';
import { useState } from 'react';

type FormValues = {
    name: string;
    goToWedding: 'Sim' | 'Nao';
    goToParty: 'Sim' | 'Nao';
    adults: number;
    children: number;
    email: string;
    phone: string;
    observations: string;
};

export default function GuestConfirmationForm() {
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: { errors },
    } = useForm<FormValues>();
    const [showSuccess, setShowSuccess] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const phone = watch('phone');

    const handlePhoneChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        let value = event.target.value.replace(/\D/g, '');

        if (value.length > 11) {
            value = value.slice(0, 11);
        }

        if (value.length <= 10) {
            value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
        } else {
            value = value.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3');
        }

        setValue('phone', value);
    };

    const onSubmit = async (data: any) => {
        if (isSubmitting) return;

        setIsSubmitting(true);
        data.adultNameEscorts = data.adultNameEscorts ? data.adultNameEscorts.filter((name: any) => name && name.trim() !== '') : [];
        data.childNameEscorts = data.childNameEscorts ? data.childNameEscorts.filter((name: any) => name && name.trim() !== '') : [];

        try {
            const response = await fetch('/api/register-guest', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Erro ao enviar os dados');
            }

            await response.json();
            reset();
            setShowSuccess(true);
        } catch (error) {
            console.log(error);
            alert('Ocorreu um erro ao enviar os dados. Por favor, tente novamente mais tarde.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const options = Array.from({ length: 11 }, (_, i) => i); // 0 a 10

    const adults = Number(watch('adults') || 0);
    const children = Number(watch('children') || 0);

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="max-w-3xl w-full py-8 px-6 space-y-6 border text-[#f7f7f7] rounded-2xl shadow-lg text-base"
        >
            <div className="">
                <label className="block font-semibold mb-1 text-base">Nome completo</label>
                <input
                    {...register('name', { required: true })}
                    className="w-full p-3 rounded-lg bg-[#f7f7f7] border border-[#baaa9e] text-[#baaa9e]"
                    placeholder="Seu nome completo"
                />
                {errors.name && <span className="text-red-500 text-sm">Campo obrigatório</span>}
            </div>

            <div className="flex border items-center px-2 py-4 rounded-lg gap-5 border-[#baaa9e] text-[#baaa9e] bg-[#f7f7f7]">
                <label className="block font-semibold mb-1 text-base">Você irá à cerimônia?</label>
                <div className="flex gap-6">
                    <div className="border p-2 rounded-lg">
                        <label className="flex items-center gap-2">
                            <input type="radio" value="Sim" {...register('goToWedding', { required: true })} />
                            Sim
                        </label>
                    </div>
                    <div className="border p-2 rounded-lg ">
                        <label className="flex items-center gap-2">
                            <input type="radio" value="Nao" {...register('goToWedding', { required: true })} />
                            Não
                        </label>
                    </div>
                </div>
                {errors.goToWedding && <span className="text-red-500 text-sm">Campo obrigatório</span>}
            </div>

            <div className="flex border items-center px-2 py-4 rounded-lg gap-5 border-[#baaa9e] text-[#baaa9e] bg-[#f7f7f7]">
                <label className="block font-semibold mb-1 text-base">Você irá à festa?</label>
                <div className="flex gap-6">
                    <div className="border p-2 rounded-lg">
                        <label className="flex items-center gap-2">
                            <input type="radio" value="Sim" {...register('goToParty', { required: true })} />
                            Sim
                        </label>
                    </div>
                    <div className="border p-2 rounded-lg">
                        <label className="flex items-center gap-2">
                            <input type="radio" value="Nao" {...register('goToParty', { required: true })} />
                            Não
                        </label>
                    </div>
                </div>
                {errors.goToParty && <span className="text-red-500 text-sm">Campo obrigatório</span>}
            </div>

            <div className="flex flex-col border  px-2 py-4 rounded-lg gap-5 border-[#baaa9e] text-[#baaa9e] bg-[#f7f7f7]">
                <div className="flex items-center gap-4">
                    <label className="block font-semibold mb-1">Quantos acompanhantes <strong>ADULTOS</strong> irão com voce ?</label>
                    <select {...register('adults')} className=" p-3 rounded-lg bg-white border">
                        {options.map((n) => (
                            <option key={n} value={n}>
                                {n}
                            </option>
                        ))}
                    </select>
                </div>


                {adults > 0 && (
                    <div className="space-y-1">
                        {[...Array(adults)].map((_, i) => (<div key={i}>
                            <input
                                key={i}
                                {...register(`adultNameEscorts.${i}` as any,
                                    {
                                        required: "O nome é obrigatório",
                                        minLength: {
                                            value: 5,
                                            message: "Informe o nome completo",
                                        },
                                    }
                                )}
                                placeholder={`Nome completo do adulto ${i + 1}`}
                                className="w-full p-3 rounded-lg bg-white border"
                            />
                            {(errors as any).adultNameEscorts?.[i] && (
                                <p className="text-red-500 text-sm mt-1 mb-2">
                                    {(errors as any).adultNameEscorts[i]?.message}
                                </p>
                            )}
                        </div>))}

                    </div>
                )}
            </div>

            <div className="flex flex-col border px-2 py-4 rounded-lg gap-5 border-[#baaa9e] text-[#baaa9e] bg-[#f7f7f7]">
                <div className="flex items-center gap-4">
                    <label className="block font-semibold mb-1">Quantidade de <strong>CRIANÇAS</strong> que irão com você?</label>
                    <select {...register('children', { valueAsNumber: true })} className="p-3 rounded-lg bg-white border">
                        {options.map((n) => (
                            <option key={n} value={n}>
                                {n}
                            </option>
                        ))}
                    </select>
                </div>

                {children > 0 && (
                    <div className="space-y-1">
                        {[...Array(children)].map((_, i) => (<div key={i}>
                            <input
                                key={i}
                                {...register(`childNameEscorts.${i}` as any,
                                    {
                                        required: "O nome é obrigatório",
                                        minLength: {
                                            value: 5,
                                            message: "Informe o nome completo",
                                        },
                                    }
                                )}
                                placeholder={`Nome completo da criança ${i + 1}`}
                                className="w-full p-3 rounded-lg bg-white border"
                            />
                            {(errors as any).childNameEscorts?.[i] && (
                                <p className="text-red-500 text-sm mt-1 mb-2">
                                    {(errors as any).childNameEscorts[i]?.message}
                                </p>
                            )}
                        </div>))}
                    </div>
                )}
            </div>

            <div className="w-full">
                <label className="block font-semibold mb-1">E-mail</label>
                <input
                    type="email"
                    {...register('email')}
                    className="w-full p-3 rounded-lg bg-[#f7f7f7] border text-[#baaa9e]"
                    placeholder="exemplo@email.com"
                />
            </div>

            <div>
                <label className="block font-semibold mb-1">Telefone para envio do convite (WhatsApp)</label>
                <input
                    type="tel"
                    {...register('phone', {
                        required: "O telefone é obrigatório",
                        pattern: {
                            value: /^\(\d{2}\)\s\d{5}-\d{4}$/,
                            message: "Formato inválido. Use (99) 99999-9999",
                        }
                    })}
                    value={phone || ''}
                    onChange={handlePhoneChange}
                    placeholder="(xx) xxxxx-xxxx"
                    className="w-full p-3 rounded-lg bg-[#f7f7f7] border text-[#baaa9e]"
                />
                {errors.phone && <span className="text-red-500 text-sm">Campo obrigatório</span>}
            </div>

            <div>
                <label className="block font-semibold mb-1">Mensagem para os noivos</label>
                <textarea
                    {...register('observations')}
                    className="w-full p-3 rounded-lg bg-[#f7f7f7] border text-[#baaa9e]"
                    rows={4}
                    placeholder="Deixe seu recado especial..."
                />
            </div>

            <button
                type="submit"
                className="mt-4 w-full py-4 rounded-lg bg-[#f7f7f7] text-[#baaa9e] font-bold hover:bg-[#a8968a] transition"
                disabled={isSubmitting}
            >
                {isSubmitting ? (
                    <div className="flex justify-center items-center">
                        <div className="w-6 h-6 border-4 border-gray-300 border-t-[#baaa9e] rounded-full animate-spin"></div>
                    </div>
                ) : 'Enviar confirmação'}
            </button>

            <SuccessModal
                open={showSuccess}
                onClose={() => {
                    reset();
                    setShowSuccess(false);
                    window.location.reload();
                }}
            />
        </form>
    );
}
