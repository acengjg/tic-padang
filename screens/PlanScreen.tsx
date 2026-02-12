
import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, Plus, MoreVertical, Trash2, Bell, BellOff, X, HelpCircle, RefreshCw, Sparkles } from 'lucide-react';
import { apiService } from '../client';

const AI_RECOMMENDATIONS = [
  {
    title: "Wisata Kuliner Legendaris",
    description: "Nikmati cita rasa asli Padang dari pagi hingga malam.",
    items: [
      { time: '08:00', place: 'Katupek Pitalah Purus', activity: 'Sarapan Khas' },
      { time: '12:00', place: 'RM Lamun Ombak', activity: 'Makan Siang Besar' },
      { time: '16:00', place: 'Es Durian Ganti Nan Lamo', activity: 'Dessert Sore' },
      { time: '19:00', place: 'Martabak Kubang Hayuda', activity: 'Makan Malam' }
    ]
  },
  {
    title: "City Tour Padang",
    description: "Jelajahi ikon-ikon kota Padang dalam satu hari.",
    items: [
      { time: '09:00', place: 'Masjid Raya Sumbar', activity: 'Wisata Religi & Arsitektur' },
      { time: '11:00', place: 'Museum Adityawarman', activity: 'Belajar Budaya Padang' },
      { time: '16:00', place: 'Jembatan Siti Nurbaya', activity: 'Pemandangan Kota' },
      { time: '17:30', place: 'Pantai Padang (Taplau)', activity: 'Sunset' }
    ]
  },
  {
    title: "Escape to Nature",
    description: "Menikmati keindahan alam dan pantai.",
    items: [
      { time: '08:30', place: 'Pantai Air Manis', activity: 'Batu Malin Kundang' },
      { time: '13:00', place: 'Bukit Gado-Gado', activity: 'Trekking Ringan & View' },
      { time: '16:30', place: 'Pantai Caroline', activity: 'Santai Sore' }
    ]
  }
];

