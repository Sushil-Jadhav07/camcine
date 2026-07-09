export function BrandLogo({
  alt = 'Camcine logo',
  className = '',
  imgClassName = '',
}) {
  return (
    <div className={className}>
      <img
        src="/logo.png"
        alt={alt}
        className={`block w-auto object-contain ${imgClassName}`.trim()}
      />
    </div>
  );
}
