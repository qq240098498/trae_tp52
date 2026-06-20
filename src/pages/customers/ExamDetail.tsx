import { Link, useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Printer } from 'lucide-react';
import { PrescriptionCard } from '../../components/PrescriptionCard';
import { useCustomerStore } from '../../store/customerStore';
import { formatDate } from '../../utils';

export default function ExamDetail() {
  const { id, examId } = useParams<{ id: string; examId: string }>();
  const navigate = useNavigate();
  const getCustomerById = useCustomerStore((s) => s.getCustomerById);
  const getExamRecordById = useCustomerStore((s) => s.getExamRecordById);

  const customer = id ? getCustomerById(id) : undefined;
  const examRecord = examId ? getExamRecordById(examId) : undefined;

  if (!customer || !examRecord) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">未找到相关信息</p>
        <button
          onClick={() => navigate('/customers')}
          className="mt-4 text-blue-600 hover:text-blue-700"
        >
          返回顾客列表
        </button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 print:space-y-4">
      <div className="flex items-center justify-between print:hidden">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(`/customers/${id}`)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-gray-900">验光处方单</h2>
            <p className="text-sm text-gray-500">
              顾客: {customer.name} · 验光日期: {formatDate(examRecord.examDate)}
            </p>
          </div>
        </div>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-lg font-medium transition-colors"
        >
          <Printer className="w-4 h-4" />
          打印处方
        </button>
      </div>

      <div className="print:block hidden">
        <div className="text-center border-b-2 border-gray-300 pb-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-900">验光处方单</h1>
          <p className="text-gray-600 mt-1">眼镜店专业验光配镜中心</p>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
          <div>
            <span className="text-gray-500">姓名:</span>
            <span className="font-medium ml-2">{customer.name}</span>
          </div>
          <div>
            <span className="text-gray-500">性别:</span>
            <span className="font-medium ml-2">{customer.gender}</span>
          </div>
          <div>
            <span className="text-gray-500">电话:</span>
            <span className="font-medium ml-2">{customer.phone}</span>
          </div>
          <div>
            <span className="text-gray-500">验光日期:</span>
            <span className="font-medium ml-2">{formatDate(examRecord.examDate)}</span>
          </div>
        </div>
      </div>

      <PrescriptionCard
        rightEye={examRecord.rightEye}
        leftEye={examRecord.leftEye}
        pd={examRecord.pd}
        title="验光处方"
        showVisualAcuity
      />

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-500 mb-1">验光师</p>
            <p className="font-medium text-gray-900">{examRecord.optometrist}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">验光日期</p>
            <p className="font-medium text-gray-900">{formatDate(examRecord.examDate)}</p>
          </div>
        </div>
        {examRecord.notes && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-1">备注</p>
            <p className="text-gray-700">{examRecord.notes}</p>
          </div>
        )}
      </div>

      <div className="print:block hidden mt-8 pt-6 border-t border-gray-300">
        <div className="grid grid-cols-2 gap-8 text-sm">
          <div>
            <p className="text-gray-500">配镜顾问签名:</p>
            <div className="mt-8 border-b border-gray-400 w-40"></div>
          </div>
          <div className="text-right">
            <p className="text-gray-500">顾客签名:</p>
            <div className="mt-8 border-b border-gray-400 w-40 ml-auto"></div>
          </div>
        </div>
        <p className="text-center text-xs text-gray-400 mt-8">
          本处方有效期3个月，请在有效期内配镜
        </p>
      </div>

      <div className="print:hidden flex justify-center gap-3 pt-4">
        <Link
          to={`/orders/new?customerId=${id}&examId=${examId}`}
          className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors shadow-lg shadow-green-600/20"
        >
          立即配镜
        </Link>
      </div>
    </div>
  );
}
