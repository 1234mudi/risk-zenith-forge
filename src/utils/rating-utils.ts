
export const getScoreColor = (score: string) => {
  const numScore = parseFloat(score || "0");
  if (numScore >= 4) return "bg-red-100 text-red-700 border-red-200";
  if (numScore >= 3) return "bg-orange-100 text-orange-700 border-orange-200";
  if (numScore >= 2) return "bg-green-100 text-green-700 border-green-200";
  return "bg-green-50 text-green-600 border-green-100";
};

export const getScoreLabel = (score: string) => {
  const numScore = parseFloat(score || "0");
  if (numScore >= 4) return "High";
  if (numScore >= 3) return "Medium";
  if (numScore >= 2) return "Low";
  return "Very Low";
};

export const getCellColor = (value: string) => {
  const numValue = parseInt(value || "0");
  if (numValue >= 4) return "bg-red-50";
  if (numValue >= 3) return "bg-orange-50";
  if (numValue >= 2) return "bg-green-50";
  return "bg-green-50";
};
