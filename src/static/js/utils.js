export function formatEmpty(str, format = '--') {
  if (str === null || str === undefined || str === '') {
    return format;
  }
  return str;
}