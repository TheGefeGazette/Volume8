export function PriceLine() {
  return (
    <div className="price-block" aria-label="Price: your precious free time">
      <span className="price-title">Price</span>
      <p className="price-line">
        <span className="price-aside">(your precious)</span>
        <strong className="price-free">FREE!</strong>
        <span className="price-aside">(time)</span>
      </p>
    </div>
  );
}
