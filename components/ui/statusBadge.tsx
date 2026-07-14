import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface StatusBadgeProps {
    status: 'success' | 'warning' | 'error' | 'info' | 'neutral';
    label: string;
    icon?: LucideIcon;
    className?: string;
}

const statusStyles = {
    success: 'bg-success-light text-success-700 border border-success-200',
    warning: 'bg-warning-light text-warning-700 border border-warning-200',
    error: 'bg-error-light text-error-700 border border-error-200',
    info: 'bg-info-light text-info border border-info/20',
    neutral: 'bg-neutral-100 text-neutral-600 border border-neutral-200',
};

const dotStyles = {
    success: 'bg-success',
    warning: 'bg-warning',
    error: 'bg-error',
    info: 'bg-info',
    neutral: 'bg-neutral-400',
};

export default function StatusBadge({ status, label, icon: Icon, className }: StatusBadgeProps) {
    return (
        <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-caption font-medium', statusStyles[status], className)}>
            {Icon && <Icon className="w-3.5 h-3.5" />}
            {!Icon && <span className={cn('w-1.5 h-1.5 rounded-full', dotStyles[status])}></span>}
            {label}
        </span>
    );
}
