import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="auth-page">
      <SignUp appearance={{
        elements: {
          rootBox: "clerk-root",
          card: "clerk-card",
        }
      }} />
    </div>
  );
}
