// Small utility functions used by tests

function slugifyName(name) {
  if (!name) return '';
  return String(name).toLowerCase().replace(/\s+/g, '');
}

module.exports = { slugifyName };
