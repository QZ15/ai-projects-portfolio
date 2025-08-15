// Placeholder Stripe checkout call. Wire to Firebase Functions later.
export async function openCheckout(priceId: string) {
  try {
    const res = await fetch(`${import.meta.env.VITE_FUNCTIONS_BASE_URL}/createCheckoutSession`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ priceId }),
    })
    const data = await res.json()
    if (data.url) {
      window.location.href = data.url
    } else {
      alert('Checkout temporarily unavailable.')
    }
  } catch (err) {
    console.error(err)
    alert('Checkout temporarily unavailable.')
  }
}
