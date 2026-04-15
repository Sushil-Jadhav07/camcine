import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Play, Star, Plus, ChevronDown, ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { tmdbService } from '@/services/tmdbService';
import { ContentCard } from '@/components/cards/ContentCard';

gsap.registerPlugin(ScrollTrigger);

export function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const topTenRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  const { data: trending = [] } = useQuery({
    queryKey: ['tmdb-trending'],
    queryFn: tmdbService.getTrending,
    staleTime: 5 * 60 * 1000,
  });

  const { data: popularMovies = [] } = useQuery({
    queryKey: ['tmdb-popular-movies'],
    queryFn: tmdbService.getPopularMovies,
    staleTime: 5 * 60 * 1000,
  });

  const { data: featured = [] } = useQuery({
    queryKey: ['tmdb-featured'],
    queryFn: tmdbService.getFeatured,
    staleTime: 5 * 60 * 1000,
  });

  const { data: nowPlaying = [] } = useQuery({
    queryKey: ['tmdb-now-playing'],
    queryFn: tmdbService.getNowPlaying,
    staleTime: 5 * 60 * 1000,
  });

  const { data: popularSeries = [] } = useQuery({
    queryKey: ['tmdb-popular-series'],
    queryFn: tmdbService.getPopularSeries,
    staleTime: 5 * 60 * 1000,
  });

  const heroSlides = featured.length > 0 ? featured : trending.slice(0, 5);
  const heroContent = heroSlides[currentSlide];
  const featuredRow = (featured.length > 0 ? [...featured, ...popularMovies] : popularMovies).slice(0, 8);
  const spotlightContent = featured[1] || popularMovies[0] || trending[0];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.hero-bg', { opacity: 0, scale: 1.06 }, { opacity: 1, scale: 1, duration: 1.2, ease: 'power3.out' });
      gsap.fromTo('.hero-text', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, ease: 'power3.out', delay: 0.3 });
      gsap.fromTo('.hero-actions', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power2.out', delay: 0.6 });

      gsap.utils.toArray('.section-content').forEach((section: any) => {
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
    if (heroSlides.length < 2) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % Math.min(heroSlides.length, 5));
    }, 6000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  const goToPrevSlide = () => {
    if (heroSlides.length < 2) return;
    setCurrentSlide((prev) => (prev - 1 + Math.min(heroSlides.length, 5)) % Math.min(heroSlides.length, 5));
  };

  const goToNextSlide = () => {
    if (heroSlides.length < 2) return;
    setCurrentSlide((prev) => (prev + 1) % Math.min(heroSlides.length, 5));
  };

  const scrollTopTen = (direction: 'left' | 'right') => {
    if (!topTenRef.current) return;
    const amount = window.innerWidth >= 1024 ? 520 : 320;
    topTenRef.current.scrollBy({
      left: direction === 'right' ? amount : -amount,
      behavior: 'smooth',
    });
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
                  {heroContent.genres?.slice(0, 2).map((g: string) => (
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
                  {heroContent.description}
                </p>

                <div className="hero-actions flex items-center gap-3 md:gap-4 flex-wrap">
                  <Link
                    to={`/content/${heroContent.id}`}
                    className="flex items-center gap-2 md:gap-3 px-6 md:px-10 py-3 md:py-4 rounded-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-black text-xs md:text-sm uppercase tracking-widest transition-all shadow-[0_0_30px_rgba(232,68,44,0.3)] active:scale-95"
                  >
                    <Play className="w-4 h-4 md:w-5 md:h-5 fill-current" /> Play Now
                  </Link>
                  <Link
                    to={`/content/${heroContent.id}`}
                    className="hidden sm:flex items-center gap-2 md:gap-3 px-5 md:px-7 py-3 md:py-4 rounded-full bg-white/10 hover:bg-white/15 border border-white/10 text-white font-black text-xs md:text-sm uppercase tracking-widest transition-all active:scale-95 backdrop-blur-md"
                  >
                    More Info
                  </Link>
                  <button className="p-3 md:p-3.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-white active:scale-90 hidden md:flex">
                    <Plus className="w-5 h-5" />
                  </button>
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

      

      <section className="section-content py-8 md:py-14 px-4 md:px-6 lg:px-16 overflow-hidden">
        <div className="mb-8 flex items-start justify-between gap-4 md:mb-12">
          <div className="flex items-start gap-3 md:gap-5">
            <h2
              className="text-5xl sm:text-6xl md:text-8xl lg:text-[7rem] font-black tracking-tighter uppercase italic leading-none text-transparent [text-shadow:0_0_30px_rgba(232,68,44,0.08)] [-webkit-text-stroke:1.5px_var(--accent)]"
              style={{ fontFamily: 'Sora, sans-serif' }}
            >
              TOP 10
            </h2>
            <div className="flex flex-col pt-2 md:pt-4 leading-none">
              <span className="text-white text-xs md:text-lg font-black tracking-[0.32em] uppercase">Movies</span>
              <span className="text-white text-xs md:text-lg font-black tracking-[0.32em] uppercase opacity-70 mt-2 md:mt-3">Today</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2 pt-2">
            <button
              onClick={() => scrollTopTen('left')}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/55 transition hover:border-[var(--accent)]/40 hover:text-white"
              aria-label="Scroll top ten left"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => scrollTopTen('right')}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.03] text-white/55 transition hover:border-[var(--accent)]/40 hover:text-white"
              aria-label="Scroll top ten right"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div ref={topTenRef} className="scroll-row items-end gap-5 md:gap-8 pb-10 -mx-4 px-4 no-scrollbar">
          {(trending.length > 0 ? trending.slice(0, 10) : Array.from({ length: 10 })).map((content: any, idx) => (
            <div
              key={content?.id || idx}
              className="relative flex-shrink-0 group basis-[62%] sm:basis-[36%] md:basis-[28%] lg:basis-[20%] xl:basis-[18%] max-w-[240px] min-w-0 pt-6"
            >
              <div className="absolute left-0 bottom-0 z-0 select-none pointer-events-none">
                <span
                  className="block text-[118px] sm:text-[132px] md:text-[148px] lg:text-[168px] font-black leading-[0.82] italic text-transparent [-webkit-text-stroke:1.5px_var(--accent)] group-hover:text-[var(--accent)]/20 transition-all duration-500"
                  style={{ fontFamily: 'Sora, sans-serif' }}
                >
                  {idx + 1}
                </span>
              </div>
              <div className="relative z-10 w-[132px] sm:w-[150px] md:w-[162px] lg:w-[170px] ml-[3.35rem] sm:ml-[4.25rem] md:ml-[4.75rem] transition-all duration-500">
                {content ? (
                  <div className="relative">
                    {content.tmdbRating && (
                      <div className="absolute -top-4 left-3 z-20 inline-flex items-center gap-1 rounded-full border border-[var(--accent)] bg-[var(--bg-base)]/95 px-2.5 py-1 text-[10px] font-black text-white shadow-[0_10px_24px_rgba(0,0,0,0.38)] backdrop-blur-md">
                        <Star className="h-3 w-3 fill-[var(--accent)] text-[var(--accent)]" />
                        {content.tmdbRating}
                      </div>
                    )}
                    <ContentCard
                      content={content}
                      className="rounded-[1.35rem] md:rounded-[1.6rem] hover:translate-y-0 md:hover:translate-y-0 hover:shadow-none hover:border-white/5"
                    />
                  </div>
                ) : (
                  <div className="aspect-[2/3] skeleton rounded-[1.35rem] md:rounded-[1.6rem]" />
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

            <section className="section-content py-6 md:py-10 px-4 md:px-6 lg:px-16">
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <h2 className="section-title">Trending Now</h2>
          <Link to="/browse?sort=trending" className="text-[var(--text-secondary)] hover:text-white text-xs flex items-center gap-1 transition-colors group font-bold uppercase tracking-widest">
            All <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
        <div className="scroll-row no-scrollbar">
          {trending.length === 0
            ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="w-[130px] sm:w-[155px] md:w-[175px] aspect-[2/3] skeleton rounded-2xl flex-shrink-0" />
              ))
            : trending.map((content) => (
                <div key={content.id} className="w-[130px] sm:w-[155px] md:w-[175px] flex-shrink-0">
                  <ContentCard content={content} />
                </div>
              ))}
        </div>
      </section>

      <section className="section-content py-8 md:py-14 px-4 md:px-6 lg:px-16 overflow-hidden">
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between mb-8 md:mb-10">
          <div>
            <h2
              className="text-5xl sm:text-6xl md:text-8xl lg:text-[7rem] font-black text-outline-accent tracking-tighter uppercase leading-none"
              style={{ fontFamily: 'Sora, sans-serif' }}
            >
              FEATURED
            </h2>
            <p className="mt-4 text-white text-xs md:text-lg font-black tracking-[0.32em] uppercase">Movies</p>
          </div>

          <button className="self-start md:self-center inline-flex items-center gap-3 rounded-full border border-[var(--accent)] bg-white/[0.02] px-5 py-3 text-sm font-semibold text-white backdrop-blur-xl">
            Featured
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        <div className="scroll-row gap-4 md:gap-5 pb-4 no-scrollbar">
          {featuredRow.length === 0
            ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="w-[160px] sm:w-[190px] md:w-[220px] aspect-[0.7] skeleton rounded-[1.75rem] flex-shrink-0" />
              ))
            : featuredRow.map((content) => (
                <div key={content.id} className="w-[160px] sm:w-[190px] md:w-[220px] flex-shrink-0">
                  <ContentCard content={content} className="rounded-[1.5rem] md:rounded-[1.75rem]" />
                </div>
              ))}
        </div>
      </section>



      <section className="section-content py-6 md:py-10 px-4 md:px-6 lg:px-16">
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <h2 className="section-title">Popular Movies</h2>
          <Link to="/browse?type=movie" className="text-[var(--text-secondary)] hover:text-white text-xs flex items-center gap-1 transition-colors group font-bold uppercase tracking-widest">
            All <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
        <div className="scroll-row no-scrollbar">
          {popularMovies.length === 0
            ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="w-[130px] sm:w-[155px] md:w-[175px] aspect-[2/3] skeleton rounded-2xl flex-shrink-0" />
              ))
            : popularMovies.map((content) => (
                <div key={content.id} className="w-[130px] sm:w-[155px] md:w-[175px] flex-shrink-0">
                  <ContentCard content={content} />
                </div>
              ))}
        </div>
      </section>

      <section className="section-content py-6 md:py-10 px-4 md:px-6 lg:px-16">
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <h2 className="section-title">Now Playing</h2>
          <Link to="/browse?sort=now_playing" className="text-[var(--text-secondary)] hover:text-white text-xs flex items-center gap-1 transition-colors group font-bold uppercase tracking-widest">
            All <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
        <div className="scroll-row no-scrollbar">
          {nowPlaying.length === 0
            ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="w-[130px] sm:w-[155px] md:w-[175px] aspect-[2/3] skeleton rounded-2xl flex-shrink-0" />
              ))
            : nowPlaying.map((content) => (
                <div key={content.id} className="w-[130px] sm:w-[155px] md:w-[175px] flex-shrink-0">
                  <ContentCard content={content} />
                </div>
              ))}
        </div>
      </section>


      <section className="section-content py-6 md:py-10 px-4 md:px-6 lg:px-16">
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <h2 className="section-title">TV Series</h2>
          <Link to="/browse?type=series" className="text-[var(--text-secondary)] hover:text-white text-xs flex items-center gap-1 transition-colors group font-bold uppercase tracking-widest">
            All <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
        <div className="scroll-row no-scrollbar">
          {popularSeries.length === 0
            ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="w-[130px] sm:w-[155px] md:w-[175px] aspect-[2/3] skeleton rounded-2xl flex-shrink-0" />
              ))
            : popularSeries.map((content) => (
                <div key={content.id} className="w-[130px] sm:w-[155px] md:w-[175px] flex-shrink-0">
                  <ContentCard content={content} />
                </div>
              ))}
        </div>
      </section>

            {spotlightContent && (
        <section className="section-content px-4 pb-12 md:px-6 md:pb-16 lg:px-16">
          <Link
            to={`/content/${spotlightContent.id}`}
            className="group relative block min-h-[320px] md:min-h-[460px] overflow-hidden rounded-[2rem] md:rounded-[2.75rem] bg-[#0D1014]"
          >
            <img
              src={spotlightContent.backdrop}
              alt={spotlightContent.title}
              className="absolute inset-0 h-full w-full object-cover opacity-60 transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,8,10,0.78)_0%,rgba(6,8,10,0.52)_38%,rgba(6,8,10,0.82)_100%)]" />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-base)]/60 via-transparent to-[var(--bg-base)]/20" />

            <div className="relative z-10 flex min-h-[320px] md:min-h-[460px] items-center justify-end p-6 sm:p-8 md:p-12 lg:p-16">
              <div className="max-w-xl text-left md:text-right">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/40 bg-[var(--accent)]/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.28em] text-white/80">
                  Spotlight Pick
                </div>

                <h3
                  className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase text-white leading-[0.9] tracking-tight mb-4"
                  style={{ fontFamily: 'Sora, sans-serif' }}
                >
                  {spotlightContent.title}
                </h3>

                <p className="max-w-lg md:ml-auto text-sm md:text-base leading-relaxed text-white/75 mb-8 line-clamp-3">
                  {spotlightContent.description}
                </p>

                <div className="flex flex-wrap items-center gap-3 md:justify-end">
                  <span className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.24em] text-white/55">
                    <Star className="w-4 h-4 fill-[var(--accent)] text-[var(--accent)]" />
                    {spotlightContent.tmdbRating}
                  </span>
                  <span className="text-xs font-black uppercase tracking-[0.24em] text-white/40">
                    {spotlightContent.releaseYear}
                  </span>
                </div>

                <div className="mt-8 flex flex-wrap gap-3 md:justify-end">
                  <span className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)] bg-[var(--bg-base)]/45 px-6 py-3 text-sm font-black text-white shadow-[0_0_30px_rgba(232,68,44,0.18)]">
                    <Play className="w-4 h-4 fill-current" />
                    Watch Now
                  </span>
                  <span className="hidden sm:inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-white/70">
                    Explore
                    <ArrowUpRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </section>
      )}
    </div>
  );
}
