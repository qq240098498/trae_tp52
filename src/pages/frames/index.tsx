import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Plus, Search, Edit2, Trash2, ArrowLeft, Save, AlertTriangle } from 'lucide-react';
import { DataTable } from '../../components/DataTable';
import { Modal } from '../../components/Modal';
import { useFrameStore } from '../../store/frameStore';
import { formatCurrency } from '../../utils';
import type { Frame } from '../../types';

export function FrameList() {
  const navigate = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);

  const frames = useFrameStore((s) => s.searchFrames(searchKeyword));
  const deleteFrame = useFrameStore((s) => s.deleteFrame);
  const getLowStockFrames = useFrameStore((s) => s.getLowStockFrames);

  const lowStockIds = new Set(getLowStockFrames().map((f) => f.id));

  const columns = [
    {
      key: 'brand',
      header: '品牌',
      render: (item: Frame) => (
        <span className="font-medium text-gray-900">{item.brand}</span>
      ),
    },
    {
      key: 'model',
      header: '型号',
      render: (item: Frame) => <span className="text-gray-700">{item.model}</span>,
    },
    {
      key: 'material',
      header: '材质',
      render: (item: Frame) => (
        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
          {item.material}
        </span>
      ),
    },
    {
      key: 'color',
      header: '颜色',
      render: (item: Frame) => (
        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
          {item.color}
        </span>
      ),
    },
    {
      key: 'costPrice',
      header: '进价',
      render: (item: Frame) => (
        <span className="text-gray-600">{formatCurrency(item.costPrice)}</span>
      ),
    },
    {
      key: 'salePrice',
      header: '售价',
      render: (item: Frame) => (
        <span className="font-semibold text-green-600">{formatCurrency(item.salePrice)}</span>
      ),
    },
    {
      key: 'stock',
      header: '库存',
      render: (item: Frame) => (
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
      render: (item: Frame) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/frames/${item.id}/edit`);
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
      deleteFrame(showDeleteModal);
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
              placeholder="搜索品牌、型号、材质、颜色..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        <Link
          to="/frames/new"
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors shadow-lg shadow-blue-600/20"
        >
          <Plus className="w-5 h-5" />
          新增镜架
        </Link>
      </div>

      <DataTable
        columns={columns}
        data={frames}
        onRowClick={(item) => navigate(`/frames/${item.id}/edit`)}
        emptyMessage="暂无镜架库存，点击右上角按钮添加"
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
          <p className="text-gray-700 mb-2">确定要删除这个镜架库存吗？</p>
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

export function FrameForm() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const getFrameById = useFrameStore((s) => s.getFrameById);
  const addFrame = useFrameStore((s) => s.addFrame);
  const updateFrame = useFrameStore((s) => s.updateFrame);

  const existingFrame = id ? getFrameById(id) : undefined;

  const [formData, setFormData] = useState({
    brand: existingFrame?.brand || '',
    model: existingFrame?.model || '',
    material: existingFrame?.material || '',
    color: existingFrame?.color || '',
    costPrice: existingFrame?.costPrice || 0,
    salePrice: existingFrame?.salePrice || 0,
    stock: existingFrame?.stock || 0,
    warningStock: existingFrame?.warningStock || 5,
    supplier: existingFrame?.supplier || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEdit && id) {
      updateFrame(id, formData);
    } else {
      addFrame(formData);
    }
    navigate('/frames');
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/frames')}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            {isEdit ? '编辑镜架信息' : '新增镜架'}
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
              placeholder="如: 雷朋"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              型号 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.model}
              onChange={(e) => setFormData({ ...formData, model: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
              placeholder="如: RB5154"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              材质 <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={formData.material}
              onChange={(e) => setFormData({ ...formData, material: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
            >
              <option value="">请选择材质</option>
              <option value="金属">金属</option>
              <option value="板材">板材</option>
              <option value="TR90">TR90</option>
              <option value="钛合金">钛合金</option>
              <option value="铝镁">铝镁</option>
              <option value="其他">其他</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              颜色 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
              placeholder="如: 黑色"
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
            onClick={() => navigate('/frames')}
            className="px-5 py-2.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
          >
            取消
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-lg shadow-blue-600/20"
          >
            <Save className="w-4 h-4" />
            {isEdit ? '保存修改' : '添加镜架'}
          </button>
        </div>
      </form>
    </div>
  );
}
