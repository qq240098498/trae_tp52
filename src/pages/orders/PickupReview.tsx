import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Eye,
  CheckCircle,
  FileText,
  AlertCircle,
} from 'lucide-react';
import { PrescriptionCard, PrescriptionCompare } from '../../components/PrescriptionCard';
import { StatusBadge } from '../../components/StatusBadge';
import { useOrderStore } from '../../store/orderStore';
import { useCustomerStore } from '../../store/customerStore';
import { useFrameStore } from '../../store/frameStore';
import { useLensStore } from '../../store/lensStore';
import { formatCurrency, formatDate } from '../../utils';
import type { EyePrescription, OldGlassesRx } from '../../types';

export default function PickupReview() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const getOrderById = useOrderStore((s) => s.getOrderById);
  const updateOldGlassesRx = useOrderStore((s) => s.updateOldGlassesRx);
  const markAsReviewed = useOrderStore((s) => s.markAsReviewed);
  const getCustomerById = useCustomerStore((s) => s.getCustomerById);
  const getExamRecordById = useCustomerStore((s) => s.getExamRecordById);
  const getFrameById = useFrameStore((s) => s.getFrameById);
  const getLensById = useLensStore((s) => s.getLensById);

  const order = id ? getOrderById(id) : undefined;
  const customer = order ? getCustomerById(order.customerId) : undefined;
  const examRecord = order ? getExamRecordById(order.examRecordId) : undefined;
  const frame = order ? getFrameById(order.frameId) : undefined;
  const lens = order ? getLensById(order.lensId) : undefined;

  const [showOldGlassesForm, setShowOldGlassesForm] = useState(!order?.oldGlassesRx);
  const [oldGlassesRx, setOldGlassesRx] = useState<OldGlassesRx>({
    rightEye: {
      sphere: 0,
      cylinder: 0,
      axis: 0,
      add: 0,
      visualAcuity: '',
    },
    leftEye: {
      sphere: 0,
      cylinder: 0,
      axis: 0,
      add: 0,
      visualAcuity: '',
    },
    pd: 64,
  });

  const [reviewConfirmed, setReviewConfirmed] = useState(false);
  const [visualCheckConfirmed, setVisualCheckConfirmed] = useState(false);
  const [balancePaid, setBalancePaid] = useState(false);

  useEffect(() => {
    if (order?.oldGlassesRx) {
      setOldGlassesRx(order.oldGlassesRx);
      setShowOldGlassesForm(false);
    }
  }, [order]);

  if (!order || !examRecord || !customer) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">未找到相关信息</p>
        <button
          onClick={() => navigate('/orders')}
          className="mt-4 text-blue-600 hover:text-blue-700"
        >
          返回订单列表
        </button>
      </div>
    );
  }

  const handleEyeChange = (
    eye: 'rightEye' | 'leftEye',
    field: keyof EyePrescription,
    value: string | number
  ) => {
    setOldGlassesRx({
      ...oldGlassesRx,
      [eye]: {
        ...oldGlassesRx[eye],
        [field]: value,
      },
    });
  };

  const handleSaveOldGlassesRx = () => {
    updateOldGlassesRx(order.id, oldGlassesRx);
    setShowOldGlassesForm(false);
  };

  const handleCompletePickup = () => {
    if (!visualCheckConfirmed || !balancePaid) {
      alert('请完成所有复核步骤');
      return;
    }
    if (order.oldGlassesRx && !reviewConfirmed) {
      alert('请确认度数对比复核');
      return;
    }

    if (confirm('确认完成取镜？订单状态将更新为"已取镜"。')) {
      markAsReviewed(order.id);
      navigate(`/orders/${order.id}`);
    }
  };

  const remainingBalance = order.totalPrice - order.deposit;
  const allConfirmed = visualCheckConfirmed && balancePaid && (!order.oldGlassesRx || reviewConfirmed);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(`/orders/${order.id}`)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-gray-900">取镜复核</h2>
            <p className="text-sm text-gray-500">订单号: {order.id}</p>
          </div>
        </div>
        <StatusBadge status={order.status} />
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-blue-200 text-sm">顾客</p>
            <p className="text-xl font-bold">{customer.name}</p>
            <p className="text-blue-200 text-sm">{customer.phone}</p>
          </div>
          <div>
            <p className="text-blue-200 text-sm">订单金额</p>
            <p className="text-2xl font-bold">{formatCurrency(order.totalPrice)}</p>
            {order.deposit > 0 && (
              <p className="text-blue-200 text-sm">
                已付订金: {formatCurrency(order.deposit)}
              </p>
            )}
          </div>
          <div>
            <p className="text-blue-200 text-sm">待付余款</p>
            <p className={`text-2xl font-bold ${remainingBalance > 0 ? 'text-yellow-300' : 'text-green-300'}`}>
              {remainingBalance > 0 ? formatCurrency(remainingBalance) : '¥0.00'}
            </p>
            {remainingBalance === 0 && (
              <p className="text-blue-200 text-sm">已全额付款</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-medium text-amber-800">取镜复核流程</p>
          <p className="text-sm text-amber-700 mt-1">
            请按照以下步骤完成取镜复核，确保配镜准确无误后再交付给顾客。
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-gray-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            步骤 1: 旧镜度数复核
          </h3>
          {!showOldGlassesForm && order.oldGlassesRx && (
            <button
              onClick={() => setShowOldGlassesForm(true)}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              编辑旧镜度数
            </button>
          )}
        </div>

        {showOldGlassesForm ? (
          <div className="space-y-4">
            <p className="text-sm text-gray-600 mb-4">
              请测量并录入顾客当前佩戴的旧眼镜度数，用于对比新镜度数。
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {(['rightEye', 'leftEye'] as const).map((eye) => (
                <div
                  key={eye}
                  className={`bg-gray-50 rounded-xl p-6 border-2 ${
                    eye === 'rightEye' ? 'border-blue-200' : 'border-green-200'
                  }`}
                >
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    {eye === 'rightEye' ? '右眼 (R)' : '左眼 (L)'}
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">球镜 S (D)</label>
                      <input
                        type="number"
                        step="0.25"
                        value={oldGlassesRx[eye].sphere}
                        onChange={(e) => handleEyeChange(eye, 'sphere', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">柱镜 C (D)</label>
                      <input
                        type="number"
                        step="0.25"
                        value={oldGlassesRx[eye].cylinder}
                        onChange={(e) => handleEyeChange(eye, 'cylinder', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">轴位 A (°)</label>
                      <input
                        type="number"
                        min="0"
                        max="180"
                        value={oldGlassesRx[eye].axis}
                        onChange={(e) => handleEyeChange(eye, 'axis', parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">下加光 ADD</label>
                      <input
                        type="number"
                        step="0.25"
                        min="0"
                        value={oldGlassesRx[eye].add}
                        onChange={(e) => handleEyeChange(eye, 'add', parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-xs font-medium text-gray-500 mb-1">矫正视力</label>
                      <input
                        type="text"
                        value={oldGlassesRx[eye].visualAcuity}
                        onChange={(e) => handleEyeChange(eye, 'visualAcuity', e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="如: 0.8"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="max-w-xs mx-auto">
              <label className="block text-xs font-medium text-gray-500 mb-1 text-center">瞳距 PD (mm)</label>
              <input
                type="number"
                min="50"
                max="80"
                step="0.5"
                value={oldGlassesRx.pd}
                onChange={(e) => setOldGlassesRx({ ...oldGlassesRx, pd: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-center text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex justify-center gap-3 pt-4">
              {order.oldGlassesRx && (
                <button
                  onClick={() => setShowOldGlassesForm(false)}
                  className="px-5 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                >
                  取消
                </button>
              )}
              <button
                onClick={handleSaveOldGlassesRx}
                className="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                <Save className="w-4 h-4" />
                保存旧镜度数
              </button>
            </div>
          </div>
        ) : order.oldGlassesRx ? (
          <div className="space-y-4">
            <PrescriptionCard
              rightEye={order.oldGlassesRx.rightEye}
              leftEye={order.oldGlassesRx.leftEye}
              pd={order.oldGlassesRx.pd}
              title="旧镜度数"
              showVisualAcuity
            />
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">暂未录入旧镜度数</p>
            <button
              onClick={() => setShowOldGlassesForm(true)}
              className="mt-3 text-blue-600 hover:text-blue-700 font-medium"
            >
              + 录入旧镜度数（可选）
            </button>
          </div>
        )}
      </div>

      {order.oldGlassesRx && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <Eye className="w-5 h-5 text-indigo-600" />
              步骤 2: 新旧度数对比复核
            </h3>
          </div>

          <PrescriptionCompare
            oldRx={order.oldGlassesRx}
            newRx={{
              rightEye: examRecord.rightEye,
              leftEye: examRecord.leftEye,
              pd: examRecord.pd,
            }}
          />

          <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={reviewConfirmed}
                onChange={(e) => setReviewConfirmed(e.target.checked)}
                className="mt-1 w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
              />
              <div>
                <p className="font-medium text-blue-900">度数对比确认</p>
                <p className="text-sm text-blue-700">
                  我已核对新旧度数差异，确认新镜度数正确，差异在合理范围内。
                </p>
              </div>
            </label>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          步骤 {order.oldGlassesRx ? '3' : '2'}: 配戴检查
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={visualCheckConfirmed}
                onChange={(e) => setVisualCheckConfirmed(e.target.checked)}
                className="mt-1 w-5 h-5 text-green-600 rounded focus:ring-green-500"
              />
              <div>
                <p className="font-medium text-gray-900">视力检查确认</p>
                <p className="text-sm text-gray-600">
                  顾客试戴后视力清晰，无头晕、视物变形等不适症状。
                </p>
              </div>
            </label>
          </div>

          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={balancePaid}
                onChange={(e) => setBalancePaid(e.target.checked)}
                className="mt-1 w-5 h-5 text-green-600 rounded focus:ring-green-500"
              />
              <div>
                <p className="font-medium text-gray-900">款项确认</p>
                <p className="text-sm text-gray-600">
                  顾客已结清全部款项（余款: {formatCurrency(remainingBalance)}）。
                </p>
              </div>
            </label>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="font-bold text-gray-900 mb-4">配镜信息确认</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-xl">
            <p className="text-xs text-blue-600 font-medium mb-1">镜架</p>
            <p className="font-semibold text-blue-900">
              {frame?.brand} {frame?.model}
            </p>
            <p className="text-sm text-blue-700">
              {frame?.color} · {frame?.material}
            </p>
          </div>
          <div className="p-4 bg-green-50 rounded-xl">
            <p className="text-xs text-green-600 font-medium mb-1">镜片</p>
            <p className="font-semibold text-green-900">
              {lens?.brand} {lens?.refractiveIndex}
            </p>
            <p className="text-sm text-green-700">
              {lens?.coating} · {lens?.type}
            </p>
          </div>
          <div className="p-4 bg-purple-50 rounded-xl">
            <p className="text-xs text-purple-600 font-medium mb-1">新镜度数</p>
            <p className="font-semibold text-purple-900">
              R: {examRecord.rightEye.sphere > 0 ? '+' : ''}{examRecord.rightEye.sphere.toFixed(2)}
              {examRecord.rightEye.cylinder !== 0 ? ` ${examRecord.rightEye.cylinder > 0 ? '+' : ''}${examRecord.rightEye.cylinder.toFixed(2)}x${examRecord.rightEye.axis}` : ''}
            </p>
            <p className="font-semibold text-purple-900">
              L: {examRecord.leftEye.sphere > 0 ? '+' : ''}{examRecord.leftEye.sphere.toFixed(2)}
              {examRecord.leftEye.cylinder !== 0 ? ` ${examRecord.leftEye.cylinder > 0 ? '+' : ''}${examRecord.leftEye.cylinder.toFixed(2)}x${examRecord.leftEye.axis}` : ''}
            </p>
            <p className="text-sm text-purple-700">PD: {examRecord.pd}mm</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4 pt-4">
        <button
          onClick={handleCompletePickup}
          disabled={!allConfirmed}
          className={`w-full max-w-md py-4 rounded-xl font-bold text-lg transition-all ${
            allConfirmed
              ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg shadow-green-600/30 cursor-pointer'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <CheckCircle className="w-6 h-6" />
            确认取镜完成
          </div>
        </button>
        {!allConfirmed && (
          <p className="text-sm text-gray-500">
            请完成以上所有复核步骤后再确认取镜
          </p>
        )}
        <Link
          to={`/orders/${order.id}`}
          className="text-gray-500 hover:text-gray-700 text-sm"
        >
          返回订单详情
        </Link>
      </div>
    </div>
  );
}
