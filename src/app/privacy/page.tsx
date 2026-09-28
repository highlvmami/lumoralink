// Gizlilik politikası: hangi veriyi neden topladığımızı açıkça anlatır.
// Google OAuth uygulamasını herkese açmak için de bu sayfanın adresi gerekiyor.
import Link from "next/link";

export const metadata = { title: "Gizlilik politikası" };

const REPO_URL = "https://github.com/highlvmami/lumoralink";

export default function PrivacyPage() {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 space-y-8 px-4 py-14 leading-relaxed text-muted">
      <div className="space-y-2">
        <h1 className="font-display text-4xl font-semibold tracking-tight text-ink">
          Gizlilik politikası
        </h1>
        <p className="text-sm">Son güncelleme: 28 Eylül 2026</p>
      </div>

      <p>
        LumoraLink, açık kaynaklı bir link kısaltma ve tıklama analitiği projesidir. Bu sayfa hangi
        verileri topladığımızı, neden topladığımızı ve nasıl koruduğumuzu açıklar.
      </p>

      <section className="space-y-2">
        <h2 className="font-display text-xl font-semibold text-ink">Hesap bilgileri</h2>
        <p>
          Google veya GitHub ile giriş yaptığında bu hizmetlerden yalnızca <strong className="text-ink">adını</strong>,{" "}
          <strong className="text-ink">e-posta adresini</strong> ve <strong className="text-ink">profil fotoğrafını</strong> alırız. Şifren
          bize hiçbir zaman ulaşmaz. Bu bilgiler yalnızca seni tanımak ve linklerini hesabına
          bağlamak için kullanılır.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-display text-xl font-semibold text-ink">Oluşturduğun linkler</h2>
        <p>
          Kısalttığın adresler, kısa adları, son kullanma tarihleri ve durumları hesabınla birlikte
          saklanır. Bir linki sildiğinde ona ait tüm tıklama kayıtları da kalıcı olarak silinir.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-display text-xl font-semibold text-ink">Tıklama istatistikleri</h2>
        <p>Bir kısa linke tıklandığında linkin sahibine istatistik sunmak için şunları kaydederiz:</p>
        <ul className="list-disc space-y-1 pl-6">
          <li>tıklama zamanı,</li>
          <li>ülke (IP adresinden barındırma sağlayıcımızın çıkardığı iki harfli kod),</li>
          <li>cihaz türü, tarayıcı ve işletim sistemi,</li>
          <li>ziyaretçinin geldiği sitenin alan adı (ör. &quot;twitter.com&quot;).</li>
        </ul>
        <p>
          <strong className="text-ink">IP adresleri saklanmaz.</strong> Tekil ziyaretçi sayısını hesaplamak için IP adresi
          ve tarayıcı bilgisinden, her gün değişen gizli bir anahtarla tek yönlü bir özet (hash)
          üretilir. Bu özetten IP adresine geri dönülemez ve aynı kişi günler arasında takip
          edilemez. Arama motoru ve link önizleme botları sayılmaz.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-display text-xl font-semibold text-ink">Çerezler</h2>
        <p>
          Yalnızca oturumunu açık tutmak için gerekli olan bir oturum çerezi kullanırız. Reklam veya
          takip çerezi kullanmayız.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-display text-xl font-semibold text-ink">Verilerin saklandığı yer</h2>
        <p>
          Site Vercel üzerinde çalışır, veritabanı Neon (PostgreSQL) üzerinde Frankfurt bölgesinde
          tutulur. Verilerini hiçbir üçüncü tarafa satmayız veya paylaşmayız.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="font-display text-xl font-semibold text-ink">Hesabını silmek</h2>
        <p>
          Linklerini panelden istediğin zaman silebilirsin. Hesabının ve tüm verilerinin tamamen
          silinmesini istersen{" "}
          <a href={`${REPO_URL}/issues`} className="text-brand underline underline-offset-2" target="_blank">
            GitHub üzerinden
          </a>{" "}
          bize ulaşabilirsin.
        </p>
      </section>

      <Link href="/" className="inline-block text-sm text-brand underline underline-offset-2">
        ← Ana sayfaya dön
      </Link>
    </main>
  );
}
