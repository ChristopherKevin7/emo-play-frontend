import React from 'react';
import { useApp } from '../context/AppContext';
import '../styles/ColorblindToggle.css';

export const ColorblindToggle = ({ variant }) => {
  const { colorblindMode, toggleColorblindMode } = useApp();

  return (
    <label className={`colorblind-toggle${variant ? ` ${variant}` : ''}`} title="Modo para daltônicos">
      <input
        type="checkbox"
        checked={colorblindMode}
        onChange={toggleColorblindMode}
      />
      <span className="toggle-slider"></span>
      <span className="toggle-label">👁 Daltônico</span>
    </label>
  );
};
