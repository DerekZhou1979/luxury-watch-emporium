// 定制选项初始化数据
export const CUSTOMIZATION_SEED_DATA = {
  // 定制类别
  categories: [
    {
      id: 'case_material',
      name: '表壳材质',
      name_en: 'Case Material',
      description: '选择手表表壳的材质',
      description_en: 'Choose the material for your watch case',
      sort_order: 1,
      is_active: true
    },
    {
      id: 'dial_style',
      name: '表盘样式',
      name_en: 'Dial Style',
      description: '选择表盘的颜色和纹理',
      description_en: 'Choose the color and texture of the dial',
      sort_order: 2,
      is_active: true
    },
    {
      id: 'hour_minute_hands',
      name: '时分针样式',
      name_en: 'Hour/Minute Hands',
      description: '选择时针和分针的样式',
      description_en: 'Choose the style of hour and minute hands',
      sort_order: 3,
      is_active: true
    },
    {
      id: 'second_hand',
      name: '秒针样式',
      name_en: 'Second Hand',
      description: '选择秒针的颜色和样式',
      description_en: 'Choose the color and style of second hand',
      sort_order: 4,
      is_active: true
    },
    {
      id: 'strap_type',
      name: '表带类型',
      name_en: 'Strap Type',
      description: '选择表带的材质和颜色',
      description_en: 'Choose the material and color of the strap',
      sort_order: 5,
      is_active: true
    },
    {
      id: 'movement_type',
      name: '机芯类型',
      name_en: 'Movement Type',
      description: '选择机芯的类型和功能',
      description_en: 'Choose the type and functions of the movement',
      sort_order: 6,
      is_active: true
    }
  ],

  // 定制选项
  options: [
    // 表壳材质选项
    {
      id: 'case_stainless_steel',
      category_id: 'case_material',
      name: '不锈钢',
      name_en: 'Stainless Steel',
      description: '经典耐用的不锈钢表壳',
      description_en: 'Classic and durable stainless steel case',
      base_price: 0,
      sort_order: 1,
      is_active: true
    },
    {
      id: 'case_titanium',
      category_id: 'case_material',
      name: '钛合金',
      name_en: 'Titanium',
      description: '轻盈坚固的钛合金表壳',
      description_en: 'Lightweight and robust titanium case',
      base_price: 2000,
      sort_order: 2,
      is_active: true
    },
    {
      id: 'case_rose_gold',
      category_id: 'case_material',
      name: '玫瑰金',
      name_en: 'Rose Gold',
      description: '优雅奢华的玫瑰金表壳',
      description_en: 'Elegant and luxurious rose gold case',
      base_price: 5000,
      sort_order: 3,
      is_active: true
    },
    {
      id: 'case_ceramic',
      category_id: 'case_material',
      name: '陶瓷',
      name_en: 'Ceramic',
      description: '现代科技感的陶瓷表壳',
      description_en: 'Modern high-tech ceramic case',
      base_price: 3000,
      sort_order: 4,
      is_active: true
    },

    // 表盘样式选项
    {
      id: 'dial_white_sunburst',
      category_id: 'dial_style',
      name: '白色太阳纹',
      name_en: 'White Sunburst',
      description: '经典的白色太阳纹表盘',
      description_en: 'Classic white sunburst dial',
      base_price: 0,
      sort_order: 1,
      is_active: true
    },
    {
      id: 'dial_black_glossy',
      category_id: 'dial_style',
      name: '黑色光面',
      name_en: 'Black Glossy',
      description: '深邃的黑色光面表盘',
      description_en: 'Deep black glossy dial',
      base_price: 500,
      sort_order: 2,
      is_active: true
    },
    {
      id: 'dial_blue_gradient',
      category_id: 'dial_style',
      name: '深海蓝渐变',
      name_en: 'Blue Gradient',
      description: '神秘的深海蓝渐变表盘',
      description_en: 'Mysterious deep sea blue gradient dial',
      base_price: 1000,
      sort_order: 3,
      is_active: true
    },
    {
      id: 'dial_silver_textured',
      category_id: 'dial_style',
      name: '银色麦粒纹',
      name_en: 'Silver Textured',
      description: '精致的银色麦粒纹表盘',
      description_en: 'Refined silver textured dial',
      base_price: 800,
      sort_order: 4,
      is_active: true
    },

    // 时分针样式选项
    {
      id: 'hands_classic_sword',
      category_id: 'hour_minute_hands',
      name: '经典剑形针',
      name_en: 'Classic Sword',
      description: '传统的剑形指针设计',
      description_en: 'Traditional sword-shaped hands design',
      base_price: 0,
      sort_order: 1,
      is_active: true
    },
    {
      id: 'hands_dauphine',
      category_id: 'hour_minute_hands',
      name: '太子妃针',
      name_en: 'Dauphine Hands',
      description: '优雅的太子妃型指针',
      description_en: 'Elegant dauphine-style hands',
      base_price: 600,
      sort_order: 2,
      is_active: true
    },
    {
      id: 'hands_arrow',
      category_id: 'hour_minute_hands',
      name: '箭头式指针',
      name_en: 'Arrow Hands',
      description: '现代感的箭头式指针',
      description_en: 'Modern arrow-style hands',
      base_price: 400,
      sort_order: 3,
      is_active: true
    },
    {
      id: 'hands_baton',
      category_id: 'hour_minute_hands',
      name: '棒形指针',
      name_en: 'Baton Hands',
      description: '简约的棒形指针设计',
      description_en: 'Minimalist baton-style hands',
      base_price: 300,
      sort_order: 4,
      is_active: true
    },

    // 秒针样式选项
    {
      id: 'second_red_thin',
      category_id: 'second_hand',
      name: '红色细针',
      name_en: 'Red Thin',
      description: '经典的红色细秒针',
      description_en: 'Classic red thin second hand',
      base_price: 0,
      sort_order: 1,
      is_active: true
    },
    {
      id: 'second_blue_counterweight',
      category_id: 'second_hand',
      name: '蓝色配重针',
      name_en: 'Blue Counterweight',
      description: '运动感的蓝色配重秒针',
      description_en: 'Sporty blue counterweight second hand',
      base_price: 200,
      sort_order: 2,
      is_active: true
    },
    {
      id: 'second_orange_racing',
      category_id: 'second_hand',
      name: '橙色赛车针',
      name_en: 'Orange Racing',
      description: '充满活力的橙色赛车秒针',
      description_en: 'Dynamic orange racing second hand',
      base_price: 300,
      sort_order: 3,
      is_active: true
    },
    {
      id: 'second_white_lume',
      category_id: 'second_hand',
      name: '白色夜光针',
      name_en: 'White Lume',
      description: '实用的白色夜光秒针',
      description_en: 'Practical white luminous second hand',
      base_price: 400,
      sort_order: 4,
      is_active: true
    },

    // 表带类型选项
    {
      id: 'strap_leather_brown',
      category_id: 'strap_type',
      name: '棕色真皮',
      name_en: 'Brown Leather',
      description: '经典的棕色真皮表带',
      description_en: 'Classic brown leather strap',
      base_price: 0,
      sort_order: 1,
      is_active: true
    },
    {
      id: 'strap_steel_bracelet',
      category_id: 'strap_type',
      name: '钢制表链',
      name_en: 'Steel Bracelet',
      description: '耐用的不锈钢表链',
      description_en: 'Durable stainless steel bracelet',
      base_price: 1200,
      sort_order: 2,
      is_active: true
    },
    {
      id: 'strap_rubber_black',
      category_id: 'strap_type',
      name: '黑色硅胶',
      name_en: 'Black Rubber',
      description: '运动风格的黑色硅胶表带',
      description_en: 'Sporty black rubber strap',
      base_price: 500,
      sort_order: 3,
      is_active: true
    },
    {
      id: 'strap_nato',
      category_id: 'strap_type',
      name: 'NATO尼龙',
      name_en: 'NATO Strap',
      description: '军用风格的NATO尼龙表带',
      description_en: 'Military-style NATO nylon strap',
      base_price: 300,
      sort_order: 4,
      is_active: true
    },
    {
      id: 'strap_mesh_steel',
      category_id: 'strap_type',
      name: '钢网表带',
      name_en: 'Mesh Steel',
      description: '现代感的钢网表带',
      description_en: 'Modern steel mesh strap',
      base_price: 800,
      sort_order: 5,
      is_active: true
    },

    // 机芯类型选项
    {
      id: 'movement_automatic_basic',
      category_id: 'movement_type',
      name: '基础自动机芯',
      name_en: 'Basic Automatic',
      description: '可靠的基础自动上链机芯',
      description_en: 'Reliable basic automatic winding movement',
      base_price: 0,
      sort_order: 1,
      is_active: true
    },
    {
      id: 'movement_automatic_premium',
      category_id: 'movement_type',
      name: '高级自动机芯',
      name_en: 'Premium Automatic',
      description: '精密的高级自动机芯，80小时动力储存',
      description_en: 'Precision premium automatic movement with 80-hour power reserve',
      base_price: 3000,
      sort_order: 2,
      is_active: true
    },
    {
      id: 'movement_chronograph',
      category_id: 'movement_type',
      name: '计时机芯',
      name_en: 'Chronograph',
      description: '专业计时功能机芯',
      description_en: 'Professional chronograph movement',
      base_price: 5000,
      sort_order: 3,
      is_active: true
    },
    {
      id: 'movement_gmt',
      category_id: 'movement_type',
      name: 'GMT双时区',
      name_en: 'GMT Dual Time',
      description: '双时区显示功能机芯',
      description_en: 'Dual time zone display movement',
      base_price: 4000,
      sort_order: 4,
      is_active: true
    }
  ]
};

