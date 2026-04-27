import { History, Trash2, CalendarDays } from 'lucide-react';
import { useHistory } from '../hooks/useHistory';

export function Log() {
  const { logs, clearLogs } = useHistory();

  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center text-on-surface-variant min-h-[50vh]">
        <History className="w-16 h-16 mb-4 opacity-50" />
        <h2 className="text-2xl font-bold text-on-surface mb-2">No meals logged yet</h2>
        <p>Find a smart meal recommendation to start building your history!</p>
      </div>
    );
  }

  return (
    <div className="px-5 pt-8 pb-32 md:pb-8 max-w-3xl mx-auto flex flex-col gap-6">
      <section className="flex justify-between items-center">
        <div>
          <h2 className="font-display text-4xl text-on-background mb-2">Meal Log</h2>
          <p className="text-on-surface-variant text-lg">Your recent smart choices.</p>
        </div>
        <button 
          onClick={clearLogs}
          className="p-2 text-error hover:bg-error-container rounded-full transition-colors flex items-center justify-center"
          aria-label="Clear log"
        >
          <Trash2 className="w-6 h-6" />
        </button>
      </section>

      <section className="space-y-4">
        {logs.map((log) => (
          <div key={log.id} className="bg-white rounded-3xl p-5 shadow-sm border border-surface-variant flex gap-4">
            <div className="w-24 h-24 flex-shrink-0">
              <img src={log.meal.image} alt={log.meal.name} className="w-full h-full object-cover rounded-2xl" />
            </div>
            <div className="flex flex-col justify-center flex-1">
              <div className="flex items-center gap-1 text-xs font-bold text-secondary mb-1">
                <CalendarDays className="w-3 h-3" />
                {new Date(log.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
              </div>
              <h3 className="font-bold text-lg text-on-surface leading-tight mb-1">{log.meal.name}</h3>
              <p className="text-sm text-on-surface-variant">{log.meal.calories} Cal • {log.meal.protein}g Protein</p>
              <div className="mt-2 text-xs text-primary bg-primary/10 inline-block px-2 py-1 rounded-md self-start font-bold">
                Instead of {log.betterThan}
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
