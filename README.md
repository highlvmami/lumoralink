# LumoraLink

Link kısaltıcı ve analitik analiz paneli.

Uzun linkleri kısaltan, her tıklamayı kaydeden ve istatistikleri panelde gösteren ve linkler için qr üreten bir yönetim paneli.

## Teknolojiler

| Katman | Seçim | Neden |
| --- | --- | --- |
| Framework | Next.js (App Router) + TypeScript | Frontend ve backend tek projede, tip güvenliği |
| Stil | Tailwind CSS | Hızlı ve tutarlı arayüz |
| Veritabanı | PostgreSQL | İlişkisel veri, güçlü zaman serisi sorguları |
| ORM | Prisma | Tip güvenli sorgular, migration yönetimi |
| Doğrulama | Zod | API girdilerini güvenle kontrol etmek |

## Veri modeli

```
User 1──* Link 1──* Click
```

- **Link**: `slug` (kısa kod), `url` (hedef), son kullanma tarihi, aktif/pasif durumu
- **Click**: tıklama zamanı, ülke, cihaz, tarayıcı, işletim sistemi, referrer. `(linkId, createdAt)` indeksi panel sorgularını hızlandırır.

## Kurulum

Gerekenler: Node.js 20+, Docker Desktop

```bash
npm install            # bağımlılıklar + Prisma client üretimi
cp .env.example .env   # Windows: copy .env.example .env
npm run db:up          # PostgreSQL'i Docker'da başlat
npm run db:migrate     # tabloları oluştur
npm run dev            # http://localhost:3000
```

Her şeyin çalıştığını görmek için http://localhost:3000/api/health adresini aç.

## Komutlar

| Komut | Ne yapar |
| --- | --- |
| `npm run dev` | Geliştirme sunucusu |
| `npm run build` | Production derlemesi |
| `npm run db:up` / `db:down` | Veritabanı konteynerini başlat / durdur |
| `npm run db:migrate` | Şema değişikliklerini veritabanına uygula |
| `npm run db:studio` | Tabloları tarayıcıda görüntüle |

## Yol haritası

- [x] Faz 1: Proje iskeleti, veritabanı şeması
- [ ] Faz 2: Link oluşturma API'si ve `/[slug]` yönlendirmesi
- [ ] Faz 3: Auth.js ile giriş
- [ ] Faz 4: Tıklama analitiği ve panel grafikleri
- [ ] Faz 5: QR kod üretimi
- [ ] Faz 6: Rate limiting, testler, CI, yayın
