import { login, sendPasswordReset } from "./actions";

type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function LoginPage({
  searchParams,
}: LoginPageProps) {
  const { error } = await searchParams;

  return (
    <div className="login-card">
      <p className="eyebrow">Authorized Personnel Only</p>
      <h1>Enter The Gazette Offices</h1>

      <p>
        Sign in to access the private editorial tools for The Gefe Gazette.
      </p>

      <form action={login}>
        <label>
          Email
          <input
            type="email"
            name="email"
            placeholder="editor@gefegazette.com"
            required
          />
        </label>

        <label>
          Password
          <input
            type="password"
            name="password"
            placeholder="••••••••••••"
            required
          />
        </label>

        {error ? <p role="alert">{error}</p> : null}

        <button type="submit">Open the Offices</button>
        
        <button
          type="submit"
          formAction={sendPasswordReset}
          className="office-secondary"
        >
          Forgot Password
        </button>
      </form>

      <small>Private editorial access only.</small>
    </div>
  );
}