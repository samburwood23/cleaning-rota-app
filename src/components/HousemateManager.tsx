import React, { useState } from 'react';
import { Housemate } from '../types';
import { AVATAR_COLORS } from '../utils/defaults';

interface HousemateManagerProps {
  housemates: Housemate[];
  onAddHousemate: (housemate: Housemate) => void;
  onRemoveHousemate: (id: string) => void;
}

export const HousemateManager: React.FC<HousemateManagerProps> = ({
  housemates,
  onAddHousemate,
  onRemoveHousemate,
}) => {
  const [newName, setNewName] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim()) {
      const newHousemate: Housemate = {
        id: `housemate-${Date.now()}`,
        name: newName.trim(),
        color: AVATAR_COLORS[housemates.length % AVATAR_COLORS.length],
      };
      onAddHousemate(newHousemate);
      setNewName('');
      setShowForm(false);
    }
  };

  return (
    <div className="glass p-4 fade-in">
      <div className="flex justify-between items-center mb-3">
        <h2 style={{ fontSize: '1.5rem', fontWeight: '700' }}>
          🏠 Housemates
        </h2>
        <button
          className="btn-primary btn-small"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : '+ Add'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-3">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter name..."
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="flex-1"
              autoFocus
            />
            <button type="submit" className="btn btn-success">
              Add
            </button>
          </div>
        </form>
      )}

      <div className="flex flex-col gap-2">
        {housemates.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '1rem' }}>
            No housemates yet. Add someone to get started!
          </p>
        ) : (
          housemates.map((housemate) => (
            <div
              key={housemate.id}
              className="glass p-3 flex items-center justify-between slide-in"
              style={{ minHeight: '60px' }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="rounded-full"
                  style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: housemate.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '1.2rem',
                  }}
                >
                  {housemate.name[0].toUpperCase()}
                </div>
                <span style={{ fontWeight: '600', fontSize: '1rem' }}>
                  {housemate.name}
                </span>
              </div>
              <button
                className="btn btn-danger btn-small"
                onClick={() => {
                  if (confirm(`Remove ${housemate.name}?`)) {
                    onRemoveHousemate(housemate.id);
                  }
                }}
              >
                Remove
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
