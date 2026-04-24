import { motion, AnimatePresence } from "framer-motion";
import { X, Bell, Mail, Clock, CheckCircle2, Moon, Sun } from "lucide-react";
import { useTasks, Notification } from "@/context/TaskContext";
import { format } from "date-fns";

interface NotificationModalProps {
  open: boolean;
  onClose: () => void;
}

const NotificationModal = ({ open, onClose }: NotificationModalProps) => {
  const { notifications } = useTasks();

  const getIcon = (type: string) => {
    switch (type) {
      case 'Morning': return <Sun className="w-4 h-4 text-warning" />;
      case 'Evening': return <Moon className="w-4 h-4 text-primary" />;
      case 'Task Completed': return <CheckCircle2 className="w-4 h-4 text-success" />;
      default: return <Mail className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-background/80 backdrop-blur-md"
        >
          <div className="absolute inset-0" onClick={onClose} />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="glass-card w-full max-w-md p-6 relative z-10 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] border border-white/10 bg-card/90"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Bell className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-foreground">Notifications</h2>
                  <p className="text-xs text-muted-foreground">History of emails sent to you</p>
                </div>
              </div>
              <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-secondary transition-colors" aria-label="Close">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              {notifications.length === 0 ? (
                <div className="text-center py-12">
                  <Mail className="w-12 h-12 mx-auto mb-3 opacity-10" />
                  <p className="text-sm text-muted-foreground italic">No notifications yet.</p>
                </div>
              ) : (
                notifications.map((n) => (
                  <div key={n._id} className="p-4 rounded-xl bg-secondary/30 border border-border/50 hover:bg-secondary/50 transition-colors group">
                    <div className="flex gap-3">
                      <div className="mt-1 flex-shrink-0">
                        {getIcon(n.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground leading-tight mb-1">{n.subject}</p>
                        <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>{format(new Date(n.sentAt), "MMM d, h:mm a")}</span>
                          <span className="w-1 h-1 rounded-full bg-border" />
                          <span className="font-medium text-primary/80">{n.type}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <button
              onClick={onClose}
              className="w-full mt-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NotificationModal;
