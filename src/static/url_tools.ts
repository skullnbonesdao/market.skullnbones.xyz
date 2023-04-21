export function open_url(url: string) {
  window.open(
    url,
    "_blank" // <- This is what makes it open in a new window.
  );
}
