import { Control } from "@/types/control-types";

export const getEffectivenessColor = (value: string) => {
  if (value === "ineffective") return "text-red-600 bg-red-50 px-2 py-1 rounded";
  if (value === "partially") return "text-orange-600 bg-orange-50 px-2 py-1 rounded";
  if (value === "effective") return "text-green-600 bg-green-50 px-2 py-1 rounded";
  if (value === "highly") return "text-green-700 bg-green-100 px-2 py-1 rounded font-semibold";
  return "";
};

export const getRatingColor = (value: string) => {
  const numValue = parseInt(value || "0");
  if (numValue >= 4) return "text-red-600 bg-red-50 px-2 py-1 rounded";
  if (numValue >= 3) return "text-orange-600 bg-orange-50 px-2 py-1 rounded";
  if (numValue >= 2) return "text-yellow-600 bg-yellow-50 px-2 py-1 rounded";
  return "text-green-600 bg-green-50 px-2 py-1 rounded";
};

export const getTestResultColor = (result: string) => {
  if (result === "fail") return "text-red-600 bg-red-50 px-2 py-1 rounded";
  if (result === "partial") return "text-orange-600 bg-orange-50 px-2 py-1 rounded";
  if (result === "pass") return "text-green-600 bg-green-50 px-2 py-1 rounded";
  return "";
};

export const calculateControlScore = (controls: Control[]) => {
  let total = 0;
  let weightSum = 0;
  
  controls.forEach(control => {
    if (control.effectiveness && control.weighting) {
      total += Number(control.effectiveness) * (Number(control.weighting) / 100);
      weightSum += Number(control.weighting);
    }
  });
  
  return weightSum > 0 ? (total / (weightSum / 100)).toFixed(1) : "0.0";
};
