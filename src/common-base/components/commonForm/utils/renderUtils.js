export function renderOptionLabel({ row, options = [], field }, defaultValue) {
  const item = options.find(
    (v) => {
      let value;
      if (v.value !== undefined || v.value !== null) {
        value = v.value;
      } else if (v.c !== undefined || v.c !== null) {
        value = v.c;
      } else if (v.id !== undefined || v.id !== null) {
        value = v.id;
      }
      if (value === undefined) {
        return false;
      }
      return String(value) === String(row[field]);
    }
  );
  if (item) {
    return item.label || item.n || item.name;
  }
  return defaultValue || '';
}

export default { renderOptionLabel };
