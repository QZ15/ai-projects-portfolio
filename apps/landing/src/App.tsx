import Logo from './components/Logo'
import WaitlistForm from './components/WaitlistForm'
import { openCheckout } from './services/stripe'

const priceIdMonthly = import.meta.env.VITE_PRICE_ID_MONTHLY
const priceIdYearly = import.meta.env.VITE_PRICE_ID_YEARLY

export default function App() {
  return (
    <div className="min-h-screen bg-ink text-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4">
        <Logo />
        <a href="#pricing" className="text-sm hover:text-accent">
          Pricing
        </a>
      </nav>

      {/* Hero */}
      <header className="bg-grid px-6 py-20 text-center">
        <h1 className="text-4xl font-bold">Train smarter. Eat better.</h1>
        <p className="mt-4 text-gray-300">NutFit Premium optimizes your nutrition and workouts for real results.</p>
        <WaitlistForm />
        <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm">
          <span className="rounded-full bg-panel px-3 py-1">AI Meal Plans</span>
          <span className="rounded-full bg-panel px-3 py-1">Adaptive Workouts</span>
          <span className="rounded-full bg-panel px-3 py-1">Progress Insights</span>
        </div>
      </header>

      {/* Pricing */}
      <section id="pricing" className="px-6 py-20">
        <h2 className="mb-8 text-center text-3xl font-semibold">Pricing</h2>
        <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
          <div className="rounded-lg bg-panel p-6 shadow">
            <h3 className="text-xl font-bold">Free</h3>
            <ul className="mt-4 space-y-2 text-sm text-gray-300">
              <li>3 meals / week</li>
              <li>3 workouts / week</li>
              <li>Progress tracking</li>
            </ul>
            <button className="mt-6 w-full rounded-md bg-gray-600 px-4 py-2 text-sm opacity-50" disabled>
              Coming soon
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
              <button
                onClick={() => openCheckout(priceIdMonthly)}
                className="w-full rounded-md bg-accent px-4 py-2 font-medium text-black shadow-glow transition hover:opacity-90"
              >
                $7.99 / month
              </button>
              <button
                onClick={() => openCheckout(priceIdYearly)}
                className="w-full rounded-md bg-accent px-4 py-2 font-medium text-black shadow-glow transition hover:opacity-90"
              >
                $59.88 / year
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 px-6 py-8 text-center text-sm text-gray-500">
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
      </footer>
    </div>
  )
}
