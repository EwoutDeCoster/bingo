'use client';

import React, { useState, useRef } from 'react';
import { BingoItem } from '../constants/defaultItems';

interface CardImportExportProps {
  items: BingoItem[];
  checked: string[];
  onImportState: (items: BingoItem[], checked: string[]) => void;
}

export default function CardImportExport({
  items,
  checked,
  onImportState
}: CardImportExportProps) {
  const [jsonText, setJsonText] = useState('');
  const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const showMessage = (text: string, isError: boolean = false) => {
    setMessage({ text, isError });
    setTimeout(() => setMessage(null), 3000);
  };

  const getExportData = () => {
    return JSON.stringify({ items, checked }, null, 2);
  };

  const handleCopy = () => {
    const data = getExportData();
    navigator.clipboard.writeText(data).then(() => {
      showMessage('JSON gekopieerd naar klembord');
    }).catch(() => {
      showMessage('Kopiëren mislukt', true);
    });
  };

  const handleDownload = () => {
    try {
      const data = getExportData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `bingo-kaart-${Date.now()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showMessage('Bestand gedownload');
    } catch (e) {
      showMessage('Download mislukt', true);
    }
  };

  const validateAndImport = (text: string) => {
    try {
      const parsed = JSON.parse(text);
      if (!parsed || typeof parsed !== 'object') {
        throw new Error('Geen geldig object');
      }
      
      const importedItems = parsed.items;
      const importedChecked = parsed.checked || [];

      if (!Array.isArray(importedItems)) {
        throw new Error('Items veld moet een lijst zijn');
      }

      // Basic validation of item objects
      const isValid = importedItems.every(item => 
        item && 
        typeof item === 'object' && 
        typeof item.id === 'string' && 
        typeof item.text === 'string' && 
        typeof item.active === 'boolean'
      );

      if (!isValid) {
        throw new Error('Ongeldige items structuur');
      }

      if (!Array.isArray(importedChecked) || !importedChecked.every(id => typeof id === 'string')) {
        throw new Error('Checked veld moet een lijst van strings zijn');
      }

      onImportState(importedItems, importedChecked);
      setJsonText('');
      if (fileInputRef.current) fileInputRef.current.value = '';
      showMessage('Kaart succesvol geïmporteerd');
    } catch (e: any) {
      showMessage(`Import mislukt: ${e.message || 'Ongeldige JSON'}`, true);
    }
  };

  const handlePasteImport = (e: React.FormEvent) => {
    e.preventDefault();
    if (jsonText.trim()) {
      validateAndImport(jsonText.trim());
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result;
      if (typeof text === 'string') {
        validateAndImport(text);
      }
    };
    reader.onerror = () => {
      showMessage('Fout bij het lezen van het bestand', true);
    };
    reader.readAsText(file);
  };

  return (
    <div className="import-export-container">
      <h3 className="section-title">Delen en Back-up</h3>

      {message && (
        <div className={`status-badge ${message.isError ? 'badge-error' : 'badge-success'}`}>
          {message.text}
        </div>
      )}

      {/* Export Section */}
      <div className="share-section">
        <h4 className="subsection-title">Kaart exporteren</h4>
        <div className="button-row">
          <button onClick={handleCopy} className="modern-btn btn-secondary">
            Kopieer JSON
          </button>
          <button onClick={handleDownload} className="modern-btn btn-primary">
            Download JSON
          </button>
        </div>
      </div>

      {/* Import Section */}
      <div className="share-section">
        <h4 className="subsection-title">Kaart importeren</h4>
        
        {/* File Upload */}
        <div className="file-upload-wrapper">
          <label className="file-upload-label">
            Upload JSON bestand
            <input
              type="file"
              accept=".json"
              onChange={handleFileChange}
              ref={fileInputRef}
              className="hidden-file-input"
            />
          </label>
        </div>

        {/* Text Area Paste */}
        <form onSubmit={handlePasteImport} className="paste-import-form">
          <textarea
            placeholder="Plak JSON tekst hier om te importeren..."
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            className="modern-textarea"
            rows={3}
          />
          <button type="submit" className="modern-btn btn-secondary" disabled={!jsonText.trim()}>
            Importeer tekst
          </button>
        </form>
      </div>
    </div>
  );
}
