export interface TurkishPseoPageConfig {
  slug: string;
  enSlug: string;
  arSlug: string;
  esSlug: string;
  ptSlug: string;
  frSlug: string;
  category: "reels" | "story" | "photo" | "audio" | "profile";
  metaTitle: string;
  metaDescription: string;
  h1: string;
  badge: string;
  keywords: string[];
  quickAnswer: string;
  howToTitle: string;
  howToSteps: { title: string; desc: string }[];
  specs: { label: string; value: string }[];
  features: { title: string; desc: string }[];
  article: { heading: string; content: string[] }[];
  faqs: { q: string; a: string }[];
  relatedSlugs: string[];
}

export const REELSER_TR_PSEO_PAGES: Record<string, TurkishPseoPageConfig> = {
  "instagram-reels-indirme": {
    slug: "instagram-reels-indirme",
    enSlug: "instagram-reels-without-watermark",
    arSlug: "instagram-reels-download",
    esSlug: "descargar-reels-instagram",
    ptSlug: "baixar-reels-instagram",
    frSlug: "telecharger-reel-instagram",
    category: "reels",
    metaTitle: "Instagram Reels İndirme (Filigransız & Ücretsiz Full HD MP4) | Reelser",
    metaDescription:
      "Instagram Reels videolarını filigransız, orijinal Full HD 1080p MP4 kalitesinde ve sesli olarak indirin. iPhone, Android ve PC için ücretsiz, şifresiz Reels indirici.",
    h1: "Filigransız Instagram Reels Video İndirme (Full HD)",
    badge: "#1 Reels İndirici",
    keywords: [
      "instagram reels indirme",
      "reels video indir",
      "filigransız reels indirme",
      "insta reels kaydetme",
      "instagram reels mp4 indir",
    ],
    quickAnswer:
      "Instagram Reels videosunu filigransız indirmek için Instagram uygulamasından Reels bağlantısını kopyalayın, yukarıdaki Reelser arama kutusuna yapıştırın ve 'Video İndir (MP4)' butonuna tıklayarak orijinal Full HD 1080p sesli videoyu cihazınıza kaydedin.",
    howToTitle: "3 Adımda Instagram Reels Videosu Nasıl İndirilir?",
    howToSteps: [
      {
        title: "Reels Bağlantısını Kopyalayın",
        desc: "Instagram uygulamasında indirmek istediğiniz Reels videosunu açın, paylaş simgesine dokunun ve 'Bağlantıyı Kopyala' seçeneğini seçin.",
      },
      {
        title: "Bağlantıyı Reelser'a Yapıştırın",
        desc: "Kopyaladığınız linki bu sayfanın üst kısmındaki indirme kutusuna yapıştırın ve İndir butonuna basın.",
      },
      {
        title: "Full HD MP4 Olarak Kaydedin",
        desc: "'Video İndir (MP4)' düğmesine tıklayarak videoyu filigransız ve sesli olarak telefon galerinize veya bilgisayarınıza indirin.",
      },
    ],
    specs: [
      { label: "Çıktı Formatı", value: "Orijinal MP4 (H.264 + AAC Ses)" },
      { label: "Maksimum Kalite", value: "Full HD 1080p (Kaynak Kalitesi)" },
      { label: "Filigran / Logo", value: "Yok (%100 Temiz, Logosuz)" },
      { label: "Uyumlu Cihazlar", value: "iPhone (iOS), Android, Windows, macOS" },
      { label: "Ücret ve Giriş", value: "%100 Ücretsiz ve Şifresiz (Giriş Gerekmez)" },
    ],
    features: [
      {
        title: "Filigransız ve Logosuz İndirme",
        desc: "Videonun üzerine hiçbir kullanıcı adı veya site logosu eklenmeden temiz MP4 dosyasını alın.",
      },
      {
        title: "Orijinal 1080p Full HD Kalite",
        desc: "Kalite kaybı olmadan doğrudan kaynak sunucudaki en yüksek çözünürlüklü akışı indirir.",
      },
      {
        title: "Orijinal Ses ve Müzik Korunur",
        desc: "İndirilen tüm Reels videoları orijinal müziği ve ses efektleriyle birlikte kaydedilir.",
      },
      {
        title: "Uygulama veya Hesap Girişi Gerekmez",
        desc: "Safari veya Chrome tarayıcınızdan güvenli ve anonim şekilde saniyeler içinde çalışır.",
      },
    ],
    article: [
      {
        heading: "Instagram Reels Videolarını Galeriye Kaydetmenin En Hızlı Yolu",
        content: [
          "Instagram uygulaması içerisinde beğendiğiniz Reels videolarını yalnızca uygulama içi koleksiyonlara kaydedebilirsiniz; ancak başka bir kullanıcının herkese açık Reels videosunu telefon galerinize filigransız MP4 olarak indirme seçeneği bulunmaz. Reelser bu işlemi doğrudan tarayıcınız üzerinden ücretsiz olarak gerçekleştirir.",
          "Reels bağlantısını yapıştırdığınız anda sistemimiz orijinal 1080p video akışını ve AAC ses kanalını birleştirerek çevrimdışı izleyebileceğiniz temiz bir MP4 dosyası sunar.",
        ],
      },
    ],
    faqs: [
      {
        q: "Instagram Reels videolarını filigransız nasıl indirebilirim?",
        a: "Herkese açık Reels bağlantısını kopyalayıp Reelser arama kutusuna yapıştırmanız ve MP4 İndir butonuna tıklamanız yeterlidir. İndirilen videoda hiçbir filigran bulunmaz.",
      },
      {
        q: "Reels videosunu indirdiğimde hesap sahibine bildirim gider mi?",
        a: "Hayır. Reelser üzerinden yapılan tüm indirmeler tamamen anonimdir ve içerik üreticisine hiçbir bildirim gönderilmez.",
      },
      {
        q: "Sadece Reels videosunun müziğini MP3 olarak indirebilir miyim?",
        a: "Evet, bağlantıyı yapıştırdıktan sonra MP3 ses indirme seçeneğini kullanabilir veya Instagram MP3 dönüştürücü aracımıza geçebilirsiniz.",
      },
    ],
    relatedSlugs: [
      "instagram-video-indirme",
      "instagram-reels-hd-1080p-indirme",
      "iphone-instagram-reels-indirme",
      "android-instagram-reels-indirme",
      "instagram-mp3-ses-indirme",
    ],
  },

  "instagram-video-indirme": {
    slug: "instagram-video-indirme",
    enSlug: "instagram-to-mp4",
    arSlug: "instagram-video-downloader",
    esSlug: "descargar-videos-instagram",
    ptSlug: "baixar-videos-instagram",
    frSlug: "telecharger-video-instagram",
    category: "reels",
    metaTitle: "Instagram Video İndirme Programı (Ücretsiz & HD MP4) | Reelser",
    metaDescription:
      "Instagram videolarını, gönderilerini, IGTV ve Reels içeriklerini Full HD MP4 formatında ücretsiz indirin. Program kurmadan telefondan ve bilgisayardan video kaydedin.",
    h1: "Instagram Video İndirme (Full HD MP4 Dönüştürücü)",
    badge: "Doğrudan MP4 İndirici",
    keywords: [
      "instagram video indirme",
      "insta video indir",
      "instagram mp4 dönüştürücü",
      "instagramdan video kaydetme",
      "ücretsiz instagram video indir",
    ],
    quickAnswer:
      "Instagram'dan herhangi bir videoyu MP4 olarak indirmek için video gönderisinin bağlantısını kopyalayın, Reelser'a yapıştırın ve 'Video İndir (MP4)' butonuna tıklayarak yüksek çözünürlükte cihazınıza kaydedin.",
    howToTitle: "Instagram Videoları MP4 Formatında Nasıl İndirilir?",
    howToSteps: [
      {
        title: "Video Linkini Kopyalayın",
        desc: "Instagram'daki video gönderisinde Paylaş simgesine dokunun ve 'Bağlantıyı Kopyala' seçeneğine basın.",
      },
      {
        title: "Linki Reelser'da Çözümleyin",
        desc: "Kopyaladığınız URL'yi yukarıdaki kutuya yapıştırıp arama butonuna tıklayın.",
      },
      {
        title: "MP4 Dosyasını İndirin",
        desc: "MP4 indirme butonuna basarak videoyu telefonunuza veya bilgisayarınıza kaydedin.",
      },
    ],
    specs: [
      { label: "Desteklenen İçerikler", value: "Akış Videoları, Reels, IGTV ve Kaydırmalı (Albüm) Videolar" },
      { label: "Video Formatı", value: "Evrensel MP4 (H.264)" },
      { label: "Çözünürlük", value: "1080p Full HD'ye Kadar" },
      { label: "Kurulum", value: "Gerekmez (%100 Web Tabanlı)" },
    ],
    features: [
      {
        title: "Tüm Herkese Açık Videolarla Uyumlu",
        desc: "Normal akış videolarını, uzun videoları ve çoklu paylaşımlardaki videoları tek tıkla indirin.",
      },
      {
        title: "Evrensel MP4 Uyumluluğu",
        desc: "İndirilen videolar ek bir oynatıcıya gerek kalmadan iOS, Android, Windows ve Mac'te açılır.",
      },
      {
        title: "Saniyeler İçinde Hızlı İndirme",
        desc: "Bekleme süresi olmadan doğrudan CDN üzerinden yüksek hızda indirme.",
      },
      {
        title: "Tam Gizlilik ve Güvenlik",
        desc: "Şifre veya hesap bilgisi istenmez, indirme geçmişiniz tutulmaz.",
      },
    ],
    article: [
      {
        heading: "Kalite Kaybı Olmadan Instagram Videolarını MP4 Olarak Kaydedin",
        content: [
          "Instagram'da paylaşılan eğitim videolarını, yemek tariflerini veya röportajları çevrimdışı izlemek için MP4 formatı en ideal seçenektir.",
          "Reelser, videoyu yeniden sıkıştırmadan doğrudan kaynak MP4 dosyasını sunarak görüntü netliğini ve ses kalitesini birebir korur.",
        ],
      },
    ],
    faqs: [
      {
        q: "Çoklu paylaşımdaki (kaydırmalı) bir videoyu indirebilir miyim?",
        a: "Evet. Bir gönderide birden fazla fotoğraf ve video varsa Reelser her birini ayrı ayrı listeler ve istediğiniz videoyu indirmenize olanak tanır.",
      },
      {
        q: "Gizli hesapların videoları indirilebilir mi?",
        a: "Hayır. Kullanıcı gizliliği nedeniyle yalnızca herkese açık (public) profillerin paylaşımları indirilebilir.",
      },
    ],
    relatedSlugs: [
      "instagram-reels-indirme",
      "instagram-reels-hd-1080p-indirme",
      "instagram-coklu-fotograf-indirme",
      "instagram-mp3-ses-indirme",
    ],
  },

  "instagram-hikaye-indirme": {
    slug: "instagram-hikaye-indirme",
    enSlug: "save-instagram-stories",
    arSlug: "instagram-story-saver",
    esSlug: "descargar-historias-instagram",
    ptSlug: "baixar-stories-instagram",
    frSlug: "telecharger-story-instagram",
    category: "story",
    metaTitle: "Instagram Hikaye (Story) İndirme — Ücretsiz & Şifresiz | Reelser",
    metaDescription:
      "Instagram hikayelerini (Story) 24 saat dolmadan MP4 video veya HD fotoğraf olarak anonim şekilde indirin. Hesap girişi gerektirmeyen ücretsiz hikaye kaydedici.",
    h1: "Instagram Hikaye (Story) İndirme (Video MP4 & Fotoğraf HD)",
    badge: "Anonim Hikaye Kaydedici",
    keywords: [
      "instagram hikaye indirme",
      "instagram story indir",
      "insta hikaye kaydetme",
      "şifresiz hikaye indirme",
      "instagram story saver türkçe",
    ],
    quickAnswer:
      "Instagram hikayelerini indirmek için herkese açık profilin @kullaniciadini yazın veya hikaye bağlantısını Reelser'a yapıştırın. Son 24 saatteki tüm aktif hikayeler listelenir ve izleyenler listesinde görünmeden MP4 veya JPG olarak indirilebilir.",
    howToTitle: "Adım Adım Instagram Hikayesi Nasıl İndirilir?",
    howToSteps: [
      {
        title: "@kullaniciadi veya Link Girin",
        desc: "Herkese açık hesabın kullanıcı adını (@username) yazın veya hikaye bağlantısını yapıştırın.",
      },
      {
        title: "Aktif Hikayeleri Görüntüleyin",
        desc: "Son 24 saat içinde paylaşılan tüm hikayeleri kimliğiniz görünmeden inceleyin.",
      },
      {
        title: "MP4 veya JPG Olarak İndirin",
        desc: "İstediğiniz hikayenin altındaki indirme butonuna tıklayarak sesli olarak kaydedin.",
      },
    ],
    specs: [
      { label: "Gizlilik", value: "%100 Anonim (İzleyenler listesinde görünmezsiniz)" },
      { label: "Desteklenen Formatlar", value: "Sesli MP4 Videolar ve HD JPG Fotoğraflar" },
      { label: "Öne Çıkanlar", value: "Desteklenir (Highlights dahil)" },
      { label: "Instagram Girişi", value: "Gerekmez" },
    ],
    features: [
      {
        title: "24 Saat Dolmadan Arşivleyin",
        desc: "Favori hikayelerinizi otomatik olarak silinmeden önce kalıcı olarak cihazınıza kaydedin.",
      },
      {
        title: "%100 Gizli ve İz Bırakmayan Mod",
        desc: "Hikayeleri izlerken veya indirirken adınız asla bakanlar listesinde çıkmaz.",
      },
      {
        title: "Orijinal Ses ve Müzik Desteği",
        desc: "Video hikayeler arka plan müziği ve konuşma sesleriyle birlikte MP4 olarak iner.",
      },
      {
        title: "Sadece @kullaniciadi ile Kolay Erişim",
        desc: "Link kopyalamaya bile gerek kalmadan yalnızca kullanıcı adıyla tüm hikayeleri listeleyin.",
      },
    ],
    article: [
      {
        heading: "Instagram Hikayelerini Silinmeden Önce Cihazınıza Kaydedin",
        content: [
          "Instagram hikayeleri paylaşıldıktan 24 saat sonra otomatik olarak kaybolur. Reelser Hikaye İndirici sayesinde herkese açık herhangi bir hesabın hikayelerini orijinal kalitesinde saniyeler içinde indirebilirsiniz.",
          "Üstelik yalnızca günlük hikayeleri değil, profilde sabitlenen Öne Çıkanlar (Highlights) albümlerini de görüntüleyip kaydedebilirsiniz.",
        ],
      },
    ],
    faqs: [
      {
        q: "Hikayesini indirdiğim kişi bunu görebilir mi?",
        a: "Hayır, kesinlikle göremez. İşlem sunucularımız üzerinden anonim olarak yapılır ve adınız izleyenler listesinde yer almaz.",
      },
      {
        q: "İndirilen hikayelerde ses oluyor mu?",
        a: "Evet, tüm video hikayeler orijinal ses iziyle birlikte MP4 formatında indirilir.",
      },
    ],
    relatedSlugs: [
      "instagram-gizli-hikaye-izleme",
      "instagram-muzikli-hikaye-indirme",
      "instagram-one-cikanlar-indirme",
      "instagram-profil-goruntuleme",
    ],
  },

  "instagram-gizli-hikaye-izleme": {
    slug: "instagram-gizli-hikaye-izleme",
    enSlug: "storiesig-viewer",
    arSlug: "anonymous-story-viewer",
    esSlug: "ver-historias-instagram-anonimo",
    ptSlug: "ver-stories-instagram-anonimo",
    frSlug: "voir-story-instagram-anonymement",
    category: "story",
    metaTitle: "Instagram Gizli Hikaye İzleme (Hesapsız & Görünmeden Story Bakma) | Reelser",
    metaDescription:
      "Instagram hikayelerini karşı taraf görmeden, anonim ve şifresiz olarak izleyin ve indirin. %100 gizli Instagram story izleme aracı.",
    h1: "Instagram Gizli Hikaye İzleme (Karşı Taraf Görmeden)",
    badge: "%100 Görünmez Mod",
    keywords: [
      "instagram gizli hikaye izleme",
      "instagram story gizli bakma",
      "hesapsız hikaye izleme",
      "görünmeden story izleme",
      "storiesig türkçe",
    ],
    quickAnswer:
      "Instagram'da bir kişinin hikayesini karşı taraf görmeden gizlice izlemek için herkese açık profilin @kullaniciadini Reelser arama kutusuna yazın. Aktif hikayeleri ve öne çıkanları Instagram hesabınıza giriş yapmadan %100 görünmez modda izleyebilirsiniz.",
    howToTitle: "Karşı Taraf Görmeden Instagram Hikayesi Nasıl İzlenir?",
    howToSteps: [
      {
        title: "@kullaniciadini Yazın",
        desc: "Hikayesine bakmak istediğiniz herkese açık profilin kullanıcı adını yukarıdaki kutuya girin.",
      },
      {
        title: "Gizli Modda İzleyin",
        desc: "Giriş yapmadan tüm fotoğraf ve video hikayeleri doğrudan tarayıcınızda oynatın.",
      },
      {
        title: "İsterseniz Cihazınıza İndirin",
        desc: "Beğendiğiniz hikayeleri tek tıkla telefonunuza veya bilgisayarınıza kaydedin.",
      },
    ],
    specs: [
      { label: "Görünürlük", value: "%0 (İsminiz asla izleyenler listesinde çıkmaz)" },
      { label: "Hesap Gereksinimi", value: "Yok (Instagram hesabınız olmasa bile çalışır)" },
      { label: "Erişilebilir İçerikler", value: "24 Saatlik Hikayeler, Öne Çıkanlar ve HD Profil Fotoğrafı" },
      { label: "Cihaz Uyumluluğu", value: "Telefon, Tablet ve Bilgisayar" },
    ],
    features: [
      {
        title: "Tam Anonimlik Garantisi",
        desc: "Instagram hesabınıza giriş yapmadığınız için kimliğinizin görünmesi teknik olarak imkansızdır.",
      },
      {
        title: "Tarayıcıda Doğrudan Oynatma",
        desc: "Dosyayı indirmeden önce bile hikayeyi sesli olarak tarayıcı içinde izleyebilirsiniz.",
      },
      {
        title: "Öne Çıkan Hikayelere Erişim",
        desc: "Profilde arşivlenmiş tüm Highlights klasörlerini de gizlice inceleyin.",
      },
      {
        title: "Ücretsiz ve Sınırsız",
        desc: "Kayıt olmadan veya ücret ödemeden dilediğiniz kadar kullanın.",
      },
    ],
    article: [
      {
        heading: "Neden Gizli Hikaye İzleme Aracı Kullanmalısınız?",
        content: [
          "Resmi Instagram uygulamasında bir hikayeye dokunduğunuz anda kullanıcı adınız anında görüntüleyenler listesine eklenir.",
          "Reelser sunucuları sizin yerinize vekil olarak hikayeyi çeker; böylece Instagram hesabınız olmasa dahi herkese açık hikayeleri tamamen gizli şekilde izleyebilirsiniz.",
        ],
      },
    ],
    faqs: [
      {
        q: "Hikayesine baktığım kişi benim izlediğimi anlayabilir mi?",
        a: "Hayır, Reelser üzerinde kendi Instagram hesabınızla oturum açmadığınız için karşı tarafın sizi görmesi imkansızdır.",
      },
      {
        q: "Gizli (kilitli) hesapların hikayeleri izlenebilir mi?",
        a: "Hayır, yalnızca herkese açık profillerin hikayeleri görüntülenebilir.",
      },
    ],
    relatedSlugs: [
      "instagram-hikaye-indirme",
      "instagram-muzikli-hikaye-indirme",
      "instagram-one-cikanlar-indirme",
      "instagram-profil-goruntuleme",
    ],
  },

  "instagram-muzikli-hikaye-indirme": {
    slug: "instagram-muzikli-hikaye-indirme",
    enSlug: "instagram-story-download-with-music",
    arSlug: "story-download-with-music",
    esSlug: "descargar-historias-con-musica",
    ptSlug: "baixar-stories-com-musica",
    frSlug: "telecharger-story-instagram-avec-musique",
    category: "story",
    metaTitle: "Instagram Müzikli Hikaye İndirme (Sesli Story Kaydetme MP4) | Reelser",
    metaDescription:
      "Instagram hikayelerini eklenen müzik çıkartması ve orijinal sesiyle birlikte Full HD MP4 olarak indirin. Sessiz inen story sorununa kesin çözüm.",
    h1: "Instagram Müzikli ve Sesli Hikaye İndirme (MP4 HD)",
    badge: "Müzik & Ses Korunur",
    keywords: [
      "instagram müzikli hikaye indirme",
      "instagram story sesli kaydetme",
      "kendi hikayemi müzikli indirme",
      "insta story müzikli indir",
    ],
    quickAnswer:
      "Instagram uygulamasından kendi hikayenizi kaydettiğinizde müzik çıkartması genellikle silinir ve video sessiz iner. Reelser'a @kullaniciadinizi veya hikaye bağlantısını girerek hikayeyi müziğiyle birlikte MP4 olarak indirebilirsiniz.",
    howToTitle: "Instagram Hikayesi Müziğiyle Birlikte Nasıl Kaydedilir?",
    howToSteps: [
      {
        title: "@kullaniciadi veya Story Linki Girin",
        desc: "Yukarıdaki arama çubuğuna herkese açık profilin adını veya hikaye linkini yazın.",
      },
      {
        title: "Müzikli Hikayeyi Seçin",
        desc: "Açılan listeden kaydetmek istediğiniz müzikli hikayeyi bulun.",
      },
      {
        title: "Sesli MP4 Olarak İndirin",
        desc: "'MP4 İndir' butonuna tıklayarak videoyu müziğiyle beraber galerinize kaydedin.",
      },
    ],
    specs: [
      { label: "Ses Desteği", value: "Evet (Yüksek Kaliteli Stereo AAC Ses)" },
      { label: "Video Formatı", value: "MP4 1080p" },
      { label: "Filigran", value: "Yok" },
      { label: "Ücret", value: "%100 Ücretsiz" },
    ],
    features: [
      {
        title: "Müzik Çıkartmalarının Sesini Korur",
        desc: "Instagram'ın yerel kaydetme özelliğinin aksine müzikli hikayeleri sessize almadan tam sesli indirir.",
      },
      {
        title: "Kusursuz Ses ve Görüntü Senkronizasyonu",
        desc: "Müzik ve video klibi arasında hiçbir kayma yaşanmaz.",
      },
      {
        title: "Sadece Müziği MP3 Olarak Alma İmkanı",
        desc: "İsterseniz hikayenin arka plan sesini doğrudan MP3 olarak da indirebilirsiniz.",
      },
      {
        title: "iPhone ve Android ile Tam Uyumlu",
        desc: "Müzikli hikayelerinizi doğrudan telefon galerinize kaydedip WhatsApp veya TikTok'ta paylaşın.",
      },
    ],
    article: [
      {
        heading: "Instagram'da Kendi Hikayenizi Kaydettiğinizde Neden Ses Gider?",
        content: [
          "Instagram uygulaması içinden 'Videoyu Kaydet' dediğinizde telif kısıtlamaları nedeniyle müzik çıkartmasıyla eklenen şarkılar otomatik olarak kaldırılır.",
          "Hikayeniz yayındayken Reelser üzerinden indirme yaptığınızda, izleyicilere sunulan birleştirilmiş sesli video akışını doğrudan MP4 olarak alırsınız.",
        ],
      },
    ],
    faqs: [
      {
        q: "Kendi paylaştığım hikayeyi müzikli olarak nasıl indirebilirim?",
        a: "Hesabınız herkese açıksa @kullaniciadinizi Reelser'a yazmanız yeterlidir; hikayeniz müziğiyle birlikte MP4 olarak inecektir.",
      },
    ],
    relatedSlugs: [
      "instagram-hikaye-indirme",
      "instagram-gizli-hikaye-izleme",
      "instagram-mp3-ses-indirme",
      "instagram-one-cikanlar-indirme",
    ],
  },

  "instagram-one-cikanlar-indirme": {
    slug: "instagram-one-cikanlar-indirme",
    enSlug: "instagram-highlights-download",
    arSlug: "instagram-highlights-download",
    esSlug: "descargar-destacadas-instagram",
    ptSlug: "baixar-destaques-instagram",
    frSlug: "telecharger-story-a-la-une-instagram",
    category: "story",
    metaTitle: "Instagram Öne Çıkanlar (Highlights) İndirme — HD Video & Fotoğraf | Reelser",
    metaDescription:
      "Instagram profillerinde sabitlenen Öne Çıkan Hikayeleri (Highlights) MP4 ve HD JPG olarak anonim şekilde indirin. Ücretsiz ve şifresiz.",
    h1: "Instagram Öne Çıkan Hikayeleri (Highlights) İndirme",
    badge: "Highlights İndirici",
    keywords: [
      "instagram öne çıkanlar indirme",
      "instagram highlights indir",
      "öne çıkan hikayeleri kaydetme",
      "gizli öne çıkanlara bakma",
    ],
    quickAnswer:
      "Instagram'da bir profilin Öne Çıkanlar (Highlights) hikayelerini indirmek için @kullaniciadini veya Highlight bağlantısını Reelser'a girin. Sabitlenmiş tüm hikaye albümlerini anonim olarak görüntüleyip HD kalitede kaydedebilirsiniz.",
    howToTitle: "Instagram Öne Çıkanlar Nasıl İndirilir?",
    howToSteps: [
      {
        title: "@kullaniciadi veya Link Girin",
        desc: "Herkese açık profilin kullanıcı adını veya öne çıkan hikaye bağlantısını kutuya yazın.",
      },
      {
        title: "Öne Çıkan Albümü Açın",
        desc: "Profilde sabitlenmiş hikaye koleksiyonlarını listeleyin.",
      },
      {
        title: "HD Kalitede Kaydedin",
        desc: "Her bir video veya fotoğrafı tek tıkla cihazınıza indirin.",
      },
    ],
    specs: [
      { label: "Medya Türü", value: "Öne Çıkan Hikayeler (Arşivlenmiş Highlights)" },
      { label: "Çıktı Formatı", value: "MP4 (Sesli Video) ve JPG (HD Fotoğraf)" },
      { label: "Gizlilik", value: "%100 Anonim Görüntüleme" },
      { label: "Ücret", value: "Ücretsiz" },
    ],
    features: [
      {
        title: "24 Saati Geçmiş Arşiv Hikayelere Erişim",
        desc: "Profildaki yuvarlak Öne Çıkanlar balonlarında saklanan eski hikayeleri kolayca indirin.",
      },
      {
        title: "Orijinal Çözünürlük",
        desc: "Fotoğraf ve videoları sıkıştırma olmadan tam kalitesinde kaydedin.",
      },
      {
        title: "Giriş Yapmadan Kullanım",
        desc: "Instagram hesabınıza ihtiyaç duymadan tüm herkese açık Highlights içeriklerini açın.",
      },
      {
        title: "Mobil ve Masaüstü Uyumlu",
        desc: "Tüm modern tarayıcılarda sorunsuz çalışır.",
      },
    ],
    article: [
      {
        heading: "Instagram Öne Çıkanlar Koleksiyonlarını Cihazınıza Kaydedin",
        content: [
          "Kullanıcılar ve markalar en önemli hikayelerini biyografilerinin altındaki Öne Çıkanlar bölümünde saklar. Reelser ile bu koleksiyonlardaki her bir slaytı tek tek inceleyebilir ve yüksek çözünürlükte indirebilirsiniz.",
        ],
      },
    ],
    faqs: [
      {
        q: "Öne çıkan bir albümün içinden sadece tek bir videoyu indirebilir miyim?",
        a: "Evet, Reelser albümdeki tüm parçaları ayrı ayrı gösterir; yalnızca istediğiniz fotoğraf veya videoyu seçip indirebilirsiniz.",
      },
    ],
    relatedSlugs: [
      "instagram-hikaye-indirme",
      "instagram-gizli-hikaye-izleme",
      "instagram-muzikli-hikaye-indirme",
      "instagram-profil-goruntuleme",
    ],
  },

  "instagram-fotograf-indirme": {
    slug: "instagram-fotograf-indirme",
    enSlug: "save-instagram-photos",
    arSlug: "instagram-photo-download",
    esSlug: "descargar-fotos-instagram",
    ptSlug: "baixar-fotos-instagram",
    frSlug: "telecharger-photo-instagram",
    category: "photo",
    metaTitle: "Instagram Fotoğraf İndirme (Orijinal HD Kalite JPG) | Reelser",
    metaDescription:
      "Instagram fotoğraflarını ekran görüntüsü almadan, orijinal Full HD (1080p) çözünürlükte JPG olarak ücretsiz indirin. Tekli ve çoklu fotoğraf kaydedici.",
    h1: "Instagram Fotoğraf İndirme (Orijinal Full HD Kalite)",
    badge: "Yüksek Çözünürlüklü JPG",
    keywords: [
      "instagram fotoğraf indirme",
      "insta foto indir hd",
      "instagram resim kaydetme",
      "instagramdan fotoğraf indirme",
    ],
    quickAnswer:
      "Instagram'dan bir fotoğrafı orijinal HD kalitesinde indirmek için gönderi bağlantısını kopyalayın, Reelser'a yapıştırın ve 'Fotoğrafı İndir (JPG)' butonuna tıklayarak kalite kaybı olmadan tam çözünürlüklü resmi kaydedin.",
    howToTitle: "Instagram Fotoğrafları HD Kalitede Nasıl İndirilir?",
    howToSteps: [
      {
        title: "Gönderi Bağlantısını Kopyalayın",
        desc: "Instagram fotoğrafının altındaki Paylaş simgesine dokunup 'Bağlantıyı Kopyala' deyin.",
      },
      {
        title: "Bağlantıyı Reelser'a Yapıştırın",
        desc: "Kopyaladığınız linki yukarıdaki indirme alanına yapıştırın.",
      },
      {
        title: "Orijinal JPG Dosyasını Kaydedin",
        desc: "Fotoğrafı 1080p tam çözünürlükte cihazınıza indirin.",
      },
    ],
    specs: [
      { label: "Görsel Formatı", value: "Orijinal Kalite JPG / JPEG" },
      { label: "Çözünürlük", value: "1080 × 1350 piksele kadar tam netlik" },
      { label: "Çoklu Gönderiler", value: "Desteklenir (Albümdeki tüm fotoğraflar)" },
      { label: "Filigran", value: "Yok" },
    ],
    features: [
      {
        title: "Ekran Görüntüsünden Çok Daha Net",
        desc: "Ekran görüntüsü aldığınızda oluşan bulanıklık ve arayüz simgeleri olmadan doğrudan kaynak dosyayı alın.",
      },
      {
        title: "Albüm (Kaydırmalı) Gönderi Desteği",
        desc: "Gönderide birden fazla fotoğraf varsa her birini ayrı ayrı HD indirebilirsiniz.",
      },
      {
        title: "Anında ve Ücretsiz",
        desc: "Saniyeler içinde telefonunuza veya bilgisayarınıza kaydedin.",
      },
      {
        title: "Şifresiz ve Güvenli",
        desc: "Hesap girişi gerektirmez.",
      },
    ],
    article: [
      {
        heading: "Neden Ekran Görüntüsü Almak Yerine Kaynak Fotoğrafı İndirmelisiniz?",
        content: [
          "Telefonda ekran görüntüsü almak görselin çözünürlüğünü düşürür. Reelser doğrudan Instagram sunucularında barındırılan 1080p JPG dosyasını çıkararak fotoğrafı ilk yüklendiği netlikte indirmenizi sağlar.",
        ],
      },
    ],
    faqs: [
      {
        q: "İndirilen fotoğrafların kalitesi düşer mi?",
        a: "Hayır, fotoğraf içerik üreticisinin yüklediği en yüksek çözünürlükte doğrudan indirilir.",
      },
    ],
    relatedSlugs: [
      "instagram-coklu-fotograf-indirme",
      "instagram-profil-fotografi-buyutme",
      "instagram-profil-goruntuleme",
      "instagram-reels-indirme",
    ],
  },

  "instagram-coklu-fotograf-indirme": {
    slug: "instagram-coklu-fotograf-indirme",
    enSlug: "instagram-carousel-download",
    arSlug: "instagram-carousel-downloader",
    esSlug: "descargar-carrusel-instagram",
    ptSlug: "baixar-carrossel-instagram",
    frSlug: "telecharger-carrousel-instagram",
    category: "photo",
    metaTitle: "Instagram Çoklu Fotoğraf ve Video (Albüm / Carousel) İndirme | Reelser",
    metaDescription:
      "Instagram kaydırmalı (çoklu) gönderilerdeki tüm fotoğraf ve videoları (20 slayta kadar) orijinal Full HD kalitede ücretsiz indirin.",
    h1: "Instagram Çoklu Fotoğraf ve Albüm (Carousel) İndirme",
    badge: "Çoklu Gönderi İndirici",
    keywords: [
      "instagram çoklu fotoğraf indirme",
      "instagram albüm indirme",
      "instagram kaydırmalı post indirme",
      "instagram carousel indir",
    ],
    quickAnswer:
      "Birden fazla fotoğraf veya video içeren kaydırmalı bir Instagram gönderisini indirmek için gönderi linkini kopyalayıp Reelser'a yapıştırın. Albümdeki tüm slaytlar tek tek listelenir ve JPG veya MP4 HD olarak indirilebilir.",
    howToTitle: "Instagram Kaydırmalı Gönderilerdeki Tüm Medyalar Nasıl İndirilir?",
    howToSteps: [
      {
        title: "Çoklu Gönderi Linkini Kopyalayın",
        desc: "Kaydırmalı paylaşımın bağlantısını Instagram uygulamasından kopyalayın.",
      },
      {
        title: "Reelser'a Yapıştırın",
        desc: "Aracımız albümdeki tüm fotoğraf ve videoları otomatik olarak ayrıştırır.",
      },
      {
        title: "İstediğiniz Slaytları HD İndirin",
        desc: "İster tek bir fotoğrafı ister albümün tamamını orijinal kalitede kaydedin.",
      },
    ],
    specs: [
      { label: "Albüm Kapasitesi", value: "Gönderi başına 20 fotoğraf ve videoya kadar" },
      { label: "Formatlar", value: "Full HD JPG ve Sesli MP4" },
      { label: "Filigran", value: "Yok" },
      { label: "Ücret", value: "%100 Ücretsiz" },
    ],
    features: [
      {
        title: "Karışık Fotoğraf ve Video Albümlerini Çözümler",
        desc: "Aynı gönderi içindeki hem resimleri hem de videoları eksiksiz olarak çıkarır.",
      },
      {
        title: "Her Slayt İçin Tam 1080p Çözünürlük",
        desc: "Albümdeki her bir parça orijinal kalitesinde indirilir.",
      },
      {
        title: "İndirmeden Önce Önizleme",
        desc: "Tüm slaytları ekranda görerek sadece ihtiyacınız olanları seçebilirsiniz.",
      },
      {
        title: "Tüm Cihazlarla Uyumlu",
        desc: "iPhone, Android, Mac ve Windows'ta hızlıca çalışır.",
      },
    ],
    article: [
      {
        heading: "20 Slayta Kadar Kaydırmalı Instagram Gönderilerini Tek Linkle İndirin",
        content: [
          "Instagram kaydırmalı gönderileri (Carousel) artık 20 adede kadar fotoğraf ve video barındırabiliyor. Reelser ile tek bir bağlantı yapıştırarak tüm galeriyi saniyeler içinde yüksek çözünürlükte indirebilirsiniz.",
        ],
      },
    ],
    faqs: [
      {
        q: "Albümün içinden sadece tek bir fotoğrafı seçip indirebilir miyim?",
        a: "Evet, tüm slaytlar ayrı indirme butonlarıyla listelenir.",
      },
    ],
    relatedSlugs: [
      "instagram-fotograf-indirme",
      "instagram-video-indirme",
      "instagram-reels-indirme",
    ],
  },

  "instagram-mp3-ses-indirme": {
    slug: "instagram-mp3-ses-indirme",
    enSlug: "instagram-audio-download",
    arSlug: "instagram-audio-mp3",
    esSlug: "convertir-instagram-a-mp3",
    ptSlug: "converter-instagram-para-mp3",
    frSlug: "convertir-instagram-en-mp3",
    category: "audio",
    metaTitle: "Instagram MP3 ve Reels Ses İndirme (Ücretsiz Dönüştürücü) | Reelser",
    metaDescription:
      "Instagram Reels ve videolarındaki müzikleri ve sesleri yüksek kaliteli MP3 formatında ücretsiz indirin. Hızlı online Instagram MP3 dönüştürücü.",
    h1: "Instagram Reels Ses ve Müzik İndirme (MP3 Dönüştürücü)",
    badge: "MP3 Ses Çıkarıcı",
    keywords: [
      "instagram mp3 indirme",
      "instagram reels ses indirme",
      "instagram müzik indirme",
      "reels mp3 dönüştürücü",
    ],
    quickAnswer:
      "Bir Instagram Reels veya videosunun sesini MP3 olarak indirmek için video bağlantısını kopyalayın, Reelser'a yapıştırın ve 'Ses İndir (MP3)' butonuna tıklayarak yalnızca ses dosyasını cihazınıza kaydedin.",
    howToTitle: "Instagram Reels Müziği MP3 Olarak Nasıl İndirilir?",
    howToSteps: [
      {
        title: "Reels veya Video Linkini Kopyalayın",
        desc: "Sesini almak istediğiniz Instagram Reels videosunun bağlantısını kopyalayın.",
      },
      {
        title: "Dönüştürücüye Yapıştırın",
        desc: "Bağlantıyı yukarıdaki kutuya yapıştırıp işlemi başlatın.",
      },
      {
        title: "MP3 Dosyasını İndirin",
        desc: "'Ses İndir (MP3)' düğmesine tıklayarak müziği telefonunuza veya PC'nize kaydedin.",
      },
    ],
    specs: [
      { label: "Çıktı Formatı", value: "Yüksek Netlikte MP3 / M4A Ses" },
      { label: "Desteklenen Kaynaklar", value: "Reels, Akış Videoları ve Video Hikayeler" },
      { label: "Dönüştürme Hızı", value: "Anında (Doğrudan Ses Ayrıştırma)" },
      { label: "Ücret", value: "%100 Ücretsiz" },
    ],
    features: [
      {
        title: "Doğrudan Orijinal Ses Kanalı",
        desc: "Trend Reels müziklerini, remixleri ve konuşma seslerini kalite kaybı olmadan çıkarır.",
      },
      {
        title: "Düşük Dosya Boyutu",
        desc: "Videoyu indirmeden yalnızca ses dosyasını kaydederek hafızadan tasarruf edin.",
      },
      {
        title: "İçerik Üreticileri İçin İdeal",
        desc: "Video kurgularınızda kullanmak üzere popüler sesleri kolayca arşivleyin.",
      },
      {
        title: "Uygulama Kurulumu Yok",
        desc: "Safari, Chrome ve diğer tüm tarayıcılarda doğrudan çalışır.",
      },
    ],
    article: [
      {
        heading: "Instagram Reels Videolarındaki Trend Müzikleri MP3 Olarak Kaydedin",
        content: [
          "Instagram Reels videolarında duyduğunuz özel remixleri veya viral sesleri çevrimdışı dinlemek istediğinizde Reelser MP3 dönüştürücü videodaki ses kanalını saniyeler içinde ayrıştırarak size hazır bir ses dosyası sunar.",
        ],
      },
    ],
    faqs: [
      {
        q: "İndirilen MP3 ses kalitesi videodakiyle aynı mı?",
        a: "Evet, ses kanalı doğrudan kaynak videodan yeniden sıkıştırılmadan ayrıştırılır.",
      },
    ],
    relatedSlugs: [
      "instagram-reels-indirme",
      "instagram-muzikli-hikaye-indirme",
      "instagram-video-indirme",
    ],
  },

  "instagram-profil-fotografi-buyutme": {
    slug: "instagram-profil-fotografi-buyutme",
    enSlug: "instagram-dp-download",
    arSlug: "instagram-dp-viewer",
    esSlug: "descargar-foto-perfil-instagram",
    ptSlug: "baixar-foto-perfil-instagram",
    frSlug: "telecharger-photo-profil-instagram",
    category: "profile",
    metaTitle: "Instagram Profil Fotoğrafı Büyütme ve HD İndirme (Şifresiz) | Reelser",
    metaDescription:
      "Herhangi bir Instagram hesabının profil fotoğrafını (PP / DP) tam boyutta ve orijinal HD kalitede büyütün ve indirin. Ücretsiz, anonim ve şifresiz.",
    h1: "Instagram Profil Fotoğrafı Büyütme ve HD İndirme",
    badge: "HD Profil Resmi (PP) Zoom",
    keywords: [
      "instagram profil fotoğrafı büyütme",
      "insta pp büyütme",
      "instagram profil resmi indirme hd",
      "instagram pp indirme",
    ],
    quickAnswer:
      "Instagram profil fotoğrafını (PP) büyütmek ve HD kalitede indirmek için @kullaniciadini veya profil linkini Reelser arama kutusuna yazın. Profil resmi kırpılmamış tam boyutlu JPG olarak ekrana gelir.",
    howToTitle: "Instagram Profil Fotoğrafı (PP) Nasıl Büyütülür ve İndirilir?",
    howToSteps: [
      {
        title: "@kullaniciadini Girin",
        desc: "Yukarıdaki arama kutusuna Instagram kullanıcı adını yazın.",
      },
      {
        title: "Tam Boyutta Görüntüleyin",
        desc: "Küçük yuvarlak önizleme yerine tam çözünürlüklü kare fotoğrafı inceleyin.",
      },
      {
        title: "HD Olarak Kaydedin",
        desc: "İndirme butonuna tıklayarak profil fotoğrafını JPG formatında cihazınıza kaydedin.",
      },
    ],
    specs: [
      { label: "Görsel Formatı", value: "Orijinal Çözünürlüklü JPG" },
      { label: "Görünüm", value: "Kırpılmamış Tam Kare Görsel" },
      { label: "Gizlilik", value: "%100 Anonim ve Şifresiz" },
      { label: "Ücret", value: "Ücretsiz" },
    ],
    features: [
      {
        title: "Net ve Bulanıklaşmayan Zoom",
        desc: "Uygulamadaki 150 piksellik küçük daire yerine sunucudaki orijinal büyük boy fotoğrafı açar.",
      },
      {
        title: "Sadece @kullaniciadi ile Hızlı Arama",
        desc: "Bağlantı kopyalamaya gerek kalmadan yalnızca kullanıcı adıyla anında sonuç alın.",
      },
      {
        title: "Herkese Açık Hikayeleri de Gösterir",
        desc: "Hesap herkese açıksa profil fotoğrafıyla birlikte aktif hikayelerini de görebilirsiniz.",
      },
      {
        title: "Hesap Girişi İstenmez",
        desc: "Instagram şifrenizi girmeden güvenle kullanın.",
      },
    ],
    article: [
      {
        heading: "Instagram Profil Resmi (PP) Bulanıklaşmadan Nasıl Büyütülür?",
        content: [
          "Instagram uygulamasında profil fotoğrafları küçük bir daire içinde gösterilir ve yakınlaştırıldığında bulanıklaşır. Reelser doğrudan CDN üzerindeki tam boyutlu kaynak resmi getirerek net şekilde görmenizi ve indirmenizi sağlar.",
        ],
      },
    ],
    faqs: [
      {
        q: "Profil fotoğrafını büyüttüğüm kişiye bildirim gider mi?",
        a: "Hayır, işlem tamamen anonimdir ve karşı tarafa hiçbir bildirim gitmez.",
      },
    ],
    relatedSlugs: [
      "instagram-profil-goruntuleme",
      "instagram-gizli-hikaye-izleme",
      "instagram-fotograf-indirme",
    ],
  },

  "instagram-profil-goruntuleme": {
    slug: "instagram-profil-goruntuleme",
    enSlug: "instagram-profile-viewer",
    arSlug: "instagram-profile-viewer",
    esSlug: "visor-perfiles-instagram",
    ptSlug: "visualizador-perfis-instagram",
    frSlug: "visionneuse-profil-instagram",
    category: "profile",
    metaTitle: "Hesapsız Instagram Profil Görüntüleme (Anonim & Şifresiz) | Reelser",
    metaDescription:
      "Instagram hesabınız olmadan herkese açık profilleri, hikayeleri, gönderileri ve HD profil fotoğraflarını anonim olarak görüntüleyin ve indirin.",
    h1: "Hesapsız Instagram Profil Görüntüleme (Anonim)",
    badge: "Üyeliksiz Gezinme",
    keywords: [
      "instagram profil görüntüleme",
      "hesapsız instagram bakma",
      "üye olmadan instagram profili görme",
      "anonim instagram görüntüleyici",
    ],
    quickAnswer:
      "Instagram hesabı olmadan bir profili incelemek için @kullaniciadini Reelser arama çubuğuna yazın. Giriş yapma engeline takılmadan profil fotoğrafını, hikayeleri ve paylaşımları anonim olarak görüntüleyebilirsiniz.",
    howToTitle: "Hesap Açmadan Instagram Profiline Nasıl Bakılır?",
    howToSteps: [
      {
        title: "@kullaniciadini Yazın",
        desc: "İncelemek istediğiniz herkese açık hesabın kullanıcı adını yukarıdaki kutuya girin.",
      },
      {
        title: "Anonim Olarak İnceleyin",
        desc: "HD profil resmini, aktif hikayeleri ve son gönderileri görüntüleyin.",
      },
      {
        title: "Medyaları Tek Tıkla İndirin",
        desc: "İstediğiniz fotoğraf, video veya hikayeyi cihazınıza kaydedin.",
      },
    ],
    specs: [
      { label: "Üyelik Gereksinimi", value: "Yok (Giriş duvarını aşar)" },
      { label: "Görüntülenen İçerikler", value: "HD Profil Resmi, Hikayeler, Öne Çıkanlar ve Gönderiler" },
      { label: "Gizlilik", value: "%100 Anonim Gezinme" },
      { label: "Uyumluluk", value: "Tüm Web Tarayıcıları" },
    ],
    features: [
      {
        title: "Giriş Yapma Uyarısı Olmadan Gezinin",
        desc: "Tarayıcıda birkaç saniye sonra çıkan zorunlu Instagram giriş ekranına takılmadan profillere bakın.",
      },
      {
        title: "Hepsi Bir Arada Görüntüleyici ve İndirici",
        desc: "Tek ekrandan hem profili inceleyin hem de içerikleri indirin.",
      },
      {
        title: "%100 Görünmez",
        desc: "Profil sahibine ziyaretinizle ilgili hiçbir iz bırakılmaz.",
      },
      {
        title: "Hızlı ve Mobil Uyumlu",
        desc: "Telefon ve bilgisayarda anında yüklenir.",
      },
    ],
    article: [
      {
        heading: "Instagram Hesabı Olmadan Herkese Açık Profilleri İnceleyin",
        content: [
          "Instagram web sitesinde oturum açmadan bir profile girdiğinizde hikayeleri ve gönderileri incelemeniz engellenir. Reelser Profil Görüntüleyici ile herkese açık hesaplara özgürce ve gizlice göz atabilirsiniz.",
        ],
      },
    ],
    faqs: [
      {
        q: "Instagram hesabımı kapattıysam yine de profillere bakabilir miyim?",
        a: "Evet, Reelser herkese açık profilleri göstermek için hiçbir Instagram üyeliği istemez.",
      },
    ],
    relatedSlugs: [
      "instagram-profil-fotografi-buyutme",
      "instagram-gizli-hikaye-izleme",
      "instagram-hikaye-indirme",
    ],
  },

  "iphone-instagram-reels-indirme": {
    slug: "iphone-instagram-reels-indirme",
    enSlug: "download-instagram-reels-iphone",
    arSlug: "download-reels-iphone",
    esSlug: "descargar-reels-iphone",
    ptSlug: "baixar-reels-iphone",
    frSlug: "telecharger-reel-iphone",
    category: "reels",
    metaTitle: "iPhone Instagram Reels ve Video İndirme (iOS Film Rulosuna Kaydet) | Reelser",
    metaDescription:
      "Uygulama yüklemeden Safari üzerinden iPhone ve iPad'inize Instagram Reels ve videolarını Full HD olarak indirin. Doğrudan Fotoğraflar uygulamasına kaydedin.",
    h1: "iPhone ve iPad'de Instagram Reels İndirme (iOS Rehberi)",
    badge: "iOS & Safari Uyumlu",
    keywords: [
      "iphone instagram reels indirme",
      "iphone instagram video indirme",
      "reels film rulosuna kaydetme",
      "ios instagram video indir",
    ],
    quickAnswer:
      "iPhone'da Instagram Reels indirmek için Instagram uygulamasından Reels linkini kopyalayın, Safari'de Reelser'ı açıp linki yapıştırın ve 'MP4 İndir'e dokunun. Safari indirmelerinden videoyu açıp 'Videoyu Kaydet' diyerek Fotoğraflar (Film Rulosu) uygulamanıza ekleyin.",
    howToTitle: "iPhone Film Rulosuna Instagram Reels Nasıl Kaydedilir?",
    howToSteps: [
      {
        title: "iPhone'da Reels Linkini Kopyalayın",
        desc: "Instagram uygulamasında Paylaş simgesine dokunup 'Bağlantıyı Kopyala' seçeneğine basın.",
      },
      {
        title: "Safari'de Reelser'a Yapıştırın",
        desc: "Bağlantıyı yukarıdaki kutuya yapıştırın ve İndir butonuna dokunun.",
      },
      {
        title: "Fotoğraflar Uygulamasına Kaydedin",
        desc: "Safari'de inen dosyayı açın, sol alttaki Paylaş simgesine dokunun ve 'Videoyu Kaydet'i seçin.",
      },
    ],
    specs: [
      { label: "Desteklenen Sistemler", value: "iOS 13 – iOS 18+ ve iPadOS" },
      { label: "Önerilen Tarayıcılar", value: "Safari, iOS için Chrome" },
      { label: "Ek Uygulama", value: "Gerekmez (Kestirmeler veya App Store uygulaması şart değil)" },
      { label: "Video Kalitesi", value: "Filigransız Full HD 1080p MP4" },
    ],
    features: [
      {
        title: "App Store Uygulaması Kurmaya Son",
        desc: "Telefon hafızanızı dolduran ve ücretli abonelik isteyen uygulamalara gerek kalmaz.",
      },
      {
        title: "Safari İndirme Yöneticisiyle Tam Uyumlu",
        desc: "iOS ve iPadOS üzerinde doğrudan MP4 indirmeyi destekler.",
      },
      {
        title: "Ana Ekrana Ekleme (PWA) Desteği",
        desc: "Safari'den 'Ana Ekrana Ekle' diyerek Reelser'ı iPhone'unuzda uygulama gibi tek dokunuşla açabilirsiniz.",
      },
      {
        title: "Filigransız ve Sesli",
        desc: "WhatsApp ve iMessage'da paylaşmaya hazır 1080p net video.",
      },
    ],
    article: [
      {
        heading: "iPhone İpucu: Safari İndirilenler Klasöründen Fotoğraflar Uygulamasına Aktarma",
        content: [
          "iOS işletim sisteminde Safari üzerinden indirilen videolar ilk olarak 'Dosyalar' uygulamasındaki İndirilenler klasörüne kaydedilir. Videoyu Film Rulonuza (Fotoğraflar uygulamasına) taşımak için Safari adres çubuğundaki mavi indirme okuna dokunun, videoyu açıp Paylaş > Videoyu Kaydet seçeneğine basın.",
        ],
      },
    ],
    faqs: [
      {
        q: "iPhone'da indirdiğim videolar nereye gidiyor?",
        a: "Safari'nin İndirilenler listesine (Dosyalar uygulaması içine) iner. Oradan Paylaş > Videoyu Kaydet diyerek Fotoğraflar galerisine alabilirsiniz.",
      },
    ],
    relatedSlugs: [
      "instagram-reels-indirme",
      "android-instagram-reels-indirme",
      "instagram-reels-hd-1080p-indirme",
      "instagram-hikaye-indirme",
    ],
  },

  "android-instagram-reels-indirme": {
    slug: "android-instagram-reels-indirme",
    enSlug: "download-instagram-reels-android",
    arSlug: "download-reels-android",
    esSlug: "descargar-reels-android",
    ptSlug: "baixar-reels-android",
    frSlug: "telecharger-reel-android",
    category: "reels",
    metaTitle: "Android Instagram Reels İndirme (Uygulamasız Galeriye Kaydet) | Reelser",
    metaDescription:
      "Samsung, Xiaomi ve tüm Android telefonlarda APK veya uygulama yüklemeden Instagram Reels ve videolarını doğrudan Galeriye Full HD indirin.",
    h1: "Android'de Uygulamasız Instagram Reels İndirme (Doğrudan Galeri)",
    badge: "Android & Chrome Uyumlu",
    keywords: [
      "android instagram reels indirme",
      "uygulamasız instagram video indirme",
      "samsung instagram video indir",
      "reels galeriye kaydetme android",
    ],
    quickAnswer:
      "Android telefonda uygulama kurmadan Instagram Reels indirmek için Reels bağlantısını kopyalayın, Chrome'da Reelser'ı açıp yapıştırın ve 'MP4 İndir'e dokunun. Video otomatik olarak telefonunuzun Galerisine Full HD olarak kaydedilir.",
    howToTitle: "Android Telefona 3 Adımda Reels Nasıl İndirilir?",
    howToSteps: [
      {
        title: "Instagram'dan Bağlantıyı Kopyalayın",
        desc: "Reels videosunda Paylaş simgesine dokunun ve 'Bağlantıyı Kopyala' deyin.",
      },
      {
        title: "Chrome'da Reelser'a Yapıştırın",
        desc: "Bu sayfayı açıp kopyaladığınız linki arama kutusuna yapıştırın.",
      },
      {
        title: "Galerinizde İzleyin",
        desc: "MP4 İndir butonuna bastığınızda video doğrudan Galeri > İndirilenler klasörüne kaydedilir.",
      },
    ],
    specs: [
      { label: "Uyumlu Cihazlar", value: "Samsung Galaxy, Xiaomi, Redmi, Google Pixel, Oppo, Huawei vb." },
      { label: "APK Kurulumu", value: "Gerekmez (%100 Tarayıcı Tabanlı)" },
      { label: "Web Uygulaması (PWA)", value: "Chrome'dan Ana Ekrana Eklenebilir" },
      { label: "Kalite", value: "Filigransız 1080p MP4" },
    ],
    features: [
      {
        title: "APK veya Reklamlı Uygulamalara Gerek Yok",
        desc: "Telefonunuzu yavaşlatan ve pil tüketen üçüncü parti uygulamalardan kurtulun.",
      },
      {
        title: "Doğrudan Galeriye Kayıt",
        desc: "İndirilen MP4 videolar anında Galeri ve Google Fotoğraflar uygulamasında görünür.",
      },
      {
        title: "Tek Dokunuşla Yapıştır Butonu",
        desc: "Mobil ekranlarda tek elle hızlı kullanım için tasarlandı.",
      },
      {
        title: "WhatsApp Durumda Hemen Paylaşın",
        desc: "İndirdiğiniz Reels videolarını kolayca WhatsApp veya Telegram'da paylaşabilirsiniz.",
      },
    ],
    article: [
      {
        heading: "Android'de Neden Tarayıcı Tabanlı İndirici Tercih Etmelisiniz?",
        content: [
          "Play Store'daki pek çok video indirme uygulaması gereksiz izinler ister ve tam ekran reklamlar gösterir. Reelser doğrudan Chrome içinde çalışır ve isterseniz ana ekranınıza hafif bir web uygulaması (PWA) olarak eklenebilir.",
        ],
      },
    ],
    faqs: [
      {
        q: "İndirdiğim video doğrudan Android Galerimde görünür mü?",
        a: "Evet, indirme tamamlandığı anda Galeri uygulamanızdaki İndirilenler (Downloads) albümünde yer alır.",
      },
    ],
    relatedSlugs: [
      "instagram-reels-indirme",
      "iphone-instagram-reels-indirme",
      "instagram-reels-hd-1080p-indirme",
      "instagram-mp3-ses-indirme",
    ],
  },

  "instagram-reels-hd-1080p-indirme": {
    slug: "instagram-reels-hd-1080p-indirme",
    enSlug: "reels-download-hd",
    arSlug: "reels-download-4k-hd",
    esSlug: "descargar-reels-hd-1080p",
    ptSlug: "baixar-reels-hd-1080p",
    frSlug: "telecharger-reel-hd-1080p",
    category: "reels",
    metaTitle: "Instagram Reels Full HD 1080p İndirme (Kalite Kaybı Olmadan) | Reelser",
    metaDescription:
      "Instagram Reels ve videolarını sıkıştırma olmadan, orijinal Full HD 1080p yüksek çözünürlükte ve filigransız olarak ücretsiz indirin.",
    h1: "Full HD 1080p Kalitede Instagram Reels Video İndirme",
    badge: "Maksimum Kaynak Kalitesi",
    keywords: [
      "instagram reels hd indirme",
      "instagram 1080p video indir",
      "yüksek kalitede reels indirme",
      "kalite düşmeden instagram video indirme",
    ],
    quickAnswer:
      "Instagram Reels videolarını kalite kaybı olmadan Full HD 1080p çözünürlükte indirmek için bağlantıyı Reelser'a yapıştırın. Sistemimiz otomatik olarak Instagram sunucularındaki en yüksek bit hızına (bitrate) sahip orijinal MP4 akışını seçer.",
    howToTitle: "Instagram Videoları En Yüksek Kalitede Nasıl İndirilir?",
    howToSteps: [
      {
        title: "HD Reels Bağlantısını Kopyalayın",
        desc: "Instagram uygulamasından videonun bağlantısını kopyalayın.",
      },
      {
        title: "Reelser'a Yapıştırın",
        desc: "Motorumuz CDN üzerindeki mevcut en yüksek çözünürlüklü akışı tespit eder.",
      },
      {
        title: "Orijinal 1080p MP4'ü Kaydedin",
        desc: "Yeniden sıkıştırma uygulanmamış net MP4 dosyasını indirin.",
      },
    ],
    specs: [
      { label: "Hedef Çözünürlük", value: "1080 × 1920 piksel (Dikey Full HD)" },
      { label: "Ek Sıkıştırma", value: "%0 (Doğrudan Kaynak Akışı)" },
      { label: "Kare Hızı", value: "Kaynağa göre 60 FPS'e kadar" },
      { label: "Ses", value: "Orijinal Stereo AAC" },
    ],
    features: [
      {
        title: "En Yüksek Kaliteli Akışı Otomatik Seçer",
        desc: "Düşük çözünürlüklü önizleme sürümleri yerine daima ana Full HD 1080p dosyasını indirir.",
      },
      {
        title: "Sıfır Kalite Kaybı",
        desc: "Renkler, kontrast ve keskinlik içerik üreticisinin yüklediği haliyle korunur.",
      },
      {
        title: "Video Editörleri İçin Kusursuz",
        desc: "Kendi videolarını yüksek kalitede yedeklemek isteyen içerik üreticileri için idealdir.",
      },
      {
        title: "%100 Ücretsiz ve Filigransız",
        desc: "Üzerinde hiçbir logo olmadan profesyonel çıktı alın.",
      },
    ],
    article: [
      {
        heading: "Reelser Kalite Kaybı Olmadan Full HD İndirmeyi Nasıl Sağlar?",
        content: [
          "Birçok indirme sitesi bant genişliğinden tasarruf etmek için videoları 480p veya 720p'ye düşürür. Reelser ise doğrudan Instagram medya sunucusundaki en yüksek çözünürlüklü 1080p MP4 dosyasını size ulaştırır.",
        ],
      },
    ],
    faqs: [
      {
        q: "Neden bazı videolar 1080p yerine 720p iniyor?",
        a: "Maksimum kalite videoyu yükleyen kişinin orijinal dosyasına bağlıdır. İçerik 1080p yüklendiyse Reelser tam 1080p olarak indirir.",
      },
    ],
    relatedSlugs: [
      "instagram-reels-indirme",
      "instagram-video-indirme",
      "saveinsta-snapinsta-alternatifi",
    ],
  },

  "saveinsta-snapinsta-alternatifi": {
    slug: "saveinsta-snapinsta-alternatifi",
    enSlug: "saveinsta-alternative",
    arSlug: "saveinsta-arabic-alternative",
    esSlug: "alternativa-saveinsta-snapinsta",
    ptSlug: "alternativa-saveinsta-snapinsta",
    frSlug: "alternative-saveinsta-snapinsta",
    category: "reels",
    metaTitle: "En İyi SaveInsta, SnapInsta ve SSSInstagram Alternatifi | Reelser",
    metaDescription:
      "SaveInsta, SnapInsta veya FastDl'ye reklamsız ve hızlı bir alternatif mi arıyorsunuz? Reelser ile Reels, Story, Fotoğraf ve MP3'leri Full HD indirin.",
    h1: "En İyi SaveInsta ve SnapInsta Alternatifi (Pop-up Reklamsız)",
    badge: "Hızlı, Temiz & Hepsi Bir Arada",
    keywords: [
      "saveinsta alternatifi",
      "snapinsta alternatifi",
      "sssinstagram türkçe",
      "en iyi instagram video indirme sitesi",
      "fastdl alternatifi",
    ],
    quickAnswer:
      "Reelser; SaveInsta, SnapInsta ve SSSInstagram'a en iyi modern alternatiftir: 1080p Reels indirme, gizli hikaye izleme, çoklu albüm indirme ve MP3 dönüştürücüyü rahatsız edici açılır pencereler (pop-up) olmadan tek bir hızlı arayüzde birleştirir.",
    howToTitle: "Instagram İndirmeleriniz İçin Reelser Nasıl Kullanılır?",
    howToSteps: [
      {
        title: "Herhangi Bir Bağlantıyı veya @kullaniciadini Kopyalayın",
        desc: "Reels, video, fotoğraf, albüm linki ya da sadece @kullaniciadi.",
      },
      {
        title: "Reelser Arama Kutusuna Yapıştırın",
        desc: "Akıllı algılama sistemi içerik türünü otomatik olarak tanır.",
      },
      {
        title: "Yönlendirme Olmadan Tek Tıkla İndirin",
        desc: "MP4, JPG veya MP3 dosyanızı anında cihazınıza kaydedin.",
      },
    ],
    specs: [
      { label: "Dahili Araçlar", value: "Reels, Video, Story, Highlights, Fotoğraf, Albüm, PP ve MP3" },
      { label: "Saldırgan Pop-up Reklamlar", value: "Yok (Temiz ve Güvenli Deneyim)" },
      { label: "Çözümleme Motoru", value: "Otomatik Yedekli (Fallback) Çift Sunucu Mimarisi" },
      { label: "Erişim", value: "7/24 Mobil ve Masaüstü" },
    ],
    features: [
      {
        title: "Sahte İndirme Butonları ve Sekmeler Yok",
        desc: "Her tıklamada yeni reklam sekmesi açan eski sitelerin aksine doğrudan indirme sunar.",
      },
      {
        title: "Dahili MP3 Ses Dönüştürücü",
        desc: "SaveInsta ve SnapInsta'da bulunmayan doğrudan MP3 ses indirme özelliğine sahiptir.",
      },
      {
        title: "Çift Motorlu Yüksek Başarı Oranı",
        desc: "Birincil kaynak yoğun olduğunda otomatik olarak ikincil yedek motora geçerek kesintisiz çalışır.",
      },
      {
        title: "Çok Dilli ve PWA Uygulama Desteği",
        desc: "Türkçe, İngilizce, Arapça, İspanyolca, Portekizce ve Fransızca tam destek.",
      },
    ],
    article: [
      {
        heading: "Kullanıcılar Neden SaveInsta ve SnapInsta Yerine Reelser'a Geçiyor?",
        content: [
          "Eski indirme siteleri zamanla yavaşladı ve agresif açılır reklamlarla doldu. Reelser; hızı, temiz arayüzü ve MP3 dönüştürme ile gizli hikaye izleme gibi tüm araçları tek çatı altında sunmasıyla öne çıkıyor.",
        ],
      },
    ],
    faqs: [
      {
        q: "Reelser da SaveInsta ve SnapInsta gibi tamamen ücretsiz mi?",
        a: "Evet, Reelser %100 ücretsizdir, üyelik istemez ve ek olarak MP3 dönüştürme ile profil görüntüleme özellikleri sunar.",
      },
    ],
    relatedSlugs: [
      "instagram-reels-indirme",
      "instagram-hikaye-indirme",
      "instagram-mp3-ses-indirme",
      "instagram-coklu-fotograf-indirme",
    ],
  },
};
