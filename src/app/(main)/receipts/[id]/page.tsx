export default function ReceiptDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  return <h1>Comprovante {params.id}</h1>;
}
