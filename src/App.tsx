import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Recipes from './components/Recipes';
import BMICalculator from './components/BMICalculator';
import WeightTracker from './components/WeightTracker';
import Achievements from './components/Achievements';
import UserManagement from './components/admin/UserManagement';
import RecipeManagement from './components/admin/RecipeManagement';
import WebhookTester from './components/admin/WebhookTester';

function AppContent() {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onMenuClick={() => setSidebarOpen(true)} />
      <div className="flex">
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <main className="flex-1 md:ml-64">
          {activeTab === 'dashboard' && <Dashboard setActiveTab={setActiveTab} />}
          {activeTab === 'recipes' && <Recipes />}
          {activeTab === 'bmi' && <BMICalculator />}
          {activeTab === 'weight' && <WeightTracker />}
          {activeTab === 'achievements' && <Achievements />}
          {activeTab === 'users' && <UserManagement />}
          {activeTab === 'manage-recipes' && <RecipeManagement />}
          {activeTab === 'webhook' && <WebhookTester />}
        </main>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;