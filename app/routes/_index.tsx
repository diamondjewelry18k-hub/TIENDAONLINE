import {
  defer,
  type MetaArgs,
  type LoaderFunctionArgs,
} from '@shopify/remix-oxygen';
import {Suspense, useEffect} from 'react';
import {Await, useLoaderData} from '@remix-run/react';
import {getSeoMeta} from '@shopify/hydrogen';

import CollectionZoneProducts from '~/components/CollectionZoneProducts';
import DiamondBackground from '~/components/DiamondBackground';
import ProductGrid from '~/components/ProductGrid';
import {MEDIA_FRAGMENT} from '~/data/fragments';
import {seoPayload} from '~/lib/seo.server';
import {routeHeaders} from '~/data/cache';

export const headers = routeHeaders;

export async function loader(args: LoaderFunctionArgs) {
  const {params, context} = args;
  const {language, country} = context.storefront.i18n;

  if (
    params.locale &&
    params.locale.toLowerCase() !== `${language}-${country}`.toLowerCase()
  ) {
    throw new Response(null, {status: 404});
  }

  const deferredData = loadDeferredData(args);
  const criticalData = await loadCriticalData(args);
  return defer({...deferredData, ...criticalData});
}

async function loadCriticalData({context, request}: LoaderFunctionArgs) {
  const {language, country} = context.storefront.i18n;

  const seoResult = await context.storefront
    .query(HOMEPAGE_SEO_QUERY, {
      variables: {handle: 'frontpage', country, language},
    })
    .catch(() => ({shop: null, hero: null}));

  return {
    shop: seoResult?.shop ?? null,
    primaryHero: seoResult?.hero ?? null,
    seo: seoPayload.home({url: request.url}),
  };
}

function loadDeferredData({context}: LoaderFunctionArgs) {
  const {language, country} = context.storefront.i18n;

  const featuredProducts = context.storefront
    .query(HOMEPAGE_FEATURED_PRODUCTS_QUERY, {variables: {country, language}})
    .catch(() => null);

  const collections = context.storefront
    .query(FEATURED_COLLECTIONS_QUERY, {variables: {country, language}})
    .catch(() => null);

  const pulseras = context.storefront
    .query(COLLECTION_PRODUCTS_QUERY, {
      variables: {handle: 'pulseras-tejidas', first: 8, country, language},
    })
    .catch(() => null);

  const cadenas = context.storefront
    .query(COLLECTION_PRODUCTS_QUERY, {
      variables: {handle: 'cadenas', first: 8, country, language},
    })
    .catch(() => null);

  return {featuredProducts, collections, pulseras, cadenas};
}

export const meta = ({matches}: MetaArgs<typeof loader>) => {
  const seoData = matches
    .map((match) => (match.data as any).seo)
    .filter(Boolean);

  if (seoData.length === 0) {
    return {
      title: 'Diamond Jewelry Co',
      description: 'Tienda online de joyería de lujo',
    };
  }

  return getSeoMeta(...seoData);
};

export default function Homepage() {
  const {featuredProducts, collections, pulseras, cadenas} =
    useLoaderData<typeof loader>();

  useEffect(() => {

    const purchases = [
      {name: 'María', product: 'Cadena Oro Italiano'},
      {name: 'Carlos', product: 'Pulsera San Benito'},
      {name: 'Juliana', product: 'Cadena Clip Italiana'},
      {name: 'Andrés', product: 'Topos Oro 18K'},
      {name: 'Valentina', product: 'Pulsera 5 Balines'},
    ];

    const popup = document.createElement('div');
    popup.id = 'purchase-popup';
    document.body.appendChild(popup);

    function showPurchasePopup() {
      const random = purchases[Math.floor(Math.random() * purchases.length)];
      popup.innerHTML = `
        <div class="purchase-content">
          💎 ${random.name} compró
          <strong>${random.product}</strong>
          <small>hace unos segundos</small>
        </div>
      `;
      popup.classList.add('show');
      setTimeout(() => popup.classList.remove('show'), 5000);
    }

    const firstPopupTimer = setTimeout(showPurchasePopup, 5000);
    const popupInterval = window.setInterval(showPurchasePopup, 15000);

    const originalTitle = document.title;
    let titleInterval: ReturnType<typeof setInterval>;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        const messages = [
          '💎 Tu joya te espera',
          '🔥 Últimas unidades',
          '✨ Oro 18K disponible',
          '🛒 Completa tu compra',
        ];
        let i = 0;
        titleInterval = setInterval(() => {
          document.title = messages[i];
          i = (i + 1) % messages.length;
        }, 1200);
      } else {
        clearInterval(titleInterval);
        document.title = originalTitle;
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearTimeout(firstPopupTimer);
      clearInterval(popupInterval);
      clearInterval(titleInterval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      const popupElement = document.getElementById('purchase-popup');
      if (popupElement) popupElement.remove();
    };
  }, []);

  return (
    <>
      <DiamondBackground />

      <Suspense fallback={<div className="text-center py-10">Cargando productos...</div>}>
        <Await resolve={featuredProducts}>
          {(data) => (
            <ProductGrid
              products={(data as any)?.products ?? null}
              title="Productos Destacados"
            />
          )}
        </Await>
      </Suspense>

      <Suspense fallback={<div className="text-center py-10">Cargando colección...</div>}>
        <Await resolve={pulseras}>
          {(data) => (
            <CollectionZoneProducts
              collection={(data as any)?.collection ?? null}
              accentLabel="Colección"
            />
          )}
        </Await>
      </Suspense>

      <Suspense fallback={<div className="text-center py-10">Cargando colección...</div>}>
        <Await resolve={cadenas}>
          {(data) => (
            <CollectionZoneProducts
              collection={(data as any)?.collection ?? null}
              accentLabel="Colección"
            />
          )}
        </Await>
      </Suspense>
    </>
  );
}

const COLLECTION_CONTENT_FRAGMENT = `#graphql
  fragment CollectionContent on Collection {
    id
    handle
    title
    descriptionHtml
    heading: metafield(namespace: "hero", key: "title") { value }
    byline: metafield(namespace: "hero", key: "byline") { value }
    cta: metafield(namespace: "hero", key: "cta") { value }
    spread: metafield(namespace: "hero", key: "spread") {
      reference { ...Media }
    }
    spreadSecondary: metafield(namespace: "hero", key: "spread_secondary") {
      reference { ...Media }
    }
  }
  ${MEDIA_FRAGMENT}
` as const;

const HOMEPAGE_SEO_QUERY = `#graphql
  query seoCollectionContent($handle: String, $country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    hero: collection(handle: $handle) { ...CollectionContent }
    shop { name description }
  }
  ${COLLECTION_CONTENT_FRAGMENT}
` as const;

export const HOMEPAGE_FEATURED_PRODUCTS_QUERY = `#graphql
  query HomeProducts ($country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    products(first: 20) {
      nodes {
        id
        title
        handle
        featuredImage { url altText }
        priceRange {
          minVariantPrice { amount currencyCode }
        }
      }
    }
  }
` as const;

export const COLLECTION_PRODUCTS_QUERY = `#graphql
  query CollectionProducts(
    $handle: String!
    $first: Int!
    $country: CountryCode
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      title
      handle
      products(first: $first) {
        nodes {
          id
          title
          handle
          featuredImage { url altText }
          priceRange {
            minVariantPrice { amount currencyCode }
          }
        }
      }
    }
  }
` as const;

export const FEATURED_COLLECTIONS_QUERY = `#graphql
  query HomeCollections($country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    collections(first: 20) {
      nodes {
        id
        title
        handle
        image { url altText }
      }
    }
  }
` as const;
