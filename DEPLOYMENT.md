# TUNCAUTO Deployment Guide

## Railway (Önerilen — Tek Servis)

### 1. Servis Yapılandırması

Eski iki servisli mimari (ayrı backend + frontend) yerine **tek Next.js servisi** kullanın:

1. Railway'de yeni bir **Web Service** oluşturun veya mevcut frontend servisini güncelleyin
2. Backend Express servisini devre dışı bırakın (artık gerekli değil)
3. PostgreSQL servisini koruyun

### 2. Ortam Değişkenleri

Railway dashboard → Variables:

| Değişken | Değer |
|----------|-------|
| `DATABASE_URL` | `${{Postgres.DATABASE_URL}}` (Railway reference) |
| `AUTH_SECRET` | Güçlü rastgele string (32+ karakter) |
| `NEXTAUTH_URL` | `https://your-app.up.railway.app` |
| `AUTH_URL` | Aynı URL |
| `NODE_ENV` | `production` |
| `UPLOAD_DIR` | `/app/uploads` |

### 3. Volume (Dosya Yüklemeleri)

Kalıcı dosya depolama için Railway Volume ekleyin:

1. Service → Settings → Volumes → Add Volume
2. Mount path: `/app/uploads`
3. `UPLOAD_DIR=/app/uploads` olarak ayarlayın

> Not: Volume olmadan yüklenen dosyalar redeploy'da silinir.

### 4. Build & Start

`railway.json` otomatik yapılandırma sağlar:

- **Build:** `npm ci && npm run build`
- **Start:** `node scripts/start.mjs` (migrate + seed + next start)
- **Healthcheck:** `/api/health`

### 5. Domain

Railway → Settings → Networking → Generate Domain

`NEXTAUTH_URL` ve `AUTH_URL` değişkenlerini yeni domain ile güncelleyin.

### 6. Eski Servisleri Kaldırma

- `backend-production-*.up.railway.app` servisini silin veya durdurun
- Frontend servisini tek unified app olarak kullanın
- `RAILWAY_SERVICE_NAME` artık gerekli değil

## GitHub Actions CI

Push/PR'da otomatik lint, typecheck, test ve build çalışır.

## Yerel Production Test

```bash
npm run build
DATABASE_URL=... AUTH_SECRET=... NEXTAUTH_URL=http://localhost:3000 npm run start
```

## Sorun Giderme

| Sorun | Çözüm |
|-------|-------|
| Auth hatası | `AUTH_SECRET` ve `NEXTAUTH_URL` kontrol edin |
| DB bağlantı hatası | `DATABASE_URL` ve Postgres servis durumu |
| Upload kayboluyor | Railway Volume mount edin |
| İlk admin girişi | `npm run db:seed` veya start script otomatik seed |
