import React, { useState } from 'react';
import { Shield, Loader2, CheckCircle, AlertCircle, User } from 'lucide-react';
import { updatePassword, User as FirebaseUser } from 'firebase/auth';

interface ProfileSettingsProps {
  user: FirebaseUser;
}

export function ProfileSettings({ user }: ProfileSettingsProps) {
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword) return;
    setLoading(true);
    setMessage(null);
    try {
      await updatePassword(user, newPassword);
      setMessage({ type: 'success', text: 'Password updated successfully!' });
      setNewPassword('');
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to update password. You may need to re-authenticate.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-12">
      <div className="bg-[var(--bg-secondary)] rounded-[32px] border border-[var(--border-color)] shadow-xl overflow-hidden transition-colors duration-300">
        {/* Header */}
        <div className="p-10 border-b border-[var(--border-color)] bg-[var(--bg-primary)] flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">Account Settings</h2>
            <p className="text-sm text-[var(--text-secondary)] mt-1">Manage your security and account status.</p>
          </div>
          <div className="w-16 h-16 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-100 dark:shadow-none">
            <User size={32} />
          </div>
        </div>

        <div className="p-10 space-y-12">
          {message && (
            <div className={`p-4 rounded-2xl flex items-center gap-3 text-sm animate-in fade-in slide-in-from-top-2 duration-300 ${
              message.type === 'success' ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-100 dark:border-green-900/30' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-900/30'
            }`}>
              {message.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
              {message.text}
            </div>
          )}

          {/* Password Section */}
          <section className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <Shield size={18} className="text-indigo-600" />
              <h3 className="text-xs font-bold text-[var(--text-secondary)] uppercase tracking-[0.2em]">Security</h3>
            </div>
            
            <form onSubmit={handleUpdatePassword} className="space-y-6">
              <div className="max-w-md">
                <label className="block text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-widest mb-2">New Password</label>
                <div className="relative">
                  <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]" size={18} />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-[var(--bg-primary)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium"
                    placeholder="Min. 6 characters"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !newPassword}
                className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-indigo-100 dark:shadow-none"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : 'Update Password'}
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
}
