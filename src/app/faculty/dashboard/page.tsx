import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { Users, BookOpen, Target, Gamepad2, PlusCircle, Activity } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function FacultyDashboardPage() {
  const totalStudents = await prisma.user.count({ where: { role: 'student' } });
  const activeModules = await prisma.module.count();
  const totalQuizzes = await prisma.quiz.count();
  const totalSimulations = await prisma.simulation.count();

  // Fetch recent activities
  const recentQuizAttempts = await prisma.quizAttempt.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { user: true, quiz: true }
  });

  const recentSimAttempts = await prisma.simulationAttempt.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { user: true, simulation: true }
  });

  const activities = [
    ...recentQuizAttempts.map(qa => ({
      name: qa.user.name,
      action: `completed ${qa.quiz.title} (Score: ${qa.score}/${qa.totalMarks})`,
      time: qa.createdAt,
      timestamp: qa.createdAt.getTime(),
    })),
    ...recentSimAttempts.map(sa => ({
      name: sa.user.name,
      action: `completed simulation ${sa.simulation.title}`,
      time: sa.createdAt,
      timestamp: sa.createdAt.getTime(),
    }))
  ]
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 5);

  const formatActivityTime = (date: Date) => {
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) + " " + date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900">Faculty Dashboard</h1>
          <p className="text-zinc-500 mt-1">Manage content and monitor student progress for HCI.</p>
        </div>
      </div>
 
      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="border-zinc-200">
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-500">Total Students</p>
              <h3 className="text-2xl font-bold">{totalStudents}</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="border-zinc-200">
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-500">Active Modules</p>
              <h3 className="text-2xl font-bold">{activeModules}</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="border-zinc-200">
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
              <Gamepad2 className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-500">Simulations</p>
              <h3 className="text-2xl font-bold">{totalSimulations}</h3>
            </div>
          </CardContent>
        </Card>
        <Card className="border-zinc-200">
          <CardContent className="p-6 flex items-center space-x-4">
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-500">Total Quizzes</p>
              <h3 className="text-2xl font-bold">{totalQuizzes}</h3>
            </div>
          </CardContent>
        </Card>
      </div>
 
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Quick Management */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Content Management</CardTitle>
            <CardDescription>Quick links to add or edit course material.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link href="/faculty/modules">
                <div className="p-4 rounded-lg border border-zinc-200 hover:border-primary/50 hover:bg-zinc-50 transition-colors flex flex-col items-center justify-center text-center h-full">
                  <BookOpen className="w-8 h-8 text-primary mb-2" />
                  <span className="font-medium text-zinc-900">Manage Modules</span>
                </div>
              </Link>
              <Link href="/faculty/simulations">
                <div className="p-4 rounded-lg border border-zinc-200 hover:border-primary/50 hover:bg-zinc-50 transition-colors flex flex-col items-center justify-center text-center h-full">
                  <Gamepad2 className="w-8 h-8 text-primary mb-2" />
                  <span className="font-medium text-zinc-900">Manage Simulations</span>
                </div>
              </Link>
              <Link href="/faculty/quizzes">
                <div className="p-4 rounded-lg border border-zinc-200 hover:border-primary/50 hover:bg-zinc-50 transition-colors flex flex-col items-center justify-center text-center h-full">
                  <Target className="w-8 h-8 text-primary mb-2" />
                  <span className="font-medium text-zinc-900">Manage Quizzes</span>
                </div>
              </Link>
              <Link href="/faculty/analytics">
                <div className="p-4 rounded-lg border border-zinc-200 hover:border-primary/50 hover:bg-zinc-50 transition-colors flex flex-col items-center justify-center text-center h-full">
                  <Activity className="w-8 h-8 text-primary mb-2" />
                  <span className="font-medium text-zinc-900">Student Analytics</span>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>
 
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Recent Student Activity</CardTitle>
            <CardDescription>Latest completions and milestones.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activities.length > 0 ? (
                activities.map((activity, i) => (
                  <div key={i} className="flex items-start space-x-3 pb-3 border-b border-zinc-100 last:border-0 last:pb-0">
                    <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                    <div>
                      <p className="text-sm text-zinc-800">
                        <span className="font-semibold">{activity.name}</span> {activity.action}
                      </p>
                      <p className="text-xs text-zinc-500">{formatActivityTime(new Date(activity.time))}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-zinc-500 text-center py-6">No recent student activity recorded yet.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

