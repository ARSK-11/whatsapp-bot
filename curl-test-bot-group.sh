#!/bin/bash

# ============================================
# cURL Examples untuk Grup "Test_bot"
# ============================================

API_URL="http://localhost:3000"
GROUP_NAME="Test_bot"

echo "📱 cURL Examples - Kirim ke Grup Test_bot"
echo "=========================================="
echo ""

# ============================================
# 1. PESAN SEDERHANA
# ============================================
echo "1️⃣  Pesan Sederhana:"
echo ""
cat << 'EOF'
curl -X POST http://localhost:3000/send-group-name \
  -H "Content-Type: application/json" \
  -d '{"group_name":"Test_bot","message":"Halo grup Test_bot!"}'
EOF
echo ""
echo "---"
echo ""

# ============================================
# 2. PESAN DENGAN EMOJI
# ============================================
echo "2️⃣  Pesan dengan Emoji:"
echo ""
cat << 'EOF'
curl -X POST http://localhost:3000/send-group-name \
  -H "Content-Type: application/json" \
  -d '{"group_name":"Test_bot","message":"👋 Halo!\n\n✅ Test pesan dari bot\n🚀 Via API"}'
EOF
echo ""
echo "---"
echo ""

# ============================================
# 3. PENGUMUMAN
# ============================================
echo "3️⃣  Pengumuman:"
echo ""
cat << 'EOF'
curl -X POST http://localhost:3000/send-group-name \
  -H "Content-Type: application/json" \
  -d '{"group_name":"Test_bot","message":"📢 PENGUMUMAN\n\nIni adalah test pengumuman dari bot WhatsApp.\n\n✅ Fitur grup sudah berjalan!\n📅 '"$(date '+%d/%m/%Y %H:%M')"'"}'
EOF
echo ""
echo "---"
echo ""

# ============================================
# 4. UPDATE STATUS
# ============================================
echo "4️⃣  Update Status:"
echo ""
cat << 'EOF'
curl -X POST http://localhost:3000/send-group-name \
  -H "Content-Type: application/json" \
  -d '{"group_name":"Test_bot","message":"📊 STATUS UPDATE\n\n✅ Bot: Online\n✅ API: Ready\n✅ Fitur Grup: Active\n\n🎉 Semua sistem berjalan normal!"}'
EOF
echo ""
echo "---"
echo ""

# ============================================
# 5. REMINDER
# ============================================
echo "5️⃣  Reminder:"
echo ""
cat << 'EOF'
curl -X POST http://localhost:3000/send-group-name \
  -H "Content-Type: application/json" \
  -d '{"group_name":"Test_bot","message":"⏰ REMINDER\n\nJangan lupa:\n📝 Testing fitur bot\n🔧 Cek dokumentasi\n📱 Report bug jika ada\n\nTerima kasih! 🙏"}'
EOF
echo ""
echo "---"
echo ""

# ============================================
# INTERACTIVE MODE
# ============================================
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
read -p "Ingin mengirim pesan sekarang? (y/n): " SEND_NOW

if [ "$SEND_NOW" = "y" ]; then
    echo ""
    read -p "Pilih contoh (1-5): " CHOICE
    echo ""

    case $CHOICE in
        1)
            echo "Mengirim pesan sederhana..."
            curl -X POST http://localhost:3000/send-group-name \
              -H "Content-Type: application/json" \
              -d '{"group_name":"Test_bot","message":"Halo grup Test_bot!"}'
            ;;
        2)
            echo "Mengirim pesan dengan emoji..."
            curl -X POST http://localhost:3000/send-group-name \
              -H "Content-Type: application/json" \
              -d '{"group_name":"Test_bot","message":"👋 Halo!\n\n✅ Test pesan dari bot\n🚀 Via API"}'
            ;;
        3)
            echo "Mengirim pengumuman..."
            curl -X POST http://localhost:3000/send-group-name \
              -H "Content-Type: application/json" \
              -d "{\"group_name\":\"Test_bot\",\"message\":\"📢 PENGUMUMAN\n\nIni adalah test pengumuman dari bot WhatsApp.\n\n✅ Fitur grup sudah berjalan!\n📅 $(date '+%d/%m/%Y %H:%M')\"}"
            ;;
        4)
            echo "Mengirim update status..."
            curl -X POST http://localhost:3000/send-group-name \
              -H "Content-Type: application/json" \
              -d '{"group_name":"Test_bot","message":"📊 STATUS UPDATE\n\n✅ Bot: Online\n✅ API: Ready\n✅ Fitur Grup: Active\n\n🎉 Semua sistem berjalan normal!"}'
            ;;
        5)
            echo "Mengirim reminder..."
            curl -X POST http://localhost:3000/send-group-name \
              -H "Content-Type: application/json" \
              -d '{"group_name":"Test_bot","message":"⏰ REMINDER\n\nJangan lupa:\n📝 Testing fitur bot\n🔧 Cek dokumentasi\n📱 Report bug jika ada\n\nTerima kasih! 🙏"}'
            ;;
        *)
            echo "Pilihan tidak valid"
            ;;
    esac

    echo ""
    echo ""
    echo "✅ Selesai! Cek grup Test_bot untuk melihat pesan."
else
    echo ""
    echo "OK, Anda bisa copy-paste contoh di atas kapan saja."
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
