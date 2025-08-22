export function buildConfirmationMessage(params: {
  names: string[];
  salutationName?: string;
  closingNote?: string;
}): string {
  const {
    names = [],
    salutationName,
    closingNote = 'Estamos encaminhando os convites digitais aos convidados com presença confirmada; cada convite é individual e nominal — o titular pode compartilhá-lo via WhatsApp com o destinatário correspondente. 💌',
  } = params;

  const uniqueNames = Array.from(new Set(names.map((n) => (n ?? '').trim()).filter((n) => n.length > 0)));

  const intro =
    `Olá${
      salutationName ? ` ${salutationName}` : ''
    }! Recebemos com alegria a sua confirmação de presença para nosso casamento.` +
    `\nEstamos muito felizes em saber que você vai celebrar esse momento especial com a gente! 💍✨`;

  const bullets = uniqueNames.map((n) => `• ${n}`).join('\n');
  const confirmedBlock = uniqueNames.length ? `\nNomes confirmados:\n${bullets}` : '';

  return `${intro}${confirmedBlock}\n${closingNote}`;
}

// const msg = buildConfirmationMessage({
//   salutationName: 'Rafael',
//   names: ['Rafael Silverio', 'Marcos Antonio Silverio', 'Tatiana Augusto Silverio'],
// });

// console.log(msg);
