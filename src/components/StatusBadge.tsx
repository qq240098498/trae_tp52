import type { OrderStatus, OverdueStatus } from '../types';

interface StatusBadgeProps {
  status: OrderStatus;
}

const statusConfig: Record<OrderStatus, { label: string; className: string }> = {
  pending: {
    label: '待加工',
    className: 'bg-amber-100 text-amber-800 border-amber-200',
  },
  processing: {
    label: '加工中',
    className: 'bg-blue-100 text-blue-800 border-blue-200',
  },
  completed: {
    label: '已完成',
    className: 'bg-green-100 text-green-800 border-green-200',
  },
  picked: {
    label: '已取镜',
    className: 'bg-gray-100 text-gray-800 border-gray-200',
  },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${config.className}`}
    >
      {config.label}
    </span>
  );
}

export function ReviewStatusBadge({ status }: { status: 'pending' | 'reviewed' }) {
  if (status === 'reviewed') {
    return (
      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
        已复核
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200">
      待复核
    </span>
  );
}

const overdueConfig: Record<OverdueStatus, { label: string; className: string }> = {
  normal: {
    label: '正常',
    className: 'bg-green-100 text-green-800 border-green-200',
  },
  warning: {
    label: '逾期提醒',
    className: 'bg-amber-100 text-amber-800 border-amber-200',
  },
  abnormal: {
    label: '逾期异常',
    className: 'bg-red-100 text-red-800 border-red-200',
  },
};

interface OverdueBadgeProps {
  status: OverdueStatus;
  days?: number;
}

export function OverdueBadge({ status, days }: OverdueBadgeProps) {
  const config = overdueConfig[status];
  const label = days !== undefined && days > 0 ? `${config.label} (${days}天)` : config.label;
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${config.className}`}
    >
      {label}
    </span>
  );
}
