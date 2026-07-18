import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

interface StatusBadgeProps {
    status: 'success' | 'warning' | 'error' | 'info' | 'neutral';
    label: string;
    icon?: LucideIcon;
    className?: string;
}

const statusStyles = {
    success: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
    warning: 'bg-amber-100 text-amber-700 border border-amber-200',
    error: 'bg-red-100 text-red-700 border border-red-200',
    info: 'bg-sky-100 text-sky-700 border border-sky-200',
    neutral: 'bg-gray-100 text-gray-600 border border-gray-200',
};

const dotStyles = {
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    error: 'bg-red-500',
    info: 'bg-sky-500',
    neutral: 'bg-gray-400',
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