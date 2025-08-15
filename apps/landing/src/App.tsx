import Logo from './components/Logo'
import WaitlistForm from './components/WaitlistForm'

export default function App() {
  return (
    <div className="min-h-screen bg-ink text-white">
      <div className="mx-auto max-w-4xl p-4 sm:p-8">
        <div className="rounded-2xl border border-white/10 bg-panel p-6 sm:p-12 shadow">
          {/* Nav */}
          <nav className="flex items-center justify-between">
            <Logo />
            <a href="#pricing" className="text-sm hover:text-white/80">
              Pricing
            </a>
          </nav>

          {/* Hero */}
          <header className="mt-12 text-center">
            <h1 className="text-4xl font-bold">Train smarter. Eat better.</h1>
            <p className="mt-4 text-gray-300">
              NutFit Premium optimizes your nutrition and workouts for real results.
            </p>
            <WaitlistForm />
            <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm">
              <span className="rounded-full bg-ink px-3 py-1">AI Meal Plans</span>
              <span className="rounded-full bg-ink px-3 py-1">Adaptive Workouts</span>
              <span className="rounded-full bg-ink px-3 py-1">Progress Insights</span>
            </div>
          </header>

          {/* Download Section */}
          <section className="mt-12 text-center">
            <h2 className="mb-4 text-gray-400">Get the app</h2>
            <div className="flex justify-center gap-4">
              <img src="/app-store.svg" alt="App Store" className="h-12 w-auto" />
              <img src="/google-play.svg" alt="Google Play" className="h-12 w-auto" />
            </div>
          </section>

          {/* Pricing */}
          <section id="pricing" className="mt-16">
            <h2 className="mb-8 text-center text-3xl font-semibold">Pricing</h2>
            <div className="grid gap-8 md:grid-cols-2">
              <div className="rounded-lg bg-ink p-6 shadow">
                <h3 className="text-xl font-bold">Free</h3>
                <ul className="mt-4 space-y-2 text-sm text-gray-300">
                  <li>3 meals / week</li>
                  <li>7 workouts / week</li>
                  <li>Progress tracking</li>
                </ul>
                <button className="mt-6 w-full rounded-md bg-white px-4 py-2 font-medium text-black cursor-not-allowed">
                  Free
                </button>
              </div>
              <div className="rounded-lg bg-ink p-6 shadow shadow-glow">
                <h3 className="text-xl font-bold">Premium (Early)</h3>
                <ul className="mt-4 space-y-2 text-sm text-gray-300">
                  <li>Unlimited meals & workouts</li>
                  <li>AI coaching</li>
                  <li>Priority support</li>
                </ul>
                <div className="mt-6 space-y-2">
                  {/* Wire openCheckout(priceIdMonthly) when backend ready */}
                  <button className="w-full rounded-md bg-white px-4 py-2 font-medium text-black cursor-not-allowed">
                    $7.99 / month
                  </button>
                  {/* Wire openCheckout(priceIdYearly) when backend ready */}
                  <button className="w-full rounded-md bg-white px-4 py-2 font-medium text-black cursor-not-allowed">
                    $59.88 / year
                  </button>
                </div>
                <p className="mt-2 text-center text-xs text-gray-400">Purchase in app</p>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="mt-16 border-t border-white/10 pt-6 text-center text-sm text-gray-500">
            <p>&copy; {new Date().getFullYear()} NutFit. All rights reserved.</p>
            <div className="mt-2 flex justify-center gap-4">
              <a href="#" className="hover:text-white">
                Privacy
              </a>
              <a href="#" className="hover:text-white">
                Terms
              </a>
              <a href="#" className="hover:text-white">
                Contact
              </a>
            </div>
          </footer>
        </div>
      </div>
    </div>
  )
}
