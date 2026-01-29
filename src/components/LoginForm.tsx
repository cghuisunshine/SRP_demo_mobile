// Login Form Component
import { useState } from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from './ui/card'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Button } from './ui/button'
import { Alert, AlertDescription } from './ui/alert'
import { useStore } from '@/lib/store'
import { withBase } from '@/lib/base'

export function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const login = useStore((state) => state.login)

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 500))
    const success = await login(email, password)
    if (success) {
      const user = useStore.getState().auth.currentUser
      if (user?.role === 'admin' || user?.role === 'assistant') {
        window.location.href = withBase('/admin/dashboard')
      } else if (user?.role === 'inspector') {
        window.location.href = withBase('/inspector/dashboard')
      } else {
        window.location.href = withBase('/client/dashboard')
      }
    } else {
      setError('Invalid email or password. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-sm px-4">
      <Card className="w-full overflow-hidden border-none bg-white/95 shadow-2xl ring-1 ring-white/10 backdrop-blur-sm">
        <CardHeader className="pb-1 pt-3 text-center">
          <div className="mx-auto mb-1 flex h-8 w-8 items-center justify-center rounded-lg bg-[#6B8E5F] shadow-md">
            <span className="text-base font-black text-white">SR</span>
          </div>
          <CardTitle className="mb-0.5 text-lg font-black leading-none tracking-tight text-gray-900">
            Strata Reserve Planning
          </CardTitle>
          <CardDescription className="text-[9px] font-bold uppercase tracking-widest text-gray-400">
            Portal Access
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-2 pt-0.5">
          <form onSubmit={handleSubmit} className="space-y-2">
            {error && (
              <Alert variant="destructive" className="py-1 text-[9px]">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-0.5">
              <Label
                htmlFor="email"
                className="text-[9px] font-black uppercase text-gray-400"
              >
                Username
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-8 border-gray-100 bg-gray-50/50 text-xs"
              />
            </div>

            <div className="space-y-0.5">
              <Label
                htmlFor="password"
                title="password label"
                className="text-[9px] font-black uppercase text-gray-400"
              >
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-8 border-gray-100 bg-gray-50/50 text-xs"
              />
            </div>

            <Button
              type="submit"
              className="mt-1 h-9 w-full bg-[#6B8E5F] text-xs font-black text-white shadow-md transition-all hover:bg-[#5a7850] active:scale-[0.98]"
              disabled={loading}
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </Button>
          </form>

          <div className="text-center">
            <a
              href={withBase('/forgot-password')}
              title="reset password"
              className="text-[8px] font-black uppercase tracking-widest text-[#6B8E5F] opacity-60 hover:underline"
            >
              Reset Password
            </a>
          </div>
        </CardContent>

        <CardFooter className="mt-0.5 flex-col border-t border-gray-50 px-6 pb-2 pt-1.5 text-center">
          <div className="w-full">
            <div className="mb-1 flex items-center gap-2">
              <div className="h-px flex-grow bg-gray-100" />
              <p className="text-[7px] font-black uppercase tracking-[0.2em] text-gray-300">
                Fast Pass
              </p>
              <div className="h-px flex-grow bg-gray-100" />
            </div>
            <div className="flex justify-center gap-1">
              {[
                {
                  label: 'Client',
                  email: 'john.doe@strata.com',
                  pass: 'password123',
                  href: '/client/dashboard',
                },
                {
                  label: 'Insp',
                  email: 'inspector@srp.com',
                  pass: 'inspect123',
                  href: '/inspector/dashboard',
                },
                {
                  label: 'Admin',
                  email: 'admin@srp.com',
                  pass: 'admin123',
                  href: '/admin/dashboard',
                },
              ].map((role) => (
                <Button
                  key={role.label}
                  variant="ghost"
                  size="sm"
                  className="h-5 rounded-md bg-gray-50/80 px-1.5 text-[8px] font-bold hover:bg-[#6B8E5F]/10 hover:text-[#6B8E5F]"
                  onClick={async () => {
                    setEmail(role.email)
                    await login(role.email, role.pass)
                    window.location.href = withBase(role.href)
                  }}
                >
                  {role.label}
                </Button>
              ))}
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
