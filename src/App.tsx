import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import Dashboard from './pages/Dashboard';
import CustomerList from './pages/customers/List';
import CustomerDetail from './pages/customers/Detail';
import ExamForm from './pages/customers/ExamForm';
import ExamDetail from './pages/customers/ExamDetail';
import { FrameList, FrameForm } from './pages/frames';
import { LensList, LensForm } from './pages/lenses';
import { OrderList, NewOrder, OrderDetail } from './pages/orders';
import PickupReview from './pages/orders/PickupReview';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/customers" element={<CustomerList />} />
          <Route path="/customers/:id" element={<CustomerDetail />} />
          <Route path="/customers/:id/exam/new" element={<ExamForm />} />
          <Route path="/customers/:id/exam/:examId" element={<ExamDetail />} />
          <Route path="/frames" element={<FrameList />} />
          <Route path="/frames/new" element={<FrameForm />} />
          <Route path="/frames/:id/edit" element={<FrameForm />} />
          <Route path="/lenses" element={<LensList />} />
          <Route path="/lenses/new" element={<LensForm />} />
          <Route path="/lenses/:id/edit" element={<LensForm />} />
          <Route path="/orders" element={<OrderList />} />
          <Route path="/orders/new" element={<NewOrder />} />
          <Route path="/orders/:id" element={<OrderDetail />} />
          <Route path="/orders/:id/pickup" element={<PickupReview />} />
        </Route>
      </Routes>
    </Router>
  );
}
