import { useState } from 'react';
import { Search, Frown, Moon, Hourglass, Smile, Clock, Utensils, CheckCircle, RefreshCcw, Flame } from 'lucide-react';
import { useProfile } from '../hooks/useProfile';
import { useHistory } from '../hooks/useHistory';
import { Meal } from '../types';

export function Home() {
  const { profile } = useProfile();
  const { addLog } = useHistory();
  const [craving, setCraving] = useState('');
  const [mood, setMood] = useState('');
  const [time, setTime] = useState('12:30');
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ meal: Meal, reasoning: string, betterThan: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!craving) return;

    setLoading(true);
    try {
      const response = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ craving, mood, time, profile })
      });
      const data = await response.json();
      if (!response.ok) {
        console.error("API error:", data.error);
        alert(data.error || 'Failed to fetch recommendation.');
        return;
      }
      setResult(data);
      addLog({
        meal: data.meal,
        reasoning: data.reasoning,
        betterThan: data.betterThan,
      });
    } catch (err) {
      console.error(err);
      alert('An error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setCraving('');
    setMood('');
  };

  if (result && result.meal) {
    return (
      <div className="flex flex-col items-center px-5 py-8 w-full">
        <div className="text-center mb-6">
          <h1 className="font-display text-4xl text-on-surface mb-2">Your Match</h1>
          <p className="text-on-surface-variant">We found the perfect meal for your craving.</p>
        </div>

        <div className="w-full bg-white rounded-3xl shadow-md overflow-hidden flex flex-col">
          <div className="w-full h-64 md:h-80 relative">
            <img src={result.meal.image} alt={result.meal.name} className="w-full h-full object-cover" />
            <div className="absolute top-4 right-4 bg-tertiary-container text-white font-bold text-sm px-3 py-1 rounded-full shadow-md flex items-center gap-1">
              <Flame className="w-4 h-4" /> 95% Match
            </div>
          </div>
          
          <div className="p-6 flex flex-col gap-6">
            <div>
              <h2 className="font-display text-2xl text-on-surface">{result.meal.name}</h2>
              <p className="text-secondary">{result.meal.restaurant} • {result.meal.distance}</p>
            </div>

            <div className="flex items-center gap-2 bg-surface-variant/30 p-2 rounded-xl">
              <div className="flex-1 bg-white rounded-lg p-2 text-center shadow-sm">
                <span className="block font-bold text-primary">{result.meal.calories}</span>
                <span className="block text-xs text-secondary">Cal</span>
              </div>
              <div className="flex-1 bg-white rounded-lg p-2 text-center shadow-sm">
                <span className="block font-bold text-primary">{result.meal.protein}g</span>
                <span className="block text-xs text-secondary">Protein</span>
              </div>
              <div className="flex-1 bg-white rounded-lg p-2 text-center shadow-sm">
                <span className="block font-bold text-primary">{result.meal.fat}g</span>
                <span className="block text-xs text-secondary">Fat</span>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-xl text-on-surface mb-2 flex items-center gap-2">
                <CheckCircle className="text-tertiary-container w-6 h-6" />
                Why it fits
              </h3>
              <p className="text-on-surface-variant leading-relaxed">
                {result.reasoning}
              </p>
            </div>

            <div className="bg-surface-variant/50 rounded-xl p-4 border border-outline-variant">
              <div className="flex items-center gap-2 mb-1">
                <RefreshCcw className="text-secondary w-4 h-4" />
                <span className="font-bold text-sm text-on-surface-variant">Better than:</span>
                <span className="text-on-surface line-through decoration-secondary">{result.betterThan}</span>
              </div>
              <p className="text-tertiary-container italic">
                "Your satisfying fix—without the regret."
              </p>
            </div>
          </div>
        </div>

        <button onClick={handleReset} className="w-full mt-6 bg-secondary-container text-on-secondary-container font-bold py-4 rounded-xl shadow-sm flex items-center justify-center gap-2 hover:bg-secondary-fixed transition-colors active:scale-95">
          <RefreshCcw className="w-5 h-5" />
          Try Another
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center px-5 py-8 w-full max-w-md mx-auto">
      <div className="text-center mb-8 mt-4">
        <h1 className="font-display text-4xl text-on-surface mb-2">SmartMeal AI</h1>
        <p className="text-lg text-on-surface-variant">Eat smart, not strict.</p>
      </div>

      <form onSubmit={handleSubmit} className="w-full bg-white rounded-3xl p-6 shadow-md flex flex-col gap-6 border border-surface-variant">
        <div className="text-center">
          <h2 className="text-xl font-bold text-on-surface">What are you craving?</h2>
        </div>

        <div className="relative w-full">
          <input 
            type="text" 
            value={craving}
            onChange={e => setCraving(e.target.value)}
            placeholder="e.g., spicy, sweet, pizza" 
            aria-label="What are you craving?"
            className="w-full bg-surface-variant/30 text-on-surface rounded-xl px-4 py-3 font-body-md border-transparent focus:ring-2 focus:ring-primary placeholder:text-on-surface-variant/50 transition-shadow outline-none"
            required
          />
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
            <Search className="text-on-surface-variant/50 w-5 h-5" />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-bold text-on-surface-variant uppercase tracking-wider">Current Mood</span>
          <div className="grid grid-cols-4 gap-2" role="radiogroup" aria-label="Current Mood">
            {[
              { id: 'stressed', label: 'Stressed', icon: Frown },
              { id: 'tired', label: 'Tired', icon: Moon },
              { id: 'bored', label: 'Bored', icon: Hourglass },
              { id: 'happy', label: 'Happy', icon: Smile }
            ].map(m => (
              <button 
                key={m.id}
                type="button"
                role="radio"
                aria-checked={mood === m.id}
                aria-label={m.label}
                onClick={() => setMood(m.id)}
                className={`flex flex-col items-center justify-center p-2 rounded-xl transition-colors ${mood === m.id ? 'bg-primary/10 text-primary' : 'bg-surface-variant/30 hover:bg-surface-variant/60 text-on-surface-variant'}`}
              >
                <m.icon className="w-6 h-6 mb-1" />
                <span className="text-xs font-medium">{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm font-bold text-on-surface-variant uppercase tracking-wider">Meal Time</span>
          <div className="relative w-full">
            <input 
              type="time" 
              value={time}
              onChange={e => setTime(e.target.value)}
              aria-label="Meal Time"
              className="w-full bg-surface-variant/30 text-on-surface rounded-xl px-4 py-3 font-body-md border-transparent focus:ring-2 focus:ring-primary appearance-none outline-none" 
            />
            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
              <Clock className="text-on-surface-variant/50 w-5 h-5" />
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading || !craving}
          className="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-md hover:bg-primary/90 transition-all active:scale-95 flex items-center justify-center gap-2 mt-2 disabled:opacity-70"
        >
          {loading ? (
            <span className="animate-pulse">Thinking...</span>
          ) : (
            <>
              <Utensils className="w-5 h-5" />
              Find Smart Meal
            </>
          )}
        </button>
      </form>
    </div>
  );
}
