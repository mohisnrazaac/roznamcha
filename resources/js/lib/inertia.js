import { router } from '@inertiajs/react';

export const deleteResource = (url, options = {}) => {
  const { data, ...visitOptions } = options ?? {};

  return router.post(url, data ?? {}, visitOptions);
};
