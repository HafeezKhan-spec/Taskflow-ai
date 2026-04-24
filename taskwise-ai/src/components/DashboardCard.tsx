import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface DashboardCardProps {
  title: string;
  count: number;
  icon: LucideIcon;
  variant: "overdue" | "today" | "upcoming";
}

const variantStyles = {
  overdue: "stat-card-overdue",
  today: "stat-card-today",
  upcoming: "stat-card-upcoming",
};

const variantColors = {
  overdue: "text-destructive",
  today: "text-warning",
  upcoming: "text-success",
};

const DashboardCard = ({ title, count, icon: Icon, variant }: DashboardCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`glass-card p-5 hover-lift ${variantStyles[variant]}`}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className={`text-3xl font-bold mt-1 ${variantColors[variant]}`}>{count}</p>
      </div>
      <div className={`p-3 rounded-xl bg-secondary/50 ${variantColors[variant]}`}>
        <Icon className="w-6 h-6" />
      </div>
    </div>
  </motion.div>
);

export default DashboardCard;
