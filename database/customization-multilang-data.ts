import { CustomizationCategoryMultiLang, CustomizationOptionMultiLang } from './schema';

// 定制类别多语言配置
export const customizationCategories: CustomizationCategoryMultiLang[] = [
  {
    id: 'case',
    title_zh: '表壳材质',
    title_en: 'Case Material',
    icon: '⚙️',
    description_zh: '选择您喜欢的表壳材质，影响手表的整体质感和耐用性',
    description_en: 'Choose your preferred case material for durability and style'
  },
  {
    id: 'dial',
    title_zh: '表盘样式',
    title_en: 'Dial Style',
    icon: '🎯',
    description_zh: '表盘是手表的"脸面"，选择最能体现您个性的设计',
    description_en: 'The dial is the face of your watch, choose a design that reflects your personality'
  },
  {
    id: 'hands',
    title_zh: '指针样式',
    title_en: 'Hands Style',
    icon: '⏰',
    description_zh: '指针设计影响手表的可读性和美观度',
    description_en: 'Hand design affects readability and aesthetics of your timepiece'
  },
  {
    id: 'secondHand',
    title_zh: '秒针样式',
    title_en: 'Second Hand Style',
    icon: '🕐',
    description_zh: '秒针为手表增添动感和精准度的视觉表现',
    description_en: 'Second hand adds dynamic visual element and precision indication'
  },
  {
    id: 'movement',
    title_zh: '机芯类型',
    title_en: 'Movement Type',
    icon: '🔧',
    description_zh: '机芯是手表的心脏，决定手表的性能和价值',
    description_en: 'Movement is the heart of your watch, determining performance and value'
  }
];

