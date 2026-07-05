import * as React from "react"
import {
  Check, Info,
  // Finance
  Wallet, Banknote, CreditCard, PiggyBank, Receipt, TrendingUp, TrendingDown, DollarSign, Coins,
  // Tasks
  CheckSquare, CheckCircle2, ClipboardList, ClipboardCheck, ListTodo, ListChecks, BadgeCheck,
  // People
  Users, UserCheck, UserPlus, UserCog, UsersRound, Contact,
  // Security
  Shield, ShieldCheck, ShieldAlert, Lock, KeyRound, Fingerprint,
  // Performance
  Zap, Rocket, Sparkles, Star, Stars,
  // Analytics
  BarChart3, BarChart4, LineChart, PieChart, Activity,
  // Media
  PlayCircle, Video, Image, ImagePlus, Camera, Film,
  // Communication
  Bell, BellRing, MessageCircle, MessageSquare, Send, Mail, Inbox, Phone,
  // Time
  Calendar, CalendarCheck, CalendarDays, Clock, Timer, AlarmClock,
  // Files
  FolderOpen, FolderArchive, FileText, FilePlus, FileCheck, Archive,
  // Settings
  Settings, Settings2, SlidersHorizontal, Cog, Wrench,
  // Business
  Building, Building2, Briefcase, Package, Store, Globe,
  // Location
  Map, MapPin, Navigation, Compass, Search,
  // Tech
  Cpu, Database, Server, Cloud, CloudUpload, HardDrive, Wifi,
  // Knowledge
  BookOpen, BookMarked, GraduationCap, Library, Newspaper,
  // Engagement
  Heart, Handshake, Award, Trophy, Target, Milestone, Flag,
  // Layout
  LayoutDashboard, LayoutGrid, Layers, Grid2X2, PanelLeft, AppWindow, Box, Layout,
  // Sharing
  Link, ExternalLink, QrCode, Share2, Download, Upload, ArrowRight,
  // Design
  Sun, Moon, Palette, Brush, Pen, PenLine,
  // Misc
  AlertCircle, HelpCircle, Lightbulb, Flame, HeartHandshake, Globe2, Trophy as TrophyIcon
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export const iconMap: Record<string, any> = {
  // Finance
  Wallet, Banknote, CreditCard, PiggyBank, Receipt, TrendingUp, TrendingDown, DollarSign, Coins,
  // Tasks
  CheckSquare, CheckCircle2, ClipboardList, ClipboardCheck, ListTodo, ListChecks, BadgeCheck,
  // People
  Users, UserCheck, UserPlus, UserCog, UsersRound, Contact,
  // Security
  Shield, ShieldCheck, ShieldAlert, Lock, KeyRound, Fingerprint,
  // Performance
  Zap, Rocket, Sparkles, Star, Stars,
  // Analytics
  BarChart3, BarChart4, LineChart, PieChart, Activity,
  // Media
  PlayCircle, Video, Image, ImagePlus, Camera, Film,
  // Communication
  Bell, BellRing, MessageCircle, MessageSquare, Send, Mail, Inbox, Phone,
  // Time
  Calendar, CalendarCheck, CalendarDays, Clock, Timer, AlarmClock,
  // Files
  FolderOpen, FolderArchive, FileText, FilePlus, FileCheck, Archive,
  // Settings
  Settings, Settings2, SlidersHorizontal, Cog, Wrench,
  // Business
  Building, Building2, Briefcase, Package, Store, Globe,
  // Location
  Map, MapPin, Navigation, Compass, Search,
  // Tech
  Cpu, Database, Server, Cloud, CloudUpload, HardDrive, Wifi,
  // Knowledge
  BookOpen, BookMarked, GraduationCap, Library, Newspaper,
  // Engagement
  Heart, Handshake, Award, Trophy, Target, Milestone, Flag,
  // Layout
  LayoutDashboard, LayoutGrid, Layers, Grid2X2, PanelLeft, AppWindow, Box, Layout,
  // Sharing
  Link, ExternalLink, QrCode, Share2, Download, Upload, ArrowRight,
  // Design
  Sun, Moon, Palette, Brush, Pen, PenLine,
  // Misc
  AlertCircle, HelpCircle, Lightbulb, Flame, HeartHandshake, Globe2,
}

export type IconName = keyof typeof iconMap

const ICON_GROUPS: { label: string; icons: IconName[] }[] = [
  {
    label: "Finance",
    icons: ["Wallet", "Banknote", "CreditCard", "PiggyBank", "Receipt", "TrendingUp", "TrendingDown", "DollarSign", "Coins"],
  },
  {
    label: "Tasks",
    icons: ["CheckSquare", "CheckCircle2", "ClipboardList", "ClipboardCheck", "ListTodo", "ListChecks", "BadgeCheck"],
  },
  {
    label: "People",
    icons: ["Users", "UserCheck", "UserPlus", "UserCog", "UsersRound", "Contact"],
  },
  {
    label: "Security",
    icons: ["Shield", "ShieldCheck", "ShieldAlert", "Lock", "KeyRound", "Fingerprint"],
  },
  {
    label: "Performance",
    icons: ["Zap", "Rocket", "Sparkles", "Star", "Stars"],
  },
  {
    label: "Analytics",
    icons: ["BarChart3", "BarChart4", "LineChart", "PieChart", "Activity"],
  },
  {
    label: "Communication",
    icons: ["Bell", "BellRing", "MessageCircle", "MessageSquare", "Send", "Mail", "Inbox", "Phone"],
  },
  {
    label: "Time",
    icons: ["Calendar", "CalendarCheck", "CalendarDays", "Clock", "Timer", "AlarmClock"],
  },
  {
    label: "Files",
    icons: ["FolderOpen", "FolderArchive", "FileText", "FilePlus", "FileCheck", "Archive"],
  },
  {
    label: "Settings",
    icons: ["Settings", "Settings2", "SlidersHorizontal", "Cog", "Wrench"],
  },
  {
    label: "Business",
    icons: ["Building", "Building2", "Briefcase", "Package", "Store", "Globe"],
  },
  {
    label: "Location",
    icons: ["Map", "MapPin", "Navigation", "Compass", "Search"],
  },
  {
    label: "Tech",
    icons: ["Cpu", "Database", "Server", "Cloud", "CloudUpload", "HardDrive", "Wifi"],
  },
  {
    label: "Knowledge",
    icons: ["BookOpen", "BookMarked", "GraduationCap", "Library", "Newspaper"],
  },
  {
    label: "Engagement",
    icons: ["Heart", "Handshake", "Award", "Trophy", "Target", "Milestone", "Flag"],
  },
  {
    label: "Design",
    icons: ["Sun", "Moon", "Palette", "Brush", "Pen", "PenLine"],
  },
  {
    label: "Sharing",
    icons: ["Link", "ExternalLink", "QrCode", "Share2", "Download", "Upload"],
  },
  {
    label: "Layout",
    icons: ["LayoutDashboard", "LayoutGrid", "Layers", "Grid2X2", "AppWindow", "Box"],
  },
  {
    label: "Misc",
    icons: ["AlertCircle", "HelpCircle", "Lightbulb", "Flame", "HeartHandshake", "Globe2"],
  },
]

export function IconPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")

  const SelectedIcon = iconMap[value as IconName]

  const allIcons: IconName[] = ICON_GROUPS.flatMap((g) => g.icons)

  const filteredGroups = React.useMemo(() => {
    if (!search) return ICON_GROUPS
    const q = search.toLowerCase()
    return ICON_GROUPS.map((g) => ({
      ...g,
      icons: g.icons.filter((name) => name.toLowerCase().includes(q)),
    })).filter((g) => g.icons.length > 0)
  }, [search])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        className={cn(
          "inline-flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm",
          "hover:bg-accent hover:text-accent-foreground transition-colors w-[200px] justify-between"
        )}
      >
        <div className="flex items-center gap-2">
          {SelectedIcon
            ? <SelectedIcon className="w-4 h-4 text-primary" />
            : <Info className="w-4 h-4 text-muted-foreground" />
          }
          <span className="truncate">{value || "Pilih Ikon"}</span>
        </div>
        <span className="text-muted-foreground text-xs">▾</span>
      </PopoverTrigger>

      <PopoverContent className="w-80 p-0" align="start">
        {/* Search */}
        <div className="p-2 border-b">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari ikon... (contoh: wallet, user)"
              className="w-full rounded-md border border-input bg-background pl-8 pr-3 py-1.5 text-sm outline-none focus:ring-1 focus:ring-ring"
            />
          </div>
        </div>

        {/* Icon Grid */}
        <div className="max-h-72 overflow-y-auto p-2 space-y-3">
          {filteredGroups.length === 0 && (
            <p className="py-6 text-center text-sm text-muted-foreground">Ikon tidak ditemukan</p>
          )}
          {filteredGroups.map((group) => (
            <div key={group.label}>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-1 mb-1.5">
                {group.label}
              </p>
              <div className="grid grid-cols-7 gap-1">
                {group.icons.map((iconName) => {
                  const IconComponent = iconMap[iconName]
                  if (!IconComponent) return null
                  const isSelected = value === iconName
                  return (
                    <button
                      key={iconName}
                      title={iconName}
                      onClick={() => { onChange(isSelected ? "" : iconName); setOpen(false); setSearch("") }}
                      className={cn(
                        "flex items-center justify-center w-8 h-8 rounded-md transition-all",
                        "hover:bg-primary/10 hover:text-primary",
                        isSelected && "bg-primary text-primary-foreground shadow-sm"
                      )}
                    >
                      <IconComponent className="w-4 h-4" />
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Footer count */}
        <div className="border-t px-3 py-1.5 text-[10px] text-muted-foreground">
          {allIcons.length} ikon tersedia
        </div>
      </PopoverContent>
    </Popover>
  )
}
