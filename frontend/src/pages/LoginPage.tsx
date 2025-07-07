import { SignIn } from "@clerk/clerk-react";

export default function LoginPage() {
  return (
    <div className="w-full h-[90vh] flex justify-center items-center">
      <SignIn signUpUrl="/register" />
    </div>
  )
}
