import React from 'react';
import { VerdictType } from '../types';
import { CheckCircle, XCircle, AlertTriangle, HelpCircle } from 'lucide-react';

interface VerdictBadgeProps {
  verdict: VerdictType;
  size?: 'sm' | 'md' | 'lg';
}

const VerdictBadge: React.FC<VerdictBadgeProps> = ({ verdict, size = 'md' }) => {
  // Strict Palette: Black, Red, White
  let colorClass = '';
  let Icon = HelpCircle;

  switch (verdict) {
    case VerdictType.TRUE:
      colorClass = 'bg-white text-black border-black';
      Icon = CheckCircle;
      break;
    case VerdictType.FALSE:
      colorClass = 'bg-white text-ruju-red border-ruju-red';
      Icon = XCircle;
      break;
    case VerdictType.MISLEADING:
      colorClass = 'bg-white text-ruju-red border-ruju-red';
      Icon = AlertTriangle;
      break;
    case VerdictType.UNVERIFIED:
      colorClass = 'bg-white text-black border-black border-dashed';
      Icon = HelpCircle;
      break;
  }

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs gap-1 border',
    md: 'px-3 py-1 text-sm gap-1.5 border',
    lg: 'px-4 py-2 text-base gap-2 border-2'
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-bold ${sizeClasses[size]} backdrop-blur-md shadow-md border border-white/40`} 
      style={{ backgroundColor: 'rgba(255,255,255,0.35)' }}
    >
      <Icon className={size === 'lg' ? 'w-5 h-5' : 'w-4 h-4'} />
      {verdict}
    </span>
  );
};

export default VerdictBadge;