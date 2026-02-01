"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";
import { ArrowUpRight01Icon } from "@/components/icons";
import { formatCurrency } from "@/lib/utils";

export interface CategoryData {
  category: string;
  value: number;
  /** Valor gasto em R$ (opcional, exibido no tooltip) */
  amount?: number;
}

interface HorizontalBarChartProps {
  title?: string;
  data: CategoryData[];
  onViewDetails?: () => void;
  /** URL para onde o botão "Ver detalhes" redireciona (ex: /transacoes) */
  detailsHref?: string;
  className?: string;
}

export function HorizontalBarChart({
  title = "Despesas por Categoria",
  data,
  onViewDetails,
  detailsHref,
  className = "",
}: HorizontalBarChartProps) {
  const [hoveredItem, setHoveredItem] = useState<CategoryData | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

  // Largura da barra: proporcional ao valor gasto (R$). Se não houver amount, usa value (%).
  const maxAmount = Math.max(0, ...data.map((d) => d.amount ?? 0));
  const hasAmounts = maxAmount > 0;
  const getBarWidth = (item: CategoryData): number =>
    hasAmounts && item.amount != null
      ? (item.amount / maxAmount) * 100
      : item.value;

  const handleMouseEnter = (item: CategoryData, e: React.MouseEvent<HTMLDivElement>) => {
    setHoveredItem(item);
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPosition({
      top: rect.top - 6,
      left: rect.left + rect.width / 2,
    });
  };

  const handleMouseLeave = () => setHoveredItem(null);

  return (
    <div
      className={`w-full h-full min-h-0 flex flex-col bg-[var(--surface-card)] rounded-[var(--radius-lg)] border border-[var(--neutral-100)] p-4 sm:p-6 shadow-[var(--shadow-card)] ${className}`}
    >
      {/* Header - altura fixa */}
      <div className="flex items-center justify-between gap-4 mb-4 shrink-0">
        <h2 className="flex-1 min-w-0 text-xl md:text-2xl leading-tight text-[var(--neutral-text-black)] font-medium font-sans">
          {title}
        </h2>
        {detailsHref ? (
          <Link
            href={detailsHref}
            className="bg-[var(--neutral-75)] hover:bg-[var(--neutral-100)] transition-colors cursor-pointer flex gap-2 items-center justify-center px-2 py-1.5 rounded-xl shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--neutral-400)]"
          >
            <span className="font-[var(--font-lexend)] font-light text-sm leading-[1.4] text-[var(--neutral-text-strong)]">
              Ver detalhes
            </span>
            <Icon icon={ArrowUpRight01Icon} size={14} className="text-[var(--neutral-text-strong)] shrink-0" />
          </Link>
        ) : (
          <button
            type="button"
            onClick={onViewDetails}
            className="bg-[var(--neutral-75)] hover:bg-[var(--neutral-100)] transition-colors cursor-pointer flex gap-2 items-center justify-center px-2 py-1.5 rounded-xl shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--neutral-400)]"
          >
            <span className="font-[var(--font-lexend)] font-light text-sm leading-[1.4] text-[var(--neutral-text-strong)]">
              Ver detalhes
            </span>
            <Icon icon={ArrowUpRight01Icon} size={14} className="text-[var(--neutral-text-strong)] shrink-0" />
          </button>
        )}
      </div>

      {/* Área do gráfico - ocupa o resto do container */}
      <div className="flex-1 min-h-0 flex flex-col relative w-full">
        {data.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center text-center min-h-0 py-4">
            <p className="text-base md:text-lg font-medium text-[var(--neutral-text-black)]">
              Nenhuma despesa por categoria
            </p>
            <p className="mt-1 text-sm font-light text-[var(--neutral-text-muted)] w-full">
              Adicione transações e contas fixas para ver o gráfico
            </p>
            <div className="mt-4 w-full max-w-[320px] flex-1 min-h-0 flex items-center justify-center">
              <img
                src="/images/no-chart.svg"
                alt=""
                className="w-fit h-full object-contain"
              />
            </div>
          </div>
        ) : (
          <>
            {/* X-Axis Scale Labels */}
            <div className="flex justify-between w-full pl-[min(100px,28vw)] sm:pl-[100px] mb-1 shrink-0 min-w-0">
              {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((val) => (
                <div key={val} className="w-0 flex justify-center">
                  <span className="text-xs text-[var(--neutral-text-muted)]">{val}</span>
                </div>
              ))}
            </div>

            {/* Chart Body - preenche o espaço restante */}
            <div className="relative flex-1 min-h-0 flex flex-col">
              {/* Vertical Grid Lines */}
              <div className="absolute inset-0 left-[min(100px,28vw)] sm:left-[100px] flex justify-between pointer-events-none">
                {Array.from({ length: 11 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-px h-full border-r border-dashed border-[var(--neutral-100)] last:border-0 first:border-l"
                  />
                ))}
              </div>

              {/* Rows - cada linha com flex-1 para distribuir a altura */}
              <div className="relative flex-1 min-h-0 flex flex-col gap-1">
                {data.map((item) => (
              <div
                key={item.category}
                className="flex flex-1 min-h-0 items-center group"
                onMouseEnter={(e) => handleMouseEnter(item, e)}
                onMouseLeave={handleMouseLeave}
              >
                {/* Category Label */}
                <div className="w-[min(100px,28vw)] sm:w-[100px] pr-2 sm:pr-4 text-right shrink-0 min-w-0 overflow-hidden">
                  <span className="text-xs text-[var(--neutral-text-muted)] truncate block">
                    {item.category}
                  </span>
                </div>

                {/* Bar Container - altura 100% da linha */}
                <div className="relative flex-1 h-full min-h-[20px] cursor-default">
                  {/* Track (Background Bar) - hover destaque sutil */}
                  <div
                    className="absolute inset-0 bg-[var(--fathomgray-800)] opacity-[0.08] rounded-r-[var(--radius-lg)] w-full transition-opacity duration-150 group-hover:opacity-[0.12]"
                    title={
                    item.amount != null
                      ? `${item.category}: ${item.value}% · ${formatCurrency(item.amount)}`
                      : `${item.category}: ${item.value}%`
                  }
                  />

                  {/* Fill (Foreground Bar) - largura dinâmica pelo valor gasto (R$) */}
                  <div
                    className="absolute top-0 left-0 h-full bg-[var(--brand-base)] opacity-90 rounded-r-[var(--radius-lg)] transition-all duration-500 ease-out group-hover:opacity-95"
                    style={{ width: `${getBarWidth(item)}%` }}
                  />
                </div>
              </div>
                ))}
              </div>

              {/* Tooltip no hover: categoria, % e valor em R$ */}
              {hoveredItem && (
                <div
                  className="fixed z-50 px-3 py-2 rounded-lg bg-[var(--brand-base)] text-white text-sm font-medium shadow-[var(--shadow-modal)] whitespace-nowrap pointer-events-none -translate-x-1/2 -translate-y-full"
                  style={{
                    top: tooltipPosition.top,
                    left: tooltipPosition.left,
                  }}
                  role="tooltip"
                >
                  <span className="text-white/90">{hoveredItem.category}:</span>{" "}
                  <span className="font-semibold">{hoveredItem.value}%</span>
                  <span className="text-white/70 mx-1">·</span>
                  <span className="font-semibold">
                    {hoveredItem.amount != null
                      ? formatCurrency(hoveredItem.amount)
                      : "R$ —"}
                  </span>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Dados padrão para exemplo
export const DEFAULT_CATEGORY_DATA: CategoryData[] = [
  { category: "Alimentação", value: 85 },
  { category: "Transporte", value: 65 },
  { category: "Moradia", value: 92 },
  { category: "Lazer", value: 45 },
  { category: "Saúde", value: 38 },
  { category: "Educação", value: 55 },
];
