// 多语言翻译配置文件
export interface Translations {
  // 导航和基本操作
  nav: {
    home: string;
    products: string;
    about: string;
    contact: string;
    login: string;
    register: string;
    profile: string;
    logout: string;
    cart: string;
    orders: string;
    language: string;
  };
  
  // 首页内容
  home: {
    heroTitle: string;
    heroTagline: string;
    heroDescription: string;
    exploreProducts: string;
    craftsmanship: string;
    featuredWatches: string;
    viewAllSeries: string;
    brandPromise: string;
    brandPromiseDesc1: string;
    brandPromiseDesc2: string;
    learnOurStory: string;
    exploreByCategory: string;
    exploreCategory: string;
  };
  
  // 产品相关
  products: {
    allWatches: string;
    searchPlaceholder: string;
    noProducts: string;
    tryOtherCategories: string;
    foundWatches: string;
    customizable: string;
    viewDetails: string;
    addToCustom: string;
    startingPrice: string;
    inStock: string;
    remaining: string;
    outOfStock: string;
    sku: string;
  };
  
  // 通用文本
  common: {
    loading: string;
    error: string;
    success: string;
    cancel: string;
    confirm: string;
    save: string;
    edit: string;
    delete: string;
    search: string;
    filter: string;
    sort: string;
    price: string;
    category: string;
    brand: string;
    more: string;
  };
  
  // 品牌信息
  brand: {
    name: string;
    chineseName: string;
    tagline: string;
    description: string;
    since: string;
    heritage: string;
  };
  
  // 表单相关
  forms: {
    email: string;
    password: string;
    confirmPassword: string;
    firstName: string;
    lastName: string;
    phone: string;
    address: string;
    city: string;
    country: string;
    zipCode: string;
    required: string;
    optional: string;
  };
  
  // 购物车和结账
  cart: {
    emptyCart: string;
    addToCart: string;
    removeFromCart: string;
    quantity: string;
    subtotal: string;
    total: string;
    checkout: string;
    continueShopping: string;
  };
  
  // 用户账户
  account: {
    myAccount: string;
    accountSettings: string;
    orderHistory: string;
    wishlist: string;
    addresses: string;
    paymentMethods: string;
    notifications: string;
  };

  // Footer 底部信息
  footer: {
    company: string;
    support: string;
    legal: string;
    brandStory: string;
    craftsmanship: string;
    brandNews: string;
    afterSales: string;
    contactUs: string;
    warranty: string;
    privacyPolicy: string;
    termsOfService: string;
    copyright: string;
    heritage: string;
  };
}

