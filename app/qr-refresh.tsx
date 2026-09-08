'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export function QrRefreshButton() {
  const [userId, setUserId] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [working, setWorking] = useState(false);

  useEffect(() => {
    let active = true;
    void supabase.auth.getUser().then(({ data }) => { if (active) setUserId(data.user?.id ?? null); });
    const { data } = supabase.auth.onAuthStateChange((_event, session) => setUserId(session?.user?.id ?? null));
    return () => { active = false; data.subscription.unsubscribe(); };
  }, []);

  useEffect(() => {
    if (!userId) { setStatus(null); setQrCode(null); return; }
    const load = async () => {
      const { data } = await supabase.from('whatsapp_sessions').select('status,qr_code').eq('owner_id', userId).eq('session_name', 'default').maybeSingle();
      setStatus(data?.status ?? null);
      setQrCode(data?.qr_code ?? null);
    };
    void load();
    const channel = supabase.channel('qr-button-' + userId)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'whatsapp_sessions', filter: 'owner_id=eq.' + userId }, (payload) => {
        const row = payload.new as { status?: string; qr_code?: string | null };
        setStatus(row.status ?? null);
        setQrCode(row.qr_code ?? null);
      })
      .subscribe();
    return () => { void supabase.removeChannel(channel); };
  }, [userId]);

  async function refresh() {
    setWorking(true);
    setQrCode(null);
    await supabase.rpc('request_whatsapp_qr');
    setTimeout(() => setWorking(false), 1500);
  }

  if (!userId || status === 'connected') return null;
  if (qrCode) return <aside className="qr-panel" aria-live="polite"><div><strong>Conecte o WhatsApp</strong><p>Abra “Aparelhos conectados” no celular e escaneie este QR.</p></div><img src={qrCode} alt="QR Code para conectar o WhatsApp" /><button className="qr-refresh" onClick={() => void refresh()} disabled={working}>{working ? 'Atualizando…' : '↻ Gerar outro QR'}</button></aside>;
  return <button className="qr-refresh" onClick={() => void refresh()} disabled={working}>{working ? 'Gerando QR...' : '↻ Gerar novo QR Code'}</button>;
}
