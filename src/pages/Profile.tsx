import { Pencil, Play, Target, Leaf, Plus, User, Bell, Shield, LogOut } from 'lucide-react';
import { useProfile } from '../hooks/useProfile';

export function Profile() {
  const { profile, saveProfile } = useProfile();

  const handleSignOut = () => {
    saveProfile(null);
  };

  if (!profile) return null;

  return (
    <div className="max-w-screen-md mx-auto px-5 py-8 space-y-8 pb-32 md:pb-8">
      {/* Header */}
      <section className="flex flex-col items-center text-center space-y-4">
        <div className="relative">
          <img 
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80" 
            alt="Profile" 
            className="w-32 h-32 rounded-full object-cover shadow-md border-4 border-white"
          />
          <button className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full shadow-sm hover:opacity-90 transition-opacity">
            <Pencil className="w-4 h-4" />
          </button>
        </div>
        <div>
          <h1 className="font-display text-3xl text-on-background">{profile.name || 'Anonymous User'}</h1>
          <div className="inline-flex items-center gap-1 mt-2 bg-tertiary-container/10 px-3 py-1 rounded-full text-tertiary-container text-sm font-bold">
            <Target className="w-4 h-4" />
            Healthy Eater
          </div>
        </div>
      </section>

      {/* Health Goals */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-on-surface">Health Goals</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-surface-variant flex flex-col gap-4">
            <div className="flex justify-between items-center text-on-surface-variant">
              <span>Daily Calorie Target</span>
              <Play className="w-5 h-5 text-primary rotate-[-90deg]" />
            </div>
            <div>
              <span className="font-display text-3xl text-on-surface">2000</span>
              <span className="text-on-surface-variant ml-1">kcal</span>
            </div>
            <div className="h-2 w-full bg-surface-variant/50 rounded-full overflow-hidden">
              <div className="h-full bg-primary w-3/4 rounded-full"></div>
            </div>
          </div>
          
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-surface-variant flex flex-col gap-4">
            <div className="flex justify-between items-center text-on-surface-variant">
              <span>Protein Goal</span>
              <Target className="w-5 h-5 text-primary" />
            </div>
            <div>
              <span className="font-display text-3xl text-on-surface">150</span>
              <span className="text-on-surface-variant ml-1">g</span>
            </div>
            <div className="h-2 w-full bg-surface-variant/50 rounded-full overflow-hidden">
              <div className="h-full bg-primary w-1/2 rounded-full"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Dietary */}
      <section className="bg-white rounded-3xl p-6 shadow-sm border border-surface-variant space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-on-surface">Dietary Preferences</h2>
          <button className="text-primary hover:opacity-75">
            <Pencil className="w-5 h-5" />
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {profile.diet && (
            <span className="bg-primary/10 text-primary font-bold px-4 py-2 rounded-full text-sm">
              {profile.diet}
            </span>
          )}
          {profile.restrictions?.map((r: string) => (
            <span key={r} className="bg-primary/10 text-primary font-bold px-4 py-2 rounded-full text-sm">
              No {r}
            </span>
          ))}
          <button className="border-2 border-dashed border-outline-variant text-on-surface-variant font-bold px-4 py-2 rounded-full text-sm flex items-center gap-1 hover:bg-surface-variant/30 transition-colors">
            <Plus className="w-4 h-4" /> Add
          </button>
        </div>
      </section>

      {/* Settings */}
      <section className="bg-white rounded-3xl shadow-sm border border-surface-variant overflow-hidden">
        <ul className="divide-y divide-surface-variant/50">
          {[
            { icon: User, label: 'Account', color: 'text-on-surface-variant group-hover:text-primary' },
            { icon: Bell, label: 'Notifications', color: 'text-on-surface-variant group-hover:text-primary' },
            { icon: Shield, label: 'Privacy', color: 'text-on-surface-variant group-hover:text-primary' },
            { icon: LogOut, label: 'Sign Out', color: 'text-error', onClick: handleSignOut }
          ].map((item, i) => (
            <li key={i}>
              <button onClick={item.onClick} className="w-full px-6 py-4 flex justify-between items-center hover:bg-surface-variant/20 transition-colors group">
                <div className={`flex items-center gap-4 ${item.color.split(' ')[0]} transition-colors`}>
                  <item.icon className={`w-6 h-6 ${item.color.split(' ').slice(1).join(' ')}`} />
                  <span className="font-medium">{item.label}</span>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
