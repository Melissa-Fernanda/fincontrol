/**
 * Exemplos de uso dos componentes FinanceCards
 * 
 * Os componentes foram refatorados para evitar hardcode e aceitar dados via props.
 */

import { FinancialStats, BalanceCard, RevenueCard, ExpensesCard, type FinancialData } from "./FinanceCards";
import { Icon } from "./Icon";
import { Target01Icon, CreditCardIcon } from "@/components/icons";

// ============================================
// Exemplo 1: Uso básico com FinancialStats
// ============================================
export function Example1() {
  const data: FinancialData = {
    balance: {
      amount: "R$ 20.441,00",
      badge: {
        text: "+12% vs mês anterior",
        variant: "success",
      },
    },
    revenue: {
      amount: "R$ 8.800,00",
      badge: {
        text: "Consolidado do mês atual",
        variant: "neutral",
      },
    },
    expenses: {
      amount: "R$ 3.359,00",
      alert: {
        label: "Atenção",
        message: "Gastos elevados",
        variant: "error",
        showIcon: true,
      },
    },
  };

  return <FinancialStats data={data} />;
}

// ============================================
// Exemplo 2: Cards individuais customizados
// ============================================
export function Example2() {
  return (
    <div className="flex flex-col md:flex-row gap-4 w-full items-stretch">
      {/* Card de saldo com título customizado */}
      <BalanceCard
        title="Saldo Total"
        balance="R$ 50.000,00"
        badge={{
          text: "Crescimento de 25%",
          variant: "success",
        }}
      />

      {/* Card de receita com ícone customizado */}
      <RevenueCard
        title="Receitas Anuais"
        amount="R$ 120.000,00"
        badge={{
          text: "Meta atingida",
          variant: "success",
        }}
        icon={<Icon icon={Target01Icon} size={24} />}
      />

      {/* Card de despesas sem alerta */}
      <ExpensesCard
        title="Despesas Fixas"
        amount="R$ 2.500,00"
      />
    </div>
  );
}

// ============================================
// Exemplo 3: Diferentes variantes de alertas
// ============================================
export function Example3() {
  return (
    <div className="flex flex-col md:flex-row gap-4 w-full items-stretch">
      {/* Alerta de erro */}
      <ExpensesCard
        amount="R$ 5.000,00"
        alert={{
          label: "Crítico",
          message: "Orçamento excedido",
          variant: "error",
          showIcon: true,
        }}
      />

      {/* Alerta de aviso */}
      <ExpensesCard
        amount="R$ 3.800,00"
        alert={{
          label: "Aviso",
          message: "Próximo ao limite",
          variant: "warning",
          showIcon: true,
        }}
      />

      {/* Alerta informativo sem ícone */}
      <ExpensesCard
        amount="R$ 2.000,00"
        alert={{
          label: "Info",
          message: "Dentro do esperado",
          variant: "info",
          showIcon: false,
        }}
      />
    </div>
  );
}

// ============================================
// Exemplo 4: Dados dinâmicos (simulando API)
// ============================================
export function Example4() {
  // Simula dados vindos de uma API
  const fetchedData: FinancialData = {
    balance: {
      amount: formatCurrency(calculateBalance()),
      badge: calculateBalanceChange() > 0 
        ? {
            text: `+${calculateBalanceChange()}% vs mês anterior`,
            variant: "success",
          }
        : undefined,
    },
    revenue: {
      amount: formatCurrency(getTotalRevenue()),
      badge: {
        text: `${getRevenueCount()} transações`,
        variant: "info",
      },
    },
    expenses: {
      amount: formatCurrency(getTotalExpenses()),
      alert: shouldShowExpenseAlert() 
        ? {
            label: "Atenção",
            message: getExpenseAlertMessage(),
            variant: getExpenseAlertSeverity(),
            showIcon: true,
          }
        : undefined,
    },
  };

  return <FinancialStats data={data} />;
}

// Funções auxiliares (exemplo)
function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function calculateBalance(): number {
  return 20441.0;
}

function calculateBalanceChange(): number {
  return 12;
}

function getTotalRevenue(): number {
  return 8800.0;
}

function getRevenueCount(): number {
  return 15;
}

function getTotalExpenses(): number {
  return 3359.0;
}

function shouldShowExpenseAlert(): boolean {
  return getTotalExpenses() > 3000;
}

function getExpenseAlertMessage(): string {
  return "Gastos elevados";
}

function getExpenseAlertSeverity(): "error" | "warning" | "info" {
  const expenses = getTotalExpenses();
  if (expenses > 4000) return "error";
  if (expenses > 3000) return "warning";
  return "info";
}
