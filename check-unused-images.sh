#!/bin/bash

echo "🔍 检查未使用的图片文件..."
echo "==============================="

# 创建临时文件存储使用的图片
> used_images.txt

# 从所有源代码文件中提取图片引用
echo "📁 扫描代码中的图片引用..."

# 搜索所有可能的图片引用模式
grep -r -h --include="*.tsx" --include="*.ts" --include="*.js" --include="*.jsx" --include="*.json" \
  -E "(images/[^\"']*\.(jpg|jpeg|png|gif|svg))" . | \
  sed -E 's/.*images\/([^"'\'']*\.(jpg|jpeg|png|gif|svg)).*/images\/\1/g' | \
  sort | uniq >> used_images.txt

echo "📊 分析结果："
echo "总图片文件数: $(wc -l < all_images.txt)"
echo "已使用图片数: $(wc -l < used_images.txt)"

echo ""
echo "🚫 未使用的图片文件："
echo "==================="

# 比较所有图片和已使用的图片
unused_count=0
while IFS= read -r image_path; do
    # 移除 public/ 前缀
    image_name=$(echo "$image_path" | sed 's/^public\///')
    
    # 检查是否在使用列表中
    if ! grep -q "$image_name" used_images.txt; then
        echo "❌ $image_path"
        ((unused_count++))
    fi
done < all_images.txt

echo ""
echo "📈 统计总结："
echo "============="
echo "未使用图片数: $unused_count"
echo "使用率: $(echo "scale=2; ($(wc -l < all_images.txt) - $unused_count) * 100 / $(wc -l < all_images.txt)" | bc)%"

# 清理临时文件
rm -f used_images.txt

echo ""
echo "✅ 检查完成！" 