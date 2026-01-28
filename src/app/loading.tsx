export default function Loading() {
  return (
    <main className="min-h-screen bg-brand-navy-dark flex items-center justify-center">
      <div className="relative">
        {/* Spinner */}
        <div className="w-16 h-16 border-4 border-white/10 border-t-brand-orange rounded-full animate-spin" />
        
        {/* Glow effect */}
        <div className="absolute inset-0 w-16 h-16 bg-brand-orange/20 rounded-full blur-xl animate-pulse" />
      </div>
    </main>
  );
}
