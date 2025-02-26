# وحدة المستخدمين

## الهيكل النموذجي للوحدة

```
users/
├── controllers/           # وحدات التحكم
│   └── users.controller.ts
├── services/             # الخدمات
│   └── users.service.ts
├── dto/                  # كائنات نقل البيانات
│   ├── create-user.dto.ts
│   └── update-user.dto.ts
├── entities/             # الكيانات
│   └── user.entity.ts
├── repositories/         # المستودعات
│   └── users.repository.ts
├── interfaces/           # الواجهات
│   └── user.interface.ts
├── constants/            # الثوابت
│   └── users.constants.ts
├── tests/               # الاختبارات
│   ├── users.controller.spec.ts
│   └── users.service.spec.ts
└── users.module.ts      # وحدة التجميع
```

## المسؤوليات

- إدارة المستخدمين
- المصادقة والتفويض
- إدارة الملف الشخصي

## التبعيات

- وحدة المصادقة
- خدمة البريد الإلكتروني
- خدمة التخزين
