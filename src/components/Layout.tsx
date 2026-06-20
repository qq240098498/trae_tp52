import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

const pageTitles: Record<string, string> = {
  '/': '仪表盘',
  '/customers': '顾客档案管理',
  '/frames': '镜架库存管理',
  '/lenses': '镜片库存管理',
  '/orders': '订单管理',
};

export function Layout() {
  const location = useLocation();
  const getPageTitle = () => {
    const path = location.pathname;
    if (path.startsWith('/customers/')) return '顾客详情';
    if (path.startsWith('/frames/')) return '镜架管理';
    if (path.startsWith('/lenses/')) return '镜片管理';
    if (path.startsWith('/orders/')) return '订单详情';
    return pageTitles[path] || '视光学管理系统';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-64">
        <Header title={getPageTitle()} />
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
