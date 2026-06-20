import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Plus, Search, Edit2, Trash2, ArrowLeft, Save, AlertTriangle } from 'lucide-react';
import { DataTable } from '../../components/DataTable';
import { Modal } from '../../components/Modal';
import { useLensStore } from '../../store/lensStore';
import { formatCurrency } from '../../utils';
import type { Lens } from '../../types';

export function LensList() {
  const navigate = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);

  const lenses = useLensStore((s) => s.searchLenses(searchKeyword));
  const deleteLens = useLensStore((s) => s.deleteLens);
  const getLowStockLenses = useLensStore((s) => s.getLowStockLenses);

  const lowStockIds = new Set(getLowStockLenses().map((l) => l.id));

  const columns = [
    {
      key: 'brand',
      header: '品牌',
      render: (item: Lens) => (
        <span className="font-medium text-gray-900">{item.brand}</span>
      ),
    },
    {
      key: 'refractiveIndex',
      header: '折射率',
      render: (item: Lens) => (
        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
          {item.refractiveIndex}
        </span>
      ),
    },
    {
      key: 'coating',
      header: '膜层',
      render: (item: Lens) => (
        <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs">
          {item.coating}
        </span>
      ),
    },
    {
      key: 'type',
      header: '类型',
      render: (item: Lens) => (
        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
          {item.type}
        </span>
      ),
    },
    {
      key: 'sphereRange',
      header: '球镜范围',
      render: (item: Lens) => (
        <span className="text-sm text-gray-600">{item.sphereRange}</span>
      ),
    },
    {
      key: 'costPrice',
      header: '进价',
      render: (item: Lens) => (
        <span className="text-gray-600">{formatCurrency(item.costPrice)}</span>
      ),
    },
    {
      key: 'salePrice',
      header: '售价',
      render: (item: Lens) => (
        <span className="font-semibold text-green-600">{formatCurrency(item.salePrice)}</span>
      ),
    },
    {
      key: 'stock',
      header: '库存',
      render: (item: Lens) => (
        <div className="flex items-center gap-2">
          {lowStockIds.has(item.id) && (
            <AlertTriangle className="w-4 h-4 text-red-500" />
          )}
          <span
            className={`font-semibold ${
              lowStockIds.has(item.id) ? 'text-red-600' : 'text-gray-700'
            }`}
          >
            {item.stock}
          </span>
          {lowStockIds.has(item.id) && (
            <span className="text-xs text-red-500">(预警: {item.warningStock})</span>
          )}
        </div>
      ),
    },
    {
      key: 'actions',
      header: '操作',
      className: 'text-right',
      render: (item: Lens) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/lenses/${item.id}/edit`);
            }}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="编辑"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowDeleteModal(item.id);
            }}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="删除"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  const handleDelete = () => {
    if (showDeleteModal) {
      deleteLens(showDeleteModal);
      setShowDeleteModal(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索品牌、膜层、类型、折射率..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        <Link
          to="/lenses/new"
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors shadow-lg shadow-blue-600/20"
        >
          <Plus className="w-5 h-5" />
          新增镜片
        </Link>
      </div>

      <DataTable
        columns={columns}
        data={lenses}
        onRowClick={(item) => navigate(`/lenses/${item.id}/edit`)}
        emptyMessage="暂无镜片库存，点击右上角按钮添加"
      />

      <Modal
        isOpen={!!showDeleteModal}
        onClose={() => setShowDeleteModal(null)}
        title="确认删除"
        maxWidth="max-w-md"
      >
        <div className="text-center py-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <p className="text-gray-700 mb-2">确定要删除这个镜片库存吗？</p>
          <p className="text-sm text-gray-500">此操作不可撤销</p>
        </div>
        <div className="flex justify-center gap-3 pt-4">
          <button
            onClick={() => setShowDeleteModal(null)}
            className="px-5 py-2.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
          >
            取消
          </button>
          <button
            onClick={handleDelete}
            className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
          >
            确认删除
          </button>
        </div>
      </Modal>
    </div>
  );
}

export function LensForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const getLensById = useLensStore((s) => s.getLensById);
  const addLens = useLensStore((s) => s.addLens);
  const updateLens = useLensStore((s) => s.updateLens);

  const existingLens = id ? getLensById(id) : undefined;

  const [formData, setFormData] = useState({
    refractiveIndex: existingLens?.refractiveIndex || 1.56,
    coating: existingLens?.coating || '',
    brand: existingLens?.brand || '',
    type: existingLens?.type || '',
    sphereRange: existingLens?.sphereRange || '',
    cylinderRange: existingLens?.cylinderRange || '',
    costPrice: existingLens?.costPrice || 0,
    salePrice: existingLens?.salePrice || 0,
    stock: existingLens?.stock || 0,
    warningStock: existingLens?.warningStock || 5,
    supplier: existingLens?.supplier || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEdit && id) {
      updateLens(id, formData);
    } else {
      addLens(formData);
    }
    navigate('/lenses');
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/lenses')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            {isEdit ? '编辑镜片信息' : '新增镜片'}
          </h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              品牌 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.brand}
              onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
              placeholder="如: 依视路"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              折射率 <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={formData.refractiveIndex}
              onChange={(e) => setFormData({ ...formData, refractiveIndex: parseFloat(e.target.value) })}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
            >
              <option value={1.50}>1.50</option>
              <option value={1.56}>1.56</option>
              <option value={1.61}>1.61</option>
              <option value={1.67}>1.67</option>
              <option value={1.74}>1.74</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              膜层 <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={formData.coating}
              onChange={(e) => setFormData({ ...formData, coating: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
            >
              <option value="">请选择膜层</option>
              <option value="普通">普通</option>
              <option value="防蓝光">防蓝光</option>
              <option value="防辐射">防辐射</option>
              <option value="钻晶A4">钻晶A4</option>
              <option value="莲花膜">莲花膜</option>
              <option value="渐进多焦点">渐进多焦点</option>
              <option value="变色">变色</option>
              <option value="偏光">偏光</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              类型 <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
            >
              <option value="">请选择类型</option>
              <option value="单光">单光</option>
              <option value="双光">双光</option>
              <option value="渐进">渐进</option>
              <option value="老花">老花</option>
              <option value="散光">散光</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">球镜范围</label>
            <input
              type="text"
              value={formData.sphereRange}
              onChange={(e) => setFormData({ ...formData, sphereRange: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
              placeholder="如: -10.00 ~ +6.00"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">柱镜范围</label>
            <input
              type="text"
              value={formData.cylinderRange}
              onChange={(e) => setFormData({ ...formData, cylinderRange: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
              placeholder="如: -2.00 ~ 0"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              进价 (元) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              value={formData.costPrice}
              onChange={(e) => setFormData({ ...formData, costPrice: parseFloat(e.target.value) || 0 })}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              售价 (元) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              required
              min="0"
              step="0.01"
              value={formData.salePrice}
              onChange={(e) => setFormData({ ...formData, salePrice: parseFloat(e.target.value) || 0 })}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              库存数量 <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              required
              min="0"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              库存预警阈值
            </label>
            <input
              type="number"
              min="0"
              value={formData.warningStock}
              onChange={(e) => setFormData({ ...formData, warningStock: parseInt(e.target.value) || 0 })}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">供应商</label>
          <input
            type="text"
            value={formData.supplier}
            onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
            placeholder="供应商名称"
          />
        </div>

        {formData.costPrice > 0 && formData.salePrice > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-green-700">预估利润</span>
              <span className="font-bold text-green-700">
                {formatCurrency(formData.salePrice - formData.costPrice)}
              </span>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => navigate('/lenses')}
            className="px-5 py-2.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
          >
            取消
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-lg shadow-blue-600/20"
          >
            <Save className="w-4 h-4" />
            {isEdit ? '保存修改' : '添加镜片'}
          </button>
        </div>
      </form>
    </div>
  );
}
