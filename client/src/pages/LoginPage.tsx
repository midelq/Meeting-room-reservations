import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { authApi } from '../api/auth.api';
import { useAuth } from '../context/AuthContext';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
});

type FormData = z.infer<typeof schema>;

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      const result = await authApi.login(data);
      login(result.token, result.user);
      navigate('/');
    } catch (err: any) {
      toast.error(err.response?.data?.message ?? 'Something went wrong');
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--color-bg)' }}>
      {/* Left decorative panel */}
      <div
        style={{
          width: '420px',
          flexShrink: 0,
          display: 'flex',
          flexDirection: 'column',
          padding: '48px',
          background: 'var(--color-surface)',
          borderRight: '1px solid var(--color-border)',
        }}
        className="hidden lg:flex"
      >
        {/* Brand */}
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '17px', color: 'var(--color-brand)', letterSpacing: '-0.02em' }}>
          MeetingRooms
        </div>

        {/* Center tagline */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: '38px', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.04em', color: 'var(--color-text)' }}>
            Book your space,<br />
            <span style={{ color: 'var(--color-brand)' }}>own your time.</span>
          </p>
          <p style={{ color: 'var(--color-text-muted)', marginTop: '18px', fontSize: '14px', lineHeight: 1.8 }}>
            Manage meeting rooms, track schedules,<br />and collaborate with your team.
          </p>
        </div>


      </div>

      {/* Right form panel */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 32px' }}>
        <div style={{ width: '100%', maxWidth: '360px' }} className="animate-fade-up">
          <div style={{ marginBottom: '36px' }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '30px', fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--color-text)', marginBottom: '6px' }}>
              Welcome back
            </h1>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '14px' }}>
              Sign in to continue
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <Input label="Email" type="email" placeholder="you@company.com" error={errors.email?.message} {...register('email')} />
            <Input label="Password" type="password" placeholder="••••••••" error={errors.password?.message} {...register('password')} />
            <div style={{ marginTop: '8px' }}>
              <Button type="submit" isLoading={isSubmitting} style={{ width: '100%', padding: '14px', fontSize: '15px' }}>
                Sign in
              </Button>
            </div>
          </form>

          <p style={{ marginTop: '28px', textAlign: 'center', fontSize: '13px', color: 'var(--color-text-muted)' }}>
            No account?{' '}
            <Link to="/register" style={{ color: 'var(--color-brand)', textDecoration: 'none', fontWeight: 500 }}>
              Create one →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
