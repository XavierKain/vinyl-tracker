import { useState } from 'react';
import type { View, VinylRecord } from './types';
import { useRecords } from './hooks/useRecords';
import CollectionView from './components/CollectionView';
import RecordForm from './components/RecordForm';
import RecordDetail from './components/RecordDetail';
import StatsView from './components/StatsView';
import ImportExport from './components/ImportExport';
import Settings from './components/Settings';

export default function App() {
  const { records, loading, addRecord, updateRecord, deleteRecord, importRecords, refresh } = useRecords();
  const [view, setView] = useState<View>('collection');
  const [selectedRecord, setSelectedRecord] = useState<VinylRecord | null>(null);

  function navigate(v: View) {
    setView(v);
    if (v !== 'detail' && v !== 'edit') setSelectedRecord(null);
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-2xl flex-col">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-gray-800 px-4 py-3">
        <button onClick={() => navigate('collection')} className="flex items-center gap-2">
          <svg viewBox="0 0 100 100" className="h-6 w-6 text-amber-500">
            <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="3" fill="none" />
            <circle cx="50" cy="50" r="8" fill="currentColor" />
          </svg>
          <span className="text-sm font-bold text-white">Vinyl Tracker</span>
        </button>
        <span className="text-xs text-gray-600">{records.length} records</span>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto pb-20">
        {view === 'collection' && (
          <CollectionView
            records={records}
            onSelect={(r) => {
              setSelectedRecord(r);
              setView('detail');
            }}
          />
        )}
        {view === 'add' && (
          <RecordForm
            onSave={async (data) => {
              await addRecord(data);
              navigate('collection');
            }}
            onCancel={() => navigate('collection')}
          />
        )}
        {view === 'edit' && selectedRecord && (
          <RecordForm
            initial={selectedRecord}
            onSave={async (data) => {
              await updateRecord(selectedRecord.id!, data);
              setSelectedRecord({ ...selectedRecord, ...data });
              setView('detail');
            }}
            onCancel={() => setView('detail')}
          />
        )}
        {view === 'detail' && selectedRecord && (
          <RecordDetail
            record={selectedRecord}
            onEdit={() => setView('edit')}
            onDelete={async () => {
              await deleteRecord(selectedRecord.id!);
              navigate('collection');
            }}
            onBack={() => navigate('collection')}
          />
        )}
        {view === 'stats' && <StatsView records={records} />}
        {view === 'import-export' && (
          <ImportExport records={records} onImport={importRecords} />
        )}
        {view === 'settings' && <Settings recordCount={records.length} onRefresh={refresh} />}
      </main>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 border-t border-gray-800 bg-gray-950/95 backdrop-blur">
        <div className="mx-auto flex max-w-2xl">
          <NavBtn
            active={view === 'collection'}
            onClick={() => navigate('collection')}
            label="Collection"
            icon={
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
              </svg>
            }
          />
          <NavBtn
            active={view === 'add'}
            onClick={() => navigate('add')}
            label="Add"
            icon={
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
            }
            accent
          />
          <NavBtn
            active={view === 'stats'}
            onClick={() => navigate('stats')}
            label="Stats"
            icon={
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
              </svg>
            }
          />
          <NavBtn
            active={view === 'import-export'}
            onClick={() => navigate('import-export')}
            label="CSV"
            icon={
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
              </svg>
            }
          />
          <NavBtn
            active={view === 'settings'}
            onClick={() => navigate('settings')}
            label="Settings"
            icon={
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
            }
          />
        </div>
      </nav>
    </div>
  );
}

function NavBtn({
  active,
  onClick,
  label,
  icon,
  accent,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  icon: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] transition ${
        accent
          ? 'text-amber-400'
          : active
            ? 'text-white'
            : 'text-gray-500 hover:text-gray-300'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
