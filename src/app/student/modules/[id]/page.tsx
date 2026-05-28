import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, PlayCircle, FileText, CheckCircle2, Gamepad2, Target } from "lucide-react";
import { module1Quizzes } from "@/data/module1QuizData";
import { module2Quizzes } from "@/data/module2QuizData";


function getEmbedUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  if (url.includes("/embed/")) return url;
  
  if (url.includes("youtube.com/watch")) {
    try {
      const urlObj = new URL(url);
      const videoId = urlObj.searchParams.get("v");
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    } catch (e) {
      // ignore
    }
  }
  
  if (url.includes("youtu.be/")) {
    const parts = url.split("youtu.be/");
    if (parts.length > 1) {
      const videoId = parts[1].split(/[?#]/)[0];
      if (videoId) return `https://www.youtube.com/embed/${videoId}`;
    }
  }
  
  return url;
}

export default async function ModuleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const module = await prisma.module.findUnique({
    where: { id },
    include: {
      subtopics: {
        orderBy: { subtopicNo: 'asc' },
        include: {
          simulations: true,
          quizzes: true
        }
      }
    }
  });

  if (!module) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Link href="/student/modules" className="flex items-center text-sm font-medium text-zinc-500 hover:text-primary mb-6 transition-colors">
        <ChevronLeft className="w-4 h-4 mr-1" /> Back to Modules
      </Link>

      <div className="bg-white rounded-xl shadow-sm border border-zinc-200 p-8 mb-8">
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge className="bg-primary/10 text-primary border-none hover:bg-primary/20">{module.id.toUpperCase()}</Badge>
          <Badge variant="secondary">{module.co}</Badge>
          <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50">{module.hours} Hours</Badge>
        </div>
        <h1 className="text-3xl font-bold text-zinc-900 mb-4">{module.title}</h1>
        <p className="text-lg text-zinc-600">{module.description}</p>
      </div>

      <h2 className="text-2xl font-bold text-zinc-800 mb-6">Subtopics</h2>
      <div className="space-y-4">
        {module.subtopics.map((subtopic, index) => (
          <Card key={subtopic.id} className="overflow-hidden hover:border-primary/30 transition-colors bg-white">
            <div className="flex flex-col md:flex-row">
              <div className="bg-zinc-50 w-full md:w-16 flex items-center justify-center border-b md:border-b-0 md:border-r border-zinc-100 py-4 md:py-0 flex-shrink-0">
                <span className="text-2xl font-bold text-zinc-300">{index + 1}</span>
              </div>
              <div className="flex-1 p-6 flex flex-col">
                {/* Header: Title and description */}
                <div className="mb-4">
                  <CardTitle className="text-xl mb-2 text-zinc-800 font-bold">{subtopic.title}</CardTitle>
                  <CardDescription className="text-base text-zinc-600">{subtopic.description}</CardDescription>
                </div>

                {/* Big Embedded Video Player */}
                {subtopic.videoUrl && (
                  <div className="w-full mb-5">
                    <div className="w-full rounded-lg overflow-hidden border border-zinc-200 bg-zinc-950 aspect-video shadow-sm max-w-3xl mx-auto">
                      <iframe
                        src={getEmbedUrl(subtopic.videoUrl) || ""}
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        title={subtopic.title}
                      ></iframe>
                    </div>
                  </div>
                )}

                {/* Buttons row directly under the video player */}
                <div className="flex flex-wrap items-center gap-4 border-t border-zinc-100 pt-5 mt-auto">
                  {subtopic.notesUrl ? (
                    <a href={subtopic.notesUrl} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" className="bg-white hover:bg-zinc-50 border-zinc-200 text-sm font-bold h-11 px-6 shadow-sm">
                        <FileText className="w-5 h-5 mr-2 text-primary" /> Read Notes
                      </Button>
                    </a>
                  ) : (
                    <Button variant="outline" className="bg-white hover:bg-zinc-50 border-zinc-200 text-sm font-bold h-11 px-6 shadow-sm" disabled>
                      <FileText className="w-5 h-5 mr-2 text-zinc-300" /> Read Notes
                    </Button>
                  )}

                  {subtopic.id === 'st1-1' || subtopic.id === 'st1-2' || subtopic.id === 'st1-3' || subtopic.id === 'st2-1' || subtopic.id === 'st2-2' || subtopic.id === 'st2-3' || subtopic.id === 'st2-4' ? (
                    <Link href={`/student/simulations/${subtopic.id}`}>
                      <Button variant="outline" className="bg-white hover:bg-zinc-50 border-zinc-200 text-sm font-bold h-11 px-6 shadow-sm">
                        <Gamepad2 className="w-5 h-5 mr-2 text-blue-600" /> View Simulation
                      </Button>
                    </Link>
                  ) : subtopic.simulations && subtopic.simulations.length > 0 ? (
                    <Link href={`/student/simulations/${subtopic.simulations[0].id}`}>
                      <Button variant="outline" className="bg-white hover:bg-zinc-50 border-zinc-200 text-sm font-bold h-11 px-6 shadow-sm">
                        <Gamepad2 className="w-5 h-5 mr-2 text-blue-600" /> View Simulation
                      </Button>
                    </Link>
                  ) : (
                    <Button variant="outline" className="bg-white hover:bg-zinc-50 border-zinc-200 text-sm font-bold h-11 px-6 shadow-sm" disabled>
                      <Gamepad2 className="w-5 h-5 mr-2 text-zinc-300" /> View Simulation
                    </Button>
                  )}

                  {subtopic.id in module1Quizzes || subtopic.id in module2Quizzes ? (
                    <Link href={`/student/quizzes/${subtopic.id}`}>
                      <Button variant="outline" className="bg-white hover:bg-zinc-50 border-zinc-200 text-sm font-bold h-11 px-6 shadow-sm">
                        <Target className="w-5 h-5 mr-2 text-primary" /> Attempt Quiz
                      </Button>
                    </Link>
                  ) : subtopic.quizzes && subtopic.quizzes.length > 0 ? (
                    <Link href={`/student/quizzes/${subtopic.quizzes[0].id}`}>
                      <Button variant="outline" className="bg-white hover:bg-zinc-50 border-zinc-200 text-sm font-bold h-11 px-6 shadow-sm">
                        <Target className="w-5 h-5 mr-2 text-primary" /> Attempt Quiz
                      </Button>
                    </Link>
                  ) : (
                    <Button variant="outline" className="bg-white hover:bg-zinc-50 border-zinc-200 text-sm font-bold h-11 px-6 shadow-sm" disabled>
                      <Target className="w-5 h-5 mr-2 text-zinc-300" /> Attempt Quiz
                    </Button>
                  )}
                  
                  <Button variant="secondary" className="ml-auto text-green-750 bg-green-50 hover:bg-green-100 border border-green-200 text-sm font-bold h-11 px-6 shadow-sm">
                    <CheckCircle2 className="w-5 h-5 mr-2 text-green-600" /> Mark Completed
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
