import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../contexts/AuthContext';
import { ROUTES, USER_ROLES } from '../config/constants';

// Importăm ecranele pentru autentificare (vom crea aceste fișiere mai târziu)
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';

// Importăm ecranele principale (vom crea aceste fișiere mai târziu)
import HomeScreen from '../screens/main/HomeScreen';
import IncidentsScreen from '../screens/incidents/IncidentsScreen';
import ReportIncidentScreen from '../screens/incidents/ReportIncidentScreen';
import IncidentDetailsScreen from '../screens/incidents/IncidentDetailsScreen';
import RiskAssessmentsScreen from '../screens/risk/RiskAssessmentsScreen';
import TrainingsScreen from '../screens/trainings/TrainingsScreen';
import AttendanceScreen from '../screens/attendance/AttendanceScreen';
import NotificationsScreen from '../screens/notifications/NotificationsScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';

// Importăm ecranele de administrare
import AdminUsersScreen from '../screens/admin/AdminUsersScreen';
import CreateUserScreen from '../screens/admin/CreateUserScreen';
import EditUserScreen from '../screens/admin/EditUserScreen';

// Importăm iconițe pentru tab-uri
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

// Definim tipurile pentru stiva de navigare
type AuthStackParamList = {
  [ROUTES.LOGIN]: undefined;
  [ROUTES.REGISTER]: undefined;
  ForgotPassword: undefined;
};

type MainStackParamList = {
  MainTabs: undefined;
  [ROUTES.REPORT_INCIDENT]: undefined;
  [ROUTES.INCIDENT_DETAILS]: { incidentId: string };
  [ROUTES.ADMIN_USERS]: undefined;
  [ROUTES.CREATE_USER]: undefined;
  [ROUTES.EDIT_USER]: { userId: string };
};

type MainTabsParamList = {
  [ROUTES.HOME]: undefined;
  [ROUTES.INCIDENTS]: undefined;
  [ROUTES.RISK_ASSESSMENTS]: undefined;
  [ROUTES.TRAININGS]: undefined;
  [ROUTES.PROFILE]: undefined;
};

// Creăm stivele de navigare
const AuthStack = createStackNavigator<AuthStackParamList>();
const MainStack = createStackNavigator<MainStackParamList>();
const MainTabs = createBottomTabNavigator<MainTabsParamList>();

// Componenta pentru tab-urile principale
const MainTabsNavigator = () => {
  const { authState } = useAuth();
  const { user } = authState;
  const isAdmin = user?.role === USER_ROLES.ADMIN;

  return (
    <MainTabs.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#1E88E5',
        tabBarInactiveTintColor: '#757575',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E0E0E0',
          paddingBottom: 5,
          paddingTop: 5,
        },
        headerShown: true,
      }}
    >
      <MainTabs.Screen
        name={ROUTES.HOME}
        component={HomeScreen}
        options={{
          tabBarLabel: 'Acasă',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      />
      <MainTabs.Screen
        name={ROUTES.INCIDENTS}
        component={IncidentsScreen}
        options={{
          tabBarLabel: 'Incidente',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="alert-circle" color={color} size={size} />
          ),
        }}
      />
      <MainTabs.Screen
        name={ROUTES.RISK_ASSESSMENTS}
        component={RiskAssessmentsScreen}
        options={{
          tabBarLabel: 'Riscuri',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="shield-check" color={color} size={size} />
          ),
        }}
      />
      <MainTabs.Screen
        name={ROUTES.TRAININGS}
        component={TrainingsScreen}
        options={{
          tabBarLabel: 'Instruiri',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="school" color={color} size={size} />
          ),
        }}
      />
      <MainTabs.Screen
        name={ROUTES.PROFILE}
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profil',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" color={color} size={size} />
          ),
        }}
      />
    </MainTabs.Navigator>
  );
};

// Componenta pentru stiva principală (după autentificare)
const MainStackNavigator = () => {
  const { authState } = useAuth();
  const { user } = authState;
  const isAdmin = user?.role === USER_ROLES.ADMIN;

  return (
    <MainStack.Navigator screenOptions={{ headerShown: false }}>
      <MainStack.Screen name="MainTabs" component={MainTabsNavigator} />
      <MainStack.Screen
        name={ROUTES.REPORT_INCIDENT}
        component={ReportIncidentScreen}
        options={{ headerShown: true, title: 'Raportează incident' }}
      />
      <MainStack.Screen
        name={ROUTES.INCIDENT_DETAILS}
        component={IncidentDetailsScreen}
        options={{ headerShown: true, title: 'Detalii incident' }}
      />
      {isAdmin && (
        <>
          <MainStack.Screen
            name={ROUTES.ADMIN_USERS}
            component={AdminUsersScreen}
            options={{ headerShown: true, title: 'Administrare utilizatori' }}
          />
          <MainStack.Screen
            name={ROUTES.CREATE_USER}
            component={CreateUserScreen}
            options={{ headerShown: true, title: 'Creare utilizator nou' }}
          />
          <MainStack.Screen
            name={ROUTES.EDIT_USER}
            component={EditUserScreen}
            options={{ headerShown: true, title: 'Editare utilizator' }}
          />
        </>
      )}
    </MainStack.Navigator>
  );
};

// Componenta pentru stiva de autentificare
const AuthStackNavigator = () => {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <AuthStack.Screen name={ROUTES.LOGIN} component={LoginScreen} />
      <AuthStack.Screen name={ROUTES.REGISTER} component={RegisterScreen} />
      <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </AuthStack.Navigator>
  );
};

// Navigatorul principal al aplicației
const AppNavigator = () => {
  const { authState } = useAuth();
  const { user, loading } = authState;

  // Dacă încă se încarcă, putem afișa un ecran de încărcare
  if (loading) {
    return null; // Aici ar trebui să afișăm un indicator de încărcare
  }

  return (
    <NavigationContainer>
      {user ? <MainStackNavigator /> : <AuthStackNavigator />}
    </NavigationContainer>
  );
};

export default AppNavigator; 