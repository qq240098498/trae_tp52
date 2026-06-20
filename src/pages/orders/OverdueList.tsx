import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  Bell,
  Clock,
  Eye,
  Send,
  ChevronDown,
  Phone,
} from 'lucide-react';
import { DataTable } from '../../components/DataTable';
import { StatusBadge, OverdueBadge } from '../../components/StatusBadge';
import { useCustomerStore } from '../../store/customerStore';
import { useFrameStore } from '../../store/frameStore';
import { useLensStore } from '../../store/lensStore';
import { useOrderStore } from '../../store/orderStore';
import { formatCurrency, formatDate, getDaysSinceCompleted, getOverdueStatus } from '../../utils';
import type { Order, OverdueStatus } from '../../types';

export default function OverdueList() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | OverdueStatus>('all');

  const orders = useOrderStore((s) => s.orders);
  const getCustomerById = useCustomerStore((s) => s.getCustomerById);
  const getFrameById = useFrameStore((s) => s.getFrameById);
  const getLensById = useLensStore((s) => s.getLensById);
  const sendPickupReminder = useOrderStore((s) => s.sendPickupReminder);
  const sendBatchPickupReminders = useOrderStore((s) => s.sendBatchPickupReminders);

  const overdueOrders = orders.filter((o) => {
    const status = getOverdueStatus(o);
    if (filter === 'all') return status === 'warning' || status === 'abnormal';
    return status === filter;
  });

  const warningCount = orders.filter((o) => getOverdueStatus(o) === 'warning').length;
  const abnormalCount = orders.filter((o) => getOverdueStatus(o) === 'abnormal').length;

  const sortedOrders = [...overdueOrders].sort((a, b) => {
    const daysA = getDaysSinceCompleted(a);
    const daysB = getDaysSinceCompleted(b);
    return daysB - daysA;
  });

  const handleSendReminder = (e: React.MouseEvent, orderId: string) => {
    e.stopPropagation();
    const order = orders.find((o) => o.id === orderId);
    const customer = order ? getCustomerById(order.customerId) : null;
    if (confirm(`确定要向 ${customer?.name || '顾客'} 发送取镜提醒短信吗？`)) {
      const success = sendPickupReminder(orderId);
      if (success) {
        alert('短信提醒发送成功！');
      } else {
        alert('短信提醒发送失败，请稍后重试。');
      }
    }
  };

  const handleBatchSend = () => {
    const unsentCount = orders.filter(
      (o) => getOverdueStatus(o) === 'warning' && !o.pickupReminderSent
    ).length;
    if (unsentCount === 0) {
      alert('没有需要发送提醒的订单。');
      return;
    }
    if (confirm(`确定要向 ${unsentCount} 位顾客批量发送取镜提醒短信吗？`)) {
      const result = sendBatchPickupReminders();
      alert(`批量发送完成！成功: ${result.success} 条，失败: ${result.failed} 条`);
    }
  };

  const filterOptions = [
    { value: 'all', label: '全部逾期' },
    { value: 'warning', label: '逾期提醒 (7天以上)' },
    { value: 'abnormal', label: '逾期异常 (30天以上)' },
  ];

  const columns = [
    {
      key: 'orderId',
      header: '订单号',
      render: (item: Order) => (
        <span className="font-mono text-sm text-gray-900">{item.id}</span>
      ),
    },
    {
      key: 'customer',
      header: '顾客信息',
      render: (item: Order) => {
        const customer = getCustomerById(item.customerId);
        return (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
              {customer?.name.charAt(0) || '?'}
            </div>
            <div>
              <p className="font-medium text-gray-900">{customer?.name || '未知'}</p>
              <p className="text-xs text-gray-500 flex items-center gap-1">
                <Phone className="w-3 h-3" />
                {customer?.phone || '-'}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      key: 'products',
      header: '配镜信息',
      render: (item: Order) => {
        const frame = getFrameById(item.frameId);
        const lens = getLensById(item.lensId);
        return (
          <div className="text-sm">
            <p className="text-gray-900">{frame?.brand} {frame?.model}</p>
            <p className="text-gray-500">{lens?.brand} {lens?.refractiveIndex}</p>
          </div>
        );
      },
    },
    {
      key: 'completedDate',
      header: '加工完成日期',
      render: (item: Order) => (
        <span className="text-sm text-gray-500">
          {item.completedAt ? formatDate(item.completedAt) : '-'}
        </span>
      ),
    },
    {
      key: 'overdueDays',
      header: '逾期天数',
      render: (item: Order) => {
        const days = getDaysSinceCompleted(item);
        return (
          <span className="text-sm font-medium text-gray-900">
            {days} 天
          </span>
        );
      },
    },
    {
      key: 'overdueStatus',
      header: '逾期状态',
      render: (item: Order) => {
        const status = getOverdueStatus(item);
        const days = getDaysSinceCompleted(item);
        return <OverdueBadge status={status} days={days} />;
      },
    },
    {
      key: 'reminderStatus',
      header: '提醒状态',
      render: (item: Order) => (
        <div className="flex flex-col gap-1">
          {item.pickupReminderSent ? (
            <span className="inline-flex items-center gap-1 text-xs text-green-600">
              <Bell className="w-3 h-3" />
              已发送
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs text-gray-400">
              <Bell className="w-3 h-3" />
              未发送
            </span>
          )}
          {item.pickupReminderSentAt && (
            <span className="text-xs text-gray-400">
              {formatDate(item.pickupReminderSentAt)}
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'status',
      header: '订单状态',
      render: (item: Order) => <StatusBadge status={item.status} />,
    },
    {
      key: 'totalPrice',
      header: '金额',
      render: (item: Order) => (
        <span className="font-semibold text-green-600">{formatCurrency(item.totalPrice)}</span>
      ),
    },
    {
      key: 'actions',
      header: '操作',
      className: 'text-right',
      render: (item: Order) => (
        <div className="flex items-center justify-end gap-2">
          {item.status === 'completed' && !item.pickupReminderSent && (
            <button
              onClick={(e) => handleSendReminder(e, item.id)}
              className="flex items-center gap-1 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs rounded-lg font-medium transition-colors"
              title="发送提醒短信"
            >
              <Send className="w-3.5 h-3.5" />
              发送提醒
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/orders/${item.id}`);
            }}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="查看详情"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-900">取镜逾期跟踪</h2>
          <p className="text-sm text-gray-500 mt-1">管理加工完成后未及时取镜的订单</p>
        </div>
        <button
          onClick={handleBatchSend}
          className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl font-medium transition-colors shadow-lg shadow-amber-500/20"
        >
          <Send className="w-5 h-5" />
          批量发送提醒
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">逾期总数</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{warningCount + abnormalCount}</p>
            </div>
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">逾期提醒 (7天以上)</p>
              <p className="text-3xl font-bold text-amber-600 mt-1">{warningCount}</p>
            </div>
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <Bell className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">逾期异常 (30天以上)</p>
              <p className="text-3xl font-bold text-red-600 mt-1">{abnormalCount}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold text-gray-900">逾期订单列表</h3>
          <div className="relative">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as 'all' | OverdueStatus)}
              className="pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
            >
              {filterOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        <DataTable
          columns={columns}
          data={sortedOrders}
          onRowClick={(item) => navigate(`/orders/${item.id}`)}
          emptyMessage="暂无逾期订单"
        />
      </div>
    </div>
  );
}
