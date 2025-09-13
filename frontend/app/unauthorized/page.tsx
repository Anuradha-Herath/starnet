import Link from "next/link"
import { ShieldX } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
          <ShieldX className="w-10 h-10 text-red-600" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Access Denied</h1>
        <p className="text-gray-600 mb-8">
          You don&apos;t have permission to access this page. Please contact an administrator if you believe this is an error.
        </p>
        
        <div className="space-y-4">
          <Link href="/">
            <Button className="w-full">
              Return to Home
            </Button>
          </Link>
          
          <Link href="/login">
            <Button variant="outline" className="w-full">
              Sign In with Different Account
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
