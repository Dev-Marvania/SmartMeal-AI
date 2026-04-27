import { Outlet, NavLink } from 'react-router-dom';
import { Calendar, History, BarChart2, User, Utensils } from 'lucide-react';
import { cn } from '../lib/utils';

export function Layout() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm sticky top-0 z-50 flex items-center justify-between px-5 h-16 w-full">
        <div className="flex items-center gap-2">
          <Utensils className="text-primary w-6 h-6" />
          <span className="text-xl font-extrabold text-primary tracking-tight">SmartMeal AI</span>
        </div>
        <div className="w-8 h-8 rounded-full bg-surface-variant overflow-hidden shadow-sm">
           <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&q=80" alt="User" className="w-full h-full object-cover" />
        </div>
      </header>

      <main className="flex-1 pb-24 md:pb-8 w-full max-w-screen-md mx-auto">
        <Outlet />
      </main>

      <nav className="bg-white border-t border-gray-100 shadow-[0_-8px_30px_rgb(0,0,0,0.06)] fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pt-3 pb-8 md:hidden rounded-t-3xl">
        <NavLink to="/" className={({isActive}) => cn("flex flex-col items-center justify-center px-4 py-2 transition-all duration-200 ease-out", isActive ? "text-primary bg-primary/10 rounded-2xl" : "text-gray-400 hover:text-primary active:scale-90")}>
          <Calendar className="mb-1 w-5 h-5" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Plan</span>
        </NavLink>
        <NavLink to="/log" className={({isActive}) => cn("flex flex-col items-center justify-center px-4 py-2 transition-all duration-200 ease-out", isActive ? "text-primary bg-primary/10 rounded-2xl" : "text-gray-400 hover:text-primary active:scale-90")}>
          <History className="mb-1 w-5 h-5" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Log</span>
        </NavLink>
        <NavLink to="/stats" className={({isActive}) => cn("flex flex-col items-center justify-center px-4 py-2 transition-all duration-200 ease-out", isActive ? "text-primary bg-primary/10 rounded-2xl" : "text-gray-400 hover:text-primary active:scale-90")}>
          <BarChart2 className="mb-1 w-5 h-5" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Stats</span>
        </NavLink>
        <NavLink to="/profile" className={({isActive}) => cn("flex flex-col items-center justify-center px-4 py-2 transition-all duration-200 ease-out", isActive ? "text-primary bg-primary/10 rounded-2xl" : "text-gray-400 hover:text-primary active:scale-90")}>
          <User className="mb-1 w-5 h-5" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Profile</span>
        </NavLink>
      </nav>
    </div>
  );
}
