'use client';

import { X, Save, Image as ImageIcon, Type, Plus, Trash2, Edit2, LayoutTemplate, Rocket } from 'lucide-react';
import { BusinessDemo, MenuItem } from '@/lib/types';
import { useState } from 'react';
import { PACKAGE_LIMITS } from '@/lib/site-config';
import { CloudinaryUploader } from '@/components/dashboard/CloudinaryUploader';
import { createClient } from '@/utils/supabase/client';

interface LiveEditorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  client: BusinessDemo;
  onChange: (newClient: BusinessDemo) => void;
  layoutVariant: string;
  onLayoutChange: (newLayout: string) => void;
  templateType: 'fnb' | 'service' | 'retail' | 'grooming';
  slug: string;
  onUpgradeClick: () => void;
}

export function LiveEditorDrawer({
  isOpen,
  onClose,
  client,
  onChange,
  layoutVariant,
  onLayoutChange,
  templateType,
  slug,
  onUpgradeClick
}: LiveEditorDrawerProps) {
  const [activeTab, setActiveTab] = useState<'tema' | 'umum' | 'menu' | 'foto'>('umum');
  const [isConfirmSaveOpen, setIsConfirmSaveOpen] = useState(false);
  const [isPublishConfirmOpen, setIsPublishConfirmOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // States for Menu Editor Form
  const [editingMenuIdx, setEditingMenuIdx] = useState<number | null>(null);
  const [menuForm, setMenuForm] = useState<Partial<MenuItem>>({});

  const supabase = createClient();

  const handleChange = (field: keyof BusinessDemo, value: any) => {
    onChange({ ...client, [field]: value });
  };

  // Helper to determine available themes
  const getAvailableThemes = () => {
    if (templateType === 'fnb') {
      if (client.category.toLowerCase().includes('restaurant')) {
        return [
          { id: 'fnb-restaurant-default', label: 'Restaurant Premium' },
          { id: 'fnb-restaurant-artisan', label: 'Restaurant Artisan' }
        ];
      } else if (client.category.toLowerCase().includes('bakery') || client.category.toLowerCase().includes('dessert')) {
        return [
          { id: 'fnb-bakeryndessert-default', label: 'Bakery Default' }
        ];
      } else if (client.category.toLowerCase().includes('fastfood') || client.category.toLowerCase().includes('burger')) {
        return [
          { id: 'fnb-fastfood-default', label: 'Fast Food Crunch' }
        ];
      } else if (client.category.toLowerCase().includes('boba') || client.category.toLowerCase().includes('juice') || client.category.toLowerCase().includes('tea')) {
        return [
          { id: 'fnb-bubleteanjuice-default', label: 'Boba & Juice' }
        ];
      } else {
        return [
          { id: 'fnb-cafe-default', label: 'Cafe Classic' },
          { id: 'fnb-cafe-alternatif', label: 'Cafe Modern' }
        ];
      }
    } else if (templateType === 'grooming') {
      if (client.category.toLowerCase().includes('barber') || client.category.toLowerCase().includes('pangkas') || client.category.toLowerCase().includes('cukur')) {
        return [
          { id: 'grooming-barbershop-default', label: 'Barbershop Vintage' },
          { id: 'grooming-barbershop-light', label: 'Salon Chic' }
        ];
      }
      if (client.category.toLowerCase().includes('nail') || client.category.toLowerCase().includes('manicure') || client.category.toLowerCase().includes('pedicure')) {
        return [
          { id: 'grooming-nailspa-default', label: 'Aesthetic Nail Studio' }
        ];
      }
      return [
        { id: 'grooming-beautynspa-default', label: 'Beauty Minimalist' },
        { id: 'grooming-beautynspa-lumiere', label: 'Beauty Lumiere' },
        { id: 'grooming-beautynspa-dayspa', label: 'Beauty  Sanctuary' }
      ];
    } else if (templateType === 'retail') {
      const isGroceries = client.category.toLowerCase().includes('supermarket') ||
        client.category.toLowerCase().includes('convenience') ||
        client.category.toLowerCase().includes('grosir') ||
        client.category.toLowerCase().includes('minimarket');

      const isElectronic = client.category.toLowerCase().includes('electronic') ||
        client.category.toLowerCase().includes('gadget') ||
        client.category.toLowerCase().includes('computer');

      if (isGroceries) {
        return [
          { id: 'retail-groceries-default', label: 'Groceries Fresh' },
          { id: 'retail-groceries-artisan', label: 'Artisan Pantry' }
        ];
      }
      if (isElectronic) {
        return [
          { id: 'retail-electronic-default', label: 'Electronic Light' },
          { id: 'retail-electronic-dark', label: 'Electronic Dark' }
        ];
      }

      return [
        { id: 'retail-clothing-default', label: 'Retail Clothing' },
        { id: 'retail-clothing-editorial', label: 'Retail Editorial' }
      ];
    }
    return [{ id: layoutVariant, label: 'Theme Default' }];
  };
  const themes = getAvailableThemes();

  // Menu CRUD handlers
  const handleSaveMenuForm = () => {
    if (!menuForm.name || !menuForm.price) return;
    const updatedMenu = [...client.menu];
    if (editingMenuIdx !== null) {
      updatedMenu[editingMenuIdx] = menuForm as MenuItem;
    } else {
      updatedMenu.push({
        ...(menuForm as MenuItem),
        id: Date.now()
      });
    }
    handleChange('menu', updatedMenu);
    setEditingMenuIdx(null);
    setMenuForm({});
  };

  const handleDeleteMenu = async (idx: number) => {
    const updated = [...client.menu];
    const itemToDelete = updated[idx];
    if (itemToDelete.imagePublicId) {
      try {
        await supabase.functions.invoke('delete-cloudinary-image', {
          body: { public_id: itemToDelete.imagePublicId }
        });
      } catch (e) {
        console.error('Failed to delete old image', e);
      }
    }
    updated.splice(idx, 1);
    handleChange('menu', updated);
  };

  const openMenuForm = (idx: number | null) => {
    if (idx !== null) {
      setMenuForm({ ...client.menu[idx] });
      setEditingMenuIdx(idx);
    } else {
      setMenuForm({ name: '', desc: '', price: '', category: 'Semua', imageUrl: '' });
      setEditingMenuIdx(null);
    }
  };

  // Save to API
  const handleSaveToAPI = async (publish: boolean) => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/demo/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug,
          clientData: client,
          layout_id: layoutVariant,
          publish
        })
      });

      if (!res.ok) throw new Error('Failed to save');

      if (publish && (!client.package_tier || client.package_tier === 'free_trial')) {
        onClose(); // Close editor
        onUpgradeClick(); // Trigger Checkout Logic
      } else {
        alert(publish ? 'Perubahan berhasil di-publish!' : 'Draft berhasil disimpan!');
      }
    } catch (error) {
      console.error(error);
      alert('Gagal menyimpan perubahan. Silakan coba lagi.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[110]"
          onClick={onClose}
        />
      )}

      {/* Publish Confirmation Modal */}
      {isPublishConfirmOpen && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
          <div className="bg-[#14141A] border border-[#262633] p-6 md:p-8 rounded-2xl max-w-sm w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 bg-amber-500/10 text-amber-500 rounded-full flex items-center justify-center mb-4 border border-amber-500/20">
              <Rocket className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-black text-white mb-2">Publish Perubahan?</h3>
            <p className="text-sm text-[#8E8EA0] mb-6">
              Jika Anda melakukan publish, semua perubahan yang Anda buat akan langsung online dan bisa dilihat oleh semua pengunjung website Anda. Anda yakin?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setIsPublishConfirmOpen(false)}
                disabled={isSaving}
                className="flex-1 py-2.5 px-4 rounded-xl font-bold text-white bg-[#262633] hover:bg-[#323242] transition-colors"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  setIsPublishConfirmOpen(false);
                  handleSaveToAPI(true);
                }}
                disabled={isSaving}
                className="flex-1 py-2.5 px-4 rounded-xl font-bold text-[#14141A] bg-[#00b894] hover:bg-[#00e0b8] shadow-[0_0_15px_rgba(0,184,148,0.3)] transition-all flex justify-center items-center gap-2"
              >
                {isSaving ? 'Tunggu...' : 'Ya, Publish!'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[400px] bg-[#0B0B0E] border-l border-[#262633] z-[120] transform transition-transform duration-300 ease-in-out flex flex-col shadow-2xl ${isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#262633] bg-[#14141A]">
          <h3 className="font-bold text-white flex items-center gap-2">
            <Type className="w-4 h-4 text-[#00b894]" />
            Live Editor
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-[#8E8EA0] hover:text-white rounded-lg hover:bg-[#262633] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#262633] overflow-x-auto scrollbar-hide">
          {['tema', 'umum', 'menu', 'foto'].map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t as any)}
              className={`px-4 py-3 text-[11px] font-bold uppercase tracking-wider border-b-2 whitespace-nowrap transition-colors ${activeTab === t ? 'border-[#00b894] text-[#00b894]' : 'border-transparent text-[#8E8EA0] hover:text-white'
                }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">

          {/* TAB TEMA */}
          {activeTab === 'tema' && (
            <div className="space-y-4">
              <label className="text-xs font-bold text-[#8E8EA0] uppercase flex items-center gap-2">
                <LayoutTemplate className="w-4 h-4" /> Layout Tema
              </label>
              {themes.length === 1 ? (
                <div className="p-4 rounded-xl border border-[#00b894]/30 bg-[#00b894]/10 text-white text-sm">
                  <p className="font-semibold text-[#00b894]">{themes[0].label}</p>
                  <p className="text-xs text-[#8E8EA0] mt-1">Hanya 1 tema eksklusif yang tersedia untuk kategori bisnis ini.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {themes.map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => onLayoutChange(theme.id)}
                      className={`w-full p-4 rounded-xl border text-left flex items-center justify-between transition-colors ${layoutVariant === theme.id
                        ? 'border-[#00b894] bg-[#00b894]/10 text-[#00b894]'
                        : 'border-[#262633] bg-[#14141A] text-[#8E8EA0] hover:border-[#8E8EA0]'
                        }`}
                    >
                      <span className="font-semibold text-sm">{theme.label}</span>
                      {layoutVariant === theme.id && <div className="w-2 h-2 rounded-full bg-[#00b894]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB UMUM */}
          {activeTab === 'umum' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#8E8EA0] uppercase">Nama Bisnis</label>
                <input
                  type="text"
                  value={client.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="w-full bg-[#14141A] border border-[#262633] rounded-xl px-4 py-3 text-sm text-white focus:border-[#00b894] focus:outline-none transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-[#8E8EA0] uppercase">Tagline</label>
                <textarea
                  value={client.tagline}
                  onChange={(e) => handleChange('tagline', e.target.value)}
                  rows={2}
                  className="w-full bg-[#14141A] border border-[#262633] rounded-xl px-4 py-3 text-sm text-white focus:border-[#00b894] focus:outline-none transition-colors resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#8E8EA0] uppercase">Jam Buka</label>
                  <input
                    type="time"
                    value={client.openTime || ''}
                    onChange={(e) => handleChange('openTime', e.target.value)}
                    className="w-full bg-[#14141A] border border-[#262633] rounded-xl px-4 py-3 text-sm text-white focus:border-[#00b894] focus:outline-none transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#8E8EA0] uppercase">Jam Tutup</label>
                  <input
                    type="time"
                    value={client.closeTime || ''}
                    onChange={(e) => handleChange('closeTime', e.target.value)}
                    className="w-full bg-[#14141A] border border-[#262633] rounded-xl px-4 py-3 text-sm text-white focus:border-[#00b894] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-[#14141A] border border-[#262633] rounded-xl">
                <div>
                  <label className="text-sm font-bold text-white block">Status Toko</label>
                  <span className="text-xs text-[#8E8EA0]">Tampilkan label Buka/Tutup</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={client.isOpen !== false} // default true
                    onChange={(e) => handleChange('isOpen', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-[#262633] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00b894]"></div>
                </label>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-[#8E8EA0] uppercase">Warna Tema (Hex)</label>
                <div className="flex gap-3">
                  <input
                    type="color"
                    value={client.themeColor || '#000000'}
                    onChange={(e) => handleChange('themeColor', e.target.value)}
                    className="w-12 h-12 rounded bg-transparent border-0 cursor-pointer p-0"
                  />
                  <input
                    type="text"
                    value={client.themeColor || ''}
                    onChange={(e) => handleChange('themeColor', e.target.value)}
                    className="flex-1 bg-[#14141A] border border-[#262633] rounded-xl px-4 py-3 text-sm text-white focus:border-[#00b894] focus:outline-none uppercase font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB MENU */}
          {activeTab === 'menu' && (
            <div className="space-y-4">
              {menuForm.name !== undefined ? (
                <div className="bg-[#14141A] border border-[#262633] rounded-xl p-4 space-y-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-sm font-bold text-white">{editingMenuIdx !== null ? 'Edit Menu' : 'Tambah Menu'}</h4>
                    <button onClick={() => setMenuForm({})} className="text-[#8E8EA0] hover:text-white"><X className="w-4 h-4" /></button>
                  </div>
                  <input type="text" placeholder="Nama Menu" value={menuForm.name || ''} onChange={(e) => setMenuForm(prev => ({ ...prev, name: e.target.value }))} className="w-full bg-[#0B0B0E] border border-[#262633] rounded-lg px-3 py-2 text-sm text-white focus:border-[#00b894] focus:outline-none" />
                  <input type="text" placeholder="Harga (misal: Rp 15.000)" value={menuForm.price || ''} onChange={(e) => setMenuForm(prev => ({ ...prev, price: e.target.value }))} className="w-full bg-[#0B0B0E] border border-[#262633] rounded-lg px-3 py-2 text-sm text-white focus:border-[#00b894] focus:outline-none" />
                  <textarea placeholder="Deskripsi Singkat" value={menuForm.desc || ''} onChange={(e) => setMenuForm(prev => ({ ...prev, desc: e.target.value }))} className="w-full bg-[#0B0B0E] border border-[#262633] rounded-lg px-3 py-2 text-sm text-white focus:border-[#00b894] focus:outline-none resize-none" rows={2} />
                  <input type="text" placeholder="Kategori (misal: Makanan Utama)" value={menuForm.category || ''} onChange={(e) => setMenuForm(prev => ({ ...prev, category: e.target.value }))} className="w-full bg-[#0B0B0E] border border-[#262633] rounded-lg px-3 py-2 text-sm text-white focus:border-[#00b894] focus:outline-none" />
                  <div className="pt-2">
                    <CloudinaryUploader
                      currentImageUrl={menuForm.imageUrl}
                      onUploadSuccess={async (url, publicId) => {
                        if (menuForm.imagePublicId) {
                          try {
                            await supabase.functions.invoke('delete-cloudinary-image', {
                              body: { public_id: menuForm.imagePublicId }
                            });
                          } catch (e) {
                            console.error('Failed to delete old menu image', e);
                          }
                        }
                        setMenuForm(prev => ({ ...prev, imageUrl: url, imagePublicId: publicId }));
                      }}
                      label="Foto Item"
                    />
                  </div>
                  <button onClick={handleSaveMenuForm} className="w-full py-2 bg-white text-black font-bold rounded-lg text-sm hover:bg-gray-200">Simpan Item</button>
                </div>
              ) : (
                <>
                  {client.menu.length >= PACKAGE_LIMITS[client.package_tier || 'free_trial'].maxProducts ? (
                    <button onClick={onUpgradeClick} className="w-full py-3 border border-dashed border-amber-500 text-amber-500 rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-amber-500/10 transition-colors text-sm">
                      Paket {client.package_tier || 'free_trial'} hanya mendukung (Maks {PACKAGE_LIMITS[client.package_tier || 'free_trial'].maxProducts}). Menu.
                    </button>
                  ) : (
                    <button onClick={() => openMenuForm(null)} className="w-full py-3 border border-dashed border-[#00b894] text-[#00b894] rounded-xl font-bold flex justify-center items-center gap-2 hover:bg-[#00b894]/10 transition-colors text-sm">
                      <Plus className="w-4 h-4" /> Tambah Menu / Layanan
                    </button>
                  )}
                  <div className="space-y-3">
                    {client.menu.map((item, idx) => (
                      <div key={item.id} className="p-3 bg-[#14141A] border border-[#262633] rounded-xl flex gap-3 items-center">
                        {item.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={item.imageUrl} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-[#262633] flex items-center justify-center text-xs text-[#8E8EA0]">Foto</div>
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-white truncate">{item.name}</h4>
                          <p className="text-xs text-[#00b894]">{item.price}</p>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => openMenuForm(idx)} className="p-2 text-[#8E8EA0] hover:text-white bg-[#262633] rounded-lg"><Edit2 className="w-3 h-3" /></button>
                          <button onClick={() => handleDeleteMenu(idx)} className="p-2 text-red-400 hover:text-red-300 bg-red-400/10 rounded-lg"><Trash2 className="w-3 h-3" /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* TAB FOTO */}
          {activeTab === 'foto' && (
            <div className="space-y-6">
              <div className="space-y-4">
                <CloudinaryUploader
                  currentImageUrl={client.heroImage}
                  onUploadSuccess={async (url, publicId) => {
                    if (client.heroImagePublicId) {
                      try {
                        await supabase.functions.invoke('delete-cloudinary-image', {
                          body: { public_id: client.heroImagePublicId }
                        });
                      } catch (e) {
                        console.error('Failed to delete old hero image', e);
                      }
                    }
                    onChange({ ...client, heroImage: url, heroImagePublicId: publicId });
                  }}
                  label="Hero Banner Utama"
                />
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#262633] bg-[#14141A] flex gap-3">
          <button
            onClick={() => handleSaveToAPI(false)}
            disabled={isSaving}
            className="flex-1 py-3 bg-[#262633] hover:bg-[#323242] text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" /> {isSaving ? 'Menyimpan...' : 'Simpan Draft'}
          </button>
          <button
            onClick={() => setIsPublishConfirmOpen(true)}
            disabled={isSaving}
            className="flex-1 py-3 bg-[#00b894] hover:bg-[#00e0b8] text-[#14141A] font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(0,184,148,0.3)]"
          >
            <Rocket className="w-4 h-4" /> Publish
          </button>
        </div>
      </div>
    </>
  );
}
