import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { SimulationContainer } from "./SimulationContainer";

export default async function SimulationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  if (id === 'st2-1') {
    const typedSimulation = {
      id: 'st2-1',
      title: 'Information Architecture and Application Structure',
      description: 'Explore the principles of organizing, structuring, and labeling content in an effective and sustainable way.',
      difficulty: 'Intermediate',
      xpReward: 100,
      estimatedTime: '15 mins',
      learningOutcome: 'Understand application structure and information hierarchies.',
      frontendUrl: 'https://simulation-21.vercel.app/',
    };
    return <SimulationContainer simulation={typedSimulation} category="Module 2: Principles of Good Screen Design" />;
  }

  if (id === 'st2-2') {
    const typedSimulation = {
      id: 'st2-2',
      title: 'Navigation, Signposts and Wayfinding Patterns',
      description: 'Explore the principles of creating clear navigation and wayfinding in digital interfaces.',
      difficulty: 'Intermediate',
      xpReward: 100,
      estimatedTime: '15 mins',
      learningOutcome: 'Understand how to use signposts and wayfinding to guide users.',
      frontendUrl: 'https://simulation-22.vercel.app/',
    };
    return <SimulationContainer simulation={typedSimulation} category="Module 2: Principles of Good Screen Design" />;
  }

  if (id === 'st2-3') {
    const typedSimulation = {
      id: 'st2-3',
      title: 'Layout of Page Elements',
      description: 'Explore grids, alignment, and visual hierarchy in structuring page components.',
      difficulty: 'Intermediate',
      xpReward: 100,
      estimatedTime: '15 mins',
      learningOutcome: 'Understand visual hierarchy and page layout designs.',
      frontendUrl: 'https://simulation-2-3.vercel.app/',
    };
    return <SimulationContainer simulation={typedSimulation} category="Module 2: Principles of Good Screen Design" />;
  }
  if (id === 'st2-4') {
    const typedSimulation = {
      id: 'st2-4',
      title: 'Arranging Content in List',
      description: 'Learn the best practices for structuring, scanning, and presenting content in lists and tables.',
      difficulty: 'Intermediate',
      xpReward: 100,
      estimatedTime: '15 mins',
      learningOutcome: 'Understand list structures and scanning behavior.',
      frontendUrl: 'https://simulation-2-4.vercel.app/',
    };
    return <SimulationContainer simulation={typedSimulation} category="Module 2: Principles of Good Screen Design" />;
  }

  const simulation = await prisma.simulation.findUnique({
    where: { id },
    include: { module: true }
  });

  if (!simulation) {
    notFound();
  }

  const category = simulation.module ? `Module ${simulation.module.moduleNo}: ${simulation.module.title}` : "General";

  // Cast type to match SimulationContainer expectations
  const typedSimulation = {
    id: simulation.id,
    title: simulation.title,
    description: simulation.description,
    difficulty: simulation.difficulty,
    xpReward: simulation.xpReward,
    estimatedTime: simulation.estimatedTime,
    learningOutcome: simulation.learningOutcome,
    frontendUrl: simulation.frontendUrl,
  };

  return <SimulationContainer simulation={typedSimulation} category={category} />;
}


