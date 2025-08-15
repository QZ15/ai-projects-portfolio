import Logo from './components/Logo'
import WaitlistForm from './components/WaitlistForm'

export default function App() {
  return (
    <div className="min-h-screen bg-ink text-white">
      {/* Nav */}
      <nav className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
        <Logo />
        <a href="#pricing" className="text-sm hover:text-accent">
          Pricing
        </a>
      </nav>

      {/* Hero */}
      <header className="bg-grid">
        <div className="mx-auto max-w-3xl px-4 py-20 text-center">
          <h1 className="text-4xl font-bold">Train smarter. Eat better.</h1>
          <p className="mt-4 text-gray-300">NutFit Premium optimizes your nutrition and workouts for real results.</p>
          <WaitlistForm />
          <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm">
            <span className="rounded-full bg-panel px-3 py-1">AI Meal Plans</span>
            <span className="rounded-full bg-panel px-3 py-1">Adaptive Workouts</span>
            <span className="rounded-full bg-panel px-3 py-1">Progress Insights</span>
          </div>
        </div>
      </header>

      {/* Download Section */}
      <section className="mx-auto max-w-3xl px-4 py-10 text-center">
        <h2 className="mb-4 text-gray-400">Get the app</h2>
        <div className="flex justify-center gap-4">
          <a href="#" aria-label="Download on the App Store">
            <img
              src="https://linkmaker.itunes.apple.com/assets/shared/badges/en-us/appstore-lrg.svg"
              alt="Download on the App Store"
              className="h-12 w-auto"
            />
          </a>
          <a href="#" aria-label="Get it on Google Play">
            <img
              src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
              alt="Get it on Google Play"
              className="h-12 w-auto"
            />
          </a>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="mx-auto max-w-3xl px-4 py-20">
        <h2 className="mb-8 text-center text-3xl font-semibold">Pricing</h2>
        <div className="grid gap-8 md:grid-cols-2">
          <div className="rounded-lg bg-panel p-6 shadow">
            <h3 className="text-xl font-bold">Free</h3>
            <ul className="mt-4 space-y-2 text-sm text-gray-300">
              <li>3 meals / week</li>
              <li>7 workouts / week</li>
              <li>Progress tracking</li>
            </ul>
            <button className="mt-6 w-full rounded-md bg-accent px-4 py-2 font-medium text-black shadow-glow cursor-default">
              Free
            </button>
          </div>
          <div className="rounded-lg bg-panel p-6 shadow shadow-glow">
            <h3 className="text-xl font-bold text-accent">Premium (Early)</h3>
            <ul className="mt-4 space-y-2 text-sm text-gray-300">
              <li>Unlimited meals & workouts</li>
              <li>AI coaching</li>
              <li>Priority support</li>
            </ul>
            <div className="mt-6 space-y-2">
              {/* Wire openCheckout(priceIdMonthly) when backend ready */}
              <button
                disabled
                className="w-full rounded-md bg-accent px-4 py-2 font-medium text-black opacity-60 cursor-not-allowed"
              >
                $7.99 / month
              </button>
              {/* Wire openCheckout(priceIdYearly) when backend ready */}
              <button
                disabled
                className="w-full rounded-md bg-accent px-4 py-2 font-medium text-black opacity-60 cursor-not-allowed"
              >
                $59.88 / year
              </button>
            </div>
            <p className="mt-2 text-center text-xs text-gray-400">Purchase in app</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800">
        <div className="mx-auto max-w-3xl px-4 py-8 text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} NutFit. All rights reserved.</p>
          <div className="mt-2 flex justify-center gap-4">
            <a href="#" className="hover:text-accent">
              Privacy
            </a>
            <a href="#" className="hover:text-accent">
              Terms
            </a>
            <a href="#" className="hover:text-accent">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
