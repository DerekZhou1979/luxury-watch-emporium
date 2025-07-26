import React, { useState } from 'react';
import { useAuth } from '../../hooks/use-auth';
import { useLanguage } from '../../hooks/use-language';
import { User, ShippingAddress } from '../../seagull-watch-types';
import { 
  UserOutlined, 
  EnvironmentOutlined, 
  LockOutlined, 
  SettingOutlined,
  SaveOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  StarOutlined,
  MailOutlined,
  PhoneOutlined,
  BellOutlined,
  CheckCircleOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone
} from '@ant-design/icons';

interface UserSettingsProps {
  user: User;
}

const UserSettings: React.FC<UserSettingsProps> = ({ user }) => {
  const { updateProfile, changePassword } = useAuth();
  const { t } = useLanguage();
  const [activeSection, setActiveSection] = useState<'profile' | 'addresses' | 'password' | 'preferences'>('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false
  });

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
      province: t.userCenter.title === '个人中心' ? '上海市' : 'Shanghai',
      city: t.userCenter.title === '个人中心' ? '上海市' : 'Shanghai',
      district: t.userCenter.title === '个人中心' ? '浦东新区' : 'Pudong District',
      address: t.userCenter.title === '个人中心' ? '陆家嘴金融中心 888号' : '888 Lujiazui Financial Center',
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
    setTimeout(() => setMessage(null), 5000);
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await updateProfile(profileData);
      showMessage('success', t.userCenter.title === '个人中心' ? '个人信息更新成功！' : 'Profile updated successfully!');
    } catch (error) {
      showMessage('error', t.userCenter.title === '个人中心' ? '更新失败，请重试。' : 'Update failed, please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showMessage('error', t.userCenter.title === '个人中心' ? '两次输入的密码不一致！' : 'Passwords do not match!');
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      showMessage('error', t.userCenter.title === '个人中心' ? '新密码长度至少6位！' : 'Password must be at least 6 characters!');
      return;
    }

    setLoading(true);
    
    try {
      await changePassword(passwordData.oldPassword, passwordData.newPassword);
      showMessage('success', t.userCenter.title === '个人中心' ? '密码修改成功！' : 'Password changed successfully!');
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      showMessage('error', t.userCenter.title === '个人中心' ? '密码修改失败，请重试。' : 'Password change failed, please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingAddressId) {
      // 编辑地址
      setAddresses(prev => prev.map(addr => 
        addr.id === editingAddressId 
          ? { ...addr, ...addressForm } as ShippingAddress
          : addr
      ));
      showMessage('success', t.userCenter.title === '个人中心' ? '地址更新成功！' : 'Address updated successfully!');
    } else {
      // 添加新地址
      const newAddress: ShippingAddress = {
        id: Date.now().toString(),
        ...addressForm as ShippingAddress,
        isDefault: addresses.length === 0
      };
      setAddresses(prev => [...prev, newAddress]);
      showMessage('success', t.userCenter.title === '个人中心' ? '地址添加成功！' : 'Address added successfully!');
    }
    
    setShowAddressForm(false);
    setAddressForm({});
    setEditingAddressId(null);
  };

  const handleDeleteAddress = (id: string) => {
    if (window.confirm(t.userCenter.title === '个人中心' ? '确定要删除这个地址吗？' : 'Are you sure you want to delete this address?')) {
      setAddresses(prev => prev.filter(addr => addr.id !== id));
      showMessage('success', t.userCenter.title === '个人中心' ? '地址删除成功！' : 'Address deleted successfully!');
    }
  };

  const handleSetDefaultAddress = (id: string) => {
    setAddresses(prev => prev.map(addr => ({
      ...addr,
      isDefault: addr.id === id
    })));
    showMessage('success', t.userCenter.title === '个人中心' ? '默认地址设置成功！' : 'Default address set successfully!');
  };

  const sections = [
    {
      key: 'profile',
      icon: UserOutlined,
      label: t.userCenter.personalInfo,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      key: 'addresses',
      icon: EnvironmentOutlined,
      label: t.userCenter.addressManagement,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      key: 'password',
      icon: LockOutlined,
      label: t.userCenter.passwordChange,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      key: 'preferences',
      icon: BellOutlined,
      label: t.userCenter.preferences,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  return (
    <div className="space-y-6">
      {/* 头部 */}
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gradient-to-br from-gray-500 to-gray-600 rounded-lg flex items-center justify-center">
          <SettingOutlined className="text-white text-lg" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{t.userCenter.settings}</h2>
          <p className="text-gray-500 text-sm">{t.userCenter.profileSettings}</p>
        </div>
      </div>

      {/* 消息提示 */}
      {message && (
        <div className={`p-4 rounded-lg border ${
          message.type === 'success' 
            ? 'bg-green-50 border-green-200 text-green-800' 
            : 'bg-red-50 border-red-200 text-red-800'
        } transition-all duration-300`}>
          <div className="flex items-center space-x-2">
            <CheckCircleOutlined className={message.type === 'success' ? 'text-green-600' : 'text-red-600'} />
            <span className="font-medium">{message.text}</span>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-4 gap-6">
        {/* 侧边栏导航 */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200/50 p-2">
            <nav className="space-y-1">
              {sections.map((section) => (
                <button
                  key={section.key}
                  onClick={() => setActiveSection(section.key as typeof activeSection)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    activeSection === section.key
                      ? `${section.bgColor} ${section.color} shadow-sm`
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <section.icon className={`text-lg ${activeSection === section.key ? section.color : ''}`} />
                  <span className="font-medium">{section.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* 主内容区 */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200/50 p-6">
            {/* 个人资料 */}
            {activeSection === 'profile' && (
              <div className="space-y-6">
                <div className="flex items-center space-x-2 mb-6">
                  <UserOutlined className="text-blue-600 text-xl" />
                  <h3 className="text-xl font-bold text-gray-800">{t.userCenter.personalInfo}</h3>
                </div>

                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t.forms.firstName}
                      </label>
                      <div className="relative">
                        <UserOutlined className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          value={profileData.name}
                          onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder={t.userCenter.title === '个人中心' ? '请输入姓名' : 'Enter your name'}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t.forms.email}
                      </label>
                      <div className="relative">
                        <MailOutlined className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder={t.userCenter.title === '个人中心' ? '请输入邮箱' : 'Enter your email'}
                        />
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t.forms.phone}
                      </label>
                      <div className="relative">
                        <PhoneOutlined className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          placeholder={t.userCenter.title === '个人中心' ? '请输入手机号' : 'Enter your phone'}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all"
                    >
                      <SaveOutlined />
                      <span>{loading ? (t.userCenter.title === '个人中心' ? '保存中...' : 'Saving...') : t.common.save}</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* 地址管理 */}
            {activeSection === 'addresses' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <EnvironmentOutlined className="text-green-600 text-xl" />
                    <h3 className="text-xl font-bold text-gray-800">{t.userCenter.addressManagement}</h3>
                  </div>
                  <button
                    onClick={() => {
                      setShowAddressForm(true);
                      setEditingAddressId(null);
                      setAddressForm({});
                    }}
                    className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
                  >
                    <PlusOutlined />
                    <span>{t.userCenter.addNewAddress}</span>
                  </button>
                </div>

                {/* 地址列表 */}
                <div className="space-y-4">
                  {addresses.map((address) => (
                    <div key={address.id} className="border border-gray-200 rounded-lg p-4 hover:border-green-300 transition-all">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <h4 className="font-semibold text-gray-800">{address.name}</h4>
                            <span className="text-gray-500">{address.phone}</span>
                            {address.isDefault && (
                              <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
                                <StarOutlined className="mr-1 text-xs" />
                                {t.userCenter.defaultAddress}
                              </span>
                            )}
                          </div>
                          <p className="text-gray-600">
                            {address.province} {address.city} {address.district}
                          </p>
                          <p className="text-gray-600">{address.address}</p>
                        </div>
                        
                        <div className="flex space-x-2">
                          {!address.isDefault && (
                            <button
                              onClick={() => handleSetDefaultAddress(address.id)}
                              className="px-3 py-1 text-green-600 border border-green-300 rounded hover:bg-green-50 transition-all text-sm"
                            >
                              {t.userCenter.setAsDefault}
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setEditingAddressId(address.id);
                              setAddressForm(address);
                              setShowAddressForm(true);
                            }}
                            className="px-3 py-1 text-blue-600 border border-blue-300 rounded hover:bg-blue-50 transition-all text-sm"
                          >
                            <EditOutlined />
                          </button>
                          <button
                            onClick={() => handleDeleteAddress(address.id)}
                            className="px-3 py-1 text-red-600 border border-red-300 rounded hover:bg-red-50 transition-all text-sm"
                          >
                            <DeleteOutlined />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 地址表单 */}
                {showAddressForm && (
                  <div className="border-t border-gray-200 pt-6">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">
                      {editingAddressId ? t.userCenter.editAddress : t.userCenter.addNewAddress}
                    </h4>
                    
                    <form onSubmit={handleAddressSubmit} className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          value={addressForm.name || ''}
                          onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })}
                          placeholder={t.userCenter.title === '个人中心' ? '收件人姓名' : 'Recipient Name'}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          required
                        />
                        <input
                          type="tel"
                          value={addressForm.phone || ''}
                          onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                          placeholder={t.userCenter.title === '个人中心' ? '联系电话' : 'Phone Number'}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          required
                        />
                        <input
                          type="text"
                          value={addressForm.province || ''}
                          onChange={(e) => setAddressForm({ ...addressForm, province: e.target.value })}
                          placeholder={t.userCenter.title === '个人中心' ? '省份' : 'Province'}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          required
                        />
                        <input
                          type="text"
                          value={addressForm.city || ''}
                          onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                          placeholder={t.userCenter.title === '个人中心' ? '城市' : 'City'}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          required
                        />
                        <input
                          type="text"
                          value={addressForm.district || ''}
                          onChange={(e) => setAddressForm({ ...addressForm, district: e.target.value })}
                          placeholder={t.userCenter.title === '个人中心' ? '区县' : 'District'}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          required
                        />
                        <input
                          type="text"
                          value={addressForm.address || ''}
                          onChange={(e) => setAddressForm({ ...addressForm, address: e.target.value })}
                          placeholder={t.userCenter.title === '个人中心' ? '详细地址' : 'Detailed Address'}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          required
                        />
                      </div>
                      
                      <div className="flex justify-end space-x-3">
                        <button
                          type="button"
                          onClick={() => {
                            setShowAddressForm(false);
                            setAddressForm({});
                            setEditingAddressId(null);
                          }}
                          className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
                        >
                          {t.common.cancel}
                        </button>
                        <button
                          type="submit"
                          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
                        >
                          {t.common.save}
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            )}

            {/* 密码修改 */}
            {activeSection === 'password' && (
              <div className="space-y-6">
                <div className="flex items-center space-x-2 mb-6">
                  <LockOutlined className="text-red-600 text-xl" />
                  <h3 className="text-xl font-bold text-gray-800">{t.userCenter.passwordChange}</h3>
                </div>

                <form onSubmit={handlePasswordChange} className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t.userCenter.title === '个人中心' ? '当前密码' : 'Current Password'}
                      </label>
                      <div className="relative">
                        <LockOutlined className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type={showPassword.old ? 'text' : 'password'}
                          value={passwordData.oldPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, oldPassword: e.target.value })}
                          className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          placeholder={t.userCenter.title === '个人中心' ? '请输入当前密码' : 'Enter current password'}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword({ ...showPassword, old: !showPassword.old })}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword.old ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t.userCenter.title === '个人中心' ? '新密码' : 'New Password'}
                      </label>
                      <div className="relative">
                        <LockOutlined className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type={showPassword.new ? 'text' : 'password'}
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                          className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          placeholder={t.userCenter.title === '个人中心' ? '请输入新密码' : 'Enter new password'}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword({ ...showPassword, new: !showPassword.new })}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword.new ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {t.forms.confirmPassword}
                      </label>
                      <div className="relative">
                        <LockOutlined className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type={showPassword.confirm ? 'text' : 'password'}
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                          className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          placeholder={t.userCenter.title === '个人中心' ? '请再次输入新密码' : 'Confirm new password'}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword({ ...showPassword, confirm: !showPassword.confirm })}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword.confirm ? <EyeTwoTone /> : <EyeInvisibleOutlined />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex items-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-all"
                    >
                      <SaveOutlined />
                      <span>{loading ? (t.userCenter.title === '个人中心' ? '修改中...' : 'Changing...') : (t.userCenter.title === '个人中心' ? '修改密码' : 'Change Password')}</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* 偏好设置 */}
            {activeSection === 'preferences' && (
              <div className="space-y-6">
                <div className="flex items-center space-x-2 mb-6">
                  <BellOutlined className="text-purple-600 text-xl" />
                  <h3 className="text-xl font-bold text-gray-800">{t.userCenter.preferences}</h3>
                </div>

                <div className="space-y-6">
                  {[
                    { key: 'emailNotifications', label: t.userCenter.emailNotifications, description: t.userCenter.title === '个人中心' ? '接收重要邮件通知' : 'Receive important email notifications' },
                    { key: 'smsNotifications', label: t.userCenter.smsNotifications, description: t.userCenter.title === '个人中心' ? '接收短信通知' : 'Receive SMS notifications' },
                    { key: 'promotionalEmails', label: t.userCenter.promotionalEmails, description: t.userCenter.title === '个人中心' ? '接收促销活动邮件' : 'Receive promotional emails' },
                    { key: 'orderUpdates', label: t.userCenter.orderUpdates, description: t.userCenter.title === '个人中心' ? '订单状态更新通知' : 'Order status update notifications' },
                    { key: 'newsletter', label: t.userCenter.newsletter, description: t.userCenter.title === '个人中心' ? '订阅品牌资讯' : 'Subscribe to brand news' },
                  ].map((pref) => (
                    <div key={pref.key} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-purple-300 transition-all">
                      <div>
                        <h4 className="font-medium text-gray-800">{pref.label}</h4>
                        <p className="text-sm text-gray-500">{pref.description}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={preferences[pref.key as keyof typeof preferences]}
                          onChange={(e) => setPreferences({ ...preferences, [pref.key]: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                      </label>
                    </div>
                  ))}
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => showMessage('success', t.userCenter.title === '个人中心' ? '偏好设置已保存！' : 'Preferences saved!')}
                    className="flex items-center space-x-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all"
                  >
                    <SaveOutlined />
                    <span>{t.common.save}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserSettings; 