import { ModuleCard } from "@/components/cards/ModuleCard";
import { BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";

import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ModulesPage() {
  const modules = await prisma.module.findMany({
    include: { subtopics: true },
    orderBy: { moduleNo: 'asc' },
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <Badge className="mb-2 bg-primary/10 text-primary hover:bg-primary/20 border-none">Syllabus</Badge>
        <h1 className="text-3xl font-bold text-zinc-900 flex items-center">
          <BookOpen className="w-8 h-8 mr-3 text-primary" />
          Learning Modules
        </h1>
        <p className="text-zinc-500 mt-2 text-lg">
          Master the concepts of User Interface Design across {modules.length} comprehensive modules.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module) => (
          <ModuleCard key={module.id} module={module} href={`/student/modules/${module.id}`} />
        ))}
      </div>
    </div>
  );
}
