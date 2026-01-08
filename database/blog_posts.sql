-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Dec 27, 2025 at 07:17 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `roznamcha`
--

-- --------------------------------------------------------

--
-- Table structure for table `blog_posts`
--

CREATE TABLE `blog_posts` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `excerpt` text DEFAULT NULL,
  `content` longtext NOT NULL,
  `content_format` enum('markdown','html') NOT NULL DEFAULT 'markdown',
  `status` enum('draft','published','scheduled') NOT NULL DEFAULT 'draft',
  `published_at` timestamp NULL DEFAULT NULL,
  `seo_title` varchar(255) DEFAULT NULL,
  `seo_description` text DEFAULT NULL,
  `seo_keywords` varchar(255) DEFAULT NULL,
  `og_image_path` varchar(255) DEFAULT NULL,
  `canonical_url` varchar(255) DEFAULT NULL,
  `language` varchar(8) DEFAULT 'ur',
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `blog_posts`
--

INSERT INTO `blog_posts` (`id`, `title`, `slug`, `excerpt`, `content`, `content_format`, `status`, `published_at`, `seo_title`, `seo_description`, `seo_keywords`, `og_image_path`, `canonical_url`, `language`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES
(1, 'How to stretch ration for 30 days', 'how-to-stretch-ration-for-30-days', 'Fugiat nam nobis aperiam quis qui impedit necessitatibus iure. Ut ex blanditiis quis libero fugiat est.', 'Eum quibusdam sunt quia culpa nihil in. Nisi laudantium nemo occaecati illo. Quasi ut id soluta fugiat sit aut. Ea optio cumque impedit eos vel ea quis.\n\nOdit aperiam voluptates magnam officiis ipsam. Ad ratione itaque repellendus voluptas adipisci. Dolores consequatur omnis sint accusamus quos. Natus excepturi possimus quis eos dicta nesciunt. Facere qui nisi dolorum quo nesciunt aut non.\n\nDeleniti nam dolores ipsum qui est autem. Nisi sit eos alias quod ut distinctio aliquid. Eum quasi nemo iure. Autem tenetur quod facilis cupiditate totam.\n\nRem voluptatum dignissimos illo maxime. Optio quo dignissimos qui aperiam consectetur aut.\n\nEst sunt aut quibusdam quia qui cumque minima architecto. Cum quis et dolor ipsam consequatur. Voluptatum ut autem sit quia omnis. Nulla ut odio velit accusamus numquam.', 'markdown', 'published', '2025-12-20 03:17:48', 'Aut ullam non et adipisci ad.', 'Sint totam dolor reiciendis eligendi quia pariatur nihil.', 'possimus, excepturi, non, eum, molestias', NULL, NULL, 'ur', NULL, NULL, '2025-12-21 03:17:48', '2025-12-21 03:17:48'),
(2, 'Draft insights on school fees', 'draft-insights-on-school-fees', 'Officiis repellat dolore et in recusandae animi qui. Corrupti cupiditate magnam harum ipsam dolores eveniet. Optio aliquam et dolore vitae.', 'Officiis nemo vel enim dolores eveniet voluptas. Voluptatem aperiam voluptas deleniti molestias qui ducimus. Molestias sed enim nihil ex qui iste. Laborum eligendi voluptatem eos omnis nesciunt animi aut aut.\n\nFuga totam commodi sint est cupiditate et velit. Maxime ratione quidem at maiores reprehenderit quia. Ut culpa suscipit eum vel.\n\nVoluptatem eveniet voluptatem vitae quos. Quia excepturi assumenda nobis accusamus non cumque. Eaque quia et voluptatibus rerum. Id aut ut quas voluptatem est ab.\n\nOdio reprehenderit accusamus numquam dolore ut. Sint sint assumenda exercitationem iusto accusamus. Quo sit minima alias omnis odio.\n\nEos in ullam voluptas unde perspiciatis eaque sunt. Impedit culpa sit et officia alias. Nulla temporibus qui quos. Sunt occaecati maiores ab facilis nihil facilis eos.', 'markdown', 'draft', NULL, 'Enim quia voluptatem corporis non soluta quae.', 'Voluptate non voluptatum quisquam enim quibusdam aut beatae vel voluptas cum quidem iusto dignissimos consequatur unde.', 'laboriosam, pariatur, laborum, ipsa, corrupti', NULL, NULL, 'ur', NULL, NULL, '2025-12-21 03:17:48', '2025-12-21 03:17:48'),
(3, 'Upcoming mehngai forecast', 'upcoming-mehngai-forecast', 'Qui beatae enim qui nihil. Pariatur illum dolorum est culpa tempora. Qui non optio ea sit aut voluptas quibusdam.', 'Molestias minima voluptatem veniam est ad. Et sapiente sed facilis placeat. Natus iste quisquam dolores repellat cum eum sunt. Velit natus est fugiat ad harum quis aut.\n\nIn ab eum aut adipisci omnis. Alias qui aut voluptatem aut veniam. Cum et rem at qui praesentium non sed rem.\n\nEt reiciendis hic et. Omnis inventore cumque porro distinctio quo sint labore. Sint quo quas ipsam eos dignissimos odio. Ipsa doloribus quo deleniti amet et eius.\n\nDolor nobis doloremque expedita quam qui ipsum. Neque libero voluptatibus sit numquam occaecati totam. Sint sit suscipit sunt error qui eum voluptas.\n\nCum cumque reiciendis veniam similique. Eum modi ex blanditiis omnis voluptates est ducimus aliquid. Sunt magnam eligendi id molestias. Qui nostrum dolor et aperiam animi qui perferendis.', 'markdown', 'scheduled', '2025-12-23 03:17:48', 'Est et voluptatibus quo sunt.', 'Quia asperiores dolor dolorem excepturi et porro et.', 'labore, nesciunt, ad, qui, delectus', NULL, NULL, 'en', NULL, NULL, '2025-12-21 03:17:48', '2025-12-21 03:17:48'),
(4, 'Title', 'title', 'I reworked the admin blog form so each button calls submitWithStatus(\'draft\'|\'published\'|\'scheduled\'), which\r\n  uses form.post() or form.put() directly (depending on create/edit) after applying a transform that injects the\r\n  requested status. This avoids the chaining bug that was throwing Cannot read properties of undefined (reading\r\n  \'post\'). Built the assets again via npm run build, so copy the new public/build/ bundle and resources/js/ziggy.js\r\n  when syncing.', 'I reworked the admin blog form so each button calls submitWithStatus(\'draft\'|\'published\'|\'scheduled\'), which\r\n  uses form.post() or form.put() directly (depending on create/edit) after applying a transform that injects the\r\n  requested status. This avoids the chaining bug that was throwing Cannot read properties of undefined (reading\r\n  \'post\'). Built the assets again via npm run build, so copy the new public/build/ bundle and resources/js/ziggy.js\r\n  when syncing. I reworked the admin blog form so each button calls submitWithStatus(\'draft\'|\'published\'|\'scheduled\'), which\r\n  uses form.post() or form.put() directly (depending on create/edit) after applying a transform that injects the\r\n  requested status. This avoids the chaining bug that was throwing Cannot read properties of undefined (reading\r\n  \'post\'). Built the assets again via npm run build, so copy the new public/build/ bundle and resources/js/ziggy.js\r\n  when syncing. I reworked the admin blog form so each button calls submitWithStatus(\'draft\'|\'published\'|\'scheduled\'), which\r\n  uses form.post() or form.put() directly (depending on create/edit) after applying a transform that injects the\r\n  requested status. This avoids the chaining bug that was throwing Cannot read properties of undefined (reading\r\n  \'post\'). Built the assets again via npm run build, so copy the new public/build/ bundle and resources/js/ziggy.js\r\n  when syncing.', 'markdown', 'published', '2025-12-21 04:04:49', 'Sharing', 'Sharing', 'Sharing', 'blog/og-images/q1DP4244e6bGWoNcCsgyDuSa4C1OJCmT6jd9qs5l.jpg', NULL, 'ur', 2, 2, '2025-12-21 04:01:23', '2025-12-21 04:04:49'),
(5, 'Create Post', 'create-post', 'anks for digging into this. The error you’re hitting happens because Safari/Chrome run the Inertia finish\r\n  callbacks even when the POST request silently redirects to /login. In your environment, every POST /admin/blog/\r\n  posts is being intercepted by auth middleware and sent to the login screen (302), so Inertia tries to work with\r\n  an unexpected response (hence “Cannot read properties of undefined”). That’s why “Save Draft” appeared to work\r\n  earlier only when you were already authenticated via a different tab.', 'anks for digging into this. The error you’re hitting happens because Safari/Chrome run the Inertia finish\r\n  callbacks even when the POST request silently redirects to /login. In your environment, every POST /admin/blog/\r\n  posts is being intercepted by auth middleware and sent to the login screen (302), so Inertia tries to work with\r\n  an unexpected response (hence “Cannot read properties of undefined”). That’s why “Save Draft” appeared to work\r\n  earlier only when you were already authenticated via a different tab.anks for digging into this. The error you’re hitting happens because Safari/Chrome run the Inertia finish\r\n  callbacks even when the POST request silently redirects to /login. In your environment, every POST /admin/blog/\r\n  posts is being intercepted by auth middleware and sent to the login screen (302), so Inertia tries to work with\r\n  an unexpected response (hence “Cannot read properties of undefined”). That’s why “Save Draft” appeared to work\r\n  earlier only when you were already authenticated via a different tab.anks for digging into this. The error you’re hitting happens because Safari/Chrome run the Inertia finish\r\n  callbacks even when the POST request silently redirects to /login. In your environment, every POST /admin/blog/\r\n  posts is being intercepted by auth middleware and sent to the login screen (302), so Inertia tries to work with\r\n  an unexpected response (hence “Cannot read properties of undefined”). That’s why “Save Draft” appeared to work\r\n  earlier only when you were already authenticated via a different tab.anks for digging into this. The error you’re hitting happens because Safari/Chrome run the Inertia finish\r\n  callbacks even when the POST request silently redirects to /login. In your environment, every POST /admin/blog/\r\n  posts is being intercepted by auth middleware and sent to the login screen (302), so Inertia tries to work with\r\n  an unexpected response (hence “Cannot read properties of undefined”). That’s why “Save Draft” appeared to work\r\n  earlier only when you were already authenticated via a different tab.', 'markdown', 'published', '2025-12-21 04:09:15', 'SEO & Sharing', 'SEO & Sharing\r\nSEO & Sharing\r\nSEO & Sharing', 'SEO & Sharing,SEO & Sharing', 'blog/og-images/JlyJFA6484GinLT3WFLVwThxQ1HgLvFxilOldkSS.jpg', NULL, 'ur', 2, 2, '2025-12-21 04:09:15', '2025-12-21 04:09:15'),
(6, 'How Pakistani Families Can Control Monthly Expenses Without Cutting Their Dignity', 'how-pakistani-families-can-control-monthly-expenses-without-cutting-their-dignity', 'How Pakistani Families Can Control Monthly Expenses Without Cutting Their DignityHow Pakistani Families Can Control Monthly Expenses Without Cutting Their DignityHow Pakistani Families Can Control Monthly Expenses Without Cutting Their DignityHow Pakistani Families Can Control Monthly Expenses Without Cutting Their DignityHow Pakistani Families Can Control Monthly Expenses Without Cutting Their DignityHow Pakistani Families Can Control Monthly Expenses Without Cutting Their Dignity', '<article>\r\n\r\n  <header>\r\n    <h1>How Pakistani Families Can Control Monthly Expenses Without Cutting Their Dignity</h1>\r\n<section>\r\n    <h2>First, Understand Where Your Money Is Actually Going</h2>\r\n    <p>Most families think they know their expenses. They do not. Ask anyone how much they spend on groceries every month and you will get a rough guess. That guess is usually wrong.</p>\r\n    <p>Start by tracking expenses for one full month. Not mentally. Write it down.</p>\r\n    <p>Include:</p>\r\n    <ul>\r\n      <li>Grocery items</li>\r\n      <li>Sabzi, milk, bread</li>\r\n      <li>Fuel</li>\r\n      <li>School expenses</li>\r\n      <li>Medicines</li>\r\n      <li>Electricity and gas</li>\r\n      <li>Internet and mobile balance</li>\r\n      <li>Small daily cash spending</li>\r\n    </ul>\r\n    <p>Those small daily expenses quietly destroy budgets.</p>\r\n    <p>Once everything is written, patterns become visible. You will notice that groceries or fuel are eating more money than expected. You will also notice repeated unnecessary spending that feels small daily but becomes large monthly.</p>\r\n    <p>This step alone changes behavior because awareness creates discipline.</p>\r\n  </section>\r\n\r\n  <section>\r\n    <h2>Create Categories That Match Pakistani Household Reality</h2>\r\n    <p>Foreign budgeting advice often fails because it ignores local realities. Pakistani households have different spending patterns.</p>\r\n    <p>Your categories should look like this:</p>\r\n    <ul>\r\n      <li>Grocery and kitchen items</li>\r\n      <li>Utility bills electricity, gas, water</li>\r\n      <li>Fuel and transport</li>\r\n      <li>School fees and education</li>\r\n      <li>Medical and pharmacy</li>\r\n      <li>Mobile, internet, subscriptions</li>\r\n      <li>Miscellaneous daily cash spending</li>\r\n      <li>Emergency and savings</li>\r\n    </ul>\r\n    <p>Once expenses are categorized, you can clearly see which areas are under control and which are bleeding money.</p>\r\n  </section>\r\n\r\n  <section>\r\n    <h2>Control Grocery Expenses Without Lowering Food Quality</h2>\r\n    <p>Groceries are the biggest pain point today. Prices rise monthly and quality often drops.</p>\r\n    <p>The solution is not buying cheaper unhealthy food. The solution is smarter buying.</p>\r\n    <p>Practical steps:</p>\r\n    <ul>\r\n      <li>Buy staples in controlled bulk when prices are stable. Flour, rice, pulses, cooking oil if storage allows</li>\r\n      <li>Stop impulse grocery trips. Plan weekly purchases</li>\r\n      <li>Track price changes of frequently used items</li>\r\n      <li>Reduce food waste. Leftovers thrown away are silent losses</li>\r\n    </ul>\r\n    <p>Families that track grocery prices over time save money without realizing it.</p>\r\n  </section>\r\n\r\n  <section>\r\n    <h2>Manage Utility Bills With Habits, Not Stress</h2>\r\n    <p>Electricity and gas bills feel uncontrollable, but habits matter more than people admit.</p>\r\n    <p>Simple habits that work:</p>\r\n    <ul>\r\n      <li>Switch off unused lights and appliances consistently</li>\r\n      <li>Use energy-heavy appliances during off-peak times where possible</li>\r\n      <li>Service fans and appliances. Poor efficiency costs money</li>\r\n      <li>Track monthly units instead of just paying the bill blindly</li>\r\n    </ul>\r\n    <p>The goal is not zero usage. The goal is conscious usage.</p>\r\n  </section>\r\n\r\n  <section>\r\n    <h2>Fuel Expenses Need Route Discipline</h2>\r\n    <p>Fuel is another silent budget killer.</p>\r\n    <p>Do this instead:</p>\r\n    <ul>\r\n      <li>Combine errands into fewer trips</li>\r\n      <li>Avoid unnecessary short-distance car trips where walking or biking is possible</li>\r\n      <li>Track monthly fuel spending, not per refill</li>\r\n    </ul>\r\n    <p>Once families see the monthly total, behavior changes automatically.</p>\r\n  </section>\r\n\r\n  <section>\r\n    <h2>School Fees Require Annual Planning</h2>\r\n    <p>School expenses hurt because families treat them as monthly shocks.</p>\r\n    <p>A better approach:</p>\r\n    <ul>\r\n      <li>List all school-related costs for the year. Tuition, books, uniforms, transport, activities</li>\r\n      <li>Divide the annual cost by twelve and treat it as a monthly expense</li>\r\n    </ul>\r\n    <p>This removes emotional pressure when fees increase.</p>\r\n  </section>\r\n\r\n  <section>\r\n    <h2>Medical Expenses Need a Buffer, Not Panic</h2>\r\n    <p>Medical costs are unpredictable but unavoidable.</p>\r\n    <p>Every household should keep a small monthly medical reserve. Even a modest amount helps avoid borrowing or stress during illness.</p>\r\n    <p>Do not ignore preventive health. Delayed treatment often becomes more expensive.</p>\r\n  </section>\r\n\r\n  <section>\r\n    <h2>Savings Are Not Optional, Even Small Ones</h2>\r\n    <p>Many families say there is nothing left to save. This is often untrue.</p>\r\n    <p>Savings do not need to be large. They need to be consistent.</p>\r\n    <p>Key rules:</p>\r\n    <ul>\r\n      <li>Save a fixed small amount every month</li>\r\n      <li>Treat savings like a necessary expense</li>\r\n      <li>Do not wait for leftover money</li>\r\n    </ul>\r\n    <p>Even small monthly savings build discipline and emergency protection.</p>\r\n  </section>\r\n\r\n  <section>\r\n    <h2>Why Traditional Budgeting Fails in Pakistan</h2>\r\n    <p>The biggest reason budgets fail is rigidity. Life is unpredictable. Inflation is aggressive. Expenses change.</p>\r\n    <p>Instead of strict budgeting, use awareness-based budgeting:</p>\r\n    <ul>\r\n      <li>Track expenses</li>\r\n      <li>Review monthly</li>\r\n      <li>Adjust based on reality</li>\r\n    </ul>\r\n    <p>This flexible approach works better in Pakistan’s unstable economy.</p>\r\n  </section>\r\n\r\n  <section>\r\n    <h2>How Tools Like Roznamcha Help Pakistani Families</h2>\r\n    <p>Manually tracking expenses works, but people eventually stop. Digital tools remove friction.</p>\r\n    <p>Roznamcha is designed for Pakistani households. It is Urdu-friendly, simple, and practical. No financial jargon. No complexity.</p>\r\n    <p>When people see their numbers clearly, decisions improve automatically.</p>\r\n  </section>\r\n\r\n  <section>\r\n    <h2>Final Thought</h2>\r\n    <p>Expense control is not about becoming miserly. It is about protecting your household from financial stress.</p>\r\n    <p>Dignity comes from stability, not spending. Families that understand their money sleep better, argue less, and plan better.</p>\r\n    <p>If you want control, start with awareness. The rest follows naturally.</p>\r\n  </section>\r\n\r\n</article>', 'html', 'published', '2025-12-21 04:49:00', 'How Pakistani Families Can Control Monthly Expenses Without Cutting Their Dignity', 'How Pakistani Families Can Control Monthly Expenses Without Cutting Their Dignity', 'one,two', 'blog/og-images/Q6u5q08zCnpAV4BvzGxBmAltRYYHq2Iu5EDrnKcp.png', NULL, 'ur', 2, 2, '2025-12-21 04:49:05', '2025-12-21 06:47:03');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `blog_posts`
--
ALTER TABLE `blog_posts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `blog_posts_slug_unique` (`slug`),
  ADD KEY `blog_posts_created_by_foreign` (`created_by`),
  ADD KEY `blog_posts_updated_by_foreign` (`updated_by`),
  ADD KEY `blog_posts_status_published_at_index` (`status`,`published_at`),
  ADD KEY `blog_posts_status_index` (`status`),
  ADD KEY `blog_posts_published_at_index` (`published_at`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `blog_posts`
--
ALTER TABLE `blog_posts`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `blog_posts`
--
ALTER TABLE `blog_posts`
  ADD CONSTRAINT `blog_posts_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `blog_posts_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
