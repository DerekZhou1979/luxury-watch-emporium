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

  // 订单相关
  orders: {
    orderDetails: string;
    backToOrderList: string;
    orderInfo: string;
    shippingInfo: string;
    productList: string;
    orderNumber: string;
    createdAt: string;
    paidAt: string;
    orderStatus: string;
    recipient: string;
    phone: string;
    address: string;
    orderNotes: string;
    // 订单状态
    pending: string;
    paid: string;
    processing: string;
    shipped: string;
    delivered: string;
    cancelled: string;
    // 其他
    subtotalLabel: string;
    shippingLabel: string;
    taxLabel: string;
    totalLabel: string;
    freeShipping: string;
    loadingOrders: string;
    noOrders: string;
    orderNotFound: string;
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

  // 个人中心
  userCenter: {
    title: string;
    welcome: string;
    overview: string;
    orders: string;
    settings: string;
    recommendations: string;
    vipMember: string;
    totalOrders: string;
    totalSpent: string;
    memberSince: string;
    points: string;
    
    // 订单相关
    orderManagement: string;
    myOrders: string;
    orderNumber: string;
    orderDate: string;
    paymentDate: string;
    orderStatus: string;
    orderTotal: string;
    orderItems: string;
    viewDetails: string;
    payNow: string;
    buyAgain: string;
    refresh: string;
    
    // 订单状态
    allOrders: string;
    pendingPayment: string;
    paid: string;
    processing: string;
    shipped: string;
    delivered: string;
    cancelled: string;
    
    // 排序选项
    sortByDate: string;
    sortByAmount: string;
    
    // 定制产品信息
    customizedProduct: string;
    customizationDetails: string;
    basePrice: string;
    customizationFee: string;
    finalPrice: string;
    customOptions: string;
    
    // 设置相关
    profileSettings: string;
    personalInfo: string;
    addressManagement: string;
    passwordChange: string;
    preferences: string;
    defaultAddress: string;
    addNewAddress: string;
    editAddress: string;
    deleteAddress: string;
    setAsDefault: string;
    
    // 通知设置
    emailNotifications: string;
    smsNotifications: string;
    promotionalEmails: string;
    orderUpdates: string;
    newsletter: string;
    
    // 推荐产品
    recommendedForYou: string;
    basedOnHistory: string;
    newArrivals: string;
    trending: string;
    addToCustomization: string;
  };

  // 个人定制
  customization: {
    title: string;
    zone: string;
    steps: string;
    currentStep: string;
    stepOf: string;
    status: string;
    selected: string;
    totalPrice: string;
    
    // 定制步骤
    caseTitle: string;
    caseDescription: string;
    dialTitle: string;
    dialDescription: string;
    handsTitle: string;
    handsDescription: string;
    secondHandTitle: string;
    secondHandDescription: string;
    strapTitle: string;
    strapDescription: string;
    movementTitle: string;
    movementDescription: string;
    
    // 操作
    previous: string;
    next: string;
    addToCart: string;
    confirmCustomization: string;
    backToProduct: string;
    
    // 确认弹窗
    confirmTitle: string;
    confirmDescription: string;
    configurationSummary: string;
    pricingBreakdown: string;
    confirm: string;
    
    // 验证消息
    configurationError: string;
    attention: string;
    selectOption: string;
    
    // 状态消息
    statusNormal: string;
    stepProgress: string;
    optionsSelected: string;
    
    // 材质和选项
    material: string;
    color: string;
    style: string;
    type: string;
    finish: string;
    texture: string;
    
    // 价格相关
    free: string;
    priceModifier: string;
    additionalCost: string;
    
    // 新增的翻译
    required: string;
    optionNotFound: string;
    customWatchAddedToCart: string;
    customWatchSuccessfullyAddedToCart: string;
    confirmCustomWatch: string;
    pleaseReviewConfig: string;
    customVersion: string;
    customConfigList: string;
    priceBreakdown: string;
    basePrice: string;
    customizationFee: string;
    total: string;
    tip: string;
    customWatchProductionTime: string;
    returnToModify: string;
    confirmAndAddToCart: string;
    customizationNormal: string;
    step: string;
    selectedOptions: string;
    configError: string;
    note: string;
    previousStep: string;
    estimatedCustomizationFee: string;
    nextStep: string;
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

  orders: {
    orderDetails: '订单详情',
    backToOrderList: '← 返回订单列表',
    orderInfo: '订单信息',
    shippingInfo: '收货信息',
    productList: '商品清单',
    orderNumber: '订单号',
    createdAt: '创建时间',
    paidAt: '支付时间',
    orderStatus: '订单状态',
    recipient: '收件人',
    phone: '电话',
    address: '地址',
    orderNotes: '订单备注',
    // 订单状态
    pending: '待支付',
    paid: '已支付',
    processing: '处理中',
    shipped: '已发货',
    delivered: '已送达',
    cancelled: '已取消',
    // 其他
    subtotalLabel: '商品小计',
    shippingLabel: '运费',
    taxLabel: '税费',
    totalLabel: '总计',
    freeShipping: '免运费',
    loadingOrders: '加载订单中...',
    noOrders: '暂无订单',
    orderNotFound: '订单未找到',
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

  userCenter: {
    title: '个人中心',
    welcome: '欢迎回来，{name}！管理您的订单、设置和发现精选推荐。',
    overview: '概览',
    orders: '我的订单',
    settings: '账户设置',
    recommendations: '精选推荐',
    vipMember: 'VIP 会员',
    totalOrders: '总订单数',
    totalSpent: '总消费',
    memberSince: '会员加入时间',
    points: '积分',
    
    // 订单相关
    orderManagement: '订单管理',
    myOrders: '我的订单',
    orderNumber: '订单编号',
    orderDate: '下单时间',
    paymentDate: '支付时间',
    orderStatus: '订单状态',
    orderTotal: '订单总额',
    orderItems: '商品数量',
    viewDetails: '查看详情',
    payNow: '立即支付',
    buyAgain: '再次购买',
    refresh: '刷新',
    
    // 订单状态
    allOrders: '全部订单',
    pendingPayment: '待支付',
    paid: '已支付',
    processing: '处理中',
    shipped: '已发货',
    delivered: '已送达',
    cancelled: '已取消',
    
    // 排序选项
    sortByDate: '按时间排序',
    sortByAmount: '按金额排序',
    
    // 定制产品信息
    customizedProduct: '定制产品',
    customizationDetails: '定制详情',
    basePrice: '基础价格',
    customizationFee: '定制费用',
    finalPrice: '最终价格',
    customOptions: '定制选项',
    
    // 设置相关
    profileSettings: '个人资料',
    personalInfo: '个人信息',
    addressManagement: '地址管理',
    passwordChange: '密码修改',
    preferences: '偏好设置',
    defaultAddress: '默认地址',
    addNewAddress: '添加新地址',
    editAddress: '编辑地址',
    deleteAddress: '删除地址',
    setAsDefault: '设为默认',
    
    // 通知设置
    emailNotifications: '邮件通知',
    smsNotifications: '短信通知',
    promotionalEmails: '促销邮件',
    orderUpdates: '订单更新',
    newsletter: '新闻通讯',
    
    // 推荐产品
    recommendedForYou: '为您推荐',
    basedOnHistory: '基于浏览历史',
    newArrivals: '新品上架',
    trending: '热门定制',
    addToCustomization: '开始定制',
  },

  customization: {
    title: '个人定制',
    zone: '定制区域',
    steps: '定制步骤',
    currentStep: '当前步骤',
    stepOf: '共 {totalSteps} 步',
    status: '定制状态',
    selected: '已选择',
    totalPrice: '总价',
    
    // 定制步骤
    caseTitle: '表壳定制',
    caseDescription: '选择您的表壳材质、颜色和风格。',
    dialTitle: '表盘定制',
    dialDescription: '选择您的表盘材质、颜色和风格。',
    handsTitle: '指针定制',
    handsDescription: '选择您的指针材质、颜色和风格。',
    secondHandTitle: '秒针定制',
    secondHandDescription: '选择您的秒针材质和颜色。',
    strapTitle: '表带定制',
    strapDescription: '选择您的表带材质、颜色和风格。',
    movementTitle: '机芯定制',
    movementDescription: '选择您的机芯类型和功能。',
    
    // 操作
    previous: '上一步',
    next: '下一步',
    addToCart: '加入定制清单',
    confirmCustomization: '确认定制',
    backToProduct: '返回产品详情',
    
    // 确认弹窗
    confirmTitle: '确认定制',
    confirmDescription: '您确定要完成此定制吗？此操作不可逆。',
    configurationSummary: '定制配置概要',
    pricingBreakdown: '价格明细',
    confirm: '确认',
    
    // 验证消息
    configurationError: '定制配置错误',
    attention: '注意',
    selectOption: '请选择一个选项',
    
    // 状态消息
    statusNormal: '正常',
    stepProgress: '步骤进度',
    optionsSelected: '已选择 {count} 个选项',
    
    // 材质和选项
    material: '材质',
    color: '颜色',
    style: '风格',
    type: '类型',
    finish: '表面处理',
    texture: '纹理',
    
    // 价格相关
    free: '免费',
    priceModifier: '价格调整',
    additionalCost: '额外费用',
    
    // 新增的翻译
    required: '必选',
    optionNotFound: '配置选项不存在',
    customWatchAddedToCart: '定制手表已添加到购物车',
    customWatchSuccessfullyAddedToCart: '您的个性化手表已成功添加到购物车！',
    confirmCustomWatch: '确认您的定制手表',
    pleaseReviewConfig: '请仔细核对以下配置信息',
    customVersion: '定制版',
    customConfigList: '定制配置清单',
    priceBreakdown: '价格明细',
    basePrice: '基础价格',
    customizationFee: '定制费用',
    total: '总计',
    tip: '温馨提示',
    customWatchProductionTime: '定制手表制作周期约15-20个工作日，我们会及时为您更新制作进度。',
    returnToModify: '返回修改',
    confirmAndAddToCart: '确认并加入购物车',
    customizationNormal: '✅ 定制状态正常',
    step: '步骤',
    selectedOptions: '已选择',
    configError: '配置错误',
    note: '注意事项',
    previousStep: '上一步',
    estimatedCustomizationFee: '预计定制费用',
    nextStep: '下一步'
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

  orders: {
    orderDetails: 'Order Details',
    backToOrderList: '← Back to Order List',
    orderInfo: 'Order Information',
    shippingInfo: 'Shipping Information',
    productList: 'Product List',
    orderNumber: 'Order Number',
    createdAt: 'Created Time',
    paidAt: 'Paid Time',
    orderStatus: 'Order Status',
    recipient: 'Recipient',
    phone: 'Phone',
    address: 'Address',
    orderNotes: 'Order Notes',
    // 订单状态
    pending: 'Pending Payment',
    paid: 'Paid',
    processing: 'Processing',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
    // 其他
    subtotalLabel: 'Subtotal',
    shippingLabel: 'Shipping',
    taxLabel: 'Tax',
    totalLabel: 'Total',
    freeShipping: 'Free Shipping',
    loadingOrders: 'Loading orders...',
    noOrders: 'No orders',
    orderNotFound: 'Order not found',
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

  userCenter: {
    title: 'User Center',
    welcome: 'Welcome back, {name}! Manage your orders, settings, and discover curated recommendations.',
    overview: 'Overview',
    orders: 'My Orders',
    settings: 'Account Settings',
    recommendations: 'Recommendations',
    vipMember: 'VIP Member',
    totalOrders: 'Total Orders',
    totalSpent: 'Total Spent',
    memberSince: 'Member Since',
    points: 'Points',
    
    // 订单相关
    orderManagement: 'Order Management',
    myOrders: 'My Orders',
    orderNumber: 'Order Number',
    orderDate: 'Order Date',
    paymentDate: 'Payment Date',
    orderStatus: 'Order Status',
    orderTotal: 'Order Total',
    orderItems: 'Items',
    viewDetails: 'View Details',
    payNow: 'Pay Now',
    buyAgain: 'Buy Again',
    refresh: 'Refresh',
    
    // 订单状态
    allOrders: 'All Orders',
    pendingPayment: 'Pending Payment',
    paid: 'Paid',
    processing: 'Processing',
    shipped: 'Shipped',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
    
    // 排序选项
    sortByDate: 'Sort by Date',
    sortByAmount: 'Sort by Amount',
    
    // 定制产品信息
    customizedProduct: 'Customized Product',
    customizationDetails: 'Customization Details',
    basePrice: 'Base Price',
    customizationFee: 'Customization Fee',
    finalPrice: 'Final Price',
    customOptions: 'Custom Options',
    
    // 设置相关
    profileSettings: 'Profile Settings',
    personalInfo: 'Personal Information',
    addressManagement: 'Address Management',
    passwordChange: 'Change Password',
    preferences: 'Preferences',
    defaultAddress: 'Default Address',
    addNewAddress: 'Add New Address',
    editAddress: 'Edit Address',
    deleteAddress: 'Delete Address',
    setAsDefault: 'Set as Default',
    
    // 通知设置
    emailNotifications: 'Email Notifications',
    smsNotifications: 'SMS Notifications',
    promotionalEmails: 'Promotional Emails',
    orderUpdates: 'Order Updates',
    newsletter: 'Newsletter',
    
    // 推荐产品
    recommendedForYou: 'Recommended for You',
    basedOnHistory: 'Based on Browsing History',
    newArrivals: 'New Arrivals',
    trending: 'Trending Customizations',
    addToCustomization: 'Start Customization',
  },

  customization: {
    title: 'Personal Customization',
    zone: 'Customization Zone',
    steps: 'Customization Steps',
    currentStep: 'Current Step',
    stepOf: 'Step {currentStep} of {totalSteps}',
    status: 'Customization Status',
    selected: 'Selected',
    totalPrice: 'Total Price',
    
    // 定制步骤
    caseTitle: 'Case Customization',
    caseDescription: 'Choose your case material, color, and style.',
    dialTitle: 'Dial Customization',
    dialDescription: 'Choose your dial material, color, and style.',
    handsTitle: 'Hands Customization',
    handsDescription: 'Choose your hands material, color, and style.',
    secondHandTitle: 'Second Hand Customization',
    secondHandDescription: 'Choose your second hand material and color.',
    strapTitle: 'Strap Customization',
    strapDescription: 'Choose your strap material, color, and style.',
    movementTitle: 'Movement Customization',
    movementDescription: 'Choose your movement type and features.',
    
    // 操作
    previous: 'Previous Step',
    next: 'Next Step',
    addToCart: 'Add to Bespoke List',
    confirmCustomization: 'Confirm Customization',
    backToProduct: 'Back to Product Details',
    
    // 确认弹窗
    confirmTitle: 'Confirm Customization',
    confirmDescription: 'Are you sure you want to complete this customization? This action is irreversible.',
    configurationSummary: 'Customization Configuration Summary',
    pricingBreakdown: 'Pricing Breakdown',
    confirm: 'Confirm',
    
    // 验证消息
    configurationError: 'Customization Configuration Error',
    attention: 'Attention',
    selectOption: 'Please select an option',
    
    // 状态消息
    statusNormal: 'Normal',
    stepProgress: 'Step Progress',
    optionsSelected: 'Options Selected: {count}',
    
    // 材质和选项
    material: 'Material',
    color: 'Color',
    style: 'Style',
    type: 'Type',
    finish: 'Finish',
    texture: 'Texture',
    
    // 价格相关
    free: 'Free',
    priceModifier: 'Price Modifier',
    additionalCost: 'Additional Cost',
    
    // 新增的翻译
    required: 'Required',
    optionNotFound: 'Configuration option not found',
    customWatchAddedToCart: 'Custom watch added to cart',
    customWatchSuccessfullyAddedToCart: 'Your personalized watch has been successfully added to your cart!',
    confirmCustomWatch: 'Confirm your custom watch',
    pleaseReviewConfig: 'Please review the following configuration information',
    customVersion: 'Custom Version',
    customConfigList: 'Custom Configuration List',
    priceBreakdown: 'Pricing Breakdown',
    basePrice: 'Base Price',
    customizationFee: 'Customization Fee',
    total: 'Total',
    tip: 'Tip',
    customWatchProductionTime: 'Custom watch production takes approximately 15-20 working days, and we will keep you updated on the production progress.',
    returnToModify: 'Return to Modify',
    confirmAndAddToCart: 'Confirm and Add to Cart',
    customizationNormal: '✅ Customization Status Normal',
    step: 'Step',
    selectedOptions: 'Selected Options',
    configError: 'Configuration Error',
    note: 'Note',
    previousStep: 'Previous Step',
    estimatedCustomizationFee: 'Estimated Customization Fee',
    nextStep: 'Next Step'
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