import {Link} from '@remix-run/react';
import {Image, Money} from '@shopify/hydrogen';

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

export default function CollectionZoneProducts({collection, accentLabel}: Props) {
  if (!collection?.products?.nodes?.length) return null;
  const items = collection.products.nodes.slice(0, 8);
  return (
    <section className="czp-section">
      <div className="czp-header">
        <div className="czp-header-left">
          {accentLabel && <span className="czp-accent">{accentLabel}</span>}
          <h2 className="czp-title">{collection.title}</h2>
        </div>
        <Link to={`/collections/${collection.handle}`} className="czp-link">
          Ver colección completa →
        </Link>
      </div>
      <div className="czp-grid">
        {items.map((product) => (
          <Link
            key={product.id}
            to={`/products/${product.handle}`}
            className="czp-card"
            prefetch="intent"
          >
            <div className="czp-img-wrap">
              {product.featuredImage ? (
                <Image
                  data={product.featuredImage}
                  className="czp-img"
                  sizes="(max-width: 600px) 50vw, 25vw"
                />
              ) : (
                <div className="czp-placeholder" />
              )}
              <div className="czp-overlay"><span>Ver producto</span></div>
            </div>
            <div className="czp-info">
              <p className="czp-name">{product.title}</p>
              <div className="czp-price">
                <Money data={product.priceRange.minVariantPrice as any} />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
