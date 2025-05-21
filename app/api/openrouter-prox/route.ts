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
  