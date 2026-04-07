import { BrowserRouter } from 'react-router-dom'
import AppRouter from './Router'
import BottomNav from '@/shared/components/BottomNav'
import InstallBanner from '@/shared/components/InstallBanner'

function App() {
  return (
    <BrowserRouter>
      <InstallBanner />
      <AppRouter />
      <BottomNav />
    </BrowserRouter>
  )
}

export default App
