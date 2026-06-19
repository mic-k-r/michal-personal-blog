import { login } from './actions'

export const metadata = { title: 'Sign in' }

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams

  return (
    <div style={{ maxWidth: 360 }}>
      <h2>Sign in</h2>
      <p className="muted">Admin access only.</p>

      {error && <p className="error">{error}</p>}

      <form action={login} className="stack">
        <div className="field">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required autoComplete="email" />
        </div>
        <div className="field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
          />
        </div>
        <button type="submit" className="btn">Sign in</button>
      </form>
    </div>
  )
}
