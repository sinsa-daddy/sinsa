import { isEqual } from 'lodash-es';
import { FormValues } from '../types';

export function postProcessingFormInitialValues(
  prevFormValues: Partial<FormValues>,
): Partial<FormValues> {
  if (isEqual(prevFormValues.term, [24])) {
    return {
      ...prevFormValues,
      term: [14, 24],
    };
  }
  return prevFormValues;
}
