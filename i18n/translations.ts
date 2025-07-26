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
    products: '产品',
    about: '关于我们',
    contact: '联系我们',
    login: '登录',
    register: '注册',
    profile: '个人中心',
    logout: '退出登录',
    cart: '购物车',
    orders: '订单',
    language: '语言',
  },
  
  home: {
    heroTitle: '海鸥表',
    heroTagline: '传承制表工艺的臻品',
    heroDescription: '体验制表技艺的巅峰之作。每一枚海鸥腕表都是精准、艺术与恒久风格的完美见证。始创于1955年，海鸥表70年来一直致力于高品质机芯的研发制造。',
    exploreProducts: '探索系列腕表',
    craftsmanship: '制表工艺',
    featuredWatches: '精选时计',
    viewAllSeries: '查看所有系列',
    brandPromise: '海鸥表的承诺',
    brandPromiseDesc1: '在海鸥表，我们专注于钟表艺术。每一枚时计都由制表大师精心组装，将数百年的传统工艺与尖端技术完美融合。我们只选用最优质的材料，确保每一块手表不仅仅是计时工具，更是值得珍藏的传世之作。',
    brandPromiseDesc2: '我们对卓越的承诺不止于制表工坊。我们致力于提供无与伦比的客户体验，引导您找到最能表达个人品味的时计杰作。70年来，海鸥表始终是中国制表行业的开创者和领先者。',
    learnOurStory: '了解我们的故事',
    exploreByCategory: '按系列探索',
    exploreCategory: '探索我们的{category}系列',
  },
  
  products: {
    allWatches: '全部腕表',
    searchPlaceholder: '搜索腕表...',
    noProducts: '暂无相关产品',
    tryOtherCategories: '请尝试其他分类或稍后再来查看',
    foundWatches: '共找到 {count} 款腕表',
    customizable: '可定制',
    viewDetails: '查看详情',
    addToCustom: '加入个人定制',
    startingPrice: '起价（可定制）',
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
    price: '价格',
    category: '分类',
    brand: '品牌',
    more: '更多',
  },
  
  brand: {
    name: 'Seagull',
    chineseName: '海鸥表',
    tagline: '传承制表工艺的臻品',
    description: '始创于1955年，专注高品质机芯研发制造',
    since: '始于1955年',
    heritage: '70年制表传承',
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
    emptyCart: '购物车为空',
    addToCart: '加入购物车',
    removeFromCart: '移除',
    quantity: '数量',
    subtotal: '小计',
    total: '总计',
    checkout: '结账',
    continueShopping: '继续购物',
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
    company: 'Company',
    support: 'Support',
    legal: 'Legal',
    brandStory: '品牌故事',
    craftsmanship: '制表工艺',
    brandNews: '品牌资讯',
    afterSales: '售后服务',
    contactUs: '联系我们',
    warranty: '产品保修',
    privacyPolicy: '隐私政策',
    termsOfService: '使用条款',
    copyright: '版权所有',
    heritage: '中国制表行业的开创者和领先者 | 始创于1955年',
  },
};

// 英文翻译
export const enTranslations: Translations = {
  nav: {
    home: 'Home',
    products: 'Products',
    about: 'About',
    contact: 'Contact',
    login: 'Login',
    register: 'Register',
    profile: 'Profile',
    logout: 'Logout',
    cart: 'Cart',
    orders: 'Orders',
    language: 'Language',
  },
  
  home: {
    heroTitle: 'Seagull Watch',
    heroTagline: 'Heritage of Fine Watchmaking',
    heroDescription: 'Experience the pinnacle of horological artistry. Every Seagull timepiece is a perfect testament to precision, art, and enduring style. Founded in 1955, Seagull has been dedicated to developing and manufacturing high-quality movements for 70 years.',
    exploreProducts: 'Explore Watch Collection',
    craftsmanship: 'Craftsmanship',
    featuredWatches: 'Featured Timepieces',
    viewAllSeries: 'View All Series',
    brandPromise: 'Seagull\'s Promise',
    brandPromiseDesc1: 'At Seagull, we focus on the art of watchmaking. Each timepiece is meticulously assembled by master watchmakers, perfectly blending centuries of traditional craftsmanship with cutting-edge technology. We select only the finest materials to ensure every watch is not just a timekeeping tool, but a treasured heirloom.',
    brandPromiseDesc2: 'Our commitment to excellence extends beyond the workshop. We are dedicated to providing an unparalleled customer experience, guiding you to find the horological masterpiece that best expresses your personal taste. For 70 years, Seagull has been a pioneer and leader in China\'s watchmaking industry.',
    learnOurStory: 'Learn Our Story',
    exploreByCategory: 'Explore by Series',
    exploreCategory: 'Explore our {category} collection',
  },
  
  products: {
    allWatches: 'All Watches',
    searchPlaceholder: 'Search watches...',
    noProducts: 'No products found',
    tryOtherCategories: 'Please try other categories or check back later',
    foundWatches: 'Found {count} watches',
    customizable: 'Customizable',
    viewDetails: 'View Details',
    addToCustom: 'Add to Custom',
    startingPrice: 'Starting price (customizable)',
    inStock: 'In Stock',
    remaining: '{count} remaining',
    outOfStock: 'Out of Stock',
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
    price: 'Price',
    category: 'Category',
    brand: 'Brand',
    more: 'More',
  },
  
  brand: {
    name: 'Seagull',
    chineseName: 'Seagull Watch',
    tagline: 'Heritage of Fine Watchmaking',
    description: 'Founded in 1955, dedicated to high-quality movement development',
    since: 'Since 1955',
    heritage: '70 Years of Watchmaking Heritage',
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
    emptyCart: 'Cart is empty',
    addToCart: 'Add to Cart',
    removeFromCart: 'Remove',
    quantity: 'Quantity',
    subtotal: 'Subtotal',
    total: 'Total',
    checkout: 'Checkout',
    continueShopping: 'Continue Shopping',
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
    craftsmanship: 'Craftsmanship',
    brandNews: 'Brand News',
    afterSales: 'After-sales Service',
    contactUs: 'Contact Us',
    warranty: 'Product Warranty',
    privacyPolicy: 'Privacy Policy',
    termsOfService: 'Terms of Service',
    copyright: 'All rights reserved',
    heritage: 'Pioneer and Leader in China\'s Watchmaking Industry | Founded in 1955',
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