/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext.tsx';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { Navbar } from './components/Navbar.tsx';
import { Footer } from './components/Footer.tsx';
import { AuthModal } from './components/AuthModal.tsx';
import { OnboardingModal } from './components/OnboardingModal.tsx';
import { OpportunityDetailModal } from './components/OpportunityDetailModal.tsx';
import { LandingView } from './views/LandingView.tsx';
import { DashboardView } from './views/DashboardView.tsx';
import { ExploreView } from './views/ExploreView.tsx';
import { SafeguardView } from './views/SafeguardView.tsx';
import { AssistantView } from './views/AssistantView.tsx';
import { ApplicationToolsView } from './views/ApplicationToolsView.tsx';
import { LearningView } from './views/LearningView.tsx';
import { TrackerView, ApplicationRecord } from './views/TrackerView.tsx';
import { PricingView } from './views/PricingView.tsx';
import { AdminView } from './views/AdminView.tsx';
import { ProfileView } from './views/ProfileView.tsx';
import { LegalView } from './views/LegalView.tsx';
import {
  OpportunityItem,
  CourseItem,
  INITIAL_OPPORTUNITIES,
  INITIAL_COURSES,
} from './lib/seedData.ts';
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  query,
  where,
  doc,
} from 'firebase/firestore';
import { db, initializeDatabaseSeed } from './lib/firebase.ts';

