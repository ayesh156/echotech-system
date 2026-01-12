import React, { useState } from 'react';
import type { WarrantyClaim } from '../../data/mockData';
import { useTheme } from '../../contexts/ThemeContext';
import {
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  Wrench,
  Search,
  Shield,
  Save,
  X,
} from 'lucide-react';

interface WarrantyStatusUpdateModalProps {
  isOpen: boolean;
  claim: WarrantyClaim | null;
  onClose: () => void;
  onSave: (claimId: string, newStatus: WarrantyClaim['status']) => void;
}

const statusConfig: { value: WarrantyClaim['status']; label: string; icon: React.ElementType; color: string; bgColor: string; borderColor: string }[] = [
  { value: 'pending', label: 'Pending', icon: Clock, color: 'text-yellow-500', bgColor: 'bg-yellow-500/10', borderColor: 'border-yellow-500/30' },
  { value: 'under-review', label: 'Under Review', icon: Search, color: 'text-blue-500', bgColor: 'bg-blue-500/10', borderColor: 'border-blue-500/30' },
  { value: 'approved', label: 'Approved', icon: CheckCircle, color: 'text-emerald-500', bgColor: 'bg-emerald-500/10', borderColor: 'border-emerald-500/30' },
  { value: 'rejected', label: 'Rejected', icon: XCircle, color: 'text-red-500', bgColor: 'bg-red-500/10', borderColor: 'border-red-500/30' },
  { value: 'replaced', label: 'Replaced', icon: RefreshCw, color: 'text-purple-500', bgColor: 'bg-purple-500/10', borderColor: 'border-purple-500/30' },
  { value: 'repaired', label: 'Repaired', icon: Wrench, color: 'text-cyan-500', bgColor: 'bg-cyan-500/10', borderColor: 'border-cyan-500/30' },
];

export const WarrantyStatusUpdateModal: React.FC<WarrantyStatusUpdateModalProps> = ({
  isOpen,
  claim,
  onClose,
  onSave,
}) => {
  const { theme } = useTheme();
  const [selectedStatus, setSelectedStatus] = useState<WarrantyClaim['status']>(claim?.status || 'pending');

  // Update selected status when claim changes
  React.useEffect(() => {
    if (claim) {
      setSelectedStatus(claim.status);
    }
  }, [claim]);

  if (!isOpen || !claim) return null;

  const handleSave = () => {
    onSave(claim.id, selectedStatus);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className={`rounded-2xl max-w-md w-full shadow-2xl overflow-hidden border ${
        theme === 'dark' 
          ? 'bg-slate-900 border-slate-700/50' 
          : 'bg-white border-slate-200'
      }`}>
        {/* Header */}
        <div className={`p-6 border-b ${
          theme === 'dark'
            ? 'bg-gradient-to-r from-emerald-600/20 to-teal-500/10 border-emerald-500/30'
            : 'bg-gradient-to-r from-emerald-100 to-teal-50 border-emerald-200'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                theme === 'dark' ? 'bg-emerald-500/20' : 'bg-emerald-100'
              }`}>
                <Shield className={`w-6 h-6 ${
                  theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'
                }`} />
              </div>
              <div>
                <h2 className={`text-xl font-bold ${
                  theme === 'dark' ? 'text-white' : 'text-slate-900'
                }`}>Update Status</h2>
                <p className={`text-sm ${
                  theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                }`}>{claim.id}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className={`p-2 rounded-xl transition-colors ${
                theme === 'dark' ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-200 text-slate-600'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Claim Info */}
        <div className={`px-6 py-4 border-b ${theme === 'dark' ? 'border-slate-700/50' : 'border-slate-200'}`}>
          <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
            <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
              {claim.productName}
            </p>
            <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
              Customer: {claim.customerName}
            </p>
          </div>
        </div>

        {/* Status Options */}
        <div className="p-6 space-y-3">
          <p className={`text-sm font-medium mb-3 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
            Select New Status
          </p>
          <div className="grid grid-cols-2 gap-3">
            {statusConfig.map((status) => {
              const Icon = status.icon;
              const isSelected = selectedStatus === status.value;
              return (
                <button
                  key={status.value}
                  type="button"
                  onClick={() => setSelectedStatus(status.value)}
                  className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${
                    isSelected
                      ? `${status.bgColor} ${status.borderColor} ${status.color}`
                      : theme === 'dark'
                        ? 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:border-slate-600'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    isSelected ? status.bgColor : theme === 'dark' ? 'bg-slate-700' : 'bg-slate-100'
                  }`}>
                    <Icon className={`w-4 h-4 ${isSelected ? status.color : ''}`} />
                  </div>
                  <span className={`text-sm font-medium ${isSelected ? status.color : ''}`}>
                    {status.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className={`p-6 border-t flex gap-3 ${
          theme === 'dark' ? 'border-slate-700/50' : 'border-slate-200'
        }`}>
          <button
            onClick={handleSave}
            disabled={selectedStatus === claim.status}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-all"
          >
            <Save className="w-4 h-4" />
            Update Status
          </button>
          <button
            onClick={onClose}
            className={`px-6 py-2.5 rounded-xl font-medium transition-colors border ${
              theme === 'dark'
                ? 'bg-slate-700/50 hover:bg-slate-700 text-white border-slate-600/50'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-900 border-slate-300'
            }`}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
