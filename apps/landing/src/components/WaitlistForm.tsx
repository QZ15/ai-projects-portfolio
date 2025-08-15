import { useState } from 'react'
import { addToWaitlist } from '../firebase'

export default function WaitlistForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setStatus('loading')
    try {
      await addToWaitlist(email)
      setStatus('success')
      setEmail('')
    } catch (err) {
      console.error(err)
      setStatus('error')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm mx-auto mt-4" aria-label="waitlist form">
      <label htmlFor="email" className="sr-only">
        Email
      </label>
      <div className="flex gap-2">
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 rounded-md bg-panel p-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent"
          placeholder="you@example.com"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="rounded-md bg-accent px-4 py-2 font-medium text-black shadow-glow transition hover:opacity-90 disabled:opacity-50"
        >
          {status === 'loading' ? '...' : 'Join'}
        </button>
      </div>
      <p className="h-5 pt-2 text-sm" aria-live="polite">
        {status === 'success' && 'Thanks! We\'ll be in touch.'}
        {status === 'error' && 'Something went wrong. Try again.'}
      </p>
    </form>
  )
}
