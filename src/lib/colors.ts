export const colorThemes: Record<string, { bg: string; text: string }> = {
  purple: { bg: "bg-purple-500/10 border-purple-500/20", text: "text-purple-500" },
  blue: { bg: "bg-blue-500/10 border-blue-500/20", text: "text-blue-500" },
  green: { bg: "bg-green-500/10 border-green-500/20", text: "text-green-500" },
  rose: { bg: "bg-rose-500/10 border-rose-500/20", text: "text-rose-500" },
  orange: { bg: "bg-orange-500/10 border-orange-500/20", text: "text-orange-500" },
  amber: { bg: "bg-amber-500/10 border-amber-500/20", text: "text-amber-500" },
  cyan: { bg: "bg-cyan-500/10 border-cyan-500/20", text: "text-cyan-500" },
  emerald: { bg: "bg-emerald-500/10 border-emerald-500/20", text: "text-emerald-500" },
  slate: { bg: "bg-slate-500/10 border-slate-500/20", text: "text-slate-500" },
};

export const getColorTheme = (color: string) => {
  return colorThemes[color] || colorThemes["blue"];
};
