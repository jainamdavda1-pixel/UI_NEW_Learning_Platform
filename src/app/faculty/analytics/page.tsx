import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Activity, Star, Target, Gamepad2, Award, AlertTriangle, Trophy, Frown, BookOpen } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function FacultyAnalyticsPage() {
  // Fetch all students and their progress/attempts
  const students = await prisma.user.findMany({
    where: { role: "student" },
    include: {
      quizAttempts: {
        include: { quiz: true }
      },
      simulationProgress: {
        include: { simulation: true }
      },
      userBadges: true,
      progress: true // studentProgress
    },
    orderBy: { xp: "desc" },
  });

  // 1. Core aggregations
  const totalStudents = students.length;
  const totalXP = students.reduce((sum, s) => sum + s.xp, 0);
  const averageXP = totalStudents > 0 ? Math.round(totalXP / totalStudents) : 0;
  
  const totalQuizzesAttempted = students.reduce((sum, s) => sum + s.quizAttempts.length, 0);
  const totalSimulationsCompleted = students.reduce((sum, s) => sum + s.simulationProgress.length, 0);

  // 2. Average Quiz Scores
  let allQuizScoresSum = 0;
  let allQuizTotalMarksSum = 0;
  let totalSuccessfulAttempts = 0;

  students.forEach(s => {
    s.quizAttempts.forEach(qa => {
      allQuizScoresSum += qa.score;
      allQuizTotalMarksSum += qa.totalMarks;
      totalSuccessfulAttempts++;
    });
  });

  const averageQuizScorePercent = allQuizTotalMarksSum > 0 
    ? Math.round((allQuizScoresSum / allQuizTotalMarksSum) * 100)
    : 0;

  // 3. Top Students (Leaderboard)
  const topStudents = students.slice(0, 3);

  // 4. Inactive Students (XP = 0 or no quiz/sim activity)
  const inactiveStudents = students.filter(s => s.xp === 0 && s.quizAttempts.length === 0 && s.simulationProgress.length === 0);

  // 5. Weak Topics Calculator
  // Group quiz attempts by quiz title and calculate average percentage score
  const quizScoresMap: Record<string, { totalEarned: number; totalMarks: number; attemptsCount: number }> = {};
  
  students.forEach(s => {
    s.quizAttempts.forEach(qa => {
      const quizTitle = qa.quiz.title;
      if (!quizScoresMap[quizTitle]) {
        quizScoresMap[quizTitle] = { totalEarned: 0, totalMarks: 0, attemptsCount: 0 };
      }
      quizScoresMap[quizTitle].totalEarned += qa.score;
      quizScoresMap[quizTitle].totalMarks += qa.totalMarks;
      quizScoresMap[quizTitle].attemptsCount += 1;
    });
  });

  const weakTopics = Object.entries(quizScoresMap)
    .map(([title, data]) => {
      const avgPercent = data.totalMarks > 0 ? Math.round((data.totalEarned / data.totalMarks) * 100) : 0;
      return { title, avgPercent, attempts: data.attemptsCount };
    })
    .filter(topic => topic.avgPercent < 70) // Flag topics with average score under 70%
    .sort((a, b) => a.avgPercent - b.avgPercent)
    .slice(0, 3);

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl space-y-8">
      <div>
        <Badge className="mb-2 bg-primary/10 text-primary hover:bg-primary/20 border-none">HCI Course</Badge>
        <h1 className="text-3xl font-bold text-zinc-900 flex items-center">
          <Activity className="w-8 h-8 mr-3 text-primary" />
          HCI Student Analytics
        </h1>
        <p className="text-zinc-500 mt-2 text-lg">
          Monitor your student performance, XP accumulation, weak topics, and course module engagement.
        </p>
      </div>

      {/* Aggregate Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
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
              <span className="text-sm font-medium text-zinc-500">Average Quiz Score</span>
              <Target className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-zinc-800">{averageQuizScorePercent}%</h3>
          </CardContent>
        </Card>
        <Card className="border-zinc-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-2">
              <span className="text-sm font-medium text-zinc-500">Total Quiz Attempts</span>
              <Award className="w-5 h-5 text-zinc-500" />
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Weak Topics & Inactive Students */}
        <div className="md:col-span-1 space-y-6">
          {/* Weak Topics */}
          <Card className="border-zinc-200 shadow-md">
            <CardHeader className="bg-zinc-50 border-b border-zinc-100">
              <CardTitle className="text-base font-bold text-zinc-900 flex items-center">
                <AlertTriangle className="w-4 h-4 text-primary mr-2" /> Weak Topics (Avg &lt; 70%)
              </CardTitle>
              <CardDescription>Assessments where the class average is low.</CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {weakTopics.length > 0 ? (
                weakTopics.map((topic, i) => (
                  <div key={i} className="flex justify-between items-center bg-red-50/50 border border-red-100 p-3 rounded-lg">
                    <div className="truncate pr-2">
                      <p className="font-semibold text-zinc-800 text-xs truncate">{topic.title}</p>
                      <p className="text-[10px] text-zinc-500">{topic.attempts} attempts recorded</p>
                    </div>
                    <Badge className="bg-primary hover:bg-primary/95 text-white font-bold text-[10px]">
                      {topic.avgPercent}% Avg
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-xs text-zinc-500 italic text-center py-4">Class is performing well across all quizzes!</p>
              )}
            </CardContent>
          </Card>

          {/* Leaderboard / Top Students */}
          <Card className="border-zinc-200 shadow-md">
            <CardHeader className="bg-zinc-50 border-b border-zinc-100">
              <CardTitle className="text-base font-bold text-zinc-900 flex items-center">
                <Trophy className="w-4 h-4 text-amber-500 mr-2" /> Top Performers
              </CardTitle>
              <CardDescription>Highest XP scorers in the class.</CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {topStudents.length > 0 ? (
                topStudents.map((stud, idx) => (
                  <div key={stud.id} className="flex items-center justify-between p-2 rounded-lg bg-zinc-50">
                    <div className="flex items-center space-x-2">
                      <span className={`w-5 h-5 flex items-center justify-center font-bold text-xs rounded-full ${
                        idx === 0 ? "bg-amber-100 text-amber-800" :
                        idx === 1 ? "bg-zinc-200 text-zinc-800" :
                        "bg-amber-50 text-amber-700"
                      }`}>
                        {idx + 1}
                      </span>
                      <div className="truncate">
                        <p className="font-semibold text-zinc-800 text-xs truncate">{stud.name}</p>
                        <p className="text-[9px] text-zinc-400">Streak: {stud.streak} Days</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50 font-bold text-[10px]">
                      {stud.xp} XP
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-xs text-zinc-500 italic text-center py-4">No student records available.</p>
              )}
            </CardContent>
          </Card>

          {/* Inactive Students */}
          <Card className="border-zinc-200 shadow-md">
            <CardHeader className="bg-zinc-50 border-b border-zinc-100">
              <CardTitle className="text-base font-bold text-zinc-900 flex items-center">
                <Frown className="w-4 h-4 text-zinc-500 mr-2" /> Inactive Students
              </CardTitle>
              <CardDescription>Students with 0 XP or progress.</CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {inactiveStudents.length > 0 ? (
                inactiveStudents.map((stud) => (
                  <div key={stud.id} className="flex items-center justify-between p-2 rounded-lg bg-zinc-50 border border-zinc-100">
                    <div className="truncate">
                      <p className="font-semibold text-zinc-800 text-xs truncate">{stud.name}</p>
                      <p className="text-[9px] text-zinc-400 truncate">{stud.email}</p>
                    </div>
                    <Badge variant="secondary" className="text-[9px] font-bold">Inactive</Badge>
                  </div>
                ))
              ) : (
                <p className="text-xs text-zinc-500 italic text-center py-4">All registered students are active!</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Complete Students Progress Table */}
        <div className="md:col-span-2">
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
                        {student.simulationProgress.length}
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
      </div>
    </div>
  );
}
