import { Routes, Route } from 'react-router-dom'
import HomePage from '@/features/home/HomePage'
import FastingPage from '@/features/fasting/FastingPage'
import MenuPage from '@/features/menu/MenuPage'
import ShoppingPage from '@/features/shopping/ShoppingPage'
import SupplementsPage from '@/features/supplements/SupplementsPage'

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/fasting" element={<FastingPage />} />
      <Route path="/menu" element={<MenuPage />} />
      <Route path="/shopping" element={<ShoppingPage />} />
      <Route path="/supplements" element={<SupplementsPage />} />
    </Routes>
  )
}

export default AppRouter
