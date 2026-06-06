import {Link} from '@remix-run/react';
import {Image, Money} from '@shopify/hydrogen';
import {useRef} from 'react';

type Product = {
  id: string;
  title: string;
  handle: string;
  featuredImage: {url: string; altText?: string} | null;
  priceRange: {
    minVariantPrice: {amount: string; currencyCode: string};
  };
};

type Props = {
  collection: {
    title: string;
    handle: string;
    products: {nodes: Product[]};
  } | null;
  accentLabel?: string;
};

export default function CollectionCarousel({collection, accentLabel}: Props) {
  if (!collection?.products?.nodes?.length) return null;
  const trackRef = useRef<HTMLDivElement>(null);
  const scroll = (dir: 'left' | 'right') => {
    if (!trackRef.current) return;
    const amount = trackRef.current.offsetWidth * 0.75;
    trackRef.current.scrollBy({left: dir === 'right' ? amount : -amount, behavior: 'smooth'});
  };
  return (
    <section className="ccar-section">
      <div className="ccar-header">
        <div className="ccar-header-left">
          {accentLabel && <span className="ccar-accent">{accentLabel}</span>}
          <h2 className="ccar-title">{collection.title}</h2>
        </div>
        <div className="ccar-controls">
          <button className="ccar-arrow" onClick={() => scroll('left')} aria-label="Anterior">‹</button>
          <button className="ccar-arrow" onClick={() => scroll('right')} aria-label="Siguiente">›</button>
          <Link to={`/collections/${collection.handle}`} className="ccar-link">Ver todo →</Link>
        </div>
      </div>
      <div className="ccar-track" ref={trackRef}>
        {collection.products.nodes.map((product) => (
          <Link key={product.id} to={`/products/${product.handle}`} className="ccar-card" prefetch="intent">
            <div className="ccar-img-wrap">
              {product.featuredImage ? (
                <Image data={product.featuredImage} className="ccar-img" sizes="200px" />
              ) : (
                <div className="ccar-placeholder" />
              )}
            </div>
            <div className="ccar-info">
              <p className="ccar-name">{product.title}</p>
              <div className="ccar-price"><Money data={product.priceRange.minVariantPrice} /></div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}