// Small helper that asks the server for templates (ready-made messages).
// type = 'quote' or 'invoice'. Throws an error if the server says no or is down.
export async function getTemplates(type) {
  const res = await fetch('/api/templates?type=' + type)
  if (!res.ok) throw new Error('Server answered with status ' + res.status)
  return res.json()
}