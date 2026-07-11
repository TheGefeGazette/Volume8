export default function LoginPage() {
  return (
    <div className="login-card">
      <p className="eyebrow">Authorized Personnel Only</p>
      <h1>Enter The Gazette Offices</h1>
      <p>
        This clean-start deployment verifies the interface first. Supabase
        authentication will be connected in the next step.
      </p>

      <form>
        <label>
          Email
          <input type="email" placeholder="editor@gefegazette.com" disabled />
        </label>
        <label>
          Password
          <input type="password" placeholder="••••••••••••" disabled />
        </label>
        <button type="button" disabled>
          Open the Offices
        </button>
      </form>

      <small>No environment variables are required for this deployment.</small>
    </div>
  );
}
