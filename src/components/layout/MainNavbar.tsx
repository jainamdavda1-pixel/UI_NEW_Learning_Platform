import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpen, Gamepad2, GraduationCap, LayoutDashboard, Target, Trophy } from "lucide-react";

export function MainNavbar() {
  return (
    <nav className="w-full bg-white/90 backdrop-blur-md border-b border-zinc-200 sticky top-0 z-50 shadow-sm transition-all duration-300">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-12 h-12 bg-primary text-white rounded-lg flex items-center justify-center font-bold text-xl group-hover:bg-primary/90 transition-colors">
            HCI
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold text-zinc-900 leading-tight">UI Design</span>
            <span className="text-sm font-medium text-primary">Gamified Learning Platform</span>
          </div>
        </Link>
        
        <div className="hidden lg:flex items-center space-x-8 font-medium text-zinc-600">
          <Link href="/student/dashboard" className="flex items-center space-x-2 hover:text-primary transition-colors">
            <LayoutDashboard className="w-4 h-4" /> <span>Dashboard</span>
          </Link>
          <Link href="/student/modules" className="flex items-center space-x-2 hover:text-primary transition-colors">
            <BookOpen className="w-4 h-4" /> <span>Modules</span>
          </Link>
          <Link href="/student/simulations" className="flex items-center space-x-2 hover:text-primary transition-colors">
            <Gamepad2 className="w-4 h-4" /> <span>Simulations</span>
          </Link>
          <Link href="/student/quizzes" className="flex items-center space-x-2 hover:text-primary transition-colors">
            <Target className="w-4 h-4" /> <span>Quizzes</span>
          </Link>
          <Link href="/student/leaderboard" className="flex items-center space-x-2 hover:text-primary transition-colors">
            <Trophy className="w-4 h-4" /> <span>Leaderboard</span>
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          <Link href="/sign-in">
            <Button variant="outline" className="border-primary text-primary hover:bg-primary/5">Sign In</Button>
          </Link>
          <Link href="/sign-up">
            <Button className="bg-primary hover:bg-primary/90 text-white shadow-md">Enroll Now</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
