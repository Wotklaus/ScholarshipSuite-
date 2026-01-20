export type ParsedBankCertificate = {
  bankName: string | null;
  identification: string | null;
  accountNumber: string | null;
  accountType: 'AHORROS' | 'CORRIENTE' | null;
};

function cleanSpaces(s: string) {
  return s.replace(/\s+/g, ' ').trim();
}

export function parsePichinchaText(rawText: string): ParsedBankCertificate {
  const text = cleanSpaces(rawText);

  // Banco
  const bankName = /Banco\s+Pichincha/i.test(text) ? 'BANCO PICHINCHA' : null;

  // Cédula: "Identificación No.1725399834" (puede venir con espacios)
  const idMatch =
    text.match(/Identificaci[oó]n\s*No\.?\s*([0-9]{10})/i) ||
    text.match(/Documento\s+de\s+Identificaci[oó]n\s*No\.?\s*([0-9]{10})/i);

  const identification = idMatch?.[1] ?? null;

  // Cuenta: "2206045497 Cuenta de Ahorro"
  // (tomamos la primera cuenta que aparezca)
  const acctMatch = text.match(/(\d{8,20})\s+Cuenta\s+de\s+(Ahorro|Ahorros|Corriente)/i);
  const accountNumber = acctMatch?.[1] ?? null;

  let accountType: ParsedBankCertificate['accountType'] = null;
  const typeRaw = acctMatch?.[2]?.toLowerCase();
  if (typeRaw) {
    if (typeRaw.includes('ahor')) accountType = 'AHORROS';
    if (typeRaw.includes('corr')) accountType = 'CORRIENTE';
  }

  return {
    bankName,
    identification,
    accountNumber,
    accountType,
  };
}
