# Roznamcha

Laravel + Inertia + React + Tailwind starter skeleton based on approved Roznamcha mockups.

This project includes:
- Public site (Home, About, Contact, Login)
- Auth-protected Admin Panel (Dashboard, Kharcha Map list, Add Expense form, Reports)

NOTE:
- This is a scaffold. You still need to create actual Laravel app (`laravel new roznamcha` or `composer create-project laravel/laravel roznamcha`) and then COPY these files into it.
- Database models/controllers for real data are not included yet.

Folder mapping:
- routes/web.php -> replace/merge into your Laravel routes/web.php
- resources/js/... -> copy into your Laravel resources/js
- tailwind.config.js, postcss.config.js, package.json -> merge with your Laravel versions
