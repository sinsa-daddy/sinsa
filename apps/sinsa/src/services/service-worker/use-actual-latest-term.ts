import type { TermType } from '@sinsa/schema';
import { TermSchema } from '@sinsa/schema';
import { useEffect, useState } from 'react';
import { isCurrentlyUnderway } from '@/models/terms';

export function useActualLatestTerm() {
  const [actualLatestTerm, setActualLatestTerm] = useState<TermType>();

  useEffect(() => {
    const run = async () => {
      if (window.__TERMS_UPDATE_PROMISE__ instanceof Promise) {
        const payload = await window.__TERMS_UPDATE_PROMISE__;

        if (Array.isArray(payload?.terms)) {
          const actualLatestTerm = payload.terms
            .map(mayBeTerm => TermSchema.parse(mayBeTerm))
            .find(term => isCurrentlyUnderway(term));

          if (typeof actualLatestTerm?.term === 'number') {
            setActualLatestTerm(actualLatestTerm);
          }
        }
      }
    };

    run();
  }, []);

  return actualLatestTerm;
}
