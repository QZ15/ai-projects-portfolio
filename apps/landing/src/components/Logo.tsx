export default function Logo() {
  return (
    <div className="flex items-center gap-2 text-xl font-semibold text-accent">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-6 w-6"
      >
        <path d="M12 2c-1.5 0-2.8 1.2-3 2.7C7 5 6 6.4 6 8c0 4 3 7 6 7s6-3 6-7c0-1.6-1-3-3-3.3A3 3 0 0012 2z" />
        <rect x="1" y="11" width="5" height="2" rx="1" />
        <rect x="18" y="11" width="5" height="2" rx="1" />
        <rect x="5" y="10" width="14" height="4" rx="1" />
      </svg>
      <span className="tracking-wide">NutFit Premium</span>
    </div>
  )
}