// 中文翻译
export const zhTranslations: Translations = {
  nav: {
    home: '首页',
    products: '定制时计',
    about: '关于我们',
    contact: '联系我们',
    login: '登录',
    register: '注册',
    profile: '个人中心',
    logout: '退出登录',
    cart: '定制清单',
    orders: '定制订单',
    language: '语言',
  },
  
  home: {
    heroTitle: '汉时辰制',
    heroTagline: '汉芯孤品・时计臻藏',
    heroDescription: '体验极致高级定制的时计艺术。每一枚汉时辰制时计都是独一无二的孤品杰作，搭载自主研发的高定机芯，彰显您的非凡品味。始创于1955年，汉时辰制70年来专注于顶级定制机芯的精工制造。',
    exploreProducts: '探索定制系列',
    craftsmanship: '高定工艺',
    featuredWatches: '精选孤品',
    viewAllSeries: '查看全部定制系列',
    brandPromise: '汉时辰制的高定承诺',
    brandPromiseDesc1: '在汉时辰制，我们专注于高级定制制表艺术。每一枚时计都由制表大师亲手打造，搭载自研高定机芯，融合数世纪的传统工艺与尖端技术。我们只选用最珍稀的材料，确保每一块手表都是独一无二的传世孤品。',
    brandPromiseDesc2: '我们的极致定制服务延伸到每个细节。我们致力于为您量身定制专属时计，从机芯到表盘，从表壳到表带，每一处都体现您的独特品味。70年来，汉时辰制一直是中华高级定制制表的领导者与创新者。',
    learnOurStory: '了解定制传承',
    exploreByCategory: '按定制系列探索',
    exploreCategory: '探索我们的{category}定制系列',
  },
  
  products: {
    allWatches: '全部定制时计',
    searchPlaceholder: '搜索定制时计...',
    noProducts: '暂无定制时计',
    tryOtherCategories: '请尝试其他定制系列',
    foundWatches: '找到 {count} 枚定制时计',
    customizable: '可个人定制',
    viewDetails: '查看详情',
    addToCustom: '加入个人定制',
    startingPrice: '定制起价',
    inStock: '现货充足',
    remaining: '剩余{count}件',
    outOfStock: '暂时缺货',
    sku: 'SKU',
  },
  
  common: {
    loading: '加载中...',
    error: '错误',
    success: '成功',
    cancel: '取消',
    confirm: '确认',
    save: '保存',
    edit: '编辑',
    delete: '删除',
    search: '搜索',
    filter: '筛选',
    sort: '排序',
    price: '定制价格',
    category: '定制系列',
    brand: '品牌',
    more: '更多',
  },
  
  brand: {
    name: '汉时辰制',
    chineseName: '汉时辰制',
    tagline: '高级定制手表，独一无二，自研高定机芯',
    description: '始创于1955年，专注顶级定制机芯研发，每一枚时计皆为孤品',
    since: '始于1955年',
    heritage: '70年高级定制传承',
  },
  
  forms: {
    email: '邮箱',
    password: '密码',
    confirmPassword: '确认密码',
    firstName: '名',
    lastName: '姓',
    phone: '电话',
    address: '地址',
    city: '城市',
    country: '国家',
    zipCode: '邮编',
    required: '必填',
    optional: '可选',
  },
  
  cart: {
    emptyCart: '定制清单为空',
    addToCart: '加入定制清单',
    removeFromCart: '移除',
    quantity: '数量',
    subtotal: '小计',
    total: '总计',
    checkout: '确认定制',
    continueShopping: '继续定制选购',
  },
  
  account: {
    myAccount: '我的账户',
    accountSettings: '账户设置',
    orderHistory: '订单历史',
    wishlist: '心愿单',
    addresses: '地址管理',
    paymentMethods: '支付方式',
    notifications: '通知设置',
  },

  footer: {
    company: '公司',
    support: '支持',
    legal: '法律',
    brandStory: '品牌故事',
    craftsmanship: '高定工艺',
    brandNews: '品牌资讯',
    afterSales: '定制服务',
    contactUs: '联系我们',
    warranty: '孤品保修',
    privacyPolicy: '隐私政策',
    termsOfService: '使用条款',
    copyright: '版权所有',
    heritage: '中华高级定制制表传承者 | 始创于1955年',
  },
};

