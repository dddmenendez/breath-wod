// CANONICAL TEMPLATE — copy and adapt.
// Do NOT import this file. Use it as a reference when creating feature pages.
//
// Pattern: Feature page that composes components from its own feature folder.
// Loads data via its store on mount. Handles loading and error states.

import { useEffect } from 'react';
import Header from '@/shared/components/Header';
import { useExampleStore } from './store/exampleStore';
import ExampleList from './components/ExampleList';
import ExampleEmpty from './components/ExampleEmpty';

function ExamplePage() {
  const items = useExampleStore((state) => state.items);
  const loading = useExampleStore((state) => state.loading);
  const error = useExampleStore((state) => state.error);
  const load = useExampleStore((state) => state.load);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="flex min-h-screen flex-col bg-bg pb-safe-bottom">
      <Header title="Ejemplo" />

      <main className="flex-1 px-4 pt-4">
        {loading && (
          <p className="text-text-muted">Cargando...</p>
        )}

        {error && (
          <div className="rounded-lg bg-danger/10 p-3 text-sm text-danger">
            {error}
          </div>
        )}

        {!loading && !error && items.length === 0 && <ExampleEmpty />}

        {!loading && !error && items.length > 0 && <ExampleList items={items} />}
      </main>
    </div>
  );
}

export default ExamplePage;
