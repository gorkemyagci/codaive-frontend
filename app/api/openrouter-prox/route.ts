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
  