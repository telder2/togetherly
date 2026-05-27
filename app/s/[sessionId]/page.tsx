'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { Loader2 } from 'lucide-react';

export default function SessionRouter() {
  const params = useParams<{ sessionId: string }>();
  const router = useRouter();

  useEffect(() => {
    const redirect = async () => {
      const { data: session } = await supabase
        .from('sessions')
        .select('id, status')
        .eq('id', params.sessionId)
        .single();

      if (!session) { router.push('/'); return; }

      switch (session.status) {
        case 'lobby': router.push(`/s/${session.id}/lobby`); break;
        case 'playing': router.push(`/s/${session.id}/play`); break;
        case 'revealed':
        case 'ended': router.push(`/s/${session.id}/reveal`); break;
        default: router.push('/');
      }
    };
    redirect();
  }, [params.sessionId, router]);

  return (
    <main className="flex items-center justify-center min-h-screen">
      <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
    </main>
  );
}