// 定制选项多语言配置
export const customizationOptions: CustomizationOptionMultiLang[] = [
  // 表壳材质选项
  {
    id: 'case_steel',
    category: 'case',
    value: 'steel',
    name_zh: '316L不锈钢',
    name_en: '316L Steel',
    desc_zh: '经典耐用，抗腐蚀',
    desc_en: 'Classic and durable, corrosion resistant',
    price: 0,
    icon: 'w-14 h-14 bg-gradient-to-br from-gray-300 to-gray-500 rounded-full border-3 border-gray-600 shadow-lg',
    popular: true
  },
  {
    id: 'case_gold',
    category: 'case',
    value: 'gold',
    name_zh: '18K玫瑰金',
    name_en: '18K Rose Gold',
    desc_zh: '奢华典雅，贵族气质',
    desc_en: 'Luxury elegance, noble temperament',
    price: 4200,
    icon: 'w-14 h-14 bg-gradient-to-br from-yellow-300 to-yellow-600 rounded-full border-3 border-yellow-700 shadow-lg'
  },
  {
    id: 'case_titanium',
    category: 'case',
    value: 'titanium',
    name_zh: '钛合金',
    name_en: 'Titanium',
    desc_zh: '航空级材质，超轻',
    desc_en: 'Aerospace grade material, ultra-light',
    price: 1500,
    icon: 'w-14 h-14 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full border-3 border-gray-700 shadow-lg'
  },
  {
    id: 'case_platinum',
    category: 'case',
    value: 'platinum',
    name_zh: '铂金',
    name_en: 'Platinum',
    desc_zh: '稀有贵金属，永恒',
    desc_en: 'Rare precious metal, eternal',
    price: 8800,
    icon: 'w-14 h-14 bg-gradient-to-br from-slate-200 to-slate-400 rounded-full border-3 border-slate-500 shadow-lg'
  },
  {
    id: 'case_carbon',
    category: 'case',
    value: 'carbon',
    name_zh: '碳纤维',
    name_en: 'Carbon Fiber',
    desc_zh: '高科技材质，极轻',
    desc_en: 'High-tech material, extremely light',
    price: 2800,
    icon: 'w-14 h-14 bg-gradient-to-br from-black to-gray-800 rounded-full border-3 border-gray-900 shadow-lg'
  },
  {
    id: 'case_ceramic',
    category: 'case',
    value: 'ceramic',
    name_zh: '精密陶瓷',
    name_en: 'Ceramic',
    desc_zh: '抗刮花，高硬度',
    desc_en: 'Scratch resistant, high hardness',
    price: 3200,
    icon: 'w-14 h-14 bg-gradient-to-br from-white to-gray-200 rounded-full border-3 border-gray-300 shadow-lg'
  },

  // 表盘样式选项
  {
    id: 'dial_white',
    category: 'dial',
    value: 'white',
    name_zh: '珍珠白',
    name_en: 'Pearl White',
    desc_zh: '经典优雅，百搭',
    desc_en: 'Classic elegance, versatile',
    price: 0,
    icon: 'w-14 h-14 bg-white border-3 border-gray-300 rounded-full shadow-lg flex items-center justify-center',
    popular: true
  },
  {
    id: 'dial_black',
    category: 'dial',
    value: 'black',
    name_zh: '深邃黑',
    name_en: 'Deep Black',
    desc_zh: '神秘高贵，运动感',
    desc_en: 'Mysterious and noble, sporty',
    price: 200,
    icon: 'w-14 h-14 bg-black border-3 border-gray-700 rounded-full shadow-lg flex items-center justify-center'
  },
  {
    id: 'dial_blue',
    category: 'dial',
    value: 'blue',
    name_zh: '海洋蓝',
    name_en: 'Ocean Blue',
    desc_zh: '深邃如海，商务范',
    desc_en: 'Deep as ocean, business style',
    price: 300,
    icon: 'w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-700 border-3 border-blue-800 rounded-full shadow-lg flex items-center justify-center'
  },
  {
    id: 'dial_green',
    category: 'dial',
    value: 'green',
    name_zh: '森林绿',
    name_en: 'Forest Green',
    desc_zh: '自然清新，独特',
    desc_en: 'Natural and fresh, unique',
    price: 350,
    icon: 'w-14 h-14 bg-gradient-to-br from-green-400 to-green-700 border-3 border-green-800 rounded-full shadow-lg flex items-center justify-center'
  },
  {
    id: 'dial_silver',
    category: 'dial',
    value: 'silver',
    name_zh: '银河灰',
    name_en: 'Galaxy Silver',
    desc_zh: '金属质感，现代',
    desc_en: 'Metallic texture, modern',
    price: 250,
    icon: 'w-14 h-14 bg-gradient-to-br from-gray-300 to-gray-500 border-3 border-gray-600 rounded-full shadow-lg flex items-center justify-center'
  },
  {
    id: 'dial_champagne',
    category: 'dial',
    value: 'champagne',
    name_zh: '香槟金',
    name_en: 'Champagne',
    desc_zh: '温润奢华，典雅',
    desc_en: 'Warm luxury, elegant',
    price: 400,
    icon: 'w-14 h-14 bg-gradient-to-br from-yellow-200 to-yellow-400 border-3 border-yellow-500 rounded-full shadow-lg flex items-center justify-center'
  },

  // 指针样式选项
  {
    id: 'hands_classic',
    category: 'hands',
    value: 'classic',
    name_zh: '经典剑形',
    name_en: 'Classic Sword',
    desc_zh: '简洁优雅，永不过时',
    desc_en: 'Simple elegance, timeless',
    price: 0,
    icon: 'w-14 h-14 bg-gray-100 border-3 border-gray-300 rounded-xl shadow-lg flex items-center justify-center',
    popular: true
  },
  {
    id: 'hands_luminous',
    category: 'hands',
    value: 'luminous',
    name_zh: '夜光指针',
    name_en: 'Luminous',
    desc_zh: '暗处可见，实用性强',
    desc_en: 'Visible in dark, highly practical',
    price: 800,
    icon: 'w-14 h-14 bg-green-100 border-3 border-green-300 rounded-xl shadow-xl flex items-center justify-center'
  },
  {
    id: 'hands_gold',
    category: 'hands',
    value: 'gold',
    name_zh: '金色指针',
    name_en: 'Gold Plated',
    desc_zh: '奢华涂层，贵族气质',
    desc_en: 'Luxury coating, noble temperament',
    price: 1200,
    icon: 'w-14 h-14 bg-yellow-100 border-3 border-yellow-300 rounded-xl shadow-lg flex items-center justify-center'
  },
  {
    id: 'hands_diamond',
    category: 'hands',
    value: 'diamond',
    name_zh: '钻石装饰',
    name_en: 'Diamond Set',
    desc_zh: '钻石镶嵌，极致奢华',
    desc_en: 'Diamond setting, ultimate luxury',
    price: 5800,
    icon: 'w-14 h-14 bg-pink-100 border-3 border-pink-300 rounded-xl shadow-xl flex items-center justify-center'
  },
  {
    id: 'hands_skeleton',
    category: 'hands',
    value: 'skeleton',
    name_zh: '镂空指针',
    name_en: 'Skeleton',
    desc_zh: '镂空设计，现代感',
    desc_en: 'Hollow design, modern feel',
    price: 1500,
    icon: 'w-14 h-14 bg-slate-100 border-3 border-slate-300 rounded-xl shadow-lg flex items-center justify-center'
  },
  {
    id: 'hands_blued',
    category: 'hands',
    value: 'blued',
    name_zh: '烤蓝指针',
    name_en: 'Blued Steel',
    desc_zh: '传统工艺，深邃蓝',
    desc_en: 'Traditional craft, deep blue',
    price: 900,
    icon: 'w-14 h-14 bg-blue-100 border-3 border-blue-300 rounded-xl shadow-lg flex items-center justify-center'
  },

  // 秒针样式选项
  {
    id: 'secondHand_classic',
    category: 'secondHand',
    value: 'classic',
    name_zh: '经典秒针',
    name_en: 'Classic',
    desc_zh: '标准设计，简约',
    desc_en: 'Standard design, simple',
    price: 0,
    icon: 'w-14 h-14 bg-gray-100 border-3 border-gray-300 rounded-xl shadow-lg flex items-center justify-center',
    popular: true
  },
  {
    id: 'secondHand_colored',
    category: 'secondHand',
    value: 'colored',
    name_zh: '红色秒针',
    name_en: 'Red Accent',
    desc_zh: '经典红色，醒目',
    desc_en: 'Classic red, eye-catching',
    price: 150,
    icon: 'w-14 h-14 bg-red-100 border-3 border-red-300 rounded-xl shadow-lg flex items-center justify-center'
  },
  {
    id: 'secondHand_diamond',
    category: 'secondHand',
    value: 'diamond',
    name_zh: '钻石秒针',
    name_en: 'Diamond Tip',
    desc_zh: '钻石装饰，奢华',
    desc_en: 'Diamond decoration, luxurious',
    price: 2800,
    icon: 'w-14 h-14 bg-pink-100 border-3 border-pink-300 rounded-xl shadow-xl flex items-center justify-center'
  },
  {
    id: 'secondHand_luminous',
    category: 'secondHand',
    value: 'luminous',
    name_zh: '夜光秒针',
    name_en: 'Luminous',
    desc_zh: '夜光材质，夜间可见',
    desc_en: 'Luminous material, visible at night',
    price: 350,
    icon: 'w-14 h-14 bg-green-100 border-3 border-green-300 rounded-xl shadow-xl flex items-center justify-center'
  },
  {
    id: 'secondHand_arrow',
    category: 'secondHand',
    value: 'arrow',
    name_zh: '箭头秒针',
    name_en: 'Arrow Style',
    desc_zh: '箭头设计，运动感',
    desc_en: 'Arrow design, sporty feel',
    price: 200,
    icon: 'w-14 h-14 bg-orange-100 border-3 border-orange-300 rounded-xl shadow-lg flex items-center justify-center'
  },
  {
    id: 'secondHand_counterweight',
    category: 'secondHand',
    value: 'counterweight',
    name_zh: '配重秒针',
    name_en: 'Counterweight',
    desc_zh: '平衡设计，精密',
    desc_en: 'Balanced design, precise',
    price: 400,
    icon: 'w-14 h-14 bg-purple-100 border-3 border-purple-300 rounded-xl shadow-lg flex items-center justify-center'
  },

  // 机芯类型选项
  {
    id: 'movement_automatic',
    category: 'movement',
    value: 'automatic',
    name_zh: '自动机械',
    name_en: 'Automatic',
    desc_zh: '自动上链，免维护',
    desc_en: 'Self-winding, maintenance-free',
    price: 0,
    icon: 'w-14 h-14 bg-blue-100 border-3 border-blue-300 rounded-full shadow-lg flex items-center justify-center',
    popular: true
  },
  {
    id: 'movement_manual',
    category: 'movement',
    value: 'manual',
    name_zh: '手动上链',
    name_en: 'Manual Wind',
    desc_zh: '传统工艺，怀表传承',
    desc_en: 'Traditional craft, pocket watch heritage',
    price: 500,
    icon: 'w-14 h-14 bg-amber-100 border-3 border-amber-300 rounded-full shadow-lg flex items-center justify-center'
  },
  {
    id: 'movement_tourbillon',
    category: 'movement',
    value: 'tourbillon',
    name_zh: '陀飞轮',
    name_en: 'Tourbillon',
    desc_zh: '顶级复杂，制表艺术',
    desc_en: 'Top complexity, watchmaking art',
    price: 15000,
    icon: 'w-14 h-14 bg-purple-100 border-3 border-purple-300 rounded-full shadow-xl flex items-center justify-center'
  },
  {
    id: 'movement_chronograph',
    category: 'movement',
    value: 'chronograph',
    name_zh: '计时机芯',
    name_en: 'Chronograph',
    desc_zh: '计时功能，运动专用',
    desc_en: 'Timing function, sports dedicated',
    price: 3200,
    icon: 'w-14 h-14 bg-green-100 border-3 border-green-300 rounded-full shadow-lg flex items-center justify-center'
  },
  {
    id: 'movement_gmt',
    category: 'movement',
    value: 'gmt',
    name_zh: 'GMT双时区',
    name_en: 'GMT Dual Time',
    desc_zh: '双时区显示，商务首选',
    desc_en: 'Dual time display, business choice',
    price: 2800,
    icon: 'w-14 h-14 bg-indigo-100 border-3 border-indigo-300 rounded-full shadow-lg flex items-center justify-center'
  },
  {
    id: 'movement_perpetual',
    category: 'movement',
    value: 'perpetual',
    name_zh: '万年历',
    name_en: 'Perpetual Calendar',
    desc_zh: '万年历功能，传世经典',
    desc_en: 'Perpetual calendar function, timeless classic',
    price: 25000,
    icon: 'w-14 h-14 bg-rose-100 border-3 border-rose-300 rounded-full shadow-xl flex items-center justify-center'
  }
]; 