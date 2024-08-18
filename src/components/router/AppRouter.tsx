import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// no lazy loading for auth pages to avoid flickering
const AuthLayout = React.lazy(() => import('@app/components/layouts/AuthLayout/AuthLayout'));
import Dashboard from '@app/pages/Dahboard/Dashboard';
import LoginPage from '@app/pages/Login/LoginPage';
import SignUpPage from '@app/pages/Signup/SignUpPage';
import ForgotPasswordPage from '@app/pages/ForgotPasswordPage';
import SecurityCodePage from '@app/pages/SecurityCodePage';
import NewPasswordPage from '@app/pages/NewPasswordPage';
import LockPage from '@app/pages/LockPage';

import MainLayout from '@app/components/layouts/main/MainLayout/MainLayout';
import ProfileLayout from '@app/components/profile/ProfileLayout';
import RequireAuth from '@app/components/router/RequireAuth';
import RequireAuthWithCompany from '@app/components/router/RequireAuthWithCompany';
import { withLoading } from '@app/hocs/withLoading.hoc';
import Companies from '@app/pages/Companies/CompaniesPage';
import Agents from '@app/pages/Agents';
import Managers from '@app/pages/Managers';
import Teams from '@app/pages/Teams';
import Tasks from '@app/pages/Tasks';
import { AddTask } from '../task/addTask/AddTask';

const ServerErrorPage = React.lazy(() => import('@app/pages/ServerErrorPage'));
const Error404Page = React.lazy(() => import('@app/pages/Error404Page'));
const PersonalInfoPage = React.lazy(() => import('@app/pages/PersonalInfoPage'));
const SecuritySettingsPage = React.lazy(() => import('@app/pages/SecuritySettingsPage'));
const PaymentsPage = React.lazy(() => import('@app/pages/PaymentsPage'));

const Logout = React.lazy(() => import('./Logout'));

const ServerError = withLoading(ServerErrorPage);
const Error404 = withLoading(Error404Page);

// Profile
const PersonalInfo = withLoading(PersonalInfoPage);
const SecuritySettings = withLoading(SecuritySettingsPage);
const Payments = withLoading(PaymentsPage);

const AuthLayoutFallback = withLoading(AuthLayout);
const DashboardPage = withLoading(Dashboard);
const LogoutFallback = withLoading(Logout);

export const AppRouter: React.FC = () => {
  const protectedLayout = (
    <RequireAuthWithCompany>
      <MainLayout />
    </RequireAuthWithCompany>
  );

  const protectedLayoutWithoutSideBar = (
    <RequireAuth>
      <MainLayout />
    </RequireAuth>
  );

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={protectedLayout}>
          <Route index element={<DashboardPage />} />
          <Route path="jobs">
            <Route index element={<Tasks />} />
            <Route path="add" element={<AddTask />} />
            <Route path="add/:_id" element={<AddTask />} />
          </Route>
          <Route path="agents">
            <Route index element={<Agents />} />
          </Route>
          <Route path="/managers" element={<Managers />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="server-error" element={<ServerError />} />
          <Route path="404" element={<Error404 />} />
          <Route path="profile" element={<ProfileLayout />}>
            <Route path="personal-info" element={<PersonalInfo />} />
            <Route path="security-settings" element={<SecuritySettings />} />
            <Route path="payments" element={<Payments />} />
          </Route>
        </Route>
        <Route path="/auth" element={<AuthLayoutFallback />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="sign-up" element={<SignUpPage />} />
          <Route
            path="lock"
            element={
              <RequireAuth>
                <LockPage />
              </RequireAuth>
            }
          />
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          <Route path="security-code" element={<SecurityCodePage />} />
          <Route path="new-password" element={<NewPasswordPage />} />
        </Route>
        <Route path="/logout" element={<LogoutFallback />} />
        <Route path="/" element={protectedLayoutWithoutSideBar}>
          <Route path="/companies" element={<Companies />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
