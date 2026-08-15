#!/bin/bash

# ============================================
# WhatsApp Bot API - cURL Examples
# ============================================

echo "📡 WhatsApp Bot API - cURL Commands"
echo "====================================="
echo ""

# Warna untuk output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

API_URL="http://localhost:3000"

# ============================================
# 1. CHECK STATUS
# ============================================
echo -e "${BLUE}1. Cek Status Bot${NC}"
echo "curl http://localhost:3000/status"
echo ""
curl -s http://localhost:3000/status | jq .
echo ""
echo "-----------------------------------"
echo ""

# ============================================
# 2. KIRIM PESAN SEDERHANA
# ============================================
echo -e "${BLUE}2. Kirim Pesan Sederhana${NC}"
echo "curl -X POST http://localhost:3000/send \\"
echo "  -H \"Content-Type: application/json\" \\"
echo "  -d '{\"number\":\"089509844606\",\"message\":\"Halo! Test pesan\"}'"
echo ""

read -p "Kirim pesan? (y/n): " response
if [ "$response" = "y" ]; then
    curl -X POST http://localhost:3000/send \
      -H "Content-Type: application/json" \
      -d '{"number":"089509844606","message":"Halo! Ini pesan test dari cURL"}' | jq .
fi
echo ""
echo "-----------------------------------"
echo ""

# ============================================
# 3. KIRIM PESAN DENGAN EMOJI
# ============================================
echo -e "${BLUE}3. Kirim Pesan dengan Emoji${NC}"
echo "curl -X POST http://localhost:3000/send \\"
echo "  -H \"Content-Type: application/json\" \\"
echo "  -d '{\"number\":\"089509844606\",\"message\":\"👋 Halo! ✅ Test\"}'"
echo ""

read -p "Kirim pesan dengan emoji? (y/n): " response
if [ "$response" = "y" ]; then
    curl -X POST http://localhost:3000/send \
      -H "Content-Type: application/json" \
      -d '{"number":"089509844606","message":"👋 Halo!\n\n✅ Pesan dengan emoji\n🚀 Dari cURL\n📅 '"$(date '+%d/%m/%Y %H:%M')"'"}' | jq .
fi
echo ""
echo "-----------------------------------"
echo ""

# ============================================
# 4. KIRIM MEDIA (GAMBAR)
# ============================================
echo -e "${BLUE}4. Kirim Media (Gambar)${NC}"
echo "curl -X POST http://localhost:3000/send-media \\"
echo "  -H \"Content-Type: application/json\" \\"
echo "  -d '{\"number\":\"089509844606\",\"media_url\":\"https://picsum.photos/500\",\"caption\":\"Gambar random\"}'"
echo ""

read -p "Kirim gambar? (y/n): " response
if [ "$response" = "y" ]; then
    curl -X POST http://localhost:3000/send-media \
      -H "Content-Type: application/json" \
      -d '{"number":"089509844606","media_url":"https://picsum.photos/500","caption":"🖼️ Ini gambar random dari Lorem Picsum!"}' | jq .
fi
echo ""
echo "-----------------------------------"
echo ""

# ============================================
# 5. BROADCAST
# ============================================
echo -e "${BLUE}5. Broadcast ke Multiple Nomor${NC}"
echo "curl -X POST http://localhost:3000/broadcast \\"
echo "  -H \"Content-Type: application/json\" \\"
echo "  -d '{\"numbers\":[\"089509844606\",\"081234567890\"],\"message\":\"Broadcast!\"}'"
echo ""

read -p "Kirim broadcast? (y/n): " response
if [ "$response" = "y" ]; then
    curl -X POST http://localhost:3000/broadcast \
      -H "Content-Type: application/json" \
      -d '{"numbers":["089509844606"],"message":"📢 Broadcast Message\n\nIni pesan broadcast dari cURL!"}' | jq .
fi
echo ""
echo "-----------------------------------"
echo ""

echo -e "${GREEN}✅ Selesai!${NC}"
