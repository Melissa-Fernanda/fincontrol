"use client";

import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import {
  Home01Icon,
  Tick01Icon,
  Tv01Icon,
  School01Icon,
  Add01Icon,
  Edit01Icon,
  Delete01Icon,
} from "@/components/icons";
import type { IconSvgElement } from "@hugeicons/react";
import { FixedAccountModal } from "@/components/ui/FixedAccountModal";
import { FixedAccountDetailModal } from "@/components/ui/FixedAccountDetailModal";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import type { FixedAccountFormData } from "@/components/ui/FixedAccountModal";
import { useFinance, type FixedAccountItem } from "@/contexts/FinanceContext";

// --- DueDateItem ---

interface DueDateItemProps {
  title: string;
  subtitle: string;
  amount: string;
  icon: IconSvgElement;
  isPaid?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onCardClick?: () => void;
}

function DueDateItem({
  title,
  subtitle,
  amount,
  icon,
  isPaid = false,
  onEdit,
  onDelete,
  onCardClick,
}: DueDateItemProps) {
  const containerClasses = isPaid
    ? "bg-[var(--surface-card)] opacity-80 shadow-[var(--shadow-focus-success)] border-[var(--feedback-success-base)] z-10"
    : "bg-[var(--surface-card)] border-[var(--neutral-100)] hover:shadow-[var(--shadow-dropdown)] hover:-translate-y-0.5 cursor-pointer";

  const iconContainerClasses = isPaid
    ? "bg-[var(--feedback-success-base)]/10 text-[var(--feedback-success-base)]"
    : "bg-[var(--neutral-75)] text-[var(--neutral-text-muted)]";

  return (
    <div
      role={!isPaid && onCardClick ? "button" : undefined}
      tabIndex={!isPaid && onCardClick ? 0 : undefined}
      onClick={!isPaid && onCardClick ? onCardClick : undefined}
      onKeyDown={
        !isPaid && onCardClick
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onCardClick();
              }
            }
          : undefined
      }
      className={`relative rounded-[var(--radius-lg)] w-full shrink-0 border-[0.5px] border-solid transition-all ${containerClasses}`}
    >
      <div className="flex flex-row items-center p-[12px] gap-[8px] w-full h-full rounded-[var(--radius-lg)] overflow-hidden">
        <div
          className={`flex items-center justify-center p-[8px] rounded-[var(--radius-md)] shrink-0 size-[48px] ${iconContainerClasses}`}
        >
          <div className="relative size-[32px] flex items-center justify-center">
            <Icon icon={icon} size={28} className="shrink-0" />
          </div>
        </div>

        <div className="flex flex-1 items-center justify-between min-w-0 gap-2">
          <div className="flex flex-col items-start min-w-0">
            <p className="font-[var(--font-lexend)] font-normal text-sm text-[var(--neutral-700)] leading-normal truncate">
              {title}
            </p>
            <p className="font-[var(--font-lexend)] font-light text-xs text-[var(--neutral-text-muted)] leading-normal whitespace-pre-wrap">
              {subtitle}
            </p>
          </div>
          <div className="flex items-center gap-[8px] shrink-0">
            <p className="font-[var(--font-lexend)] font-normal text-sm text-[var(--neutral-700)] leading-normal tabular-nums">
              {amount}
            </p>
            <div className="flex min-w-[90px] justify-end gap-1">
              <button
                type="button"
                className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 text-[var(--neutral-icons-muted)] hover:text-[var(--brand-base)] transition-colors rounded-[var(--radius-md)]"
                aria-label="Editar"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit?.();
                }}
              >
                <Icon icon={Edit01Icon} size={24} />
              </button>
              <button
                type="button"
                className="min-w-[44px] min-h-[44px] flex items-center justify-center p-2 text-[var(--neutral-icons-muted)] hover:text-[var(--feedback-error-base)] transition-colors rounded-[var(--radius-md)]"
                aria-label="Excluir"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.();
                }}
              >
                <Icon icon={Delete01Icon} size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- UpcomingDueDates ---

const CATEGORY_ICONS: Record<string, IconSvgElement> = {
  Moradia: Home01Icon,
  Assinatura: Tv01Icon,
  Estudo: School01Icon,
  Saúde: Home01Icon,
  Transporte: Home01Icon,
  Outros: Home01Icon,
};

export type { FixedAccountItem } from "@/contexts/FinanceContext";

function formatDateForDisplay(isoDate: string): string {
  if (!isoDate || isoDate.length < 10) return isoDate;
  const [y, m, d] = isoDate.slice(0, 10).split("-");
  return `${d}/${m}/${y}`;
}

function formatSubtitle(item: FixedAccountItem): string {
  return item.date ? `${item.category} • ${formatDateForDisplay(item.date)}` : `${item.category} • ${item.recurrence}`;
}

