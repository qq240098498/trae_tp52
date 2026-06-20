import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Eye } from 'lucide-react';
import { useCustomerStore } from '../../store/customerStore';
import type { EyePrescription } from '../../types';

export default function ExamForm() {
  const { id, examId } = useParams<{ id: string; examId: string }>();
  const navigate = useNavigate();
  const getCustomerById = useCustomerStore((s) => s.getCustomerById);
  const getExamRecordById = useCustomerStore((s) => s.getExamRecordById);
  const addExamRecord = useCustomerStore((s) => s.addExamRecord);

  const customer = id ? getCustomerById(id) : undefined;
  const isEdit = !!examId;
  const existingRecord = examId ? getExamRecordById(examId) : undefined;

  const [formData, setFormData] = useState({
    examDate: new Date().toISOString().split('T')[0],
    rightEye: {
      sphere: 0,
      cylinder: 0,
      axis: 0,
      add: 0,
      visualAcuity: '1.0',
    } as EyePrescription,
    leftEye: {
      sphere: 0,
      cylinder: 0,
      axis: 0,
      add: 0,
      visualAcuity: '1.0',
    } as EyePrescription,
    pd: 64,
    notes: '',
    optometrist: '',
  });

  useEffect(() => {
    if (existingRecord) {
      setFormData({
        examDate: existingRecord.examDate,
        rightEye: existingRecord.rightEye,
        leftEye: existingRecord.leftEye,
        pd: existingRecord.pd,
        notes: existingRecord.notes,
        optometrist: existingRecord.optometrist,
      });
    }
  }, [existingRecord]);

  const handleEyeChange = (
    eye: 'rightEye' | 'leftEye',
    field: keyof EyePrescription,
    value: string | number
  ) => {
    setFormData({
      ...formData,
      [eye]: {
        ...formData[eye],
        [field]: value,
      },
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    if (isEdit && existingRecord) {
      alert('编辑功能请在详情页操作');
      return;
    }

    addExamRecord({
      customerId: id,
      ...formData,
    });

    navigate(`/customers/${id}`);
  };

  if (!customer) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">未找到该顾客信息</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(`/customers/${id}`)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            {isEdit ? '编辑验光记录' : '新增验光记录'}
          </h2>
          <p className="text-sm text-gray-500">顾客: {customer.name}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">验光日期</label>
            <input
              type="date"
              required
              value={formData.examDate}
              onChange={(e) => setFormData({ ...formData, examDate: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">瞳距 (mm)</label>
            <input
              type="number"
              required
              min="50"
              max="80"
              step="0.5"
              value={formData.pd}
              onChange={(e) => setFormData({ ...formData, pd: parseFloat(e.target.value) })}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">验光师</label>
            <input
              type="text"
              required
              value={formData.optometrist}
              onChange={(e) => setFormData({ ...formData, optometrist: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
              placeholder="请输入验光师姓名"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {(['rightEye', 'leftEye'] as const).map((eye) => (
            <div
              key={eye}
              className={`bg-white rounded-xl border-2 overflow-hidden ${
                eye === 'rightEye' ? 'border-blue-200' : 'border-green-200'
              }`}
            >
              <div className={`px-6 py-4 ${
                eye === 'rightEye' ? 'bg-blue-600' : 'bg-green-600'
              }`}>
                <h3 className="text-white font-bold flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  {eye === 'rightEye' ? '右眼 (R)' : '左眼 (L)'}
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      球镜 S (D)
                    </label>
                    <input
                      type="number"
                      step="0.25"
                      value={formData[eye].sphere}
                      onChange={(e) =>
                        handleEyeChange(eye, 'sphere', parseFloat(e.target.value) || 0)
                      }
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
                      placeholder="如: -2.50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      柱镜 C (D)
                    </label>
                    <input
                      type="number"
                      step="0.25"
                      value={formData[eye].cylinder}
                      onChange={(e) =>
                        handleEyeChange(eye, 'cylinder', parseFloat(e.target.value) || 0)
                      }
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
                      placeholder="如: -0.50"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      轴位 A (°)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="180"
                      value={formData[eye].axis}
                      onChange={(e) =>
                        handleEyeChange(eye, 'axis', parseInt(e.target.value) || 0)
                      }
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
                      placeholder="0-180"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">
                      下加光 ADD (D)
                    </label>
                    <input
                      type="number"
                      step="0.25"
                      min="0"
                      value={formData[eye].add}
                      onChange={(e) =>
                        handleEyeChange(eye, 'add', parseFloat(e.target.value) || 0)
                      }
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
                      placeholder="老花镜用"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    矫正视力
                  </label>
                  <input
                    type="text"
                    value={formData[eye].visualAcuity}
                    onChange={(e) => handleEyeChange(eye, 'visualAcuity', e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all"
                    placeholder="如: 1.0"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">备注</label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            rows={3}
            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all resize-none"
            placeholder="请输入验光备注信息"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Link
            to={`/customers/${id}`}
            className="px-5 py-2.5 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
          >
            取消
          </Link>
          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-lg shadow-blue-600/20"
          >
            <Save className="w-4 h-4" />
            保存验光记录
          </button>
        </div>
      </form>
    </div>
  );
}