// 英文翻译
export const enTranslations: Translations = {
  nav: {
    home: 'Home',
    products: 'Bespoke Timepieces',
    about: 'About Us',
    contact: 'Contact',
    login: 'Login',
    register: 'Register',
    profile: 'Profile',
    logout: 'Logout',
    cart: 'Bespoke List',
    orders: 'Bespoke Orders',
    language: 'Language',
  },
  
  home: {
    heroTitle: 'ChronoLab',
    heroTagline: 'HanCore Singular,Timepiece Masterpiece',
    heroDescription: 'Experience the pinnacle of haute horlogerie customization. Every ChronoLab timepiece is a unique masterpiece, powered by our proprietary movements, reflecting your extraordinary taste. Founded in 1955, ChronoLab has devoted 70 years to crafting exclusive haute horlogerie movements.',
    exploreProducts: 'Explore Bespoke Collection',
    craftsmanship: 'Haute Horlogerie',
    featuredWatches: 'Singular Masterpieces',
    viewAllSeries: 'View All Bespoke Series',
    brandPromise: 'ChronoLab\'s Haute Horlogerie Promise',
    brandPromiseDesc1: 'At ChronoLab, we specialize in haute horlogerie customization. Each timepiece is handcrafted by master horologists, featuring our proprietary movements that blend centuries of traditional craftsmanship with cutting-edge innovation. We select only the rarest materials to ensure every watch is a singular heirloom.',
    brandPromiseDesc2: 'Our bespoke service extends to every detail. We are dedicated to creating your exclusive timepiece, from movement to dial, case to strap, each element reflecting your unique taste. For 70 years, ChronoLab has been the leader and innovator in Chinese haute horlogerie.',
    learnOurStory: 'Discover Our Heritage',
    exploreByCategory: 'Explore by Bespoke Series',
    exploreCategory: 'Explore our {category} bespoke collection',
  },
  
  products: {
    allWatches: 'All Bespoke Timepieces',
    searchPlaceholder: 'Search bespoke timepieces...',
    noProducts: 'No bespoke timepieces available',
    tryOtherCategories: 'Please try other bespoke series',
    foundWatches: 'Found {count} bespoke timepieces',
    customizable: 'Fully Customizable',
    viewDetails: 'View Details',
    addToCustom: 'Start Customization',
    startingPrice: 'Bespoke from',
    inStock: 'In Stock',
    remaining: '{count} remaining',
    outOfStock: 'Currently Unavailable',
    sku: 'SKU',
  },
  
  common: {
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    cancel: 'Cancel',
    confirm: 'Confirm',
    save: 'Save',
    edit: 'Edit',
    delete: 'Delete',
    search: 'Search',
    filter: 'Filter',
    sort: 'Sort',
    price: 'Bespoke Price',
    category: 'Bespoke Series',
    brand: 'Brand',
    more: 'More',
  },
  
  brand: {
    name: 'ChronoLab',
    chineseName: 'ChronoLab',
    tagline: 'Haute Horlogerie Customization, Uniquely Yours, Proprietary Movements',
    description: 'Founded in 1955, dedicated to exclusive haute horlogerie movements, each timepiece is a singular masterpiece',
    since: 'Since 1955',
    heritage: '70 Years of Haute Horlogerie Heritage',
  },
  
  forms: {
    email: 'Email',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    firstName: 'First Name',
    lastName: 'Last Name',
    phone: 'Phone',
    address: 'Address',
    city: 'City',
    country: 'Country',
    zipCode: 'Zip Code',
    required: 'Required',
    optional: 'Optional',
  },
  
  cart: {
    emptyCart: 'Bespoke list is empty',
    addToCart: 'Add to Bespoke List',
    removeFromCart: 'Remove',
    quantity: 'Quantity',
    subtotal: 'Subtotal',
    total: 'Total',
    checkout: 'Confirm Bespoke Order',
    continueShopping: 'Continue Bespoke Shopping',
  },
  
  account: {
    myAccount: 'My Account',
    accountSettings: 'Account Settings',
    orderHistory: 'Order History',
    wishlist: 'Wishlist',
    addresses: 'Addresses',
    paymentMethods: 'Payment Methods',
    notifications: 'Notifications',
  },

  footer: {
    company: 'Company',
    support: 'Support',
    legal: 'Legal',
    brandStory: 'Brand Story',
    craftsmanship: 'Haute Horlogerie',
    brandNews: 'Brand News',
    afterSales: 'Bespoke Service',
    contactUs: 'Contact Us',
    warranty: 'Masterpiece Warranty',
    privacyPolicy: 'Privacy Policy',
    termsOfService: 'Terms of Service',
    copyright: 'All rights reserved',
    heritage: 'Chinese Haute Horlogerie Heritage | Founded in 1955',
  },
};

// 支持的语言列表
export const supportedLanguages = {
  zh: '中文',
  en: 'English',
} as const;

export type SupportedLanguage = keyof typeof supportedLanguages;

// 获取翻译函数
export const getTranslations = (language: SupportedLanguage): Translations => {
  switch (language) {
    case 'en':
      return enTranslations;
    case 'zh':
    default:
      return zhTranslations;
  }
}; 