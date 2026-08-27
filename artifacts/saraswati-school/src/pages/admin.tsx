import { type FormEvent, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'wouter';
import {
  AlertCircle,
  ArrowLeft,
  Bell,
  Check,
  CheckCircle2,
  ExternalLink,
  FileText,
  GripVertical,
  Image as ImageIcon,
  LogOut,
  Pencil,
  Plus,
  RefreshCw,
  Trash2,
  Upload,
  X,
} from 'lucide-react';
import type { Session } from '@supabase/supabase-js';
import { schoolContent } from '../siteContent';
import {
  createDocument,
  createNotice,
  createPhoto,
  deleteDocument,
  deleteNotice,
  deletePhoto,
  fetchAdminContent,
  getStaffRole,
  isSupabaseConfigured,
  supabase,
  updateDocument,
  updateNotice,
  updatePhoto,
  type DisclosureDocumentRecord,
  type NoticeInput,
  type NoticeRecord,
  type PhotoInput,
  type PhotoRecord,
  type StaffRoleRecord,
} from '../lib/supabase';

type AdminTab = 'photos' | 'notices' | 'documents';
type Feedback = { kind: 'success' | 'error'; text: string } | null;

function AdminBrand() {
  return (
    <a href="/" className="flex items-center gap-3" data-testid="link-admin-brand">
      <span className="grid size-12 shrink-0 place-items-center overflow-hidden rounded-2xl bg-[#f8eedc] ring-2 ring-[#e3b45b]/50">
        <img src={schoolContent.identity.logo} alt={`${schoolContent.identity.shortName} School emblem`} className="size-full object-cover" />
      </span>
      <span className="leading-tight">
        <span className="block font-display text-2xl font-bold text-[#f8eedc]">{schoolContent.identity.shortName}</span>
        <span className="block font-mono-school text-[8px] font-bold uppercase tracking-[.14em] text-[#e3b45b]">School office</span>
      </span>
    </a>
  );
}

function AdminLoading({ message = 'Opening the school office…' }: { message?: string }) {
  return (
    <div className="grid min-h-[100dvh] place-items-center bg-[#f8eedc] px-5 text-[#202337]">
      <div className="text-center">
        <div className="mx-auto grid size-14 place-items-center rounded-2xl bg-[#202337] text-[#e3b45b]">
          <RefreshCw size={22} className="animate-spin" />
        </div>
        <p className="mt-5 font-mono-school text-[10px] font-bold uppercase tracking-[.16em] text-[#c77a22]">{message}</p>
      </div>
    </div>
  );
}

function AdminLogin({ configured }: { configured: boolean }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [, setLocation] = useLocation();

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!supabase) return;
    setError('');
    setSaving(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) setError('The email or password was not accepted. Please try again.');
    else setLocation('/admin/dashboard');
    setSaving(false);
  };

  return (
    <main className="grid min-h-[100dvh] bg-[#f8eedc] lg:grid-cols-[.9fr_1.1fr]">
      <section className="relative overflow-hidden bg-[#202337] px-6 py-10 text-[#f8eedc] sm:px-10 lg:px-14 lg:py-14">
        <div className="absolute -right-28 top-16 size-80 rounded-full border-[55px] border-[#d95340]/20" />
        <div className="absolute -bottom-24 -left-20 size-64 rounded-full border-[42px] border-[#e3b45b]/20" />
        <div className="relative flex min-h-[300px] flex-col justify-between gap-14 lg:min-h-full">
          <AdminBrand />
          <div className="max-w-md">
            <p className="font-mono-school text-[10px] font-bold uppercase tracking-[.2em] text-[#e3b45b]">Welcome to the office</p>
            <h1 className="mt-5 font-display text-6xl font-bold leading-[.87] tracking-[-.04em] sm:text-7xl">Keep every school day moving.</h1>
            <p className="mt-7 max-w-sm text-sm leading-7 text-[#f8eedc]/65">A quiet place for the Principal and Admin team to keep Saraswati’s stories, notices and records ready for families.</p>
          </div>
          <p className="font-mono-school text-[9px] uppercase tracking-[.15em] text-[#f8eedc]/40">Private staff access · {schoolContent.identity.location}</p>
        </div>
      </section>
      <section className="flex items-center px-6 py-12 sm:px-10 lg:px-16">
        <div className="w-full max-w-md">
          <a href="/" className="inline-flex items-center gap-2 font-mono-school text-[10px] font-bold uppercase tracking-[.14em] text-[#c77a22] hover:text-[#c94b35]">
            <ArrowLeft size={14} /> Back to public site
          </a>
          <p className="mt-16 font-mono-school text-[10px] font-bold uppercase tracking-[.2em] text-[#c77a22]">Principal / Admin login</p>
          <h2 className="mt-4 font-display text-5xl font-bold leading-none text-[#202337]">Good to see you.</h2>
          {!configured ? (
            <div className="mt-8 rounded-2xl border border-[#d95340]/25 bg-[#d95340]/10 p-4 text-sm leading-6 text-[#8f2e24]">
              Supabase is not connected to this deployment yet. Add <strong>VITE_SUPABASE_URL</strong> and <strong>VITE_SUPABASE_ANON_KEY</strong> in Netlify, then redeploy to enable staff login.
            </div>
          ) : (
            <form onSubmit={submit} className="mt-9 grid gap-5">
              <label className="grid gap-2 text-xs font-bold text-[#202337]">
                Staff email
                <input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="username" placeholder="office@example.com" className="school-input" data-testid="input-admin-email" />
              </label>
              <label className="grid gap-2 text-xs font-bold text-[#202337]">
                Password
                <input required type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" placeholder="Your secure password" className="school-input" data-testid="input-admin-password" />
              </label>
              {error && <AdminFeedback feedback={{ kind: 'error', text: error }} />}
              <button disabled={saving} type="submit" className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-[#d95340] px-5 py-3.5 text-sm font-extrabold text-[#fff8ee] disabled:cursor-not-allowed disabled:opacity-60" data-testid="button-admin-login">
                {saving ? <RefreshCw size={16} className="animate-spin" /> : <Check size={16} />} {saving ? 'Checking access…' : 'Enter the office'}
              </button>
              <p className="text-xs leading-5 text-[#202337]/45">Only accounts added to the school’s Supabase staff list can enter. Public registration is disabled.</p>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}

function AdminFeedback({ feedback }: { feedback: Feedback }) {
  if (!feedback) return null;
  const success = feedback.kind === 'success';
  return (
    <div role="status" className={`flex items-start gap-3 rounded-2xl border p-4 text-sm leading-6 ${success ? 'border-[#3b7f7c]/25 bg-[#3b7f7c]/10 text-[#245c5a]' : 'border-[#d95340]/25 bg-[#d95340]/10 text-[#8f2e24]'}`}>
      {success ? <CheckCircle2 size={17} className="mt-1 shrink-0" /> : <AlertCircle size={17} className="mt-1 shrink-0" />}
      <span>{feedback.text}</span>
    </div>
  );
}

function AdminDashboard({ role, session }: { role: StaffRoleRecord; session: Session }) {
  const [tab, setTab] = useState<AdminTab>('photos');
  const [content, setContent] = useState<Awaited<ReturnType<typeof fetchAdminContent>> | null>(null);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [, setLocation] = useLocation();

  const load = async () => {
    setLoading(true);
    try {
      setContent(await fetchAdminContent());
      setFeedback(null);
    } catch (error) {
      setFeedback({ kind: 'error', text: error instanceof Error ? error.message : 'The cloud content could not be loaded.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const signOut = async () => {
    await supabase?.auth.signOut();
    setLocation('/admin');
  };

  const tabItems: { id: AdminTab; label: string; icon: typeof ImageIcon; count: number }[] = [
    { id: 'photos', label: 'Gallery photos', icon: ImageIcon, count: content?.photos.length ?? 0 },
    { id: 'notices', label: 'School notices', icon: Bell, count: content?.notices.length ?? 0 },
    { id: 'documents', label: 'Disclosure PDFs', icon: FileText, count: content?.documents.length ?? 0 },
  ];

  return (
    <main className="min-h-[100dvh] bg-[#f8eedc] text-[#202337]">
      <header className="bg-[#202337] px-5 py-4 text-[#f8eedc] sm:px-8">
        <div className="mx-auto flex max-w-[1380px] flex-wrap items-center justify-between gap-4">
          <AdminBrand />
          <div className="flex items-center gap-3">
            <a href="/" className="hidden items-center gap-2 rounded-full border border-[#f8eedc]/20 px-4 py-2 text-xs font-bold hover:bg-white/10 sm:inline-flex" data-testid="link-admin-public-site"><ExternalLink size={14} /> View public site</a>
            <button type="button" onClick={signOut} className="inline-flex items-center gap-2 rounded-full bg-[#e3b45b] px-4 py-2 text-xs font-extrabold text-[#202337]" data-testid="button-admin-signout"><LogOut size={14} /> Sign out</button>
          </div>
        </div>
      </header>
      <div className="mx-auto grid max-w-[1380px] gap-8 px-5 py-7 sm:px-8 lg:grid-cols-[235px_1fr] lg:py-10">
        <aside className="self-start lg:sticky lg:top-6">
          <div className="rounded-[1.7rem] bg-[#202337] p-3 text-[#f8eedc]">
            <div className="px-3 pb-4 pt-3">
              <p className="font-mono-school text-[9px] uppercase tracking-[.16em] text-[#e3b45b]">Content desk</p>
              <p className="mt-2 text-xs leading-5 text-[#f8eedc]/55">Keep the public school site current.</p>
            </div>
            <nav className="grid gap-1" aria-label="Admin content sections">
              {tabItems.map(({ id, label, icon: Icon, count }) => (
                <button key={id} type="button" onClick={() => setTab(id)} className={`flex items-center justify-between rounded-xl px-3 py-3 text-left text-sm font-bold transition-colors ${tab === id ? 'bg-[#e3b45b] text-[#202337]' : 'text-[#f8eedc]/70 hover:bg-white/10 hover:text-[#f8eedc]'}`} data-testid={`button-admin-tab-${id}`}>
                  <span className="flex items-center gap-3"><Icon size={17} /> {label}</span>
                  <span className={`font-mono-school text-[10px] ${tab === id ? 'text-[#202337]/60' : 'text-[#f8eedc]/40'}`}>{count}</span>
                </button>
              ))}
            </nav>
            <div className="mt-5 border-t border-white/10 px-3 pb-2 pt-4">
              <p className="font-mono-school text-[9px] uppercase tracking-[.13em] text-[#f8eedc]/40">Signed in as</p>
              <p className="mt-2 truncate text-sm font-bold">{role.display_name || session.user.email}</p>
              <p className="mt-1 font-mono-school text-[9px] uppercase tracking-[.12em] text-[#e3b45b]">{role.role}</p>
            </div>
          </div>
        </aside>
        <section className="min-w-0">
          <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="font-mono-school text-[10px] font-bold uppercase tracking-[.2em] text-[#c77a22]">Saraswati school office</p>
              <h1 className="mt-3 font-display text-5xl font-bold leading-none tracking-[-.035em] sm:text-6xl">{tab === 'photos' ? 'Gallery photos' : tab === 'notices' ? 'School notices' : 'Disclosure PDFs'}</h1>
              <p className="mt-4 max-w-xl text-sm leading-6 text-[#202337]/60">{tab === 'photos' ? 'Share the moments that make school feel alive.' : tab === 'notices' ? 'Publish a clear, timely update for families.' : 'Keep the school’s public records easy to find.'}</p>
            </div>
            <button type="button" onClick={() => void load()} className="inline-flex w-fit items-center gap-2 rounded-full border border-[#202337]/20 px-4 py-2.5 text-xs font-bold hover:bg-[#e3b45b]/30" data-testid="button-admin-refresh"><RefreshCw size={14} /> Refresh</button>
          </div>
          <AdminFeedback feedback={feedback} />
          {loading ? <AdminLoading message="Loading your content…" /> : content && tab === 'photos' ? <PhotoManager items={content.photos} onChanged={load} onFeedback={setFeedback} /> : null}
          {loading ? null : content && tab === 'notices' ? <NoticeManager items={content.notices} onChanged={load} onFeedback={setFeedback} /> : null}
          {loading ? null : content && tab === 'documents' ? <DocumentManager items={content.documents} onChanged={load} onFeedback={setFeedback} /> : null}
        </section>
      </div>
    </main>
  );
}

function ManagerEmpty({ icon: Icon, title, copy, action }: { icon: typeof ImageIcon; title: string; copy: string; action: () => void }) {
  return (
    <div className="grid min-h-[300px] place-items-center rounded-[1.7rem] border border-dashed border-[#202337]/20 bg-[#fff8ee]/55 p-8 text-center">
      <div>
        <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-[#e3b45b]/25 text-[#c77a22]"><Icon size={29} /></div>
        <h2 className="mt-5 font-display text-3xl font-bold">{title}</h2>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#202337]/55">{copy}</p>
        <button type="button" onClick={action} className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#e3b45b] px-5 py-3 text-sm font-extrabold" data-testid="button-admin-empty-create"><Plus size={16} /> Create the first one</button>
      </div>
    </div>
  );
}

function AdminFormShell({ title, children, onClose }: { title: string; children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[60] flex justify-end bg-[#202337]/55 p-0 sm:p-4">
      <div className="flex h-full w-full max-w-xl flex-col overflow-y-auto bg-[#f8eedc] shadow-2xl sm:rounded-[1.7rem]">
        <div className="flex items-start justify-between gap-4 border-b border-[#202337]/10 px-6 py-5 sm:px-8">
          <div><p className="font-mono-school text-[10px] font-bold uppercase tracking-[.16em] text-[#c77a22]">Edit content</p><h2 className="mt-2 font-display text-4xl font-bold leading-none">{title}</h2></div>
          <button type="button" onClick={onClose} className="grid size-10 shrink-0 place-items-center rounded-full border border-[#202337]/15 hover:bg-[#e3b45b]/30" aria-label="Close editor"><X size={18} /></button>
        </div>
        <div className="flex-1 px-6 py-6 sm:px-8">{children}</div>
      </div>
    </div>
  );
}

function StatusPill({ published }: { published: boolean }) {
  return <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono-school text-[9px] font-bold uppercase tracking-[.1em] ${published ? 'bg-[#3b7f7c]/15 text-[#245c5a]' : 'bg-[#d95340]/12 text-[#8f2e24]'}`}><span className={`size-1.5 rounded-full ${published ? 'bg-[#3b7f7c]' : 'bg-[#d95340]'}`} />{published ? 'Published' : 'Draft'}</span>;
}

function PhotoManager({ items, onChanged, onFeedback }: { items: PhotoRecord[]; onChanged: () => Promise<void>; onFeedback: (feedback: Feedback) => void }) {
  const emptyForm = { id: '', title: '', label: 'School life', text: '', published: true, sort_order: 0, storage_path: '', public_url: '' };
  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState<File | undefined>();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const startCreate = () => { setForm(emptyForm); setFile(undefined); setOpen(true); };
  const startEdit = (item: PhotoRecord) => { setForm({ id: item.id, title: item.title, label: item.label, text: item.text, published: item.published, sort_order: item.sort_order, storage_path: item.storage_path, public_url: item.public_url }); setFile(undefined); setOpen(true); };
  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.id && !file) { onFeedback({ kind: 'error', text: 'Choose an image before saving this gallery item.' }); return; }
    if (file && !['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) { onFeedback({ kind: 'error', text: 'Use a JPG, PNG, WebP or GIF image.' }); return; }
    if (file && file.size > 8 * 1024 * 1024) { onFeedback({ kind: 'error', text: 'Gallery images must be 8 MB or smaller.' }); return; }
    setSaving(true);
    try {
      const input: PhotoInput = { title: form.title.trim(), label: form.label.trim() || 'School life', text: form.text.trim(), published: form.published, sort_order: Number(form.sort_order) || 0 };
      if (form.id) await updatePhoto(form.id, input, file, form.storage_path);
      else await createPhoto(input, file!);
      setOpen(false); onFeedback({ kind: 'success', text: form.id ? 'Gallery photo updated.' : 'Gallery photo added.' }); await onChanged();
    } catch (error) { onFeedback({ kind: 'error', text: error instanceof Error ? error.message : 'The photo could not be saved.' }); }
    finally { setSaving(false); }
  };
  const remove = async (item: PhotoRecord) => {
    if (!window.confirm(`Delete “${item.title}” from the gallery?`)) return;
    try { await deletePhoto(item); onFeedback({ kind: 'success', text: 'Gallery photo deleted.' }); await onChanged(); }
    catch (error) { onFeedback({ kind: 'error', text: error instanceof Error ? error.message : 'The photo could not be deleted.' }); }
  };
  const toggle = async (item: PhotoRecord) => {
    try { await updatePhoto(item.id, { published: !item.published }); onFeedback({ kind: 'success', text: item.published ? 'Photo moved to drafts.' : 'Photo published.' }); await onChanged(); }
    catch (error) { onFeedback({ kind: 'error', text: error instanceof Error ? error.message : 'The publish state could not be changed.' }); }
  };

  return (
    <>
      {items.length === 0 ? <ManagerEmpty icon={ImageIcon} title="No gallery photos yet." copy="Add a school moment for families to discover." action={startCreate} /> : <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{items.map((item) => <article key={item.id} className="group overflow-hidden rounded-[1.5rem] border border-[#202337]/10 bg-[#fff8ee]"><div className="relative aspect-[1.25] overflow-hidden bg-[#3b7f7c]"><img src={item.public_url} alt={item.title} className="size-full object-cover transition-transform duration-500 group-hover:scale-105" /><div className="absolute left-3 top-3"><StatusPill published={item.published} /></div></div><div className="p-5"><div className="flex items-start justify-between gap-3"><div><p className="font-mono-school text-[9px] font-bold uppercase tracking-[.12em] text-[#c77a22]">{item.label}</p><h2 className="mt-2 font-display text-2xl font-bold leading-none">{item.title}</h2></div><GripVertical size={17} className="mt-1 shrink-0 text-[#202337]/25" aria-label="Sort order" /></div><p className="mt-3 line-clamp-2 text-xs leading-5 text-[#202337]/55">{item.text || 'No caption added.'}</p><div className="mt-5 flex flex-wrap gap-2 border-t border-[#202337]/10 pt-4"><button type="button" onClick={() => startEdit(item)} className="inline-flex items-center gap-1.5 rounded-full border border-[#202337]/15 px-3 py-2 text-xs font-bold hover:bg-[#e3b45b]/25" data-testid={`button-photo-edit-${item.id}`}><Pencil size={13} /> Edit</button><button type="button" onClick={() => void toggle(item)} className="inline-flex items-center gap-1.5 rounded-full border border-[#202337]/15 px-3 py-2 text-xs font-bold hover:bg-[#3b7f7c]/10" data-testid={`button-photo-toggle-${item.id}`}>{item.published ? 'Unpublish' : 'Publish'}</button><button type="button" onClick={() => void remove(item)} className="ml-auto grid size-9 place-items-center rounded-full text-[#c94b35] hover:bg-[#d95340]/10" aria-label={`Delete ${item.title}`} data-testid={`button-photo-delete-${item.id}`}><Trash2 size={15} /></button></div></div></article>)}</div>}
      <button type="button" onClick={startCreate} className="fixed bottom-6 right-6 z-20 inline-flex items-center gap-2 rounded-full bg-[#d95340] px-5 py-3.5 text-sm font-extrabold text-[#fff8ee] shadow-xl shadow-[#d95340]/20" data-testid="button-photo-create"><Plus size={17} /> Add photo</button>
      {open && <AdminFormShell title={form.id ? 'Edit gallery photo' : 'Add gallery photo'} onClose={() => setOpen(false)}><form onSubmit={save} className="grid gap-5"><label className="grid gap-2 text-xs font-bold">Photo file {form.id && <span className="font-normal text-[#202337]/45">(optional to replace)</span>}<input required={!form.id} type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={(event) => setFile(event.target.files?.[0])} className="block w-full rounded-xl border border-dashed border-[#202337]/20 bg-[#fff8ee] p-3 text-xs" data-testid="input-photo-file" />{file && <span className="text-xs font-normal text-[#3b7f7c]">{file.name}</span>}</label><label className="grid gap-2 text-xs font-bold">Title<input required value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} className="school-input" placeholder="A bright day at Saraswati" data-testid="input-photo-title" /></label><div className="grid gap-5 sm:grid-cols-2"><label className="grid gap-2 text-xs font-bold">Label<input value={form.label} onChange={(event) => setForm({ ...form, label: event.target.value })} className="school-input" placeholder="Sports Day" data-testid="input-photo-label" /></label><label className="grid gap-2 text-xs font-bold">Sort order<input type="number" min="0" value={form.sort_order} onChange={(event) => setForm({ ...form, sort_order: Number(event.target.value) })} className="school-input" data-testid="input-photo-order" /></label></div><label className="grid gap-2 text-xs font-bold">Caption<textarea rows={4} value={form.text} onChange={(event) => setForm({ ...form, text: event.target.value })} className="school-input resize-none" placeholder="Tell families what makes this moment special." data-testid="input-photo-caption" /></label><label className="flex items-center gap-3 rounded-xl border border-[#202337]/10 bg-[#fff8ee] p-4 text-sm font-bold"><input type="checkbox" checked={form.published} onChange={(event) => setForm({ ...form, published: event.target.checked })} className="size-4 accent-[#3b7f7c]" /> Publish on the public site</label><button disabled={saving} type="submit" className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-[#e3b45b] px-5 py-3.5 text-sm font-extrabold disabled:opacity-60" data-testid="button-photo-save">{saving ? <RefreshCw size={16} className="animate-spin" /> : <Upload size={16} />} {saving ? 'Saving…' : form.id ? 'Save changes' : 'Add photo'}</button></form></AdminFormShell>}
    </>
  );
}

function NoticeManager({ items, onChanged, onFeedback }: { items: NoticeRecord[]; onChanged: () => Promise<void>; onFeedback: (feedback: Feedback) => void }) {
  const emptyForm = { id: '', title: '', body: '', published: true, published_at: null as string | null };
  const [form, setForm] = useState(emptyForm);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const startCreate = () => { setForm(emptyForm); setOpen(true); };
  const startEdit = (item: NoticeRecord) => { setForm({ id: item.id, title: item.title, body: item.body, published: item.published, published_at: item.published_at }); setOpen(true); };
  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setSaving(true);
    try {
      const input: NoticeInput = { title: form.title.trim(), body: form.body.trim(), published: form.published, published_at: form.published_at };
      if (form.id) await updateNotice(form.id, input); else await createNotice(input);
      setOpen(false); onFeedback({ kind: 'success', text: form.id ? 'Notice updated.' : 'Notice created.' }); await onChanged();
    } catch (error) { onFeedback({ kind: 'error', text: error instanceof Error ? error.message : 'The notice could not be saved.' }); }
    finally { setSaving(false); }
  };
  const remove = async (item: NoticeRecord) => {
    if (!window.confirm(`Delete “${item.title}”?`)) return;
    try { await deleteNotice(item); onFeedback({ kind: 'success', text: 'Notice deleted.' }); await onChanged(); }
    catch (error) { onFeedback({ kind: 'error', text: error instanceof Error ? error.message : 'The notice could not be deleted.' }); }
  };
  const toggle = async (item: NoticeRecord) => {
    try { await updateNotice(item.id, { published: !item.published }); onFeedback({ kind: 'success', text: item.published ? 'Notice moved to drafts.' : 'Notice published.' }); await onChanged(); }
    catch (error) { onFeedback({ kind: 'error', text: error instanceof Error ? error.message : 'The publish state could not be changed.' }); }
  };

  return (
    <>
      {items.length === 0 ? <ManagerEmpty icon={Bell} title="No notices yet." copy="Share an update with the school community when you are ready." action={startCreate} /> : <div className="grid gap-3">{items.map((item) => <article key={item.id} className="rounded-[1.5rem] border border-[#202337]/10 bg-[#fff8ee] p-5 transition-colors hover:bg-[#e3b45b]/10 sm:p-6"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start"><div className="min-w-0"><div className="flex flex-wrap items-center gap-3"><StatusPill published={item.published} />{item.published_at && <span className="font-mono-school text-[9px] uppercase tracking-[.1em] text-[#202337]/40">{new Date(item.published_at).toLocaleDateString('en-IN')}</span>}</div><h2 className="mt-3 font-display text-3xl font-bold leading-none">{item.title}</h2><p className="mt-3 whitespace-pre-line text-sm leading-6 text-[#202337]/60">{item.body}</p></div><div className="flex shrink-0 gap-2 sm:opacity-60 sm:transition-opacity sm:group-hover:opacity-100"><button type="button" onClick={() => startEdit(item)} className="inline-flex items-center gap-1.5 rounded-full border border-[#202337]/15 px-3 py-2 text-xs font-bold hover:bg-[#e3b45b]/25" data-testid={`button-notice-edit-${item.id}`}><Pencil size={13} /> Edit</button><button type="button" onClick={() => void toggle(item)} className="rounded-full border border-[#202337]/15 px-3 py-2 text-xs font-bold hover:bg-[#3b7f7c]/10" data-testid={`button-notice-toggle-${item.id}`}>{item.published ? 'Unpublish' : 'Publish'}</button><button type="button" onClick={() => void remove(item)} className="grid size-9 place-items-center rounded-full text-[#c94b35] hover:bg-[#d95340]/10" aria-label={`Delete ${item.title}`} data-testid={`button-notice-delete-${item.id}`}><Trash2 size={15} /></button></div></div></article>)}</div>}
      <button type="button" onClick={startCreate} className="fixed bottom-6 right-6 z-20 inline-flex items-center gap-2 rounded-full bg-[#d95340] px-5 py-3.5 text-sm font-extrabold text-[#fff8ee] shadow-xl shadow-[#d95340]/20" data-testid="button-notice-create"><Plus size={17} /> Add notice</button>
      {open && <AdminFormShell title={form.id ? 'Edit school notice' : 'Add school notice'} onClose={() => setOpen(false)}><form onSubmit={save} className="grid gap-5"><label className="grid gap-2 text-xs font-bold">Title<input required value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} className="school-input" placeholder="Parent meeting this Saturday" data-testid="input-notice-title" /></label><label className="grid gap-2 text-xs font-bold">Notice details<textarea required rows={8} value={form.body} onChange={(event) => setForm({ ...form, body: event.target.value })} className="school-input resize-none" placeholder="Write the update exactly as families should read it." data-testid="input-notice-body" /></label><label className="flex items-center gap-3 rounded-xl border border-[#202337]/10 bg-[#fff8ee] p-4 text-sm font-bold"><input type="checkbox" checked={form.published} onChange={(event) => setForm({ ...form, published: event.target.checked })} className="size-4 accent-[#3b7f7c]" /> Publish on the public site</label><button disabled={saving} type="submit" className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-[#e3b45b] px-5 py-3.5 text-sm font-extrabold disabled:opacity-60" data-testid="button-notice-save">{saving ? <RefreshCw size={16} className="animate-spin" /> : <Check size={16} />} {saving ? 'Saving…' : form.id ? 'Save changes' : 'Publish notice'}</button></form></AdminFormShell>}
    </>
  );
}

function DocumentManager({ items, onChanged, onFeedback }: { items: DisclosureDocumentRecord[]; onChanged: () => Promise<void>; onFeedback: (feedback: Feedback) => void }) {
  const emptyForm = { id: '', section_code: 'B', title: '', published: true, storage_path: '', public_url: '' };
  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState<File | undefined>();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const startCreate = (sectionCode = 'B') => { setForm({ ...emptyForm, section_code: sectionCode }); setFile(undefined); setOpen(true); };
  const startEdit = (item: DisclosureDocumentRecord) => { setForm({ id: item.id, section_code: item.section_code, title: item.title, published: item.published, storage_path: item.storage_path, public_url: item.public_url }); setFile(undefined); setOpen(true); };
  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.id && !file) { onFeedback({ kind: 'error', text: 'Choose a PDF before saving this document.' }); return; }
    if (file && file.type !== 'application/pdf') { onFeedback({ kind: 'error', text: 'Disclosure documents must be PDF files.' }); return; }
    if (file && file.size > 15 * 1024 * 1024) { onFeedback({ kind: 'error', text: 'Disclosure PDFs must be 15 MB or smaller.' }); return; }
    setSaving(true);
    try {
      const input = { section_code: form.section_code, title: form.title.trim(), published: form.published };
      if (form.id) await updateDocument(form.id, input, file, form.storage_path); else await createDocument(input, file!);
      setOpen(false); onFeedback({ kind: 'success', text: form.id ? 'Disclosure document updated.' : 'Disclosure document added.' }); await onChanged();
    } catch (error) { onFeedback({ kind: 'error', text: error instanceof Error ? error.message : 'The document could not be saved.' }); }
    finally { setSaving(false); }
  };
  const remove = async (item: DisclosureDocumentRecord) => {
    if (!window.confirm(`Delete “${item.title}”?`)) return;
    try { await deleteDocument(item); onFeedback({ kind: 'success', text: 'Disclosure document deleted.' }); await onChanged(); }
    catch (error) { onFeedback({ kind: 'error', text: error instanceof Error ? error.message : 'The document could not be deleted.' }); }
  };
  const toggle = async (item: DisclosureDocumentRecord) => {
    try { await updateDocument(item.id, { published: !item.published }); onFeedback({ kind: 'success', text: item.published ? 'Document moved to drafts.' : 'Document published.' }); await onChanged(); }
    catch (error) { onFeedback({ kind: 'error', text: error instanceof Error ? error.message : 'The publish state could not be changed.' }); }
  };
  const groups = useMemo(() => ['B', 'C'].map((code) => ({ code, items: items.filter((item) => item.section_code === code) })), [items]);

  return (
    <>
      {items.length === 0 ? <ManagerEmpty icon={FileText} title="No disclosure PDFs yet." copy="Add a B or C section document so families can view it publicly." action={() => startCreate('B')} /> : <div className="grid gap-8">{groups.map((group) => <section key={group.code}><div className="mb-3 flex items-center justify-between gap-3"><h2 className="font-mono-school text-[10px] font-bold uppercase tracking-[.16em] text-[#c77a22]">{group.code}: {group.code === 'B' ? 'Documents and information' : 'Result and academics'}</h2><button type="button" onClick={() => startCreate(group.code)} className="inline-flex items-center gap-1.5 rounded-full border border-[#202337]/15 px-3 py-2 text-[11px] font-bold hover:bg-[#e3b45b]/25" data-testid={`button-document-create-${group.code}`}><Plus size={13} /> Add</button></div>{group.items.length === 0 ? <div className="rounded-2xl border border-dashed border-[#202337]/15 p-5 text-sm text-[#202337]/45">No documents in this section yet.</div> : <div className="grid gap-3">{group.items.map((item) => <article key={item.id} className="rounded-[1.4rem] border border-[#202337]/10 bg-[#fff8ee] p-5 transition-colors hover:bg-[#e3b45b]/10"><div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"><div className="flex min-w-0 items-start gap-3"><FileText size={19} className="mt-1 shrink-0 text-[#c77a22]" /><div className="min-w-0"><h3 className="font-bold leading-6">{item.title}</h3><div className="mt-2 flex flex-wrap items-center gap-3"><StatusPill published={item.published} />{item.public_url && <a href={item.public_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-mono-school text-[9px] font-bold uppercase tracking-[.1em] text-[#3b5794] hover:underline" data-testid={`link-document-preview-${item.id}`}>Preview <ExternalLink size={11} /></a>}</div></div></div><div className="flex shrink-0 gap-2"><button type="button" onClick={() => startEdit(item)} className="inline-flex items-center gap-1.5 rounded-full border border-[#202337]/15 px-3 py-2 text-xs font-bold hover:bg-[#e3b45b]/25" data-testid={`button-document-edit-${item.id}`}><Pencil size={13} /> Edit</button><button type="button" onClick={() => void toggle(item)} className="rounded-full border border-[#202337]/15 px-3 py-2 text-xs font-bold hover:bg-[#3b7f7c]/10" data-testid={`button-document-toggle-${item.id}`}>{item.published ? 'Unpublish' : 'Publish'}</button><button type="button" onClick={() => void remove(item)} className="grid size-9 place-items-center rounded-full text-[#c94b35] hover:bg-[#d95340]/10" aria-label={`Delete ${item.title}`} data-testid={`button-document-delete-${item.id}`}><Trash2 size={15} /></button></div></div></article>)}</div>}</section>)}</div>}
      {items.length > 0 && <button type="button" onClick={() => startCreate('B')} className="fixed bottom-6 right-6 z-20 inline-flex items-center gap-2 rounded-full bg-[#d95340] px-5 py-3.5 text-sm font-extrabold text-[#fff8ee] shadow-xl shadow-[#d95340]/20" data-testid="button-document-create"><Plus size={17} /> Add PDF</button>}
      {open && <AdminFormShell title={form.id ? 'Edit disclosure PDF' : 'Add disclosure PDF'} onClose={() => setOpen(false)}><form onSubmit={save} className="grid gap-5"><label className="grid gap-2 text-xs font-bold">PDF file {form.id && <span className="font-normal text-[#202337]/45">(optional to replace)</span>}<input required={!form.id} type="file" accept="application/pdf,.pdf" onChange={(event) => setFile(event.target.files?.[0])} className="block w-full rounded-xl border border-dashed border-[#202337]/20 bg-[#fff8ee] p-3 text-xs" data-testid="input-document-file" />{file && <span className="text-xs font-normal text-[#3b7f7c]">{file.name}</span>}</label><label className="grid gap-2 text-xs font-bold">Disclosure section<select value={form.section_code} onChange={(event) => setForm({ ...form, section_code: event.target.value })} className="school-input" data-testid="select-document-section"><option value="B">B · Documents and information</option><option value="C">C · Result and academics</option></select></label><label className="grid gap-2 text-xs font-bold">Document title<input required value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} className="school-input" placeholder="Annual Academic Calendar" data-testid="input-document-title" /></label><label className="flex items-center gap-3 rounded-xl border border-[#202337]/10 bg-[#fff8ee] p-4 text-sm font-bold"><input type="checkbox" checked={form.published} onChange={(event) => setForm({ ...form, published: event.target.checked })} className="size-4 accent-[#3b7f7c]" /> Publish document link publicly</label><button disabled={saving} type="submit" className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-[#e3b45b] px-5 py-3.5 text-sm font-extrabold disabled:opacity-60" data-testid="button-document-save">{saving ? <RefreshCw size={16} className="animate-spin" /> : <Upload size={16} />} {saving ? 'Saving…' : form.id ? 'Save changes' : 'Add PDF'}</button></form></AdminFormShell>}
    </>
  );
}

export default function AdminPage() {
  const [location] = useLocation();
  const [session, setSession] = useState<Session | null>(null);
  const [role, setRole] = useState<StaffRoleRecord | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    let active = true;
    const hydrate = async (nextSession: Session | null) => {
      if (!active) return;
      setSession(nextSession);
      if (!nextSession) {
        setRole(null);
        setLoading(false);
        return;
      }
      try {
        const nextRole = await getStaffRole(nextSession.user.id);
        if (active) setRole(nextRole);
      } catch {
        if (active) setRole(null);
      } finally {
        if (active) setLoading(false);
      }
    };
    void supabase.auth.getSession().then(({ data }) => hydrate(data.session));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      void hydrate(nextSession);
    });
    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  if (loading) return <AdminLoading />;
  if (!session) return <AdminLogin configured={isSupabaseConfigured} />;
  if (!role) {
    return (
      <main className="grid min-h-[100dvh] place-items-center bg-[#f8eedc] px-5 text-center text-[#202337]">
        <div className="max-w-md">
          <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-[#d95340]/15 text-[#c94b35]"><AlertCircle size={30} /></div>
          <p className="mt-6 font-mono-school text-[10px] font-bold uppercase tracking-[.16em] text-[#c77a22]">Access restricted</p>
          <h1 className="mt-3 font-display text-5xl font-bold">This door is for staff.</h1>
          <p className="mt-4 text-sm leading-6 text-[#202337]/60">This Supabase account is signed in, but it has not been approved as a Principal or Admin for the school website.</p>
          <button type="button" onClick={() => void supabase?.auth.signOut()} className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#202337] px-5 py-3 text-sm font-bold text-[#f8eedc]" data-testid="button-admin-access-signout"><LogOut size={15} /> Sign out</button>
        </div>
      </main>
    );
  }
  return <AdminDashboard role={role} session={session} />;
}