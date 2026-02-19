import { NextResponse } from 'next/server'
import type { ZodError } from 'zod'

export function json(data: unknown, init?: ResponseInit) {
  return NextResponse.json(data, init)
}

export function zodError(err: ZodError, status = 400) {
  return json(
    {
      error: 'VALIDATION_ERROR',
      details: err.issues.map((i) => ({
        path: i.path.join('.'),
        message: i.message,
      })),
    },
    { status },
  )
}
