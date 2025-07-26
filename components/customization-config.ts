import { CustomizableProduct, CustomizationCategory } from '../seagull-watch-customization-types';
import { Product } from '../seagull-watch-types';

export const createCustomizableProduct = (product: Product): CustomizableProduct => {
  return {
    ...product,
    basePrice: product.price,
    isCustomizable: true,
    customizationOptions: [
      // 1. 表壳配置
      {
        id: 'case_material',
        name: 'case_material',
        displayName: '表壳材质',
        description: '选择您偏爱的表壳材质和工艺',
        type: 'image',
        required: true,
        values: [
          {
            id: 'stainless_steel',
            value: 'stainless_steel',
            displayName: '不锈钢',
            description: '316L不锈钢，经典耐用',
            priceModifier: 0,
            stockQuantity: 50,
            isDefault: true,
            isAvailable: true,
            materialCode: 'SS316L',
            imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iNDAiIGN5PSI0MCIgcj0iMzUiIGZpbGw9IiNEQ0RDRkYiIHN0cm9rZT0iIzlEOUVBNiIgc3Ryb2tlLXdpZHRoPSIyIi8+CjxjaXJjbGUgY3g9IjQwIiBjeT0iNDAiIHI9IjI4IiBmaWxsPSIjRkZGRkZGIiBzdHJva2U9IiNEQ0RDRkYiIHN0cm9rZS13aWR0aD0iMSIvPgo8dGV4dCB4PSI0MCIgeT0iNDQiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMCIgZmlsbD0iIzM3NDE1MSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+U1M8L3RleHQ+Cjwvc3ZnPg=='
          },
          {
            id: 'titanium',
            value: 'titanium',
            displayName: '钛合金',
            description: '航空级钛合金，轻量化高端',
            priceModifier: 1500,
            stockQuantity: 20,
            isDefault: false,
            isAvailable: true,
            materialCode: 'Ti6Al4V',
            imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iNDAiIGN5PSI0MCIgcj0iMzUiIGZpbGw9IiNGMUY1RjkiIHN0cm9rZT0iIzk0QTNBRiIgc3Ryb2tlLXdpZHRoPSIyIi8+CjxjaXJjbGUgY3g9IjQwIiBjeT0iNDAiIHI9IjI4IiBmaWxsPSIjRjhGQUZDIiBzdHJva2U9IiNFNEU0RTciIHN0cm9rZS13aWR0aD0iMSIvPgo8dGV4dCB4PSI0MCIgeT0iNDQiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMCIgZmlsbD0iIzM3NDE1MSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+VGk8L3RleHQ+Cjwvc3ZnPg=='
          },
          {
            id: 'rose_gold',
            value: 'rose_gold',
            displayName: '玫瑰金',
            description: '18K玫瑰金，奢华典雅',
            priceModifier: 4200,
            stockQuantity: 8,
            isDefault: false,
            isAvailable: true,
            materialCode: '18K-RG',
            imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iNDAiIGN5PSI0MCIgcj0iMzUiIGZpbGw9IiNGRUM1ODkiIHN0cm9rZT0iI0Y1OUU2RCIgc3Ryb2tlLXdpZHRoPSIyIi8+CjxjaXJjbGUgY3g9IjQwIiBjeT0iNDAiIHI9IjI4IiBmaWxsPSIjRkVEMEE3IiBzdHJva2U9IiNGRUM1ODkiIHN0cm9rZS13aWR0aD0iMSIvPgo8dGV4dCB4PSI0MCIgeT0iNDQiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSI5IiBmaWxsPSIjOTc0MThEIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5SRzwvdGV4dD4KPC9zdmc+'
          },
          {
            id: 'ceramic',
            value: 'ceramic',
            displayName: '陶瓷',
            description: '高科技陶瓷，抗刮耐磨',
            priceModifier: 2800,
            stockQuantity: 12,
            isDefault: false,
            isAvailable: true,
            materialCode: 'ZrO2',
            imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iNDAiIGN5PSI0MCIgcj0iMzUiIGZpbGw9IiMxMTExMTEiIHN0cm9rZT0iIzM3Mzc0MSIgc3Ryb2tlLXdpZHRoPSIyIi8+CjxjaXJjbGUgY3g9IjQwIiBjeT0iNDAiIHI9IjI4IiBmaWxsPSIjMjYyNjI2IiBzdHJva2U9IiM0MDQwNDAiIHN0cm9rZS13aWR0aD0iMSIvPgo8dGV4dCB4PSI0MCIgeT0iNDQiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSI4IiBmaWxsPSIjRkZGRkZGIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj7pmbbnk6w8L3RleHQ+Cjwvc3ZnPg=='
          }
        ],
        category: CustomizationCategory.CASE,
        defaultValue: 'stainless_steel',
        maxLength: 0,
        sortOrder: 1,
        isActive: true,
        priceModifier: 0
      },
      // 2. 表盘配置
      {
        id: 'dial_style',
        name: 'dial_style',
        displayName: '表盘样式',
        description: '选择表盘颜色和纹理样式',
        type: 'image',
        required: true,
        values: [
          {
            id: 'white_sunburst',
            value: 'white_sunburst',
            displayName: '白色太阳纹',
            description: '经典白色表盘，太阳放射纹理',
            priceModifier: 0,
            stockQuantity: 40,
            isDefault: true,
            isAvailable: true,
            imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iNDAiIGN5PSI0MCIgcj0iMzAiIGZpbGw9IiNGRkZGRkYiIHN0cm9rZT0iI0UzRTNFMyIgc3Ryb2tlLXdpZHRoPSIyIi8+CjxnIG9wYWNpdHk9IjAuMyI+CjxsaW5lIHgxPSI0MCIgeTE9IjE1IiB4Mj0iNDAiIHkyPSIyNSIgc3Ryb2tlPSIjOTU5NTk1IiBzdHJva2Utd2lkdGg9IjEiLz4KPGxpbmUgeDE9IjU1IiB5MT0iMjUiIHgyPSI1MCIgeTI9IjMwIiBzdHJva2U9IiM5NTk1OTUiIHN0cm9rZS13aWR0aD0iMSIvPgo8bGluZSB4MT0iNjUiIHkxPSI0MCIgeDI9IjU1IiB5Mj0iNDAiIHN0cm9rZT0iIzk1OTU5NSIgc3Ryb2tlLXdpZHRoPSIxIi8+CjwvZz4KPGNpcmNsZSBjeD0iNDAiIGN5PSI0MCIgcj0iMyIgZmlsbD0iIzMzMzMzMyIvPgo8L3N2Zz4='
          },
          {
            id: 'black_glossy',
            value: 'black_glossy',
            displayName: '黑色光面',
            description: '深邃黑色表盘，高光泽面',
            priceModifier: 200,
            stockQuantity: 35,
            isDefault: false,
            isAvailable: true,
            imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGRlZnM+CjxyYWRpYWxHcmFkaWVudCBpZD0iYmxhY2tHbG9zc3kiIGN4PSIwLjMiIGN5PSIwLjMiPgo8c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjNDQ0NDQ0Ii8+CjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzAwMDAwMCIvPgo8L3JhZGlhbEdyYWRpZW50Pgo8L2RlZnM+CjxjaXJjbGUgY3g9IjQwIiBjeT0iNDAiIHI9IjMwIiBmaWxsPSJ1cmwoI2JsYWNrR2xvc3N5KSIgc3Ryb2tlPSIjMzMzMzMzIiBzdHJva2Utd2lkdGg9IjIiLz4KPGNpcmNsZSBjeD0iNDAiIGN5PSI0MCIgcj0iMyIgZmlsbD0iI0ZGRkZGRiIvPgo8L3N2Zz4='
          },
          {
            id: 'blue_gradient',
            value: 'blue_gradient',
            displayName: '深海蓝渐变',
            description: '深海蓝色表盘，渐变效果',
            priceModifier: 400,
            stockQuantity: 25,
            isDefault: false,
            isAvailable: true,
            imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGRlZnM+CjxyYWRpYWxHcmFkaWVudCBpZD0iYmx1ZUdyYWRpZW50IiBjeD0iMC41IiBjeT0iMC41Ij4KPHN0b3Agb2Zmc2V0PSIwJSIgc3RvcC1jb2xvcj0iIzNiODJmNiIvPgo8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMxZTNhNjUiLz4KPC9yYWRpYWxHcmFkaWVudD4KPC9kZWZzPgo8Y2lyY2xlIGN4PSI0MCIgY3k9IjQwIiByPSIzMCIgZmlsbD0idXJsKCNibHVlR3JhZGllbnQpIiBzdHJva2U9IiMyNTYzZWIiIHN0cm9rZS13aWR0aD0iMiIvPgo8Y2lyY2xlIGN4PSI0MCIgY3k9IjQwIiByPSIzIiBmaWxsPSIjRkZGRkZGIi8+Cjwvc3ZnPg=='
          },
          {
            id: 'silver_textured',
            value: 'silver_textured',
            displayName: '银色麦粒纹',
            description: '银色表盘，精细麦粒纹理',
            priceModifier: 300,
            stockQuantity: 30,
            isDefault: false,
            isAvailable: true,
            imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iNDAiIGN5PSI0MCIgcj0iMzAiIGZpbGw9IiNGNUY1RjUiIHN0cm9rZT0iI0Q0RDRENCIgc3Ryb2tlLXdpZHRoPSIyIi8+CjxnIG9wYWNpdHk9IjAuNCI+CjxjaXJjbGUgY3g9IjMwIiBjeT0iMzAiIHI9IjEiIGZpbGw9IiNCQkJCQkIiLz4KPGNpcmNsZSBjeD0iNTAiIGN5PSIzNSIgcj0iMSIgZmlsbD0iI0JCQkJCQiIvPgo8Y2lyY2xlIGN4PSI0NSIgY3k9IjUwIiByPSIxIiBmaWxsPSIjQkJCQkJCIi8+CjwvZz4KPGNpcmNsZSBjeD0iNDAiIGN5PSI0MCIgcj0iMyIgZmlsbD0iIzMzMzMzMyIvPgo8L3N2Zz4='
          }
        ],
        category: CustomizationCategory.DIAL,
        defaultValue: 'white_sunburst',
        maxLength: 0,
        sortOrder: 2,
        isActive: true,
        priceModifier: 0
      },
      // 3. 时分针配置
      {
        id: 'hour_minute_hands',
        name: 'hour_minute_hands',
        displayName: '时分针样式',
        description: '选择时针和分针的设计风格',
        type: 'image',
        required: true,
        values: [
          {
            id: 'classic_sword',
            value: 'classic_sword',
            displayName: '经典剑形针',
            description: '传统剑形指针，简洁优雅',
            priceModifier: 0,
            stockQuantity: 50,
            isDefault: true,
            isAvailable: true,
            imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iNDAiIGN5PSI0MCIgcj0iMzAiIGZpbGw9IiNGOUZBRkIiIHN0cm9rZT0iI0U1RTdFQiIgc3Ryb2tlLXdpZHRoPSIxIi8+CjxsaW5lIHgxPSI0MCIgeTE9IjQwIiB4Mj0iNDAiIHkyPSIyOCIgc3Ryb2tlPSIjMzc0MTUxIiBzdHJva2Utd2lkdGg9IjMiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgo8bGluZSB4MT0iNDAiIHkxPSI0MCIgeDI9IjUyIiB5Mj0iNDAiIHN0cm9rZT0iIzM3NDE1MSIgc3Ryb2tlLXdpZHRoPSIyIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPGNpcmNsZSBjeD0iNDAiIGN5PSI0MCIgcj0iNCIgZmlsbD0iIzM3NDE1MSIvPgo8L3N2Zz4='
          },
          {
            id: 'dauphine_hands',
            value: 'dauphine_hands',
            displayName: '太子妃针',
            description: '经典太子妃造型，优雅精致',
            priceModifier: 300,
            stockQuantity: 35,
            isDefault: false,
            isAvailable: true,
            imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iNDAiIGN5PSI0MCIgcj0iMzAiIGZpbGw9IiNGOUZBRkIiIHN0cm9rZT0iI0U1RTdFQiIgc3Ryb2tlLXdpZHRoPSIxIi8+CjxwYXRoIGQ9Ik00MCA0MEw0MiAyOEw0MSAyNi41TDM5IDI2LjVMMzggMjhMNDAgNDBaIiBmaWxsPSIjMzc0MTUxIiBzdHJva2U9IiMzNzQxNTEiIHN0cm9rZS13aWR0aD0iMC41Ii8+CjxwYXRoIGQ9Ik00MCA0MEw1MiA0MS41TDUxLjUgNDBMNTIgMzguNUw0MCA0MFoiIGZpbGw9IiMzNzQxNTEiIHN0cm9rZT0iIzM3NDE1MSIgc3Ryb2tlLXdpZHRoPSIwLjUiLz4KPGNpcmNsZSBjeD0iNDAiIGN5PSI0MCIgcj0iNCIgZmlsbD0iIzM3NDE1MSIvPgo8L3N2Zz4='
          },
          {
            id: 'arrow_hands',
            value: 'arrow_hands',
            displayName: '箭头式指针',
            description: '现代箭头设计，运动风格',
            priceModifier: 200,
            stockQuantity: 40,
            isDefault: false,
            isAvailable: true,
            imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iNDAiIGN5PSI0MCIgcj0iMzAiIGZpbGw9IiNGOUZBRkIiIHN0cm9rZT0iI0U1RTdFQiIgc3Ryb2tlLXdpZHRoPSIxIi8+CjxwYXRoIGQ9Ik00MCA0MEwzOCAyOEw0MC41IDI4TDQxLjUgMjhMNDIgMjhMNDAgNDBaIiBmaWxsPSIjMzc0MTUxIi8+CjxwYXRoIGQ9Ik00MCA0MEw0MyAzOEw1MiA0MEw0MyA0Mkw0MCA0MFoiIGZpbGw9IiMzNzQxNTEiLz4KPGNpcmNsZSBjeD0iNDAiIGN5PSI0MCIgcj0iNCIgZmlsbD0iIzM3NDE1MSIvPgo8L3N2Zz4='
          },
          {
            id: 'baton_hands',
            value: 'baton_hands',
            displayName: '棒形指针',
            description: '简约棒形设计，现代简洁',
            priceModifier: 150,
            stockQuantity: 45,
            isDefault: false,
            isAvailable: true,
            imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iNDAiIGN5PSI0MCIgcj0iMzAiIGZpbGw9IiNGOUZBRkIiIHN0cm9rZT0iI0U1RTdFQiIgc3Ryb2tlLXdpZHRoPSIxIi8+CjxyZWN0IHg9IjM5IiB5PSIyOCIgd2lkdGg9IjIiIGhlaWdodD0iMTIiIGZpbGw9IiMzNzQxNTEiIHJ4PSIxIi8+CjxyZWN0IHg9IjQwIiB5PSIzOSIgd2lkdGg9IjEyIiBoZWlnaHQ9IjIiIGZpbGw9IiMzNzQxNTEiIHJ4PSIxIi8+CjxjaXJjbGUgY3g9IjQwIiBjeT0iNDAiIHI9IjQiIGZpbGw9IiMzNzQxNTEiLz4KPC9zdmc+'
          }
        ],
        category: CustomizationCategory.HANDS,
        defaultValue: 'classic_sword',
        maxLength: 0,
        sortOrder: 3,
        isActive: true,
        priceModifier: 0
      },
      // 4. 秒针配置
      {
        id: 'second_hand',
        name: 'second_hand',
        displayName: '秒针样式',
        description: '选择秒针的颜色和设计',
        type: 'image',
        required: true,
        values: [
          {
            id: 'red_thin',
            value: 'red_thin',
            displayName: '红色细针',
            description: '经典红色秒针，精细设计',
            priceModifier: 0,
            stockQuantity: 50,
            isDefault: true,
            isAvailable: true,
            imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iNDAiIGN5PSI0MCIgcj0iMzAiIGZpbGw9IiNGOUZBRkIiIHN0cm9rZT0iI0U1RTdFQiIgc3Ryb2tlLXdpZHRoPSIxIi8+CjxsaW5lIHgxPSI0MCIgeTE9IjQwIiB4Mj0iNDAiIHkyPSIxOCIgc3Ryb2tlPSIjRUY0NDQ0IiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+CjxjaXJjbGUgY3g9IjQwIiBjeT0iNDAiIHI9IjMiIGZpbGw9IiNFRjQ0NDQiLz4KPC9zdmc+'
          },
          {
            id: 'blue_counterweight',
            value: 'blue_counterweight',
            displayName: '蓝色配重针',
            description: '蓝色秒针带配重设计',
            priceModifier: 150,
            stockQuantity: 35,
            isDefault: false,
            isAvailable: true,
            imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iNDAiIGN5PSI0MCIgcj0iMzAiIGZpbGw9IiNGOUZBRkIiIHN0cm9rZT0iI0U1RTdFQiIgc3Ryb2tlLXdpZHRoPSIxIi8+CjxsaW5lIHgxPSI0MCIgeTE9IjQwIiB4Mj0iNDAiIHkyPSIxOCIgc3Ryb2tlPSIjM2I4MmY2IiBzdHJva2Utd2lkdGg9IjEuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+CjxjaXJjbGUgY3g9IjQwIiBjeT0iNTUiIHI9IjQiIGZpbGw9IiMzYjgyZjYiLz4KPGNpcmNsZSBjeD0iNDAiIGN5PSI0MCIgcj0iMyIgZmlsbD0iIzNiODJmNiIvPgo8L3N2Zz4='
          },
          {
            id: 'orange_racing',
            value: 'orange_racing',
            displayName: '橙色赛车针',
            description: '橙色运动秒针，赛车风格',
            priceModifier: 100,
            stockQuantity: 40,
            isDefault: false,
            isAvailable: true,
            imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iNDAiIGN5PSI0MCIgcj0iMzAiIGZpbGw9IiNGOUZBRkIiIHN0cm9rZT0iI0U1RTdFQiIgc3Ryb2tlLXdpZHRoPSIxIi8+CjxsaW5lIHgxPSI0MCIgeTE9IjQwIiB4Mj0iNDAiIHkyPSIxNyIgc3Ryb2tlPSIjRjU5RTBEIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgo8Y2lyY2xlIGN4PSI0MCIgY3k9IjQwIiByPSIzIiBmaWxsPSIjRjU5RTBEIi8+Cjwvc3ZnPg=='
          },
          {
            id: 'white_lume',
            value: 'white_lume',
            displayName: '白色夜光针',
            description: '白色秒针，夜光涂层',
            priceModifier: 250,
            stockQuantity: 30,
            isDefault: false,
            isAvailable: true,
            imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iNDAiIGN5PSI0MCIgcj0iMzAiIGZpbGw9IiNGOUZBRkIiIHN0cm9rZT0iI0U1RTdFQiIgc3Ryb2tlLXdpZHRoPSIxIi8+CjxsaW5lIHgxPSI0MCIgeTE9IjQwIiB4Mj0iNDAiIHkyPSIxNyIgc3Ryb2tlPSIjRkZGRkZGIiBzdHJva2Utd2lkdGg9IjIuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBvcGFjaXR5PSIwLjkiLz4KPGNpcmNsZSBjeD0iNDAiIGN5PSI0MCIgcj0iMyIgZmlsbD0iI0ZGRkZGRiIgb3BhY2l0eT0iMC45Ii8+Cjwvc3ZnPg=='
          }
        ],
        category: CustomizationCategory.HANDS,
        defaultValue: 'red_thin',
        maxLength: 0,
        sortOrder: 4,
        isActive: true,
        priceModifier: 0
      },
      // 5. 表带配置
      {
        id: 'strap_type',
        name: 'strap_type',
        displayName: '表带类型',
        description: '选择表带材质和样式',
        type: 'image',
        required: true,
        values: [
          {
            id: 'leather_brown',
            value: 'leather_brown',
            displayName: '棕色真皮',
            description: '意大利小牛皮，棕色经典',
            priceModifier: 0,
            stockQuantity: 50,
            isDefault: true,
            isAvailable: true,
            imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3QgeD0iMzAiIHk9IjE1IiB3aWR0aD0iMjAiIGhlaWdodD0iNTAiIHJ4PSI0IiBmaWxsPSIjOTI0MDBEIiBzdHJva2U9IiM3QzJEMTIiIHN0cm9rZS13aWR0aD0iMSIvPgo8bGluZSB4MT0iMzIiIHkxPSIyMCIgeDI9IjQ4IiB5Mj0iMjAiIHN0cm9rZT0iIzdDMkQxMiIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuNyIvPgo8bGluZSB4MT0iMzIiIHkxPSIyNSIgeDI9IjQ4IiB5Mj0iMjUiIHN0cm9rZT0iIzdDMkQxMiIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuNyIvPgo8bGluZSB4MT0iMzIiIHkxPSIzMCIgeDI9IjQ4IiB5Mj0iMzAiIHN0cm9rZT0iIzdDMkQxMiIgc3Ryb2tlLXdpZHRoPSIwLjUiIG9wYWNpdHk9IjAuNyIvPgo8L3N2Zz4='
          },
          {
            id: 'steel_bracelet',
            value: 'steel_bracelet',
            displayName: '钢制表链',
            description: '不锈钢表链，运动款式',
            priceModifier: 600,
            stockQuantity: 35,
            isDefault: false,
            isAvailable: true,
            imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGRlZnM+CjxsaW5lYXJHcmFkaWVudCBpZD0ic3RlZWxHcmFkaWVudCIgeDE9IjAlIiB5MT0iMCUiIHgyPSIxMDAlIiB5Mj0iMTAwJSI+CjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNGRkZGRkYiLz4KPHN0b3Agb2Zmc2V0PSIzMCUiIHN0b3AtY29sb3I9IiNFNUU3RUIiLz4KPHN0b3Agb2Zmc2V0PSI3MCUiIHN0b3AtY29sb3I9IiNEMUQ1REIiLz4KPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjOTQ5NEE0Ii8+CjwvbGluZWFyR3JhZGllbnQ+CjwvZGVmcz4KCjwhLS0g6KGo6ZO+IEJyYWNlbGV0IC0tPgo8cmVjdCB4PSIyOCIgeT0iMTIiIHdpZHRoPSIyNCIgaGVpZ2h0PSI4IiByeD0iNCIgZmlsbD0idXJsKCNzdGVlbEdyYWRpZW50KSIgc3Ryb2tlPSIjOTk5OTk5IiBzdHJva2Utd2lkdGg9IjEiLz4KPHJlY3QgeD0iMjgiIHk9IjIyIiB3aWR0aD0iMjQiIGhlaWdodD0iOCIgcng9IjQiIGZpbGw9InVybCgjc3RlZWxHcmFkaWVudCkiIHN0cm9rZT0iIzk5OTk5OSIgc3Ryb2tlLXdpZHRoPSIxIi8+CjxyZWN0IHg9IjI4IiB5PSIzMiIgd2lkdGg9IjI0IiBoZWlnaHQ9IjgiIHJ4PSI0IiBmaWxsPSJ1cmwoI3N0ZWVsR3JhZGllbnQpIiBzdHJva2U9IiM5OTk5OTkiIHN0cm9rZS13aWR0aD0iMSIvPgo8cmVjdCB4PSIyOCIgeT0iNDIiIHdpZHRoPSIyNCIgaGVpZ2h0PSI4IiByeD0iNCIgZmlsbD0idXJsKCNzdGVlbEdyYWRpZW50KSIgc3Ryb2tlPSIjOTk5OTk5IiBzdHJva2Utd2lkdGg9IjEiLz4KPHJlY3QgeD0iMjgiIHk9IjUyIiB3aWR0aD0iMjQiIGhlaWdodD0iOCIgcng9IjQiIGZpbGw9InVybCgjc3RlZWxHcmFkaWVudCkiIHN0cm9rZT0iIzk5OTk5OSIgc3Ryb2tlLXdpZHRoPSIxIi8+CjxyZWN0IHg9IjI4IiB5PSI2MiIgd2lkdGg9IjI0IiBoZWlnaHQ9IjgiIHJ4PSI0IiBmaWxsPSJ1cmwoI3N0ZWVsR3JhZGllbnQpIiBzdHJva2U9IiM5OTk5OTkiIHN0cm9rZS13aWR0aD0iMSIvPgoKPCEtLSDph5Hlhb3pq5jlhYkg5pWI5p6cIC0tPgo8cmVjdCB4PSI0MCIgeT0iMTQiIHdpZHRoPSIyIiBoZWlnaHQ9IjUiIGZpbGw9IiNGRkZGRkYiIG9wYWNpdHk9IjAuOCIvPgo8cmVjdCB4PSI0MCIgeT0iMjQiIHdpZHRoPSIyIiBoZWlnaHQ9IjUiIGZpbGw9IiNGRkZGRkYiIG9wYWNpdHk9IjAuOCIvPgo8cmVjdCB4PSI0MCIgeT0iMzQiIHdpZHRoPSIyIiBoZWlnaHQ9IjUiIGZpbGw9IiNGRkZGRkYiIG9wYWNpdHk9IjAuOCIvPgo8cmVjdCB4PSI0MCIgeT0iNDQiIHdpZHRoPSIyIiBoZWlnaHQ9IjUiIGZpbGw9IiNGRkZGRkYiIG9wYWNpdHk9IjAuOCIvPgo8cmVjdCB4PSI0MCIgeT0iNTQiIHdpZHRoPSIyIiBoZWlnaHQ9IjUiIGZpbGw9IiNGRkZGRkYiIG9wYWNpdHk9IjAuOCIvPgo8cmVjdCB4PSI0MCIgeT0iNjQiIHdpZHRoPSIyIiBoZWlnaHQ9IjUiIGZpbGw9IiNGRkZGRkYiIG9wYWNpdHk9IjAuOCIvPgo8L3N2Zz4='
          },
          {
            id: 'rubber_black',
            value: 'rubber_black',
            displayName: '黑色硅胶',
            description: '运动硅胶表带，防水防汗',
            priceModifier: 250,
            stockQuantity: 45,
            isDefault: false,
            isAvailable: true,
            imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3QgeD0iMzAiIHk9IjE1IiB3aWR0aD0iMjAiIGhlaWdodD0iNTAiIHJ4PSI2IiBmaWxsPSIjMjI0MzM0IiBzdHJva2U9IiMzNzM3MzciIHN0cm9rZS13aWR0aD0iMSIvPgo8Y2lyY2xlIGN4PSIzNCIgY3k9IjIwIiByPSIxLjUiIGZpbGw9IiM0NDQ0NDQiLz4KPGNpcmNsZSBjeD0iNDYiIGN5PSIyNSIgcj0iMS41IiBmaWxsPSIjNDQ0NDQ0Ii8+CjxjaXJjbGUgY3g9IjM0IiBjeT0iMzAiIHI9IjEuNSIgZmlsbD0iIzQ0NDQ0NCIvPgo8Y2lyY2xlIGN4PSI0NiIgY3k9IjM1IiByPSIxLjUiIGZpbGw9IiM0NDQ0NDQiLz4KPC9zdmc+'
          },
          {
            id: 'nato_strap',
            value: 'nato_strap',
            displayName: 'NATO尼龙',
            description: '军用NATO尼龙表带',
            priceModifier: 180,
            stockQuantity: 40,
            isDefault: false,
            isAvailable: true,
            imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3QgeD0iMzAiIHk9IjE1IiB3aWR0aD0iMjAiIGhlaWdodD0iNTAiIHJ4PSIyIiBmaWxsPSIjMkY0RjRGIiBzdHJva2U9IiM1NDU0NTQiIHN0cm9rZS13aWR0aD0iMSIvPgo8cmVjdCB4PSIzMSIgeT0iMTgiIHdpZHRoPSIxOCIgaGVpZ2h0PSIzIiBmaWxsPSIjNEY3RjRGIi8+CjxyZWN0IHg9IjMxIiB5PSIyNCIgd2lkdGg9IjE4IiBoZWlnaHQ9IjMiIGZpbGw9IiMyRjRGNEYiLz4KPHJlY3QgeD0iMzEiIHk9IjMwIiB3aWR0aD0iMTgiIGhlaWdodD0iMyIgZmlsbD0iIzRGN0Y0RiIvPgo8cmVjdCB4PSIzMSIgeT0iMzYiIHdpZHRoPSIxOCIgaGVpZ2h0PSIzIiBmaWxsPSIjMkY0RjRGIi8+Cjwvc3ZnPg=='
          },
          {
            id: 'mesh_steel',
            value: 'mesh_steel',
            displayName: '钢网表带',
            description: '精密钢网编织表带',
            priceModifier: 800,
            stockQuantity: 25,
            isDefault: false,
            isAvailable: true,
            imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3QgeD0iMzAiIHk9IjE1IiB3aWR0aD0iMjAiIGhlaWdodD0iNTAiIHJ4PSIzIiBmaWxsPSIjRkFGQUZBIiBzdHJva2U9IiNEREREREQiIHN0cm9rZS13aWR0aD0iMSIvPgo8ZyBvcGFjaXR5PSIwLjciPgo8Y2lyY2xlIGN4PSIzMyIgY3k9IjE4IiByPSIwLjgiIGZpbGw9IiNCQkJCQkIiLz4KPGNpcmNsZSBjeD0iMzciIGN5PSIxOCIgcj0iMC44IiBmaWxsPSIjQkJCQkJCIi8+CjxjaXJjbGUgY3g9IjQxIiBjeT0iMTgiIHI9IjAuOCIgZmlsbD0iI0JCQkJCQiIvPgo8Y2lyY2xlIGN4PSI0NSIgY3k9IjE4IiByPSIwLjgiIGZpbGw9IiNCQkJCQkIiLz4KPGNpcmNsZSBjeD0iMzMiIGN5PSIyMiIgcj0iMC44IiBmaWxsPSIjQkJCQkJCIi8+CjxjaXJjbGUgY3g9IjM3IiBjeT0iMjIiIHI9IjAuOCIgZmlsbD0iI0JCQkJCQiIvPgo8L2c+Cjwvc3ZnPg=='
          }
        ],
        category: CustomizationCategory.STRAP,
        defaultValue: 'leather_brown',
        maxLength: 0,
        sortOrder: 5,
        isActive: true,
        priceModifier: 0
      },
      // 6. 机芯配置
      {
        id: 'movement_type',
        name: 'movement_type',
        displayName: '机芯类型',
        description: '选择机芯类型和功能',
        type: 'image',
        required: true,
        values: [
          {
            id: 'automatic_basic',
            value: 'automatic_basic',
            displayName: '基础自动机芯',
            description: 'ST8G自动机芯，42小时动力储存',
            priceModifier: 0,
            stockQuantity: 50,
            isDefault: true,
            isAvailable: true,
            imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iNDAiIGN5PSI0MCIgcj0iMzAiIGZpbGw9IiNGOUZBRkIiIHN0cm9rZT0iI0U1RTdFQiIgc3Ryb2tlLXdpZHRoPSIyIi8+CjxjaXJjbGUgY3g9IjQwIiBjeT0iNDAiIHI9IjIwIiBmaWxsPSJub25lIiBzdHJva2U9IiNCQkJCQkIiIHN0cm9rZS13aWR0aD0iMSIgc3Ryb2tlLWRhc2hhcnJheT0iNCwyIi8+CjxjaXJjbGUgY3g9IjQwIiBjeT0iNDAiIHI9IjEyIiBmaWxsPSJub25lIiBzdHJva2U9IiM5OTk5OTkiIHN0cm9rZS13aWR0aD0iMSIvPgo8Y2lyY2xlIGN4PSI0MCIgY3k9IjQwIiByPSI2IiBmaWxsPSIjRDREOEREIi8+CjxjaXJjbGUgY3g9IjQwIiBjeT0iNDAiIHI9IjMiIGZpbGw9IiM3Nzc3NzciLz4KPHRleHQgeD0iNDAiIHk9IjY4IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTAiIGZpbGw9IiM2NjY2NjYiIHRleHQtYW5jaG9yPSJtaWRkbGUiPjQySGU8L3RleHQ+Cjwvc3ZnPg=='
          },
          {
            id: 'automatic_premium',
            value: 'automatic_premium',
            displayName: '高级自动机芯',
            description: 'ST8K高级机芯，72小时动力储存',
            priceModifier: 1800,
            stockQuantity: 25,
            isDefault: false,
            isAvailable: true,
            imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iNDAiIGN5PSI0MCIgcj0iMzAiIGZpbGw9IiNGQUZBRkEiIHN0cm9rZT0iI0I4ODYwRCIgc3Ryb2tlLXdpZHRoPSIzIi8+CjxjaXJjbGUgY3g9IjQwIiBjeT0iNDAiIHI9IjIwIiBmaWxsPSJub25lIiBzdHJva2U9IiNGRkM1MDAiIHN0cm9rZS13aWR0aD0iMyIgc3Ryb2tlLWRhc2hhcnJheT0iNSwzIi8+CjxjaXJjbGUgY3g9IjQwIiBjeT0iNDAiIHI9IjEyIiBmaWxsPSIjRkZEQjAwIiBzdHJva2U9IiNCODg2MEQiIHN0cm9rZS13aWR0aD0iMiIvPgo8Y2lyY2xlIGN4PSI0MCIgY3k9IjQwIiByPSI1IiBmaWxsPSIjQjg4NjBEIi8+CjxyZWN0IHg9IjM4IiB5PSIyNCIgd2lkdGg9IjQiIGhlaWdodD0iOCIgZmlsbD0iI0I4ODYwRCIvPgo8cmVjdCB4PSI1NiIgeT0iMzgiIHdpZHRoPSI4IiBoZWlnaHQ9IjQiIGZpbGw9IiNCODg2MEQiLz4KPHJlY3QgeD0iMzgiIHk9IjU2IiB3aWR0aD0iNCIgaGVpZ2h0PSI4IiBmaWxsPSIjQjg4NjBEIi8+CjxyZWN0IHg9IjI0IiB5PSIzOCIgd2lkdGg9IjgiIGhlaWdodD0iNCIgZmlsbD0iI0I4ODYwRCIvPgo8dGV4dCB4PSI0MCIgeT0iNzIiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSI5IiBmaWxsPSIjQjg4NjBEIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj43MkggPC90ZXh0Pgo8L3N2Zz4='
          },
          {
            id: 'chronograph',
            value: 'chronograph',
            displayName: '计时机芯',
            description: 'ST1K计时机芯，多功能计时',
            priceModifier: 3500,
            stockQuantity: 15,
            isDefault: false,
            isAvailable: true,
            imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iNDAiIGN5PSI0MCIgcj0iMzAiIGZpbGw9IiNGOUZBRkIiIHN0cm9rZT0iI0U1RTdFQiIgc3Ryb2tlLXdpZHRoPSIyIi8+CjxjaXJjbGUgY3g9IjQwIiBjeT0iNDAiIHI9IjIwIiBmaWxsPSJub25lIiBzdHJva2U9IiMzNzQxNTEiIHN0cm9rZS13aWR0aD0iMS41Ii8+CjxjaXJjbGUgY3g9IjQwIiBjeT0iNDAiIHI9IjE0IiBmaWxsPSJub25lIiBzdHJva2U9IiNGRjAwMDAiIHN0cm9rZS13aWR0aD0iMSIgc3Ryb2tlLWRhc2hhcnJheT0iMiwxIi8+CjxjaXJjbGUgY3g9IjQwIiBjeT0iNDAiIHI9IjQiIGZpbGw9IiMzNzQxNTEiLz4KPHRleHQgeD0iNDAiIHk9IjY4IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iOSIgZmlsbD0iI0ZGMDAwMCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+UzFLYzwvdGV4dD4KPC9zdmc+'
          },
          {
            id: 'gmt',
            value: 'gmt',
            displayName: 'GMT双时区',
            description: 'ST2G机芯，GMT双时区功能',
            priceModifier: 2200,
            stockQuantity: 20,
            isDefault: false,
            isAvailable: true,
            imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iNDAiIGN5PSI0MCIgcj0iMzAiIGZpbGw9IiNGOUZBRkIiIHN0cm9rZT0iI0U1RTdFQiIgc3Ryb2tlLXdpZHRoPSIyIi8+CjxjaXJjbGUgY3g9IjQwIiBjeT0iNDAiIHI9IjIwIiBmaWxsPSJub25lIiBzdHJva2U9IiMzNzQxNTEiIHN0cm9rZS13aWR0aD0iMS41Ii8+CjxjaXJjbGUgY3g9IjQwIiBjeT0iNDAiIHI9IjE0IiBmaWxsPSJub25lIiBzdHJva2U9IiNGRjAwMDAiIHN0cm9rZS13aWR0aD0iMSIgc3Ryb2tlLWRhc2hhcnJheT0iMiwxIi8+CjxjaXJjbGUgY3g9IjQwIiBjeT0iNDAiIHI9IjQiIGZpbGw9IiMzNzQxNTEiLz4KPHRleHQgeD0iNDAiIHk9IjY4IiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iOSIgZmlsbD0iI0ZGMDAwMCIgdGV4dC1hbmNob3I9Im1pZGRsZSI+R01UPC90ZXh0Pgo8L3N2Zz4='
          }
        ],
        category: CustomizationCategory.COMPLICATIONS,
        defaultValue: 'automatic_basic',
        maxLength: 0,
        sortOrder: 6,
        isActive: true,
        priceModifier: 0
      }
    ],
    previewImages: {},
    manufacturingTime: 15,
    minCustomizationPrice: product.price,
    maxCustomizationPrice: product.price + 8000,
    customizationGuide: '我们的定制服务允许您个性化每一个细节，打造独一无二的海鸥表。',
    sizingGuide: '表径40mm，适合腕围15-20cm佩戴。',
    careInstructions: '避免接触强磁场，定期保养以确保最佳性能。'
  };
}; 