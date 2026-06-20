import Image from 'next/image';
import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left panel — branding (hidden on mobile) */}
      <div className="hidden lg:flex flex-col justify-between relative overflow-hidden bg-brand-950 p-10">
        <Image
          src="/images/auth-bg.png"
          alt=""
          width={960}
          height={1080}
          priority
          className="absolute inset-0 -z-0 w-full h-full object-cover opacity-30"
        />

        {/* Logo */}
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-white/10 backdrop-blur rounded-lg flex items-center justify-center border border-white/10 transition-all duration-200 group-hover:bg-white/15">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6.5 9.5L9.5 6.5M6 12L4.5 13.5C3.4 14.6 1.4 14.6 0.5 13.5C-0.6 12.4-0.6 10.6 0.5 9.5L3 7C4.1 5.9 5.9 5.9 7 7" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M10 4L11.5 2.5C12.6 1.4 14.6 1.4 15.5 2.5C16.6 3.6 16.6 5.4 15.5 6.5L13 9C11.9 10.1 10.1 10.1 9 9" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </div>
            <span className="text-lg font-semibold text-white/90">Linkly</span>
          </Link>
        </div>

        {/* Quote / value prop */}
        <div className="relative z-10 max-w-sm">
          <blockquote className="text-xl font-medium text-white/90 leading-relaxed mb-4">
            &quot;Finally, a link shortener that tells me where my clicks actually come from.&quot;
          </blockquote>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-sm font-medium text-brand-300">
              AK
            </div>
            <div>
              <p className="text-sm font-medium text-white/80">Aman Khan</p>
              <p className="text-xs text-white/40">Freelance marketer</p>
            </div>
          </div>
        </div>

        {/* Decorative dots */}
        <div className="relative z-10 flex gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-white/30" />
          <div className="w-1.5 h-1.5 rounded-full bg-white/15" />
          <div className="w-1.5 h-1.5 rounded-full bg-white/15" />
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex items-center justify-center p-5 sm:p-8">
        <div className="w-full max-w-[400px]">{children}</div>
      </div>
    </div>
  );
}