const STORAGE_KEY = 'guestContacts';
const CONTACT_CACHE_KEY = 'contactsCache';

function readContacts() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

function getContacts() {
  return readContacts();
}

function addContact(contact) {
  const contacts = [...readContacts(), { id: `${Date.now()}-${Math.random()}`, imageUrl: '/images/default.jpg', ...contact }];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
  return contacts;
}

function updateContact(id, changes) {
  const contacts = readContacts().map((contact) => contact.id === id ? { ...contact, ...changes } : contact);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
  return contacts;
}

function deleteContact(id) {
  const contacts = readContacts().filter((contact) => contact.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(contacts));
  return contacts;
}

function clearContacts() {
  localStorage.removeItem(STORAGE_KEY);
}

function getCachedContacts() {
  try { return JSON.parse(localStorage.getItem(CONTACT_CACHE_KEY) || '[]'); } catch { return []; }
}

function cacheContacts(contacts) {
  localStorage.setItem(CONTACT_CACHE_KEY, JSON.stringify(contacts));
}

export { getContacts, addContact, updateContact, deleteContact, clearContacts, getCachedContacts, cacheContacts };
