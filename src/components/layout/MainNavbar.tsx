"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BookOpen, Gamepad2, LayoutDashboard, Target, Trophy, LogOut, GraduationCap } from "lucide-react";
import { useAuth, SignOutButton } from "@clerk/nextjs";

export function MainNavbar() {
  const { isLoaded, userId } = useAuth();
  const isSignedIn = !!userId;

  return (
    <nav className="w-full bg-white/90 backdrop-blur-md border-b border-zinc-200 sticky top-0 z-50 shadow-sm transition-all duration-300">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-3 group">
          <div className="w-12 h-12 bg-primary text-white rounded-xl flex items-center justify-center group-hover:bg-primary/90 transition-all shadow-md">
            <GraduationCap className="w-6 h-6 animate-pulse" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-extrabold text-zinc-900 leading-none tracking-tight">Gamified Learning Platform</span>
            <span className="text-xs font-semibold text-primary mt-1">Somaiya EdTech Portal</span>
          </div>
        </Link>
        
        {/* Navigation Links for Authenticated Users */}
        {isLoaded && isSignedIn && (
          <div className="hidden lg:flex items-center space-x-8 font-medium text-zinc-600">
            <Link href="/student/main-dashboard" className="flex items-center space-x-2 hover:text-primary transition-colors">
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
        )}

        {/* Auth action buttons */}
        <div className="flex items-center space-x-4">
          {isLoaded && !isSignedIn && (
            <>
              <Link href="/sign-in">
                <Button variant="outline" className="border-primary text-primary hover:bg-primary/5">Sign In</Button>
              </Link>
              <Link href="/sign-up">
                <Button className="bg-primary hover:bg-primary/90 text-white shadow-md">Sign Up</Button>
              </Link>
            </>
          )}
          
          {isLoaded && isSignedIn && (
            <SignOutButton signOutOptions={{ redirectUrl: "/" }}>
              <Button variant="outline" className="border-zinc-200 text-zinc-700 hover:text-primary hover:bg-zinc-50 flex items-center space-x-2">
                <LogOut className="w-4 h-4" /> <span>Sign Out</span>
              </Button>
            </SignOutButton>
          )}
        </div>
      </div>
    </nav>
  );
}
