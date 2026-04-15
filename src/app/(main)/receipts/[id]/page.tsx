"use client";

import { use, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Pencil, Trash2, X, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { receipts, statusConfig, statusDescription } from "@/data/mock-receipts";
import { receivables } from "@/data/mock-receivables";

const statusBgColor: Record<string, string> = {
  conciliado: "bg-success/10",
  problema: "bg-destructive/10",
  alerta: "bg-warning/10",
  recebido: "bg-success/10",
  analisando: "bg-secondary/30",
};

export default function ReceiptDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const receipt = receipts.find((r) => r.id === id);

  const [isEditing, setIsEditing] = useState(false);
  const [payerData, setPayerData] = useState({
    clientName: receipt?.clientName ?? "",
    agency: receipt?.agency ?? "",
    account: receipt?.account ?? "",
    cpfCnpj: receipt?.cpfCnpj ?? "",
    clientBank: receipt?.clientBank ?? "",
    amount: receipt?.amount ?? "",
    description: receipt?.description ?? "",
  });

  if (!receipt) {
    return (
      <div className="space-y-6">
        <Link
          href="/receipts"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Voltar
        </Link>
        <h1 className="text-2xl font-bold">Comprovante não encontrado</h1>
      </div>
    );
  }

  const status = statusConfig[receipt.status];

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/receipts"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-2"
        >
          <ArrowLeft className="size-4" />
          Voltar
        </Link>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Detalhes do Comprovante</h1>
          {receipt.status === "problema" && (
            <ConfirmDialog
              trigger={
                <Button variant="destructive">
                  <Trash2 className="size-4" />
                  Deletar
                </Button>
              }
              title="Excluir comprovante"
              description="Tem certeza que deseja excluir este comprovante? Esta ação não pode ser desfeita."
              confirmLabel="Excluir"
              icon={<Trash2 className="size-4" />}
              onConfirm={() => {
                // TODO: integrar com API
              }}
            />
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          ID da Transação PIX: {receipt.transactionId}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-bold">
                Imagem do Comprovante
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center rounded-lg bg-muted h-[400px] text-muted-foreground text-sm">
                Imagem do comprovante
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className={statusBgColor[receipt.status]}>
            <CardContent className="p-4">
              <Badge variant={status.variant} className="text-sm px-3 py-1">
                {status.label}
              </Badge>
              <p className="text-sm text-muted-foreground mt-1">
                {statusDescription[receipt.status]}
              </p>
            </CardContent>
          </Card>

          {receipt.receivableId && (() => {
            const receivable = receivables.find((r) => r.id === receipt.receivableId);
            if (!receivable) return null;
            return (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-success font-semibold text-sm mb-1">
                    <span>Conta a Receber Vinculada</span>
                  </div>
                  <p className="font-semibold">{receivable.description}</p>
                  <p className="text-sm text-muted-foreground">
                    Cliente: {receivable.clientName} | Valor: {(receivable.amount / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                  </p>
                  <Link
                    href={`/receivables/${receivable.id}`}
                    className="inline-flex items-center gap-1 text-sm font-medium text-primary mt-2"
                  >
                    Ver conta a receber
                    <ArrowRight className="size-4" />
                  </Link>
                </CardContent>
              </Card>
            );
          })()}

          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle className="text-lg font-bold">
                Dados do Pagador
              </CardTitle>
              {isEditing ? (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setPayerData({
                        clientName: receipt.clientName,
                        agency: receipt.agency,
                        account: receipt.account,
                        cpfCnpj: receipt.cpfCnpj,
                        clientBank: receipt.clientBank,
                        amount: receipt.amount,
                        description: receipt.description,
                      });
                      setIsEditing(false);
                    }}
                  >
                    <X className="size-4" />
                    Cancelar
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      // TODO: integrar com API
                      setIsEditing(false);
                    }}
                  >
                    <Check className="size-4" />
                    Salvar
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  <Pencil className="size-4" />
                  Editar
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <dl className="space-y-3">
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-muted-foreground">Nome</dt>
                  {isEditing ? (
                    <Input
                      aria-label="Nome"
                      className="w-[60%] h-8 text-sm"
                      value={payerData.clientName}
                      onChange={(e) =>
                        setPayerData({ ...payerData, clientName: e.target.value })
                      }
                    />
                  ) : (
                    <dd className="text-sm font-medium">{payerData.clientName}</dd>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-muted-foreground">Agência</dt>
                  {isEditing ? (
                    <Input
                      aria-label="Agência"
                      className="w-[60%] h-8 text-sm"
                      value={payerData.agency}
                      onChange={(e) =>
                        setPayerData({ ...payerData, agency: e.target.value })
                      }
                    />
                  ) : (
                    <dd className="text-sm font-medium">{payerData.agency}</dd>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-muted-foreground">Conta</dt>
                  {isEditing ? (
                    <Input
                      aria-label="Conta"
                      className="w-[60%] h-8 text-sm"
                      value={payerData.account}
                      onChange={(e) =>
                        setPayerData({ ...payerData, account: e.target.value })
                      }
                    />
                  ) : (
                    <dd className="text-sm font-medium">{payerData.account}</dd>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-muted-foreground">CPF/CNPJ</dt>
                  {isEditing ? (
                    <Input
                      aria-label="CPF/CNPJ"
                      className="w-[60%] h-8 text-sm"
                      value={payerData.cpfCnpj}
                      onChange={(e) =>
                        setPayerData({ ...payerData, cpfCnpj: e.target.value })
                      }
                    />
                  ) : (
                    <dd className="text-sm font-medium">{payerData.cpfCnpj}</dd>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-muted-foreground">Banco</dt>
                  {isEditing ? (
                    <Input
                      aria-label="Banco"
                      className="w-[60%] h-8 text-sm"
                      value={payerData.clientBank}
                      onChange={(e) =>
                        setPayerData({ ...payerData, clientBank: e.target.value })
                      }
                    />
                  ) : (
                    <dd className="text-sm font-medium">{payerData.clientBank}</dd>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-muted-foreground">Valor</dt>
                  {isEditing ? (
                    <Input
                      aria-label="Valor"
                      className="w-[60%] h-8 text-sm"
                      value={payerData.amount}
                      onChange={(e) =>
                        setPayerData({ ...payerData, amount: e.target.value })
                      }
                    />
                  ) : (
                    <dd className="text-sm font-semibold text-success">
                      {payerData.amount}
                    </dd>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-muted-foreground">Descrição</dt>
                  {isEditing ? (
                    <Input
                      aria-label="Descrição"
                      className="w-[60%] h-8 text-sm"
                      value={payerData.description}
                      onChange={(e) =>
                        setPayerData({ ...payerData, description: e.target.value })
                      }
                    />
                  ) : (
                    <dd className="text-sm font-medium text-right max-w-[60%]">
                      {payerData.description}
                    </dd>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-muted-foreground">
                    Data e Hora do Pagamento
                  </dt>
                  <dd className="text-sm font-medium">
                    {receipt.date}, {receipt.time}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-bold">
                Dados do Recebedor
              </CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-3">
                <div className="flex justify-between">
                  <dt className="text-sm text-muted-foreground">Nome:</dt>
                  <dd className="text-sm font-medium">{receipt.receiverName}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-muted-foreground">Banco:</dt>
                  <dd className="text-sm font-medium">{receipt.receiverBank}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-muted-foreground">CPF/CNPJ:</dt>
                  <dd className="text-sm font-medium">{receipt.receiverCpfCnpj}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-muted-foreground">ID da Transação PIX:</dt>
                  <dd className="text-sm font-medium text-right max-w-[60%] break-all">
                    {receipt.receiverPixId}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
