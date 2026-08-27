import { useEffect, useState } from 'react';
import { schoolContent } from '../siteContent';
import {
  fetchPublishedDocuments,
  fetchPublishedNotices,
  fetchPublishedPhotos,
  isSupabaseConfigured,
  type DisclosureDocumentRecord,
  type NoticeRecord,
  type PhotoRecord,
} from '../lib/supabase';

type GalleryItem = PhotoRecord & { src: string };

const localPhotos: GalleryItem[] = schoolContent.gallery.map((item, index) => ({
  id: `local-photo-${index}`,
  title: item.title,
  label: item.label,
  text: item.text,
  storage_path: '',
  public_url: item.src,
  src: item.src,
  published: true,
  sort_order: index,
  created_at: '',
  updated_at: '',
}));

const localDocuments: DisclosureDocumentRecord[] = schoolContent.mandatoryDisclosure.documentSections.flatMap((section) =>
  section.documents.map((document, index) => ({
    id: `local-document-${section.code}-${index}`,
    section_code: section.code,
    title: document.title,
    storage_path: '',
    public_url: document.file,
    published: true,
    created_at: '',
    updated_at: '',
  })),
);

export function usePublishedPhotos() {
  const [items, setItems] = useState<GalleryItem[]>(localPhotos);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    let active = true;
    fetchPublishedPhotos()
      .then((photos) => {
        if (!active) return;
        setItems(
          photos.length
            ? photos.map((photo) => ({ ...photo, src: photo.public_url }))
            : localPhotos,
        );
      })
      .catch((reason: Error) => {
        if (active) {
          setError(reason.message);
          setItems(localPhotos);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return { items, loading, error };
}

export function usePublishedNotices() {
  const [items, setItems] = useState<NoticeRecord[]>([]);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    let active = true;
    fetchPublishedNotices()
      .then((notices) => {
        if (active) setItems(notices);
      })
      .catch((reason: Error) => {
        if (active) setError(reason.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return { items, loading, error };
}

export function usePublishedDocuments() {
  const [items, setItems] = useState<DisclosureDocumentRecord[]>(localDocuments);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    let active = true;
    fetchPublishedDocuments()
      .then((documents) => {
        if (!active) return;
        if (!documents.length) {
          setItems(localDocuments);
          return;
        }
        const cloudByTitle = new Map(documents.map((document) => [document.title, document]));
        const merged = localDocuments.map((document) => cloudByTitle.get(document.title) ?? document);
        const localTitles = new Set(localDocuments.map((document) => document.title));
        setItems([...merged, ...documents.filter((document) => !localTitles.has(document.title))]);
      })
      .catch((reason: Error) => {
        if (active) {
          setError(reason.message);
          setItems(localDocuments);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return { items, loading, error };
}