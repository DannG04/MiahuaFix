import { useState, useEffect } from 'react';
import { getAnonId, getAnonIdShort, regenerateAnonId } from '@/src/lib/anonId';

type State = {
  id:      string | null;
  idShort: string | null;
  loading: boolean;
};

export function useAnonId() {
  const [state, setState] = useState<State>({ id: null, idShort: null, loading: true });

  useEffect(() => {
    Promise.all([getAnonId(), getAnonIdShort()]).then(([id, idShort]) => {
      setState({ id, idShort, loading: false });
    });
  }, []);

  const regenerate = async () => {
    const id = await regenerateAnonId();
    const idShort = `${id.replace(/-/g, '').slice(0, 4)}-${id.replace(/-/g, '').slice(4, 8)}`;
    setState({ id, idShort, loading: false });
  };

  return { ...state, regenerate };
}
