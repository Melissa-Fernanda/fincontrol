// Ícones SVG para os cards financeiros

const svgPaths = {
  wallet: {
    circle: "M14.75 12.75C14.75 13.5784 15.4216 14.25 16.25 14.25C17.0784 14.25 17.75 13.5784 17.75 12.75C17.75 11.9216 17.0784 11.25 16.25 11.25C15.4216 11.25 14.75 11.9216 14.75 12.75Z",
    lock: "M17.65 6.75C17.7156 6.42689 17.75 6.09247 17.75 5.75C17.75 2.98858 15.5114 0.75 12.75 0.75C9.98858 0.75 7.75 2.98858 7.75 5.75C7.75 6.09247 7.78443 6.42689 7.85002 6.75",
    body: "M5.75 6.74324H14.75C17.5784 6.74324 18.9926 6.74324 19.8713 7.62234C20.75 8.50145 20.75 9.91634 20.75 12.7461V14.7471C20.75 17.5769 20.75 18.9918 19.8713 19.8709C18.9926 20.75 17.5784 20.75 14.75 20.75H8.75C4.97876 20.75 3.09315 20.75 1.92157 19.5779C0.750001 18.4057 0.750001 16.5192 0.750001 12.7461V10.7452C0.750001 6.97211 0.750001 5.08558 1.92157 3.91344C2.86466 2.9699 4.27043 2.78589 6.75 2.75H8.75",
  },
  arrowUp: "M7.75 9.83459C7.75 9.83459 9.95947 7.25001 10.75 7.25C11.5406 7.24999 13.75 9.83462 13.75 9.83462M7.75 14.25C7.75 14.25 9.95947 11.6654 10.75 11.6654C11.5406 11.6654 13.75 14.25 13.75 14.25",
  arrowDown: "M13.75 11.6654C13.75 11.6654 11.5405 14.25 10.75 14.25C9.95942 14.25 7.75 11.6654 7.75 11.6654M13.75 7.25002C13.75 7.25002 11.5405 9.83461 10.75 9.83462C9.95942 9.83462 7.75 7.25 7.75 7.25",
};

interface IconProps {
  className?: string;
}

interface RevenueExpenseIconProps extends IconProps {
  muted?: boolean;
}

export function WalletIcon({ className = "w-6 h-6" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 21.5 21.5" fill="none">
      <path
        d={svgPaths.wallet.circle}
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d={svgPaths.wallet.lock}
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d={svgPaths.wallet.body}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function RevenueIcon({ className = "w-6 h-6", muted = false }: RevenueExpenseIconProps) {
  const color = muted ? "currentColor" : "var(--feedback-success-base)";
  return (
    <svg className={className} viewBox="0 0 21.5 21.5" fill="none">
      <circle
        cx="10.75"
        cy="10.75"
        r="10"
        fill={color}
        fillOpacity={muted ? "0.08" : "0.08"}
        stroke={color}
        strokeOpacity={muted ? "0.2" : "0.08"}
        strokeWidth="1.5"
      />
      <path
        d={svgPaths.arrowUp}
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ExpensesIcon({ className = "w-6 h-6", muted = false }: RevenueExpenseIconProps) {
  const color = muted ? "currentColor" : "var(--feedback-error-base)";
  return (
    <svg className={className} viewBox="0 0 21.5 21.5" fill="none">
      <circle
        cx="10.75"
        cy="10.75"
        r="10"
        fill={color}
        fillOpacity={muted ? "0.08" : "0.08"}
        stroke={color}
        strokeOpacity={muted ? "0.2" : "0.08"}
        strokeWidth="1.5"
      />
      <path
        d={svgPaths.arrowDown}
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
