export function TopStrip() {
  return (
    <div className="fixed top-0 left-0 right-0 z-[110] h-8 md:h-12 w-full overflow-hidden bg-black border-b border-white/5">
      <div className="marquee-track h-full items-center">
        {Array.from({ length: 16 }).map((_, i) => (
          <img
            key={i}
            src="/camcine-strip.webp"
            alt="Camcine, in association with Bright Outdoor Media Limited"
            className="h-10 md:h-14 w-auto object-contain shrink-0 mr-8 md:mr-12"
            aria-hidden={i >= 8}
          />
        ))}
      </div>
    </div>
  );
}
