import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Phone, Calendar, MapPin, Edit2, Eye, ShoppingCart, AlertTriangle } from 'lucide-react';
import { PrescriptionCard } from '../../components/PrescriptionCard';
import { StatusBadge } from '../../components/StatusBadge';
import { useCustomerStore } from '../../store/customerStore';
import { useOrderStore } from '../../store/orderStore';
import { formatDate, formatCurrency, calculatePrescriptionDiff } from '../../utils';

export default function CustomerDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const getCustomerById = useCustomerStore((s) => s.getCustomerById);
  const getExamRecordsByCustomerId = useCustomerStore((s) => s.getExamRecordsByCustomerId);
  const getOrdersByCustomerId = useOrderStore((s) => s.getOrdersByCustomerId);

  const customer = id ? getCustomerById(id) : undefined;
  const examRecords = id ? getExamRecordsByCustomerId(id) : [];
  const orders = id ? getOrdersByCustomerId(id) : [];

  if (!customer) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">未找到该顾客信息</p>
        <button
          onClick={() => navigate('/customers')}
          className="mt-4 text-blue-600 hover:text-blue-700"
        >
          返回顾客列表
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/customers')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-900">{customer.name}</h2>
        </div>
        <button
          onClick={() => navigate(`/customers/${id}/exam/new`)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          新增验光
        </button>
        <button
          onClick={() => navigate(`/orders/new?customerId=${id}`)}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
        >
          <ShoppingCart className="w-4 h-4" />
          创建订单
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                {customer.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">{customer.name}</h3>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                  customer.gender === '男' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'
                }`}>
                  {customer.gender}
                </span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-gray-700">{customer.phone}</span>
              </div>
              {customer.birthday && (
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700">{customer.birthday}</span>
                </div>
              )}
              {customer.address && (
                <div className="flex items-start gap-3 text-sm">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                  <span className="text-gray-700">{customer.address}</span>
                </div>
              )}
            </div>
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">{examRecords.length}</p>
                  <p className="text-xs text-gray-500">验光次数</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">{orders.length}</p>
                  <p className="text-xs text-gray-500">配镜订单</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <Eye className="w-5 h-5 text-blue-600" />
                验光记录
              </h3>
              <span className="text-sm text-gray-500">共 {examRecords.length} 条记录</span>
            </div>
            <div className="p-6 space-y-4">
              {examRecords.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">暂无验光记录</p>
                  <button
                    onClick={() => navigate(`/customers/${id}/exam/new`)}
                    className="mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    + 新增验光记录
                  </button>
                </div>
              ) : (
                examRecords.map((record, index) => (
                  <div
                    key={record.id}
                    className="relative"
                  >
                    {index < examRecords.length - 1 && (
                      <div className="absolute left-6 top-20 bottom-0 w-0.5 bg-gray-200"></div>
                    )}
                    <div className="relative flex gap-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 z-10 ${
                        index === 0
                          ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30'
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        <Eye className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <p className="font-medium text-gray-900 flex items-center gap-2 flex-wrap">
                              {formatDate(record.examDate)} 验光
                              {index === 0 && (
                                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                                  最新
                                </span>
                              )}
                              {index < examRecords.length - 1 && (() => {
                                const prevRecord = examRecords[index + 1];
                                const diff = calculatePrescriptionDiff(prevRecord, record);
                                if (diff.hasSignificantChange) {
                                  return (
                                    <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs rounded-full flex items-center gap-1">
                                      <AlertTriangle className="w-3 h-3" />
                                      度数变动
                                    </span>
                                  );
                                }
                                return null;
                              })()}
                            </p>
                            <p className="text-sm text-gray-500">验光师: {record.optometrist}</p>
                            {index < examRecords.length - 1 && (() => {
                              const prevRecord = examRecords[index + 1];
                              const diff = calculatePrescriptionDiff(prevRecord, record);
                              if (diff.hasSignificantChange) {
                                return (
                                  <p className="text-xs text-amber-600 mt-1">
                                    较上次: {diff.significantItems.join('、')} 有变化
                                  </p>
                                );
                              }
                              return null;
                            })()}
                          </div>
                          <Link
                            to={`/customers/${id}/exam/${record.id}`}
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                          >
                            查看详情
                          </Link>
                        </div>
                        <PrescriptionCard
                          rightEye={record.rightEye}
                          leftEye={record.leftEye}
                          pd={record.pd}
                          title=""
                          showVisualAcuity
                        />
                        {record.notes && (
                          <p className="mt-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                            备注: {record.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {orders.length > 0 && (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-green-600" />
                  配镜订单
                </h3>
              </div>
              <div className="divide-y divide-gray-100">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer"
                    onClick={() => navigate(`/orders/${order.id}`)}
                  >
                    <div>
                      <p className="font-medium text-gray-900">订单号: {order.id}</p>
                      <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-semibold text-gray-900">{formatCurrency(order.totalPrice)}</span>
                      <StatusBadge status={order.status} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
