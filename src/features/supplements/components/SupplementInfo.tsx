import { motion } from 'framer-motion'
import { X } from 'lucide-react'
import { defaultSupplements } from '@/data/defaultSupplements'

import type { SupplementLog } from '../types/supplement.types'

interface SupplementInfoProps {
  log: SupplementLog
  onClose: () => void
}

function SupplementInfo({ log, onClose }: SupplementInfoProps) {
  const definition = defaultSupplements.find((s) => s.id === log.supplementId)

  return (
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
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-text">{log.name}</h3>
          <button type="button" onClick={onClose} className="text-text-dim">
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col gap-3 text-sm">
          <div>
            <span className="font-medium text-text-muted">Dosis</span>
            <p className="text-text">{log.dose}</p>
          </div>

          {definition && (
            <>
              <div>
                <span className="font-medium text-text-muted">Propósito</span>
                <p className="text-text">{definition.purpose}</p>
              </div>
              <div>
                <span className="font-medium text-text-muted">Notas</span>
                <p className="text-text">{definition.notes}</p>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default SupplementInfo
