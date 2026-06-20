import type { OrderStatus } from '../types';

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
