import React, { useState, useEffect, useRef } from 'react';
import ModalOverlay from './ModalOverlay';
import TagInput from '../TagInput';
import ComboBox from '../ComboBox';
import { getGradient, getPresetGradient, presetCovers } from '../../utils/gradients';

const empty = {
  title: '',
  prompt: '',
  genre: 'Pop',
  mood: 'Happy',
  bpm: '',
  tags: [],
  image: null,
  coverPreset: null,
};

export default function AddEditModal({ open, mode, initialData, onClose, onSave, genres, moods }) {
  const [form, setForm] = useState(empty);
  const [errors, setErrors] = useState({});
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (open) {
      if (mode === 'edit' && initialData) {
        setForm({
          title: initialData.title || '',
          prompt: initialData.prompt || '',
          genre: initialData.genre || 'Pop',
          mood: initialData.mood || 'Happy',
          bpm: initialData.bpm || '',
          tags: initialData.tags || [],
          image: initialData.image || null,
          coverPreset: initialData.coverPreset || null,
        });
      } else {
        setForm(empty);
      }
      setErrors({});
    }
  }, [open, mode, initialData]);

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const loadImageFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setForm((f) => ({ ...f, image: e.target.result, coverPreset: null }));
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    loadImageFile(e.dataTransfer.files[0]);
  };

  const validate = () => {
    const errs = {};
    if (!form.title.trim()) errs.title = 'Title is required';
    if (!form.prompt.trim()) errs.prompt = 'Prompt is required';
    return errs;
  };

  const handleSubmit = () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    onSave({ ...form, bpm: form.bpm ? Number(form.bpm) : null });
    onClose();
  };

  const isAdd = mode === 'add';
  const canSave = form.title.trim() && form.prompt.trim();

  return (
    <ModalOverlay open={open} onClose={onClose} className="modal-content--form">
      <button className="modal-close" onClick={onClose} aria-label="Close">×</button>
      <h2 className="modal-title">{isAdd ? 'New Prompt' : 'Edit Prompt'}</h2>

      <div className="form-body">

        {/* Cover */}
        <div className="form-field">
          <label className="form-label">Cover</label>
          <div
            className={`image-upload${dragOver ? ' image-upload--drag' : ''}`}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            {form.image ? (
              <>
                <img src={form.image} alt="Cover preview" className="image-upload__preview" />
              </>
            ) : (
              <div
                className="image-upload__gradient"
                style={{ background: form.coverPreset ? getPresetGradient(form.coverPreset) : getGradient(form.genre) }}
              >
                <div className="image-upload__placeholder">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5M12 3v12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>{form.coverPreset ? 'Click to upload custom image' : 'Click or drag & drop image'}</span>
                  <span className="image-upload__hint">JPG, PNG, WEBP</span>
                </div>
              </div>
            )}
            {(form.image || form.coverPreset) && (
              <button
                className="image-upload__remove"
                onClick={(e) => { e.stopPropagation(); setForm((f) => ({ ...f, image: null, coverPreset: null })); }}
                aria-label="Remove cover"
              >×</button>
            )}
          </div>
          <input ref={fileInputRef} type="file" accept="image/*" className="image-upload__input" onChange={(e) => loadImageFile(e.target.files[0])} />

          {/* Preset covers */}
          <div className="cover-presets">
            <span className="cover-presets__label">Preset covers</span>
            <div className="cover-presets__grid">
              {presetCovers.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  className={`cover-preset${form.coverPreset === preset.id ? ' cover-preset--active' : ''}`}
                  style={{ background: preset.gradient }}
                  title={preset.name}
                  onClick={() => setForm((f) => ({ ...f, coverPreset: preset.id, image: null }))}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="form-field">
          <label className="form-label">Title *</label>
          <input
            className={`form-input${errors.title ? ' form-input--error' : ''}`}
            value={form.title}
            onChange={(e) => set('title', e.target.value)}
            placeholder="e.g. Dark Cinematic Orchestral"
          />
          {errors.title && <span className="form-error">{errors.title}</span>}
        </div>

        <div className="form-field">
          <label className="form-label">Prompt *</label>
          <textarea
            className={`form-textarea${errors.prompt ? ' form-input--error' : ''}`}
            rows={6}
            value={form.prompt}
            onChange={(e) => set('prompt', e.target.value)}
            placeholder="[Intro]&#10;epic orchestral, dark ambient..."
          />
          {errors.prompt && <span className="form-error">{errors.prompt}</span>}
        </div>

        <div className="form-row">
          <div className="form-field">
            <label className="form-label">Genre *</label>
            <ComboBox
              value={form.genre}
              onChange={(v) => set('genre', v)}
              options={genres || []}
              placeholder="e.g. Orchestral"
            />
          </div>
          <div className="form-field">
            <label className="form-label">Mood</label>
            <ComboBox
              value={form.mood}
              onChange={(v) => set('mood', v)}
              options={moods || []}
              placeholder="e.g. Dark"
            />
          </div>
        </div>

        <div className="form-field" style={{ maxWidth: '50%' }}>
          <label className="form-label">BPM</label>
          <input
            className="form-input"
            type="number"
            min={40}
            max={300}
            value={form.bpm}
            onChange={(e) => set('bpm', e.target.value)}
            placeholder="e.g. 120"
          />
        </div>

        <div className="form-field">
          <label className="form-label">Tags</label>
          <TagInput tags={form.tags} onChange={(t) => set('tags', t)} />
          <span className="form-hint">Type + press Enter or comma to add</span>
        </div>

      </div>

      <div className="modal-footer">
        <button className="btn-ghost" onClick={onClose}>Cancel</button>
        <button className="btn-primary" onClick={handleSubmit} disabled={!canSave}>
          {isAdd ? 'Save Prompt' : 'Save Changes'}
        </button>
      </div>
    </ModalOverlay>
  );
}
