#!/bin/bash

echo "🗑️ 删除未使用的图片文件..."
echo "==============================="

# 未使用图片列表（基于之前的分析）
UNUSED_IMAGES=(
    # 自定义缩略图系列 (12个)
    "public/images/seagull_1963_custom_thumb_01_front.png"
    "public/images/seagull_1963_custom_thumb_01_front.svg"
    "public/images/seagull_1963_custom_thumb_02_front.png"
    "public/images/seagull_1963_custom_thumb_04_front.png"
    "public/images/seagull_1963_custom_thumb_05_front.png"
    "public/images/seagull_1963_custom_thumb_07_front.png"
    "public/images/seagull_1963_custom_thumb_08_front.png"
    "public/images/seagull_1963_custom_thumb_09_front.png"
    "public/images/seagull_1963_custom_thumb_10_front.png"
    "public/images/seagull_1963_custom_thumb_11_front.png"
    "public/images/seagull_1963_custom_thumb_12_front.png"
    "public/images/seagull_1963_custom_thumb_front.jpg"
    
    # 背景图片 (4个)
    "public/images/seagull_background_(watch).jpg"
    "public/images/seagull_background_01.jpg"
    "public/images/seagull_background.jpg"
    "public/images/seagull_background.png"
    
    # 英雄横幅系列 (18个)
    "public/images/seagull_hero_banner_1963pilot_main_01.jpg"
    "public/images/seagull_hero_banner_1963pilot_main_02.jpg"
    "public/images/seagull_hero_banner_1963pilot_main_tachymeter.png"
    "public/images/seagull_hero_banner_dive_main.jpg"
    "public/images/seagull_hero_banner_dive.jpg"
    "public/images/seagull_hero_banner_main_sea.jpg"
    "public/images/seagull_hero_banner_retrotv_main.png"
    "public/images/seagull_hero_banner_tourbillon_skeleton_gold.png"
    "public/images/seagull_hero_banner_tourbillon_skeleton_main_01.jpg"
    "public/images/seagull_hero_banner_tourbillon_skeleton_main_01.png"
    "public/images/seagull_hero_banner_tourbillon_skeleton_main_02.png"
    "public/images/seagull_hero_banner_tourbillon_skeleton_main_gold_01.jpg"
    "public/images/seagull_hero_banner_tourbillon_skeleton_main_gold.jpg"
    "public/images/seagull_hero_banner_tourbillon_skeleton_main_gold.png"
    "public/images/seagull_hero_banner_tourbillon_skeleton_main_seagull.jpg"
    "public/images/seagull_hero_banner_tourbillon_skeleton_main_skeleton.png"
    "public/images/seagull_hero_banner_tourbillon_skeleton_main.jpg"
    "public/images/seagull_hero_banner_tourbillon_skeleton_main.png"
    
    # 飞行系列 (2个)
    "public/images/seagull_hero_flight_19_1963.jpg"
    "public/images/seagull_hero_flight_26_1963.png"
    
    # 图标系列 (5个)
    "public/images/seagull_icon_(logo)_main_gull.png"
    "public/images/seagull_icon_main_gull.png"
    "public/images/seagull_icon_n_a_main_gull.png"
    "public/images/seagull_icon_n_a_main.png"
    "public/images/seagull_icon_thumb.jpg"
    
    # 新闻系列 (3个)
    "public/images/seagull_news_main_gull.jpg"
    "public/images/seagull_news_main_gull.png"
    "public/images/seagull_news_n_a_watch_main.jpg"
    
    # 团队系列 (3个)
    "public/images/seagull_team_n_a_no_watch_visible_main.jpg"
    "public/images/seagull_team_none_visible_main.jpg"
    "public/images/seagull_team_，watch_main.jpg"
    
    # 产品展示（未使用）(17个)
    "public/images/seagull_product_1963pilot_main_rattrapante_01.png"
    "public/images/seagull_product_1963pilot_main_rattrapante.png"
    "public/images/seagull_product_1963pilot_main_seagull.png"
    "public/images/seagull_product_1963pilot_main_zuan.png"
    "public/images/seagull_product_main_gold.png"
    "public/images/seagull_product_n_a_main_gold.png"
    "public/images/seagull_product_n_a_main.png"
    "public/images/seagull_product_tourbillon_skeleton_main_gold_02.jpg"
    "public/images/seagull_product_tourbillon_skeleton_main_gold_04.png"
    "public/images/seagull_product_tourbillon_skeleton_main_gold_06.png"
    "public/images/seagull_product_tourbillon_skeleton_main_gold_11.jpg"
    "public/images/seagull_product_tourbillon_skeleton_main_gold_12.png"
    "public/images/seagull_product_tourbillon_skeleton_main_gold_13.png"
    "public/images/seagull_product_tourbillon_skeleton_main_gold_14.jpg"
    "public/images/seagull_product_tourbillon_skeleton_main_gold_21.png"
    "public/images/seagull_product_tourbillon_skeleton.jpg"
    "public/images/seagull_product_women_main_gold_05.png"
    
    # 详情图片（未使用）(1个)
    "public/images/seagull_detail_1963pilot_main.png"
)

# 统计
TOTAL_FILES=${#UNUSED_IMAGES[@]}
DELETED_COUNT=0
FAILED_COUNT=0

echo "📊 准备删除 $TOTAL_FILES 个未使用的图片文件"
echo ""

# 逐个删除文件
for image_path in "${UNUSED_IMAGES[@]}"; do
    if [ -f "$image_path" ]; then
        echo "🗑️ 删除: $image_path"
        if rm "$image_path"; then
            ((DELETED_COUNT++))
        else
            echo "❌ 删除失败: $image_path"
            ((FAILED_COUNT++))
        fi
    else
        echo "⚠️ 文件不存在: $image_path"
        ((FAILED_COUNT++))
    fi
done

echo ""
echo "📈 删除统计："
echo "============="
echo "总计划删除: $TOTAL_FILES"
echo "成功删除: $DELETED_COUNT"
echo "失败/不存在: $FAILED_COUNT"

# 重新统计剩余图片
echo ""
echo "📊 删除后的统计："
echo "================"
REMAINING_IMAGES=$(find public/images -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" -o -name "*.gif" -o -name "*.svg" | grep -v ".DS_Store" | wc -l)
echo "剩余图片文件数: $REMAINING_IMAGES"

echo ""
echo "✅ 清理完成！"
echo "💡 建议重新运行构建和部署来更新网站" 