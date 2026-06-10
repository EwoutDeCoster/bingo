'use client';

import React, { useState, useEffect } from 'react';
import { defaultBingoItems, BingoItem } from '../constants/defaultItems';
import BingoBoard from '../components/BingoBoard';
import SettingsPanel from '../components/SettingsPanel';
import CardImportExport from '../components/CardImportExport';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  
  // Game state
  const [items, setItems] = useState<BingoItem[]>([]);
  const [checked, setChecked] = useState<string[]>([]);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // 1. Initial Mount: Load local storage
  useEffect(() => {
    setMounted(true);

    const localItems = localStorage.getItem('bingo_items');
    const localChecked = localStorage.getItem('bingo_checked');

    let initialItems = defaultBingoItems;
    let initialChecked: string[] = [];

    if (localItems) {
      try {
        initialItems = JSON.parse(localItems);
      } catch (e) {
        console.error('Failed parsing items from localstorage');
      }
    }
    if (localChecked) {
      try {
        initialChecked = JSON.parse(localChecked);
      } catch (e) {
        console.error('Failed parsing checked items');
      }
    }

    setItems(initialItems);
    setChecked(initialChecked);
  }, []);

  // Helper to update state locally & save to localStorage
  const saveStateLocally = (newItems: BingoItem[], newChecked: string[]) => {
    setItems(newItems);
    setChecked(newChecked);
    localStorage.setItem('bingo_items', JSON.stringify(newItems));
    localStorage.setItem('bingo_checked', JSON.stringify(newChecked));
  };

  // CRUD Handlers
  const handleToggleCell = (id: string) => {
    let newChecked: string[];
    if (checked.includes(id)) {
      newChecked = checked.filter(cId => cId !== id);
    } else {
      newChecked = [...checked, id];
    }
    saveStateLocally(items, newChecked);
  };

  const handleAddItem = (text: string) => {
    const newItem: BingoItem = {
      id: Math.random().toString(36).substring(2, 9),
      text,
      active: true
    };
    const newItems = [...items, newItem];
    saveStateLocally(newItems, checked);
  };

  const handleUpdateItem = (id: string, text: string, active: boolean) => {
    const newItems = items.map(item => 
      item.id === id ? { ...item, text, active } : item
    );
    
    let newChecked = [...checked];
    if (!active && checked.includes(id)) {
      newChecked = checked.filter(cId => cId !== id);
    }
    
    saveStateLocally(newItems, newChecked);
  };

  const handleDeleteItem = (id: string) => {
    const newItems = items.filter(item => item.id !== id);
    const newChecked = checked.filter(cId => cId !== id);
    saveStateLocally(newItems, newChecked);
  };

  const handleResetDefaults = () => {
    if (confirm('Weet je zeker dat je alle items wilt resetten naar de standaardlijst?')) {
      saveStateLocally(defaultBingoItems, []);
    }
  };

  const handleImportState = (importedItems: BingoItem[], importedChecked: string[]) => {
    saveStateLocally(importedItems, importedChecked);
  };

  if (!mounted) {
    return (
      <div className="loading-viewport">
        <div className="spinner"></div>
        <p>Laden...</p>
      </div>
    );
  }

  return (
    <main className="app-container">
      {/* Floating Settings Trigger Button */}
      <button 
        onClick={() => setShowSettingsModal(true)} 
        className="floating-settings-btn"
        type="button"
        title="Instellingen en beheer"
      >
        Instellingen
      </button>

      {/* Full-width Bingo Board */}
      <section className="board-section-full">
        <BingoBoard 
          items={items} 
          checked={checked} 
          onToggleCell={handleToggleCell} 
        />
      </section>

      {/* Settings Modal Dialog Overlay */}
      {showSettingsModal && (
        <div className="modal-overlay" onClick={() => setShowSettingsModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">Instellingen</h2>
              <button 
                onClick={() => setShowSettingsModal(false)} 
                className="modal-close-btn"
                type="button"
              >
                ✕
              </button>
            </div>
            
            <div className="modal-body">
              <CardImportExport
                items={items}
                checked={checked}
                onImportState={handleImportState}
              />
              <div className="modal-divider" />
              <SettingsPanel
                items={items}
                onAddItem={handleAddItem}
                onUpdateItem={handleUpdateItem}
                onDeleteItem={handleDeleteItem}
                onResetDefaults={handleResetDefaults}
              />
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
