import { useEffect, useState } from 'react';
import { TermNextSchema, type TermNextType } from '@sinsa/schema';
import { getLatestTerm } from '@/models/terms/helpers/get-latest-term';

export function useActualLatestTerm() {
  const [actualLatestTerm, setActualLatestTerm] = useState<TermNextType>();

  useEffect(() => {
    const run = async () => {
      if (window.__TERMS_UPDATE_PROMISE__ instanceof Promise) {
        const payload = await window.__TERMS_UPDATE_PROMISE__;

        if (Array.isArray(payload?.terms)) {
          const actualLatestTerm = getLatestTerm(
            payload.terms.map(mayBeTerm => TermNextSchema.parse(mayBeTerm)),
          );

          if (typeof actualLatestTerm?.term_id === 'string') {
            setActualLatestTerm(actualLatestTerm);
          }
        }
      }
    };

    run();
  }, []);

  return actualLatestTerm;
}
