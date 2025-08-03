import { useState, useCallback } from 'react';

export type ModalType = 
  | 'eventConfirm'
  | 'eventDetail' 
  | 'eventCancel'
  | 'eventEdit'
  | 'reviewAndCheckin'
  | null;

interface ModalState {
  activeModal: ModalType;
  modalData?: any;
}

export function useModals() {
  const [modalState, setModalState] = useState<ModalState>({
    activeModal: null,
    modalData: undefined,
  });

  // Open a modal with optional data
  const openModal = useCallback((modal: ModalType, data?: any) => {
    setModalState({
      activeModal: modal,
      modalData: data,
    });
  }, []);

  // Close the active modal
  const closeModal = useCallback(() => {
    setModalState({
      activeModal: null,
      modalData: undefined,
    });
  }, []);

  // Check if a specific modal is open
  const isModalOpen = useCallback((modal: ModalType) => {
    return modalState.activeModal === modal;
  }, [modalState.activeModal]);

  // Modal state helpers for backward compatibility
  const modals = {
    showModal: isModalOpen('eventConfirm'),
    showDetail: isModalOpen('eventDetail'),
    showCancelModal: isModalOpen('eventCancel'),
    showEditModal: isModalOpen('eventEdit'),
    showReviewModal: isModalOpen('reviewAndCheckin'),
  };

  // Modal actions for backward compatibility
  const modalActions = {
    setShowModal: (show: boolean) => show ? openModal('eventConfirm') : closeModal(),
    setShowDetail: (show: boolean) => show ? openModal('eventDetail') : closeModal(),
    setShowCancelModal: (show: boolean) => show ? openModal('eventCancel') : closeModal(),
    setShowEditModal: (show: boolean) => show ? openModal('eventEdit') : closeModal(),
    setShowReviewModal: (show: boolean) => show ? openModal('reviewAndCheckin') : closeModal(),
  };

  return {
    // New API
    activeModal: modalState.activeModal,
    modalData: modalState.modalData,
    openModal,
    closeModal,
    isModalOpen,
    
    // Backward compatibility
    ...modals,
    ...modalActions,
  };
}