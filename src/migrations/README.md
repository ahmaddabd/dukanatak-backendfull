# إدارة ترحيلات قاعدة البيانات

## الهيكل

```
migrations/
├── versions/              # نسخ الترحيل
│   ├── YYYYMMDDHHMMSS_initial_schema.ts
│   └── YYYYMMDDHHMMSS_add_user_roles.ts
├── templates/            # قوالب الترحيل
│   └── migration.template.ts
└── scripts/             # نصوص المساعدة
    ├── create-migration.sh
    └── run-migrations.sh
```

## التنظيم

- كل ملف ترحيل يجب أن يكون له اسم فريد يبدأ بالطابع الزمني
- يجب أن يحتوي كل ملف على وظيفتي `up` و `down`
- يجب توثيق التغييرات في كل ملف ترحيل

## الأوامر

- إنشاء ترحيل جديد: `npm run migration:create`
- تشغيل الترحيلات: `npm run migration:run`
- التراجع عن الترحيل: `npm run migration:revert`
