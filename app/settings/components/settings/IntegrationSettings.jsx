'use client';

import { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { supabase } from '@/app/components/supabaseClient';

export default function IntegrationSettings({ userId }) {
  const [loading, setLoading] = useState(false);
  const [googleConnected, setGoogleConnected] = useState(false);
  const [outlookConnected, setOutlookConnected] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState('');

  useEffect(() => {
    if (!userId) return;

    async function fetchSettings() {
      setLoading(true);
      const { data, error } = await supabase
        .from('integration_settings')
        .select('google_connected, outlook_connected, webhook_url')
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') {
        toast.error('Failed to load settings');
        console.error(error);
      } else if (data) {
        setGoogleConnected(data.google_connected);
        setOutlookConnected(data.outlook_connected);
        setWebhookUrl(data.webhook_url || '');
      }
      setLoading(false);
    }

    fetchSettings();
  }, [userId]);

  async function handleSave() {
    if (!userId) {
      toast.error('User not found');
      return;
    }
    setLoading(true);

    const updates = {
      user_id: userId,
      google_connected: googleConnected,
      outlook_connected: outlookConnected,
      webhook_url: webhookUrl,
      updated_at: new Date(),
    };

    const { error } = await supabase
      .from('integration_settings')
      .upsert(updates, { onConflict: 'user_id' });

    if (error) {
      toast.error('Failed to save settings');
      console.error(error);
    } else {
      toast.success('Settings saved successfully!');
    }
    setLoading(false);
  }

  return (
    <div
      style={{
        maxWidth: 420,
        margin: '2rem auto',
        padding: 24,
        backgroundColor: '#fff',
        borderRadius: 8,
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: '#333',
      }}
    >
      <h2 style={{ fontSize: 24, marginBottom: 20, fontWeight: '600' }}>
        Integration Settings
      </h2>

      <label
        style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: 16,
          cursor: loading ? 'not-allowed' : 'pointer',
          userSelect: 'none',
        }}
      >
        <input
          type="checkbox"
          checked={googleConnected}
          onChange={() => setGoogleConnected(!googleConnected)}
          disabled={loading}
          style={{ marginRight: 12, width: 18, height: 18 }}
        />
        <span style={{ fontSize: 16 }}>Google Calendar</span>
      </label>

      <label
        style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: 24,
          cursor: loading ? 'not-allowed' : 'pointer',
          userSelect: 'none',
        }}
      >
        <input
          type="checkbox"
          checked={outlookConnected}
          onChange={() => setOutlookConnected(!outlookConnected)}
          disabled={loading}
          style={{ marginRight: 12, width: 18, height: 18 }}
        />
        <span style={{ fontSize: 16 }}>Outlook</span>
      </label>

      <label style={{ display: 'block', marginBottom: 24, fontSize: 16 }}>
        Webhook URL
        <input
          type="text"
          placeholder="https://yourdomain.com/..."
          value={webhookUrl}
          onChange={(e) => setWebhookUrl(e.target.value)}
          disabled={loading}
          style={{
            display: 'block',
            width: '100%',
            padding: '10px 12px',
            marginTop: 8,
            borderRadius: 6,
            border: '1px solid #ccc',
            fontSize: 14,
            boxSizing: 'border-box',
            transition: 'border-color 0.3s',
          }}
          onFocus={(e) => (e.target.style.borderColor = '#4F46E5')}
          onBlur={(e) => (e.target.style.borderColor = '#ccc')}
        />
      </label>

      <button
        onClick={handleSave}
        disabled={loading}
        style={{
          width: '100%',
          backgroundColor: loading ? '#A5B4FC' : '#4F46E5',
          color: '#fff',
          padding: '12px 0',
          fontSize: 16,
          fontWeight: '600',
          border: 'none',
          borderRadius: 6,
          cursor: loading ? 'not-allowed' : 'pointer',
          boxShadow: loading
            ? 'none'
            : '0 4px 12px rgba(79, 70, 229, 0.4)',
          transition: 'background-color 0.3s, box-shadow 0.3s',
        }}
        onMouseEnter={(e) => {
          if (!loading) e.target.style.backgroundColor = '#4338CA';
        }}
        onMouseLeave={(e) => {
          if (!loading) e.target.style.backgroundColor = '#4F46E5';
        }}
      >
        {loading ? 'Saving...' : 'Save'}
      </button>

      <Toaster position="top-right" />
    </div>
  );
}
