export default function AuthImagePattern({ title, subtitle }) {
  return (
    <div className="relative hidden lg:block">
      <div className="absolute inset-0">
        <div className="h-full w-full bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10" />
        <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:radial-gradient(circle_at_1px_1px,theme(colors.base-300)_1px,transparent_0)] [background-size:20px_20px]" />
      </div>

      <div className="relative h-full min-h-screen flex items-center justify-center p-10">
        <div className="max-w-md text-center">
          <h2 className="text-3xl font-bold">{title}</h2>
          <p className="mt-2 text-base-content/70">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}
