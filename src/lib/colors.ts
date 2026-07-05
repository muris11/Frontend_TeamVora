export const colorThemes: Record<string, { bg: string; text: string; border: string }> = {
  // Blues
  blue:    { bg: "bg-blue-500/10",    text: "text-blue-500",    border: "border-blue-500/20" },
  sky:     { bg: "bg-sky-500/10",     text: "text-sky-500",     border: "border-sky-500/20" },
  indigo:  { bg: "bg-indigo-500/10",  text: "text-indigo-500",  border: "border-indigo-500/20" },
  // Purples
  violet:  { bg: "bg-violet-500/10",  text: "text-violet-500",  border: "border-violet-500/20" },
  purple:  { bg: "bg-purple-500/10",  text: "text-purple-500",  border: "border-purple-500/20" },
  fuchsia: { bg: "bg-fuchsia-500/10", text: "text-fuchsia-500", border: "border-fuchsia-500/20" },
  // Pinks & Reds
  pink:    { bg: "bg-pink-500/10",    text: "text-pink-500",    border: "border-pink-500/20" },
  rose:    { bg: "bg-rose-500/10",    text: "text-rose-500",    border: "border-rose-500/20" },
  red:     { bg: "bg-red-500/10",     text: "text-red-500",     border: "border-red-500/20" },
  // Oranges & Yellows
  orange:  { bg: "bg-orange-500/10",  text: "text-orange-500",  border: "border-orange-500/20" },
  amber:   { bg: "bg-amber-500/10",   text: "text-amber-500",   border: "border-amber-500/20" },
  yellow:  { bg: "bg-yellow-500/10",  text: "text-yellow-500",  border: "border-yellow-500/20" },
  // Greens
  lime:    { bg: "bg-lime-500/10",    text: "text-lime-500",    border: "border-lime-500/20" },
  green:   { bg: "bg-green-500/10",   text: "text-green-500",   border: "border-green-500/20" },
  emerald: { bg: "bg-emerald-500/10", text: "text-emerald-500", border: "border-emerald-500/20" },
  teal:    { bg: "bg-teal-500/10",    text: "text-teal-500",    border: "border-teal-500/20" },
  // Cyans
  cyan:    { bg: "bg-cyan-500/10",    text: "text-cyan-500",    border: "border-cyan-500/20" },
  // Neutrals
  slate:   { bg: "bg-slate-500/10",   text: "text-slate-500",   border: "border-slate-500/20" },
  gray:    { bg: "bg-gray-500/10",    text: "text-gray-500",    border: "border-gray-500/20" },
  zinc:    { bg: "bg-zinc-500/10",    text: "text-zinc-500",    border: "border-zinc-500/20" },
  // Special — uses CSS var so it always follows the brand
  primary: { bg: "bg-primary/10",     text: "text-primary",     border: "border-primary/20" },
};

export const getColorTheme = (color: string) => {
  return colorThemes[color] ?? colorThemes["blue"];
};

/** All available color names — useful for dropdowns / pickers */
export const COLOR_OPTIONS = Object.keys(colorThemes) as Array<keyof typeof colorThemes>;

