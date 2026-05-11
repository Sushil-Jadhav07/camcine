import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Star, ChevronLeft, ChevronRight, Play, X } from 'lucide-react';
import { CAMCINE_MOVIES } from '@/data/camcineContent';
import { ContentCard } from '@/components/cards/ContentCard';

gsap.registerPlugin(ScrollTrigger);

export function HomePage() {
  const heroRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [trailerOpen, setTrailerOpen] = useState(false);
  const [trailerContent, setTrailerContent] = useState(null);

  const heroSlides = CAMCINE_MOVIES;
  const heroContent = heroSlides[currentSlide];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.hero-bg', { opacity: 0, scale: 1.06 }, { opacity: 1, scale: 1, duration: 1.2, ease: 'power3.out' });
      gsap.fromTo('.hero-text', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', delay: 0.3 });
      gsap.fromTo('.hero-actions', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power2.out', delay: 0.6 });

      gsap.utils.toArray('.section-content').forEach((section) => {
        gsap.fromTo(
          section,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: { trigger: section, start: 'top 88%', once: true },
          }
        );
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (heroSlides.length < 2 || trailerOpen) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % Math.min(heroSlides.length, 5));
    }, 6000);
    return () => clearInterval(interval);
  }, [heroSlides.length, trailerOpen]);

  const goToPrevSlide = () => {
    if (heroSlides.length < 2) return;
    setCurrentSlide((prev) => (prev - 1 + Math.min(heroSlides.length, 5)) % Math.min(heroSlides.length, 5));
  };

  const goToNextSlide = () => {
    if (heroSlides.length < 2) return;
    setCurrentSlide((prev) => (prev + 1) % Math.min(heroSlides.length, 5));
  };

  const openTrailer = () => {
    if (!heroContent?.trailerSrc) return;
    setTrailerContent(heroContent);
    setTrailerOpen(true);
  };

  const closeTrailer = () => {
    setTrailerOpen(false);
    setTrailerContent(null);
  };

  return (
    <div className="relative -mt-16 md:-mt-20" ref={heroRef}>
      <section className="relative w-full h-[calc(65vh+4rem)] sm:h-[calc(72vh+4rem)] md:h-[calc(80vh+5rem)] overflow-hidden">
        {heroContent ? (
          <>
            <div className="hero-bg absolute inset-0 z-0">
              <img
                src={heroContent.backdrop}
                alt={heroContent.title}
                className="w-full h-full object-cover brightness-[0.35]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-base)] via-[var(--bg-base)]/10 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg-base)]/90 via-[var(--bg-base)]/30 to-transparent" />
            </div>

            <div className="hero-text absolute inset-x-0 bottom-0 z-10 px-5 pb-8 pt-24 sm:px-8 md:px-12 lg:px-20 md:pb-10">
              <div className="max-w-3xl">
                <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4 flex-wrap">
                  <div className="flex items-center gap-1.5 text-[var(--accent)] font-bold text-xs md:text-sm">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    {heroContent.tmdbRating}
                  </div>
                  <span className="text-white/50 text-xs font-bold uppercase tracking-widest">{heroContent.releaseYear}</span>
                  <span className="px-2 py-0.5 rounded bg-[var(--accent)] text-white text-[9px] md:text-[10px] font-black uppercase tracking-widest">Premium</span>
                  {heroContent.genres?.slice(0, 2).map((g) => (
                    <span key={g} className="text-white/40 text-[10px] font-bold uppercase tracking-widest hidden sm:inline">{g}</span>
                  ))}
                </div>

                <h1
                  className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black text-white uppercase mb-3 md:mb-5 leading-[0.92] tracking-tighter italic"
                  style={{ fontFamily: 'Sora, sans-serif' }}
                >
                  {heroContent.title}
                </h1>

                <p className="text-white/55 text-xs sm:text-sm md:text-base mb-5 md:mb-7 line-clamp-2 md:line-clamp-3 max-w-xl font-medium leading-relaxed">
                  Coming Soon
                </p>

                <div className="hero-actions flex items-center gap-3 md:gap-4 flex-wrap">
                  <button
                    type="button"
                    onClick={openTrailer}
                    className="flex items-center gap-2 md:gap-3 px-6 md:px-10 py-3 md:py-4 rounded-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-black text-xs md:text-sm uppercase tracking-widest transition-all shadow-[0_0_30px_rgba(232,68,44,0.3)] active:scale-95"
                  >
                    <Play className="w-4 h-4 md:w-5 md:h-5 fill-current" />
                    Play Trailer
                  </button>
                  <Link
                    to={`/content/${heroContent.id}`}
                    className="hidden sm:flex items-center gap-2 md:gap-3 px-5 md:px-7 py-3 md:py-4 rounded-full bg-white/10 hover:bg-white/15 border border-white/10 text-white font-black text-xs md:text-sm uppercase tracking-widest transition-all active:scale-95 backdrop-blur-md"
                  >
                    More Info
                  </Link>
                </div>
              </div>

              {heroSlides.length > 1 && (
                <div className="mt-8 flex flex-col gap-4 lg:absolute lg:right-8 lg:bottom-8 lg:mt-0 lg:w-[520px]">
                  <div className="hidden lg:flex items-center justify-end gap-2">
                    <button
                      onClick={goToPrevSlide}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/25 text-white/60 backdrop-blur-xl transition hover:text-white hover:border-[var(--accent)]/40"
                      aria-label="Previous slide"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      onClick={goToNextSlide}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-black/25 text-white/60 backdrop-blur-xl transition hover:text-white hover:border-[var(--accent)]/40"
                      aria-label="Next slide"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="rounded-[1.75rem] border border-white/10 bg-black/20 p-3 backdrop-blur-xl shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
                    <div className="flex gap-2 overflow-x-auto no-scrollbar">
                      {heroSlides.slice(0, 5).map((slide, i) => (
                        <button
                          key={slide.id}
                          onClick={() => setCurrentSlide(i)}
                          className={`group relative h-14 w-24 sm:h-16 sm:w-28 md:w-32 shrink-0 overflow-hidden rounded-xl border transition-all duration-300 ${
                            i === currentSlide
                              ? 'border-[var(--accent)] shadow-[0_0_0_1px_var(--accent)]'
                              : 'border-white/10 opacity-70 hover:opacity-100'
                          }`}
                          aria-label={`Go to slide ${i + 1}`}
                        >
                          <img src={slide.backdrop} alt={slide.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                          <div className={`absolute inset-0 transition-colors ${i === currentSlide ? 'bg-[var(--accent)]/10' : 'bg-black/30 group-hover:bg-black/15'}`} />
                          {i === currentSlide && (
                            <div className="absolute inset-y-2 right-2 w-1 rounded-full bg-white/80" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="absolute inset-0 skeleton" />
        )}
      </section>

      {trailerOpen && trailerContent?.trailerSrc && (
        <div className="fixed inset-0 z-[140] flex items-center justify-center bg-black/85 px-4 py-6 backdrop-blur-xl">
          <button
            type="button"
            className="absolute inset-0 cursor-default"
            aria-label="Close trailer"
            onClick={closeTrailer}
          />
          <div className="relative z-10 w-full max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-black shadow-[0_30px_90px_rgba(0,0,0,0.75)]">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 md:px-5">
              <div className="min-w-0">
                <p className="text-[9px] font-black uppercase tracking-[0.28em] text-[var(--accent)]">Trailer</p>
                <h3 className="truncate text-sm font-black uppercase text-white md:text-base">{trailerContent.title}</h3>
              </div>
              <button
                type="button"
                onClick={closeTrailer}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition hover:bg-white/10 hover:text-white"
                aria-label="Close trailer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <video
              key={trailerContent.trailerSrc}
              src={trailerContent.trailerSrc}
              className="aspect-video w-full bg-black object-contain"
              autoPlay
              controls
              playsInline
            />
          </div>
        </div>
      )}

      <section className="section-content py-8 md:py-14 px-4 md:px-6 lg:px-16">
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <h2 className="section-title">Upcoming Originals</h2>
        </div>
        <div className="scroll-row no-scrollbar">
          {CAMCINE_MOVIES.map((content) => (
            <div key={content.id} className="w-[160px] sm:w-[190px] md:w-[220px] flex-shrink-0">
              <ContentCard content={content} className="rounded-[1.5rem] md:rounded-[1.75rem]" />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
