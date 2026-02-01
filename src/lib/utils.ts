/**
 * Formata um número como moeda em Real (BRL).
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

/**
 * Converte string de moeda (ex: "R$ 2.800,00") em número.
 */
export function parseCurrency(value: string): number {
  const cleaned = value.replace(/\s/g, "").replace(/R\$/g, "").replace(/\./g, "").replace(",", ".");
  return parseFloat(cleaned) || 0;
}
