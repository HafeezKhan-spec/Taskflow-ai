import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, UserPlus, Mail, User } from "lucide-react";
import { useTasks } from "@/context/TaskContext";

interface OwnerModalProps {
  open: boolean;
  onClose: () => void;
}

const OwnerModal = ({ open, onClose }: OwnerModalProps) => {
  const { addOwner, owners, deleteOwner } = useTasks();
  const [form, setForm] = useState({
    name: "",
    email: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return;
    await addOwner(form);
    setForm({ name: "", email: "" });
  };

  const inputClass =
    "w-full px-3 py-2 rounded-lg bg-secondary/50 border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-background/60 backdrop-blur-sm"
        >
          <div className="absolute inset-0" onClick={onClose} />
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="glass-card w-full max-w-md p-6 relative z-10 shadow-2xl"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-primary" />
                Manage Owners
              </h2>
              <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-secondary transition-colors" title="Close">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Name</label>
                  <input
                    className={inputClass}
                    value={form.name}
                    onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                    placeholder="Owner name"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">Email</label>
                  <input
                    type="email"
                    className={inputClass}
                    value={form.email}
                    onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                    placeholder="Email address"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-2 rounded-lg gradient-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Add Owner
              </button>
            </form>

            <div className="border-t border-border pt-4">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Current Owners</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                {owners.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4 italic">No owners added yet.</p>
                ) : (
                  owners.map((owner) => (
                    <div key={owner._id} className="flex items-center justify-between p-2.5 rounded-lg bg-secondary/30 border border-border/50">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                          <User className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{owner.name}</p>
                          <p className="text-[10px] text-muted-foreground truncate flex items-center gap-1">
                            <Mail className="w-2.5 h-2.5" />
                            {owner.email}
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        title="Delete owner"
                        onClick={() => deleteOwner(owner._id)}
                        className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OwnerModal;
