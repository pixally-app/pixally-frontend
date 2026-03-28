import { MessageCircle } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
      <div className="mb-20 flex flex-col items-center gap-2">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-7 w-7 md:h-10 md:w-10 text-primary" />
          <span className="text-3xl md:text-5xl font-bold text-primary">Pixally</span>
        </div>
        <p className="text-sm text-muted-foreground">
          Sistema de gestão de comprovantes PIX
        </p>
      </div>

      {children}
    </div>
  );
}
