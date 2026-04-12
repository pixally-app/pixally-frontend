"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, Pencil } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function ReceiptDetailsPage({
  params,
}: {
  params: { id: string };
}) {
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
        <h1 className="text-2xl font-bold">Detalhes do Comprovante</h1>
        <p className="text-sm text-muted-foreground">
          ID da Transação PIX: F34567890123456789012345678901BC
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
          <Card className="bg-success/10">
            <CardContent className="p-4">
              <Badge variant="success" className="text-sm px-3 py-1">
                Conciliado
              </Badge>
              <p className="text-sm text-muted-foreground mt-1">
                Vinculado a uma conta a receber
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-success font-semibold text-sm mb-1">
                <span>Conta a Receber Vinculada</span>
              </div>
              <p className="font-semibold">Instalação elétrica</p>
              <p className="text-sm text-muted-foreground">
                Cliente: Maria Santos | Valor: R$ 200,50
              </p>
              <Link
                href="/receivables"
                className="inline-flex items-center gap-1 text-sm font-medium text-primary mt-2"
              >
                Ver conta a receber
                <ArrowRight className="size-4" />
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex-row items-center justify-between">
              <CardTitle className="text-lg font-bold">
                Dados do Pagador
              </CardTitle>
              <Button variant="outline" size="sm">
                <Pencil className="size-4" />
                Editar
              </Button>
            </CardHeader>
            <CardContent>
              <dl className="space-y-3">
                <div className="flex justify-between">
                  <dt className="text-sm text-muted-foreground">Nome</dt>
                  <dd className="text-sm font-medium">Maria Santos</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-muted-foreground">Agência</dt>
                  <dd className="text-sm font-medium">0001</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-muted-foreground">Conta</dt>
                  <dd className="text-sm font-medium">34895931-5</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-muted-foreground">CPF/CNPJ</dt>
                  <dd className="text-sm font-medium">***.916.152.***</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-muted-foreground">Banco</dt>
                  <dd className="text-sm font-medium">NU PAGAMENTOS _ IP</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-muted-foreground">Valor</dt>
                  <dd className="text-sm font-semibold text-success">R$ 200,50</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-muted-foreground">Descrição</dt>
                  <dd className="text-sm font-medium text-right max-w-[60%]">
                    Pagamento referente ao serviço de automação
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-muted-foreground">Data e Hora do Pagamento</dt>
                  <dd className="text-sm font-medium">16/02/2026, 11:55:01</dd>
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
                  <dd className="text-sm font-medium">Melo Automação e Sistemas</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-muted-foreground">Banco:</dt>
                  <dd className="text-sm font-medium">BCO DO BRASIL S.A.</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-muted-foreground">CPF/CNPJ:</dt>
                  <dd className="text-sm font-medium">12.345.678/0001-90</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm text-muted-foreground">ID da Transação PIX:</dt>
                  <dd className="text-sm font-medium text-right max-w-[60%] break-all">
                    F345678901234567890123456789018C
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
