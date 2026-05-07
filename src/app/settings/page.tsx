"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import {
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  LogOut,
  ChevronRight,
  Camera,
  Trash2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { NavbarShell } from "@/components/shared/navbar-shell"
import { useAuth } from "@/lib/auth-context"
import { useToast } from "@/components/ui/use-toast"
import { loadFromStorage, saveToStorage, storageKeys } from "@/lib/local-storage"

const settingsSections = [
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "privacy", label: "Privacy & Security", icon: Shield },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "language", label: "Language & Region", icon: Globe },
]

export default function SettingsPage() {
  const router = useRouter()
  const { user, logout, updateUser } = useAuth()
  const [activeSection, setActiveSection] = useState("notifications")
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [marketingEmails, setMarketingEmails] = useState(false)
  const [weeklyDigest, setWeeklyDigest] = useState(true)

  const handleSave = (section?: string) => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      toast({
        title: "Settings saved",
        description: "Your preferences were updated.",
      })
    }, 1000)
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  useEffect(() => {
    const stored = loadFromStorage<any>(storageKeys.settings, {})
    if (typeof stored.emailNotifications === "boolean") setEmailNotifications(stored.emailNotifications)
    if (typeof stored.pushNotifications === "boolean") setPushNotifications(stored.pushNotifications)
    if (typeof stored.marketingEmails === "boolean") setMarketingEmails(stored.marketingEmails)
    if (typeof stored.weeklyDigest === "boolean") setWeeklyDigest(stored.weeklyDigest)
    if (stored.language) setLanguage(stored.language)
    if (stored.timezone) setTimezone(stored.timezone)
        if (stored.currency) setCurrency(stored.currency)
    if (stored.theme) setTheme(stored.theme)
  }, [])

  const [language, setLanguage] = useState("en")
  const [timezone, setTimezone] = useState("pst")
  const [dateFormat, setDateFormat] = useState("standard")
  const [currency, setCurrency] = useState("usd")
  const [theme, setTheme] = useState<"Light" | "Dark" | "System">("Light")

  const persistSettings = (next: Record<string, any>) => {
    const stored = loadFromStorage<Record<string, any>>(storageKeys.settings, {})
    saveToStorage(storageKeys.settings, { ...stored, ...next })
  }

  const handleNotificationSave = () => {
    persistSettings({
      emailNotifications,
      pushNotifications,
      marketingEmails,
      weeklyDigest,
    })
    handleSave("notifications")
  }

  const handlePrivacySave = () => {
    persistSettings({
      profileVisibility,
      showEmail,
      allowMessages,
    })
    handleSave("privacy")
  }

  const handleAppearanceChange = (nextTheme: "Light" | "Dark" | "System") => {
    setTheme(nextTheme)
    persistSettings({ theme: nextTheme })
    const root = document.documentElement
    if (nextTheme === "System") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      root.classList.toggle("dark", prefersDark)
    } else {
      root.classList.toggle("dark", nextTheme === "Dark")
    }
    toast({
      title: "Theme updated",
      description: `Switched to ${nextTheme} mode.`,
    })
  }

  const handleLanguageSave = () => {
    persistSettings({ language, timezone, currency })
    handleSave("language")
  }

  
  
  
  return (
    <div className="min-h-screen bg-background">
      <NavbarShell />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-8">Settings</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <nav className="space-y-1">
              {settingsSections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                    activeSection === section.id
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <section.icon className="h-5 w-5" />
                  {section.label}
                  <ChevronRight className="h-4 w-4 ml-auto" />
                </button>
              ))}
              <Separator className="my-4" />
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-destructive hover:bg-destructive/10 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                Log out
              </button>
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className="bg-card rounded-xl border border-border p-6"
            >
              {/* Notifications Section */}
              {activeSection === "notifications" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-foreground mb-1">
                      Notification Preferences
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Manage how you receive notifications.
                    </p>
                  </div>

                  <Separator />

                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Email notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive email notifications for important updates.
                        </p>
                      </div>
                      <Switch
                        checked={emailNotifications}
                        onCheckedChange={setEmailNotifications}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Push notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Get push notifications on your devices.
                        </p>
                      </div>
                      <Switch
                        checked={pushNotifications}
                        onCheckedChange={setPushNotifications}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Marketing emails</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive emails about new features and promotions.
                        </p>
                      </div>
                      <Switch
                        checked={marketingEmails}
                        onCheckedChange={setMarketingEmails}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label>Weekly digest</Label>
                        <p className="text-sm text-muted-foreground">
                          Get a weekly summary of activity.
                        </p>
                      </div>
                      <Switch
                        checked={weeklyDigest}
                        onCheckedChange={setWeeklyDigest}
                      />
                    </div>
                  </div>

              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-1">
                    Appearance
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Customize how the platform looks for you.
                  </p>
                </div>

                <Separator />

                                ? "bg-white border"
                                : themeOption === "Dark"
              {/* Language Section */}
              {activeSection === "language" && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold text-foreground mb-1">
                      Language & Region
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Set your preferred language and regional settings.
                    </p>
                  </div>

                  <Separator />

                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Language</Label>
                      <Select value={language} onValueChange={setLanguage}>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
