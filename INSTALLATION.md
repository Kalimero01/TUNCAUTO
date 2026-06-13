# TUNCAUTO Installation Guide

## Gereksinimler

- Node.js 20+
- Docker (PostgreSQL için) veya mevcut PostgreSQL instance
- npm 10+

## Adım Adım Kurulum

### 1. Repoyu klonlayın

```bash
git clone https://github.com/Kalimero01/TUNCAUTO.git
cd TUNCAUTO
git checkout cursor/tuncauto-full-platform
```

### 2. Ortam dosyasını oluşturun

```bash
cp .env.example .env
```

`.env` dosyasını düzenleyin:

```env
DATABASE_URL=postgresql://tuncauto:tuncauto@localhost:5432/tuncauto?schema=public
AUTH_SECRET=your-local-dev-secret-min-32-chars-here
NEXTAUTH_URL=http://localhost:3000
UPLOAD_DIR=./uploads
```

`AUTH_SECRET` üretmek için:

```bash
openssl rand -base64 32
```

### 3. PostgreSQL başlatın

```bash
docker compose up -d
```

### 4. Bağımlılıkları yükleyin

```bash
npm install
```

### 5. Veritabanını hazırlayın

```bash
npm run db:push
npm run db:seed
```

### 6. Geliştirme sunucusunu başlatın

```bash
npm run dev
```

### 7. Doğrulama

- Site: http://localhost:3000
- Admin: http://localhost:3000/admin/login
- API health: http://localhost:3000/api/health
- DB ready: http://localhost:3000/api/health/ready

## Admin İlk Giriş

1. `/admin/login` adresine gidin
2. Kullanıcı adı: `admin`
3. Şifre: `ChangeMeImmediately123!`
4. Zorunlu şifre değiştirme ekranında yeni güçlü şifre belirleyin

## Upload Dizini

Yerel geliştirmede `./uploads` otomatik oluşturulur. Gitignore'da yer alır.

## Test

```bash
npm run test
npm run lint
npm run typecheck
npm run build
```
