import { Wind } from 'lucide-react'

function DigestProtocol() {
  return (
    <div className="flex items-start gap-3 rounded-xl bg-primary/10 p-3">
      <Wind size={18} className="mt-0.5 shrink-0 text-primary" />
      <div className="text-xs text-text-muted">
        <p className="font-semibold text-primary">Protocolo de digestión</p>
        <p className="mt-1">
          Respira profundo antes de comer. Come con calma, sin pantallas.
          Mastica bien cada bocado.
        </p>
      </div>
    </div>
  )
}

export default DigestProtocol
