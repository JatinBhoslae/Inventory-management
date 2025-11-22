import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Receipts from './pages/Receipts';
import Deliveries from './pages/Deliveries';
import Transfers from './pages/Transfers';
import Adjustments from './pages/Adjustments';
import StockLedgerPage from './pages/StockLedger';
import AdvancedFeatures from './pages/AdvancedFeatures';
import Login from './pages/Login';
import ShopLogin from './pages/ShopLogin';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import UserProfile from './pages/UserProfile';
import Orders from './pages/Orders';
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
    name: 'Advanced Features',
    path: '/advanced',
    element: <AdvancedFeatures />,
  },
  {
    name: 'Login',
    path: '/login',
    element: <Login />,
    visible: false,
  },
  {
    name: 'Shop Login',
    path: '/shop-login',
    element: <ShopLogin />,
    visible: false,
  },
  {
    name: 'Shop',
    path: '/shop',
    element: <Shop />,
  },
  {
    name: 'Product Detail',
    path: '/product/:id',
    element: <ProductDetail />,
    visible: false,
  },
  {
    name: 'Cart',
    path: '/cart',
    element: <Cart />,
    visible: false,
  },
  {
    name: 'Checkout',
    path: '/checkout',
    element: <Checkout />,
    visible: false,
  },
  {
    name: 'User Profile',
    path: '/user/profile',
    element: <UserProfile />,
    visible: false,
  },
  {
    name: 'Orders',
    path: '/user/orders',
    element: <Orders />,
    visible: false,
  },
];

export default routes;