import { SignIn } from "@clerk/nextjs";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
      <div className="w-full max-w-md">
        <SignIn 
          appearance={{
            elements: {
              formButtonPrimary: 
                'bg-purple-600 hover:bg-purple-700 text-sm normal-case',
            },
          }}
          routing="path"
          path="/login"
          signUpUrl="/signup"
          afterSignInUrl="/client/dashboard"
        />
      </div>
    </div>
  );
}
