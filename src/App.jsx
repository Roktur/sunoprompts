import React, { useState } from 'react';
import LoginScreen from './components/LoginScreen';
import { useAuth } from './hooks/useAuth';
import Header from './components/Header';
import ActiveFilterChips from './components/ActiveFilterChips';
import FilterDrawer from './components/FilterDrawer';
import CardGrid from './components/CardGrid';
import ViewModal from './components/modals/ViewModal';
import AddEditModal from './components/modals/AddEditModal';
import { usePrompts } from './hooks/usePrompts';
import { useModal } from './hooks/useModal';
import { exportJson } from './utils/exportJson';

export default function App() {
  const {
    prompts,
    loading,
    error,
    paginated,
    total,
    totalAll,
    hasMore,
    loadMore,
    searchQuery,
    setSearchQuery,
    filters,
    setFilters,
    sort,
    setSort,
    activeFilterCount,
    uniqueGenres,
    uniqueMoods,
    addPrompt,
    updatePrompt,
    deletePrompt,
    toggleFavorite,
    duplicatePrompt,
  } = usePrompts();

  const { session, loading: authLoading, signIn, signOut } = useAuth();
  const { modalState, openView, openAdd, openEdit, closeAll } = useModal();
  const [filterOpen, setFilterOpen] = useState(false);

  if (authLoading) {
    return (
      <div className="login-screen">
        <div className="loading-spinner" style={{ width: 36, height: 36 }} />
      </div>
    );
  }

  if (!session) {
    return <LoginScreen onLogin={signIn} />;
  }

  const handleSave = (data) => {
    if (modalState.edit) updatePrompt(modalState.edit.id, data);
    else addPrompt(data);
  };

  return (
    <div className="app">
      <Header
        searchQuery={searchQuery}
        onSearch={setSearchQuery}
        activeFilterCount={activeFilterCount}
        onOpenFilter={() => setFilterOpen(true)}
        sort={sort}
        onSort={setSort}
        onAddPrompt={openAdd}
        onSignOut={signOut}
      />

      <ActiveFilterChips filters={filters} onChange={setFilters} />

      <main className="main">
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner" />
            <p>Loading prompts…</p>
          </div>
        ) : error ? (
          <div className="error-state">
            <p>Failed to load: {error.message}</p>
            <p className="error-hint">Check your Supabase environment variables.</p>
          </div>
        ) : (
          <CardGrid
            prompts={paginated}
            hasMore={hasMore}
            loadMore={loadMore}
            onOpen={openView}
            onToggleFavorite={toggleFavorite}
          />
        )}
      </main>

      <footer className="footer">
        <span className="footer__count">
          {loading ? '…' : total === totalAll
            ? `${totalAll} prompt${totalAll !== 1 ? 's' : ''}`
            : `${total} of ${totalAll} prompts`}
        </span>
        <button className="btn-ghost btn-ghost--sm" onClick={() => exportJson(prompts)}>
          Download prompts.json
        </button>
      </footer>

      <FilterDrawer
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        filters={filters}
        onChange={setFilters}
        genres={uniqueGenres}
        moods={uniqueMoods}
      />

      <ViewModal
        prompt={modalState.view}
        onClose={closeAll}
        onEdit={openEdit}
        onDelete={deletePrompt}
        onDuplicate={duplicatePrompt}
      />

      <AddEditModal
        open={modalState.add || !!modalState.edit}
        mode={modalState.edit ? 'edit' : 'add'}
        initialData={modalState.edit}
        onClose={closeAll}
        onSave={handleSave}
        genres={uniqueGenres}
        moods={uniqueMoods}
      />
    </div>
  );
}
