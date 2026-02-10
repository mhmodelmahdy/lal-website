export default function PageTitle({ title, subtitle }) {
  return (
    <div className="mx-auto max-w-6xl px-4 pt-10">
      <h1 className="text-3xl font-bold">{title}</h1>
      {subtitle ? <p className="mt-2 text-gray-600 leading-8">{subtitle}</p> : null}
    </div>
  );
}
