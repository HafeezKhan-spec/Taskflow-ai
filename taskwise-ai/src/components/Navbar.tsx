import { Search, Bell, ChevronDown, User, LogOut, UserCircle } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTasks } from "@/context/TaskContext";
import ProfileModal from "./ProfileModal";
import NotificationModal from "./NotificationModal";

const Navbar = () => {
  const { currentOwner, owners, setCurrentOwner, notifications } = useTasks();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [notifModalOpen, setNotifModalOpen] = useState(false);

  return (
    <header className="h-16 border-b border-border bg-card/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-20">
      {/* Search */}
      <div className="relative max-w-md w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          placeholder="Search tasks..."
          className="w-full pl-10 pr-4 py-2 rounded-lg bg-secondary/50 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
        />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setNotifModalOpen(true)}
          className="relative p-2 rounded-lg hover:bg-secondary transition-colors group"
        >
          <Bell className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
          {notifications.length > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-destructive border-2 border-background" />
          )}
        </button>

        {/* Profile */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className={`flex items-center gap-2 p-1.5 pr-3 rounded-lg transition-all ${dropdownOpen ? 'bg-primary/10 ring-1 ring-primary/20' : 'hover:bg-secondary'}`}
          >
            <div className="w-8 h-8 rounded-full gradient-primary flex items-center justify-center border-2 border-background shadow-sm">
              <User className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className={`text-sm font-semibold hidden sm:inline ${dropdownOpen ? 'text-primary' : 'text-foreground'}`}>
              {currentOwner ? currentOwner.name : "Select Owner"}
            </span>
            <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform duration-300 ${dropdownOpen ? "rotate-180 text-primary" : ""}`} />
          </button>

          <AnimatePresence>
            {dropdownOpen && (
              <>
                {/* Backdrop for closing dropdown */}
                <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 top-[calc(100%+8px)] w-64 z-20 bg-background border border-border/60 shadow-2xl rounded-2xl p-2 overflow-hidden backdrop-blur-xl"
                >
                  <div className="px-3 py-3 mb-1">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Current Session</p>
                    <p className="text-sm font-bold text-foreground truncate">{currentOwner?.email || 'Guest'}</p>
                  </div>

                  {/* Profile Link */}
                  <button
                    onClick={() => {
                      setProfileModalOpen(true);
                      setDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-xl hover:bg-primary/10 hover:text-primary transition-all font-semibold group"
                  >
                    <div className="p-1.5 rounded-lg bg-secondary group-hover:bg-primary/20 transition-colors">
                      <UserCircle className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                    </div>
                    View Profile
                  </button>

                  <div className="my-2 h-px bg-border/40 mx-2" />

                  {/* Switch Owners */}
                  <div className="px-2 pb-2">
                    <p className="px-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2 mt-1">Switch Owner</p>
                    <div className="space-y-1 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                      {owners.length === 0 ? (
                        <p className="px-2 py-2 text-xs text-muted-foreground italic">No owners found</p>
                      ) : (
                        owners.map((owner) => (
                          <button
                            key={owner._id}
                            onClick={() => {
                              setCurrentOwner(owner);
                              setDropdownOpen(false);
                            }}
                            className={`w-full flex items-center gap-2 px-3 py-2 text-xs rounded-lg transition-all ${
                              currentOwner?._id === owner._id
                                ? "bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20"
                                : "hover:bg-secondary text-muted-foreground hover:text-foreground font-medium"
                            }`}
                          >
                            <div className={`w-1.5 h-1.5 rounded-full ${currentOwner?._id === owner._id ? 'bg-white' : 'bg-border'}`} />
                            {owner.name}
                          </button>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="my-2 h-px bg-border/40 mx-2" />

                  <button
                    onClick={() => {
                      setCurrentOwner(null);
                      setDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-xl hover:bg-destructive/10 hover:text-destructive transition-all font-semibold text-muted-foreground group"
                  >
                    <div className="p-1.5 rounded-lg bg-secondary group-hover:bg-destructive/20 transition-colors">
                      <LogOut className="w-4 h-4 group-hover:text-destructive" />
                    </div>
                    Sign out
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      <ProfileModal 
        open={profileModalOpen} 
        onClose={() => setProfileModalOpen(false)} 
        owner={currentOwner} 
      />

      <NotificationModal 
        open={notifModalOpen} 
        onClose={() => setNotifModalOpen(false)} 
      />
    </header>
  );
};

export default Navbar;
