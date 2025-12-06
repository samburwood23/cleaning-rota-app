import React from 'react';
import { Theme } from '../types';

interface ThemeSwitcherProps {
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
}

const themes: { value: Theme; label: string; emoji: string }[] = [
  { value: 'purple', label: 'Purple Dream', emoji: '💜' },
  { value: 'blue', label: 'Ocean Blue', emoji: '🌊' },
  { value: 'pink', label: 'Pink Sunset', emoji: '🌸' },
  { value: 'green', label: 'Fresh Green', emoji: '🌿' },
  { value: 'sunset', label: 'Orange Sunset', emoji: '🌅' },
];

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({
  currentTheme,
  onThemeChange,
}) => {
  return (
    <div className="glass p-3 fade-in">
      <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '0.75rem' }}>
        🎨 Theme
      </h3>
      <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
        {themes.map((theme) => (
          <button
            key={theme.value}
            className={`btn btn-small ${
              currentTheme === theme.value ? 'btn-primary' : ''
            }`}
            onClick={() => onThemeChange(theme.value)}
            title={theme.label}
          >
            {theme.emoji}
          </button>
        ))}
      </div>
    </div>
  );
};
