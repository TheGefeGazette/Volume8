import { updatePassword } from "./actions";

type ResetPasswordPageProps = {
    searchParams: Promise<{
        error?: string;
    }>;
};

export default async function ResetPasswordPage({
    searchParams,
}: ResetPasswordPageProps) {
    const { error } = await searchParams;

    return (
        <div className="login-card">
            <p className="eyebrow">Authorized Personnel Only</p>
            <h1>Choose A New Password</h1>

            <p>
                Enter a new password for your Gazette Offices account.
            </p>

            <form action={updatePassword}>
                <label>
                    New Password
                    <input
                        type="password"
                        name="password"
                        placeholder="••••••••••••"
                        required
                    />
                </label>

                <label>
                    Confirm New Password
                    <input
                        type="password"
                        name="confirmPassword"
                        placeholder="••••••••••••"
                        required
                    />
                </label>

                {error ? <p role="alert">{error}</p> : null}

                <button type="submit">
                    Set New Password
                </button>
            </form>

            <small>Private editorial access only.</small>
        </div>
    );
}