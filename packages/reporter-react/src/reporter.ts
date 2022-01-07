import type { CurrentForm, Obj } from '@felte/common';
import type { ExtenderHandler } from '@felte/common';
import { errorStores, warningStores } from './stores';
import { createId } from './utils';

export function reporter<Data extends Obj>(
  currentForm: CurrentForm<Data>
): ExtenderHandler<Data> {
  const config = currentForm.config;
  if (!config.__felteReporterReactId) {
    const id = createId(21);
    config.__felteReporterReactId = id;
    errorStores[id] = currentForm.errors;
    warningStores[id] = currentForm.warnings;
  }
  if (!currentForm.form) return {};
  if (!currentForm.form.hasAttribute('data-felte-reporter-react-id')) {
    currentForm.form.dataset.felteReporterReactId = config.__felteReporterReactId as string;
  }
  return {
    onSubmitError() {
      const firstInvalidElement = currentForm?.form?.querySelector(
        '[data-felte-validation-message]'
      ) as HTMLElement;
      firstInvalidElement?.focus();
    },
  };
}