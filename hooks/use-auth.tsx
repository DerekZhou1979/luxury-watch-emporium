import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AuthService } from '../services/auth-service';
import { User, UserLogin, UserRegistration, AuthState } from '../seagull-watch-types';

interface AuthContextType extends AuthState {
  login: (userData: UserLogin) => Promise<{ success: boolean; message: string }>;
  register: (userData: UserRegistration) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<{ success: boolean; message: string }>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<{ success: boolean; message: string }>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: true,
    error: null
  });

  // 检查登录状态
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setAuthState(prev => ({ ...prev, loading: true }));
      const user = await AuthService.checkAuthStatus();
      setAuthState({
        isAuthenticated: !!user,
        user,
        loading: false,
        error: null
      });
    } catch (error) {
      console.error('检查登录状态失败:', error);
      setAuthState({
        isAuthenticated: false,
        user: null,
        loading: false,
        error: '检查登录状态失败'
      });
    }
  };

  const login = async (userData: UserLogin): Promise<{ success: boolean; message: string }> => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      
      const result = await AuthService.login(userData);
      
      if (result.success && result.user) {
        setAuthState({
          isAuthenticated: true,
          user: result.user,
          loading: false,
          error: null
        });
      } else {
        setAuthState(prev => ({
          ...prev,
          loading: false,
          error: result.message
        }));
      }
      
      return result;
    } catch (error) {
      const errorMessage = '登录失败，请重试';
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));
      return { success: false, message: errorMessage };
    }
  };

  const register = async (userData: UserRegistration): Promise<{ success: boolean; message: string }> => {
    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      
      const result = await AuthService.register(userData);
      
      if (result.success && result.user) {
        // 注册成功后自动登录
        const loginResult = await AuthService.login({
          email: userData.email,
          password: userData.password
        });
        
                 if (loginResult.success && loginResult.user) {
           setAuthState({
             isAuthenticated: true,
             user: loginResult.user || null,
             loading: false,
             error: null
           });
        }
      } else {
        setAuthState(prev => ({
          ...prev,
          loading: false,
          error: result.message
        }));
      }
      
      return result;
    } catch (error) {
      const errorMessage = '注册失败，请重试';
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));
      return { success: false, message: errorMessage };
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await AuthService.logout();
      setAuthState({
        isAuthenticated: false,
        user: null,
        loading: false,
        error: null
      });
    } catch (error) {
      console.error('登出失败:', error);
    }
  };

  const updateProfile = async (updates: Partial<User>): Promise<{ success: boolean; message: string }> => {
    if (!authState.user) {
      return { success: false, message: '用户未登录' };
    }

    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      
      const result = await AuthService.updateProfile(authState.user.id, updates);
      
             if (result.success && result.user) {
         setAuthState(prev => ({
           ...prev,
           user: result.user || null,
           loading: false,
           error: null
         }));
      } else {
        setAuthState(prev => ({
          ...prev,
          loading: false,
          error: result.message
        }));
      }
      
      return result;
    } catch (error) {
      const errorMessage = '更新失败，请重试';
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));
      return { success: false, message: errorMessage };
    }
  };

  const changePassword = async (oldPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> => {
    if (!authState.user) {
      return { success: false, message: '用户未登录' };
    }

    try {
      setAuthState(prev => ({ ...prev, loading: true, error: null }));
      
      const result = await AuthService.changePassword(authState.user.id, oldPassword, newPassword);
      
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: result.success ? null : result.message
      }));
      
      return result;
    } catch (error) {
      const errorMessage = '修改密码失败，请重试';
      setAuthState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage
      }));
      return { success: false, message: errorMessage };
    }
  };

  const refreshUser = async (): Promise<void> => {
    await checkAuthStatus();
  };

  return (
    <AuthContext.Provider
      value={{
        ...authState,
        login,
        register,
        logout,
        updateProfile,
        changePassword,
        refreshUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 