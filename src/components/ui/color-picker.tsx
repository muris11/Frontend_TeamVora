import * as React from "react"
import { Check, Paintbrush } from "lucide-react"
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { COLOR_OPTIONS, colorThemes } from "@/lib/colors"

/** Map a color name → the actual CSS background for the swatch */
const swatchClass: Record<string, string> = {
  blue:    "bg-blue-500",
  sky:     "bg-sky-500",
  indigo:  "bg-indigo-500",
  violet:  "bg-violet-500",
  purple:  "bg-purple-500",
  fuchsia: "bg-fuchsia-500",
  pink:    "bg-pink-500",
  rose:    "bg-rose-500",
  red:     "bg-red-500",
  orange:  "bg-orange-500",
  amber:   "bg-amber-500",
  yellow:  "bg-yellow-400",
  lime:    "bg-lime-500",
  green:   "bg-green-500",
  emerald: "bg-emerald-500",
  teal:    "bg-teal-500",
  cyan:    "bg-cyan-500",
  slate:   "bg-slate-500",
  gray:    "bg-gray-500",
  zinc:    "bg-zinc-500",
  primary: "bg-primary",
}

const COLOR_GROUPS: { label: string; colors: string[] }[] = [
  { label: "Blues",   colors: ["blue", "sky", "indigo"] },
  { label: "Purples", colors: ["violet", "purple", "fuchsia"] },
  { label: "Pinks",   colors: ["pink", "rose", "red"] },
  { label: "Oranges", colors: ["orange", "amber", "yellow"] },
  { label: "Greens",  colors: ["lime", "green", "emerald", "teal"] },
  { label: "Cyans",   colors: ["cyan"] },
  { label: "Neutral", colors: ["slate", "gray", "zinc"] },
  { label: "Brand",   colors: ["primary"] },
]

export function ColorPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = React.useState(false)

  const currentSwatch = value ? swatchClass[value] : null
  const label = value
    ? value.charAt(0).toUpperCase() + value.slice(1)
    : "Pilih Warna"

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className={cn(
          "inline-flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm",
          "hover:bg-accent hover:text-accent-foreground transition-colors w-[200px] justify-between"
        )}
      >
        <div className="flex items-center gap-2">
          {currentSwatch
            ? <div className={cn("w-4 h-4 rounded-full shrink-0", currentSwatch)} />
            : <Paintbrush className="w-4 h-4 text-muted-foreground" />
          }
          <span className="truncate">{label}</span>
        </div>
        <span className="text-muted-foreground text-xs">▾</span>
      </PopoverTrigger>

      <PopoverContent className="w-64 p-3" align="start">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
          Pilih Warna ({COLOR_OPTIONS.length} tersedia)
        </p>

        <div className="space-y-3">
          {COLOR_GROUPS.map((group) => (
            <div key={group.label}>
              <p className="text-[10px] text-muted-foreground mb-1.5 font-medium">{group.label}</p>
              <div className="flex flex-wrap gap-1.5">
                {group.colors.map((color) => {
                  const swatch = swatchClass[color] ?? "bg-gray-500"
                  const isSelected = value === color
                  return (
                    <button
                      key={color}
                      title={color.charAt(0).toUpperCase() + color.slice(1)}
                      onClick={() => { onChange(isSelected ? "" : color); setOpen(false) }}
                      className={cn(
                        "relative w-7 h-7 rounded-full transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary",
                        swatch,
                        isSelected && "ring-2 ring-offset-2 ring-foreground scale-110"
                      )}
                    >
                      {isSelected && (
                        <Check className="w-3.5 h-3.5 text-white absolute inset-0 m-auto drop-shadow" />
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {value && (
          <div className="mt-3 pt-3 border-t">
            <button
              onClick={() => { onChange(""); setOpen(false) }}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Hapus pilihan
            </button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
