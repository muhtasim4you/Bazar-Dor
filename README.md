# বাজার দর — BazarDor

বাজার দর বাংলাদেশের নিত্যপ্রয়োজনীয় পণ্যের দৈনিক দাম ও বিভিন্ন বাজারের দামের তুলনা দেখানোর একটি responsive web app। চাল, ডাল, সবজি, মাছসহ পণ্যের হালনাগাদ দাম এক জায়গায় দেখে সহজে বাজার পরিকল্পনা করুন।

## প্রযুক্তি

- Next.js 16 App Router
- React 19
- JavaScript
- CSS এবং responsive layouts
- Better Auth: email/password, Google OAuth এবং ঐচ্ছিক GitHub OAuth
- MongoDB
- বাজারদরের BazarDor API
- React Hot Toast

## প্রধান সুবিধা

1. বাংলাদেশি সংখ্যায় পণ্যের দাম, মূল্য পরিবর্তনের ticker এবং responsive product cards।
2. দাম বেড়েছে/কমেছে এমন পণ্যের তালিকা এবং সব পণ্যের বাজারদর।
3. বিভাগ অনুযায়ী পণ্য দেখা; দাম কম থেকে বেশি বা বেশি থেকে কম সাজানো।
4. লগইন-সুরক্ষিত পণ্যের বিবরণ এবং বাজারভিত্তিক সর্বনিম্ন/সর্বোচ্চ দাম।
5. Better Auth email/password ও Google সাইন-ইন; সাইন আপ, সাইন আউট এবং toast feedback।
6. সুরক্ষিত প্রোফাইল পেজ থেকে নাম হালনাগাদ।
7. লোডিং skeleton, খালি বিভাগ ও অজানা URL-এর জন্য সহায়ক 404 পেজ।

## স্থানীয়ভাবে চালান

প্রয়োজন: Node.js এবং MongoDB connection string।

```bash
npm install
npm run dev
```

`.env` ফাইলে Better Auth ও MongoDB কনফিগার করুন:

```dotenv
BETTER_AUTH_SECRET=replace-with-a-long-random-secret
BETTER_AUTH_URL=http://localhost:3000
DATABASE_URI=mongodb://127.0.0.1:27017
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

Google OAuth ব্যবহার করতে Google credentials দিন। GitHub OAuth ঐচ্ছিক: `GITHUB_CLIENT_ID` এবং `GITHUB_CLIENT_SECRET` দুটিই সেট করলে provider সক্রিয় হবে। Secret বা OAuth credentials কখনো version control-এ commit করবেন না।

পণ্য API-এর ডিফল্ট ঠিকানা `https://openapi.programming-hero.com/api/bazardor`; প্রয়োজনে `NEXT_PUBLIC_BAZARDOR_API_URL` দিয়ে অন্য compatible API base URL সেট করা যায়।

## Routes

- `/` — বাজারদর এবং সব পণ্য
- `/category/[slug]` — বিভাগ ও sort control
- `/product/[slug]` — সাইন-ইন প্রয়োজন
- `/signin`, `/signup` — authentication
- `/profile`, `/profile/update` — সাইন-ইন প্রয়োজন

## Build

```bash
npm run build
npm run start
```

Next.js App Router-এর dynamic routes সরাসরি server-এ render হয়, তাই Vercel-এ `/category/[slug]` এবং `/product/[slug]` refresh করলেও route resolution কাজ করে।
