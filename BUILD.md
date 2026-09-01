# OppoIPTV - وثائق البناء والنشر

## المتطلبات الأساسية

- Node.js 18.x أو أعلى
- npm 9.x أو أعلى
- Tizen Studio (لعملية التغليف والنشر على الأجهزة)
- Git

## إعداد بيئة التطوير

```bash
# استنساخ المستودع
git clone https://github.com/whydwajanti-jpg/OppoIPTV.git
cd OppoIPTV

# تثبيت المتعلقات
npm install

# بدء خادم التطوير
npm start
```

سيعمل خادم التطوير على `http://localhost:8080` مع إعادة تحميل تلقائية.

## البناء والتجميع

```bash
# بناء التطوير
npm run build:dev

# بناء الإنتاج
npm run build

# تغليف لـ Tizen
npm run package
```

## بنية المشروع

```
OppoIPTV/
├── src/
│   ├── components/        # مكونات React
│   │   ├── screens/       # الشاشات الكاملة
│   │   ├── navigation/    # مكونات التنقل
│   │   └── ui/            # مكونات واجهة المستخدم
│   ├── services/          # منطق الأعمال
│   ├── stores/            # إدارة الحالة (Zustand)
│   ├── types/             # تعريفات TypeScript
│   ├── styles/            # أنماط CSS عام
│   ├── index.tsx          # نقطة الدخول
│   └── App.tsx            # مكون التطبيق الرئيسي
├── public/
│   ├── index.html         # قالب HTML
│   └── images/            # الصور الثابتة
├── scripts/               # سكريبتات البناء والنشر
├── config.xml             # بيان تطبيق Tizen
├── webpack.config.js      # إعدادات Webpack
├── tsconfig.json          # إعدادات TypeScript
├── package.json           # المتعلقات
└── README.md              # هذا الملف
```

## العمارة والتصميم

### إدارة الحالة
- **متاجر Zustand** لإدارة الحالة بكفاءة
- متاجر منفصلة لـ: التطبيق، الموفرين، البث المباشر، الطلب حسب الطلب، التشغيل، المفضلات
- حفظ البيانات في localStorage

### طبقة الخدمات
- **NetworkService**: طلبات HTTP مع منطق إعادة المحاولة
- **ProviderService**: تكامل موفري IPTV (Xtream, M3U)
- **PlaybackService**: تتبع تقدم المشاهدة
- **EPGService**: معالجة دليل البرامج الإلكترونية
- **FocusService**: التنقل بجهاز التحكم عن بعد
- **CacheService**: تخزين مؤقت للبيانات مع TTL

### مكونات الواجهة
- تصميم موجه للتلفزيون بدقة 1920x1080
- دعم دقة 4K (3840x2160)
- إدارة التركيز المرنة لأجهزة التحكم عن بعد
- تخطيط سريع الاستجابة

## الإعدادات والتكوين

### config.xml
يحتوي ملف `config.xml` على البيانات الوصفية لتطبيق Tizen:
- معرّف التطبيق والإصدار
- الأذونات المطلوبة (الإنترنت، تشغيل الوسائط)
- البيانات الوصفية الخاصة بالتلفزيون
- الميزات المدعومة والدقة

### متغيرات البيئة

- `TIZEN_SDK_PATH`: مسار Tizen Studio (الافتراضي: `~/tizen-studio`)
- `NODE_ENV`: وضع التطوير أو الإنتاج

## النشر على الأجهزة

### تثبيت التطوير على جهاز التلفاز

```bash
# بناء حزمة WGT
npm run package

# التثبيت على التلفاز (يتطلب عنوان IP)
TIZEN_SDK_PATH=/path/to/tizen-studio ./scripts/install-wgt-dev.sh 192.168.1.100
```

### إصدار الإنتاج

1. توقيع الحزمة باستخدام شهادتك
2. إنشاء وسم git: `git tag v1.0.0`
3. دفع الوسم: `git push origin v1.0.0`
4. ستقوم GitHub Actions تلقائياً ببناء ونشر الإصدار

## الاختبار والتحقق

```bash
# تشغيل اختبارات الوحدة
npm test

# تشغيل أداة التحليل
npm run lint

# التحقق من الأنواع
npm run type-check
```

## تحسين الأداء

- تقسيم الأكواد مع الاستيراد الديناميكي
- تحميل الصور بطريقة كسولة مع عناصر نائبة
- إزالة الصور من الذاكرة بطريقة مدركة
- التمرير الافتراضي للقوائم الكبيرة
- حجم الحزمة المحسّنة (أقل من 2MB)

## دعم المتصفحات

- Samsung Tizen 8.0+ (Chromium M108+)
- تم الاختبار على أجهزة Samsung Smart TVs 2024+
- دعم دقة 1920x1080 و 4K

## الأمان

- عدم حفظ بيانات الاعتماد بصيغة نصية
- التخزين الآمن للبيانات الحساسة
- رؤوس سياسة أمان المحتوى
- التحقق من صحة المدخلات والتطهير
- فحص التبعيات باستخدام npm audit

## استكشاف الأخطاء

### فشل البناء
```bash
# مسح node_modules وإعادة البناء
rm -rf node_modules package-lock.json
npm install
npm run build
```

### مشاكل الاتصال بالجهاز
```bash
# التحقق من مسار Tizen SDK
export TIZEN_SDK_PATH=/path/to/tizen-studio

# اختبار اتصال الجهاز
$TIZEN_SDK_PATH/tools/sdb devices
```

### التطبيق لن يتم تشغيله
- التحقق من سجلات التلفاز: `$TIZEN_SDK_PATH/tools/sdb shell dlog -u TIZEN_STUDIO`
- تحقق من أن الشهادة صحيحة
- تحقق من متطلبات إصدار Tizen الحد الأدنى

## المساهمة

انظر [CONTRIBUTING.md](CONTRIBUTING.md) للحصول على الإرشادات.

## الترخيص

MIT - انظر ملف LICENSE للتفاصيل
