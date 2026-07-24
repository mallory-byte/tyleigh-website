import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, CheckCircle, Clock, XCircle, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { getProperties, deleteProperty, GetPropertiesOutputType } from 'zite-endpoints-sdk';

type Property = GetPropertiesOutputType['properties'][0];

const statusConfig = {
  available: { label: 'Available', icon: CheckCircle, className: 'bg-green-100 text-green-700' },
  pending:   { label: 'Pending',   icon: Clock,        className: 'bg-yellow-100 text-yellow-700' },
  sold:      { label: 'Sold',      icon: XCircle,      className: 'bg-red-100 text-red-700' },
};

export default function AdminPage() {
  const navigate = useNavigate();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = () => {
    setLoading(true);
    getProperties({}).then(d => { setProperties(d.properties); setLoading(false); });
  };

  useEffect(() => { load(); }, []);

  const filtered = properties.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.state.toLowerCase().includes(search.toLowerCase()) ||
    p.county.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      await deleteProperty({ id: deleteId });
      toast.success('Property deleted.');
      setDeleteId(null);
      load();
    } catch {
      toast.error('Failed to delete property.');
    } finally {
      setDeleting(false);
    }
  };

  const counts = {
    total: properties.length,
    available: properties.filter(p => p.status === 'available').length,
    pending: properties.filter(p => p.status === 'pending').length,
    sold: properties.filter(p => p.status === 'sold').length,
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <div className="bg-primary text-primary-foreground shadow-md">
        <div className="container mx-auto px-4 py-5 flex items-center justify-between">
          <div>
            <p className="text-primary-foreground/60 text-xs uppercase tracking-widest mb-0.5">Ty-Leigh Capital</p>
            <h1 className="text-2xl font-bold" style={{ fontFamily: 'Playfair Display, serif' }}>VA Property Portal</h1>
          </div>
          <Button
            onClick={() => navigate('/admin/property/new')}
            className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold rounded-xl gap-2"
          >
            <Plus className="w-4 h-4" /> Add Property
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Listings', value: counts.total, color: 'text-foreground' },
            { label: 'Available', value: counts.available, color: 'text-green-600' },
            { label: 'Pending', value: counts.pending, color: 'text-yellow-600' },
            { label: 'Sold', value: counts.sold, color: 'text-red-600' },
          ].map(s => (
            <div key={s.label} className="bg-card rounded-2xl border border-border p-5 text-center">
              <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Search + table */}
        <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
          <div className="p-4 border-b border-border flex items-center gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search properties..."
                className="pl-9 rounded-xl"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <p className="text-sm text-muted-foreground ml-auto">{filtered.length} propert{filtered.length !== 1 ? 'ies' : 'y'}</p>
          </div>

          {loading ? (
            <div className="p-4 space-y-3">
              {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-14 w-full rounded-xl" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground">
              <p className="text-lg font-medium">No properties found</p>
              <p className="text-sm mt-1">Try a different search or add a new listing.</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filtered.map((p, i) => {
                const sc = statusConfig[p.status] ?? statusConfig.available;
                const StatusIcon = sc.icon;
                return (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className="flex items-center gap-4 px-5 py-4 hover:bg-muted/40 transition-colors"
                  >
                    <img
                      src={p.image || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&auto=format&fit=crop'}
                      alt={p.title}
                      className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-foreground truncate">{p.title}</p>
                      <p className="text-sm text-muted-foreground">{p.acres} ac · {p.county} Co., {p.state}</p>
                    </div>
                    <div className="hidden md:flex flex-col items-end text-sm">
                      <p className="font-semibold text-foreground">${p.cashPrice.toLocaleString()} cash</p>
                      <p className="text-muted-foreground">${p.monthlyPayment}/mo · ${p.downPayment} down</p>
                    </div>
                    <span className={`hidden sm:flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${sc.className}`}>
                      <StatusIcon className="w-3.5 h-3.5" />
                      {sc.label}
                    </span>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-lg gap-1.5"
                        onClick={() => navigate(`/admin/property/${p.id}/edit`)}
                      >
                        <Pencil className="w-3.5 h-3.5" /> Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="rounded-lg text-destructive hover:text-destructive border-destructive/30 hover:bg-destructive/5"
                        onClick={() => setDeleteId(p.id)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <AlertDialog open={!!deleteId} onOpenChange={open => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this property?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the listing from the database and the public site. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={deleting} className="bg-destructive hover:bg-destructive/90">
              {deleting ? 'Deleting…' : 'Yes, Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
