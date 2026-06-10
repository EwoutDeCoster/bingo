'use client';

import React, { useState } from 'react';
import { BingoItem } from '../constants/defaultItems';

interface SettingsPanelProps {
  items: BingoItem[];
  onAddItem: (text: string) => void;
  onUpdateItem: (id: string, text: string, active: boolean) => void;
  onDeleteItem: (id: string) => void;
  onResetDefaults: () => void;
}

export default function SettingsPanel({
  items,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  onResetDefaults
}: SettingsPanelProps) {
  const [newItemText, setNewItemText] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItemText.trim()) {
      onAddItem(newItemText.trim());
      setNewItemText('');
    }
  };

  const startEditing = (item: BingoItem) => {
    setEditingId(item.id);
    setEditingText(item.text);
  };

  const saveEdit = (id: string, active: boolean) => {
    if (editingText.trim()) {
      onUpdateItem(id, editingText.trim(), active);
    }
    setEditingId(null);
  };

  const activeItemsCount = items.filter(i => i.active).length;

  const getGridDetails = (count: number) => {
    if (count <= 0) return 'Voeg actieve items toe';
    const cols = Math.ceil(Math.sqrt(count));
    const rows = Math.ceil(count / cols);
    const emptyCells = cols * rows - count;
    return `${count} actief (${cols}x${rows} grid${emptyCells > 0 ? `, ${emptyCells} leeg` : ''})`;
  };

  return (
    <div className="settings-panel">
      <h3 className="section-title">Kaart Instellingen</h3>
      
      <div className="grid-summary-badge">
        Grid indeling: <strong>{getGridDetails(activeItemsCount)}</strong>
      </div>

      <form onSubmit={handleAdd} className="add-item-form">
        <input
          type="text"
          placeholder="Nieuw grappig voorval..."
          value={newItemText}
          onChange={(e) => setNewItemText(e.target.value)}
          className="modern-input"
          maxLength={100}
          required
        />
        <button type="submit" className="modern-btn btn-primary">
          Toevoegen
        </button>
      </form>

      <div className="items-list-container">
        {items.length === 0 ? (
          <p className="no-items-text">Geen items. Herstel de standaardlijst of voeg er zelf een toe.</p>
        ) : (
          <ul className="items-list">
            {items.map((item) => (
              <li key={item.id} className={`item-row ${item.active ? 'active-row' : 'inactive-row'}`}>
                <input
                  type="checkbox"
                  checked={item.active}
                  onChange={(e) => onUpdateItem(item.id, item.text, e.target.checked)}
                  className="modern-checkbox"
                  title="Activeer/deactiveer item"
                />

                <div className="item-text-container">
                  {editingId === item.id ? (
                    <input
                      type="text"
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      onBlur={() => saveEdit(item.id, item.active)}
                      onKeyDown={(e) => e.key === 'Enter' && saveEdit(item.id, item.active)}
                      className="modern-input-inline"
                      autoFocus
                    />
                  ) : (
                    <span 
                      onClick={() => startEditing(item)} 
                      className={`item-text-label ${!item.active ? 'text-strike' : ''}`}
                      title="Klik om te bewerken"
                    >
                      {item.text}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => onDeleteItem(item.id)}
                  className="modern-btn-icon btn-danger-icon"
                  title="Verwijderen"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="settings-footer">
        <button onClick={onResetDefaults} className="modern-btn btn-secondary reset-btn">
          Herstel standaard items
        </button>
      </div>
    </div>
  );
}
