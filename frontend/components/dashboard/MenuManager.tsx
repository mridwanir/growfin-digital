'use client';

import { useState } from 'react';
import { MenuItem } from '@/lib/types';
import { CloudinaryUploader } from './CloudinaryUploader';
import { PackageTier, PACKAGE_LIMITS } from '@/lib/site-config';
import { Plus, Trash2, Edit2, Check, X, GripVertical } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

interface MenuManagerProps {
  initialMenu: MenuItem[];
  onChange: (menu: MenuItem[]) => void;
  packageTier: PackageTier;
}

export function MenuManager({ initialMenu, onChange, packageTier }: MenuManagerProps) {
  const [menu, setMenu] = useState<MenuItem[]>(initialMenu || []);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<MenuItem>>({});
  
  const supabase = createClient();
  const limit = PACKAGE_LIMITS[packageTier] || PACKAGE_LIMITS['free_trial'];
  const maxProducts = limit.maxProducts;
  const isLimitReached = menu.length >= maxProducts;

  const handleAdd = () => {
    if (isLimitReached) return;
    const newItem: MenuItem = {
      id: Date.now(),
      name: 'Item Baru',
      desc: '',
      price: '0',
      category: 'Umum'
    };
    const updated = [...menu, newItem];
    setMenu(updated);
    onChange(updated);
    setEditingId(newItem.id);
    setEditForm(newItem);
  };

  const handleEdit = (item: MenuItem) => {
    setEditingId(item.id);
    setEditForm(item);
  };

  const handleDelete = async (id: number, publicId?: string) => {
    if (confirm('Yakin ingin menghapus item ini?')) {
      if (publicId) {
        try {
          await supabase.functions.invoke('delete-cloudinary-image', {
            body: { public_id: publicId }
          });
        } catch (e) {
          console.error('Failed to delete image', e);
        }
      }
      const updated = menu.filter(m => m.id !== id);
      setMenu(updated);
      onChange(updated);
    }
  };

  const handleSaveEdit = () => {
    if (!editForm.name) return;
    const updated = menu.map(m => m.id === editingId ? { ...m, ...editForm } as MenuItem : m);
    setMenu(updated);
    onChange(updated);
    setEditingId(null);
  };

  const handleCancelEdit = () => {
    // If it was just added and has default name, remove it
    const item = menu.find(m => m.id === editingId);
    if (item && item.name === 'Item Baru' && !item.desc && item.price === '0') {
      const updated = menu.filter(m => m.id !== editingId);
      setMenu(updated);
      onChange(updated);
    }
    setEditingId(null);
  };

  const handleImageUpload = async (url: string, publicId: string) => {
    if (editForm.imagePublicId) {
      try {
        await supabase.functions.invoke('delete-cloudinary-image', {
          body: { public_id: editForm.imagePublicId }
        });
      } catch (e) {
        console.error('Failed to delete old image', e);
      }
    }
    setEditForm(prev => ({ ...prev, imageUrl: url, imagePublicId: publicId }));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-sm font-bold text-white flex items-center gap-2">Daftar Menu / Layanan</h4>
          <p className="text-xs text-[#8E8EA0] mt-1">
            Batas Paket {packageTier.toUpperCase()}: {menu.length} / {maxProducts} Item
          </p>
        </div>
        <button 
          type="button"
          onClick={handleAdd}
          disabled={isLimitReached}
          className={`px-4 py-2 text-sm font-bold rounded-lg flex items-center gap-2 transition-colors ${
            isLimitReached 
              ? 'bg-[#262633] text-[#8E8EA0] cursor-not-allowed' 
              : 'bg-[#00b894] hover:bg-[#00e0b8] text-[#14141A]'
          }`}
        >
          <Plus className="w-4 h-4" /> Tambah Item
        </button>
      </div>

      <div className="space-y-3">
        {menu.map(item => (
          <div key={item.id} className="bg-[#14141A] border border-[#262633] rounded-xl overflow-hidden">
            {editingId === item.id ? (
              <div className="p-4 space-y-4">
                <div className="flex items-center justify-between border-b border-[#262633] pb-3">
                  <h5 className="font-bold text-white text-sm">Edit Item</h5>
                  <div className="flex gap-2">
                    <button type="button" onClick={handleCancelEdit} className="p-1.5 hover:bg-[#262633] rounded text-[#8E8EA0]"><X className="w-4 h-4" /></button>
                    <button type="button" onClick={handleSaveEdit} className="p-1.5 hover:bg-[#00b894]/20 rounded text-[#00b894]"><Check className="w-4 h-4" /></button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-1">
                    <CloudinaryUploader 
                      currentImageUrl={editForm.imageUrl}
                      onUploadSuccess={handleImageUpload}
                      label="Foto Item"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-[#8E8EA0] mb-1 block">Nama Item</label>
                        <input type="text" value={editForm.name || ''} onChange={e => setEditForm({...editForm, name: e.target.value})} className="w-full bg-[#0B0B0E] border border-[#262633] rounded-lg px-3 py-2 text-sm text-white focus:border-[#00b894] focus:outline-none" />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-[#8E8EA0] mb-1 block">Harga (Rp)</label>
                        <input type="text" value={editForm.price || ''} onChange={e => setEditForm({...editForm, price: e.target.value})} className="w-full bg-[#0B0B0E] border border-[#262633] rounded-lg px-3 py-2 text-sm text-white focus:border-[#00b894] focus:outline-none" />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-[#8E8EA0] mb-1 block">Kategori</label>
                      <input type="text" value={editForm.category || ''} onChange={e => setEditForm({...editForm, category: e.target.value})} className="w-full bg-[#0B0B0E] border border-[#262633] rounded-lg px-3 py-2 text-sm text-white focus:border-[#00b894] focus:outline-none" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-[#8E8EA0] mb-1 block">Deskripsi</label>
                      <textarea value={editForm.desc || ''} onChange={e => setEditForm({...editForm, desc: e.target.value})} className="w-full bg-[#0B0B0E] border border-[#262633] rounded-lg px-3 py-2 text-sm text-white focus:border-[#00b894] focus:outline-none resize-none" rows={2} />
                    </div>
                  </div>
                </div>
                
                <div className="pt-2 flex justify-end">
                  <button type="button" onClick={handleSaveEdit} className="px-4 py-2 bg-white text-black text-sm font-bold rounded-lg hover:bg-gray-200">
                    Simpan Item
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 flex items-center gap-4 hover:bg-[#262633]/30 transition-colors">
                <GripVertical className="w-4 h-4 text-[#8E8EA0] cursor-grab shrink-0 hidden md:block" />
                <div className="w-12 h-12 rounded-lg bg-[#262633] overflow-hidden shrink-0 border border-[#262633]">
                  {item.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-[#8E8EA0]">No IMG</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h5 className="font-bold text-white text-sm truncate">{item.name}</h5>
                    <span className="text-[10px] px-2 py-0.5 bg-[#262633] text-[#8E8EA0] rounded-full shrink-0">{item.category}</span>
                  </div>
                  <p className="text-xs text-[#00b894] font-semibold">{typeof item.price === 'number' ? `Rp ${item.price.toLocaleString('id-ID')}` : item.price}</p>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button type="button" onClick={() => handleEdit(item)} className="p-2 bg-[#262633] hover:bg-[#363645] rounded-lg text-white transition-colors"><Edit2 className="w-4 h-4" /></button>
                  <button type="button" onClick={() => handleDelete(item.id, item.imagePublicId)} className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
            )}
          </div>
        ))}
        {menu.length === 0 && (
          <div className="p-8 border-2 border-dashed border-[#262633] rounded-xl text-center">
            <p className="text-[#8E8EA0] text-sm font-bold">Belum ada item menu.</p>
          </div>
        )}
      </div>
    </div>
  );
}
