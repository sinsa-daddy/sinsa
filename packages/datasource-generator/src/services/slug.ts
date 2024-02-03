import slug from 'slug';

const cache = new Map<string, number>();
const removeRegexp = /[.]/g; // for "No. 33"

export function toSlug(val: string) {
  const result = slug(val, { mode: 'rfc3986', remove: removeRegexp });
  let finalResult = result;

  const cacheCount = cache.get(result);

  // hit cache
  if (typeof cacheCount === 'number') {
    const newCount = cacheCount + 1;
    cache.set(result, newCount);
    finalResult = `${result}-${newCount}`;
  } else {
    cache.set(result, 0);
  }

  return finalResult;
}
