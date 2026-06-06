import {Link} from '@remix-run/react';
import {Image, Money} from '@shopify/hydrogen';

type Product = {
  id: string;
  title: string;
  handle: string;
  featuredImage: {url: string; altText?: string} | null;
  priceRange: {minVariantPrice: {amount: string; currencyCode: string}};
};

type Props = {
  products: {nodes: Product[]} | null;
  maxPrice?: number;
  title?: string;
  accentLabel?: string;
};

export default function ProductGridFiltered({
  products,
  maxPrice = 800000,
  title = 'Productos',
  accentLabel,
}: Props) {
  if (!products?.nodes?.length) return null;
  const filtered = products.nodes.filter(
    (p) => parseFloat(p.priceRange.minVariantPrice.amount) <= maxPrice,
  );
  if (!filtered.length) return null;
  return (
    <section className="pgf-section">
      <div className="pgf-header">
        <div className="pgf-header-left">
          {accentLabel && <span className="pgf-accent">{accentLabel}</span>}
          <h2 className="pgf-title">{title}</h2>
        </div>
        <Link to="/collections/all" className="pgf-link">
          Ver todos →
        </Link>
      </div>
      <div className="pgf-grid">
        {filtered.slice(0, 8).map((product) => (
          <Link
            key={product.id}
            to={`/products/${product.handle}`}
            className="pgf-card"
            prefetch="intent"
          >
            <div className="pgf-img-wrap">
              {product.featuredImage ? (
                <Image
                  data={product.featuredImage}
                  className="pgf-img"
                  sizes="(max-width: 640px) 50vw, 25vw"
                />
              ) : (
                <div className="pgf-placeholder" />
              )}
            </div>
            <div className="pgf-info">
              <p className="pgf-name">{product.title}</p>
              <div className="pgf-price">
                <Money data={product.priceRange.minVariantPrice} />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
