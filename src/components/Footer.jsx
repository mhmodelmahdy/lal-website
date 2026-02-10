import { company } from "../data/company";

export default function Footer({ lang }) {
  return (
    <footer className="border-t bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <p className="font-semibold">
          {company.name[lang]} — {company.tagline[lang]}
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          {company.phones.map((p) => (
            <a key={p} href={`tel:${p}`} className="px-3 py-2 rounded-full bg-gray-100 border text-sm">
              {p}
            </a>
          ))}
        </div>

        <p className="mt-4 text-sm text-gray-500">
          © {new Date().getFullYear()} All rights reserved.
        </p>
      </div>
    </footer>
  );
}
