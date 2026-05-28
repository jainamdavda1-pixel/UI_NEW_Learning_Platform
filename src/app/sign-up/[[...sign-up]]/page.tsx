import { SignUp } from "@clerk/nextjs";
import { Target, Gamepad2, Trophy, FileText } from "lucide-react";

export default function Page() {
  return (
    <div className="flex min-h-screen bg-white">
      {/* Left side: Premium Brand Panel (Desktop only) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary to-[#700000] text-white flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 blur-[80px] rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 blur-[80px] rounded-full"></div>
        
        {/* Top: Logo & Title */}
        <div className="relative z-10 flex items-center space-x-3">
          <div className="w-10 h-10 bg-white text-primary rounded-lg flex items-center justify-center font-bold text-lg shadow-md">
            HCI
          </div>
          <span className="font-extrabold text-xl tracking-tight">UI Design EdTech</span>
        </div>

        {/* Middle: Brand Content */}
        <div className="relative z-10 space-y-8 max-w-md">
          <h2 className="text-4xl font-extrabold tracking-tight leading-tight">
            Learn UI/UX Design the <span className="text-amber-400">Interactive</span> Way.
          </h2>
          <p className="text-white/80 text-base leading-relaxed">
            Access learning modules, participate in real-world simulations, practice assessments, and compete with classmates on the leaderboard.
          </p>

          {/* Core Feature Highlights */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4 bg-white/5 p-4 rounded-xl border border-white/10 backdrop-blur-sm">
              <div className="p-2 bg-white/10 rounded-lg text-amber-400">
                <Target className="w-5 h-5 fill-current" />
              </div>
              <div>
                <h4 className="font-semibold text-sm">Gamified Quizzes</h4>
                <p className="text-xs text-white/70">Solve topic assessments to earn XP points.</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 bg-white/5 p-4 rounded-xl border border-white/10 backdrop-blur-sm">
              <div className="p-2 bg-white/10 rounded-lg text-blue-400">
                <Gamepad2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-sm">Usability Auditing Simulators</h4>
                <p className="text-xs text-white/70">Find layout errors and build interfaces in interactive sandboxes.</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 bg-white/5 p-4 rounded-xl border border-white/10 backdrop-blur-sm">
              <div className="p-2 bg-white/10 rounded-lg text-emerald-400">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-semibold text-sm">Real-time Leaderboard</h4>
                <p className="text-xs text-white/70">Track your daily streak and rank up in class.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom: Institutional Footer */}
        <div className="relative z-10 text-xs text-white/60">
          © {new Date().getFullYear()} KJSCE Somaiya EdTech. All Rights Reserved.
        </div>
      </div>

      {/* Right side: Signup Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-zinc-50">
        <SignUp
          forceRedirectUrl="/student/dashboard"
          fallbackRedirectUrl="/student/dashboard"
          appearance={{
            variables: {
              colorPrimary: "#9b0000",
              colorBackground: "#ffffff",
              colorText: "#18181b",
              colorTextSecondary: "#71717a",
            },
            elements: {
              card: "border border-zinc-200 shadow-xl rounded-2xl bg-white max-w-md w-full p-6",
              headerTitle: "text-zinc-900 font-extrabold text-2xl tracking-tight text-center",
              headerSubtitle: "text-zinc-500 text-sm text-center",
              socialButtonsBlockButton: "border border-zinc-200 hover:bg-zinc-50 transition-colors text-zinc-800 rounded-xl h-11",
              formButtonPrimary: "bg-primary hover:bg-[#800000] transition-all text-white rounded-xl h-11 font-bold text-sm",
              footerActionLink: "text-primary hover:text-[#800000] font-bold hover:underline",
              formFieldInput: "rounded-xl border-zinc-200 focus:border-primary focus:ring-primary h-11",
            }
          }}
        />
      </div>
    </div>
  );
}
