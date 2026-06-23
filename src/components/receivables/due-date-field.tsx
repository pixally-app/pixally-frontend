import { Calendar } from "lucide-react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { type AccountReceivableStatus } from "@/services/receivables";

const containerVariants = cva("rounded-lg border px-4 py-3", {
  variants: {
    status: {
      pendente: "bg-muted/40",
      vencido: "bg-destructive/10 border-destructive/30",
      pago: "bg-success/10 border-success/30",
    },
  },
  defaultVariants: { status: "pendente" },
});

const textVariants = cva("text-lg font-bold", {
  variants: {
    status: {
      pendente: "text-foreground",
      vencido: "text-destructive",
      pago: "text-success",
    },
  },
  defaultVariants: { status: "pendente" },
});

interface DueDateFieldProps {
  date: string;
  status: AccountReceivableStatus;
  className?: string;
}

function DueDateField({ date, status, className }: DueDateFieldProps) {
  return (
    <div className={cn(containerVariants({ status }), className)}>
      <p className="text-xs text-muted-foreground flex items-center gap-1.5 mb-1">
        <Calendar className="size-3.5" />
        Vencimento
      </p>
      <p className={textVariants({ status })}>{date}</p>
    </div>
  );
}

export { DueDateField };