function AppContent() {
  const { currentUser, userProfile, authModalOpen, closeAuthModal, openAuthModal } = useAuth();

  const [currentView, setCurrentView] = useState<string>(() => {
    const params = new URLSearchParams(window.location.search);
    const viewParam = params.get('view');
    if (viewParam) return viewParam;
    if (params.get('autostart') === '1') return 'explore';
    return 'landing';
  });
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string | undefined>(undefined);

  // Data state
  const [opportunities, setOpportunities] = useState<OpportunityItem[]>(INITIAL_OPPORTUNITIES);
  const [courses, setCourses] = useState<CourseItem[]>(INITIAL_COURSES);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [applications, setApplications] = useState<ApplicationRecord[]>([]);

  // Modals state
  const [selectedOppForDetail, setSelectedOppForDetail] = useState<OpportunityItem | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [preselectedToolOpp, setPreselectedToolOpp] = useState<OpportunityItem | null>(null);
  const [defaultToolType, setDefaultToolType] = useState<'cv' | 'cover' | 'email' | 'interview'>('cv');

  // Check URL autostart or view parameter
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const viewParam = params.get('view');
    if (viewParam) {
      setCurrentView(viewParam);
    } else if (params.get('autostart') === '1') {
      setCurrentView('explore');
    }
  }, []);

  // Update default view when authentication status changes
  useEffect(() => {
    if (currentUser) {
      if (currentView === 'landing') {
        setCurrentView('dashboard');
      }
    }
  }, [currentUser]);

  // Load opportunities & courses from Firestore
  const loadOpportunities = async () => {
    try {
      const snap = await getDocs(collection(db, 'opportunities'));
      if (!snap.empty) {
        const list: OpportunityItem[] = [];
        snap.forEach((d) => list.push({ id: d.id, ...d.data() } as OpportunityItem));
        setOpportunities(list);
      } else {
        // Run initial seed if empty
        await initializeDatabaseSeed();
      }
    } catch (err) {
      console.warn('Using baseline verified opportunities repository:', err);
    }
  };

  const loadCourses = async () => {
    try {
      const snap = await getDocs(collection(db, 'courses'));
      if (!snap.empty) {
        const list: CourseItem[] = [];
        snap.forEach((d) => list.push({ id: d.id, ...d.data() } as CourseItem));
        setCourses(list);
      }
    } catch (err) {
      console.warn('Using baseline courses:', err);
    }
  };

  const loadUserSaved = async () => {
    if (!currentUser) {
      setSavedIds([]);
      return;
    }
    try {
      const q = query(collection(db, 'saved_opportunities'), where('userId', '==', currentUser.uid));
      const snap = await getDocs(q);
      const ids: string[] = [];
      snap.forEach((d) => ids.push(d.data().opportunityId));
      setSavedIds(ids);
    } catch (err) {
      console.warn('Error loading saved items:', err);
    }
  };

  const loadUserApplications = async () => {
    if (!currentUser) {
      setApplications([]);
      return;
    }
    try {
      const q = query(collection(db, 'applications'), where('userId', '==', currentUser.uid));
      const snap = await getDocs(q);
      const list: ApplicationRecord[] = [];
      snap.forEach((d) => list.push({ id: d.id, ...d.data() } as ApplicationRecord));
      setApplications(list);
    } catch (err) {
      console.warn('Error loading applications:', err);
    }
  };

  useEffect(() => {
    loadOpportunities();
    loadCourses();
  }, []);

  useEffect(() => {
    loadUserSaved();
    loadUserApplications();
  }, [currentUser]);

  // Toggle bookmark save
  const handleToggleSave = async (opp: OpportunityItem) => {
    if (!currentUser) {
      openAuthModal('signin');
      return;
    }

    const isAlreadySaved = savedIds.includes(opp.id);
    if (isAlreadySaved) {
      setSavedIds((prev) => prev.filter((id) => id !== opp.id));
      try {
        const q = query(
          collection(db, 'saved_opportunities'),
          where('userId', '==', currentUser.uid),
          where('opportunityId', '==', opp.id)
        );
        const snap = await getDocs(q);
        snap.forEach(async (d) => {
          await deleteDoc(doc(db, 'saved_opportunities', d.id));
        });
      } catch (err) {
        console.error(err);
      }
    } else {
      setSavedIds((prev) => [...prev, opp.id]);
      try {
        await addDoc(collection(db, 'saved_opportunities'), {
          userId: currentUser.uid,
          opportunityId: opp.id,
          opportunityTitle: opp.title,
          organization: opp.organization,
          category: opp.category,
          deadline: opp.deadline,
          createdAt: new Date().toISOString(),
        });
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Open Opportunity Detail
  const handleViewDetails = (opp: OpportunityItem) => {
    setSelectedOppForDetail(opp);
    setDetailModalOpen(true);
  };

  // Navigation router
  const handleNavigate = (view: string, filterCategory?: string) => {
    if (filterCategory) {
      setSelectedCategoryFilter(filterCategory);
    } else {
      setSelectedCategoryFilter(undefined);
    }
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Navigate to application tools from detail modal
  const handleNavigateToTools = (
    tool: 'cv' | 'cover' | 'email' | 'interview',
    opp: OpportunityItem
  ) => {
    setPreselectedToolOpp(opp);
    setDefaultToolType(tool);
    setCurrentView('tools');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Track application from detail modal
  const handleTrackApplication = async (opp: OpportunityItem) => {
    if (!currentUser) {
      openAuthModal('signin');
      return;
    }
    try {
      await addDoc(collection(db, 'applications'), {
        userId: currentUser.uid,
        opportunityId: opp.id,
        opportunityTitle: opp.title,
        organization: opp.organization,
        status: 'Planning to Apply',
        deadline: opp.deadline.split('T')[0],
        appliedDate: new Date().toISOString().split('T')[0],
        notes: `Added from official listing: ${opp.officialUrl}`,
        updatedAt: new Date().toISOString(),
      });
      loadUserApplications();
      setCurrentView('tracker');
    } catch (err) {
      console.error(err);
    }
  };

  const showOnboarding = Boolean(currentUser && userProfile && userProfile.isOnboarded === false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      {/* Top Navbar */}
      <Navbar currentView={currentView} onNavigate={handleNavigate} />

      {/* Main View Port */}
      <main className="flex-1">
        {currentView === 'landing' && (
          <LandingView
            opportunities={opportunities}
            savedIds={savedIds}
            onToggleSave={handleToggleSave}
            onViewDetails={handleViewDetails}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'dashboard' && (
          <DashboardView
            opportunities={opportunities}
            courses={courses}
            savedIds={savedIds}
            applicationsCount={applications.length}
            onToggleSave={handleToggleSave}
            onViewDetails={handleViewDetails}
            onNavigate={handleNavigate}
          />
        )}

        {currentView === 'explore' && (
          <ExploreView
            opportunities={opportunities}
            savedIds={savedIds}
            initialCategory={selectedCategoryFilter}
            onToggleSave={handleToggleSave}
            onViewDetails={handleViewDetails}
          />
        )}

        {currentView === 'safeguard' && <SafeguardView />}

        {currentView === 'assistant' && <AssistantView />}

        {currentView === 'tools' && (
          <ApplicationToolsView
            opportunities={opportunities}
            preselectedOpportunity={preselectedToolOpp}
            defaultTool={defaultToolType}
          />
        )}

        {currentView === 'learning' && <LearningView courses={courses} />}

        {currentView === 'tracker' && (
          <TrackerView
            applications={applications}
            onRefresh={loadUserApplications}
          />
        )}

        {currentView === 'pricing' && <PricingView />}

        {currentView === 'admin' && (
          <AdminView
            opportunities={opportunities}
            onRefreshOpportunities={loadOpportunities}
          />
        )}

        {currentView === 'profile' && <ProfileView />}

        {currentView === 'legal' && <LegalView />}
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Global Modals */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={closeAuthModal}
      />

      <OnboardingModal
        isOpen={showOnboarding}
        onComplete={() => {}}
      />

      <OpportunityDetailModal
        opportunity={selectedOppForDetail}
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        isSaved={selectedOppForDetail ? savedIds.includes(selectedOppForDetail.id) : false}
        onToggleSave={handleToggleSave}
        onNavigateToTools={handleNavigateToTools}
        onTrackApplication={handleTrackApplication}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}
