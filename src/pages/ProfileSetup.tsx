import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProfile } from '../hooks/useProfile';
import { cn } from '../lib/utils';
import { Scale, Dumbbell, Apple, Activity, ChevronDown } from 'lucide-react';

export function ProfileSetup() {
  const navigate = useNavigate();
  const { saveProfile } = useProfile();
  const [name, setName] = useState('');
  const [ageGroup, setAgeGroup] = useState('');
  const [goal, setGoal] = useState('lose_weight');
  const [diet, setDiet] = useState('');
  const [restrictions, setRestrictions] = useState<string[]>([]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveProfile({ name, ageGroup, goal, diet, restrictions });
    navigate('/');
  };

  const toggleRestriction = (r: string) => {
    setRestrictions(prev => 
      prev.includes(r) ? prev.filter(x => x !== r) : [...prev, r]
    );
  };

  return (
    <div className="bg-background text-on-background font-body-md min-h-screen pt-8 pb-32 md:pb-8 flex flex-col items-center">
      <div className="text-center mt-8 mb-8">
        <h1 className="font-display text-4xl font-extrabold text-on-background mb-2">Set Up Your Profile</h1>
        <p className="text-lg text-on-surface-variant">Help us personalize your food recommendations</p>
      </div>
      
      <form onSubmit={handleSave} className="w-full max-w-3xl space-y-8 bg-white p-6 md:p-10 rounded-2xl shadow-sm border border-surface-variant mx-4">
        
        {/* Basic Info */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-on-background border-b border-surface-variant pb-2">1. Basic Info <span className="text-base font-normal text-secondary">(Optional)</span></h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-on-surface-variant mb-1" htmlFor="name">Name</label>
              <input 
                id="name"
                type="text" 
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Your name" 
                className="w-full bg-surface-variant/30 border-transparent rounded-lg px-4 py-2 text-base focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-on-surface-variant mb-1" htmlFor="age">Age Group</label>
              <div className="relative">
                <select 
                  id="age"
                  value={ageGroup}
                  onChange={e => setAgeGroup(e.target.value)}
                  className="w-full bg-surface-variant/30 border-transparent rounded-lg px-4 py-2 text-base focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors appearance-none"
                >
                  <option value="">Select age group</option>
                  <option value="teen">Teen</option>
                  <option value="adult">Adult</option>
                  <option value="30plus">30+</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant pointer-events-none" />
              </div>
            </div>
          </div>
        </section>

        {/* Goal */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-on-background border-b border-surface-variant pb-2">2. Goal Selection <span className="text-base text-error">*</span></h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { id: 'lose_weight', label: 'Lose weight', icon: Scale },
              { id: 'maintain_weight', label: 'Maintain weight', icon: Activity },
              { id: 'gain_muscle', label: 'Gain muscle', icon: Dumbbell },
              { id: 'eat_healthier', label: 'Eat healthier', icon: Apple },
            ].map(g => (
              <label key={g.id} className="cursor-pointer relative">
                <input type="radio" name="goal" value={g.id} checked={goal === g.id} onChange={() => setGoal(g.id)} className="peer sr-only" />
                <div className={cn(
                  "h-full bg-white border-2 rounded-xl p-4 flex flex-col items-center justify-center text-center transition-all shadow-sm hover:border-outline-variant",
                  goal === g.id ? "border-tertiary-container bg-tertiary-container/10" : "border-surface-variant"
                )}>
                  <g.icon className={cn("w-6 h-6 mb-2", goal === g.id ? "text-tertiary-container" : "text-on-surface-variant")} />
                  <span className="text-sm font-bold text-on-background">{g.label}</span>
                </div>
              </label>
            ))}
          </div>
        </section>

        {/* Diet */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-on-background border-b border-surface-variant pb-2">3. Diet Preference</h2>
          <div className="grid grid-cols-2 gap-3">
            {['Vegetarian', 'Vegan', 'Eggetarian', 'Non-vegetarian'].map(d => (
              <label key={d} className="cursor-pointer relative">
                <input type="radio" name="diet" value={d} checked={diet === d} onChange={() => setDiet(d)} className="peer sr-only" />
                <div className={cn(
                  "bg-white border-2 rounded-xl p-4 flex items-center gap-3 transition-all shadow-sm hover:border-outline-variant",
                  diet === d ? "border-tertiary-container bg-tertiary-container/10" : "border-surface-variant"
                )}>
                  <div className={cn(
                    "w-5 h-5 rounded-full border-2 flex items-center justify-center",
                    diet === d ? "border-tertiary-container bg-tertiary-container" : "border-outline"
                  )}>
                    <div className={cn("w-2 h-2 rounded-full bg-white transition-opacity", diet === d ? "opacity-100" : "opacity-0")} />
                  </div>
                  <span className="text-sm font-bold text-on-background">{d}</span>
                </div>
              </label>
            ))}
          </div>
        </section>

        {/* Restrictions */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-on-background border-b border-surface-variant pb-2">4. Restrictions</h2>
          <div className="flex flex-wrap gap-2">
            {['Nuts', 'Dairy', 'Gluten', 'None'].map(r => (
              <label key={r} className="cursor-pointer">
                <input type="checkbox" checked={restrictions.includes(r)} onChange={() => toggleRestriction(r)} className="peer sr-only" />
                <div className={cn(
                  "px-4 py-2 rounded-full border font-bold text-sm transition-colors hover:bg-surface-variant/50",
                  restrictions.includes(r) ? "bg-primary/10 text-primary border-primary" : "border-outline-variant text-on-surface-variant"
                )}>
                  {r}
                </div>
              </label>
            ))}
          </div>
        </section>

        <div className="pt-6 flex justify-end">
          <button type="submit" className="bg-primary text-white font-bold px-8 py-3 rounded-lg shadow-md hover:bg-primary/90 active:scale-95 transition-all">
            Save & Continue
          </button>
        </div>
      </form>
    </div>
  );
}
