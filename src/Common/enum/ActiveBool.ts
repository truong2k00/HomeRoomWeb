export function getActivesBool(active: boolean) {
  if (active)
    return { color: 'success', text: 'Active' }
  else return { color: 'error', text: 'Inactive' }
}