// 产品定制配置（以ST1903为例）
export const PRODUCT_CUSTOMIZATION_CONFIGS = [
  {
    id: 'config_st1903_case',
    product_id: 'ST1903',
    category_id: 'case_material',
    is_required: true,
    default_option_id: 'case_stainless_steel',
    price_modifier: 0,
    sort_order: 1
  },
  {
    id: 'config_st1903_dial',
    product_id: 'ST1903',
    category_id: 'dial_style',
    is_required: true,
    default_option_id: 'dial_white_sunburst',
    price_modifier: 0,
    sort_order: 2
  },
  {
    id: 'config_st1903_hands',
    product_id: 'ST1903',
    category_id: 'hour_minute_hands',
    is_required: true,
    default_option_id: 'hands_classic_sword',
    price_modifier: 0,
    sort_order: 3
  },
  {
    id: 'config_st1903_second',
    product_id: 'ST1903',
    category_id: 'second_hand',
    is_required: true,
    default_option_id: 'second_red_thin',
    price_modifier: 0,
    sort_order: 4
  },
  {
    id: 'config_st1903_strap',
    product_id: 'ST1903',
    category_id: 'strap_type',
    is_required: true,
    default_option_id: 'strap_leather_brown',
    price_modifier: 0,
    sort_order: 5
  },
  {
    id: 'config_st1903_movement',
    product_id: 'ST1903',
    category_id: 'movement_type',
    is_required: true,
    default_option_id: 'movement_automatic_basic',
    price_modifier: 0,
    sort_order: 6
  }
]; 