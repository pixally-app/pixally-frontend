"use client";

import { useRef, useState, useCallback } from "react";
import { toast } from "sonner";
import { ArrowUpFromLine, CircleCheckBig } from "lucide-react";
import { cn } from "@/lib/utils";

const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/jpg", "application/pdf"];
const MAX_SIZE_MB = 10;

const steps = [
  "Upload manual ou captura automática via WhatsApp",
  "IA extrai os dados do comprovante",
  "Conciliação automática com contas a receber",
];

export function UploadReceipt() {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast.error("Tipo de arquivo não suportado. Envie PNG, JPG ou PDF.");
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      toast.error(`Arquivo muito grande. O tamanho máximo é ${MAX_SIZE_MB}MB.`);
      return;
    }
    // TODO: processar arquivo
    toast.success(`Arquivo "${file.name}" recebido com sucesso.`);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
      e.target.value = "";
    },
    [handleFile]
  );

  return (
    <div className="flex h-full flex-col gap-5">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          "flex w-full flex-1 flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-12 text-center transition-colors cursor-pointer",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50"
        )}
      >
        <div className="rounded-full bg-muted p-3 text-muted-foreground">
          <ArrowUpFromLine className="size-6" />
        </div>
        <div>
          <p className="text-sm font-medium">
            Arraste um arquivo
            <br />
            ou clique para selecionar
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            PNG, JPG ou PDF até 10MB
          </p>
        </div>
      </button>

      <input
        ref={inputRef}
        type="file"
        accept=".png,.jpg,.jpeg,.pdf"
        className="hidden"
        onChange={handleChange}
      />

      <div className="space-y-3">
        <p className="text-sm font-bold">Como funciona?</p>
        <ul className="space-y-4">
          {steps.map((step) => (
            <li key={step} className="flex items-start gap-5">
              <CircleCheckBig className="mt-0.5 size-4 shrink-0 text-success" />
              <span className="text-sm text-muted-foreground">{step}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
