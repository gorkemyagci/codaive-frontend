export async function POST(request: Request) {
  const body = await request.json();
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer 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',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  const data = await response.json();
  return new Response(JSON.stringify(data), { status: 200 });
}
  