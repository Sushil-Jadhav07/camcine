// src/sections/HomePage.tsx  — TMDB-powered version
// Replace mock contentService calls with tmdbService calls

import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Play, Info, Star, Clock, ChevronRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { tmdbService } from '@/services/tmdbService';
import { ContentCard } from '@/components/cards/ContentCard';
import { usePlayerStore } from '@/store';
import type { Content } from '@/types';

gsap.registerPlugin(ScrollTrigger);

const GENRES = ['All', 'Action', 'Drama', 'Thriller', 'Comedy', 'Horror', 'Sci-Fi', 'Romance', 'Animation', 'Documentary'];

export function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeGenre, setActiveGenre] = useState('All');
  const { openPlayer } = usePlayerStore();

  // ── TMDB queries ────────────────────────────────────────
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

  const { data: popularSeries = [] } = useQuery({
    queryKey: ['tmdb-popular-series'],
    queryFn: tmdbService.getPopularSeries,
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

  // ── Hero content (cycles through featured) ───────────────
  const heroSlides = featured.length > 0 ? featured : trending.slice(0, 3);
  const heroContent: Content = (heroSlides[currentSlide] ?? {
    id: 'default-1',
    title: 'Welcome to Camcine',
    description: 'Stream the best movies, shows, live news and songs. Your premium entertainment destination.',
    type: 'movie', status: 'free',
    poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=500&h=750&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1514306191717-45224512c2d0?w=1920&h=1080&fit=crop',
    releaseYear: 2026, genres: ['Drama'], rating: 'U/A', duration: 7200,
    languages: ['EN'], region: 'Hollywood', mood: [], cast: [], crew: [], tags: [],
    isTrending: true, isFeatured: true, viewCount: 0, likes: 0,
  }) as Content;

  const miniPreviews = heroSlides.filter((_, i) => i !== currentSlide).slice(0, 3);

  // ── GSAP ──────────────────────────────────────────────────
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.fromTo('.hero-backdrop', { opacity: 0, scale: 1.08 }, { opacity: 1, scale: 1, duration: 1.4, ease: 'power3.out' })
        .fromTo('.hero-glow', { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 1, ease: 'power2.out' }, '-=0.8')
        .fromTo('.hero-content', { x: '-6vw', opacity: 0 }, { x: 0, opacity: 1, duration: 1, ease: 'power3.out' }, '-=0.4')
        .fromTo('.hero-right', { x: '6vw', opacity: 0 }, { x: 0, opacity: 1, duration: 1, ease: 'power3.out' }, '-=0.6')
        .fromTo('.hero-cta', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.12, ease: 'power2.out' }, '-=0.3')
        .fromTo('.hero-title', { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: 'power2.out' }, '-=0.5');

      gsap.utils.toArray('.section-content').forEach((section: any) => {
        gsap.fromTo(section, { opacity: 0, y: 40 }, {
          opacity: 1, y: 0, duration: 0.8, ease: 'power2.out',
          scrollTrigger: { trigger: section, start: 'top 88%', once: true }
        });
      });

      gsap.utils.toArray('.row-card').forEach((card: any, i: number) => {
        gsap.fromTo(card, { opacity: 0, y: 25, scale: 0.95 }, {
          opacity: 1, y: 0, scale: 1, duration: 0.5, delay: i * 0.05, ease: 'power2.out',
          scrollTrigger: { trigger: card, start: 'top 92%', once: true }
        });
      });
    }, heroRef);
    return () => ctx.revert();
  }, []);

  // Auto-advance hero slider
  useEffect(() => {
    if (heroSlides.length < 2) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % Math.min(heroSlides.length, 5));
    }, 6000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  // ── Render ─────────────────────────────────────────────────
  return (
    <div className="relative" ref={heroRef}>

      {/* ── HERO ── */}
      <section className="hero-section">
        <div className="hero-backdrop" style={{ backgroundImage: `url(${heroContent.backdrop})` }} />
        <div className="hero-gradient" />
        <div className="hero-glow" />

        <div className="relative z-10 w-full px-6 lg:px-16 flex items-center min-h-[92vh]">
          <div className="hero-content w-full lg:w-[58%]">
            <div className="mb-5">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 glass-accent rounded-full text-[var(--accent)] text-sm font-semibold">
                <span className="text-base">🔥</span> Trending Now
              </span>
            </div>

            <h1 className="hero-title text-4xl md:text-5xl lg:text-[56px] font-bold text-white mb-5 leading-tight" style={{ fontFamily: 'Sora, sans-serif' }}>
              {heroContent.title}
            </h1>

            <p className="text-[var(--text-secondary)] text-base lg:text-lg mb-7 max-w-xl line-clamp-3 leading-relaxed">
              {heroContent.description}
            </p>

            <div className="flex items-center gap-5 mb-8 text-sm">
              <div className="rating-badge">
                <Star className="w-3.5 h-3.5 fill-current" />
                {(heroContent as any).tmdbRating || heroContent.rating || '8.5'}
              </div>
              <span className="text-[var(--text-muted)]">{heroContent.releaseYear}</span>
              <span className="px-2 py-0.5 glass rounded text-xs text-[var(--text-secondary)]">
                {heroContent.genres?.[0] || 'Drama'}
              </span>
              {heroContent.duration != null && heroContent.duration > 0 && (
                <span className="flex items-center gap-1.5 text-[var(--text-muted)]">
                  <Clock className="w-3.5 h-3.5" />
                  {formatDuration(heroContent.duration)}
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-4 hero-cta">
              <button onClick={() => openPlayer(heroContent)} className="btn-accent group">
                <Play className="w-5 h-5 fill-current group-hover:scale-110 transition-transform" />
                Watch Now
              </button>
              <Link to={`/content/${heroContent.id}`} className="btn-ghost">
                <Info className="w-5 h-5" />
                More Info
              </Link>
            </div>
          </div>

          {/* Mini previews */}
          <div className="hidden lg:block w-[42%] pl-16">
            <div className="hero-right flex flex-col gap-4">
              {miniPreviews.map((content, idx) => (
                <Link
                  key={content.id}
                  to={`/content/${content.id}`}
                  className="group relative flex items-center gap-4 p-3 rounded-2xl glass hover-lift transition-all duration-300"
                >
                  <img
                    src={content.poster}
                    alt={content.title}
                    className="w-16 h-24 rounded-xl object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-white font-semibold text-sm truncate group-hover:text-[var(--accent)] transition-colors">
                      {content.title}
                    </h4>
                    <p className="text-[var(--text-muted)] text-xs mt-1">{content.releaseYear}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="rating-badge text-[10px] py-0.5 px-2">
                        <Star className="w-2.5 h-2.5 fill-current" />
                        {(content as any).tmdbRating || '8.0'}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => { e.preventDefault(); openPlayer(content as Content); }}
                    className="p-2.5 rounded-full bg-[var(--accent)] opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300"
                  >
                    <Play className="w-4 h-4 fill-current" />
                  </button>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Slide dots */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3">
          {heroSlides.slice(0, 5).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-1.5 rounded-full transition-all duration-500 ${currentSlide === idx ? 'w-8 bg-[var(--accent)]' : 'w-2 bg-white/30 hover:bg-white/50'}`}
            />
          ))}
        </div>
      </section>

      {/* ── GENRE TABS ── */}
      <section className="section-content py-10 px-6 lg:px-16">
        <div className="scroll-row">
          {GENRES.map((genre) => (
            <button
              key={genre}
              onClick={() => setActiveGenre(genre)}
              className={`genre-tag ${activeGenre === genre ? 'active' : ''}`}
            >
              {genre}
            </button>
          ))}
        </div>
      </section>

      {/* ── TRENDING ── */}
      <section className="section-content py-12 px-6 lg:px-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="section-title">Trending Now</h2>
          <Link to="/browse?sort=trending" className="text-[var(--text-secondary)] hover:text-white text-sm flex items-center gap-1.5 transition-colors group">
            View All <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        <div className="scroll-row">
          {trending.length === 0
            ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="w-[160px] md:w-[180px] aspect-[2/3] skeleton rounded-2xl flex-shrink-0" />
              ))
            : trending.map((content, idx) => (
                <div key={content.id} className="row-card w-[160px] md:w-[180px]">
                  <ContentCard content={content} />
                </div>
              ))
          }
        </div>
      </section>

      {/* ── FEATURED / EDITOR'S CHOICE ── */}
      {featured[0] && (
        <section className="section-content py-12 px-6 lg:px-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="section-title">Editor's Choice</h2>
            <Link to="/browse?sort=featured" className="text-[var(--text-secondary)] hover:text-white text-sm flex items-center gap-1.5 transition-colors group">
              View All <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <Link to={`/content/${featured[0].id}`} className="group relative block w-full aspect-[21/9] rounded-2xl overflow-hidden">
            <img
              src={featured[0].backdrop}
              alt={featured[0].title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--bg-base)] via-[rgba(6,8,10,0.7)] to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-12 bg-gradient-to-t from-black/80 via-black/30 to-transparent">
              <span className="inline-block px-3 py-1 glass-accent rounded-full text-[var(--accent)] text-xs font-semibold mb-3">Editor's Pick</span>
              <h3 className="text-2xl lg:text-4xl font-bold text-white mb-3" style={{ fontFamily: 'Sora, sans-serif' }}>
                {featured[0].title}
              </h3>
              <p className="text-white/70 text-sm lg:text-base max-w-xl line-clamp-2">{featured[0].description}</p>
            </div>
          </Link>
        </section>
      )}

      {/* ── POPULAR MOVIES ── */}
      <section className="section-content py-12 px-6 lg:px-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="section-title">Popular Movies</h2>
          <Link to="/browse?type=movie" className="text-[var(--text-secondary)] hover:text-white text-sm flex items-center gap-1.5 transition-colors group">
            View All <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        <div className="scroll-row">
          {popularMovies.length === 0
            ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="w-[160px] md:w-[180px] aspect-[2/3] skeleton rounded-2xl flex-shrink-0" />
              ))
            : popularMovies.map((content, idx) => (
                <div key={content.id} className="row-card w-[160px] md:w-[180px]">
                  <ContentCard content={content} />
                </div>
              ))
          }
        </div>
      </section>

      {/* ── NOW PLAYING ── */}
      <section className="section-content py-12 px-6 lg:px-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="section-title">Now Playing</h2>
          <Link to="/browse?sort=now_playing" className="text-[var(--text-secondary)] hover:text-white text-sm flex items-center gap-1.5 transition-colors group">
            View All <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        <div className="scroll-row">
          {nowPlaying.map((content, idx) => (
            <div key={content.id} className="row-card w-[160px] md:w-[180px]">
              <ContentCard content={content} />
            </div>
          ))}
        </div>
      </section>

      {/* ── TV SERIES ── */}
      <section className="section-content py-12 px-6 lg:px-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="section-title">TV Series</h2>
          <Link to="/browse?type=series" className="text-[var(--text-secondary)] hover:text-white text-sm flex items-center gap-1.5 transition-colors group">
            View All <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        <div className="scroll-row">
          {popularSeries.length === 0
            ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="w-[160px] md:w-[180px] aspect-[2/3] skeleton rounded-2xl flex-shrink-0" />
              ))
            : popularSeries.map((content, idx) => (
                <div key={content.id} className="row-card w-[160px] md:w-[180px]">
                  <ContentCard content={content} />
                </div>
              ))
          }
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="section-content py-20 px-6 lg:px-16">
        <div className="relative rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/20 via-[#FF6B4A]/10 to-[var(--bg-card)]" />
          <div className="absolute inset-0 backdrop-blur-xl" />
          <div className="relative p-12 lg:p-20 text-center">
            <h2 className="text-3xl lg:text-5xl font-bold text-white mb-5" style={{ fontFamily: 'Sora, sans-serif' }}>
              Stream Unlimited. <span className="gradient-text">Anytime.</span> Anywhere.
            </h2>
            <p className="text-white/70 text-lg mb-10 max-w-2xl mx-auto leading-relaxed">
              Access thousands of movies, shows, live news, and songs.
            </p>
            <Link to="/pricing" className="btn-accent inline-flex items-center gap-2 text-lg px-10 py-4">
              Subscribe Now <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}