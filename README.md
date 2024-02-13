# BTC application new

**_What's new?_**

1. I used NestJs, TypeScript, Prisma, Pino logger and nestjs/schedule, nestjs-prometheus here.
2. Completely different connection logic, and also, all DB models are implemented in the prisma/schema.
3. Now when we want to get all emails, we get only the information that was specified in the task, such as: email , status, createdAt, deletedAt.
4. Also, the logic of storing the rate has been rethought and redesigned, specifically, it is now stored in the database only when we send emails, and not always when a request is made (as it was before).
5. Based on point 4, now the correct logic of sending emails is implemented, if the exchange rate has changed by 5%, it also looks if the email was subscribed to the newsletter before the previous email was sent, and based on this, sends emails only to those who have already received them and subscribed, and the exchange rate has changed by 5%.
6. Also, the logic of nodemailer.service has been changed, and now it is responsible only for itself and does not make queries to the database in order to find emails there (this logic has been moved to rate.service).
7. A new API for Bitcoin has also been added (since the previous one stopped working).
8. Added @willsoto/nestjs-prometheus, without default metrics, now it's count: subscribe email, unsubscribe email, send email, send email error, exchange rate.