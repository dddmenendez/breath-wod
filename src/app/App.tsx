import { BrowserRouter } from 'react-router-dom'
import AppRouter from './Router'
import BottomNav from '@/shared/components/BottomNav'

function App() {
  return (
    <BrowserRouter>
      <AppRouter />
      <BottomNav />
    </BrowserRouter>
  )
}

export default App
