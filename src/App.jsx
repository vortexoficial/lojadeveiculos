import { Navigate, Route, Routes, useParams } from 'react-router-dom'
import AdminLayout from './layouts/AdminLayout.jsx'
import PublicLayout from './layouts/PublicLayout.jsx'
import ProtectedRoute from './routes/ProtectedRoute.jsx'
import AdminBanners from './pages/admin/AdminBanners.jsx'
import AdminCategoryBanners from './pages/admin/AdminCategoryBanners.jsx'
import AdminBlog from './pages/admin/AdminBlog.jsx'
import AdminBlogForm from './pages/admin/AdminBlogForm.jsx'
import AdminCategories from './pages/admin/AdminCategories.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import AdminLogin from './pages/admin/AdminLogin.jsx'
import AdminProductForm from './pages/admin/AdminProductForm.jsx'
import AdminProducts from './pages/admin/AdminProducts.jsx'
import AdminSettings from './pages/admin/AdminSettings.jsx'
import BlogPage from './pages/public/BlogPage.jsx'
import BlogPostPage from './pages/public/BlogPostPage.jsx'
import CategoryPage from './pages/public/CategoryPage.jsx'
import Home from './pages/public/Home.jsx'
import NotFoundPage from './pages/public/NotFoundPage.jsx'
import ProductDetailPage from './pages/public/ProductDetailPage.jsx'
import ProductsPage from './pages/public/ProductsPage.jsx'

function LegacyVehicleRedirect({ admin = false, edit = false }) {
  const { slug, id } = useParams()

  if (admin) {
    return <Navigate to={edit ? `/admin/veiculos/editar/${id}` : '/admin/veiculos'} replace />
  }

  return <Navigate to={slug ? `/veiculo/${slug}` : '/veiculos'} replace />
}

function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="veiculos" element={<ProductsPage key="veiculos" />} />
        <Route path="carros" element={<ProductsPage key="carros" lockedType="suplemento" />} />
        <Route path="motos" element={<ProductsPage key="motos" lockedType="vestuario" />} />
        <Route path="ofertas" element={<ProductsPage key="ofertas" />} />
        <Route path="produtos" element={<Navigate to="/veiculos" replace />} />
        <Route path="suplementos" element={<Navigate to="/carros" replace />} />
        <Route path="vestuario" element={<Navigate to="/motos" replace />} />
        <Route path="veiculo/:slug" element={<ProductDetailPage />} />
        <Route path="produto/:slug" element={<LegacyVehicleRedirect />} />
        <Route path="categoria/:slug" element={<CategoryPage />} />
        <Route path="blog" element={<BlogPage />} />
        <Route path="blog/:slug" element={<BlogPostPage />} />
      </Route>

      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="veiculos" element={<AdminProducts />} />
        <Route path="veiculos/novo" element={<AdminProductForm />} />
        <Route path="veiculos/editar/:id" element={<AdminProductForm />} />
        <Route path="produtos" element={<Navigate to="/admin/veiculos" replace />} />
        <Route path="produtos/novo" element={<Navigate to="/admin/veiculos/novo" replace />} />
        <Route path="produtos/editar/:id" element={<LegacyVehicleRedirect admin edit />} />
        <Route path="categorias" element={<AdminCategories />} />
        <Route path="blog" element={<AdminBlog />} />
        <Route path="blog/novo" element={<AdminBlogForm />} />
        <Route path="blog/editar/:id" element={<AdminBlogForm />} />
        <Route path="banners" element={<AdminBanners />} />
        <Route path="banners-categorias" element={<AdminCategoryBanners />} />
        <Route path="configuracoes" element={<AdminSettings />} />
      </Route>

      <Route path="/admin/*" element={<Navigate to="/admin" replace />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App

