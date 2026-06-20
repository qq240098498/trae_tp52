import type { EyePrescription } from '../types';

interface PrescriptionCardProps {
  rightEye: EyePrescription;
  leftEye: EyePrescription;
  pd: number;
  title?: string;
  showVisualAcuity?: boolean;
}

export function PrescriptionCard({
  rightEye,
  leftEye,
  pd,
  title = '验光处方',
  showVisualAcuity = true,
}: PrescriptionCardProps) {
  const formatValue = (value: number, suffix = '') => {
    if (value === 0) return '0' + suffix;
    const sign = value > 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}${suffix}`;
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
        <h3 className="text-white font-bold text-lg">{title}</h3>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">
                R
              </div>
              <span className="font-medium text-gray-700">右眼</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500">球镜 (S)</p>
                <p className="font-semibold text-gray-900">{formatValue(rightEye.sphere, 'D')}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500">柱镜 (C)</p>
                <p className="font-semibold text-gray-900">{formatValue(rightEye.cylinder, 'D')}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500">轴位 (A)</p>
                <p className="font-semibold text-gray-900">{rightEye.axis}°</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500">下加光 (ADD)</p>
                <p className="font-semibold text-gray-900">{rightEye.add > 0 ? `+${rightEye.add.toFixed(2)}D` : '-'}</p>
              </div>
              {showVisualAcuity && (
                <div className="col-span-2 bg-green-50 rounded-lg p-3">
                  <p className="text-xs text-green-600">矫正视力</p>
                  <p className="font-semibold text-green-700">{rightEye.visualAcuity}</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600 font-bold text-sm">
                L
              </div>
              <span className="font-medium text-gray-700">左眼</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500">球镜 (S)</p>
                <p className="font-semibold text-gray-900">{formatValue(leftEye.sphere, 'D')}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500">柱镜 (C)</p>
                <p className="font-semibold text-gray-900">{formatValue(leftEye.cylinder, 'D')}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500">轴位 (A)</p>
                <p className="font-semibold text-gray-900">{leftEye.axis}°</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-500">下加光 (ADD)</p>
                <p className="font-semibold text-gray-900">{leftEye.add > 0 ? `+${leftEye.add.toFixed(2)}D` : '-'}</p>
              </div>
              {showVisualAcuity && (
                <div className="col-span-2 bg-green-50 rounded-lg p-3">
                  <p className="text-xs text-green-600">矫正视力</p>
                  <p className="font-semibold text-green-700">{leftEye.visualAcuity}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-center gap-2">
            <span className="text-sm text-gray-500">瞳距 (PD):</span>
            <span className="font-bold text-blue-600">{pd} mm</span>
          </div>
        </div>
      </div>
    </div>
  );
}

interface PrescriptionCompareProps {
  oldRx: { rightEye: EyePrescription; leftEye: EyePrescription; pd: number };
  newRx: { rightEye: EyePrescription; leftEye: EyePrescription; pd: number };
}

export function PrescriptionCompare({ oldRx, newRx }: PrescriptionCompareProps) {
  const formatValue = (value: number) => {
    if (value === 0) return '0.00';
    const sign = value > 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}`;
  };

  const getDiffClass = (oldVal: number, newVal: number) => {
    if (oldVal === newVal) return 'text-gray-600';
    return newVal > oldVal ? 'text-red-600' : 'text-blue-600';
  };

  const getDiffIcon = (oldVal: number, newVal: number) => {
    if (oldVal === newVal) return '→';
    return newVal > oldVal ? '↑' : '↓';
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
        <h3 className="text-white font-bold text-lg">新旧度数对比</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">眼别</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600">参数</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600">旧镜度数</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600">变化</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600">新镜度数</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {(['rightEye', 'leftEye'] as const).map((eye) => {
              const oldEye = oldRx[eye];
              const newEye = newRx[eye];
              const eyeLabel = eye === 'rightEye' ? '右眼 (R)' : '左眼 (L)';
              return (
                <>
                  <tr key={`${eye}-sphere`} className="hover:bg-gray-50">
                    {eye === 'rightEye' && (
                      <td rowSpan={4} className="px-4 py-3 font-medium text-gray-700">
                        {eyeLabel}
                      </td>
                    )}
                    {eye === 'leftEye' && (
                      <td rowSpan={4} className="px-4 py-3 font-medium text-gray-700">
                        {eyeLabel}
                      </td>
                    )}
                    <td className="px-4 py-3 text-center text-gray-500">球镜 (S)</td>
                    <td className="px-4 py-3 text-center font-mono">{formatValue(oldEye.sphere)}D</td>
                    <td className={`px-4 py-3 text-center font-bold ${getDiffClass(oldEye.sphere, newEye.sphere)}`}>
                      {getDiffIcon(oldEye.sphere, newEye.sphere)}
                    </td>
                    <td className={`px-4 py-3 text-center font-mono font-semibold ${getDiffClass(oldEye.sphere, newEye.sphere)}`}>
                      {formatValue(newEye.sphere)}D
                    </td>
                  </tr>
                  <tr key={`${eye}-cylinder`} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-center text-gray-500">柱镜 (C)</td>
                    <td className="px-4 py-3 text-center font-mono">{formatValue(oldEye.cylinder)}D</td>
                    <td className={`px-4 py-3 text-center font-bold ${getDiffClass(oldEye.cylinder, newEye.cylinder)}`}>
                      {getDiffIcon(oldEye.cylinder, newEye.cylinder)}
                    </td>
                    <td className={`px-4 py-3 text-center font-mono font-semibold ${getDiffClass(oldEye.cylinder, newEye.cylinder)}`}>
                      {formatValue(newEye.cylinder)}D
                    </td>
                  </tr>
                  <tr key={`${eye}-axis`} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-center text-gray-500">轴位 (A)</td>
                    <td className="px-4 py-3 text-center font-mono">{oldEye.axis}°</td>
                    <td className={`px-4 py-3 text-center font-bold ${getDiffClass(oldEye.axis, newEye.axis)}`}>
                      {getDiffIcon(oldEye.axis, newEye.axis)}
                    </td>
                    <td className={`px-4 py-3 text-center font-mono font-semibold ${getDiffClass(oldEye.axis, newEye.axis)}`}>
                      {newEye.axis}°
                    </td>
                  </tr>
                  <tr key={`${eye}-add`} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-center text-gray-500">下加光 (ADD)</td>
                    <td className="px-4 py-3 text-center font-mono">{oldEye.add > 0 ? `+${oldEye.add.toFixed(2)}D` : '-'}</td>
                    <td className={`px-4 py-3 text-center font-bold ${getDiffClass(oldEye.add, newEye.add)}`}>
                      {getDiffIcon(oldEye.add, newEye.add)}
                    </td>
                    <td className={`px-4 py-3 text-center font-mono font-semibold ${getDiffClass(oldEye.add, newEye.add)}`}>
                      {newEye.add > 0 ? `+${newEye.add.toFixed(2)}D` : '-'}
                    </td>
                  </tr>
                </>
              );
            })}
            <tr className="bg-blue-50 font-medium">
              <td className="px-4 py-3 text-gray-700" colSpan={2}>瞳距 (PD)</td>
              <td className="px-4 py-3 text-center font-mono">{oldRx.pd} mm</td>
              <td className={`px-4 py-3 text-center font-bold ${getDiffClass(oldRx.pd, newRx.pd)}`}>
                {getDiffIcon(oldRx.pd, newRx.pd)}
              </td>
              <td className={`px-4 py-3 text-center font-mono font-semibold ${getDiffClass(oldRx.pd, newRx.pd)}`}>
                {newRx.pd} mm
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
