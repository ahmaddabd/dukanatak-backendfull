
# إرشادات الاختبار المكثّف لـ CustomersModule

## اختبار إرسال OTP

1. تأكد من وجود متغيرات البيئة التالية بشكل صحيح في ملف `.env`:
   ```env
   TWILIO_ACCOUNT_SID=your_twilio_account_sid
   TWILIO_AUTH_TOKEN=your_twilio_auth_token
   TWILIO_PHONE_NUMBER=your_twilio_phone_number
   REDIS_URL=redis://localhost:6379
   ```

2. باستخدام Postman، قم بإرسال طلب OTP:

   ```http
   POST /customers/request-otp
   {
     "phoneNumber": "+1234567890"
   }
   ```

   - تحقق من وصول الرسالة النصية على رقم الجوال المحدد.

## اختبار التحقق من OTP

1. استخدم الطلب التالي مع OTP المُرسل إلى جوالك:

   ```http
   POST /customers/verify-otp
   {
     "phoneNumber": "+1234567890",
     "otpCode": "123456"
   }
   ```

   - يجب أن تحصل على JWT token صحيح في الرد.

## ملاحظات هامة

- تأكد من تشغيل Redis محليًا أو على خادم.
- تأكد من توفر اتصال بالإنترنت لإرسال OTP عبر Twilio.
- تأكد من صحة رقم الهاتف وإمكانية استقبال الرسائل النصية.

# إرشادات الاختبار الشامل لمنصة دكانتك

## CustomerStoresModule

- **ربط العميل بمتجر**
  ```http
  POST /customer-stores/link
  {
    "customerId": "customer_id",
    "storeId": "store_id"
  }
  ```

- **جلب متاجر العميل**
  ```http
  GET /customer-stores/:customerId
  ```

## CartsModule

- **إضافة منتج إلى السلة**
  ```http
  POST /cart/add
  {
    "productId": "product_id",
    "storeId": "store_id",
    "quantity": 1
  }
  ```

- **حذف منتج من السلة**
  ```http
  DELETE /cart/:productId
  ```

- **تحديث كمية المنتج في السلة**
  ```http
  PATCH /cart/:productId
  {
    "quantity": 2
  }
  ```

- **جلب تفاصيل السلة**
  ```http
  GET /cart
  ```

## ProductsModule

- **إنشاء منتج جديد**
  ```http
  POST /products
  {
    "name": "Product Name",
    "storeId": "store_id",
    "price": 10.0,
    "quantityAvailable": 100
  }
  ```

- **جلب منتج حسب الـ ID**
  ```http
  GET /products/:id
  ```

- **جلب منتجات المتجر**
  ```http
  GET /products/store/:storeId
  ```

- **حذف منتج**
  ```http
  DELETE /products/:id
  ```

## OrdersModule

- **إنشاء طلب**
  ```http
  POST /orders
  {
    "customerId": "customer_id",
    "items": [
      {
        "productId": "product_id",
        "quantity": 2
      }
    ]
  }
  ```

- **جلب طلب حسب الـ ID**
  ```http
  GET /orders/:id
  ```

- **تحديث حالة الطلب**
  ```http
  PATCH /orders/:id
  {
    "status": "completed"
  }
  ```

- **حذف طلب**
  ```http
  DELETE /orders/:id
  ```

## نصائح هامة:

- استخدم Postman أو أي أداة اختبار API لإجراء هذه الاختبارات.
- تأكد من تفعيل JWT وإضافة Token صحيح في رأس الطلب:
  ```http
  Authorization: Bearer your_jwt_token_here
  ```
