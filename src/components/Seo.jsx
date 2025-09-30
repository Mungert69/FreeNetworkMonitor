import { useEffect, useMemo } from 'react';

const setTag = ({ selector, create, apply, restore }) => {
  const element = document.head.querySelector(selector) || create();
  const previous = apply(element);
  return () => restore(element, previous);
};

const createMeta = (attribute, name) => () => {
  const meta = document.createElement('meta');
  meta.setAttribute(attribute, name);
  document.head.appendChild(meta);
  return meta;
};

const applyMeta = (attribute, name, content) => (element) => {
  if (!content) {
    return undefined;
  }
  const previousContent = element.getAttribute('content') ?? undefined;
  element.setAttribute('content', content);
  return previousContent;
};

const restoreMeta = (attribute, name) => (element, previousContent) => {
  if (previousContent === undefined) {
    element.removeAttribute('content');
    if (!element.getAttribute('content')) {
      element.parentNode?.removeChild(element);
    }
    return;
  }
  element.setAttribute('content', previousContent);
};

const ensureMeta = (attribute, name, content) => {
  if (!content) {
    return null;
  }
  return setTag({
    selector: `meta[${attribute}="${name}"]`,
    create: createMeta(attribute, name),
    apply: applyMeta(attribute, name, content),
    restore: restoreMeta(attribute, name),
  });
};

const ensureLink = (rel, href) => {
  if (!href) {
    return null;
  }
  return setTag({
    selector: `link[rel="${rel}"]`,
    create: () => {
      const link = document.createElement('link');
      link.setAttribute('rel', rel);
      document.head.appendChild(link);
      return link;
    },
    apply: (element) => {
      const previousHref = element.getAttribute('href') ?? undefined;
      element.setAttribute('href', href);
      return previousHref;
    },
    restore: (element, previousHref) => {
      if (previousHref === undefined) {
        element.parentNode?.removeChild(element);
        return;
      }
      element.setAttribute('href', previousHref);
    },
  });
};

const normalizeOpenGraphImages = (ogImage) => {
  if (!ogImage) {
    return [];
  }
  if (Array.isArray(ogImage)) {
    return ogImage;
  }
  return [ogImage];
};

const Seo = ({ title, description, openGraph, twitter }) => {
  const ogConfig = useMemo(() => openGraph ?? {}, [openGraph]);
  const twitterConfig = useMemo(() => twitter ?? {}, [twitter]);

  useEffect(() => {
    const restoreFns = [];

    if (title) {
      const previousTitle = document.title;
      document.title = title;
      restoreFns.push(() => {
        document.title = previousTitle;
      });
    }

    const addRestore = (fn) => {
      if (typeof fn === 'function') {
        restoreFns.push(fn);
      }
    };

    addRestore(ensureMeta('name', 'description', description));
    addRestore(ensureMeta('property', 'og:title', title));
    addRestore(ensureMeta('property', 'og:description', description));
    addRestore(ensureMeta('property', 'og:url', ogConfig.ogUrl));
    addRestore(ensureMeta('property', 'og:type', ogConfig.ogType));
    addRestore(ensureMeta('property', 'og:site_name', ogConfig.ogSiteName));
    addRestore(ensureMeta('property', 'og:locale', ogConfig.ogLocale));

    const [primaryImage] = normalizeOpenGraphImages(ogConfig.ogImage);
    if (primaryImage?.ogImage) {
      addRestore(ensureMeta('property', 'og:image', primaryImage.ogImage));
      addRestore(ensureMeta('property', 'og:image:alt', primaryImage.ogImageAlt));
      addRestore(ensureMeta('property', 'og:image:width', primaryImage.ogImageWidth));
      addRestore(ensureMeta('property', 'og:image:height', primaryImage.ogImageHeight));
    }

    addRestore(ensureLink('canonical', ogConfig.ogUrl));

    addRestore(ensureMeta('name', 'twitter:card', twitterConfig.cardType));
    addRestore(ensureMeta('name', 'twitter:site', twitterConfig.site));
    addRestore(ensureMeta('name', 'twitter:title', twitterConfig.title ?? title));
    addRestore(ensureMeta('name', 'twitter:description', twitterConfig.description ?? description));
    addRestore(ensureMeta('name', 'twitter:image', twitterConfig.image ?? primaryImage?.ogImage));

    return () => {
      restoreFns.reverse().forEach((restore) => restore());
    };
  }, [description, ogConfig, title, twitterConfig]);

  return null;
};

export default Seo;
