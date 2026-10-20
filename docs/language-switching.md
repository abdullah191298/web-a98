# إدارة تغيير اللغة

## 1. تخزينPreference المستخدم
- يتم تخزين اختيار اللغة في `localStorage` تحت مفتاح `site-lang`.
- القيم الممكنة: `"en"` للإنجليزية، `"ar"` للعربية.
- عند أول دخول، التحقق من وجود قيمة محفوظة، وإلا الافتراضي يكون `"en"` (إنجليزية).

```javascript
// في js الرئيسي (main.js)
const storedLang = localStorage.getItem('site-lang');
const defaultLang = 'en'; // الإنجليزية هي الافتراضية
const currentLang = storedLang || defaultLang;
```

## 2. تطبيق اللغة على الصفحة
- تغيير سمة `lang` على عنصر `<html>`:
```javascript
document.documentElement.setAttribute('lang', currentLang);
```
- تغيير سمة `dir` حسب اللغة:
```javascript
document.documentElement.setAttribute('dir', currentLang === 'ar' ? 'rtl' : 'ltr');
```

## 3. تحديث نصوص الواجهة
- **استهداف العناصر** التي تحتوي نصوصاً قابلة للترجمة وتحديث `innerText` أو `textContent` حسب اللغة المختارة.
- **استخدام كائن `texts`** كما تم شرحه سابقاً، أو **تحميل ملف JSON** يحتوي على الترجمات.

```javascript
function updateUI(lang) {
  const texts = translations[lang]; // object with all strings
  document.querySelectorAll('.btn-text').forEach(el => {
    el.textContent = texts.btn[el.dataset.key];
  });
  // ... باقي العناصر
}
```

## 4. اختبارات اللغة
- **التحقق من كل صفحة** على المقاسات مع التبديل بين اللغتين.
- **التأكد من** عدم حدوث `overflow-x` بسبب طول النص العربي.
- **التأكد من** أن `margin` و `padding` كافية للنصوص العربية الطويلة.
- **التأكد من** أن الأزرار لا تقطع نصها。

## 5. حذف التفضيل (إذا أردت)
- `localStorage.removeItem('site-lang')` للعودة للإعدادات الافتراضية.
- أو توفير زر "إعادة الضبط" في الإعدادات.

## 6. الانتقال بين الصفحات
- **البنك المفتوح** (open) للغة الحالية يجب أن **يحتفظ** عند التنقل بين الصفحات (باستخدام `localStorage`).
- **في حال تغيير اللغة** من صفحة لأخرى، يجب **الحفاظ** على الدولة نفسها أو السماح للمستخدم بالتغيير.

## 6. تكامل مع المكونات
- **أزرار النسخ** (`data-copy`): يجب أن تظل تعمل بغض النظر عن اللغة، ولكن رسالة الحالة `.copy-status` **يجب أن تتغير** حسب اللغة.
- **حالة الحالة** (`.form-status`، `.copy-status`): **يجب أن تعرض النص باللغة الحالية**.
- **تبويبات التنقل** (`.tab`): **يجب أن تعرض النص** باللغة الحالية، وأن **يُحتفظ بالـ `aria-current="page"`** على الصفحة الحالية.

## 7. ملاحظات تقنية
- **النصوص الثابتة** (مثل اسم الموقع، الشارة) **لا تحتاج** لتغيير، ولكن **النصوص الديناميكية** (الأزرار، الرسائل، placeholders) **يجب أن تتغير**.
- **التحقق من `dir`** يجب أن يتم بعد كل تغيير لغة لضمانlayout الصحيح.
- **التحقق من `overflow`** بعد تغيير اللغة Especially on mobile widths (390px, 500px).