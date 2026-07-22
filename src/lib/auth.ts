const STORAGE_KEY = 'dedran_users'
const SESSION_KEY = 'dedran_session'

interface StoredUser {
  id: string
  name: string
  email: string
  password: string
  createdAt: string
}

interface Session {
  userId: string
  name: string
  email: string
}

function getUsers(): StoredUser[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

function saveUsers(users: StoredUser[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users))
}

export function getSession(): Session | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function saveSession(session: Session) {
  localStorage.setItem(SESSION_KEY, JSON.stringify(session))
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY)
}

export function signUp(name: string, email: string, password: string): { error?: string } {
  const users = getUsers()

  if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
    return { error: 'An account with this email already exists' }
  }

  const newUser: StoredUser = {
    id: crypto.randomUUID(),
    name,
    email: email.toLowerCase(),
    password,
    createdAt: new Date().toISOString(),
  }

  users.push(newUser)
  saveUsers(users)

  saveSession({ userId: newUser.id, name: newUser.name, email: newUser.email })

  return {}
}

export function signIn(email: string, password: string): { error?: string } {
  const users = getUsers()
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase())

  if (!user) {
    return { error: 'No account found with this email' }
  }

  if (user.password !== password) {
    return { error: 'Invalid password' }
  }

  saveSession({ userId: user.id, name: user.name, email: user.email })

  return {}
}

export function signOut() {
  clearSession()
}
