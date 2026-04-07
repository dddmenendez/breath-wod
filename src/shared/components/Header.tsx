interface HeaderProps {
  title: string
}

function Header({ title }: HeaderProps) {
  return (
    <header className="flex items-center px-4 pb-3 pt-safe-top">
      <h1 className="text-xl font-bold text-text">{title}</h1>
    </header>
  )
}

export default Header
