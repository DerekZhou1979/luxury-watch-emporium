import { User, UserRegistration, UserLogin, AuthState } from '../seagull-watch-types';
import { DatabaseManager } from '../database/database-manager';

const db = DatabaseManager.getInstance();

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

      // 保存用户到数据库
      const dbUser = await db.createUser({
        email: userData.email,
        password_hash: hashPassword(userData.password),
        name: userData.name,
        phone: userData.phone,
        status: 'active',
        email_verified: false
      });

      // 转换为前端用户格式
      const newUser: User = {
        id: dbUser.id,
        email: dbUser.email,
        name: dbUser.name,
        phone: dbUser.phone,
        createdAt: dbUser.created_at,
        isActive: dbUser.status === 'active'
      };

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
      const dbUser = await db.findUserByEmail(loginData.email);
      if (!dbUser) {
        return { success: false, message: '邮箱或密码错误' };
      }
      
      // 验证密码
      if (!verifyPassword(loginData.password, dbUser.password_hash)) {
        return { success: false, message: '邮箱或密码错误' };
      }

      // 检查账户状态
      if (dbUser.status !== 'active') {
        return { success: false, message: '账户已被禁用' };
      }

      // 更新最后登录时间
      await db.updateUser(dbUser.id, { 
        last_login_at: new Date().toISOString() 
      });

      // 转换为前端用户格式
      const userData: User = {
        id: dbUser.id,
        email: dbUser.email,
        name: dbUser.name,
        phone: dbUser.phone,
        avatar: dbUser.avatar,
        createdAt: dbUser.created_at,
        lastLoginAt: new Date().toISOString(),
        isActive: dbUser.status === 'active'
      };

      currentUser = userData;

      // 保存登录状态
      if (loginData.rememberMe) {
        localStorage.setItem('seagullAuthToken', dbUser.id);
      } else {
        sessionStorage.setItem('seagullAuthToken', dbUser.id);
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

      const dbUser = await db.findUserById(token);
      if (!dbUser || dbUser.status !== 'active') {
        this.logout();
        return null;
      }

      currentUser = {
        id: dbUser.id,
        email: dbUser.email,
        name: dbUser.name,
        phone: dbUser.phone,
        avatar: dbUser.avatar,
        createdAt: dbUser.created_at,
        lastLoginAt: dbUser.last_login_at,
        isActive: dbUser.status === 'active'
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
      // 验证邮箱格式（如果更新邮箱）
      if (updates.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(updates.email)) {
          return { success: false, message: '邮箱格式不正确' };
        }

        // 检查邮箱是否已被其他用户使用
        const existingUser = await db.findUserByEmail(updates.email);
        if (existingUser && existingUser.id !== userId) {
          return { success: false, message: '该邮箱已被其他用户使用' };
        }
      }

      // 验证手机号格式（如果更新手机号）
      if (updates.phone && !/^1[3-9]\d{9}$/.test(updates.phone)) {
        return { success: false, message: '手机号格式不正确' };
      }

      // 转换为数据库格式
      const dbUpdates: any = {};
      if (updates.email) dbUpdates.email = updates.email;
      if (updates.name) dbUpdates.name = updates.name;
      if (updates.phone) dbUpdates.phone = updates.phone;
      if (updates.avatar) dbUpdates.avatar = updates.avatar;

      // 更新数据库
      await db.updateUser(userId, dbUpdates);

      // 获取更新后的用户信息
      const updatedDbUser = await db.findUserById(userId);
      if (!updatedDbUser) {
        return { success: false, message: '用户不存在' };
      }

      const updatedUser: User = {
        id: updatedDbUser.id,
        email: updatedDbUser.email,
        name: updatedDbUser.name,
        phone: updatedDbUser.phone,
        avatar: updatedDbUser.avatar,
        createdAt: updatedDbUser.created_at,
        lastLoginAt: updatedDbUser.last_login_at,
        isActive: updatedDbUser.status === 'active'
      };

      // 更新当前用户缓存
      if (currentUser && currentUser.id === userId) {
        currentUser = updatedUser;
      }

      return { 
        success: true, 
        message: '信息更新成功！', 
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
      // 验证新密码强度
      if (newPassword.length < 6) {
        return { success: false, message: '新密码长度至少6位' };
      }

      // 获取用户
      const dbUser = await db.findUserById(userId);
      if (!dbUser) {
        return { success: false, message: '用户不存在' };
      }

      // 验证旧密码
      if (!verifyPassword(oldPassword, dbUser.password_hash)) {
        return { success: false, message: '原密码错误' };
      }

      // 更新密码
      await db.updateUser(userId, {
        password_hash: hashPassword(newPassword)
      });

      return { success: true, message: '密码修改成功！' };

    } catch (error) {
      console.error('修改密码失败:', error);
      return { success: false, message: '修改密码失败，请重试' };
    }
  }

  /**
   * 获取用户统计信息
   */
  static async getUserStats(userId: string): Promise<{ totalOrders: number; totalSpent: number; memberSince: string }> {
    try {
      const dbUser = await db.findUserById(userId);
      const userOrders = await db.findOrdersByUser(userId);
      
      const totalSpent = userOrders
        .filter(order => order.status === 'delivered')
        .reduce((sum, order) => sum + order.total_amount, 0);

      return {
        totalOrders: userOrders.length,
        totalSpent,
        memberSince: dbUser?.created_at || new Date().toISOString()
      };

    } catch (error) {
      console.error('获取用户统计失败:', error);
      return {
        totalOrders: 0,
        totalSpent: 0,
        memberSince: new Date().toISOString()
      };
    }
  }

  /**
   * 申请密码重置
   */
  static async requestPasswordReset(email: string): Promise<{ success: boolean; message: string }> {
    try {
      const dbUser = await db.findUserByEmail(email);
      if (!dbUser) {
        // 出于安全考虑，不透露邮箱是否存在
        return { success: true, message: '如果该邮箱已注册，您将收到重置密码的邮件' };
      }

      // 这里应该发送重置密码邮件
      // 实际应用中需要：
      // 1. 生成重置令牌
      // 2. 保存令牌到数据库
      // 3. 发送包含重置链接的邮件

      console.log(`密码重置请求: ${email}`);
      
      return { success: true, message: '如果该邮箱已注册，您将收到重置密码的邮件' };

    } catch (error) {
      console.error('密码重置请求失败:', error);
      return { success: false, message: '请求失败，请重试' };
    }
  }
}

export default AuthService; 