export default function HeroSection() {
  return (
    <section
      className="relative flex min-h-[70vh] items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          "linear-gradient(rgba(30, 41, 59, 0.65), rgba(30, 41, 59, 0.65)), url('/images/hero-diocesan-buildings.jpg')",
      }}
      aria-labelledby="hero-heading"
    >
      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center text-white">
        <p className="text-sm font-medium uppercase tracking-widest text-white/80">
          Catholic Diocese of Hong Kong
        </p>
        <h1
          id="hero-heading"
          className="mt-4 text-3xl font-bold leading-tight md:text-5xl"
        >
          Welcome to the Diocesan Building and Development Commission
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/90 md:text-lg">
          Supporting the planning, development, and maintenance of diocesan and
          parish properties across Hong Kong.
        </p>
      </div>
    </section>
  );
}
