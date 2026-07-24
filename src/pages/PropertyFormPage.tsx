import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { getProperties, upsertProperty } from 'zite-endpoints-sdk';

const STATES = ['Arizona', 'Arkansas', 'Colorado', 'Florida', 'Nevada', 'New Mexico', 'Other'];
const FEATURE_OPTIONS = [
  'Mountain Views', 'Road Access', 'No HOA', 'Low Taxes', 'Wooded',
  'Hunting Allowed', 'Near Water', 'Off-Grid Friendly', 'Build-Ready', 'Investment Property',
];

type FormData = {
  title: string; state: string; county: string; status: 'Available' | 'Pending' | 'Sold';
  acres: string; cashPrice: string; monthlyPayment: string; downPayment: string;
  description: string; imageUrl: string;
  parcelNumber: string; legalDescription: string;
  access: string; power: string; water: string; septic: string; zoning: string; elevation: string;
  latitude: string; longitude: string;
  features: string[];
};

const empty: FormData = {
  title: '', state: 'Colorado', county: '', status: 'Available',
  acres: '', cashPrice: '', monthlyPayment: '', downPayment: '',
  description: '', imageUrl: '',
  parcelNumber: '', legalDescription: '',
  access: '', power: '', water: '', septic: '', zoning: '', elevation: '',
  latitude: '', longitude: '',
  features: [],
};

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-foreground mb-1.5">
        {label}{required && <span className="text-destructive ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <h2 className="text-base font-bold text-foreground mb-5 pb-3 border-b border-border">{title}</h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

export default function PropertyFormPage() {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const isEdit = !!id && id !== 'new';
  const [form, setForm] = useState<FormData>(empty);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isEdit) return;
    getProperties({}).then(data => {
      const p = data.properties.find(x => x.id === id);
      if (p) {
        setForm({
          title: p.title, state: p.state, county: p.county,
          status: p.status === 'available' ? 'Available' : p.status === 'pending' ? 'Pending' : 'Sold',
          acres: String(p.acres), cashPrice: String(p.cashPrice),
          monthlyPayment: String(p.monthlyPayment), downPayment: String(p.downPayment),
          description: p.description, imageUrl: p.image ?? '',
          parcelNumber: p.parcelId ?? '', legalDescription: p.legalDescription ?? '',
          access: p.access ?? '', power: p.power ?? '', water: p.water ?? '',
          septic: p.septic ?? '', zoning: p.zoning ?? '', elevation: p.elevation ?? '',
          latitude: p.lat ? String(p.lat) : '', longitude: p.lng ? String(p.lng) : '',
          features: p.features ?? [],
        });
      }
      setLoading(false);
    });
  }, [id, isEdit]);

  const set = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [field]: e.target.value }));

  const toggleFeature = (feat: string) =>
    setForm(f => ({
      ...f,
      features: f.features.includes(feat) ? f.features.filter(x => x !== feat) : [...f.features, feat],
    }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.county || !form.acres || !form.cashPrice) {
      toast.error('Please fill in all required fields.');
      return;
    }
    setSaving(true);
    try {
      const result = await upsertProperty({
        id: isEdit ? id : undefined,
        title: form.title, state: form.state, county: form.county, status: form.status,
        acres: parseFloat(form.acres), cashPrice: parseFloat(form.cashPrice),
        monthlyPayment: parseFloat(form.monthlyPayment) || 0,
        downPayment: parseFloat(form.downPayment) || 0,
        description: form.description, imageUrl: form.imageUrl || undefined,
        parcelNumber: form.parcelNumber || undefined, legalDescription: form.legalDescription || undefined,
        access: form.access || undefined, power: form.power || undefined,
        water: form.water || undefined, septic: form.septic || undefined,
        zoning: form.zoning || undefined, elevation: form.elevation || undefined,
        latitude: form.latitude ? parseFloat(form.latitude) : undefined,
        longitude: form.longitude ? parseFloat(form.longitude) : undefined,
        features: form.features.length ? form.features : undefined,
      });
      toast.success(isEdit ? 'Property updated!' : 'Property created!');
      navigate('/admin');
    } catch {
      toast.error('Failed to save property. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-muted/30 pt-0">
        <div className="bg-primary h-16" />
        <div className="container mx-auto px-4 py-8 max-w-3xl space-y-6">
          <Skeleton className="h-8 w-48" />
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-48 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="bg-primary text-primary-foreground shadow-md">
        <div className="container mx-auto px-4 py-5 flex items-center gap-4">
          <button onClick={() => navigate('/admin')} className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <p className="text-primary-foreground/60 text-xs uppercase tracking-widest mb-0.5">VA Property Portal</p>
            <h1 className="text-xl font-bold" style={{ fontFamily: 'Playfair Display, serif' }}>
              {isEdit ? 'Edit Property' : 'Add New Property'}
            </h1>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="container mx-auto px-4 py-8 max-w-3xl space-y-6">

        {/* Basic Info */}
        <Section title="Basic Information">
          <Field label="Property Title" required>
            <Input placeholder="e.g. Costilla County Retreat" value={form.title} onChange={set('title')} required className="rounded-xl" />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="State" required>
              <select value={form.state} onChange={set('state')} className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                {STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
            <Field label="County" required>
              <Input placeholder="e.g. Costilla" value={form.county} onChange={set('county')} required className="rounded-xl" />
            </Field>
          </div>
          <Field label="Listing Status" required>
            <select value={form.status} onChange={set('status')} className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring">
              <option value="Available">Available</option>
              <option value="Pending">Pending</option>
              <option value="Sold">Sold</option>
            </select>
          </Field>
          <Field label="Description">
            <Textarea placeholder="Describe the property — views, use cases, nearby features..." rows={4} value={form.description} onChange={set('description')} className="rounded-xl resize-none" />
          </Field>
          <Field label="Image URL">
            <Input placeholder="https://images.unsplash.com/..." value={form.imageUrl} onChange={set('imageUrl')} className="rounded-xl" />
          </Field>
        </Section>

        {/* Pricing */}
        <Section title="Pricing">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Acres" required>
              <Input type="number" step="0.01" placeholder="5.00" value={form.acres} onChange={set('acres')} required className="rounded-xl" />
            </Field>
            <Field label="Cash Price ($)" required>
              <Input type="number" placeholder="6900" value={form.cashPrice} onChange={set('cashPrice')} required className="rounded-xl" />
            </Field>
            <Field label="Monthly Payment ($)">
              <Input type="number" placeholder="149" value={form.monthlyPayment} onChange={set('monthlyPayment')} className="rounded-xl" />
            </Field>
            <Field label="Down Payment ($)">
              <Input type="number" placeholder="249" value={form.downPayment} onChange={set('downPayment')} className="rounded-xl" />
            </Field>
          </div>
        </Section>

        {/* Property Info */}
        <Section title="Property Information">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Parcel Number">
              <Input placeholder="e.g. R0069080" value={form.parcelNumber} onChange={set('parcelNumber')} className="rounded-xl" />
            </Field>
            <Field label="Zoning">
              <Input placeholder="e.g. A-1 Agricultural" value={form.zoning} onChange={set('zoning')} className="rounded-xl" />
            </Field>
            <Field label="Elevation">
              <Input placeholder="e.g. 7,800 ft" value={form.elevation} onChange={set('elevation')} className="rounded-xl" />
            </Field>
            <Field label="Access">
              <Input placeholder="e.g. Dirt road off County Road 12" value={form.access} onChange={set('access')} className="rounded-xl" />
            </Field>
            <Field label="Power">
              <Input placeholder="e.g. No power — solar recommended" value={form.power} onChange={set('power')} className="rounded-xl" />
            </Field>
            <Field label="Water">
              <Input placeholder="e.g. Well permit required" value={form.water} onChange={set('water')} className="rounded-xl" />
            </Field>
            <Field label="Septic">
              <Input placeholder="e.g. Septic permit required" value={form.septic} onChange={set('septic')} className="rounded-xl" />
            </Field>
          </div>
          <Field label="Legal Description">
            <Textarea placeholder="Full legal description from the county records..." rows={3} value={form.legalDescription} onChange={set('legalDescription')} className="rounded-xl resize-none" />
          </Field>
        </Section>

        {/* Coordinates */}
        <Section title="GPS Coordinates">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Latitude">
              <Input type="number" step="0.000001" placeholder="37.100000" value={form.latitude} onChange={set('latitude')} className="rounded-xl" />
            </Field>
            <Field label="Longitude">
              <Input type="number" step="0.000001" placeholder="-105.300000" value={form.longitude} onChange={set('longitude')} className="rounded-xl" />
            </Field>
          </div>
        </Section>

        {/* Features */}
        <Section title="Property Features">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {FEATURE_OPTIONS.map(feat => (
              <label key={feat} className={`flex items-center gap-2.5 rounded-xl border-2 px-4 py-3 cursor-pointer transition-all ${form.features.includes(feat) ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/40'}`}>
                <input type="checkbox" className="accent-primary" checked={form.features.includes(feat)} onChange={() => toggleFeature(feat)} />
                <span className="text-sm font-medium text-foreground">{feat}</span>
              </label>
            ))}
          </div>
        </Section>

        {/* Submit */}
        <div className="flex gap-3 pb-8">
          <Button type="button" variant="outline" className="flex-1 rounded-xl py-5" onClick={() => navigate('/admin')}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving} className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground rounded-xl py-5 font-bold text-base gap-2">
            {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</> : <><Save className="w-4 h-4" /> {isEdit ? 'Save Changes' : 'Create Listing'}</>}
          </Button>
        </div>
      </form>
    </div>
  );
}