export function UpcomingDueDates() {
  const {
    fixedAccounts: items,
    addFixedAccount,
    updateFixedAccount,
    deleteFixedAccount,
    markFixedAccountPaid,
  } = useFinance();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [detailItemId, setDetailItemId] = useState<number | null>(null);

  const formatAmount = (raw: string) =>
    raw.trim().startsWith("R$") ? raw.trim() : `R$ ${raw.trim()}`;

  const handleSubmit = (data: FixedAccountFormData) => {
    const payload = {
      ...data,
      amount: formatAmount(data.amount),
    };
    if (editingId != null) {
      updateFixedAccount(editingId, payload);
      setEditingId(null);
    } else {
      addFixedAccount(payload);
      setModalOpen(false);
    }
    onCloseModal();
  };

  const onCloseModal = () => {
    setModalOpen(false);
    setEditingId(null);
  };

  const handleDeleteConfirm = () => {
    if (deleteConfirmId == null) return;
    deleteFixedAccount(deleteConfirmId);
    setDeleteConfirmId(null);
  };

  const handleMarkAsPaid = (id: number) => {
    markFixedAccountPaid(id);
    setDetailItemId(null);
  };

  const editingItem = editingId != null ? items.find((i) => i.id === editingId) : null;
  const detailItem = detailItemId != null ? items.find((i) => i.id === detailItemId) : null;
  const modalOpenOrEditing = modalOpen || editingId != null;

  return (
    <div className="w-full h-full flex flex-col min-h-0 min-w-0">
      <div className="w-full flex-1 min-h-[560px] md:min-h-0 bg-[var(--surface-card)] rounded-[var(--radius-lg)] shadow-[var(--shadow-card)] border border-[var(--neutral-100)] p-0 flex flex-col gap-4">
        <div className="flex items-center justify-between w-full shrink-0 pt-4 px-4">
          <h2 className="font-[var(--font-lexend)] font-medium text-xl md:text-2xl leading-tight text-[var(--neutral-text-black)]">
            Próximos Vencimentos
          </h2>

          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="hidden md:flex h-[var(--height-control)] px-4 bg-[var(--brand-base)] hover:opacity-90 active:scale-[0.98] active:opacity-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--neutral-400)] transition-all duration-150 ease-out shadow-[var(--shadow-card)] gap-2 items-center rounded-[var(--radius-md)] shrink-0 text-white"
          >
            <Icon icon={Add01Icon} size={20} className="text-white shrink-0" />
            <span className="text-sm font-normal text-white">
              Nova Conta Fixa
            </span>
          </button>
        </div>

        <div className="w-full flex-1 min-h-0 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center py-12 px-4 text-center h-full">
              <p className="text-base md:text-lg font-medium text-[var(--neutral-text-black)]">
                Nenhuma conta fixa cadastrada
              </p>
              <p className="mt-2 text-sm font-light text-[var(--neutral-text-muted)] max-w-[480px]">
                Cadastre suas contas recorrentes (aluguel, luz, assinaturas) para acompanhar vencimentos e planejar seu orçamento.
              </p>
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="mt-4 h-[var(--height-control)] px-6 bg-[var(--brand-base)] rounded-[var(--radius-md)] text-white text-sm font-normal hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--neutral-400)]"
              >
                Adicionar conta fixa
              </button>
              <div className="mt-6 flex flex-1 min-h-0 items-center justify-center w-full">
                <img
                  src="/images/sem-conta-fixa.svg"
                  alt=""
                  className="h-full max-w-full w-auto object-contain"
                  style={{ height: "100%" }}
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2 pt-2 pb-24 md:pb-4 px-4">
              {items.map((item) => (
                <div key={item.id} className="min-w-0">
                  <DueDateItem
                    title={item.name}
                    subtitle={formatSubtitle(item)}
                    amount={item.amount}
                    icon={item.isPaid ? Tick01Icon : (CATEGORY_ICONS[item.category] ?? Home01Icon)}
                    isPaid={item.isPaid}
                    onEdit={() => setEditingId(item.id)}
                    onDelete={() => setDeleteConfirmId(item.id)}
                    onCardClick={!item.isPaid ? () => setDetailItemId(item.id) : undefined}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <FixedAccountModal
        open={modalOpenOrEditing}
        onClose={onCloseModal}
        onSubmit={handleSubmit}
        initialData={
          editingItem
            ? {
                name: editingItem.name,
                category: editingItem.category,
                amount: editingItem.amount,
                recurrence: editingItem.recurrence,
                date: editingItem.date,
                paymentMethod: editingItem.paymentMethod,
              }
            : undefined
        }
      />

      <ConfirmModal
        open={deleteConfirmId != null}
        title="Excluir conta fixa?"
        message="Esta ação não pode ser desfeita. A conta fixa será removida da lista."
        confirmLabel="Excluir"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteConfirmId(null)}
        variant="danger"
      />

      <FixedAccountDetailModal
        open={detailItemId != null}
        onClose={() => setDetailItemId(null)}
        item={detailItem ?? null}
        icon={detailItem ? (CATEGORY_ICONS[detailItem.category] ?? Home01Icon) : undefined}
        onMarkAsPaid={handleMarkAsPaid}
      />

      {/* Mobile: FAB Nova Conta Fixa */}
      <button
        type="button"
        onClick={() => setModalOpen(true)}
        className="md:hidden fixed fab-bottom right-6 z-30 w-14 h-14 min-w-[56px] min-h-[56px] rounded-full bg-[var(--brand-base)] text-white shadow-[var(--shadow-modal)] flex items-center justify-center hover:opacity-90 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--neutral-400)] focus-visible:ring-offset-2"
        aria-label="Adicionar conta fixa"
      >
        <Icon icon={Add01Icon} size={24} />
      </button>
    </div>
  );
}
