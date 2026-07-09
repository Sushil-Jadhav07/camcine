export function isContentFree(content = {}) {
  return content.is_free === true || content.isFree === true;
}

export function getAccessLabel(content = {}) {
  return isContentFree(content) ? 'Free' : 'Premium';
}

export function getAccessBadgeClass(content = {}) {
  return isContentFree(content)
    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30'
    : 'bg-[var(--accent)] text-white';
}
