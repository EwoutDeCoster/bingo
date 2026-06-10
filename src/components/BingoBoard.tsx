'use client';

import React, { useEffect, useRef } from 'react';
import { BingoItem } from '../constants/defaultItems';
import ConfettiEffect from './ConfettiEffect';

interface BingoBoardProps {
  items: BingoItem[];
  checked: string[];
  onToggleCell: (id: string) => void;
}

export default function BingoBoard({ items, checked, onToggleCell }: BingoBoardProps) {
  const activeItems = items.filter(item => item.active);
  const count = activeItems.length;

  const wasBingoRef = useRef(false);

  // 1. Calculate optimal rows and columns
  const cols = count > 0 ? Math.ceil(Math.sqrt(count)) : 0;
  const rows = count > 0 ? Math.ceil(count / cols) : 0;
  const totalCells = rows * cols;

  interface GridCell {
    type: 'item' | 'free';
    id: string;
    text: string;
    isChecked: boolean;
  }

  const gridCells: GridCell[] = [];
  for (let i = 0; i < totalCells; i++) {
    if (i < count) {
      const item = activeItems[i];
      gridCells.push({
        type: 'item',
        id: item.id,
        text: item.text,
        isChecked: checked.includes(item.id)
      });
    } else {
      gridCells.push({
        type: 'free',
        id: `free-${i}`,
        text: 'VRIJ VAKJE',
        isChecked: true
      });
    }
  }

  // 2. Calculate winning lines
  const getWinningLines = () => {
    const winningIndices = new Set<number>();
    let hasBingo = false;

    if (totalCells === 0) return { hasBingo, winningIndices };

    // Check rows
    for (let r = 0; r < rows; r++) {
      const rowIndices: number[] = [];
      let rowComplete = true;
      for (let c = 0; c < cols; c++) {
        const idx = r * cols + c;
        rowIndices.push(idx);
        if (!gridCells[idx]?.isChecked) {
          rowComplete = false;
        }
      }
      if (rowComplete && rowIndices.length > 0) {
        rowIndices.forEach(idx => winningIndices.add(idx));
        hasBingo = true;
      }
    }

    // Check columns
    for (let c = 0; c < cols; c++) {
      const colIndices: number[] = [];
      let colComplete = true;
      for (let r = 0; r < rows; r++) {
        const idx = r * cols + c;
        colIndices.push(idx);
        if (!gridCells[idx]?.isChecked) {
          colComplete = false;
        }
      }
      if (colComplete && colIndices.length > 0) {
        colIndices.forEach(idx => winningIndices.add(idx));
        hasBingo = true;
      }
    }

    // Check diagonals (only if square)
    if (rows === cols && rows > 1) {
      // Main diagonal
      const diag1Indices: number[] = [];
      let diag1Complete = true;
      for (let i = 0; i < cols; i++) {
        const idx = i * cols + i;
        diag1Indices.push(idx);
        if (!gridCells[idx]?.isChecked) {
          diag1Complete = false;
        }
      }
      if (diag1Complete) {
        diag1Indices.forEach(idx => winningIndices.add(idx));
        hasBingo = true;
      }

      // Anti diagonal
      const diag2Indices: number[] = [];
      let diag2Complete = true;
      for (let i = 0; i < cols; i++) {
        const idx = i * cols + (cols - 1 - i);
        diag2Indices.push(idx);
        if (!gridCells[idx]?.isChecked) {
          diag2Complete = false;
        }
      }
      if (diag2Complete) {
        diag2Indices.forEach(idx => winningIndices.add(idx));
        hasBingo = true;
      }
    }

    return { hasBingo, winningIndices };
  };

  const { hasBingo, winningIndices } = getWinningLines();

  useEffect(() => {
    if (hasBingo && !wasBingoRef.current) {
      wasBingoRef.current = true;
      playBingoSound();
    } else if (!hasBingo) {
      wasBingoRef.current = false;
    }
  }, [hasBingo]);

  const playBingoSound = () => {
    if (typeof window === 'undefined') return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      
      const notes = [261.63, 329.63, 392.00, 523.25];
      notes.forEach((freq, idx) => {
        setTimeout(() => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, ctx.currentTime);
          
          gain.gain.setValueAtTime(0.08, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + 0.3);
          
          osc.connect(gain);
          gain.connect(ctx.destination);
          
          osc.start();
          osc.stop(ctx.currentTime + 0.3);
        }, idx * 100);
      });
    } catch (err) {
      console.error('Failed to play audio:', err);
    }
  };

  if (count === 0) {
    return (
      <div className="empty-board-message">
        <h3>Geen actieve items</h3>
        <p>Activeer of voeg items toe in het instellingenpaneel om je Bingo kaart te genereren.</p>
      </div>
    );
  }

  return (
    <div className="bingo-board-wrapper">
      <ConfettiEffect active={hasBingo} />

      {hasBingo && (
        <div className="bingo-alert-banner">
          BINGO
        </div>
      )}

      <div
        className="bingo-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
          gap: '8px',
          height: '100%'
        }}
      >
        {gridCells.map((cell, index) => {
          const isWinning = winningIndices.has(index);
          const cellClasses = [
            'bingo-cell',
            cell.type === 'free' ? 'cell-free' : '',
            cell.isChecked ? 'cell-checked' : '',
            isWinning ? 'cell-winning' : ''
          ].filter(Boolean).join(' ');

          // Apply dynamic font sizes based on text character length
          const isLong = cell.text.length > 25;
          const isExtraLong = cell.text.length > 45;
          const textClasses = [
            'cell-text',
            isExtraLong ? 'cell-text-xs' : isLong ? 'cell-text-sm' : 'cell-text-md'
          ].join(' ');

          return (
            <button
              key={cell.id}
              onClick={() => cell.type === 'item' && onToggleCell(cell.id)}
              disabled={cell.type === 'free'}
              className={cellClasses}
              type="button"
            >
              <span className={textClasses}>{cell.text}</span>
              {cell.isChecked && cell.type === 'item' && (
                <div className="cell-check-indicator">✓</div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
