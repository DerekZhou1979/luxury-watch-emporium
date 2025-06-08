import { User, UserRegistration, UserLogin, AuthState } from '../seagull-watch-types';
import { db } from '../database/database-manager';

// 当前登录用户
let currentUser: User | null = null;

// 密码哈希模拟（实际应用中应使用bcrypt等安全库）
const hashPassword = (password: string): string => {
  // 简单的哈希模拟，实际应用中要使用真正的哈希算法
  return btoa(password + 'seagull_salt_2024');
};

const verifyPassword = (password: string, hash: string): boolean => {
  return hashPassword(password) === hash;
};

// 用户认证服务类
export class AuthService {
  
  /**
   * 用户注册
   */
  static async register(userData: UserRegistration): Promise<{ success: boolean; message: string; user?: User }> {
    try {
      // 验证邮箱是否已存在
      const existingUser = await db.findUserByEmail(userData.email);
      if (existingUser) {
        return { success: false, message: '该邮箱已被注册' };
      }

      // 验证密码确认
      if (userData.password !== userData.confirmPassword) {
        return { success: false, message: '两次输入的密码不一致' };
      }

      // 验证密码强度
      if (userData.password.length < 6) {
        return { success: false, message: '密码长度至少6位' };
      }

      // 验证邮箱格式
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(userData.email)) {
        return { success: false, message: '邮箱格式不正确' };
      }

      // 验证手机号格式（如果提供）
      if (userData.phone && !/^1[3-9]\d{9}$/.test(userData.phone)) {
        return { success: false, message: '手机号格式不正确' };
      }

      // 创建新用户
      const newUser: User = {
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        email: userData.email,
        name: userData.name,
        phone: userData.phone,
        createdAt: new Date().toISOString(),
        isActive: true
      };

      // 保存用户到数据库
      const dbUser = await db.createUser({
        email: userData.email,
        password_hash: hashPassword(userData.password),
        name: userData.name,
        phone: userData.phone,
        status: 'active',
        email_verified: false
      });

      return { 
        success: true, 
        message: '注册成功！', 
        user: newUser 
      };

    } catch (error) {
      console.error('注册失败:', error);
      return { success: false, message: '注册失败，请重试' };
    }
  }

  /**
   * 用户登录
   */
  static async login(loginData: UserLogin): Promise<{ success: boolean; message: string; user?: User }> {
    try {
      // 查找用户
      const user = users.find(u => u.email === loginData.email) as any;
      if (!user) {
        return { success: false, message: '邮箱或密码错误' };
      }

      // 验证密码
      if (!verifyPassword(loginData.password, user.passwordHash)) {
        return { success: false, message: '邮箱或密码错误' };
      }

      // 检查账户状态
      if (!user.isActive) {
        return { success: false, message: '账户已被禁用' };
      }

      // 更新最后登录时间
      user.lastLoginAt = new Date().toISOString();
      this.saveUsersToStorage();

      // 设置当前用户
      const userData: User = {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        avatar: user.avatar,
        createdAt: user.createdAt,
        lastLoginAt: user.lastLoginAt,
        isActive: user.isActive,
        defaultAddress: user.defaultAddress
      };

      currentUser = userData;

      // 保存登录状态
      if (loginData.rememberMe) {
        localStorage.setItem('seagullAuthToken', user.id);
      } else {
        sessionStorage.setItem('seagullAuthToken', user.id);
      }

      return { 
        success: true, 
        message: '登录成功！', 
        user: userData 
      };

    } catch (error) {
      console.error('登录失败:', error);
      return { success: false, message: '登录失败，请重试' };
    }
  }

  /**
   * 用户登出
   */
  static async logout(): Promise<void> {
    currentUser = null;
    localStorage.removeItem('seagullAuthToken');
    sessionStorage.removeItem('seagullAuthToken');
  }

  /**
   * 获取当前用户
   */
  static getCurrentUser(): User | null {
    return currentUser;
  }

  /**
   * 检查登录状态
   */
  static async checkAuthStatus(): Promise<User | null> {
    try {
      const token = localStorage.getItem('seagullAuthToken') || 
                   sessionStorage.getItem('seagullAuthToken');
      
      if (!token) {
        return null;
      }

      const user = users.find(u => u.id === token) as any;
      if (!user || !user.isActive) {
        this.logout();
        return null;
      }

      currentUser = {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        avatar: user.avatar,
        createdAt: user.createdAt,
        lastLoginAt: user.lastLoginAt,
        isActive: user.isActive,
        defaultAddress: user.defaultAddress
      };

      return currentUser;

    } catch (error) {
      console.error('检查登录状态失败:', error);
      return null;
    }
  }

  /**
   * 更新用户信息
   */
  static async updateProfile(userId: string, updates: Partial<User>): Promise<{ success: boolean; message: string; user?: User }> {
    try {
      const userIndex = users.findIndex(u => u.id === userId);
      if (userIndex === -1) {
        return { success: false, message: '用户不存在' };
      }

      // 验证邮箱唯一性（如果要更新邮箱）
      if (updates.email && updates.email !== users[userIndex].email) {
        const emailExists = users.some(u => u.email === updates.email && u.id !== userId);
        if (emailExists) {
          return { success: false, message: '该邮箱已被使用' };
        }
      }

      // 验证手机号格式（如果提供）
      if (updates.phone && !/^1[3-9]\d{9}$/.test(updates.phone)) {
        return { success: false, message: '手机号格式不正确' };
      }

      // 更新用户信息
      users[userIndex] = { ...users[userIndex], ...updates } as any;
      this.saveUsersToStorage();

      // 更新当前用户缓存
      if (currentUser && currentUser.id === userId) {
        currentUser = { ...currentUser, ...updates };
      }

      const updatedUser: User = {
        id: users[userIndex].id,
        email: users[userIndex].email,
        name: users[userIndex].name,
        phone: users[userIndex].phone,
        avatar: users[userIndex].avatar,
        createdAt: users[userIndex].createdAt,
        lastLoginAt: users[userIndex].lastLoginAt,
        isActive: users[userIndex].isActive,
        defaultAddress: users[userIndex].defaultAddress
      };

      return { 
        success: true, 
        message: '更新成功！', 
        user: updatedUser 
      };

    } catch (error) {
      console.error('更新用户信息失败:', error);
      return { success: false, message: '更新失败，请重试' };
    }
  }

  /**
   * 修改密码
   */
  static async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    try {
      const user = users.find(u => u.id === userId) as any;
      if (!user) {
        return { success: false, message: '用户不存在' };
      }

      // 验证旧密码
      if (!verifyPassword(oldPassword, user.passwordHash)) {
        return { success: false, message: '原密码错误' };
      }

      // 验证新密码强度
      if (newPassword.length < 6) {
        return { success: false, message: '新密码长度至少6位' };
      }

      // 更新密码
      user.passwordHash = hashPassword(newPassword);
      this.saveUsersToStorage();

      return { success: true, message: '密码修改成功！' };

    } catch (error) {
      console.error('修改密码失败:', error);
      return { success: false, message: '修改失败，请重试' };
    }
  }

  /**
   * 保存用户数据到本地存储
   */
  private static saveUsersToStorage(): void {
    localStorage.setItem('seagullUsers', JSON.stringify(users));
  }

  /**
   * 从本地存储加载用户数据
   */
  static loadUsersFromStorage(): void {
    const storedUsers = localStorage.getItem('seagullUsers');
    if (storedUsers) {
      users = JSON.parse(storedUsers);
    }
  }

  /**
   * 重置密码（发送重置链接）
   */
  static async requestPasswordReset(email: string): Promise<{ success: boolean; message: string }> {
    try {
      const user = users.find(u => u.email === email);
      if (!user) {
        // 为安全考虑，即使用户不存在也显示成功消息
        return { success: true, message: '如果该邮箱存在，我们已发送重置链接' };
      }

      // 实际应用中这里会发送邮件
      console.log(`密码重置链接已发送到 ${email}`);
      
      return { success: true, message: '如果该邮箱存在，我们已发送重置链接' };

    } catch (error) {
      console.error('发送重置链接失败:', error);
      return { success: false, message: '发送失败，请重试' };
    }
  }

  /**
   * 获取用户统计信息
   */
  static getUserStats(userId: string): { totalOrders: number; totalSpent: number; memberSince: string } {
    const user = users.find(u => u.id === userId);
    if (!user) {
      return { totalOrders: 0, totalSpent: 0, memberSince: '' };
    }

    // 这里需要从订单服务获取数据，暂时返回模拟数据
    return {
      totalOrders: 0,
      totalSpent: 0,
      memberSince: user.createdAt
    };
  }
}

// 初始化时加载用户数据
AuthService.loadUsersFromStorage(); 