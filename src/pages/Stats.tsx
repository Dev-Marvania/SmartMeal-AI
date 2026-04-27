import { Flame, Apple, Target, Droplets, Leaf } from 'lucide-react';

export function Stats() {
  return (
    <div className="px-5 pt-8 pb-32 md:pb-8 max-w-3xl mx-auto flex flex-col gap-8">
      <section>
        <h2 className="font-display text-4xl text-on-background mb-2">My Progress</h2>
        <p className="text-on-surface-variant text-lg">Here's how you're tracking this week.</p>
      </section>

      {/* Summary Bento */}
      <section className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-surface-variant flex flex-col justify-between aspect-square">
          <div className="flex items-start justify-between">
            <span className="bg-tertiary-container/10 p-2 rounded-lg text-tertiary-container">
              <Flame className="w-6 h-6" />
            </span>
            <span className="font-bold text-sm text-on-surface-variant">Streak</span>
          </div>
          <div>
            <h3 className="font-display text-5xl text-primary mb-1">5</h3>
            <p className="text-sm font-medium text-on-surface-variant">Days on track</p>
          </div>
        </div>

        <div className="bg-primary rounded-3xl p-5 shadow-md flex flex-col justify-between aspect-square text-white">
          <div className="flex items-start justify-between">
            <span className="bg-white/20 p-2 rounded-lg">
              <Apple className="w-6 h-6" />
            </span>
            <span className="font-bold text-sm">Score</span>
          </div>
          <div>
            <h3 className="font-display text-5xl mb-1">92</h3>
            <p className="text-sm font-medium opacity-90">Excellent</p>
          </div>
        </div>
      </section>

      {/* Macro Breakdown */}
      <section className="bg-white rounded-3xl p-6 shadow-sm border border-surface-variant">
        <h3 className="font-bold text-xl text-on-background mb-6">Macro Breakdown</h3>
        <div className="space-y-6">
          <div>
            <div className="flex justify-between mb-2">
              <span className="font-bold text-sm flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-primary"></span> Protein
              </span>
              <span className="text-sm text-on-surface-variant">85g / 120g</span>
            </div>
            <div className="w-full bg-surface-variant/50 h-2 rounded-full overflow-hidden">
              <div className="bg-primary h-full rounded-full w-[70%]"></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="font-bold text-sm flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-tertiary-container"></span> Carbs
              </span>
              <span className="text-sm text-on-surface-variant">150g / 200g</span>
            </div>
            <div className="w-full bg-surface-variant/50 h-2 rounded-full overflow-hidden">
              <div className="bg-tertiary-container h-full rounded-full w-[75%]"></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="font-bold text-sm flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-outline"></span> Fats
              </span>
              <span className="text-sm text-on-surface-variant">40g / 65g</span>
            </div>
            <div className="w-full bg-surface-variant/50 h-2 rounded-full overflow-hidden">
              <div className="bg-outline h-full rounded-full w-[60%]"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section>
        <h3 className="font-bold text-xl text-on-background mb-4">Recent Achievements</h3>
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x hide-scroll">
          <div className="snap-start flex-shrink-0 w-32 bg-white rounded-2xl p-4 shadow-sm border border-surface-variant flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 text-primary">
              <Leaf className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-sm text-on-background mb-1">3 Day Green</h4>
            <p className="text-xs text-on-surface-variant">Calorie goal met</p>
          </div>
          
          <div className="snap-start flex-shrink-0 w-32 bg-white rounded-2xl p-4 shadow-sm border border-surface-variant flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full bg-tertiary-container/10 flex items-center justify-center mb-3 text-tertiary-container">
              <Target className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-sm text-on-background mb-1">Protein Pro</h4>
            <p className="text-xs text-on-surface-variant">100g+ protein</p>
          </div>

          <div className="snap-start flex-shrink-0 w-32 bg-white rounded-2xl p-4 shadow-sm border border-surface-variant flex flex-col items-center text-center opacity-60 grayscale">
            <div className="w-12 h-12 rounded-full bg-surface-variant flex items-center justify-center mb-3 text-on-surface-variant">
              <Droplets className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-sm text-on-background mb-1">Hydration</h4>
            <p className="text-xs text-on-surface-variant">Locked</p>
          </div>
        </div>
      </section>
    </div>
  );
}
