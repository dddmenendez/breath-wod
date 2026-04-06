// CANONICAL TEMPLATE — copy and adapt.
// Do NOT import this file. Use it as a reference when creating new components.
//
// Pattern: React function component with typed props, hooks on top,
// handlers next, JSX last. Max 150 lines total.

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import type { ExampleRecord } from '../types/example.types';

interface ExampleCardProps {
  record: ExampleRecord;
  onToggle: (id: number) => void;
  className?: string;
}

function ExampleCard({ record, onToggle, className = '' }: ExampleCardProps) {
  const [expanded, setExpanded] = useState(false);

  const handleClick = () => {
    setExpanded((prev) => !prev);
  };

  const handleToggle = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (record.id !== undefined) {
      onToggle(record.id);
    }
  };

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      className={`w-full rounded-xl bg-bg-surface p-4 text-left transition-colors hover:bg-bg-elevated ${className}`}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-text">{record.name}</h3>
        <span
          onClick={handleToggle}
          className={`flex h-6 w-6 items-center justify-center rounded-full ${
            record.completed ? 'bg-primary' : 'border border-text-muted'
          }`}
          role="checkbox"
          aria-checked={record.completed}
        >
          {record.completed && <Check size={16} className="text-bg" />}
        </span>
      </div>

      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="mt-3 text-sm text-text-muted"
        >
          {record.description}
        </motion.div>
      )}
    </motion.button>
  );
}

export default ExampleCard;
