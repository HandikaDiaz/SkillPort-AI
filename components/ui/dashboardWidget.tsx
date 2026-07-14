import { type LucideIcon } from 'lucide-react';
import { useEffect, useState, useRef } from 'react';

interface DashboardWidgetProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: LucideIcon;
    trend?: { value: number; isPositive: boolean };
    color?: 'primary' | 'secondary' | 'warning' | 'error';
}

const colorStyles = {
    primary: 'bg-primary-900 text-white',
    secondary: 'bg-secondary-50 text-secondary-900 border border-secondary-200',
    warning: 'bg-warning-light text-warning-900 border border-warning-200',
    error: 'bg-error-light text-error-900 border border-error-200',
};

const iconColors = {
    primary: 'text-white/80',
    secondary: 'text-secondary-600',
    warning: 'text-warning-600',
    error: 'text-error-600',
};

export default function DashboardWidget({ title, value, subtitle, icon: Icon, trend, color = 'primary' }: DashboardWidgetProps) {
    const [displayValue, setDisplayValue] = useState(0);
    const numericValue = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.]/g, '')) || 0 : value;
    const isNumeric = typeof value === 'number' || !isNaN(numericValue);
    const hasAnimated = useRef(false);

    useEffect(() => {
        if (!isNumeric || hasAnimated.current) return;
        hasAnimated.current = true;
        const duration = 800;
        const startTime = Date.now();
        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplayValue(Math.floor(numericValue * eased));
            if (progress < 1) requestAnimationFrame(animate);
            else setDisplayValue(numericValue);
        };
        requestAnimationFrame(animate);
    }, [numericValue, isNumeric]);

    const displayString = isNumeric
        ? (typeof value === 'string' && value.includes('$')
            ? `$ ${displayValue.toLocaleString()}`
            : typeof value === 'string' && value.includes('IDR')
                ? `IDR ${displayValue.toLocaleString()}`
                : displayValue.toLocaleString())
        : value;

    return (
        <div className={`rounded-xl p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-card-hover ${colorStyles[color]}`}>
            <div className="flex items-start justify-between mb-3">
                <span className={`text-body-sm font-medium ${color === 'primary' ? 'text-white/70' : 'opacity-70'}`}>{title}</span>
                <Icon className={`w-5 h-5 ${iconColors[color]}`} />
            </div>
            <div className="text-data-lg leading-none mb-1">{displayString}</div>
            {subtitle && (
                <p className={`text-body-sm ${color === 'primary' ? 'text-white/60' : 'opacity-60'}`}>{subtitle}</p>
            )}
            {trend && (
                <span className={`inline-flex items-center gap-1 text-caption font-medium mt-2 ${trend.isPositive ? 'text-success' : 'text-error'}`}>
                    {trend.isPositive ? '+' : '-'}{trend.value}%
                </span>
            )}
        </div>
    );
}
