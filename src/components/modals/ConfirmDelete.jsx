import React from 'react';

export default function ConfirmDelete({ onConfirm, onCancel }) {
  return (
    <div className="confirm-delete">
      <p className="confirm-delete__text">
        Are you sure you want to delete this prompt? This cannot be undone.
      </p>
      <div className="confirm-delete__actions">
        <button className="btn-ghost" onClick={onCancel}>Cancel</button>
        <button className="btn-danger" onClick={onConfirm}>Delete</button>
      </div>
    </div>
  );
}
