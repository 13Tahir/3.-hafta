# BEUShareBox - Product Sharing Platform

Bu proje, kullanıcıların ürünlerini paylaşabildiği, kategorize edebildiği ve yönetebildiği modern bir web uygulamasıdır. Full-stack olarak geliştirilmiş olup Docker desteği ile kolayca yayına alınabilir.

## 🚀 Özellikler

- **Kullanıcı Yönetimi:** Kayıt olma, giriş yapma ve JWT tabanlı kimlik doğrulama.
- **Ürün Paylaşımı:** Resim desteği ve zengin metin düzenleyici (React Quill) ile detaylı ürün ekleme.
- **Kategorizasyon:** Ürünleri kategorilere ayırma ve filtreleme.
- **Responsive Tasarım:** Hem masaüstü hem de mobil cihazlar için optimize edilmiş arayüz.
- **Dosya Yükleme:** Multer kullanılarak sunucu tarafında resim yönetimi.

## 🛠️ Kullanılan Teknolojiler

### Frontend
- **React 19 & Vite:** Hızlı ve modern kullanıcı arayüzü.
- **React Router Dom:** Sayfalar arası yönlendirme.
- **Lucide React:** Modern ikon seti.
- **Axios:** API istekleri için.
- **React Quill:** Zengin metin editörü.

### Backend
- **Node.js & Express:** Ölçeklenebilir sunucu mimarisi.
- **MongoDB & Mongoose:** Esnek veri depolama ve modelleme.
- **JWT & Bcrypt:** Güvenli oturum yönetimi ve şifreleme.
- **Multer:** Resim yükleme işlemleri.

### DevOps & Altyapı
- **Docker & Docker Compose:** Konteynırlaştırma ve kolay kurulum.
- **Nginx:** Frontend içeriklerini sunmak için.

## 🔌 Kurulum ve Çalıştırma

### 1. Depoyu Klonlayın
```bash
git clone <repo-url>
cd 3.-hafta
