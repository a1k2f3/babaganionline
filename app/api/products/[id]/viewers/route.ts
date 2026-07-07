import { NextRequest } from 'next/server';

// In-memory store (for development)
// For production, use Redis or your database
const activeViewers = new Map<string, number>();

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Increase count (you can make this smarter)
  const current = activeViewers.get(id) || Math.floor(Math.random() * 5) + 1;
  activeViewers.set(id, Math.min(current + 1, 25)); // cap at 25

  // Optional: clean old viewers (simple version)
  setTimeout(() => {
    const count = activeViewers.get(id) || 1;
    activeViewers.set(id, Math.max(count - 1, 1));
  }, 30000); // remove after 30 seconds

  return Response.json({
    count: activeViewers.get(id) || 3,
    productId: id
  });
}