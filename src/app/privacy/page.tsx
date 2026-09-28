// Gizlilik politikası: hangi veriyi neden topladığımızı açıkça anlatır.
// Google OAuth uygulamasını herkese açmak için de bu sayfanın adresi gerekiyor.
import Link from "next/link";

export const metadata = { title: "Gizlilik politikası" };

const REPO_URL = "https://github.com/highlvmami/lumoralink";

export default function PrivacyPage() {
  return (
    <main className="mx-auto w-full max-w-2xl space-y-8 px-4 py-12 text-zinc-700 dark:text-zinc-300">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Gizlilik politikası
        </h1>
        <p className="text-sm text-zinc-500">Son güncelleme: 28 Eylül 2026</p>
      </div>

      <p>
        LumoraLink, açık kaynaklı bir link kısaltma ve tıklama analitiği projesidir. Bu sayfa hangi
        verileri topladığımızı, neden topladığımızı ve nasıl koruduğumuzu açıklar.
      </p>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Hesap bilgileri</h2>
        <p>
          Google veya GitHub ile giriş yaptığında bu hizmetlerden yalnızca <strong>adını</strong>,{" "}
          <strong>e-posta adresini</strong> ve <strong>profil fotoğrafını</strong> alırız. Şifren
          bize hiçbir zaman ulaşmaz. Bu bilgiler yalnızca seni tanımak ve linklerini hesabına
          bağlamak için kullanılır.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Oluşturduğun linkler</h2>
        <p>
          Kısalttığın adresler, kısa adları, son kullanma tarihleri ve durumları hesabınla birlikte
          saklanır. Bir linki sildiğinde ona ait tüm tıklama kayıtları da kalıcı olarak silinir.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Tıklama istatistikleri</h2>
        <p>Bir kısa linke tıklandığında linkin sahibine istatistik sunmak için şunları kaydederiz:</p>
        <ul className="list-disc space-y-1 pl-6">
          <li>tıklama zamanı,</li>
          <li>ülke (IP adresinden barındırma sağlayıcımızın çıkardığı iki harfli kod),</li>
          <li>cihaz türü, tarayıcı ve işletim sistemi,</li>
          <li>ziyaretçinin geldiği sitenin alan adı (ör. &quot;twitter.com&quot;).</li>
        </ul>
        <p>
          <strong>IP adresleri saklanmaz.</strong> Tekil ziyaretçi sayısını hesaplamak için IP adresi
          ve tarayıcı bilgisinden, her gün değişen gizli bir anahtarla tek yönlü bir özet (hash)
          üretilir. Bu özetten IP adresine geri dönülemez ve aynı kişi günler arasında takip
          edilemez. Arama motoru ve link önizleme botları sayılmaz.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Çerezler</h2>
        <p>
          Yalnızca oturumunu açık tutmak için gerekli olan bir oturum çerezi kullanırız. Reklam veya
          takip çerezi kullanmayız.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Verilerin saklandığı yer</h2>
        <p>
          Site Vercel üzerinde çalışır, veritabanı Neon (PostgreSQL) üzerinde Frankfurt bölgesinde
          tutulur. Verilerini hiçbir üçüncü tarafa satmayız veya paylaşmayız.
        </p>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">Hesabını silmek</h2>
        <p>
          Linklerini panelden istediğin zaman silebilirsin. Hesabının ve tüm verilerinin tamamen
          silinmesini istersen{" "}
          <a href={`${REPO_URL}/issues`} className="underline" target="_blank">
            GitHub üzerinden
          </a>{" "}
          bize ulaşabilirsin.
        </p>
      </section>

      <Link href="/" className="inline-block text-sm underline">
        ← Ana sayfaya dön
      </Link>
    </main>
  );
}
