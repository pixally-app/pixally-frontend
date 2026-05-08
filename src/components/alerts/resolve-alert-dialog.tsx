"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

interface ResolveAlertDialogProps {
  trigger: React.ReactNode;
  onConfirm: (reason: string) => void;
}

export function ResolveAlertDialog({
  trigger,
  onConfirm,
}: ResolveAlertDialogProps) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");

  function handleConfirm() {
    onConfirm(reason);
    setReason("");
    setOpen(false);
  }

  function handleOpenChange(value: boolean) {
    setOpen(value);
    if (!value) setReason("");
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Resolver Alerta</DialogTitle>
          <DialogDescription>
            Informe a justificativa para resolver este alerta.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 py-2">
          <Label htmlFor="resolve-reason">Justificativa</Label>
          <Textarea
            id="resolve-reason"
            placeholder="Descreva a resolução..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancelar</Button>
          </DialogClose>
          <Button onClick={handleConfirm} disabled={reason.trim().length === 0}>
            Resolver
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
