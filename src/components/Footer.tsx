export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-base-900">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-6 text-sm text-gray-400 sm:flex-row">
        <p>
          <span className="font-semibold text-white">
            General<span className="text-brand-500">Builder</span>
          </span>{" "}
          — Building &amp; Construction Services
        </p>
        <p>© {new Date().getFullYear()} General Builder. All rights reserved.</p>
      </div>
    </footer>
  );
}
