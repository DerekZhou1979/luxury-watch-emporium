#!/bin/bash

echo "🖼️  开始批量优化图片..."

# 创建优化目录
mkdir -p public/images-optimized

# 计数器
count=0

# 遍历所有图片文件
for file in public/images/*; do
    if [[ -f "$file" ]]; then
        filename=$(basename "$file")
        
        # 获取文件扩展名
        if [[ "$filename" == *.jpg ]] || [[ "$filename" == *.jpeg ]] || [[ "$filename" == *.JPG ]] || [[ "$filename" == *.JPEG ]]; then
            echo "处理 JPEG: $filename"
            # JPEG 文件：压缩质量70%，最大宽度1920px
            sips -s format jpeg -s formatOptions 70 --resampleHeightWidthMax 1920 "$file" --out "public/images-optimized/$filename" 2>/dev/null
        elif [[ "$filename" == *.png ]] || [[ "$filename" == *.PNG ]]; then
            echo "处理 PNG: $filename"
            # PNG 文件：先缩放，然后转换为JPEG
            base_name="${filename%.*}"
            sips -s format jpeg -s formatOptions 75 --resampleHeightWidthMax 1920 "$file" --out "public/images-optimized/${base_name}.jpg" 2>/dev/null
        else
            echo "复制其他格式: $filename"
            # 其他格式直接复制
            cp "$file" "public/images-optimized/"
        fi
        
        count=$((count + 1))
        if [ $((count % 10)) -eq 0 ]; then
            echo "✅ 已处理 $count 个文件..."
        fi
    fi
done

echo ""
echo "🎉 优化完成！"
echo "📊 处理了 $count 个文件"

# 显示大小对比
echo "📁 检查优化结果:"
du -sh public/images/ 2>/dev/null && echo "   ↑ 原始大小"
du -sh public/images-optimized/ 2>/dev/null && echo "   ↑ 优化后大小" 