import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Activity, Star, Target, Gamepad2, Award } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function FacultyAnalyticsPage() {
  // Fetch all students and their attempts
  const students = await prisma.user.findMany({
    where: { role: "student" },
    include: {
      quizAttempts: true,
      simulationAttempts: true,
      userBadges: true,
    },
    orderBy: { xp: "desc" },
  });

  // Aggregations
  const totalStudents = students.length;
  const totalXP = students.reduce((sum, s) => sum + s.xp, 0);
  const averageXP = totalStudents > 0 ? Math.round(totalXP / totalStudents) : 0;
  
  const totalQuizzesAttempted = students.reduce((sum, s) => sum + s.quizAttempts.length, 0);
  const totalSimulationsCompleted = students.reduce((sum, s) => sum + s.simulationAttempts.length, 0);

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-8">
        <Badge className="mb-2 bg-primary/10 text-primary hover:bg-primary/20 border-none">HCI Course</Badge>
        <h1 className="text-3xl font-bold text-zinc-900 flex items-center">
          <Activity className="w-8 h-8 mr-3 text-primary" />
          HCI Student Analytics
        </h1>
        <p className="text-zinc-500 mt-2 text-lg">
          Monitor your student performance, XP accumulation, and course module engagement.
        </p>
      </div>

      {/* Aggregate Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="border-zinc-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm font-medium text-zinc-500">Average Class XP</span>
              <Star className="w-5 h-5 text-amber-500 fill-amber-100" />
            </div>
            <h3 className="text-2xl font-bold text-zinc-800">{averageXP} XP</h3>
          </CardContent>
        </Card>
        <Card className="border-zinc-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm font-medium text-zinc-500">Active Students</span>
              <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none">Live</Badge>
            </div>
            <h3 className="text-2xl font-bold text-zinc-800">{totalStudents}</h3>
          </CardContent>
        </Card>
        <Card className="border-zinc-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm font-medium text-zinc-500">Quiz Completions</span>
              <Target className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-zinc-800">{totalQuizzesAttempted}</h3>
          </CardContent>
        </Card>
        <Card className="border-zinc-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm font-medium text-zinc-500">Sims Completed</span>
              <Gamepad2 className="w-5 h-5 text-blue-500" />
            </div>
            <h3 className="text-2xl font-bold text-zinc-800">{totalSimulationsCompleted}</h3>
          </CardContent>
        </Card>
      </div>

      {/* Students Performance List */}
      <Card className="border-zinc-200 shadow-md overflow-hidden">
        <CardHeader className="bg-zinc-50 border-b border-zinc-100">
          <CardTitle className="text-xl">Student Progress Directory</CardTitle>
          <CardDescription>All students currently registered in user interface design / HCI.</CardDescription>
        </CardHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold text-zinc-600">Student</TableHead>
              <TableHead className="text-center font-semibold text-zinc-600">XP Points</TableHead>
              <TableHead className="text-center font-semibold text-zinc-600">Quizzes</TableHead>
              <TableHead className="text-center font-semibold text-zinc-600">Simulations</TableHead>
              <TableHead className="text-center font-semibold text-zinc-600">Badges</TableHead>
              <TableHead className="text-center font-semibold text-zinc-600">Daily Streak</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.length > 0 ? (
              students.map((student) => (
                <TableRow key={student.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-8 h-8 border border-zinc-200 bg-zinc-100">
                        <AvatarFallback className="text-zinc-600 text-xs font-bold">
                          {student.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-zinc-900">{student.name}</p>
                        <p className="text-xs text-zinc-400">{student.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50 font-bold">
                      {student.xp} XP
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center font-medium text-zinc-700">
                    {student.quizAttempts.length}
                  </TableCell>
                  <TableCell className="text-center font-medium text-zinc-700">
                    {student.simulationAttempts.length}
                  </TableCell>
                  <TableCell className="text-center font-medium text-zinc-700">
                    <div className="flex items-center justify-center space-x-1">
                      <Award className="w-4 h-4 text-zinc-400 mr-1" />
                      <span>{student.userBadges.length}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center font-medium text-zinc-700">
                    {student.streak} Days
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-zinc-500">
                  No students registered yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
