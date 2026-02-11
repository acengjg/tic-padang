
import React, { useState, useEffect } from 'react';
import { AppScreen, Destination, Article, TourPackage } from './types';
import { apiService } from './client';
import SplashScreen from './screens/SplashScreen';
import HomeScreen from './screens/HomeScreen';
import ExploreScreen from './screens/ExploreScreen';
import DetailScreen from './screens/DetailScreen';
import PlanScreen from './screens/PlanScreen';
import PromoScreen from './screens/PromoScreen';
import ProfileScreen from './screens/ProfileScreen';
import UsersScreen from './screens/UsersScreen';
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ServicesScreen from './screens/ServicesScreen';
import EventScreen from './screens/EventScreen';
import SettingsScreen from './screens/SettingsScreen';
import ArticleDetailScreen from './screens/ArticleDetailScreen';
import TripPlannerScreen from './screens/TripPlannerScreen';
import GuideMarketplaceScreen from './screens/GuideMarketplaceScreen';
import TourPackageDetailScreen from './screens/TourPackageDetailScreen';
import ChatScreen from './screens/ChatScreen';
import BookingScreen from './screens/BookingScreen';
import TravelBuddyScreen from './screens/TravelBuddyScreen';
import CreateBuddyPostScreen from './screens/CreateBuddyPostScreen';
import ConversationsScreen from './screens/ConversationsScreen';
import BuddyPostDetailScreen from './screens/BuddyPostDetailScreen';
import GuideDashboardScreen from './screens/GuideDashboardScreen';
import CreatePackageScreen from './screens/CreatePackageScreen';
import BottomNav from './components/BottomNav';
import SOSButton from './components/SOSButton';
import TopBar from './components/TopBar';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>(AppScreen.SPLASH);
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);
  const [selectedPackageData, setSelectedPackageData] = useState<TourPackage | null>(null);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [selectedBuddyPostId, setSelectedBuddyPostId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [activeBookingsCount, setActiveBookingsCount] = useState(0);

  const refreshBookings = async () => {
    try {
      const data = await apiService.getBookings();
      const count = data.filter((b: any) => b.bookingStatus === 'PENDING' || b.bookingStatus === 'CONFIRMED').length;
      setActiveBookingsCount(count);
    } catch (e) {
      console.error("App: Failed to fetch bookings", e);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      refreshBookings();
      const interval = setInterval(refreshBookings, 30000); // Check every 30s
      return () => clearInterval(interval);
    }
  }, [isLoggedIn]);

  // Auto-transition from splash to login or home
  useEffect(() => {
    if (currentScreen === AppScreen.SPLASH) {
      const timer = setTimeout(() => {
        const token = localStorage.getItem('user_token');
        if (token) {
          setIsLoggedIn(true);
          setCurrentScreen(AppScreen.HOME);
        } else {
          setCurrentScreen(AppScreen.LOGIN);
        }
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [currentScreen]);

  const handleLoginSuccess = (token: string, user: any) => {
    localStorage.setItem('user_token', token);
    localStorage.setItem('user_data', JSON.stringify(user));
    setIsLoggedIn(true);
    setUserData(user);
    setCurrentScreen(AppScreen.HOME);
  };

  const handleLogout = () => {
    localStorage.removeItem('user_token');
    localStorage.removeItem('user_data');
    setIsLoggedIn(false);
    setUserData(null);
    setCurrentScreen(AppScreen.LOGIN);
  };

  const [navigationData, setNavigationData] = useState<any>(null);
  const [previousScreen, setPreviousScreen] = useState<AppScreen | null>(null);
  const [previousData, setPreviousData] = useState<any>(null);

  const handleNavigate = (screen: AppScreen, data?: any) => {
    setPreviousScreen(currentScreen);
    setPreviousData(navigationData);
    setNavigationData(data);
    if (screen === AppScreen.DETAIL && data) {
      setSelectedDestination(data);
    } else if (screen === AppScreen.ARTICLE_DETAIL && data) {
      setSelectedArticle(data);
    } else if (screen === AppScreen.TOUR_PACKAGE_DETAIL && data) {
      setSelectedPackageId(data);
    } else if (screen === AppScreen.CHAT && data) {
      setSelectedConversationId(data);
    } else if (screen === AppScreen.BOOKING && data) {
      setSelectedPackageData(data);
    } else if (screen === AppScreen.BUDDY_POST_DETAIL && data) {
      setSelectedBuddyPostId(data);
    } else if (screen === AppScreen.CREATE_PACKAGE) {
      setSelectedPackageData(data); // data can be null for new package
    }
    setCurrentScreen(screen);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case AppScreen.SPLASH:
        return <SplashScreen />;
      case AppScreen.LOGIN:
        return <LoginScreen onLoginSuccess={handleLoginSuccess} onNavigate={handleNavigate} />;
      case AppScreen.REGISTER:
        return <RegisterScreen onLoginSuccess={handleLoginSuccess} onNavigate={handleNavigate} />;
      case AppScreen.HOME:
        return <HomeScreen onNavigate={handleNavigate} />;
      case AppScreen.EXPLORE:
        return <ExploreScreen onNavigate={handleNavigate} searchQuery={searchQuery} />;
      case AppScreen.PLAN:
        return <PlanScreen onNavigate={handleNavigate} />;
      case AppScreen.TRIP_PLANNER:
        return <TripPlannerScreen onBack={() => setCurrentScreen(AppScreen.PLAN)} />;
      case AppScreen.GUIDE_MARKETPLACE:
        return <GuideMarketplaceScreen onNavigate={handleNavigate} onBack={() => setCurrentScreen(AppScreen.HOME)} />;
      case AppScreen.PROMO:
        return <PromoScreen />;
      case AppScreen.SERVICES:
        return <ServicesScreen />;
      case AppScreen.EVENTS:
        return <EventScreen onBack={() => setCurrentScreen(AppScreen.HOME)} />;
      case AppScreen.PROFILE:
        return <ProfileScreen onNavigate={handleNavigate} onLogout={handleLogout} initialShowBookings={navigationData?.showBookings} />;
      case AppScreen.ADMIN_USERS:
        return <UsersScreen />;
      case AppScreen.SETTINGS:
        return <SettingsScreen onNavigate={handleNavigate} onBack={() => setCurrentScreen(AppScreen.PROFILE)} />;
      case AppScreen.DETAIL:
        return selectedDestination ? (
          <DetailScreen
            destination={selectedDestination}
            onBack={() => setCurrentScreen(AppScreen.EXPLORE)}
          />
        ) : <HomeScreen onNavigate={handleNavigate} />;
      case AppScreen.TOUR_PACKAGE_DETAIL:
        return selectedPackageId ? (
          <TourPackageDetailScreen
            packageId={selectedPackageId}
            hideBookingBar={previousScreen === AppScreen.PROFILE}
            onBack={() => {
              if (previousScreen === AppScreen.PROFILE) {
                handleNavigate(AppScreen.PROFILE, previousData);
              } else {
                setCurrentScreen(AppScreen.GUIDE_MARKETPLACE);
              }
            }}
            onNavigate={handleNavigate}
          />
        ) : <HomeScreen onNavigate={handleNavigate} />;
      case AppScreen.CHAT:
        return selectedConversationId ? (
          <ChatScreen
            conversationId={selectedConversationId}
            onBack={() => setCurrentScreen(AppScreen.HOME)}
          />
        ) : <HomeScreen onNavigate={handleNavigate} />;
      case AppScreen.CONVERSATIONS:
        return <ConversationsScreen onBack={() => setCurrentScreen(AppScreen.HOME)} onNavigate={handleNavigate} />;
      case AppScreen.BOOKING:
        return selectedPackageData ? (
          <BookingScreen
            pkg={selectedPackageData}
            onBack={() => setCurrentScreen(AppScreen.TOUR_PACKAGE_DETAIL)}
            onSuccess={() => setCurrentScreen(AppScreen.HOME)}
          />
        ) : <HomeScreen onNavigate={handleNavigate} />;
      case AppScreen.TRAVEL_BUDDY:
        return <TravelBuddyScreen onNavigate={handleNavigate} onBack={() => setCurrentScreen(AppScreen.HOME)} />;
      case AppScreen.CREATE_BUDDY_POST:
        return <CreateBuddyPostScreen onBack={() => setCurrentScreen(AppScreen.TRAVEL_BUDDY)} onSuccess={() => setCurrentScreen(AppScreen.TRAVEL_BUDDY)} />;
      case AppScreen.BUDDY_POST_DETAIL:
        return selectedBuddyPostId ? (
          <BuddyPostDetailScreen
            postId={selectedBuddyPostId}
            onBack={() => setCurrentScreen(AppScreen.TRAVEL_BUDDY)}
            onNavigate={handleNavigate}
          />
        ) : <TravelBuddyScreen onNavigate={handleNavigate} onBack={() => setCurrentScreen(AppScreen.HOME)} />;
      case AppScreen.GUIDE_DASHBOARD:
        return <GuideDashboardScreen onBack={() => setCurrentScreen(AppScreen.GUIDE_MARKETPLACE)} onNavigate={handleNavigate} />;
      case AppScreen.CREATE_PACKAGE:
        return (
          <CreatePackageScreen
            editingPackage={selectedPackageData}
            onBack={() => { setSelectedPackageData(null); setCurrentScreen(AppScreen.GUIDE_DASHBOARD); }}
            onSuccess={() => { setSelectedPackageData(null); setCurrentScreen(AppScreen.GUIDE_DASHBOARD); }}
          />
        );
      case AppScreen.ARTICLE_DETAIL:
        return selectedArticle ? (
          <ArticleDetailScreen
            article={selectedArticle}
            onBack={() => setCurrentScreen(AppScreen.HOME)}
          />
        ) : <HomeScreen onNavigate={handleNavigate} />;
      default:
        return <HomeScreen onNavigate={handleNavigate} />;
    }
  };

  if (currentScreen === AppScreen.SPLASH || currentScreen === AppScreen.LOGIN || currentScreen === AppScreen.REGISTER || currentScreen === AppScreen.CHAT || currentScreen === AppScreen.CONVERSATIONS || currentScreen === AppScreen.TOUR_PACKAGE_DETAIL || currentScreen === AppScreen.BOOKING || currentScreen === AppScreen.TRAVEL_BUDDY || currentScreen === AppScreen.CREATE_BUDDY_POST || currentScreen === AppScreen.BUDDY_POST_DETAIL || currentScreen === AppScreen.GUIDE_DASHBOARD || currentScreen === AppScreen.CREATE_PACKAGE) {
    return (
      <div className="relative min-h-screen max-w-md mx-auto bg-white shadow-2xl overflow-hidden flex flex-col">
        {renderScreen()}
      </div>
    );
  }

  return (
    <div className="relative min-h-screen max-w-md mx-auto bg-off-white shadow-2xl overflow-hidden flex flex-col">
      {currentScreen !== AppScreen.DETAIL && currentScreen !== AppScreen.ARTICLE_DETAIL && currentScreen !== AppScreen.TOUR_PACKAGE_DETAIL && currentScreen !== AppScreen.BOOKING && (
        <TopBar
          onSearch={(q) => {
            setSearchQuery(q);
            if (q && currentScreen !== AppScreen.EXPLORE) {
              setCurrentScreen(AppScreen.EXPLORE);
            }
          }}
          value={searchQuery}
          bookingCount={activeBookingsCount}
          onBellClick={() => handleNavigate(AppScreen.PROFILE, { showBookings: true })}
          onChatClick={() => handleNavigate(AppScreen.CONVERSATIONS)}
        />
      )}

      <main className={`flex-1 overflow-y-auto custom-scrollbar ${currentScreen === AppScreen.DETAIL || currentScreen === AppScreen.ARTICLE_DETAIL || currentScreen === AppScreen.TOUR_PACKAGE_DETAIL || currentScreen === AppScreen.BOOKING ? '' : 'pb-32 pt-20'}`}>
        {renderScreen()}
      </main>

      {currentScreen !== AppScreen.DETAIL && currentScreen !== AppScreen.ARTICLE_DETAIL && currentScreen !== AppScreen.TOUR_PACKAGE_DETAIL && currentScreen !== AppScreen.BOOKING && (
        <BottomNav activeScreen={currentScreen} onNavigate={handleNavigate} />
      )}

      <SOSButton />
    </div>
  );
};

export default App;
