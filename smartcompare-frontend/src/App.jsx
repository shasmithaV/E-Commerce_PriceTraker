import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Products from "./pages/Products";
import ComparePage from "./pages/ComparePage";
import CartPage from "./pages/CartPage";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProducts from "./pages/AdminProducts";
import AdminRoute from "./components/AdminRoute";
import CheckoutPage from "./pages/CheckoutPage";
import OrdersPage from "./pages/OrdersPage";
import AdminOrders from "./pages/AdminOrders";
import AdminAnalytics from "./pages/AdminAnalytics";
import AdminExternalPrices from "./pages/AdminExternalPrices";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/products" element={<Products />} /> 
        <Route path="/compare" element={<ComparePage />}/>
        <Route path="/cart" element={<CartPage />} />
        <Route path="/admin" element={ <AdminRoute> <AdminDashboard /> </AdminRoute>
        }/>
      <Route path="/admin/products" element={ <AdminRoute> <AdminProducts /></AdminRoute>
    }/>
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/orders" element={<OrdersPage />} />
      <Route path="/admin/orders" element={ <AdminRoute> <AdminOrders /></AdminRoute>
  }/>
      <Route path="/admin/analytics" element={ <AdminRoute> <AdminAnalytics /> </AdminRoute>
  }/>
      <Route path="/admin/external-prices" element={  <AdminRoute> <AdminExternalPrices /> </AdminRoute>
  }/>
     


      </Routes>
    </BrowserRouter>
  );
}

export default App;
