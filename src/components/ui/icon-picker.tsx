import * as React from "react"
import { Check, Info, Box, Layout, Shield, Users, Mail, Phone, MapPin, Search, Zap, Settings, Globe, Briefcase, FileText, Activity } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export const iconMap: Record<string, any> = {
  Box, Layout, Shield, Users, Mail, Phone, MapPin, Search, Zap, Settings, Globe, Briefcase, FileText, Activity
}

export type IconName = keyof typeof iconMap

const icons: { value: IconName; label: string }[] = [
  { value: "Box", label: "Box" },
  { value: "Layout", label: "Layout" },
  { value: "Shield", label: "Shield" },
  { value: "Users", label: "Users" },
  { value: "Mail", label: "Mail" },
  { value: "Phone", label: "Phone" },
  { value: "MapPin", label: "MapPin" },
  { value: "Search", label: "Search" },
  { value: "Zap", label: "Zap" },
  { value: "Settings", label: "Settings" },
  { value: "Globe", label: "Globe" },
  { value: "Briefcase", label: "Briefcase" },
  { value: "FileText", label: "FileText" },
  { value: "Activity", label: "Activity" },
]

export function IconPicker({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  const [open, setOpen] = React.useState(false)
  const SelectedIcon = iconMap[value as IconName]

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className={cn(
          "inline-flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background",
          "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          "w-[200px] justify-between"
        )}
      >
        <div className="flex items-center">
          {SelectedIcon ? (
            <SelectedIcon className="w-4 h-4 mr-2" />
          ) : (
            <Info className="w-4 h-4 mr-2 text-muted-foreground" />
          )}
          {value
            ? icons.find((icon) => icon.value === value)?.label
            : "Pilih Ikon"}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Cari ikon..." />
          <CommandList>
            <CommandEmpty>Ikon tidak ditemukan.</CommandEmpty>
            <CommandGroup>
              {icons.map((icon) => {
                const IconComponent = iconMap[icon.value]
                return (
                  <CommandItem
                    key={icon.value}
                    value={icon.value}
                    onSelect={(currentValue) => {
                      onChange(currentValue === value ? "" : currentValue)
                      setOpen(false)
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === icon.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <IconComponent className="w-4 h-4 mr-2" />
                    {icon.label}
                  </CommandItem>
                )
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
