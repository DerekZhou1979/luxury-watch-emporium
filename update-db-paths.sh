#!/bin/bash

echo "🔄 更新数据库中的图片路径..."

# 备份原始数据库
cp database/seagull-watch-db.json database/seagull-watch-db.json.backup

# 更新PNG为JPG
sed 's/\.png"/.jpg"/g' database/seagull-watch-db.json.backup > database/seagull-watch-db.json

echo "✅ 数据库路径更新完成"
echo "📊 更新统计："
echo "   PNG 引用数量: $(grep -c "\.jpg" database/seagull-watch-db.json)" 