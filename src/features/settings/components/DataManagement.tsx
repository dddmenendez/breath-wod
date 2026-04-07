import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Download, Upload, X, AlertTriangle } from 'lucide-react'
import { exportToJson, importFromJson } from '@/shared/utils/exportData'

function DataManagement() {
  const [showConfirm, setShowConfirm] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const pendingFileRef = useRef<File | null>(null)

  const handleExport = async () => {
    try {
      await exportToJson()
      setMessage({ type: 'success', text: 'Backup descargado correctamente' })
    } catch {
      setMessage({ type: 'error', text: 'Error al exportar los datos' })
    }
  }

  const handleImportClick = () => {
    fileRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    pendingFileRef.current = file
    setShowConfirm(true)
    e.target.value = ''
  }

  const handleConfirmImport = async () => {
    setShowConfirm(false)
    const file = pendingFileRef.current
    if (!file) return

    const result = await importFromJson(file)
    if (result.success) {
      setMessage({ type: 'success', text: 'Datos importados correctamente. Recarga la app.' })
    } else {
      setMessage({ type: 'error', text: result.error ?? 'Error desconocido' })
    }
    pendingFileRef.current = null
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-sm font-semibold text-text">Gestión de datos</h2>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={handleExport}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-bg-surface py-3 text-sm font-medium text-text transition-colors active:bg-bg-elevated"
        >
          <Download size={18} />
          Exportar
        </button>

        <button
          type="button"
          onClick={handleImportClick}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-bg-surface py-3 text-sm font-medium text-text transition-colors active:bg-bg-elevated"
        >
          <Upload size={18} />
          Importar
        </button>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="hidden"
      />

      {message && (
        <div
          className={`rounded-lg p-3 text-sm ${
            message.type === 'success'
              ? 'bg-success/10 text-success'
              : 'bg-danger/10 text-danger'
          }`}
        >
          {message.text}
        </div>
      )}

      <AnimatePresence>
        {showConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm rounded-2xl bg-bg-surface p-6"
            >
              <div className="mb-1 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle size={18} className="text-warning" />
                  <h3 className="text-lg font-semibold text-text">Importar datos</h3>
                </div>
                <button type="button" onClick={() => setShowConfirm(false)} className="text-text-dim">
                  <X size={20} />
                </button>
              </div>
              <p className="mb-6 text-sm text-text-muted">
                Esto reemplazará todos los datos actuales. Esta acción no se puede deshacer.
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 rounded-xl bg-bg-elevated py-3 text-sm font-medium text-text"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleConfirmImport}
                  className="flex-1 rounded-xl bg-warning py-3 text-sm font-medium text-bg"
                >
                  Importar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default DataManagement
