// Clerk
import { analyze } from "@/utils/ai";
import { findByClerkId } from "@/utils/auth";

// Prisma
import { prisma } from "@/utils/db";

// Server
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

export const POST = async () => {
  const user = await findByClerkId();
  const entry = await prisma.journalEntry.create({
    data: {
      userId: user.id,
      content: "Write about your day!",
    },
  });

  const analysis = await analyze(entry.content);
  await prisma.analysis.create({
    data: {
      userId: user.id,
      entryId: entry.id,
      mood: analysis?.mood,
      summary: analysis?.summary,
      color: analysis?.color,
      negative: analysis?.negative,
      subject: analysis?.subject,
      sentimentScore: analysis?.sentimentScore,
    },
  });

  revalidatePath("/journal");

  return NextResponse.json({ data: entry });
};
