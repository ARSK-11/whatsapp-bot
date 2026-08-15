#!/bin/bash

# ============================================
# WhatsApp Bot API - Group cURL Examples
# ============================================

echo "👥 WhatsApp Bot API - Group Commands"
echo "======================================"
echo ""

API_URL="http://localhost:3000"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# ============================================
# 1. LIST ALL GROUPS
# ============================================
echo -e "${BLUE}1. List Semua Grup${NC}"
echo "curl http://localhost:3000/groups"
echo ""

read -p "Tampilkan daftar grup? (y/n): " response
if [ "$response" = "y" ]; then
    curl -s http://localhost:3000/groups | jq .
fi
echo ""
echo "-----------------------------------"
echo ""

# ============================================
# 2. SEND TO GROUP BY ID
# ============================================
echo -e "${BLUE}2. Kirim ke Grup (by ID)${NC}"
echo ""
echo "Format:"
echo 'curl -X POST http://localhost:3000/send-group \'
echo '  -H "Content-Type: application/json" \'
echo '  -d '"'"'{"group_id":"GROUP_ID","message":"Pesan"}'"'"
echo ""

read -p "Masukkan Group ID (atau tekan Enter untuk skip): " GROUP_ID
if [ ! -z "$GROUP_ID" ]; then
    read -p "Masukkan pesan: " MESSAGE

    curl -X POST http://localhost:3000/send-group \
      -H "Content-Type: application/json" \
      -d "{\"group_id\":\"$GROUP_ID\",\"message\":\"$MESSAGE\"}" | jq .
fi
echo ""
echo "-----------------------------------"
echo ""

# ============================================
# 3. SEND TO GROUP BY NAME
# ============================================
echo -e "${BLUE}3. Kirim ke Grup (by Name) - RECOMMENDED${NC}"
echo ""
echo "Format:"
echo 'curl -X POST http://localhost:3000/send-group-name \'
echo '  -H "Content-Type: application/json" \'
echo '  -d '"'"'{"group_name":"Nama Grup","message":"Pesan"}'"'"
echo ""

read -p "Masukkan nama grup (contoh: Keluarga): " GROUP_NAME
if [ ! -z "$GROUP_NAME" ]; then
    read -p "Masukkan pesan: " MESSAGE

    curl -X POST http://localhost:3000/send-group-name \
      -H "Content-Type: application/json" \
      -d "{\"group_name\":\"$GROUP_NAME\",\"message\":\"$MESSAGE\"}" | jq .
fi
echo ""
echo "-----------------------------------"
echo ""

# ============================================
# 4. QUICK EXAMPLES
# ============================================
echo -e "${BLUE}4. Contoh Cepat${NC}"
echo ""
echo "a) Pengumuman Keluarga:"
echo 'curl -X POST http://localhost:3000/send-group-name -H "Content-Type: application/json" -d '"'"'{"group_name":"Keluarga","message":"📢 Ada acara keluarga minggu depan!"}'"'"
echo ""
echo "b) Update Tim:"
echo 'curl -X POST http://localhost:3000/send-group-name -H "Content-Type: application/json" -d '"'"'{"group_name":"Tim","message":"✅ Project selesai!"}'"'"
echo ""
echo "c) Reminder:"
echo 'curl -X POST http://localhost:3000/send-group-name -H "Content-Type: application/json" -d '"'"'{"group_name":"Kantor","message":"⏰ Meeting dalam 30 menit"}'"'"
echo ""

echo -e "${GREEN}✅ Selesai!${NC}"