const ToggleSwitch: React.FC<{
  isActive: boolean;
  onToggle: () => void;
}> = ({ isActive, onToggle }) => {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      className={`relative w-10 h-5 rounded-full transition-colors duration-300 focus:outline-none ${isActive ? 'bg-padang-green' : 'bg-gray-200'
        }`}
    >
      <div
        className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform duration-300 transform ${isActive ? 'translate-x-5' : 'translate-x-0'
          } shadow-sm`}
      />
    </button>
  );
};

const Toast: React.FC<{
  message: string;
  onClose: () => void;
  isVisible: boolean;
}> = ({ message, onClose, isVisible }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-xs animate-in slide-in-from-bottom duration-300">
      <div className="bg-gray-900/90 backdrop-blur-md text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center justify-between border border-white/10">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-padang-green/20 flex items-center justify-center">
            <Bell className="h-4 w-4 text-padang-green" />
          </div>
          <p className="text-[11px] font-bold leading-tight">{message}</p>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full transition-colors">
          <X className="h-4 w-4 text-white/40" />
        </button>
      </div>
    </div>
  );
};

import { AppScreen } from '../types';

interface PlanScreenProps {
  onNavigate?: (screen: AppScreen) => void;
}

const PlanScreen: React.FC<PlanScreenProps> = ({ onNavigate }) => {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeReminders, setActiveReminders] = useState<Set<string>>(new Set());
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({ message: '', visible: false });
  const [showModal, setShowModal] = useState(false);
  const [showSelectionModal, setShowSelectionModal] = useState(false);
  const [showAiRecommendations, setShowAiRecommendations] = useState(false);
  const [planToDelete, setPlanToDelete] = useState<string | null>(null);
  const [newPlan, setNewPlan] = useState<{ title: string; date: string; items: any[] }>({
    title: '',
    date: '',
    items: []
  });
  const [newItem, setNewItem] = useState({ time: '', place: '', activity: '' });

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const data = await apiService.getPlans();
      setPlans(data);
    } catch (error) {
      console.error("Failed to fetch plans:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleToggleReminder = (planId: string, itemIdx: number, place: string, time: string) => {
    const key = `${planId}-${itemIdx}`;
    const newReminders = new Set(activeReminders);

    if (newReminders.has(key)) {
      newReminders.delete(key);
      setToast({ message: `Pengingat untuk ${place} dinonaktifkan.`, visible: true });
    } else {
      newReminders.add(key);
      if (window.navigator.vibrate) {
        window.navigator.vibrate(40);
      }
      setToast({ message: `🔔 Pengingat diatur untuk ${place} pukul ${time}!`, visible: true });
    }

    setActiveReminders(newReminders);
  };

  const handleCreatePlan = async () => {
    if (!newPlan.title || !newPlan.date) {
      alert("Mohon isi judul dan tanggal rencana.");
      return;
    }

    try {
      await apiService.createPlan(newPlan);
      setToast({ message: "Rencana berhasil dibuat!", visible: true });
      setShowModal(false);
      setNewPlan({ title: '', date: '', items: [] });
      fetchPlans();
    } catch (error) {
      alert("Gagal membuat rencana.");
    }
  };

  const handleUseRecommendation = (rec: any) => {
    setNewPlan({
      title: rec.title,
      date: '', // User to pick date
      items: rec.items
    });
    setShowAiRecommendations(false);
    setShowModal(true);
    setToast({ message: "Silakan pilih tanggal untuk rencana ini.", visible: true });
  };

  const handleDeletePlan = (id: string) => {
    setPlanToDelete(id);
  };

  const confirmDeletePlan = async () => {
    if (!planToDelete) return;
    try {
      await apiService.deletePlan(planToDelete);
      setToast({ message: "Rencana berhasil dihapus.", visible: true });
      setPlanToDelete(null);
      fetchPlans();
    } catch (error) {
      alert("Gagal menghapus rencana.");
    }
  };

  const addItemToPlan = () => {
    if (!newItem.time || !newItem.place) return;
    setNewPlan({ ...newPlan, items: [...newPlan.items, newItem] });
    setNewItem({ time: '', place: '', activity: '' });
  };

  const removeItemFromPlan = (idx: number) => {
    const updatedItems = newPlan.items.filter((_, i) => i !== idx);
    setNewPlan({ ...newPlan, items: updatedItems });
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-off-white">
        <RefreshCw className="h-10 w-10 text-padang-green animate-spin" />
      </div>
    );
  }

  return (
    <div className="px-5 py-2 animate-in slide-in-from-right duration-300 min-h-full pb-24">
      <Toast
        message={toast.message}
        isVisible={toast.visible}
        onClose={() => setToast(prev => ({ ...prev, visible: false }))}
      />

      <div className="flex justify-between items-center mb-6 mt-2">
        <h2 className="text-xl font-bold text-gray-800">Rencana Saya</h2>
        <button
          onClick={() => setShowSelectionModal(true)}
          className="h-10 w-10 bg-padang-green text-white rounded-full flex items-center justify-center shadow-lg shadow-padang-green/20 hover:scale-110 active:scale-95 transition-all"
        >
          <Plus className="h-5 w-5" />
        </button>
      </div>

      <div className="space-y-8 relative">
        {plans.length > 0 ? (
          plans.map((plan) => (
            <div key={plan.id} className="relative group/plan">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-golden-maroon/10 p-2 rounded-lg">
                  <Calendar className="h-4 w-4 text-golden-maroon" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-800">{plan.title}</h3>
                  <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">{plan.date}</p>
                </div>
                <button
                  onClick={() => handleDeletePlan(plan.id)}
                  className="ml-auto p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-4 pl-4 border-l-2 border-dashed border-gray-200 ml-4">
                {plan.items && Array.isArray(plan.items) ? plan.items.map((item: any, idx: number) => {
                  const isReminderSet = activeReminders.has(`${plan.id}-${idx}`);
                  return (
                    <div key={item.id || idx} className="relative">
                      <div className={`absolute -left-[25px] top-1 h-3 w-3 rounded-full border-2 shadow-sm transition-colors duration-300 ${isReminderSet ? 'bg-padang-green border-white' : 'bg-white border-gray-300'}`}></div>
                      <div className={`bg-white p-4 rounded-[20px] border transition-all duration-300 shadow-sm flex items-center gap-4 group ${isReminderSet ? 'border-padang-green/30 bg-green-50/20' : 'border-gray-100'}`}>
                        <div className="text-center min-w-[45px]">
                          <p className={`text-[10px] font-black transition-colors ${isReminderSet ? 'text-padang-green' : 'text-gray-400'}`}>
                            {item.time} WIB
                          </p>
                          <Clock className={`h-3 w-3 mx-auto mt-0.5 transition-colors ${isReminderSet ? 'text-padang-green' : 'text-gray-300'}`} />
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-[13px] font-bold text-gray-800">{item.place}</h4>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-[10px] text-gray-500 leading-tight pr-2">{item.activity}</p>
                            <ToggleSwitch
                              isActive={isReminderSet}
                              onToggle={() => handleToggleReminder(plan.id, idx, item.place, item.time)}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }) : null}
              </div>
            </div>
          ))
        ) : (
          <div className="py-20 flex flex-col items-center text-center opacity-40">
            <Calendar className="h-10 w-10 text-gray-300 mb-4" />
            <p className="text-sm font-bold">Belum ada rencana</p>
            <p className="text-xs">Buat rencana perjalananmu sekarang!</p>
          </div>
        )}
      </div>

      <div className="mt-6 mb-20 p-5 bg-white rounded-[24px] border border-gray-100 shadow-sm flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-full bg-padang-green/10 flex items-center justify-center text-padang-green">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[12px] font-bold text-gray-800">Rekomendasi Wisata</p>
            <p className="text-[10px] text-gray-500">Lihat saran itinerary dari AI.</p>
          </div>
        </div>
        <button
          onClick={() => setShowAiRecommendations(true)}
          className="px-4 py-2 bg-padang-green text-white text-xs font-bold rounded-xl shadow-lg shadow-padang-green/20 hover:scale-105 transition-all"
        >
          Lihat Saran
        </button>
      </div>

      {showSelectionModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-lg text-gray-800">Buat Perjalanan</h3>
              <button onClick={() => setShowSelectionModal(false)} className="p-1 hover:bg-gray-100 rounded-full"><X className="h-5 w-5" /></button>
            </div>
            <div className="p-5 space-y-3">
              <button
                onClick={() => {
                  setShowSelectionModal(false);
                  setShowModal(true);
                }}
                className="w-full flex items-center gap-4 p-4 bg-gray-50 hover:bg-padang-green/10 border border-gray-100 hover:border-padang-green/30 rounded-2xl transition-all group text-left"
              >
                <div className="h-12 w-12 bg-white rounded-full flex items-center justify-center shadow-sm text-gray-700 group-hover:text-padang-green transition-colors">
                  <Calendar className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 group-hover:text-padang-green transition-colors">Buat Manual</h4>
                  <p className="text-xs text-gray-500">Susun rencana sendiri sesuai keinginan.</p>
                </div>
              </button>

              <button
                onClick={() => {
                  setShowSelectionModal(false);
                  if (onNavigate) onNavigate(AppScreen.TRIP_PLANNER);
                }}
                className="w-full flex items-center gap-4 p-4 bg-gray-50 hover:bg-purple-50 border border-gray-100 hover:border-purple-200 rounded-2xl transition-all group text-left"
              >
                <div className="h-12 w-12 bg-white rounded-full flex items-center justify-center shadow-sm text-purple-600 transition-colors">
                  <Sparkles className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 group-hover:text-purple-600 transition-colors">AI Trip Planner</h4>
                  <p className="text-xs text-gray-500">Biarkan AI membuatkan rencana untukmu.</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-sm max-h-[80vh] flex flex-col shadow-2xl">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-lg text-gray-800">Buat Rencana Baru</h3>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 rounded-full"><X className="h-5 w-5" /></button>
            </div>

            <div className="p-5 overflow-y-auto custom-scrollbar space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Judul Rencana</label>
                <input
                  type="text"
                  className="w-full bg-gray-50 p-3 rounded-xl text-sm font-bold focus:ring-2 focus:ring-padang-green/20 outline-none"
                  placeholder="Contoh: Liburan di Padang"
                  value={newPlan.title}
                  onChange={(e) => setNewPlan({ ...newPlan, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">Tanggal</label>
                <input
                  type="date"
                  className="w-full bg-gray-50 p-3 rounded-xl text-sm font-bold focus:ring-2 focus:ring-padang-green/20 outline-none"
                  value={newPlan.date}
                  onChange={(e) => setNewPlan({ ...newPlan, date: e.target.value })}
                />
              </div>

              <div className="pt-2">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">Daftar Kegiatan</label>
                </div>

                <div className="space-y-2 mb-3">
                  {newPlan.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg">
                      <Clock className="h-3 w-3 text-gray-400" />
                      <input
                        type="time"
                        className="bg-transparent text-xs font-bold text-gray-700 w-16 focus:bg-white focus:ring-1 focus:ring-padang-green rounded px-1 outline-none transition-all"
                        value={item.time}
                        onChange={(e) => {
                          const updatedItems = [...newPlan.items];
                          updatedItems[idx] = { ...updatedItems[idx], time: e.target.value };
                          setNewPlan({ ...newPlan, items: updatedItems });
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold truncate">{item.place}</p>
                        <p className="text-[10px] text-gray-400 truncate">{item.activity}</p>
                      </div>
                      <button onClick={() => removeItemFromPlan(idx)} className="text-red-400 hover:text-red-600"><X className="h-3 w-3" /></button>
                    </div>
                  ))}
                </div>

                <div className="bg-gray-50 p-3 rounded-xl space-y-2 border border-dashed border-gray-200">
                  <div className="flex gap-2">
                    <input
                      type="time"
                      className="bg-white p-2 rounded-lg text-xs font-bold w-20 outline-none border border-gray-100"
                      value={newItem.time}
                      onChange={(e) => setNewItem({ ...newItem, time: e.target.value })}
                    />
                    <input
                      type="text"
                      className="bg-white p-2 rounded-lg text-xs font-bold flex-1 outline-none border border-gray-100"
                      placeholder="Tempat..."
                      value={newItem.place}
                      onChange={(e) => setNewItem({ ...newItem, place: e.target.value })}
                    />
                  </div>
                  <input
                    type="text"
                    className="w-full bg-white p-2 rounded-lg text-xs outline-none border border-gray-100"
                    placeholder="Aktivitas (opsional)..."
                    value={newItem.activity}
                    onChange={(e) => setNewItem({ ...newItem, activity: e.target.value })}
                  />
                  <button
                    onClick={addItemToPlan}
                    className="w-full bg-gray-800 text-white py-2 rounded-lg text-xs font-bold hover:bg-gray-900 transition-colors"
                  >
                    + Tambah Kegiatan
                  </button>
                </div>
              </div>
            </div>

            <div className="p-5 border-t border-gray-100">
              <button
                onClick={handleCreatePlan}
                className="w-full bg-padang-green text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-padang-green/20 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                Simpan Rencana
              </button>
            </div>
          </div>
        </div>
      )}

      {showAiRecommendations && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-sm max-h-[80vh] flex flex-col shadow-2xl">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-padang-green animate-pulse" />
                <h3 className="font-bold text-lg text-gray-800">Saran AI Padang</h3>
              </div>
              <button onClick={() => setShowAiRecommendations(false)} className="p-1 hover:bg-gray-100 rounded-full"><X className="h-5 w-5" /></button>
            </div>

            <div className="p-5 overflow-y-auto custom-scrollbar space-y-4">
              <p className="text-sm text-gray-500 mb-2">Pilih itinerary yang dibuat khusus untuk pengalaman terbaik di Padang.</p>
              {AI_RECOMMENDATIONS.map((rec, idx) => (
                <div key={idx} className="bg-gray-50 p-4 rounded-2xl border border-gray-100 hover:border-padang-green/30 transition-all">
                  <div className="mb-3">
                    <h4 className="font-bold text-gray-800">{rec.title}</h4>
                    <p className="text-[11px] text-gray-500 leading-tight mt-1">{rec.description}</p>
                  </div>
                  <div className="space-y-2 mb-4">
                    {rec.items.slice(0, 2).map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-[10px] text-gray-600 bg-white p-2 rounded-lg">
                        <Clock className="h-3 w-3 text-padang-green" />
                        <span className="font-bold">{item.time}</span>
                        <span className="truncate">{item.place}</span>
                      </div>
                    ))}
                    {rec.items.length > 2 && <p className="text-[10px] text-center text-gray-400 italic">...dan {rec.items.length - 2} kegiatan lainnya</p>}
                  </div>
                  <button
                    onClick={() => handleUseRecommendation(rec)}
                    className="w-full bg-white border border-gray-200 text-padang-green py-2 rounded-xl font-bold text-xs hover:bg-padang-green hover:text-white transition-all"
                  >
                    Gunakan Rencana Ini
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {planToDelete && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl p-6 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="h-8 w-8 text-red-500" />
            </div>
            <h3 className="font-bold text-lg text-gray-800 mb-2">Hapus Rencana?</h3>
            <p className="text-sm text-gray-500 mb-6">Tindakan ini tidak dapat dibatalkan. Rencana yang dihapus akan hilang selamanya.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setPlanToDelete(null)}
                className="flex-1 py-3 rounded-xl font-bold text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={confirmDeletePlan}
                className="flex-1 py-3 rounded-xl font-bold text-sm bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/30 transition-all"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanScreen;
