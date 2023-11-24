export function fetcher(url: string) {
  return fetch(url)
    .then(r => {
      return new Promise<Response>(resolve => {
        window.setTimeout(() => resolve(r), 1000);
      });
    })
    .then(r => r.json());
}
