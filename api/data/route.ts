// This is a placeholder file to resolve build errors.
// The application uses client-side localStorage and does not fetch from this API route.

// Using Next.js API route syntax for compatibility.
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  return NextResponse.json({ message: 'API is healthy. Data is managed on the client-side.' });
}
