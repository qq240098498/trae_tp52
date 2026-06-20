import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Glasses,
  Eye,
  ShoppingCart,
  Package,
  Clock,
} from 'lucide-react';

const menuItems = [
  { path: '/', icon: LayoutDashboard, label: '仪表盘' },
  { path: '/customers', icon: Users, label: '顾客档案' },
  { path: '/frames', icon: Glasses, label: '镜架库存' },
  { path: '/lenses', icon: Eye, label: '镜片库存' },
  { path: '/orders', icon: ShoppingCart, label: '订单管理' },
  { path: '/overdue', icon: Clock, label: '逾期取镜' },
];

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-slate-900 text-white shadow-xl z-20">
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold">视光学管理</h1>
            <p className="text-xs text-slate-400">眼镜店管理系统</p>
          </div>
        </div>
      </div>

      <nav className="p-4 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700">
        <div className="bg-slate-800 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center font-bold">
              管
            </div>
            <div>
              <p className="font-medium text-sm">管理员</p>
              <p className="text-xs text-slate-400">admin@optic.com</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
