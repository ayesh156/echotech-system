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
  DollarSign,
  CreditCard,
  Package,
  AlertTriangle,
  Zap,
  Eye,
  Settings,
  Play,
  TestTube,
  Archive,
} from 'lucide-react';

interface WarrantyStatusUpdateModalProps {
  isOpen: boolean;
  claim: WarrantyClaim | null;
  onClose: () => void;
  onSave: (claimId: string, newStatus: WarrantyClaim['status'], financialImpact?: {
    type: 'no_impact' | 'full_refund' | 'partial_refund' | 'credit_note' | 'free_replacement' | 'paid_replacement';
    creditAmount?: number;
  }, workflowStage?: string) => void;
}

const statusConfig: { value: WarrantyClaim['status']; label: string; icon: React.ElementType; color: string; bgColor: string; borderColor: string }[] = [
  { value: 'pending', label: 'Pending', icon: Clock, color: 'text-yellow-500', bgColor: 'bg-yellow-500/10', borderColor: 'border-yellow-500/30' },
  { value: 'under-review', label: 'Under Review', icon: Search, color: 'text-blue-500', bgColor: 'bg-blue-500/10', borderColor: 'border-blue-500/30' },
  { value: 'approved', label: 'Approved', icon: CheckCircle, color: 'text-emerald-500', bgColor: 'bg-emerald-500/10', borderColor: 'border-emerald-500/30' },
  { value: 'rejected', label: 'Rejected', icon: XCircle, color: 'text-red-500', bgColor: 'bg-red-500/10', borderColor: 'border-red-500/30' },
  { value: 'replaced', label: 'Replaced', icon: RefreshCw, color: 'text-purple-500', bgColor: 'bg-purple-500/10', borderColor: 'border-purple-500/30' },
  { value: 'repaired', label: 'Repaired', icon: Wrench, color: 'text-cyan-500', bgColor: 'bg-cyan-500/10', borderColor: 'border-cyan-500/30' },
];

// Workflow stages configuration
const workflowStages = [
  { value: 'received', label: 'Received', icon: Archive, color: 'text-gray-500' },
  { value: 'inspecting', label: 'Inspecting', icon: Eye, color: 'text-blue-500' },
  { value: 'awaiting_parts', label: 'Awaiting Parts', icon: Package, color: 'text-orange-500' },
  { value: 'repairing', label: 'Repairing', icon: Settings, color: 'text-amber-500' },
  { value: 'testing', label: 'Testing', icon: TestTube, color: 'text-indigo-500' },
  { value: 'ready', label: 'Ready', icon: Play, color: 'text-emerald-500' },
  { value: 'completed', label: 'Completed', icon: CheckCircle, color: 'text-green-500' },
];

