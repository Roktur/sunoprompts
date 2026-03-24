import { useState, useCallback } from 'react';

export function useModal() {
  const [modalState, setModalState] = useState({
    view: null,     // prompt object or null
    add: false,
    edit: null,     // prompt object or null
  });

  const openView = useCallback((prompt) => {
    setModalState({ view: prompt, add: false, edit: null });
  }, []);

  const openAdd = useCallback(() => {
    setModalState({ view: null, add: true, edit: null });
  }, []);

  const openEdit = useCallback((prompt) => {
    setModalState({ view: null, add: false, edit: prompt });
  }, []);

  const closeAll = useCallback(() => {
    setModalState({ view: null, add: false, edit: null });
  }, []);

  const isAnyOpen = modalState.view !== null || modalState.add || modalState.edit !== null;

  return { modalState, openView, openAdd, openEdit, closeAll, isAnyOpen };
}
