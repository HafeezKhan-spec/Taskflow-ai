import { motion } from "framer-motion";
import { Moon, Sun, Bell, BellOff } from "lucide-react";
import { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import AppLayout from "@/components/AppLayout";

const SettingsPage = () => {
  const { isDark, toggle } = useTheme();
  const [notifications, setNotifications] = useState(true);

  const ToggleSwitch = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
    <button
      onClick={onChange}
      className={`relative w-11 h-6 rounded-full transition-colors ${checked ? "bg-primary" : "bg-secondary"}`}
    >
      <motion.div
        animate={{ x: checked ? 20 : 2 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="absolute top-1 w-4 h-4 rounded-full bg-primary-foreground shadow"
      />
    </button>
  );

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage your preferences</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card divide-y divide-border">
          {/* Theme */}
          <div className="flex items-center justify-between p-5">
            <div className="flex items-center gap-3">
              {isDark ? <Moon className="w-5 h-5 text-primary" /> : <Sun className="w-5 h-5 text-warning" />}
              <div>
                <p className="text-sm font-medium">Dark Mode</p>
                <p className="text-xs text-muted-foreground">Toggle dark/light theme</p>
              </div>
            </div>
            <ToggleSwitch checked={isDark} onChange={toggle} />
          </div>

          {/* Notifications */}
          <div className="flex items-center justify-between p-5">
            <div className="flex items-center gap-3">
              {notifications ? <Bell className="w-5 h-5 text-primary" /> : <BellOff className="w-5 h-5 text-muted-foreground" />}
              <div>
                <p className="text-sm font-medium">Notifications</p>
                <p className="text-xs text-muted-foreground">Enable push notifications</p>
              </div>
            </div>
            <ToggleSwitch checked={notifications} onChange={() => setNotifications((p) => !p)} />
          </div>
        </motion.div>
      </div>
    </AppLayout>
  );
};

export default SettingsPage;
