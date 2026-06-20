import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams, useParams } from 'react-router-dom';
import {
  Plus,
  Search,
  ArrowLeft,
  Save,
  Eye,
  Glasses,
  ShoppingCart,
  ChevronDown,
  AlertTriangle,
} from 'lucide-react';
import { DataTable } from '../../components/DataTable';
import { StatusBadge, ReviewStatusBadge, OverdueBadge } from '../../components/StatusBadge';
import { PrescriptionCard, PrescriptionCompare } from '../../components/PrescriptionCard';
import { Modal } from '../../components/Modal';
import { useCustomerStore } from '../../store/customerStore';
import { useFrameStore } from '../../store/frameStore';
import { useLensStore } from '../../store/lensStore';
import { useOrderStore } from '../../store/orderStore';
import {
  formatCurrency,
  formatDate,
  calculatePrescriptionDiff,
  getChangeTrendText,
  getPreviousExamRecord,
  getOverdueStatus,
  getDaysSinceCompleted,
} from '../../utils';
import type { Order } from '../../types';

export function OrderList() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState<Order['status'] | 'all'>(
    (searchParams.get('status') as Order['status'] | 'all') || 'all'
  );

  const orders = useOrderStore((s) => s.searchOrders(searchKeyword));
  const getCustomerById = useCustomerStore((s) => s.getCustomerById);
  const getFrameById = useFrameStore((s) => s.getFrameById);
  const getLensById = useLensStore((s) => s.getLensById);

  const handleStatusChange = (value: Order['status'] | 'all') => {
    setStatusFilter(value);
    if (value === 'all') {
      setSearchParams({}, { replace: true });
    } else {
      setSearchParams({ status: value }, { replace: true });
    }
  };

  const filteredOrders = statusFilter === 'all'
    ? orders
    : orders.filter((o) => o.status === statusFilter);

  const sortedOrders = [...filteredOrders].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

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
      header: '顾客',
      render: (item: Order) => {
        const customer = getCustomerById(item.customerId);
        return (
          <span className="font-medium text-gray-900">{customer?.name || '未知'}</span>
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
      key: 'totalPrice',
      header: '金额',
      render: (item: Order) => (
        <span className="font-semibold text-green-600">{formatCurrency(item.totalPrice)}</span>
      ),
    },
    {
      key: 'status',
      header: '状态',
      render: (item: Order) => (
        <div className="flex flex-col gap-1">
          <StatusBadge status={item.status} />
          <ReviewStatusBadge status={item.reviewStatus} />
          {item.status === 'completed' && getOverdueStatus(item) !== 'normal' && (
            <OverdueBadge status={getOverdueStatus(item)} days={getDaysSinceCompleted(item)} />
          )}
        </div>
      ),
    },
    {
      key: 'createdAt',
      header: '创建时间',
      render: (item: Order) => (
        <span className="text-sm text-gray-500">{formatDate(item.createdAt)}</span>
      ),
    },
    {
      key: 'actions',
      header: '操作',
      className: 'text-right',
      render: (item: Order) => (
        <div className="flex items-center justify-end gap-2">
          {item.status === 'completed' && item.reviewStatus === 'pending' && (
            <Link
              to={`/orders/${item.id}/pickup`}
              className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs rounded-lg font-medium transition-colors"
            >
              取镜复核
            </Link>
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

  const statusOptions = [
    { value: 'all', label: '全部' },
    { value: 'pending', label: '待加工' },
    { value: 'processing', label: '加工中' },
    { value: 'completed', label: '已完成' },
    { value: 'picked', label: '已取镜' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索订单号..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => handleStatusChange(e.target.value as Order['status'] | 'all')}
              className="pl-4 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <Link
          to="/orders/new"
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors shadow-lg shadow-blue-600/20"
        >
          <Plus className="w-5 h-5" />
          新建订单
        </Link>
      </div>

      <DataTable
        columns={columns}
        data={sortedOrders}
        onRowClick={(item) => navigate(`/orders/${item.id}`)}
        emptyMessage="暂无订单，点击右上角按钮创建"
      />
    </div>
  );
}

export function NewOrder() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preSelectedCustomerId = searchParams.get('customerId');
  const preSelectedExamId = searchParams.get('examId');

  const customers = useCustomerStore((s) => s.customers);
  const getExamRecordsByCustomerId = useCustomerStore((s) => s.getExamRecordsByCustomerId);
  const frames = useFrameStore((s) => s.frames);
  const lenses = useLensStore((s) => s.lenses);
  const addOrder = useOrderStore((s) => s.addOrder);

  const [selectedCustomerId, setSelectedCustomerId] = useState(preSelectedCustomerId || '');
  const [selectedExamId, setSelectedExamId] = useState(preSelectedExamId || '');
  const [selectedFrameId, setSelectedFrameId] = useState('');
  const [selectedLensId, setSelectedLensId] = useState('');
  const [deposit, setDeposit] = useState(0);
  const [notes, setNotes] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [showChangeAlert, setShowChangeAlert] = useState(false);

  const selectedCustomer = selectedCustomerId
    ? customers.find((c) => c.id === selectedCustomerId)
    : undefined;

  const examRecords = selectedCustomerId
    ? getExamRecordsByCustomerId(selectedCustomerId)
    : [];

  const selectedExam = selectedExamId
    ? examRecords.find((e) => e.id === selectedExamId)
    : undefined;

  const selectedFrame = selectedFrameId
    ? frames.find((f) => f.id === selectedFrameId)
    : undefined;

  const selectedLens = selectedLensId
    ? lenses.find((l) => l.id === selectedLensId)
    : undefined;

  const totalPrice = (selectedFrame?.salePrice || 0) + (selectedLens?.salePrice || 0);

  const previousExam = selectedExamId
    ? getPreviousExamRecord(examRecords, selectedExamId)
    : undefined;

  const prescriptionDiff = selectedExam && previousExam
    ? calculatePrescriptionDiff(previousExam, selectedExam)
    : null;

  useEffect(() => {
    if (preSelectedExamId && examRecords.length > 0) {
      const exam = examRecords.find((e) => e.id === preSelectedExamId);
      if (!exam) {
        setSelectedExamId(examRecords[0]?.id || '');
      }
    } else if (examRecords.length > 0 && !selectedExamId) {
      setSelectedExamId(examRecords[0]?.id || '');
    }
  }, [preSelectedExamId, examRecords, selectedExamId]);

  useEffect(() => {
    if (selectedExamId && prescriptionDiff?.hasSignificantChange) {
      setShowChangeAlert(true);
    }
  }, [selectedExamId, prescriptionDiff?.hasSignificantChange]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomerId || !selectedExamId || !selectedFrameId || !selectedLensId) {
      alert('请填写完整信息');
      return;
    }

    const defaultPickupDate = pickupDate || new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    addOrder({
      customerId: selectedCustomerId,
      examRecordId: selectedExamId,
      frameId: selectedFrameId,
      lensId: selectedLensId,
      totalPrice,
      deposit,
      notes,
      pickupDate: defaultPickupDate,
      oldGlassesRx: null,
    });

    navigate('/orders');
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/orders')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-gray-900">新建配镜订单</h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-blue-600" />
            选择顾客
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                选择顾客 <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={selectedCustomerId}
                onChange={(e) => {
                  setSelectedCustomerId(e.target.value);
                  setSelectedExamId('');
                }}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
              >
                <option value="">请选择顾客</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} - {c.phone}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                选择验光记录 <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={selectedExamId}
                onChange={(e) => setSelectedExamId(e.target.value)}
                disabled={!selectedCustomerId || examRecords.length === 0}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all disabled:opacity-50"
              >
                <option value="">请选择验光记录</option>
                {examRecords.map((e) => (
                  <option key={e.id} value={e.id}>
                    {formatDate(e.examDate)} - {e.optometrist}
                  </option>
                ))}
              </select>
              {selectedCustomerId && examRecords.length === 0 && (
                <p className="text-sm text-amber-600 mt-1">该顾客暂无验光记录</p>
              )}
            </div>
          </div>

          {selectedExam && (
            <div className="mt-6">
              {prescriptionDiff?.hasSignificantChange && (
                <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-amber-800">度数变动提醒</p>
                    <p className="text-sm text-amber-700 mt-1">
                      与上次验光（{formatDate(previousExam!.examDate)}）相比，{prescriptionDiff.significantItems.join('、')} 有变化
                    </p>
                    <button
                      type="button"
                      onClick={() => setShowChangeAlert(true)}
                      className="mt-2 text-sm text-amber-700 underline hover:text-amber-800"
                    >
                      查看详细对比
                    </button>
                  </div>
                </div>
              )}
              <PrescriptionCard
                rightEye={selectedExam.rightEye}
                leftEye={selectedExam.leftEye}
                pd={selectedExam.pd}
                title="配镜度数"
                showVisualAcuity
              />
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Glasses className="w-5 h-5 text-blue-600" />
            选择商品
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                选择镜架 <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={selectedFrameId}
                onChange={(e) => setSelectedFrameId(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
              >
                <option value="">请选择镜架</option>
                {frames.filter((f) => f.stock > 0).map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.brand} {f.model} - {f.color} - {f.material} - {formatCurrency(f.salePrice)} (库存: {f.stock})
                  </option>
                ))}
              </select>
              {selectedFrame && (
                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    已选: {selectedFrame.brand} {selectedFrame.model} - {selectedFrame.color}
                  </p>
                  <p className="text-sm font-semibold text-blue-600">
                    {formatCurrency(selectedFrame.salePrice)}
                  </p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                选择镜片 <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={selectedLensId}
                onChange={(e) => setSelectedLensId(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
              >
                <option value="">请选择镜片</option>
                {lenses.filter((l) => l.stock > 0).map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.brand} {l.refractiveIndex} {l.coating} - {l.type} - {formatCurrency(l.salePrice)} (库存: {l.stock})
                  </option>
                ))}
              </select>
              {selectedLens && (
                <div className="mt-3 p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-800">
                    已选: {selectedLens.brand} {selectedLens.refractiveIndex} {selectedLens.coating}
                  </p>
                  <p className="text-sm font-semibold text-green-600">
                    {formatCurrency(selectedLens.salePrice)}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="font-bold text-gray-900 mb-4">订单信息</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                预计取镜日期
              </label>
              <input
                type="date"
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                订金 (元)
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={deposit}
                onChange={(e) => setDeposit(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
                placeholder="0"
              />
            </div>
            <div className="flex items-end">
              <div className="w-full bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
                <p className="text-sm text-blue-600">订单总价</p>
                <p className="text-2xl font-bold text-blue-700">{formatCurrency(totalPrice)}</p>
                {deposit > 0 && (
                  <p className="text-xs text-blue-500 mt-1">
                    余款: {formatCurrency(totalPrice - deposit)}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">备注</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all resize-none"
              placeholder="特殊要求或备注信息"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/orders')}
            className="px-5 py-2.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
          >
            取消
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-lg shadow-blue-600/20"
          >
            <Save className="w-4 h-4" />
            创建订单
          </button>
        </div>
      </form>

      <Modal
        isOpen={showChangeAlert}
        onClose={() => setShowChangeAlert(false)}
        title="度数变动提醒"
        maxWidth="max-w-3xl"
      >
        {prescriptionDiff && previousExam && selectedExam && (
          <div className="space-y-6">
            <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-lg border border-amber-200">
              <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-amber-900">注意：顾客度数有明显变化</h4>
                <p className="text-sm text-amber-700 mt-1">
                  与上次验光（{formatDate(previousExam.examDate)}）相比，以下项目变化超过25度，请确认配镜度数是否合适。
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="font-medium text-gray-700">变化趋势：</p>
              <ul className="space-y-1 text-sm">
                <li className={prescriptionDiff.rightSphereDiff !== 0 ? 'text-gray-700' : 'text-gray-400'}>
                  • 右眼球镜：{getChangeTrendText(prescriptionDiff.rightSphereDiff, '度数')}
                </li>
                <li className={prescriptionDiff.rightCylinderDiff !== 0 ? 'text-gray-700' : 'text-gray-400'}>
                  • 右眼柱镜：{getChangeTrendText(prescriptionDiff.rightCylinderDiff, '度数')}
                </li>
                <li className={prescriptionDiff.leftSphereDiff !== 0 ? 'text-gray-700' : 'text-gray-400'}>
                  • 左眼球镜：{getChangeTrendText(prescriptionDiff.leftSphereDiff, '度数')}
                </li>
                <li className={prescriptionDiff.leftCylinderDiff !== 0 ? 'text-gray-700' : 'text-gray-400'}>
                  • 左眼柱镜：{getChangeTrendText(prescriptionDiff.leftCylinderDiff, '度数')}
                </li>
              </ul>
            </div>

            <PrescriptionCompare
              oldRx={{
                rightEye: previousExam.rightEye,
                leftEye: previousExam.leftEye,
                pd: previousExam.pd,
              }}
              newRx={{
                rightEye: selectedExam.rightEye,
                leftEye: selectedExam.leftEye,
                pd: selectedExam.pd,
              }}
            />

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowChangeAlert(false)}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                我知道了
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showChangeAlert, setShowChangeAlert] = useState(false);

  const getOrderById = useOrderStore((s) => s.getOrderById);
  const updateOrderStatus = useOrderStore((s) => s.updateOrderStatus);
  const sendPickupReminder = useOrderStore((s) => s.sendPickupReminder);
  const getCustomerById = useCustomerStore((s) => s.getCustomerById);
  const getExamRecordById = useCustomerStore((s) => s.getExamRecordById);
  const getExamRecordsByCustomerId = useCustomerStore((s) => s.getExamRecordsByCustomerId);
  const getFrameById = useFrameStore((s) => s.getFrameById);
  const getLensById = useLensStore((s) => s.getLensById);

  const order = id ? getOrderById(id) : undefined;
  const customer = order ? getCustomerById(order.customerId) : undefined;
  const examRecord = order ? getExamRecordById(order.examRecordId) : undefined;
  const frame = order ? getFrameById(order.frameId) : undefined;
  const lens = order ? getLensById(order.lensId) : undefined;

  const examRecords = order ? getExamRecordsByCustomerId(order.customerId) : [];
  const previousExam = order && examRecord
    ? getPreviousExamRecord(examRecords, order.examRecordId)
    : undefined;

  const prescriptionDiff = examRecord && previousExam
    ? calculatePrescriptionDiff(previousExam, examRecord)
    : null;

  if (!order) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">未找到该订单</p>
        <button
          onClick={() => navigate('/orders')}
          className="mt-4 text-blue-600 hover:text-blue-700"
        >
          返回订单列表
        </button>
      </div>
    );
  }

  const statusSteps = [
    { status: 'pending' as const, label: '待加工', description: '订单已创建，等待加工' },
    { status: 'processing' as const, label: '加工中', description: '正在加工配镜' },
    { status: 'completed' as const, label: '已完成', description: '加工完成，等待取镜' },
    { status: 'picked' as const, label: '已取镜', description: '顾客已取镜' },
  ];

  const currentStepIndex = statusSteps.findIndex((s) => s.status === order.status);

  const handleStatusUpdate = (newStatus: Order['status']) => {
    if (confirm(`确定要将订单状态更新为"${statusSteps.find((s) => s.status === newStatus)?.label}"吗？`)) {
      updateOrderStatus(order.id, newStatus);
    }
  };

  const getNextStatus = () => {
    if (currentStepIndex < statusSteps.length - 1) {
      return statusSteps[currentStepIndex + 1];
    }
    return null;
  };

  const nextStatus = getNextStatus();

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/orders')}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-gray-900">订单详情</h2>
            <p className="text-sm text-gray-500">订单号: {order.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex flex-col gap-1">
            <StatusBadge status={order.status} />
            {order.status === 'completed' && getOverdueStatus(order) !== 'normal' && (
              <OverdueBadge status={getOverdueStatus(order)} days={getDaysSinceCompleted(order)} />
            )}
          </div>
          {nextStatus && (
            <button
              onClick={() => handleStatusUpdate(nextStatus.status)}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
            >
              标记为{nextStatus.label}
            </button>
          )}
          {order.status === 'completed' && order.reviewStatus === 'pending' && (
            <button
              onClick={() => navigate(`/orders/${order.id}/pickup`)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              取镜复核
            </button>
          )}
          {order.status === 'completed' && !order.pickupReminderSent && (
            <button
              onClick={() => {
                if (confirm(`确定要向 ${customer?.name || '顾客'} 发送取镜提醒短信吗？`)) {
                  const success = sendPickupReminder(order.id);
                  if (success) {
                    alert('短信提醒发送成功！');
                  } else {
                    alert('短信提醒发送失败，请稍后重试。');
                  }
                }
              }}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium transition-colors"
            >
              发送取镜提醒
            </button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-bold text-gray-900 mb-6">订单进度</h3>
        <div className="flex items-start justify-between">
          {statusSteps.map((step, index) => (
            <div key={step.status} className="flex flex-col items-center flex-1">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center z-10 ${
                  index <= currentStepIndex
                    ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                {index + 1}
              </div>
              <div className="text-center mt-3">
                <p
                  className={`font-medium ${
                    index <= currentStepIndex ? 'text-gray-900' : 'text-gray-400'
                  }`}
                >
                  {step.label}
                </p>
                <p className="text-xs text-gray-500 mt-1 max-w-32">{step.description}</p>
              </div>
              {index < statusSteps.length - 1 && (
                <div
                  className={`absolute top-6 h-0.5 w-[calc(25%-3rem)] ${
                    index < currentStepIndex ? 'bg-blue-500' : 'bg-gray-200'
                  }`}
                  style={{ left: `${(index + 1) * 25 - 12.5}%` }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-bold text-gray-900 mb-4">顾客信息</h3>
            {customer && (
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  {customer.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-lg">{customer.name}</p>
                  <p className="text-sm text-gray-500">{customer.phone}</p>
                  {customer.birthday && (
                    <p className="text-sm text-gray-500">生日: {customer.birthday}</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {examRecord && (
            <div>
              <h3 className="font-bold text-gray-900 mb-4">验光处方</h3>
              {prescriptionDiff?.hasSignificantChange && (
                <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-medium text-amber-800">度数变动提醒</p>
                    <p className="text-sm text-amber-700 mt-1">
                      与上次验光（{formatDate(previousExam!.examDate)}）相比，{prescriptionDiff.significantItems.join('、')} 有变化
                    </p>
                    <button
                      type="button"
                      onClick={() => setShowChangeAlert(true)}
                      className="mt-2 text-sm text-amber-700 underline hover:text-amber-800"
                    >
                      查看详细对比
                    </button>
                  </div>
                </div>
              )}
              <PrescriptionCard
                rightEye={examRecord.rightEye}
                leftEye={examRecord.leftEye}
                pd={examRecord.pd}
                title=""
                showVisualAcuity
              />
              {examRecord.notes && (
                <p className="mt-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                  验光备注: {examRecord.notes}
                </p>
              )}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-bold text-gray-900 mb-4">配镜信息</h3>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-600 font-medium mb-1">镜架</p>
                {frame && (
                  <>
                    <p className="font-semibold text-blue-900">
                      {frame.brand} {frame.model}
                    </p>
                    <p className="text-sm text-blue-700">
                      {frame.color} · {frame.material}
                    </p>
                    <p className="text-lg font-bold text-blue-600 mt-2">
                      {formatCurrency(frame.salePrice)}
                    </p>
                  </>
                )}
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <p className="text-xs text-green-600 font-medium mb-1">镜片</p>
                {lens && (
                  <>
                    <p className="font-semibold text-green-900">
                      {lens.brand} {lens.refractiveIndex}
                    </p>
                    <p className="text-sm text-green-700">
                      {lens.coating} · {lens.type}
                    </p>
                    <p className="text-lg font-bold text-green-600 mt-2">
                      {formatCurrency(lens.salePrice)}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-blue-200">镜架</span>
                <span>{formatCurrency(frame?.salePrice || 0)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-blue-200">镜片</span>
                <span>{formatCurrency(lens?.salePrice || 0)}</span>
              </div>
              <div className="border-t border-blue-400/30 pt-3 flex justify-between">
                <span className="font-medium">合计</span>
                <span className="text-2xl font-bold">{formatCurrency(order.totalPrice)}</span>
              </div>
              {order.deposit > 0 && (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-blue-200">已收订金</span>
                    <span>-{formatCurrency(order.deposit)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-200">余款</span>
                    <span className="font-bold text-xl">
                      {formatCurrency(order.totalPrice - order.deposit)}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-bold text-gray-900 mb-3">订单信息</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">创建时间</span>
                <span className="text-gray-900">{formatDate(order.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">预计取镜</span>
                <span className="text-gray-900">{order.pickupDate}</span>
              </div>
              {order.completedAt && (
                <div className="flex justify-between">
                  <span className="text-gray-500">加工完成</span>
                  <span className="text-gray-900">{formatDate(order.completedAt)}</span>
                </div>
              )}
              {order.status === 'completed' && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">逾期状态</span>
                  <OverdueBadge status={getOverdueStatus(order)} days={getDaysSinceCompleted(order)} />
                </div>
              )}
              <div className="flex justify-between items-center">
                <span className="text-gray-500">提醒状态</span>
                {order.pickupReminderSent ? (
                  <span className="text-xs text-green-600">
                    已发送 ({order.pickupReminderSentAt ? formatDate(order.pickupReminderSentAt) : ''})
                  </span>
                ) : (
                  <span className="text-xs text-gray-400">未发送</span>
                )}
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">复核状态</span>
                <ReviewStatusBadge status={order.reviewStatus} />
              </div>
            </div>
            {order.notes && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500 mb-1">备注</p>
                <p className="text-sm text-gray-700">{order.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={showChangeAlert}
        onClose={() => setShowChangeAlert(false)}
        title="度数变动提醒"
        maxWidth="max-w-3xl"
      >
        {prescriptionDiff && previousExam && examRecord && (
          <div className="space-y-6">
            <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-lg border border-amber-200">
              <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-amber-900">注意：顾客度数有明显变化</h4>
                <p className="text-sm text-amber-700 mt-1">
                  与上次验光（{formatDate(previousExam.examDate)}）相比，以下项目变化超过25度，请确认配镜度数是否合适。
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <p className="font-medium text-gray-700">变化趋势：</p>
              <ul className="space-y-1 text-sm">
                <li className={prescriptionDiff.rightSphereDiff !== 0 ? 'text-gray-700' : 'text-gray-400'}>
                  • 右眼球镜：{getChangeTrendText(prescriptionDiff.rightSphereDiff, '度数')}
                </li>
                <li className={prescriptionDiff.rightCylinderDiff !== 0 ? 'text-gray-700' : 'text-gray-400'}>
                  • 右眼柱镜：{getChangeTrendText(prescriptionDiff.rightCylinderDiff, '度数')}
                </li>
                <li className={prescriptionDiff.leftSphereDiff !== 0 ? 'text-gray-700' : 'text-gray-400'}>
                  • 左眼球镜：{getChangeTrendText(prescriptionDiff.leftSphereDiff, '度数')}
                </li>
                <li className={prescriptionDiff.leftCylinderDiff !== 0 ? 'text-gray-700' : 'text-gray-400'}>
                  • 左眼柱镜：{getChangeTrendText(prescriptionDiff.leftCylinderDiff, '度数')}
                </li>
              </ul>
            </div>

            <PrescriptionCompare
              oldRx={{
                rightEye: previousExam.rightEye,
                leftEye: previousExam.leftEye,
                pd: previousExam.pd,
              }}
              newRx={{
                rightEye: examRecord.rightEye,
                leftEye: examRecord.leftEye,
                pd: examRecord.pd,
              }}
            />

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowChangeAlert(false)}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                我知道了
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
