import React, { useState, useEffect } from 'react';
import { AppScreen, Destination, Promotion, Article, Event, Story } from '../types';
import { apiService, API_BASE_URL, getProxiedImageUrl } from '../client';
import StoryViewerScreen from './StoryViewerScreen';
import CreateStoryScreen from './CreateStoryScreen';
import {
  Star, MapPin, ArrowRight, Sun, Cloud, CloudRain,
  CloudLightning, Wind, Droplets, Clock,
  Sparkles, Award, Bell, Thermometer, Info, Calendar, Plus, UserCheck, Users, Bookmark
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const StoriesBar: React.FC<{ stories: Story[], onAddStory: () => void, onViewStory: (index: number) => void }> = ({ stories, onAddStory, onViewStory }) => {
  const { t } = useLanguage();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await apiService.getProfile();
        setProfile(data);
      } catch (e) { console.error(e); }
    };
    loadProfile();
  }, []);

  return (
    <div className="px-5 mb-6 overflow-x-auto no-scrollbar">
      <div className="flex gap-4">
        {/* Add Story Button */}
        <div className="flex flex-col items-center gap-1 cursor-pointer" onClick={onAddStory}>
          <div className="h-[68px] w-[68px] rounded-full border-2 border-gray-200 p-[2px] relative">
            <div className="h-full w-full rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
              <img src={getProxiedImageUrl(profile?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=User")} className="w-full h-full object-cover opacity-50" alt="" />
            </div>
            <div className="absolute bottom-0 right-0 bg-padang-green text-white rounded-full p-1 border-2 border-white">
              <Plus size={12} strokeWidth={4} />
            </div>
          </div>
          <span className="text-[10px] text-gray-600 font-medium">{t.home.stories}</span>
        </div>

        {/* Stories List */}
        {stories.map((story, index) => (
          <div key={story.id} className="flex flex-col items-center gap-1 cursor-pointer" onClick={() => onViewStory(index)}>
            <div className={`h-[72px] w-[72px] rounded-full p-[2px] bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500`}>
              <div className="h-full w-full rounded-full border-2 border-white overflow-hidden p-[2px] bg-white">
                <img src={getProxiedImageUrl(story.media[0]?.url.startsWith('http') ? story.media[0]?.url : `${API_BASE_URL.replace('/api', '')}${story.media[0]?.url}`)} className="w-full h-full rounded-full object-cover" alt="" />
              </div>
            </div>
            <span className="text-[10px] text-gray-600 font-medium max-w-[64px] truncate">{story.user.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const ImageWithPlaceholder: React.FC<{ src: string; alt: string; className: string }> = ({ src, alt, className }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  return (
    <div className="relative w-full h-full overflow-hidden bg-gray-100">
      {!isLoaded && <div className="absolute inset-0 bg-gray-200 animate-pulse" />}
      <img
        src={getProxiedImageUrl(src)}
        alt={alt}
        onLoad={() => setIsLoaded(true)}
        className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-700`}
      />
    </div>
  );
};

const getWeatherInfo = (code: number) => {
  if (code === 0) return { text: 'Cerah', icon: <Sun className="h-8 w-8 text-yellow-500" /> };
  if (code >= 1 && code <= 3) return { text: 'Cerah Berawan', icon: <Cloud className="h-8 w-8 text-blue-400" /> };
  if (code >= 45 && code <= 48) return { text: 'Berkabut', icon: <Cloud className="h-8 w-8 text-gray-400" /> };
  if (code >= 51 && code <= 67) return { text: 'Hujan Gerimis', icon: <CloudRain className="h-8 w-8 text-blue-500" /> };
  if (code >= 71 && code <= 86) return { text: 'Bersalju', icon: <Sparkles className="h-8 w-8 text-blue-200" /> };
  if (code >= 95) return { text: 'Badai Guntur', icon: <CloudLightning className="h-8 w-8 text-yellow-600" /> };
  return { text: 'Berawan', icon: <Cloud className="h-8 w-8 text-gray-400" /> };
};

const HomeScreen: React.FC<{ onNavigate: (screen: AppScreen, data?: any) => void }> = ({ onNavigate }) => {
  const { t } = useLanguage();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [stories, setStories] = useState<Story[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [weather, setWeather] = useState<any>(null);
  const [currentTime, setCurrentTime] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [showCreateStory, setShowCreateStory] = useState(false);
  const [viewStoryIndex, setViewStoryIndex] = useState<number | null>(null);

  const loadData = async () => {
    try {
      const [destData, promoData, eventData, articleData, profileData, storyData, bookingData] = await Promise.all([
        apiService.getDestinations(),
        apiService.getPromotions(),
        apiService.getEvents(),
        apiService.getArticles(),
        apiService.getProfile(),
        apiService.getStories(),
        apiService.getBookings()
      ]);
      setDestinations(destData);
      setPromotions(promoData);
      setEvents(eventData);
      setArticles(articleData);
      setProfile(profileData);
      setStories(storyData);
      setBookings(bookingData);
    } catch (error) {
      console.error("Failed to load data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch('https://api.open-meteo.com/v1/forecast?latitude=-0.9471&longitude=100.4172&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,weather_code');
        const data = await response.json();
        setWeather(data.current);
      } catch (e) {
        console.error("Weather fetch error", e);
      }
    };

    loadData();
    fetchWeather();

    const interval = setInterval(() => {
      setCurrentTime(new Intl.DateTimeFormat('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'Asia/Jakarta' }).format(new Date()));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const weatherInfo = weather ? getWeatherInfo(weather.weather_code) : null;

  if (loading) {
    return (
      <div className="p-6 space-y-8 animate-pulse">
        <div className="flex justify-between items-center">
          <div className="h-10 w-40 bg-gray-200 rounded-lg"></div>
          <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
        </div>
        <div className="h-56 bg-gray-200 rounded-[32px]"></div>
        <div className="h-40 bg-gray-200 rounded-[32px]"></div>
      </div>
    );
  }

  return (
    <div className="pb-10 animate-in fade-in duration-500 relative">
      <div className="pt-4"></div>


      {/* Stories Bar */}
      <StoriesBar
        stories={stories}
        onAddStory={() => setShowCreateStory(true)}
        onViewStory={setViewStoryIndex}
      />



      {/* Quick Access Menu */}
      <div className="px-5 mb-8">
        <div className="flex justify-between items-center gap-3">
          {[
            { label: 'Wisata', icon: MapPin, color: 'text-blue-600', bg: 'bg-blue-100/50', screen: AppScreen.EXPLORE },
            { label: 'Guide', icon: UserCheck, color: 'text-rose-600', bg: 'bg-rose-100/50', screen: AppScreen.GUIDE_MARKETPLACE },
            { label: 'Buddy', icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-100/50', screen: AppScreen.TRAVEL_BUDDY },
            { label: 'Event', icon: Calendar, color: 'text-emerald-600', bg: 'bg-emerald-100/50', screen: AppScreen.EVENTS },
          ].map((item, idx) => (
            <button
              key={idx}
              onClick={() => onNavigate(item.screen)}
              className="flex flex-col items-center gap-2.5 min-w-[64px] group"
            >
              <div className={`h-16 w-16 rounded-[24px] ${item.bg} flex items-center justify-center shadow-sm group-active:scale-90 transition-all duration-300 border border-white`}>
                <item.icon className={`h-7 w-7 ${item.color}`} />
              </div>
              <span className="text-[11px] font-black text-gray-600 uppercase tracking-tighter">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Featured Promo */}
      {promotions.length > 0 && (
        <div className="px-5 mt-6 mb-4">
          <div className="relative rounded-[32px] overflow-hidden shadow-xl border border-white h-72 group cursor-pointer">
            {promotions[0].videoUrl ? (
              <div className="absolute inset-0 w-full h-full pointer-events-none">
                <iframe
                  className="w-[100%] h-[100%] scale-[1.5]"
                  src={`https://www.youtube.com/embed/${((url: string) => {
                    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
                    const match = url.match(regExp);
                    return (match && match[2].length === 11) ? match[2] : url;
                  })(promotions[0].videoUrl)}?autoplay=1&mute=1&controls=0&loop=1&playlist=${((url: string) => {
                    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
                    const match = url.match(regExp);
                    return (match && match[2].length === 11) ? match[2] : url;
                  })(promotions[0].videoUrl)}&showinfo=0&rel=0&modestbranding=1`}
                  allow="autoplay; encrypted-media"
                  frameBorder="0"
                ></iframe>
              </div>
            ) : (
              <ImageWithPlaceholder src={promotions[0].image} alt={promotions[0].title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-8 flex flex-col justify-end pointer-events-auto" onClick={() => onNavigate(AppScreen.PROMO)}>
              <div className="bg-chili-red/90 px-3 py-1 rounded-full self-start mb-3 border border-white/20">
                <span className="text-white text-[10px] font-black uppercase tracking-widest">{promotions[0].discount}</span>
              </div>
              <h3 className="text-3xl font-black text-white mb-2 leading-tight">{promotions[0].title}</h3>
              <p className="text-white/70 text-xs mb-6 max-w-[80%] font-medium">Temukan keseruan wisata dan budaya Padang hanya di aplikasi TIC-PADANG.</p>
              <button className="bg-padang-green text-white text-[11px] font-black py-3.5 px-8 rounded-2xl self-start flex items-center gap-2 active:scale-95 transition-transform shadow-xl shadow-padang-green/40 uppercase tracking-widest">
                Pelajari Selengkapnya <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Special Event Section */}
      {events.length > 0 && (
        <div className="px-5 mb-8">
          <div className="flex justify-between items-center mb-4 px-1">
            <h3 className="text-lg font-black text-gray-800 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-orange-500 fill-orange-500" />
              Promosi Spesial Event
            </h3>
            <button onClick={() => onNavigate(AppScreen.EVENTS)} className="text-padang-green text-[10px] font-black uppercase tracking-widest">Detail</button>
          </div>
          <div className="flex flex-col gap-4 px-1">
            {events
              .filter(e => new Date(e.date) >= new Date())
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
              .slice(0, 3)
              .map((event) => (
                <div
                  key={event.id}
                  onClick={() => onNavigate(AppScreen.EVENTS)}
                  className="w-full bg-white rounded-[28px] shadow-md border border-gray-100 overflow-hidden group cursor-pointer relative"
                >
                  <div className="h-44 relative">
                    <img src={getProxiedImageUrl(event.image)} alt={event.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute top-4 left-4 bg-orange-500 text-white px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-tighter shadow-lg">
                      Soon
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2 text-orange-500">
                        <Calendar className="h-3.5 w-3.5" />
                        <span className="text-[11px] font-black uppercase tracking-tight">{new Date(event.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                      </div>
                      <div className="bg-padang-green/10 text-padang-green px-2 py-0.5 rounded-lg text-[9px] font-bold">
                        {event.price || 'Gratis'}
                      </div>
                    </div>
                    <h4 className="font-bold text-gray-800 text-base mb-2 group-hover:text-padang-green transition-colors">{event.name}</h4>
                    <div className="flex items-center gap-2 text-gray-400">
                      <MapPin className="h-3.5 w-3.5 text-chili-red" />
                      <span className="text-[11px] font-bold">{event.location}</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Destinations (Popular) */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-5 px-6">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-padang-green uppercase tracking-widest mb-1">Pilihan Terbaik</span>
            <h3 className="text-xl font-black text-gray-800 tracking-tight">{t.home.popular_destinations}</h3>
          </div>
          <button onClick={() => onNavigate(AppScreen.EXPLORE)} className="h-10 w-10 bg-white rounded-xl border border-gray-100 flex items-center justify-center text-padang-green shadow-sm active:scale-95 transition-all">
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
        <div className="flex gap-5 overflow-x-auto pb-6 px-6 no-scrollbar snap-x">
          {destinations.map((item) => (
            <div key={item.id} onClick={() => onNavigate(AppScreen.DETAIL, item)} className="min-w-[260px] bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden snap-start hover:shadow-xl transition-all group cursor-pointer">
              <div className="h-44 relative overflow-hidden">
                <ImageWithPlaceholder src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-2xl flex items-center gap-1.5 shadow-lg">
                  <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
                  <span className="text-xs font-black">{item.rating}</span>
                </div>
                <div className="absolute bottom-4 left-4">
                  <span className="bg-padang-green/90 backdrop-blur-md text-white px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest">{item.category}</span>
                </div>
              </div>
              <div className="p-5">
                <h4 className="font-bold text-gray-800 text-base mb-1.5 group-hover:text-padang-green transition-colors">{item.name}</h4>
                <div className="flex items-center gap-2 text-gray-400">
                  <div className="h-6 w-6 rounded-lg bg-red-50 flex items-center justify-center">
                    <MapPin className="h-3.5 w-3.5 text-chili-red" />
                  </div>
                  <span className="text-[11px] font-bold">{item.location}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* News & Articles Section */}
      <section className="px-5 mb-10">
        <div className="flex justify-between items-center mb-6 px-1">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest mb-1">Update Terbaru</span>
            <h3 className="text-xl font-black text-gray-800 tracking-tight">{t.home.recent_articles}</h3>
          </div>
          <button className="text-[11px] font-black text-padang-green uppercase tracking-widest">Lainnya</button>
        </div>

        {/* Category Chips */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-4 mb-2">
          {['Semua', 'Budaya', 'Kuliner', 'Wisata', 'Tips'].map((cat, i) => (
            <button
              key={i}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all ${selectedCategory === cat ? 'bg-padang-green text-white shadow-lg shadow-padang-green/20' : 'bg-white text-gray-400 border border-gray-100 hover:border-padang-green/30'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {articles.filter(a => selectedCategory === 'Semua' || a.category === selectedCategory).length === 0 ? (
            <div className="py-12 bg-gray-50/50 rounded-[32px] border-2 border-dashed border-gray-100 flex flex-col items-center justify-center text-gray-400">
              <Info className="h-8 w-8 mb-2 opacity-20" />
              <p className="text-xs font-bold italic">Belum ada berita untuk kategori ini.</p>
            </div>
          ) : articles.filter(a => selectedCategory === 'Semua' || a.category === selectedCategory).slice(0, 4).map((article) => (
            <div key={article.id} onClick={() => onNavigate(AppScreen.ARTICLE_DETAIL, article)} className="flex gap-4 bg-white p-3 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl transition-all cursor-pointer group active:scale-[0.98]">
              <div className="h-24 w-24 rounded-2xl overflow-hidden flex-shrink-0">
                <ImageWithPlaceholder src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
              </div>
              <div className="flex flex-col justify-center py-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[9px] font-black text-white bg-padang-green px-2.5 py-1 rounded-lg uppercase tracking-widest shadow-sm shadow-padang-green/20">{article.category}</span>
                  <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">{new Date(article.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
                </div>
                <h4 className="text-[15px] font-black text-gray-800 leading-tight line-clamp-2 group-hover:text-padang-green transition-colors">{article.title}</h4>
                <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-tighter">Oleh {article.author}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Weather Section */}
      <section className="px-5 mb-10">
        <div className="bg-gradient-to-br from-white to-gray-50 rounded-[44px] p-8 border border-white shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 h-64 w-64 bg-padang-green/5 rounded-full -mr-32 -mt-32 blur-3xl group-hover:scale-110 transition-transform duration-1000"></div>
          <div className="absolute bottom-0 left-0 h-48 w-48 bg-chili-red/5 rounded-full -ml-24 -mb-24 blur-3xl group-hover:scale-110 transition-transform duration-1000"></div>

          {weather && weatherInfo ? (
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <div className="bg-white/80 backdrop-blur-sm text-padang-green px-4 py-1.5 rounded-full flex items-center gap-2 self-start mb-3 border border-gray-100 shadow-sm">
                    <Clock className="h-3.5 w-3.5" />
                    <span className="text-[10px] font-black uppercase tracking-widest">{currentTime} WIB</span>
                  </div>
                  <h4 className="text-2xl font-black text-gray-800 flex items-center gap-2 tracking-tight">
                    <MapPin className="h-5 w-5 text-padang-green" /> Kota Padang
                  </h4>
                  <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mt-1.5 flex items-center gap-1.5">
                    {weatherInfo.icon} <span className="mt-1">{weatherInfo.text}</span>
                  </p>
                </div>
                <div className="text-right">
                  <div className="flex items-start justify-end text-padang-green drop-shadow-sm">
                    <span className="text-6xl font-black leading-none tracking-tighter">{Math.round(weather.temperature_2m)}</span>
                    <span className="text-2xl font-black mt-1">°</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {[
                  { icon: Thermometer, label: 'Terasa', value: `${Math.round(weather.apparent_temperature)}°`, color: 'text-blue-500', bg: 'bg-blue-50/50' },
                  { icon: Droplets, label: 'Lembab', value: `${weather.relative_humidity_2m}%`, color: 'text-emerald-500', bg: 'bg-emerald-50/50' },
                  { icon: Wind, label: 'Angin', value: `${weather.wind_speed_10m} km/j`, color: 'text-orange-500', bg: 'bg-orange-50/50' }
                ].map((stat, i) => (
                  <div key={i} className={`${stat.bg} p-4 rounded-[28px] border border-white flex flex-col items-center text-center shadow-sm`}>
                    <stat.icon className={`h-5 w-5 ${stat.color} mb-2`} />
                    <p className={`text-[9px] font-black ${stat.color} uppercase tracking-widest mb-1`}>{stat.label}</p>
                    <p className="text-sm font-black text-gray-800">{stat.value}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-40 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-padang-green"></div>
            </div>
          )}
        </div>
      </section>

      {/* Conditional Screens */}
      {showCreateStory && (
        <CreateStoryScreen
          onClose={() => setShowCreateStory(false)}
          onSuccess={() => { setShowCreateStory(false); loadData(); }}
        />
      )}
      {viewStoryIndex !== null && (
        <StoryViewerScreen
          stories={stories}
          initialStoryIndex={viewStoryIndex}
          onClose={() => setViewStoryIndex(null)}
        />
      )}
    </div>
  );
};

export default HomeScreen;
