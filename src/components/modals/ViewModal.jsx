import React, { useState } from 'react';
import ModalOverlay from './ModalOverlay';
import ConfirmDelete from './ConfirmDelete';
import GenreBadge from '../GenreBadge';
import TagPill from '../TagPill';
import { getGradient } from '../../utils/gradients';
import { copyToClipboard } from '../../utils/copyToClipboard';

export default function ViewModal({ prompt, onClose, onEdit, onDelete, onDuplicate }) {
  const [copied, setCopied] = useState(false);
  const [confirming, setConfirming] = useState(false);

  if (!prompt) return null;

  const { title, prompt: text, genre, mood, bpm, language, tags, image, isFavorite } = prompt;

  const handleCopy = async () => {
    await copyToClipboard(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = () => {
    onDelete(prompt.id);
    onClose();
  };

  return (
    <ModalOverlay open={!!prompt} onClose={onClose}>
      <button className="modal-close" onClick={onClose} aria-label="Close">×</button>

      <div className="view-modal__cover">
        {image ? (
          <img src={image} alt={title} className="view-modal__image" />
        ) : (
          <div className="view-modal__gradient" style={{ background: getGradient(genre) }} />
        )}
      </div>

      <div className="view-modal__body">
        <h2 className="view-modal__title">{title}</h2>

        <div className="view-modal__meta">
          <GenreBadge genre={genre} />
          {mood && <span className="meta-chip meta-chip--mood">{mood}</span>}
          {bpm && <span className="meta-chip">{bpm} BPM</span>}
          {language && <span className="meta-chip">{language}</span>}
        </div>

        <div className="view-modal__prompt-block">
          <div className="view-modal__prompt-header">
            <span className="view-modal__prompt-label">Prompt</span>
            <button className="btn-copy" onClick={handleCopy}>
              {copied ? '✓ Copied' : 'Copy Prompt'}
            </button>
          </div>
          <pre className="view-modal__prompt-text">{text}</pre>
        </div>

        {tags.length > 0 && (
          <div className="view-modal__tags">
            {tags.map((tag) => (
              <TagPill key={tag} tag={tag} />
            ))}
          </div>
        )}

        {confirming ? (
          <ConfirmDelete
            onConfirm={handleDelete}
            onCancel={() => setConfirming(false)}
          />
        ) : (
          <div className="view-modal__actions">
            <button className="btn-primary" onClick={() => onEdit(prompt)}>Edit</button>
            <button className="btn-ghost" onClick={() => { onDuplicate(prompt); onClose(); }}>Duplicate</button>
            <button className="btn-danger" onClick={() => setConfirming(true)}>Delete</button>
          </div>
        )}
      </div>
    </ModalOverlay>
  );
}
