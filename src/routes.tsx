import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Receipts from './pages/Receipts';
import Deliveries from './pages/Deliveries';
import Transfers from './pages/Transfers';
import Adjustments from './pages/Adjustments';
import StockLedgerPage from './pages/StockLedger';
import Login from './pages/Login';
import type { ReactNode } from 'react';

export interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
}

const routes: RouteConfig[] = [
  {
    name: 'Landing',
    path: '/',
    element: <Landing />,
    visible: false,
  },
  {
    name: 'Dashboard',
    path: '/dashboard',
    element: <Dashboard />,
  },
  {
    name: 'Products',
    path: '/products',
    element: <Products />,
  },
  {
    name: 'Receipts',
    path: '/receipts',
    element: <Receipts />,
  },
  {
    name: 'Deliveries',
    path: '/deliveries',
    element: <Deliveries />,
  },
  {
    name: 'Transfers',
    path: '/transfers',
    element: <Transfers />,
  },
  {
    name: 'Adjustments',
    path: '/adjustments',
    element: <Adjustments />,
  },
  {
    name: 'Stock Ledger',
    path: '/ledger',
    element: <StockLedgerPage />,
  },
  {
    name: 'Login',
    path: '/login',
    element: <Login />,
    visible: false,
  },
];

export default routes;