import { SignUp } from "@clerk/nextjs";

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
      <div className="w-full max-w-md">
        <SignUp 
          appearance={{
            elements: {
              formButtonPrimary: 
                'bg-purple-600 hover:bg-purple-700 text-sm normal-case',
            },
          }}
          routing="path"
          path="/signup"
          signInUrl="/login"
          afterSignUpUrl="/client/dashboard"
        />
      </div>
    </div>
  );
}