// Financial impact options
const financialOptions = [
  { value: 'no_impact', label: 'No Financial Impact', icon: Shield, color: 'text-gray-500', bgColor: 'bg-gray-500/10' },
  { value: 'full_refund', label: 'Full Refund', icon: DollarSign, color: 'text-emerald-500', bgColor: 'bg-emerald-500/10' },
  { value: 'partial_refund', label: 'Partial Refund', icon: CreditCard, color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
  { value: 'credit_note', label: 'Credit Note', icon: CreditCard, color: 'text-purple-500', bgColor: 'bg-purple-500/10' },
  { value: 'free_replacement', label: 'Free Replacement', icon: RefreshCw, color: 'text-cyan-500', bgColor: 'bg-cyan-500/10' },
  { value: 'paid_replacement', label: 'Paid Replacement', icon: Package, color: 'text-amber-500', bgColor: 'bg-amber-500/10' },
];

export const WarrantyStatusUpdateModal: React.FC<WarrantyStatusUpdateModalProps> = ({
  isOpen,
  claim,
  onClose,
  onSave,
}) => {
  const { theme } = useTheme();
  const [selectedStatus, setSelectedStatus] = useState<WarrantyClaim['status']>(claim?.status || 'pending');
  const [selectedWorkflowStage, setSelectedWorkflowStage] = useState<string>(claim?.workflow?.stage || 'received');
  const [selectedFinancialImpact, setSelectedFinancialImpact] = useState<string>(claim?.financialImpact?.type || 'no_impact');
  const [creditAmount, setCreditAmount] = useState<number>(claim?.financialImpact?.creditAmount || 0);
  const [showFinancialSection, setShowFinancialSection] = useState(false);
  const [notes, setNotes] = useState('');

  // Update states when claim changes
  React.useEffect(() => {
    if (claim) {
      setSelectedStatus(claim.status);
      setSelectedWorkflowStage(claim.workflow?.stage || 'received');
      setSelectedFinancialImpact(claim.financialImpact?.type || 'no_impact');
      setCreditAmount(claim.financialImpact?.creditAmount || 0);
      setShowFinancialSection(['approved', 'replaced', 'repaired'].includes(claim.status));
    }
  }, [claim]);

  // Show financial section when status is approved/replaced/repaired
  React.useEffect(() => {
    setShowFinancialSection(['approved', 'replaced', 'repaired'].includes(selectedStatus));
  }, [selectedStatus]);

  if (!isOpen || !claim) return null;

  const handleSave = () => {
    const financialImpact = showFinancialSection && selectedFinancialImpact !== 'no_impact' 
      ? { type: selectedFinancialImpact as any, creditAmount }
      : undefined;
    
    onSave(claim.id, selectedStatus, financialImpact, selectedWorkflowStage);
    onClose();
  };

  // Calculate if this is a status that can issue credit
  const canIssueCredit = ['approved', 'replaced', 'repaired'].includes(selectedStatus);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className={`rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border ${
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
                }`}>Update Warranty Claim</h2>
                <p className={`text-sm ${
                  theme === 'dark' ? 'text-slate-400' : 'text-slate-600'
                }`}>{claim.id} • {claim.productName}</p>
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
          <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-slate-800/50' : 'bg-slate-50'} flex justify-between items-center`}>
            <div>
              <p className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                {claim.productName}
              </p>
              <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                Customer: {claim.customerName} • Invoice: {claim.invoiceId}
              </p>
            </div>
            {claim.workflow?.priorityLevel === 'urgent' && (
              <div className="flex items-center gap-1 px-2 py-1 bg-red-500/10 rounded-lg">
                <Zap className="w-3 h-3 text-red-500" />
                <span className="text-xs text-red-500 font-medium">Urgent</span>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Workflow Stage */}
          <div>
            <p className={`text-sm font-medium mb-3 flex items-center gap-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
              <Settings className="w-4 h-4" />
              Workflow Stage
            </p>
            <div className="flex flex-wrap gap-2">
              {workflowStages.map((stage, index) => {
                const Icon = stage.icon;
                const isSelected = selectedWorkflowStage === stage.value;
                const currentIndex = workflowStages.findIndex(s => s.value === selectedWorkflowStage);
                const isCompleted = index < currentIndex;
                
                return (
                  <button
                    key={stage.value}
                    type="button"
                    onClick={() => setSelectedWorkflowStage(stage.value)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all text-sm ${
                      isSelected
                        ? `bg-emerald-500/20 border-emerald-500/50 text-emerald-500`
                        : isCompleted
                        ? `bg-slate-500/10 border-slate-500/30 text-slate-500`
                        : theme === 'dark'
                          ? 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:border-slate-600'
                          : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-emerald-500' : isCompleted ? 'text-slate-500' : stage.color}`} />
                    <span className={isSelected ? 'font-medium' : ''}>{stage.label}</span>
                    {isCompleted && <CheckCircle className="w-3 h-3" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Status Options */}
          <div>
            <p className={`text-sm font-medium mb-3 flex items-center gap-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
              <Shield className="w-4 h-4" />
              Claim Status
            </p>
            <div className="grid grid-cols-3 gap-3">
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

          {/* Financial Impact Section - Only show when status is approved/replaced/repaired */}
          {showFinancialSection && (
            <div className={`p-4 rounded-xl border ${
              theme === 'dark' ? 'bg-slate-800/30 border-slate-700/50' : 'bg-slate-50 border-slate-200'
            }`}>
              <p className={`text-sm font-medium mb-3 flex items-center gap-2 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                <DollarSign className="w-4 h-4 text-emerald-500" />
                Financial Impact
                <span className={`ml-auto text-xs px-2 py-0.5 rounded-full ${
                  theme === 'dark' ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-600'
                }`}>
                  Affects Customer Credit
                </span>
              </p>
              
              <div className="grid grid-cols-3 gap-2 mb-4">
                {financialOptions.map((option) => {
                  const Icon = option.icon;
                  const isSelected = selectedFinancialImpact === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setSelectedFinancialImpact(option.value)}
                      className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                        isSelected
                          ? `${option.bgColor} border-2 ${option.color}`
                          : theme === 'dark'
                            ? 'bg-slate-700/50 border-slate-600/50 text-slate-400 hover:border-slate-500'
                            : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isSelected ? option.color : ''}`} />
                      <span className={`text-xs text-center ${isSelected ? 'font-medium' : ''}`}>
                        {option.label}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Credit Amount Input */}
              {['full_refund', 'partial_refund', 'credit_note'].includes(selectedFinancialImpact) && (
                <div className={`p-3 rounded-lg border ${
                  theme === 'dark' ? 'bg-slate-700/50 border-slate-600/50' : 'bg-white border-slate-200'
                }`}>
                  <label className={`text-xs font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                    Credit Amount (Rs.)
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-lg ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Rs.</span>
                    <input
                      type="number"
                      value={creditAmount}
                      onChange={(e) => setCreditAmount(Number(e.target.value))}
                      className={`flex-1 px-3 py-2 rounded-lg text-lg font-bold ${
                        theme === 'dark' 
                          ? 'bg-slate-800 border-slate-600 text-white' 
                          : 'bg-slate-50 border-slate-300 text-slate-900'
                      } border focus:outline-none focus:ring-2 focus:ring-emerald-500/50`}
                      placeholder="0.00"
                      min="0"
                    />
                  </div>
                  <p className={`text-xs mt-2 ${theme === 'dark' ? 'text-amber-400' : 'text-amber-600'}`}>
                    <AlertTriangle className="w-3 h-3 inline mr-1" />
                    This amount will be deducted from customer's credit balance
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Notes */}
          <div>
            <label className={`text-sm font-medium mb-2 block ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
              Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className={`w-full px-3 py-2 rounded-xl border ${
                theme === 'dark'
                  ? 'bg-slate-800/50 border-slate-700/50 text-white placeholder-slate-500'
                  : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'
              } focus:outline-none focus:ring-2 focus:ring-emerald-500/50`}
              placeholder="Add any notes about this status update..."
            />
          </div>
        </div>

        {/* Actions */}
        <div className={`p-6 border-t flex gap-3 ${
          theme === 'dark' ? 'border-slate-700/50' : 'border-slate-200'
        }`}>
          <button
            onClick={handleSave}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl font-medium transition-all shadow-lg shadow-emerald-500/25"
          >
            <Save className="w-4 h-4" />
            Update Claim
            {canIssueCredit && creditAmount > 0 && (
              <span className="ml-2 text-xs bg-white/20 px-2 py-0.5 rounded-full">
                -Rs.{creditAmount.toLocaleString()}
              </span>
            )}
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
