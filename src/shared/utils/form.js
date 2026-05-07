export function formToObject(form) {
  return Object.fromEntries(new FormData(form).entries());
}
