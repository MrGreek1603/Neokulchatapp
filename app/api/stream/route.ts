import { NextRequest, NextResponse } from "next/server";

const clients = new Map<string, Response[]>();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const chatId = searchParams.get("chatId");
  if (!chatId) return new NextResponse("Missing chatId", { status: 400 });

  const stream = new TransformStream();
  const writer = stream.writable.getWriter();
  const encoder = new TextEncoder();

  if (!clients.has(chatId)) clients.set(chatId, []);
  clients.get(chatId)!.push(writer as unknown as Response);

  const interval = setInterval(() => {
    writer.write(encoder.encode(": keep-alive\n\n"));
  }, 15000); // keep-alive every 15s

  req.signal.addEventListener("abort", () => {
    clearInterval(interval);
    const arr = clients.get(chatId)!;
    clients.set(
      chatId,
      arr.filter((w) => w !== (writer as unknown as Response)),
    );
    writer.close();
  });

  return new NextResponse(stream.readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}

export async function PUT(req: NextRequest) {
  const { chatId, message } = await req.json();
  if (!chatId || !message)
    return new NextResponse("Missing data", { status: 400 });

  const writers = clients.get(chatId) || [];
  const encoder = new TextEncoder();
  for (const writer of writers) {
    (writer as unknown as WritableStreamDefaultWriter).write(
      encoder.encode(`data: ${message}\n\n`),
    );
  }

  return NextResponse.json({ success: true });
}
