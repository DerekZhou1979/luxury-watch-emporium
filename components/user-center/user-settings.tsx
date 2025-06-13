import React, { useState } from 'react';
import { useAuth } from '../../hooks/use-auth';
import { User } from '../../seagull-watch-types';

interface UserSettingsProps {
  user: User;
}

interface ShippingAddress {
  id: string;
  name: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  address: string;
  isDefault: boolean;
}

const UserSettings: React.FC<UserSettingsProps> = ({ user }) => {
  const { updateProfile, changePassword } = useAuth();
  const [activeSection, setActiveSection] = useState<'profile' | 'addresses' | 'password' | 'preferences'>('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // 个人信息表单
  const [profileData, setProfileData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone || '',
    avatar: user.avatar || ''
  });

  // 密码修改表单
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // 地址管理
  const [addresses, setAddresses] = useState<ShippingAddress[]>([
    {
      id: '1',
      name: user.name,
      phone: user.phone || '',
      province: '上海市',
      city: '上海市',
      district: '浦东新区',
      address: '陆家嘴金融中心 888号',
      isDefault: true
    }
  ]);

  const [addressForm, setAddressForm] = useState<Partial<ShippingAddress>>({});
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);

  // 用户偏好设置
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    smsNotifications: false,
    promotionalEmails: true,
    orderUpdates: true,
    newsletter: false
  });

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 3000);
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await updateProfile(profileData);
      showMessage('success', '个人信息更新成功！');
    } catch (error) {
      showMessage('error', '更新失败，请重试。');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showMessage('error', '两次输入的密码不一致！');
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      showMessage('error', '新密码长度至少6位！');
      return;
    }

    setLoading(true);
    
    try {
      await changePassword(passwordData.oldPassword, passwordData.newPassword);
      showMessage('success', '密码修改成功！');
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      showMessage('error', '密码修改失败，请检查原密码是否正确。');
    } finally {
      setLoading(false);
    }
  };

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!addressForm.name || !addressForm.phone || !addressForm.address) {
      showMessage('error', '请填写完整的地址信息！');
      return;
    }

    const newAddress: ShippingAddress = {
      id: editingAddressId || Date.now().toString(),
      name: addressForm.name!,
      phone: addressForm.phone!,
      province: addressForm.province || '上海市',
      city: addressForm.city || '上海市',
      district: addressForm.district || '',
      address: addressForm.address!,
      isDefault: addressForm.isDefault || false
    };

    if (editingAddressId) {
      setAddresses(addresses.map(addr => addr.id === editingAddressId ? newAddress : addr));
      showMessage('success', '地址更新成功！');
    } else {
      setAddresses([...addresses, newAddress]);
      showMessage('success', '地址添加成功！');
    }

    setAddressForm({});
    setShowAddressForm(false);
    setEditingAddressId(null);
  };

  const handleDeleteAddress = (id: string) => {
    if (window.confirm('确定要删除此地址吗？')) {
      setAddresses(addresses.filter(addr => addr.id !== id));
      showMessage('success', '地址删除成功！');
    }
  };

  const handleSetDefaultAddress = (id: string) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })));
    showMessage('success', '默认地址设置成功！');
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('zh-CN');
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-semibold text-brand-text flex items-center">
          <span className="mr-3">⚙️</span>
          设置
        </h2>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg border ${
          message.type === 'success' 
            ? 'bg-green-500 bg-opacity-20 border-green-500 text-green-400' 
            : 'bg-red-500 bg-opacity-20 border-red-500 text-red-400'
        }`}>
          {message.text}
        </div>
      )}

      {/* 设置导航标签 */}
      <div className="flex flex-wrap gap-3 mb-8">
        <button
          onClick={() => setActiveSection('profile')}
          className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
            activeSection === 'profile'
              ? 'bg-brand-gold text-brand-bg shadow-md'
              : 'bg-gray-700 text-brand-text-secondary hover:bg-gray-600 hover:text-brand-text'
          }`}
        >
          👤 个人信息
        </button>
        
        <button
          onClick={() => setActiveSection('addresses')}
          className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
            activeSection === 'addresses'
              ? 'bg-brand-gold text-brand-bg shadow-md'
              : 'bg-gray-700 text-brand-text-secondary hover:bg-gray-600 hover:text-brand-text'
          }`}
        >
          📍 收货地址
        </button>
        
        <button
          onClick={() => setActiveSection('password')}
          className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
            activeSection === 'password'
              ? 'bg-brand-gold text-brand-bg shadow-md'
              : 'bg-gray-700 text-brand-text-secondary hover:bg-gray-600 hover:text-brand-text'
          }`}
        >
          🔒 修改密码
        </button>
        
        <button
          onClick={() => setActiveSection('preferences')}
          className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
            activeSection === 'preferences'
              ? 'bg-brand-gold text-brand-bg shadow-md'
              : 'bg-gray-700 text-brand-text-secondary hover:bg-gray-600 hover:text-brand-text'
          }`}
        >
          🔔 通知偏好
        </button>
      </div>

      {/* 个人信息设置 */}
      {activeSection === 'profile' && (
        <div className="bg-gray-800 bg-opacity-30 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-brand-text mb-6">个人信息</h3>
          
          <form onSubmit={handleProfileUpdate} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-brand-text mb-2 font-medium">姓名</label>
                <input
                  type="text"
                  value={profileData.name}
                  onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-brand-text focus:outline-none focus:border-brand-gold"
                  required
                />
              </div>
              
              <div>
                <label className="block text-brand-text mb-2 font-medium">邮箱</label>
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-brand-text focus:outline-none focus:border-brand-gold"
                  required
                />
              </div>
              
              <div>
                <label className="block text-brand-text mb-2 font-medium">手机号</label>
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-brand-text focus:outline-none focus:border-brand-gold"
                />
              </div>
              
              <div>
                <label className="block text-brand-text mb-2 font-medium">注册时间</label>
                <div className="px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-brand-text">
                  {formatDate(user.createdAt)}
                </div>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-brand-gold text-brand-bg rounded-lg hover:bg-yellow-600 transition-colors font-medium disabled:opacity-50"
            >
              {loading ? '更新中...' : '保存修改'}
            </button>
          </form>
        </div>
      )}

      {/* 收货地址管理 */}
      {activeSection === 'addresses' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-semibold text-brand-text">收货地址</h3>
            <button
              onClick={() => {
                setAddressForm({});
                setEditingAddressId(null);
                setShowAddressForm(true);
              }}
              className="px-4 py-2 bg-brand-gold text-brand-bg rounded-lg hover:bg-yellow-600 transition-colors font-medium"
            >
              ➕ 添加地址
            </button>
          </div>

          {/* 地址列表 */}
          <div className="space-y-4">
            {addresses.map((address) => (
              <div key={address.id} className="bg-gray-800 bg-opacity-30 rounded-xl p-6 border border-gray-700">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-brand-text font-semibold">{address.name}</h4>
                      <span className="text-brand-text opacity-80">{address.phone}</span>
                      {address.isDefault && (
                        <span className="bg-brand-gold bg-opacity-20 text-white text-xs px-2 py-1 rounded-full">
                          默认地址
                        </span>
                      )}
                    </div>
                    <p className="text-brand-text-secondary">
                      {address.province} {address.city} {address.district} {address.address}
                    </p>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        setAddressForm(address);
                        setEditingAddressId(address.id);
                        setShowAddressForm(true);
                      }}
                      className="text-brand-gold hover:text-yellow-300 transition-colors"
                    >
                      编辑
                    </button>
                    {!address.isDefault && (
                      <button
                        onClick={() => handleSetDefaultAddress(address.id)}
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        设为默认
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteAddress(address.id)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      删除
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* 地址表单 */}
          {showAddressForm && (
            <div className="bg-gray-800 bg-opacity-50 rounded-xl p-6 border border-brand-gold">
              <h4 className="text-lg font-semibold text-brand-text mb-4">
                {editingAddressId ? '编辑地址' : '添加新地址'}
              </h4>
              
              <form onSubmit={handleAddressSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-brand-text-secondary mb-2">收件人姓名</label>
                    <input
                      type="text"
                      value={addressForm.name || ''}
                      onChange={(e) => setAddressForm({...addressForm, name: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-brand-text focus:outline-none focus:border-brand-gold"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-brand-text-secondary mb-2">手机号</label>
                    <input
                      type="tel"
                      value={addressForm.phone || ''}
                      onChange={(e) => setAddressForm({...addressForm, phone: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-brand-text focus:outline-none focus:border-brand-gold"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-brand-text-secondary mb-2">省份</label>
                    <select
                      value={addressForm.province || '上海市'}
                      onChange={(e) => setAddressForm({...addressForm, province: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-brand-text focus:outline-none focus:border-brand-gold"
                    >
                      <option value="上海市">上海市</option>
                      <option value="北京市">北京市</option>
                      <option value="广东省">广东省</option>
                      <option value="江苏省">江苏省</option>
                      <option value="浙江省">浙江省</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-brand-text-secondary mb-2">城市</label>
                    <input
                      type="text"
                      value={addressForm.city || ''}
                      onChange={(e) => setAddressForm({...addressForm, city: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-brand-text focus:outline-none focus:border-brand-gold"
                      placeholder="请输入城市"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-brand-text-secondary mb-2">详细地址</label>
                  <textarea
                    value={addressForm.address || ''}
                    onChange={(e) => setAddressForm({...addressForm, address: e.target.value})}
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-brand-text focus:outline-none focus:border-brand-gold"
                    placeholder="请输入详细地址"
                    required
                  />
                </div>
                
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="isDefault"
                    checked={addressForm.isDefault || false}
                    onChange={(e) => setAddressForm({...addressForm, isDefault: e.target.checked})}
                    className="w-4 h-4 text-brand-gold bg-gray-700 border-gray-600 rounded focus:ring-brand-gold"
                  />
                  <label htmlFor="isDefault" className="text-brand-text-secondary">
                    设为默认地址
                  </label>
                </div>
                
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-brand-gold text-brand-bg rounded-lg hover:bg-yellow-600 transition-colors font-medium"
                  >
                    {editingAddressId ? '更新地址' : '保存地址'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddressForm(false);
                      setAddressForm({});
                      setEditingAddressId(null);
                    }}
                    className="px-6 py-3 bg-gray-600 text-brand-text rounded-lg hover:bg-gray-500 transition-colors font-medium"
                  >
                    取消
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* 密码修改 */}
      {activeSection === 'password' && (
        <div className="bg-gray-800 bg-opacity-30 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-brand-text mb-6">修改密码</h3>
          
          <form onSubmit={handlePasswordChange} className="space-y-6 max-w-md">
            <div>
              <label className="block text-brand-text-secondary mb-2">当前密码</label>
              <input
                type="password"
                value={passwordData.oldPassword}
                onChange={(e) => setPasswordData({...passwordData, oldPassword: e.target.value})}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-brand-text focus:outline-none focus:border-brand-gold"
                required
              />
            </div>
            
            <div>
              <label className="block text-brand-text-secondary mb-2">新密码</label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-brand-text focus:outline-none focus:border-brand-gold"
                required
                minLength={6}
              />
              <p className="text-brand-text-secondary text-sm mt-1">密码长度至少6位</p>
            </div>
            
            <div>
              <label className="block text-brand-text-secondary mb-2">确认新密码</label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-brand-text focus:outline-none focus:border-brand-gold"
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-brand-gold text-brand-bg rounded-lg hover:bg-yellow-600 transition-colors font-medium disabled:opacity-50"
            >
              {loading ? '修改中...' : '修改密码'}
            </button>
          </form>
        </div>
      )}

      {/* 通知偏好 */}
      {activeSection === 'preferences' && (
        <div className="bg-gray-800 bg-opacity-30 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-brand-text mb-6">通知偏好</h3>
          
          <div className="space-y-6">
            <div className="flex items-center justify-between py-3 border-b border-gray-700">
              <div>
                <h4 className="text-brand-text font-medium">邮件通知</h4>
                <p className="text-brand-text-secondary text-sm">接收重要的账户和订单通知</p>
              </div>
              <input
                type="checkbox"
                checked={preferences.emailNotifications}
                onChange={(e) => setPreferences({...preferences, emailNotifications: e.target.checked})}
                className="w-5 h-5 text-brand-gold bg-gray-700 border-gray-600 rounded focus:ring-brand-gold"
              />
            </div>
            
            <div className="flex items-center justify-between py-3 border-b border-gray-700">
              <div>
                <h4 className="text-brand-text font-medium">短信通知</h4>
                <p className="text-brand-text-secondary text-sm">接收订单状态更新短信</p>
              </div>
              <input
                type="checkbox"
                checked={preferences.smsNotifications}
                onChange={(e) => setPreferences({...preferences, smsNotifications: e.target.checked})}
                className="w-5 h-5 text-brand-gold bg-gray-700 border-gray-600 rounded focus:ring-brand-gold"
              />
            </div>
            
            <div className="flex items-center justify-between py-3 border-b border-gray-700">
              <div>
                <h4 className="text-brand-text font-medium">促销邮件</h4>
                <p className="text-brand-text-secondary text-sm">接收促销活动和优惠信息</p>
              </div>
              <input
                type="checkbox"
                checked={preferences.promotionalEmails}
                onChange={(e) => setPreferences({...preferences, promotionalEmails: e.target.checked})}
                className="w-5 h-5 text-brand-gold bg-gray-700 border-gray-600 rounded focus:ring-brand-gold"
              />
            </div>
            
            <div className="flex items-center justify-between py-3 border-b border-gray-700">
              <div>
                <h4 className="text-brand-text font-medium">订单更新</h4>
                <p className="text-brand-text-secondary text-sm">订单状态变化时发送通知</p>
              </div>
              <input
                type="checkbox"
                checked={preferences.orderUpdates}
                onChange={(e) => setPreferences({...preferences, orderUpdates: e.target.checked})}
                className="w-5 h-5 text-brand-gold bg-gray-700 border-gray-600 rounded focus:ring-brand-gold"
              />
            </div>
            
            <div className="flex items-center justify-between py-3">
              <div>
                <h4 className="text-brand-text font-medium">新闻资讯</h4>
                <p className="text-brand-text-secondary text-sm">接收品牌新闻和产品资讯</p>
              </div>
              <input
                type="checkbox"
                checked={preferences.newsletter}
                onChange={(e) => setPreferences({...preferences, newsletter: e.target.checked})}
                className="w-5 h-5 text-brand-gold bg-gray-700 border-gray-600 rounded focus:ring-brand-gold"
              />
            </div>
          </div>
          
          <button
            onClick={() => showMessage('success', '偏好设置已保存！')}
            className="mt-6 px-6 py-3 bg-brand-gold text-brand-bg rounded-lg hover:bg-yellow-600 transition-colors font-medium"
          >
            保存设置
          </button>
        </div>
      )}
    </div>
  );
};

export default UserSettings; 