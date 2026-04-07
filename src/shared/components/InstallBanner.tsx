import { motion, AnimatePresence } from 'framer-motion'
import { Download, X } from 'lucide-react'
import { useInstallPrompt } from '@/shared/hooks/useInstallPrompt'

function InstallBanner() {
  const { canInstall, dismissed, promptInstall, dismiss } = useInstallPrompt()

  const visible = canInstall && !dismissed

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="mx-4 mb-3 flex items-center gap-3 rounded-xl bg-primary/10 p-3"
        >
          <Download size={20} className="shrink-0 text-primary" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-text">Instalar A.R.M. Protocol</p>
            <p className="text-xs text-text-muted">Acceso rápido desde tu pantalla de inicio</p>
          </div>
          <button
            type="button"
            onClick={promptInstall}
            className="shrink-0 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-bg"
          >
            Instalar
          </button>
          <button
            type="button"
            onClick={dismiss}
            className="shrink-0 p-1 text-text-dim"
            aria-label="Cerrar"
          >
            <X size={16} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default InstallBanner
