export default async function SearchPage({
  params,
}: {
  params: Promise<{ q: string }>;
}) {
  const { q } = await params;
  return <div>SearchPage: {q}</div>;
}
