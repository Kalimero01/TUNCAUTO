# TUNCAUTO

Premium araç galerisi ve bayi yönetim platformu — birleşik Next.js uygulaması.

## Mimari

```
TUNCAUTO/
├── prisma/          PostgreSQL şeması + seed
├── src/
│   ├── app/
│   │   ├── (public)/    Halka açık site
│   │   ├── admin/       Yönetim paneli
│   │   └── api/         REST API route handlers
│   ├── components/
│   └── lib/             Auth, Prisma, validasyon, upload
├── uploads/             Dosya depolama (Railway volume)
└── railway.json         Tek servis deploy
```

**Stack:** Next.js 15 · TypeScript · PostgreSQL · Prisma · Tailwind CSS · Auth.js (NextAuth v5)

## Hızlı Başlangıç

```bash
cp .env.example .env
docker compose up -d
npm install
npm run db:push
npm run db:seed
npm run dev
```

Uygulama: http://localhost:3000  
Admin: http://localhost:3000/admin/login

### Varsayılan Admin

| Alan | Değer |
|------|-------|
| Kullanıcı adı | `admin` |
| Şifre | `ChangeMeImmediately123!` |

İlk girişte şifre değiştirme zorunludur.

## Komutlar

| Komut | Açıklama |
|-------|----------|
| `npm run dev` | Geliştirme sunucusu |
| `npm run build` | Production build |
| `npm run start` | Production sunucu (+ migrate + seed) |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript kontrol |
| `npm run test` | Vitest testleri |
| `npm run db:push` | Şemayı uygula |
| `npm run db:seed` | Admin kullanıcı seed |
| `npm run db:studio` | Prisma Studio |

## Özellikler

- **Halka açık site:** Araç listeleme/detay, satıcı başvuru formu, SEO
- **Admin panel:** Auth, dashboard, araç CRUD, başvuru yönetimi, live-chat, şifre yönetimi
- **API:** Vehicles, submissions, live-chat, uploads, health
- **Güvenlik:** bcrypt, rate limiting, CSRF (Auth.js), input sanitization, secure cookies
- **Dosya yükleme:** Görsel (10MB) ve video (100MB) validasyonu

## Ortam Değişkenleri

`.env.example` dosyasına bakın. Zorunlu alanlar:

- `DATABASE_URL` — PostgreSQL bağlantı dizesi
- `AUTH_SECRET` — Auth.js gizli anahtar (min 32 karakter)
- `NEXTAUTH_URL` — Uygulama URL'si

Opsiyonel:

- `UPLOAD_DIR` — Dosya depolama yolu (varsayılan: `./uploads`)

## Deploy

Detaylar için [DEPLOYMENT.md](./DEPLOYMENT.md) dosyasına bakın.

## Lisans

Proprietary — TUNCAUTO
