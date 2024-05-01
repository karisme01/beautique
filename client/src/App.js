import {Routes, Route} from 'react-router-dom'
import HomePage from './pages/HomePage';
import About from './pages/About';
import Contact from './pages/Contact';
import Policy from './pages/Policy';
import Pagenotfound from './pages/Pagenotfound';
import Register from './pages/Auth/Register';
import Login from './pages/Auth/Login';
import Dashboard from './pages/user/Dashboard';
import PrivateRoute from './components/Routes/Private';
import Forgotpassword from './pages/Auth/ForgotPassword';
import AdminRoute from './components/Routes/AdminRoute';
import AdminDashboard from './pages/Admin/AdminDashboard';
import CreateCategory from './pages/Admin/CreateCategory';
import CreateProduct from './pages/Admin/CreateProduct';
import Users from './pages/Admin/Users';
import Profile from './pages/user/Profile'
import Orders from './pages/user/Orders';
import OrdersAdmin from './pages/Admin/OrdersAdmin';
import Products from './pages/Admin/Products';
import UpdateProduct from './pages/Admin/UpdateProduct';
import Search from './pages/Search';
import ProductDetails from './pages/ProductDetails';
import Categories from './pages/Categories';
import CategoryProduct from './pages/CategoryProduct';
import CartPage from './pages/CartPage';
import WishListPage from './pages/WishListPage';
import BrandList from './pages/BrandList';
import CreateBrand from './pages/Admin/CreateBrand';
import BrandProduct from './pages/BrandProduct';
import TrendPage from './pages/TrendPage';
import ForYou from './pages/ForYou';
import SearchBot from './pages/SearchBot';
import BrandRoute from './components/Routes/BrandRoute';
import RecordOrder from './pages/Brand/RecordOrder';
import BrandDashboard from './pages/Brand/BrandDashboard';
import ProfileBrand from './pages/Brand/ProfileBrand';
import RealTimeOrder from './pages/Admin/RealTimeOrder';
import AddressBook from './pages/user/AddressBook';
import BrandProducts from './pages/Brand/BrandProducts';
import OrderBook from './pages/Brand/OrderBook';
import Messages from './pages/user/Messages';
import RealTimeOrderItem from './pages/Admin/RealTimeOrderItems';
import Production from './pages/Admin/Production';
import Shipped from './pages/Admin/Shipped';
import Collected from './pages/Admin/Collected';
import ProcessingReturn from './pages/Admin/ProcessingReturn';
import Returned from './pages/Admin/Returned';
import Outreach from './pages/Brand/Outreach';
import Analytics from './pages/Brand/Analytics';
import Explore from './pages/Explore';
import Vids from './pages/Brand/Vids';
import Checkout from './pages/Checkout';


function App() {
  return (
    <>
      <Routes>
        <Route path="/" element = {<HomePage/>} />
        <Route path="/product/:slug" element = {<ProductDetails/>} />
        <Route path="/categories" element = {<Categories/>} />  
        <Route path="/cart" element = {<CartPage/>} />  
        <Route path="/checkout" element = {<Checkout/>} />  
        <Route path="/wish" element = {<WishListPage/>} />  
        <Route path="/category/:slug" element = {<CategoryProduct/>} />
        <Route path="/cloud-brands" element = {<BrandList/>} />  
        <Route path="/for-you" element = {<ForYou/>} />  
        <Route path="/trend" element = {<TrendPage/>} />  
        <Route path="/ask" element = {<SearchBot/>} />  
        <Route path="/cloud-brands/:slug" element = {<BrandProduct/>} />
        <Route path="/search" element = {<Search/>} />
        <Route path="/explore" element = {<Explore/>} />
        
        <Route path="/dashboard" element = {<PrivateRoute/>}>
          <Route path="user" element={<Dashboard/>} />
          <Route path="user/profile" element={<Profile/>} />
          <Route path="user/orders" element={<Orders/>} />
          <Route path="user/address-book" element={<AddressBook/>} />
          <Route path="user/messages" element={<Messages/>} />
        </Route>

        <Route path="/dashboard" element = {<AdminRoute/>}>
          <Route path="admin" element={<AdminDashboard/>} />
          <Route path="admin/create-category" element={<CreateCategory/>} />
          <Route path="admin/create-product" element={<CreateProduct/>} />
          <Route path="admin/create-brand" element={<CreateBrand/>} />
          <Route path="admin/product/:slug" element={<UpdateProduct/>} />
          <Route path="admin/products" element={<Products/>} />
          <Route path="admin/users" element={<Users/>} />
          <Route path="admin/orders" element={<OrdersAdmin/>} />
          <Route path="admin/real-time-orders" element={<RealTimeOrder/>} />
          <Route path="admin/real-time-order-items" element={<RealTimeOrderItem/>} />
          <Route path="admin/real-time-order-items-production" element={<Production/>} />
          <Route path="admin/real-time-order-items-shipped" element={<Shipped/>} />
          <Route path="admin/real-time-order-items-collected" element={<Collected/>} />
          <Route path="admin/real-time-order-items-processing-return" element={<ProcessingReturn/>} />
          <Route path="admin/real-time-order-items-returned" element={<Returned/>} />

        </Route>

        <Route path="/dashboard" element = {<BrandRoute/>}>
          <Route path="brand" element={<BrandDashboard/>} />
          <Route path="brand/profileBrand" element={<ProfileBrand/>} />
          <Route path="brand/record-order" element={<RecordOrder/>} />
          <Route path="brand/products" element={<BrandProducts/>} />
          <Route path="brand/order-book" element={<OrderBook/>} />
          <Route path="brand/outreach" element={<Outreach/>} />
          <Route path="brand/analytics" element={<Analytics/>} />
          <Route path="brand/vids" element={<Vids/>} />
        </Route>

        <Route path="/register" element = {<Register/>} />
        <Route path="/forgot-password" element = {<Forgotpassword/>} />
        <Route path="/login" element = {<Login/>} />
        <Route path="/about" element = {<About/>} />
        <Route path="/contact" element = {<Contact/>} />
        <Route path="/policy" element = {<Policy/>} />
        <Route path="*" element = {<Pagenotfound/>} />
      </Routes>
    </>
  );
}

export default App;
