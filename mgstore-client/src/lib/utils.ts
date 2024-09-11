import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const { format: formatMoney } = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});
