import { AppError } from "../utils/AppError";

export const suggestTask = async (input: string) => {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "openai/gpt-oss-20b",
      messages: [
        {
          role: "system",
          content:
            'You turn short task notes into a clear task. Reply ONLY with JSON: {"title": "...", "description": "..."}. Title under 60 chars. Description one short sentence, or empty string if nothing useful to add.',
        },
        { role: "user", content: input },
      ],
      temperature: 0.3,
    }),
  });

  if (!res.ok) throw new AppError(502, "AI suggestion failed, try again");

  const data = await res.json();
  const raw = data.choices?.[0]?.message?.content;

  try {
    const parsed = JSON.parse(raw);
    return { title: String(parsed.title ?? input), description: String(parsed.description ?? "") };
  } catch {
    throw new AppError(502, "AI suggestion failed, try again");
  }
};