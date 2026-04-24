import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useTasks } from "@/context/TaskContext";
import AppLayout from "@/components/AppLayout";

const COLORS = ["hsl(250,80%,65%)", "hsl(142,71%,45%)", "hsl(38,92%,50%)", "hsl(0,72%,51%)"];

const Analytics = () => {
  const { tasks } = useTasks();

  const completed = tasks.filter((t) => t.status === "completed").length;
  const pending = tasks.filter((t) => t.status === "pending").length;

  const pieData = [
    { name: "Completed", value: completed },
    { name: "Pending", value: pending },
  ];

  const ownerData = Array.from(
    tasks.reduce((acc, t) => {
      acc.set(t.owner, (acc.get(t.owner) || 0) + 1);
      return acc;
    }, new Map<string, number>())
  ).map(([name, count]) => ({ name: name.split(" ")[0], count }));

  const priorityData = [
    { name: "High", count: tasks.filter((t) => t.priority === "High").length },
    { name: "Medium", count: tasks.filter((t) => t.priority === "Medium").length },
    { name: "Low", count: tasks.filter((t) => t.priority === "Low").length },
  ];

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold">Analytics</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Task insights and performance overview</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Status pie */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-5">
            <h3 className="text-sm font-semibold mb-4">Task Status</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" paddingAngle={5}>
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "hsl(228,15%,12%)", border: "none", borderRadius: 8, color: "#fff", fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-6 text-xs">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[0] }} /> Completed ({completed})</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[1] }} /> Pending ({pending})</span>
            </div>
          </motion.div>

          {/* Tasks by owner */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-5">
            <h3 className="text-sm font-semibold mb-4">Tasks by Owner</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={ownerData}>
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(220,10%,55%)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: "hsl(220,10%,55%)" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "hsl(228,15%,12%)", border: "none", borderRadius: 8, color: "#fff", fontSize: 12 }} />
                <Bar dataKey="count" fill="hsl(250,80%,65%)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Priority distribution */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-5 md:col-span-2">
            <h3 className="text-sm font-semibold mb-4">Priority Distribution</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={priorityData} layout="vertical">
                <XAxis type="number" tick={{ fontSize: 11, fill: "hsl(220,10%,55%)" }} axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 11, fill: "hsl(220,10%,55%)" }} axisLine={false} tickLine={false} width={60} />
                <Tooltip contentStyle={{ background: "hsl(228,15%,12%)", border: "none", borderRadius: 8, color: "#fff", fontSize: 12 }} />
                <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                  {priorityData.map((_, i) => (
                    <Cell key={i} fill={[COLORS[3], COLORS[2], COLORS[0]][i]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Analytics;
