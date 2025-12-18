import React, { useState, useEffect } from 'react';
import {
  getUserHouseholds,
  createHousehold,
  joinHousehold,
  type Household,
} from '../services/household';
import { useAuth } from '../contexts/AuthContext';

interface HouseholdSelectorProps {
  currentHouseholdId: string | null;
  onSelectHousehold: (householdId: string) => void;
}

export const HouseholdSelector: React.FC<HouseholdSelectorProps> = ({
  currentHouseholdId,
  onSelectHousehold,
}) => {
  const { user } = useAuth();
  const [households, setHouseholds] = useState<Household[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'join'>('create');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Form state
  const [householdName, setHouseholdName] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [displayName, setDisplayName] = useState('');

  useEffect(() => {
    if (user) {
      loadHouseholds();
    }
  }, [user]);

  const loadHouseholds = async () => {
    const { households: data, error } = await getUserHouseholds();
    if (!error && data) {
      setHouseholds(data);
      // Auto-select first household if none selected
      if (!currentHouseholdId && data.length > 0) {
        onSelectHousehold(data[0].id);
      }
    }
  };

  const handleCreateHousehold = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { household, error } = await createHousehold(householdName);

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    if (household) {
      setHouseholds([household, ...households]);
      onSelectHousehold(household.id);
      setShowModal(false);
      setHouseholdName('');
    }
    setLoading(false);
  };

  const handleJoinHousehold = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const name = displayName || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Member';
    const { success, error } = await joinHousehold(inviteCode, name);

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    if (success) {
      await loadHouseholds();
      setShowModal(false);
      setInviteCode('');
      setDisplayName('');
    }
    setLoading(false);
  };

  const currentHousehold = households.find(h => h.id === currentHouseholdId);

  return (
    <>
      <div className="glass p-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span style={{ fontSize: '1.2rem' }}>🏠</span>
          <select
            value={currentHouseholdId || ''}
            onChange={(e) => onSelectHousehold(e.target.value)}
            className="bg-transparent border-none text-lg font-semibold cursor-pointer"
            style={{ outline: 'none' }}
          >
            {households.length === 0 && (
              <option value="">No Households</option>
            )}
            {households.map((household) => (
              <option key={household.id} value={household.id}>
                {household.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-2">
          {currentHousehold && (
            <button
              className="btn-small"
              onClick={() => {
                navigator.clipboard.writeText(currentHousehold.invite_code);
                alert(`Invite code copied: ${currentHousehold.invite_code}`);
              }}
              title="Copy invite code"
            >
              📋 Invite
            </button>
          )}
          <button
            className="btn-primary btn-small"
            onClick={() => {
              setModalMode('create');
              setShowModal(true);
              setError('');
            }}
          >
            + New
          </button>
          <button
            className="btn btn-small"
            onClick={() => {
              setModalMode('join');
              setShowModal(true);
              setError('');
            }}
          >
            Join
          </button>
        </div>
      </div>

      {showModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => setShowModal(false)}
        >
          <div
            className="glass p-4"
            style={{ maxWidth: '400px', width: '90%', margin: '1rem' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem' }}>
              {modalMode === 'create' ? '🏡 Create Household' : '🚪 Join Household'}
            </h2>

            <form
              onSubmit={modalMode === 'create' ? handleCreateHousehold : handleJoinHousehold}
              className="flex flex-col gap-2"
            >
              {modalMode === 'create' ? (
                <input
                  type="text"
                  placeholder="Household name (e.g., Smith Family)"
                  value={householdName}
                  onChange={(e) => setHouseholdName(e.target.value)}
                  required
                  disabled={loading}
                  autoFocus
                />
              ) : (
                <>
                  <input
                    type="text"
                    placeholder="Invite code"
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value)}
                    required
                    disabled={loading}
                    autoFocus
                  />
                  <input
                    type="text"
                    placeholder="Your display name"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    disabled={loading}
                  />
                </>
              )}

              {error && (
                <div
                  style={{
                    padding: '0.75rem',
                    backgroundColor: 'rgba(239, 68, 68, 0.2)',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    color: '#ef4444',
                  }}
                >
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="btn btn-success"
                disabled={loading}
                style={{ width: '100%', marginTop: '0.5rem' }}
              >
                {loading ? '...' : modalMode === 'create' ? 'Create' : 'Join'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
