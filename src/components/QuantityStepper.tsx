"use client";

type QuantityStepperProps = {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
};

export default function QuantityStepper({
  quantity,
  onIncrement,
  onDecrement
}: QuantityStepperProps) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-2 py-1">
      <button type="button" className="btn-ghost" onClick={onDecrement}>
        -
      </button>
      <span className="min-w-[2rem] text-center text-sm">{quantity}</span>
      <button type="button" className="btn-ghost" onClick={onIncrement}>
        +
      </button>
    </div>
  );
}
