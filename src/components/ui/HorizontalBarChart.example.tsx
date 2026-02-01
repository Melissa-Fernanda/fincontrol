/**
 * Exemplos de uso do componente HorizontalBarChart
 * 
 * Componente de gráfico de barras horizontais para visualização de dados categóricos.
 */

import { useState, useEffect } from "react";
import { HorizontalBarChart, DEFAULT_CATEGORY_DATA, type CategoryData as ChartCategoryData } from "./HorizontalBarChart";

// ============================================
// Exemplo 1: Uso básico com dados padrão
// ============================================
export function Example1() {
  return (
    <HorizontalBarChart
      data={DEFAULT_CATEGORY_DATA}
      onViewDetails={() => console.log("Ver detalhes")}
    />
  );
}

// ============================================
// Exemplo 2: Título customizado
// ============================================
export function Example2() {
  const monthlyExpenses = [
    { category: "Alimentação", value: 85 },
    { category: "Transporte", value: 65 },
    { category: "Moradia", value: 92 },
    { category: "Lazer", value: 45 },
  ];

  return (
    <HorizontalBarChart
      title="Gastos Mensais por Categoria"
      data={monthlyExpenses}
      onViewDetails={() => alert("Abrindo detalhes...")}
    />
  );
}

// ============================================
// Exemplo 3: Sem botão de detalhes
// ============================================
export function Example3() {
  const data = [
    { category: "Marketing", value: 78 },
    { category: "Vendas", value: 92 },
    { category: "Operações", value: 65 },
    { category: "TI", value: 88 },
  ];

  return (
    <HorizontalBarChart
      title="Orçamento por Departamento"
      data={data}
      // Sem onViewDetails - botão não será renderizado
    />
  );
}

// ============================================
// Exemplo 4: Dados dinâmicos
// ============================================
export function Example4() {
  // Simula dados vindos de uma API
  const categoryData = [
    { category: "Categoria A", value: calculatePercentage("A") },
    { category: "Categoria B", value: calculatePercentage("B") },
    { category: "Categoria C", value: calculatePercentage("C") },
    { category: "Categoria D", value: calculatePercentage("D") },
    { category: "Categoria E", value: calculatePercentage("E") },
  ];

  const handleViewDetails = () => {
    // Navegar para página de detalhes
    window.location.href = "/expenses/details";
  };

  return (
    <HorizontalBarChart
      title="Análise de Despesas"
      data={categoryData}
      onViewDetails={handleViewDetails}
      className="max-w-4xl"
    />
  );
}

// ============================================
// Exemplo 5: Múltiplos gráficos
// ============================================
export function Example5() {
  const expensesData = [
    { category: "Alimentação", value: 85 },
    { category: "Transporte", value: 65 },
    { category: "Moradia", value: 92 },
  ];

  const revenueData = [
    { category: "Produto A", value: 75 },
    { category: "Produto B", value: 88 },
    { category: "Produto C", value: 62 },
  ];

  return (
    <div className="flex flex-col gap-6">
      <HorizontalBarChart
        title="Despesas por Categoria"
        data={expensesData}
        onViewDetails={() => console.log("Despesas")}
      />
      
      <HorizontalBarChart
        title="Receitas por Produto"
        data={revenueData}
        onViewDetails={() => console.log("Receitas")}
      />
    </div>
  );
}

// ============================================
// Exemplo 6: Com dados de API (async)
// ============================================
export function Example6() {
  // Em um componente real, você usaria useState e useEffect
  const [data, setData] = useState<ChartCategoryData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategoryData()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <HorizontalBarChart
      title="Despesas Atualizadas"
      data={data}
      onViewDetails={() => console.log("Ver detalhes")}
    />
  );
}

// Funções auxiliares (exemplo)
function calculatePercentage(category: string): number {
  // Simula cálculo de porcentagem
  const values: Record<string, number> = {
    A: 85,
    B: 65,
    C: 92,
    D: 45,
    E: 72,
  };
  return values[category] || 0;
}

async function fetchCategoryData(): Promise<ChartCategoryData[]> {
  // Simula chamada de API
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { category: "Alimentação", value: 85 },
        { category: "Transporte", value: 65 },
        { category: "Moradia", value: 92 },
      ]);
    }, 1000);
  });
}

// ============================================
// Tipos exportados
// ============================================

/**
 * Interface para dados de categoria
 * 
 * @property category - Nome da categoria (exibido à esquerda)
 * @property value - Valor percentual (0-100)
 */
export interface CategoryData {
  category: string;
  value: number;
}

/**
 * Props do HorizontalBarChart
 * 
 * @property title - Título do gráfico (padrão: "Despesas por Categoria")
 * @property data - Array de dados das categorias
 * @property onViewDetails - Callback ao clicar em "Ver detalhes" (opcional)
 * @property className - Classes CSS adicionais (opcional)
 */
export interface HorizontalBarChartProps {
  title?: string;
  data: CategoryData[];
  onViewDetails?: () => void;
  className?: string;
}
