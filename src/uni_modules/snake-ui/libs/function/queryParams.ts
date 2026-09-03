export function getQueryParams(url: string): Record<string, string> {
  const query = url.split('?')[1]?.split('#')[0] || '';
  return query.split('&').reduce<Record<string, string>>((result, part) => {
    if (!part) return result;
    const [key, value = ''] = part.split('=');
    result[decodeURIComponent(key.replace(/\+/g, ' '))] = decodeURIComponent(value.replace(/\+/g, ' '));
    return result;
  }, {});
}

export { getQueryParams as queryParams };
