import React from 'react';

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  children?: React.ReactNode;
  isFeatured?: boolean;
  subtitle?: string;
  gradient?: string;
  iconEffect?: string;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, icon, color, children, isFeatured, subtitle, gradient, iconEffect }) => {
  if (isFeatured) {
    return (
      <div className={`relative ${gradient || 'bg-gradient-to-br from-green-500 to-teal-600'} text-white rounded-xl shadow-lg p-6 flex flex-col justify-between hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden`}>
        <i className="fa-solid fa-trophy absolute -top-2 -right-2 text-white/10 text-6xl transform rotate-12"></i>
        <div>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-white/80 uppercase tracking-wider">{title}</h3>
            <span className={iconEffect || 'text-white/90'}>{icon}</span>
          </div>
          <p className="mt-2 text-4xl font-bold">{value}</p>
          {subtitle && <p className="text-sm text-white/80 mt-1 animate-fade-in">{subtitle}</p>}
        </div>
        {children && <div className="mt-4">{children}</div>}
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{title}</h3>
          <span className={color}>{icon}</span>
        </div>
        <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
      </div>
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
};