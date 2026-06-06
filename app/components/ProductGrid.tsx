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
  collections?: {nodes: {title: string}[]};
};

type Props = {
  products: {nodes: Product[]} | null;
  title?: string;
  limit?: number;
};

export default function ProductGrid({products, title = 'Productos', limit = 8}: Props) {
  if (!products?.nodes?.length) return null;

  const items = products.nodes.slice(0, limit);

  return (
    <section className="product-grid-section">
      <div className="product-grid-header">
        <h2>{title}</h2>
        <Link to="/collections/all">Ver todos →</Link>
      </div>

      <div className="product-grid">
        {items.map((product) => (
          <Link
            key={product.id}
            to={`/products/${product.handle}`}
            className="product-card product-card-editorial"
            prefetch="intent"
          >
            <div className="pce-img-wrap">
              {product.featuredImage ? (
                <Image
                  data={product.featuredImage}
                  className="pce-img"
                  sizes="(max-width: 600px) 50vw, 25vw"
                />
              ) : (
                <div className="pce-placeholder" />
              )}
              <div className="pce-fav" aria-hidden="true">♡</div>
            </div>

            <div className="pce-info">
              {product.collections?.nodes?.[0] && (
                <span className="pce-meta">
                  {product.collections.nodes[0].title}
                </span>
              )}
              <p className="pce-name">{product.title}</p>
              <div className="pce-price">
                <Money data={product.priceRange.minVariantPrice as any} />
              </div>
              <button className="pce-btn">Agregar al carrito</button>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}