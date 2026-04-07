import { useNavigate } from 'react-router-dom'
import { Settings } from 'lucide-react'

interface HeaderProps {
  title: string
}

function Header({ title }: HeaderProps) {
  const navigate = useNavigate()

  return (
    <header className="flex items-center justify-between px-4 pb-3 pt-safe-top">
      <h1 className="text-xl font-bold text-text">{title}</h1>
      <button
        type="button"
        onClick={() => navigate('/settings')}
        className="p-1 text-text-dim transition-colors hover:text-text"
        aria-label="Ajustes"
      >
        <Settings size={20} />
      </button>
    </header>
  )
}

export default Header
