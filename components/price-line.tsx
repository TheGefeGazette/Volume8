export function PriceLine() {
  return (
    <p className="price-line" aria-label="Price: your precious free time">
      <span className="price-label">Price:</span>
      <span className="price-aside">(your precious)</span>
      <strong className="price-free">FREE!</strong>
      <span className="price-aside">(time)</span>
    </p>
  );
}
