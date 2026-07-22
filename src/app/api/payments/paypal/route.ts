import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()

  const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
  const paypalSecret = process.env.PAYPAL_CLIENT_SECRET
  const mode = process.env.PAYPAL_MODE || 'sandbox'
  const baseUrl = mode === 'sandbox'
    ? 'https://api-m.sandbox.paypal.com'
    : 'https://api-m.paypal.com'

  try {
    // Get PayPal access token
    const authResponse = await fetch(`${baseUrl}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(`${paypalClientId}:${paypalSecret}`).toString('base64')}`,
      },
      body: 'grant_type=client_credentials',
    })

    const { access_token } = await authResponse.json()

    // Create PayPal order
    const orderResponse = await fetch(`${baseUrl}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: body.currency || 'USD',
              value: body.amount,
            },
            description: body.product_name,
          },
        ],
        application_context: {
          return_url: `${request.headers.get('origin')}/dashboard?payment=success`,
          cancel_url: `${request.headers.get('origin')}/dashboard?payment=cancelled`,
        },
      }),
    })

    const order = await orderResponse.json()

    if (order.error) {
      return NextResponse.json({ error: order.error.message }, { status: 500 })
    }

    const approveLink = order.links?.find((l: { rel: string }) => l.rel === 'approve')

    return NextResponse.json({
      orderId: order.id,
      approveUrl: approveLink?.href,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Payment failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
