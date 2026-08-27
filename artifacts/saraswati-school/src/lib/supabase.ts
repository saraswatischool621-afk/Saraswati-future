import { createClient, type SupabaseClient } from '@supabase/supabase-js';

export type StaffRoleName = 'principal' | 'admin';

export type PhotoRecord = {
  id: string;
  title: string;
  label: string;
  text: string;
  storage_path: string;
  public_url: string;
  published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type NoticeRecord = {
  id: string;
  title: string;
  body: string;
  published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type DisclosureDocumentRecord = {
  id: string;
  section_code: string;
  title: string;
  storage_path: string;
  public_url: string;
  published: boolean;
  created_at: string;
  updated_at: string;
};

export type StaffRoleRecord = {
  user_id: string;
  role: StaffRoleName;
  display_name: string | null;
};

export type Database = {
  public: {
    Tables: {
      photos: {
        Row: PhotoRecord;
        Insert: Omit<PhotoRecord, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<PhotoRecord, 'id' | 'created_at' | 'updated_at'>>;
        Relationships: [];
      };
      notices: {
        Row: NoticeRecord;
        Insert: Omit<NoticeRecord, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<NoticeRecord, 'id' | 'created_at' | 'updated_at'>>;
        Relationships: [];
      };
      disclosure_documents: {
        Row: DisclosureDocumentRecord;
        Insert: Omit<DisclosureDocumentRecord, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<DisclosureDocumentRecord, 'id' | 'created_at' | 'updated_at'>>;
        Relationships: [];
      };
      staff_roles: {
        Row: StaffRoleRecord;
        Insert: StaffRoleRecord;
        Update: Partial<StaffRoleRecord>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase: SupabaseClient<Database> | null = isSupabaseConfigured
  ? createClient<Database>(supabaseUrl!, supabaseAnonKey!, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

export const mediaBuckets = {
  photos: 'school-photos',
  documents: 'school-documents',
} as const;

export function requireSupabase() {
  if (!supabase) {
    throw new Error(
      'Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to the site environment.',
    );
  }
  return supabase;
}

export async function getStaffRole(userId: string) {
  const client = requireSupabase();
  const { data, error } = await client
    .from('staff_roles')
    .select('user_id, role, display_name')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function fetchPublishedPhotos() {
  const client = requireSupabase();
  const { data, error } = await client
    .from('photos')
    .select('*')
    .eq('published', true)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) throw error;
  return signAssetUrls(data ?? [], mediaBuckets.photos);
}

export async function fetchPublishedNotices() {
  const client = requireSupabase();
  const { data, error } = await client
    .from('notices')
    .select('*')
    .eq('published', true)
    .order('published_at', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function fetchPublishedDocuments() {
  const client = requireSupabase();
  const { data, error } = await client
    .from('disclosure_documents')
    .select('*')
    .eq('published', true)
    .order('section_code', { ascending: true })
    .order('title', { ascending: true });

  if (error) throw error;
  return signAssetUrls(data ?? [], mediaBuckets.documents);
}

export async function fetchAdminContent() {
  const client = requireSupabase();
  const [photos, notices, documents] = await Promise.all([
    client.from('photos').select('*').order('sort_order', { ascending: true }).order('created_at', { ascending: false }),
    client.from('notices').select('*').order('created_at', { ascending: false }),
    client.from('disclosure_documents').select('*').order('section_code', { ascending: true }).order('title', { ascending: true }),
  ]);

  const firstError = photos.error ?? notices.error ?? documents.error;
  if (firstError) throw firstError;

  return {
    photos: await signAssetUrls(photos.data ?? [], mediaBuckets.photos),
    notices: notices.data ?? [],
    documents: await signAssetUrls(documents.data ?? [], mediaBuckets.documents),
  };
}

function extensionFor(file: File) {
  const extension = file.name.split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '');
  return extension || (file.type === 'application/pdf' ? 'pdf' : 'bin');
}

export async function uploadAsset(bucket: string, folder: string, file: File) {
  const client = requireSupabase();
  const path = `${folder}/${crypto.randomUUID()}.${extensionFor(file)}`;
  const { error } = await client.storage.from(bucket).upload(path, file, {
    cacheControl: '3600',
    contentType: file.type || undefined,
    upsert: false,
  });

  if (error) throw error;
  return { path };
}

async function removeAsset(bucket: string, path: string) {
  if (!path) return;
  const client = requireSupabase();
  const { error } = await client.storage.from(bucket).remove([path]);
  if (error) throw error;
}

async function signAssetUrls<T extends { storage_path: string; public_url: string }>(records: T[], bucket: string) {
  if (!records.length) return records;
  const client = requireSupabase();
  return Promise.all(records.map(async (record) => {
    const { data, error } = await client.storage.from(bucket).createSignedUrl(record.storage_path, 3600);
    if (error) throw error;
    return { ...record, public_url: data.signedUrl };
  }));
}

export type PhotoInput = {
  title: string;
  label: string;
  text: string;
  published: boolean;
  sort_order: number;
};

export async function createPhoto(input: PhotoInput, file: File) {
  const client = requireSupabase();
  const asset = await uploadAsset(mediaBuckets.photos, 'gallery', file);
  const { data, error } = await client
    .from('photos')
    .insert({
      ...input,
      storage_path: asset.path,
      public_url: '',
    })
    .select('*')
    .single();

  if (error) {
    await removeAsset(mediaBuckets.photos, asset.path).catch(() => undefined);
    throw error;
  }
  return data;
}

export async function updatePhoto(id: string, input: Partial<PhotoInput>, file?: File, oldPath?: string) {
  const client = requireSupabase();
  let nextInput: Database['public']['Tables']['photos']['Update'] = { ...input };
  let replacementPath: string | undefined;

  if (file) {
    const asset = await uploadAsset(mediaBuckets.photos, 'gallery', file);
    replacementPath = asset.path;
    nextInput = { ...nextInput, storage_path: asset.path, public_url: '' };
  }

  const { data, error } = await client.from('photos').update(nextInput).eq('id', id).select('*').single();
  if (error) {
    if (replacementPath) await removeAsset(mediaBuckets.photos, replacementPath).catch(() => undefined);
    throw error;
  }
  if (replacementPath && oldPath) {
    await removeAsset(mediaBuckets.photos, oldPath).catch((cleanupError) => console.warn('Old gallery asset cleanup failed.', cleanupError));
  }
  return data;
}

export async function deletePhoto(photo: PhotoRecord) {
  const client = requireSupabase();
  const { error } = await client.from('photos').delete().eq('id', photo.id);
  if (error) throw error;
  await removeAsset(mediaBuckets.photos, photo.storage_path).catch((cleanupError) => console.warn('Deleted gallery asset cleanup failed.', cleanupError));
}

export type NoticeInput = {
  title: string;
  body: string;
  published: boolean;
  published_at?: string | null;
};

export async function createNotice(input: NoticeInput) {
  const client = requireSupabase();
  const { data, error } = await client
    .from('notices')
    .insert({
      title: input.title,
      body: input.body,
      published: input.published,
      published_at: input.published ? new Date().toISOString() : null,
    })
    .select('*')
    .single();

  if (error) throw error;
  return data;
}

export async function updateNotice(id: string, input: Partial<NoticeInput>) {
  const client = requireSupabase();
  const nextInput: Database['public']['Tables']['notices']['Update'] = {
    ...input,
    ...(input.published === true && !input.published_at ? { published_at: new Date().toISOString() } : {}),
    ...(input.published === false ? { published_at: null } : {}),
  };
  const { data, error } = await client.from('notices').update(nextInput).eq('id', id).select('*').single();
  if (error) throw error;
  return data;
}

export async function deleteNotice(notice: NoticeRecord) {
  const client = requireSupabase();
  const { error } = await client.from('notices').delete().eq('id', notice.id);
  if (error) throw error;
}

export type DocumentInput = {
  section_code: string;
  title: string;
  published: boolean;
};

export async function createDocument(input: DocumentInput, file: File) {
  const client = requireSupabase();
  const asset = await uploadAsset(mediaBuckets.documents, 'disclosure', file);
  const { data, error } = await client
    .from('disclosure_documents')
    .insert({
      ...input,
      storage_path: asset.path,
      public_url: '',
    })
    .select('*')
    .single();

  if (error) {
    await removeAsset(mediaBuckets.documents, asset.path).catch(() => undefined);
    throw error;
  }
  return data;
}

export async function updateDocument(id: string, input: Partial<DocumentInput>, file?: File, oldPath?: string) {
  const client = requireSupabase();
  let nextInput: Database['public']['Tables']['disclosure_documents']['Update'] = { ...input };
  let replacementPath: string | undefined;

  if (file) {
    const asset = await uploadAsset(mediaBuckets.documents, 'disclosure', file);
    replacementPath = asset.path;
    nextInput = { ...nextInput, storage_path: asset.path, public_url: '' };
  }

  const { data, error } = await client.from('disclosure_documents').update(nextInput).eq('id', id).select('*').single();
  if (error) {
    if (replacementPath) await removeAsset(mediaBuckets.documents, replacementPath).catch(() => undefined);
    throw error;
  }
  if (replacementPath && oldPath) {
    await removeAsset(mediaBuckets.documents, oldPath).catch((cleanupError) => console.warn('Old disclosure asset cleanup failed.', cleanupError));
  }
  return data;
}

export async function deleteDocument(document: DisclosureDocumentRecord) {
  const client = requireSupabase();
  const { error } = await client.from('disclosure_documents').delete().eq('id', document.id);
  if (error) throw error;
  await removeAsset(mediaBuckets.documents, document.storage_path).catch((cleanupError) => console.warn('Deleted disclosure asset cleanup failed.', cleanupError));
}