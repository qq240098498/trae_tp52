import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Eye,
  ShoppingCart,
  AlertTriangle,
  TrendingUp,
  Users,
  ArrowRight,
  Clock,
  CheckCircle,
} from 'lucide-react';
import { StatCard } from '../components/DataTable';
import { StatusBadge, ReviewStatusBadge } from '../components/StatusBadge';
import { useCustomerStore } from '../store/customerStore';
import { useFrameStore } from '../store/frameStore';
import { useLensStore } from '../store/lensStore';
import { useOrderStore } from '../store/orderStore';
import { getDashboardStats, formatCurrency, formatDate } from '../utils';
import type { DashboardStats, Order } from '../types';

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    todayExams: 0,
    pendingOrders: 0,
    lowStockItems: 0,
    totalSales: 0,
  });

  const loadCustomerData = useCustomerStore((s) => s.loadData);
  const loadFrameData = useFrameStore((s) => s.loadData);
  const loadLensData = useLensStore((s) => s.loadData);
  const loadOrderData = useOrderStore((s) => s.loadData);
  const orders = useOrderStore((s) => s.orders);
  const customers = useCustomerStore((s) => s.customers);
  const frames = useFrameStore((s) => s.frames);
  const lenses = useLensStore((s) => s.lenses);

  useEffect(() => {
    loadCustomerData();
    loadFrameData();
    loadLensData();
    loadOrderData();
  }, []);

  const lowStockFrames = frames.filter((f) => f.stock <= f.warningStock);
  const lowStockLenses = lenses.filter((l) => l.stock <= l.warningStock);

  useEffect(() => {
    setStats(getDashboardStats());
  }, [customers, orders, frames, lenses]);

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const getCustomerName = (customerId: string) => {
    return customers.find((c) => c.id === customerId)?.name || '未知顾客';
  };

  const getOrderTimeline = (order: Order) => {
    const steps = [
      { status: 'pending', label: '待加工', icon: Clock },
      { status: 'processing', label: '加工中', icon: Clock },
      { status: 'completed', label: '已完成', icon: CheckCircle },
      { status: 'picked', label: '已取镜', icon: CheckCircle },
    ];
    const currentIndex = steps.findIndex((s) => s.status === order.status);
    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      current: index === currentIndex,
    }));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="今日验光"
          value={stats.todayExams}
          icon={Eye}
          color="blue"
          trend="较昨日 +2"
          trendUp
        />
        <StatCard
          title="待处理订单"
          value={stats.pendingOrders}
          icon={ShoppingCart}
          color="amber"
        />
        <StatCard
          title="库存预警"
          value={stats.lowStockItems}
          icon={AlertTriangle}
          color="red"
        />
        <StatCard
          title="总销售额"
          value={formatCurrency(stats.totalSales)}
          icon={TrendingUp}
          color="green"
          trend="本月 +12%"
          trendUp
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">最近订单</h3>
              <Link
                to="/orders"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
              >
                查看全部 <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="p-4 rounded-xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/30 transition-all"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {getCustomerName(order.customerId).charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{getCustomerName(order.customerId)}</p>
                        <p className="text-xs text-gray-500">订单号: {order.id}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <ReviewStatusBadge status={order.reviewStatus} />
                      <StatusBadge status={order.status} />
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-6">
                      {getOrderTimeline(order).map((step, index) => (
                        <div key={step.status} className="flex items-center">
                          <div
                            className={`flex items-center gap-1 ${
                              step.completed ? 'text-blue-600' : 'text-gray-400'
                            }`}
                          >
                            <step.icon className={`w-4 h-4 ${step.current ? 'animate-pulse' : ''}`} />
                            <span className="text-xs">{step.label}</span>
                          </div>
                          {index < 3 && (
                            <div
                              className={`w-8 h-0.5 mx-1 ${
                                step.completed ? 'bg-blue-200' : 'bg-gray-200'
                              }`}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                    <span className="font-semibold text-gray-900">{formatCurrency(order.totalPrice)}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">{formatDate(order.createdAt)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">库存预警</h3>
              <AlertTriangle className="w-5 h-5 text-amber-500" />
            </div>
            <div className="space-y-3">
              {[...lowStockFrames, ...lowStockLenses].slice(0, 5).map((item, index) => (
                <div
                  key={`${index}-${item.id}`}
                  className="flex items-center justify-between p-3 rounded-lg bg-red-50 border border-red-100"
                >
                  <div>
                    <p className="font-medium text-sm text-gray-900">
                      {'brand' in item ? item.brand : '镜片'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {'model' in item ? item.model : `${item.refractiveIndex}折射率`}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-red-600 font-bold">{item.stock} 件</p>
                    <p className="text-xs text-gray-500">预警: {item.warningStock}</p>
                  </div>
                </div>
              ))}
              {[...lowStockFrames, ...lowStockLenses].length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">暂无库存预警</p>
              )}
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-white/80 text-sm">顾客总数</p>
                <p className="text-2xl font-bold">{customers.length}</p>
              </div>
            </div>
            <Link
              to="/customers"
              className="w-full py-2 bg-white/20 hover:bg-white/30 rounded-lg text-center text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              管理顾客档案 <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
