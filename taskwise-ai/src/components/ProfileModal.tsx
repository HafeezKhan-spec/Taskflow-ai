import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, User, Mail, Calendar, ShieldCheck } from "lucide-react";
import { Owner } from "@/context/TaskContext";

interface ProfileModalProps {
  open: boolean;
  onClose: () => void;
  owner: Owner | null;
}

const ProfileModal = ({ open, onClose, owner }: ProfileModalProps) => {
  if (!owner) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-background/80 backdrop-blur-md"
        >
          <div className="absolute inset-0" onClick={onClose} />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="glass-card w-full max-w-sm p-8 relative z-10 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] border border-white/10 bg-card/90 text-center"
          >
            <button
              aria-label="Close modal"
              title="Close modal"
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-secondary transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Avatar Section */}
            <div className="relative inline-block mb-6">
              <div className="w-24 h-24 rounded-full gradient-primary flex items-center justify-center border-4 border-background shadow-xl">
                <User className="w-12 h-12 text-primary-foreground" />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-success p-1.5 rounded-full border-2 border-background shadow-md">
                <ShieldCheck className="w-3.5 h-3.5 text-success-foreground" />
              </div>
            </div>

            {/* Info Section */}
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-bold">{owner.name}</h2>
                <p className="text-sm text-primary font-medium">Verified Owner</p>
              </div>

              <div className="space-y-2.5 pt-4">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30 border border-border/50">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <div className="text-left">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Email Address</p>
                    <p className="text-sm font-medium">{owner.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30 border border-border/50">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <div className="text-left">
                    <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Account Type</p>
                    <p className="text-sm font-medium">Standard Account</p>
                  </div>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-full mt-6 py-3 rounded-xl gradient-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
              >
                Close Profile
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProfileModal;
