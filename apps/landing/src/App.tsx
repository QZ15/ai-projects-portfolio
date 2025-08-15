import WaitlistForm from './components/WaitlistForm'

export default function App() {
  return (
    <div className="min-h-screen bg-[#0f1115] text-white">
      <div className="mx-auto max-w-4xl p-4 sm:p-8">
        {/* Large page card */}
        <div className="rounded-2xl border border-white/10 bg-panel shadow overflow-hidden">

          <header className="h-20 w-full bg-white/5">
            <div className="mx-auto max-w-4xl h-full px-6 flex items-center justify-center">
              <div className="flex items-center">
                <img
                  src="/landing/images/logo.png"
                  alt="NutFit logo"
                  className="block h-8 sm:h-8 w-auto max-w-full sm:-translate-y-[1px]"
                />
                <span className="ml-1 text-2xl font-semibold leading-none tracking-tight">
                  NutFit
                </span>
              </div>
            </div>
          </header>

          {/* Hero (fit by width, slight top/bottom crop, centered) */}
          <section
            aria-label="Hero"
            className="relative w-full h-64 sm:h-80 md:h-96 overflow-hidden"
          >
            {/* Image layer: width = 100%, height auto */}
            <div
              className="
                absolute inset-0
                bg-[url('/landing/images/hero-bw.png')]
                bg-no-repeat
                bg-center
                [background-size:100%_auto]
                blur-[3px]
              "
            />

            {/* Gradients */}
            <div className="absolute inset-0 bg-gradient-to-tr from-black/65 via-black/35 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/15 to-black/40" />

            {/* Centered text */}
            <div className="absolute inset-0 flex items-center justify-center text-center px-6">
              <div>
                <h1 className="text-4xl sm:text-5xl font-bold">Train Smarter. Eat Better.</h1>
                <p className="mt-3 text-lg text-gray-200 max-w-2xl mx-auto">
                  AI‑powered fitness & nutrition plans tailored to your goals.
                </p>
              </div>
            </div>
          </section>

          <main className="p-6 sm:p-12">
            {/* What We Offer */}
            <section className="text-center">
              <h2 className="text-2xl font-semibold">What We Offer</h2>
              <p className="mt-2 text-gray-300">Smarter planning. Real results.</p>

              <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm">
                {[
                  'AI Meal Plans','Adaptive Workouts','Progress Insights','Smart Grocery List',
                  'Recipe Suggestions','Photo → Meal','Ingredient Generator','Favorite Meals',
                  'Custom Workout Splits','Apple Watch Recovery','Habit Streaks','Schedule & Reminders'
                ].map((f) => (
                  <span
                    key={f}
                    className="rounded-full bg-white/[0.06] px-3 py-1 border border-white/10"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </section>

            {/* Newsletter + Get the App cards side by side */}
            <section className="mt-16">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                
                {/* Newsletter card */}
                <div className="rounded-xl bg-white/[0.05] border border-white/10 p-5 text-center flex flex-col">
                  <h3 className="text-base font-medium">Sign Up For Development Updates</h3>
                  <p className="mt-3 text-sm text-gray-300">
                    Be first to know when iOS/Android go live and get early-access offers.
                  </p>
                  <div className="mt-3 flex-1">
                    <WaitlistForm />
                  </div>
                </div>

                {/* Get the app card */}
                <div className="rounded-xl bg-white/[0.04] border border-white/10 p-6 text-center flex flex-col">
                  <h3 className="text-base font-medium">Get The App</h3>
                  <p className="mt-2 text-sm text-gray-300">iOS and Android coming soon.</p>
                  <div className="mt-10 mb-2 flex justify-center gap-2 flex-1 items-center">
                    <img
                      src="/landing/images/app-store-badge.png"
                      alt="Download on the App Store"
                      className="h-10 sm:h-10 w-auto max-w-full"
                    />
                    <img
                      src="/landing/images/google-play-badge.png"
                      alt="Get it on Google Play"
                      className="h-10 sm:h-10 w-auto max-w-full"
                    />
                  </div>
                </div>

              </div>
            </section>

            {/* Testimonials (with placeholder user images) */}
            <section className="mt-16">
              <h3 className="text-2xl font-semibold text-center">What Early Users Are Saying</h3>
              <div className="mt-6 grid gap-6 md:grid-cols-2">
                <article className="rounded-xl bg-white/[0.05] border border-white/10 p-5">
                  <p className="text-gray-200">
                    “AI Meal Plans nailed my macros and budget. I just follow the plan and the
                    Smart Grocery List keeps me on track.”
                  </p>
                  <div className="mt-4 flex items-center gap-3">
                    <img
                      src="/landing/images/testimonial2.png"
                      alt="Ava R."
                      className="h- nine w- nine rounded-full bg-white/10"
                      style={{height: '36px', width: '36px'}}
                    />
                    <div>
                      <div className="font-medium">Ava R.</div>
                      <div className="text-xs text-gray-400">Muscle gain • Toronto</div>
                    </div>
                  </div>
                </article>

                <article className="rounded-xl bg-white/[0.05] border border-white/10 p-5">
                  <p className="text-gray-200">
                    “Adaptive Workouts reshuffled my week after I missed a day. Hit PRs without
                    feeling behind.”
                  </p>
                  <div className="mt-4 flex items-center gap-3">
                    <img
                      src="/landing/images/testimonial1.png"
                      alt="Marcus T."
                      className="rounded-full"
                      style={{height: '36px', width: '36px'}}
                    />
                    <div>
                      <div className="font-medium">Marcus T.</div>
                      <div className="text-xs text-gray-400">Strength • NYC</div>
                    </div>
                  </div>
                </article>

                <article className="rounded-xl bg-white/[0.05] border border-white/10 p-5">
                  <p className="text-gray-200">
                    “Meals from fridge ingredients is wild. I add the food from my fridge and get balanced meals with macros in seconds.”
                  </p>
                  <div className="mt-4 flex items-center gap-3">
                    <img
                      src="/landing/images/testimonial4.png"
                      alt="Lena S."
                      className="rounded-full"
                      style={{height: '36px', width: '36px'}}
                    />
                    <div>
                      <div className="font-medium">Lena S.</div>
                      <div className="text-xs text-gray-400">Busy schedule • Chicago</div>
                    </div>
                  </div>
                </article>

                <article className="rounded-xl bg-white/[0.05] border border-white/10 p-5">
                  <p className="text-gray-200">
                    “Progress Insights gives short, actionable notes that keep me consistent week to week.”
                  </p>
                  <div className="mt-4 flex items-center gap-3">
                    <img
                      src="/landing/images/testimonial3.png"
                      alt="Daniel W."
                      className="rounded-full"
                      style={{height: '36px', width: '36px'}}
                    />
                    <div>
                      <div className="font-medium">Daniel W.</div>
                      <div className="text-xs text-gray-400">Cutting • Vancouver</div>
                    </div>
                  </div>
                </article>
              </div>
            </section>

            {/* Pricing (expanded feature lists) */}
            <section id="pricing" className="mt-16">
              <div className="rounded-xl bg-white/[0.05] border border-white/10 p-6">
                <h3 className="mb-6 text-center text-3xl font-semibold">Pricing</h3>
                <div className="grid gap-8 md:grid-cols-2">
                  {/* Free */}
                  <div className="rounded-lg bg-white/[0.04] p-6 border border-white/10">
                    <h4 className="text-xl font-bold">Free</h4>
                    <ul className="mt-4 space-y-2 text-sm text-gray-300">
                      <li>3 AI meal plans / week</li>
                      <li>7 adaptive workouts / week</li>
                      <li>Basic progress tracking</li>
                      <li>Smart grocery list (limited)</li>
                      <li>Save favorite meals (up to 10)</li>
                      <li>Starter workout splits</li>
                      <li>Reminders & schedule</li>
                    </ul>
                    <div className="mt-6 w-full rounded-md bg-white text-black px-4 py-2 font-medium text-center select-none">
                      Free
                    </div>
                  </div>

                  {/* Premium */}
                  <div className="rounded-lg bg-white/[0.04] p-6 border border-white/10">
                    <h4 className="text-xl font-bold">Premium (Early)</h4>
                    <ul className="mt-4 space-y-2 text-sm text-gray-300">
                      <li>Unlimited AI meal plans</li>
                      <li>Unlimited adaptive workouts</li>
                      <li>AI coaching & progress insights</li>
                      <li>Smart grocery list (full)</li>
                      <li>Recipe suggestions & swaps</li>
                      <li>Photo → Meal recognition</li>
                      <li>Ingredient generator</li>
                      <li>Unlimited favorites & custom plans</li>
                      <li>Custom workout splits + deloads</li>
                      <li>Priority support</li>
                    </ul>
                    <div className="mt-6 space-y-2">
                      <div className="w-full rounded-md bg-white text-black px-4 py-2 font-medium text-center select-none">
                        $7.99 / month
                      </div>
                      <div className="w-full rounded-md bg-white text-black px-4 py-2 font-medium text-center select-none">
                        $59.99 / year
                      </div>
                    </div>
                    <p className="mt-2 text-center text-xs text-gray-400">Purchase in app</p>
                  </div>
                </div>
              </div>
            </section>
          </main>

          {/* Footer (NutFit only, aligned) */}
          <footer className="bg-white/[0.03] px-6 py-8 border-t border-white/10">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
              <div className="mt-4 flex-1">
                <div className="flex items-center">
                  <img
                    src="/landing/images/logo.png"
                    alt="NutFit logo"
                    className="block h-8 sm:h-8 w-auto max-w-full sm:-translate-y-[1px]"
                  />
                  <span className="ml-1 text-2xl font-semibold leading-none tracking-tight">
                    NutFit
                  </span>
                </div>
                <p className="mt-3 text-sm text-gray-300 max-w-sm">
                  AI-powered fitness & nutrition for real, sustainable results.
                </p>
              </div>

              <div className="flex-1 grid grid-cols-2 gap-8 text-sm">
                <div>
                  <div className="font-semibold text-gray-400 uppercase tracking-wider">Explore</div>
                  <ul className="mt-3 space-y-2">
                    <li><a href="#pricing" className="text-gray-300 hover:text-white/80">Pricing</a></li>
                    <li><a href="#" className="text-gray-300 hover:text-white/80">Features</a></li>
                    <li><a href="#" className="text-gray-300 hover:text-white/80">Roadmap</a></li>
                  </ul>
                </div>
                <div>
                  <div className="font-semibold text-gray-400 uppercase tracking-wider">Legal</div>
                  <ul className="mt-3 space-y-2">
                    <li><a href="#" className="text-gray-300 hover:text-white/80">Privacy</a></li>
                    <li><a href="#" className="text-gray-300 hover:text-white/80">Terms</a></li>
                    <li><a href="#" className="text-gray-300 hover:text-white/80">Contact</a></li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="mt-6 border-t border-white/10 pt-4 text-center text-xs text-gray-400">
              © {new Date().getFullYear()} NutFit — All rights reserved.
            </div>
          </footer>

        </div>
      </div>
    </div>
  )
}
