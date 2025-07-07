import { SignUp } from "@clerk/clerk-react";

export default function RegisterPage() {
  return (
    <div className="w-full h-[90vh] flex justify-center items-center">
      <SignUp signInUrl="/login" />
    </div>
  )
}
