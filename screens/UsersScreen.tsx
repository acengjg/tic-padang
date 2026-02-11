
import React, { useState, useEffect } from 'react';
import { User, Plus, Pencil, Trash2, X, Check, Search, Filter, Shield, UserPlus } from 'lucide-react';

const API_BASE_URL = `http://${window.location.hostname}:3001/api`;

const UsersScreen: React.FC = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<any>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        phone: '',
        role: 'USER',
        level: '1',
        points: '0'
    });

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_BASE_URL}/users`);
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleOpenModal = (user: any = null) => {
        if (user) {
            setEditingUser(user);
            setFormData({
                name: user.name,
                email: user.email,
                password: '',
                phone: user.phone || '',
                role: user.role || 'USER',
                level: user.level.toString(),
                points: user.points.toString()
            });
        } else {
            setEditingUser(null);
            setFormData({
                name: '',
                email: '',
                password: '',
                phone: '',
                role: 'USER',
                level: '1',
                points: '0'
            });
        }
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingUser(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const url = editingUser ? `${API_BASE_URL}/users/${editingUser.id}` : `${API_BASE_URL}/users`;
        const method = editingUser ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                fetchUsers();
                handleCloseModal();
            }
        } catch (error) {
            console.error('Error saving user:', error);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus pengguna ini?')) {
            try {
                const response = await fetch(`${API_BASE_URL}/users/${id}`, { method: 'DELETE' });
                if (response.ok) {
                    fetchUsers();
                }
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-5 animate-in fade-in duration-500">
            <header className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">Manajemen Pengguna</h2>
                    <p className="text-xs text-gray-500 uppercase tracking-widest font-black mt-1">Admin Panel TIC-PADANG</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="bg-padang-green text-white p-3 rounded-2xl shadow-lg shadow-padang-green/20 hover:scale-105 active:scale-95 transition-all"
                >
                    <UserPlus className="h-5 w-5" />
                </button>
            </header>

            {/* Search Bar */}
            <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                    type="text"
                    placeholder="Cari nama atau email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white border border-gray-100 rounded-2xl py-3.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-padang-green/20 shadow-sm"
                />
            </div>

            {loading ? (
                <div className="space-y-4 animate-pulse">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-20 bg-gray-100 rounded-[24px]"></div>
                    ))}
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredUsers.map((user) => (
                        <div key={user.id} className="bg-white p-4 rounded-[28px] border border-gray-50 shadow-sm flex items-center justify-between group hover:shadow-md transition-all">
                            <div className="flex items-center gap-3">
                                <div className="h-12 w-12 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100 p-0.5">
                                    <img src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} alt="" className="w-full h-full rounded-[14px]" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-800 text-sm">{user.name}</h4>
                                    <p className="text-[10px] text-gray-400 font-medium">{user.email}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <div className="hidden sm:flex flex-col items-end mr-2">
                                    <span className="text-[9px] font-black text-padang-green uppercase">Level {user.level} • {user.role}</span>
                                    <span className="text-[9px] font-bold text-gray-400">{user.points} Poin</span>
                                </div>
                                <button
                                    onClick={() => handleOpenModal(user)}
                                    className="h-9 w-9 bg-padang-green/5 text-padang-green rounded-xl flex items-center justify-center hover:bg-padang-green hover:text-white transition-all"
                                >
                                    <Pencil className="h-4 w-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(user.id)}
                                    className="h-9 w-9 bg-chili-red/5 text-chili-red rounded-xl flex items-center justify-center hover:bg-chili-red hover:text-white transition-all"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    ))}
                    {filteredUsers.length === 0 && (
                        <div className="text-center py-10 text-gray-400">
                            <User className="h-12 w-12 mx-auto mb-3 opacity-20" />
                            <p className="text-sm font-medium">Pengguna tidak ditemukan</p>
                        </div>
                    )}
                </div>
            )}

            {/* Modal CRUD */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-5 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-sm rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-6 bg-padang-green text-white relative">
                            <button
                                onClick={handleCloseModal}
                                className="absolute right-6 top-6 h-8 w-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-all"
                            >
                                <X className="h-4 w-4" />
                            </button>
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 bg-white/20 rounded-xl flex items-center justify-center">
                                    {editingUser ? <Shield className="h-5 w-5" /> : <UserPlus className="h-5 w-5" />}
                                </div>
                                <h3 className="text-lg font-bold">{editingUser ? 'Edit Pengguna' : 'Tambah Pengguna'}</h3>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nama Lengkap</label>
                                <input
                                    required
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-off-white border border-gray-100 rounded-2xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-padang-green/20"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email</label>
                                <input
                                    required
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full bg-off-white border border-gray-100 rounded-2xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-padang-green/20"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Password {editingUser && '(Kosongkan jika tidak diubah)'}</label>
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full bg-off-white border border-gray-100 rounded-2xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-padang-green/20"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Role</label>
                                <select
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                    className="w-full bg-off-white border border-gray-100 rounded-2xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-padang-green/20"
                                >
                                    <option value="USER">USER</option>
                                    <option value="ADMIN">ADMIN</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Level</label>
                                    <input
                                        type="number"
                                        value={formData.level}
                                        onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                                        className="w-full bg-off-white border border-gray-100 rounded-2xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-padang-green/20"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Poin</label>
                                    <input
                                        type="number"
                                        value={formData.points}
                                        onChange={(e) => setFormData({ ...formData, points: e.target.value })}
                                        className="w-full bg-off-white border border-gray-100 rounded-2xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-padang-green/20"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-padang-green text-white py-4 rounded-[20px] font-black text-xs uppercase tracking-widest shadow-xl shadow-padang-green/20 mt-4 active:scale-95 transition-all"
                            >
                                {editingUser ? 'Simpan Perubahan' : 'Tambah Pengguna Sekarang'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UsersScreen;
