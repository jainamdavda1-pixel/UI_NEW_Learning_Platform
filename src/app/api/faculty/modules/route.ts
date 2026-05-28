import { NextResponse } from "next/server";
import { getOrCreateUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const user = await getOrCreateUser();
    if (!user || user.role !== "faculty") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const { moduleNo, title, hours, co, description, subtopics } = body;

    if (!title || !moduleNo || !description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const createdModule = await prisma.module.create({
      data: {
        moduleNo: Number(moduleNo),
        title,
        hours: Number(hours || 0),
        co: co || "",
        description,
        subtopics: {
          create: (subtopics || []).map((st: any, index: number) => ({
            subtopicNo: st.subtopicNo || `${moduleNo}.${index + 1}`,
            title: st.title,
            description: st.description || "",
            videoUrl: st.videoUrl || null,
            notesUrl: st.notesUrl || null,
            learningOutcome: st.learningOutcome || null,
            referenceUrl: st.referenceUrl || null,
          })),
        },
      },
      include: {
        subtopics: true,
      },
    });

    return NextResponse.json({ success: true, module: createdModule });
  } catch (error: any) {
    console.error("Error creating module:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
