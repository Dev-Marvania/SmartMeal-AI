export type Meal = {
  id: string;
  name: string;
  restaurant: string;
  distance: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  tags: string[];
  image: string;
};

export type UserProfile = {
  name: string;
  ageGroup: string;
  goal: string;
  diet: string;
  restrictions: string[];
};
