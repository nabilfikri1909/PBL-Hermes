Update deployment Portal KUI PNJ di VPS ini.

Repo   : https://github.com/nabilfikri1909/PBL-Hermes
Branch : main
Commit : bd9b5e6

=== LANGKAH 1 — PETAKAN DULU, JANGAN LANGSUNG TIMPA ===
Cari cara deploy yang SUDAH ada. Jangan bikin deployment baru kalau yang lama masih hidup.

  docker ps -a --format 'table {{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}'
  docker compose ls -a
  pm2 list
  systemctl list-units --type=service | grep -iE 'pnj|kui|pbl|next|portal'
  find / -maxdepth 4 -type d -name 'PBL-Hermes' 2>/dev/null

Laporkan temuanmu dulu sebelum mengubah apa pun.

=== LANGKAH 2 — AMBIL KODE ===
  cd <folder-project>
  git fetch origin
  git reset --hard bd9b5e6
  git log --oneline -1        # harus bd9b5e6

=== LANGKAH 3 — DEPLOY ===

Jika memakai Docker (Dockerfile + docker-compose.yml sudah ada di repo):

  # simpan data lama kalau ada, supaya pengajuan tidak hilang
  if [ -f .data/store.json ]; then cp .data/store.json /tmp/store.backup.json; fi

  docker compose down
  docker compose up -d --build
  sleep 20
  docker compose ps

  # pulihkan data bila volume baru dibuat kosong
  if [ -f /tmp/store.backup.json ]; then
    docker cp /tmp/store.backup.json pnj-portal:/app/.data/store.json && \
    docker restart pnj-portal
  fi

Jika memakai PM2 / systemd (tanpa Docker):

  npm ci
  npm run build
  pm2 restart <nama-app>          # atau: systemctl restart <service>
  # aplikasi sekarang membaca PORT env (default 3210)

=== LANGKAH 4 — PERHATIKAN PERUBAHAN INI ===
1. Port sekarang satu sumber: env PORT.
   - Docker   -> PORT=3000, EXPOSE 3000, compose map "3000:3000"
   - Tanpa Docker + tanpa PORT -> jatuh ke 3210 (perilaku lama)
   Pastikan reverse proxy (nginx/Traefik) menunjuk ke port yang benar.

2. Folder .data WAJIB writable oleh user container (nextjs).
   Sudah diatur di Dockerfile, tapi kalau pakai bind-mount manual:
     mkdir -p .data && chown -R 1001:1001 .data

3. Volume portal-data menyimpan pengajuan. Jangan `docker compose down -v`
   kecuali memang ingin mengosongkan data demo.

=== LANGKAH 5 — VERIFIKASI (jangan klaim sukses tanpa ini) ===

  PORT_APP=<port-yang-dipakai>
  curl -s -o /dev/null -w 'landing %{http_code}\n' http://localhost:$PORT_APP/
  curl -s -o /dev/null -w 'login   %{http_code}\n' http://localhost:$PORT_APP/login
  curl -s -o /dev/null -w 'pdln    %{http_code}\n' http://localhost:$PORT_APP/pdln
  curl -s -o /dev/null -w 'foto    %{http_code}\n' http://localhost:$PORT_APP/photos/1523240795612-9a054b0db644.jpg

  # badge audiens harus SUDAH TIDAK ADA
  curl -s http://localhost:$PORT_APP/ | grep -c "Untuk mahasiswa PNJ"   # harus 0

  # tidak boleh ada gambar eksternal Unsplash
  curl -s http://localhost:$PORT_APP/ | grep -c "images.unsplash.com"   # harus 0

  # login API harus jalan
  curl -s -X POST http://localhost:$PORT_APP/api/auth/login \
    -H 'Content-Type: application/json' \
    -d '{"email":"rina@kui.pnj.ac.id","password":"admin123"}'

  docker compose logs --tail 40        # atau: pm2 logs --lines 40

Kalau ada yang gagal, JANGAN diamkan — laporkan error lengkapnya.

=== LANGKAH 6 — LAPORKAN ===
- metode deploy yang dipakai (docker / pm2 / systemd)
- port final aplikasi dan port yang dipakai reverse proxy
- commit yang terpasang (harus bd9b5e6)
- hasil semua curl (status code)
- hasil grep badge & unsplash (harus 0 dan 0)
- status healthcheck container
- error apa pun yang muncul di log

Kalau ada yang ambigu atau butuh kredensial, tanya saya dulu — jangan menebak.
