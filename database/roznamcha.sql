-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jan 10, 2026 at 10:33 AM
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
-- Table structure for table `announcements`
--

CREATE TABLE `announcements` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `target_audience` varchar(255) DEFAULT NULL,
  `is_published` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `announcements`
--

INSERT INTO `announcements` (`id`, `title`, `content`, `target_audience`, `is_published`, `created_at`, `updated_at`) VALUES
(1, 'Roznamcha Early Access', 'Thanks for trying Roznamcha. Track ration, kharcha and bills in one cockpit.', 'all', 1, '2025-10-27 12:51:29', '2025-10-27 12:51:29');

-- --------------------------------------------------------

--
-- Table structure for table `blog_categories`
--

CREATE TABLE `blog_categories` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `blog_categories`
--

INSERT INTO `blog_categories` (`id`, `name`, `slug`, `created_at`, `updated_at`) VALUES
(1, 'Inflation Watch', 'inflation-watch', '2025-12-21 03:17:48', '2025-12-21 03:17:48'),
(2, 'Household Tips', 'household-tips', '2025-12-21 03:17:48', '2025-12-21 03:17:48'),
(3, 'house price', 'house-price', '2025-12-21 03:42:08', '2025-12-21 03:42:08');

-- --------------------------------------------------------

--
-- Table structure for table `blog_category_post`
--

CREATE TABLE `blog_category_post` (
  `blog_post_id` bigint(20) UNSIGNED NOT NULL,
  `blog_category_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `blog_category_post`
--

INSERT INTO `blog_category_post` (`blog_post_id`, `blog_category_id`) VALUES
(1, 1),
(1, 2),
(4, 3),
(6, 1);

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
  `feature_hooks` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`feature_hooks`)),
  `language` varchar(8) DEFAULT 'ur',
  `created_by` bigint(20) UNSIGNED DEFAULT NULL,
  `updated_by` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `blog_posts`
--

INSERT INTO `blog_posts` (`id`, `title`, `slug`, `excerpt`, `content`, `content_format`, `status`, `published_at`, `seo_title`, `seo_description`, `seo_keywords`, `og_image_path`, `canonical_url`, `feature_hooks`, `language`, `created_by`, `updated_by`, `created_at`, `updated_at`) VALUES
(1, 'How to stretch ration for 30 days', 'how-to-stretch-ration-for-30-days', 'Fugiat nam nobis aperiam quis qui impedit necessitatibus iure. Ut ex blanditiis quis libero fugiat est.', 'Eum quibusdam sunt quia culpa nihil in. Nisi laudantium nemo occaecati illo. Quasi ut id soluta fugiat sit aut. Ea optio cumque impedit eos vel ea quis.\n\nOdit aperiam voluptates magnam officiis ipsam. Ad ratione itaque repellendus voluptas adipisci. Dolores consequatur omnis sint accusamus quos. Natus excepturi possimus quis eos dicta nesciunt. Facere qui nisi dolorum quo nesciunt aut non.\n\nDeleniti nam dolores ipsum qui est autem. Nisi sit eos alias quod ut distinctio aliquid. Eum quasi nemo iure. Autem tenetur quod facilis cupiditate totam.\n\nRem voluptatum dignissimos illo maxime. Optio quo dignissimos qui aperiam consectetur aut.\n\nEst sunt aut quibusdam quia qui cumque minima architecto. Cum quis et dolor ipsam consequatur. Voluptatum ut autem sit quia omnis. Nulla ut odio velit accusamus numquam.', 'markdown', 'published', '2025-12-20 03:17:48', 'Aut ullam non et adipisci ad.', 'Sint totam dolor reiciendis eligendi quia pariatur nihil.', 'possimus, excepturi, non, eum, molestias', NULL, NULL, NULL, 'ur', NULL, NULL, '2025-12-21 03:17:48', '2025-12-21 03:17:48'),
(2, 'Draft insights on school fees', 'draft-insights-on-school-fees', 'Officiis repellat dolore et in recusandae animi qui. Corrupti cupiditate magnam harum ipsam dolores eveniet. Optio aliquam et dolore vitae.', 'Officiis nemo vel enim dolores eveniet voluptas. Voluptatem aperiam voluptas deleniti molestias qui ducimus. Molestias sed enim nihil ex qui iste. Laborum eligendi voluptatem eos omnis nesciunt animi aut aut.\n\nFuga totam commodi sint est cupiditate et velit. Maxime ratione quidem at maiores reprehenderit quia. Ut culpa suscipit eum vel.\n\nVoluptatem eveniet voluptatem vitae quos. Quia excepturi assumenda nobis accusamus non cumque. Eaque quia et voluptatibus rerum. Id aut ut quas voluptatem est ab.\n\nOdio reprehenderit accusamus numquam dolore ut. Sint sint assumenda exercitationem iusto accusamus. Quo sit minima alias omnis odio.\n\nEos in ullam voluptas unde perspiciatis eaque sunt. Impedit culpa sit et officia alias. Nulla temporibus qui quos. Sunt occaecati maiores ab facilis nihil facilis eos.', 'markdown', 'draft', NULL, 'Enim quia voluptatem corporis non soluta quae.', 'Voluptate non voluptatum quisquam enim quibusdam aut beatae vel voluptas cum quidem iusto dignissimos consequatur unde.', 'laboriosam, pariatur, laborum, ipsa, corrupti', NULL, NULL, NULL, 'ur', NULL, NULL, '2025-12-21 03:17:48', '2025-12-21 03:17:48'),
(3, 'Upcoming mehngai forecast', 'upcoming-mehngai-forecast', 'Qui beatae enim qui nihil. Pariatur illum dolorum est culpa tempora. Qui non optio ea sit aut voluptas quibusdam.', 'Molestias minima voluptatem veniam est ad. Et sapiente sed facilis placeat. Natus iste quisquam dolores repellat cum eum sunt. Velit natus est fugiat ad harum quis aut.\n\nIn ab eum aut adipisci omnis. Alias qui aut voluptatem aut veniam. Cum et rem at qui praesentium non sed rem.\n\nEt reiciendis hic et. Omnis inventore cumque porro distinctio quo sint labore. Sint quo quas ipsam eos dignissimos odio. Ipsa doloribus quo deleniti amet et eius.\n\nDolor nobis doloremque expedita quam qui ipsum. Neque libero voluptatibus sit numquam occaecati totam. Sint sit suscipit sunt error qui eum voluptas.\n\nCum cumque reiciendis veniam similique. Eum modi ex blanditiis omnis voluptates est ducimus aliquid. Sunt magnam eligendi id molestias. Qui nostrum dolor et aperiam animi qui perferendis.', 'markdown', 'scheduled', '2025-12-23 03:17:48', 'Est et voluptatibus quo sunt.', 'Quia asperiores dolor dolorem excepturi et porro et.', 'labore, nesciunt, ad, qui, delectus', NULL, NULL, NULL, 'en', NULL, NULL, '2025-12-21 03:17:48', '2025-12-21 03:17:48'),
(4, 'Title', 'title', 'I reworked the admin blog form so each button calls submitWithStatus(\'draft\'|\'published\'|\'scheduled\'), which\r\n  uses form.post() or form.put() directly (depending on create/edit) after applying a transform that injects the\r\n  requested status. This avoids the chaining bug that was throwing Cannot read properties of undefined (reading\r\n  \'post\'). Built the assets again via npm run build, so copy the new public/build/ bundle and resources/js/ziggy.js\r\n  when syncing.', 'I reworked the admin blog form so each button calls submitWithStatus(\'draft\'|\'published\'|\'scheduled\'), which\r\n  uses form.post() or form.put() directly (depending on create/edit) after applying a transform that injects the\r\n  requested status. This avoids the chaining bug that was throwing Cannot read properties of undefined (reading\r\n  \'post\'). Built the assets again via npm run build, so copy the new public/build/ bundle and resources/js/ziggy.js\r\n  when syncing. I reworked the admin blog form so each button calls submitWithStatus(\'draft\'|\'published\'|\'scheduled\'), which\r\n  uses form.post() or form.put() directly (depending on create/edit) after applying a transform that injects the\r\n  requested status. This avoids the chaining bug that was throwing Cannot read properties of undefined (reading\r\n  \'post\'). Built the assets again via npm run build, so copy the new public/build/ bundle and resources/js/ziggy.js\r\n  when syncing. I reworked the admin blog form so each button calls submitWithStatus(\'draft\'|\'published\'|\'scheduled\'), which\r\n  uses form.post() or form.put() directly (depending on create/edit) after applying a transform that injects the\r\n  requested status. This avoids the chaining bug that was throwing Cannot read properties of undefined (reading\r\n  \'post\'). Built the assets again via npm run build, so copy the new public/build/ bundle and resources/js/ziggy.js\r\n  when syncing.', 'markdown', 'published', '2025-12-21 04:04:49', 'Sharing', 'Sharing', 'Sharing', 'blog/og-images/q1DP4244e6bGWoNcCsgyDuSa4C1OJCmT6jd9qs5l.jpg', NULL, NULL, 'ur', 2, 2, '2025-12-21 04:01:23', '2025-12-21 04:04:49'),
(5, 'Create Post', 'create-post', 'anks for digging into this. The error you’re hitting happens because Safari/Chrome run the Inertia finish\r\n  callbacks even when the POST request silently redirects to /login. In your environment, every POST /admin/blog/\r\n  posts is being intercepted by auth middleware and sent to the login screen (302), so Inertia tries to work with\r\n  an unexpected response (hence “Cannot read properties of undefined”). That’s why “Save Draft” appeared to work\r\n  earlier only when you were already authenticated via a different tab.', 'anks for digging into this. The error you’re hitting happens because Safari/Chrome run the Inertia finish\r\n  callbacks even when the POST request silently redirects to /login. In your environment, every POST /admin/blog/\r\n  posts is being intercepted by auth middleware and sent to the login screen (302), so Inertia tries to work with\r\n  an unexpected response (hence “Cannot read properties of undefined”). That’s why “Save Draft” appeared to work\r\n  earlier only when you were already authenticated via a different tab.anks for digging into this. The error you’re hitting happens because Safari/Chrome run the Inertia finish\r\n  callbacks even when the POST request silently redirects to /login. In your environment, every POST /admin/blog/\r\n  posts is being intercepted by auth middleware and sent to the login screen (302), so Inertia tries to work with\r\n  an unexpected response (hence “Cannot read properties of undefined”). That’s why “Save Draft” appeared to work\r\n  earlier only when you were already authenticated via a different tab.anks for digging into this. The error you’re hitting happens because Safari/Chrome run the Inertia finish\r\n  callbacks even when the POST request silently redirects to /login. In your environment, every POST /admin/blog/\r\n  posts is being intercepted by auth middleware and sent to the login screen (302), so Inertia tries to work with\r\n  an unexpected response (hence “Cannot read properties of undefined”). That’s why “Save Draft” appeared to work\r\n  earlier only when you were already authenticated via a different tab.anks for digging into this. The error you’re hitting happens because Safari/Chrome run the Inertia finish\r\n  callbacks even when the POST request silently redirects to /login. In your environment, every POST /admin/blog/\r\n  posts is being intercepted by auth middleware and sent to the login screen (302), so Inertia tries to work with\r\n  an unexpected response (hence “Cannot read properties of undefined”). That’s why “Save Draft” appeared to work\r\n  earlier only when you were already authenticated via a different tab.', 'markdown', 'published', '2025-12-21 04:09:15', 'SEO & Sharing', 'SEO & Sharing\r\nSEO & Sharing\r\nSEO & Sharing', 'SEO & Sharing,SEO & Sharing', 'blog/og-images/JlyJFA6484GinLT3WFLVwThxQ1HgLvFxilOldkSS.jpg', NULL, NULL, 'ur', 2, 2, '2025-12-21 04:09:15', '2025-12-21 04:09:15'),
(6, 'How Pakistani Families Can Control Monthly Expenses Without Cutting Their Dignity', 'how-pakistani-families-can-control-monthly-expenses-without-cutting-their-dignity', 'How Pakistani Families Can Control Monthly Expenses Without Cutting Their DignityHow Pakistani Families Can Control Monthly Expenses Without Cutting Their DignityHow Pakistani Families Can Control Monthly Expenses Without Cutting Their DignityHow Pakistani Families Can Control Monthly Expenses Without Cutting Their DignityHow Pakistani Families Can Control Monthly Expenses Without Cutting Their DignityHow Pakistani Families Can Control Monthly Expenses Without Cutting Their Dignity', '<article>\r\n    <header>\r\n      <p>Roznamcha ·Household Survival</p>\r\n      <h1>How Pakistani Families Can Control Monthly Expenses Without Cutting\r\n  Their Dignity</h1>\r\n    </header>\r\n\r\n\r\n      <h2>First, Understand Where Your Money Is Actually Going</h2>\r\n      <p><strong>Most families guess their expenses.</strong> Those guesses are\r\n  wrong because daily spend gets forgotten. Track every rupee for one full month\r\n  —write it down, don’t keep it in your head.</p>\r\n      <p>Include:</p>\r\n      <ul>\r\n        <li>Grocery items</li>\r\n        <li>Sabzi, milk, bread</li>\r\n        <li>Fuel and transport</li>\r\n        <li>School expenses</li>\r\n        <li>Medicines</li>\r\n        <li>Electricity and gas</li>\r\n        <li>Internet and mobile balance</li>\r\n        <li>Small daily cash spending</li>\r\n      </ul>\r\n      <p>Once everything is written, patterns appear. You spot grocery or fuel\r\n  overspend and those “small” daily leaks that become huge monthly. Awareness\r\n  alone starts building discipline.</p>\r\n\r\n\r\n    <section>\r\n      <h2>Create Categories That Match Pakistani Household Reality</h2>\r\n      <p>Western budgeting templates fail here. Use buckets that reflect how\r\n  Pakistani homes actually spend:</p>\r\n      <table>\r\n        <thead>\r\n          <tr>\r\n            <th>Category</th>\r\n            <th>Example Monthly Budget</th>\r\n          </tr>\r\n        </thead>\r\n        <tbody>\r\n          <tr>\r\n            <td>Groceries &amp; Kitchen</td>\r\n            <td>Rs. 38,000</td>\r\n          </tr>\r\n          <tr>\r\n            <td>Utilities (electricity, gas, water)</td>\r\n            <td>Rs. 12,500</td>\r\n          </tr>\r\n          <tr>\r\n            <td>Fuel &amp; Transport</td>\r\n            <td>Rs. 10,000</td>\r\n          </tr>\r\n          <tr>\r\n            <td>School Fees &amp; Education</td>\r\n            <td>Rs. 15,000</td>\r\n          </tr>\r\n          <tr>\r\n            <td>Medical &amp; Pharmacy</td>\r\n            <td>Rs. 5,000</td>\r\n          </tr>\r\n          <tr>\r\n            <td>Misc. Daily Cash</td>\r\n            <td>Rs. 4,000</td>\r\n          </tr>\r\n        </tbody>\r\n      </table>\r\n      <p>These figures are placeholders; replace them with your family’s actual\r\n  numbers to see where the gap lies.</p>\r\n      <ul>\r\n        <li>Grocery &amp; kitchen items</li>\r\n        <li>Utility bills (electricity, gas, water)</li>\r\n        <li>Fuel &amp; transport</li>\r\n        <li>School fees &amp; education</li>\r\n        <li>Medical &amp; pharmacy</li>\r\n        <li>Mobile, internet, subscriptions</li>\r\n        <li>Misc. daily cash spending</li>\r\n        <li>Emergency &amp; savings</li>\r\n      </ul>\r\n      <p>With clear categories you instantly see which areas are under control\r\n  and which are bleeding.</p>\r\n    </section>\r\n\r\n    <section>\r\n      <h2>Control Grocery Expenses Without Lowering Food Quality</h2>\r\n      <p>Prices rise monthly, so the goal isn’t cheaper unhealthy food—it’s\r\n  smarter buying.</p>\r\n      <table>\r\n        <thead>\r\n          <tr>\r\n            <th>Item</th>\r\n            <th>Monthly Quantity</th>\r\n            <th>Target Spend</th>\r\n          </tr>\r\n        </thead>\r\n        <tbody>\r\n          <tr>\r\n            <td>Atta + Rice + Pulses</td>\r\n            <td>60 kg</td>\r\n            <td>Rs. 14,000</td>\r\n          </tr>\r\n          <tr>\r\n            <td>Cooking Oil + Ghee</td>\r\n            <td>12 L</td>\r\n            <td>Rs. 8,000</td>\r\n          </tr>\r\n          <tr>\r\n            <td>Fresh Sabzi &amp; Fruit</td>\r\n            <td>Weekly baskets</td>\r\n            <td>Rs. 12,000</td>\r\n          </tr>\r\n          <tr>\r\n            <td>Meat / Poultry</td>\r\n            <td>4 weekly purchases</td>\r\n            <td>Rs. 10,000</td>\r\n          </tr>\r\n        </tbody>\r\n      </table>\r\n      <ul>\r\n        <li>Buy staples in controlled bulk when prices are stable (atta, rice,\r\n  pulses, oil).</li>\r\n        <li>Plan weekly purchases; stop impulse trips.</li>\r\n        <li>Track price changes of frequently used items.</li>\r\n        <li>Reduce waste—leftovers thrown away are silent losses.</li>\r\n      </ul>\r\n      <p>Families that track grocery prices quietly save more than they\r\n  expect.</p>\r\n    </section>\r\n\r\n    <section>\r\n      <h2>Manage Utility Bills With Habits, Not Stress</h2>\r\n      <p>Electricity and gas feel uncontrollable, but habits matter:</p>\r\n      <ul>\r\n        <li>Switch off unused lights/appliances consistently.</li>\r\n        <li>Run heavy appliances during off-peak hours when possible.</li>\r\n        <li>Service fans and ACs; poor efficiency costs money.</li>\r\n        <li>Track units each month instead of blindly paying the bill.</li>\r\n      </ul>\r\n      <p>The target isn’t zero usage—it’s conscious usage.</p>\r\n    </section>\r\n\r\n    <section>\r\n      <h2>Fuel Expenses Need Route Discipline</h2>\r\n      <p>Fuel quietly destroys budgets. Combine errands, skip short car rides\r\n  when walking/biking works, and measure fuel monthly—not per refill. Once\r\n  families see the monthly total, behaviour adjusts automatically.</p>\r\n    </section>\r\n\r\n    <section>\r\n      <h2>School Fees Require Annual Planning</h2>\r\n      <p>List tuition, books, uniforms, transport, activities for the whole\r\n  year. Divide by 12 so school costs become a predictable monthly line. That\r\n  removes the “fee shock” every term.</p>\r\n    </section>\r\n\r\n    <section>\r\n      <h2>Medical Expenses Need a Buffer, Not Panic</h2>\r\n      <p>Set aside a small medical reserve each month. Even modest savings\r\n  prevent borrowing during illness. Don’t ignore preventive health—delayed\r\n  treatment costs more later.</p>\r\n    </section>\r\n\r\n    <section>\r\n      <h2>Savings Are Not Optional, Even Small Ones</h2>\r\n      <p>Savings don’t need to be big; they need to be consistent.</p>\r\n      <ul>\r\n        <li>Save a fixed small amount every month.</li>\r\n        <li>Treat savings like a bill you must pay.</li>\r\n        <li>Never wait for “leftover” money.</li>\r\n      </ul>\r\n      <p>Small, steady savings build discipline and emergency protection.</p>\r\n    </section>\r\n\r\n    <section>\r\n      <h2>Why Traditional Budgeting Fails in Pakistan</h2>\r\n      <p>Rigid budgets collapse when inflation jumps. Use awareness-based\r\n  budgeting instead:</p>\r\n      <ul>\r\n        <li>Track expenses.</li>\r\n        <li>Review monthly.</li>\r\n        <li>Adjust to reality.</li>\r\n      </ul>\r\n      <p>This flexible cycle works better in our unstable economy.</p>\r\n    </section>\r\n\r\n    <section>\r\n      <h2>How Tools Like Roznamcha Help</h2>\r\n      <p>Manual tracking works, but most people quit. Roznamcha keeps it easy\r\n  —Urdu-friendly, simple, no jargon. When numbers become visible, better\r\n  decisions follow automatically.</p>\r\n    </section>\r\n\r\n    <section>\r\n      <h2>Final Thought</h2>\r\n      <p>Expense control isn’t about misery; it protects your household from\r\n  financial stress. Stability—not spending—protects dignity. Families who\r\n  understand their money sleep better, argue less, and plan with confidence.</p>\r\n      <p><em>If you want control, start with awareness. Everything else\r\n  follows.</em></p>\r\n    </section>\r\n  </article>', 'markdown', 'published', '2025-12-21 04:49:00', 'How Pakistani Families Can Control Monthly Expenses Without Cutting Their Dignity', 'How Pakistani Families Can Control Monthly Expenses Without Cutting Their Dignity', 'one,two', 'blog/og-images/Q6u5q08zCnpAV4BvzGxBmAltRYYHq2Iu5EDrnKcp.png', NULL, NULL, 'ur', 2, 2, '2025-12-21 04:49:05', '2026-01-08 01:34:04');

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `cache`
--

INSERT INTO `cache` (`key`, `value`, `expiration`) VALUES
('laravel-cache-admin@local.test|127.0.0.1', 'i:1;', 1762584490),
('laravel-cache-admin@local.test|127.0.0.1:timer', 'i:1762584490;', 1762584490);

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL,
  `color` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `description`, `created_at`, `updated_at`, `color`) VALUES
(1, 'Ration', NULL, '2025-10-27 12:51:29', '2025-10-27 12:51:29', NULL),
(2, 'Fuel', NULL, '2025-10-27 12:51:29', '2025-10-27 12:51:29', NULL),
(3, 'School', NULL, '2025-10-27 12:51:29', '2025-10-27 12:51:29', NULL),
(4, 'Medicine', NULL, '2025-10-27 12:51:29', '2025-10-27 12:51:29', NULL),
(5, 'Utilities', NULL, '2025-10-27 12:51:29', '2025-10-27 12:51:29', NULL),
(6, 'Electronics', 'Electronics', '2025-11-09 03:22:11', '2025-11-09 03:28:20', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE `events` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `session_id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `meta` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`meta`)),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `expenses`
--

CREATE TABLE `expenses` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `category_id` bigint(20) UNSIGNED DEFAULT NULL,
  `date` date NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `amount` decimal(12,2) NOT NULL,
  `receipt_path` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `expenses`
--

INSERT INTO `expenses` (`id`, `user_id`, `category_id`, `date`, `description`, `amount`, `receipt_path`, `created_at`, `updated_at`) VALUES
(1, 1, 1, '2025-10-26', 'Utility Store restock', 2150.00, NULL, '2025-10-27 12:51:29', '2025-10-27 12:51:29'),
(2, 1, 2, '2025-10-26', 'Bike refill', 3000.00, NULL, '2025-10-27 12:51:29', '2025-10-27 12:51:29'),
(3, 1, 3, '2025-10-25', 'Fee advance', 15000.00, NULL, '2025-10-27 12:51:29', '2025-10-27 12:51:29'),
(4, 1, 4, '2025-10-24', 'BP tablets', 1450.00, NULL, '2025-10-27 12:51:29', '2025-10-27 12:51:29'),
(6, 2, 1, '2025-11-08', 'went to jauharabad2', 1002.00, NULL, '2025-11-08 02:38:28', '2025-11-08 02:39:35'),
(7, 2, 1, '2025-11-01', 'atta was finished so we have to do this', 112.00, NULL, '2025-11-08 02:39:22', '2025-11-08 02:39:22');

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `households`
--

CREATE TABLE `households` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `owner_id` bigint(20) UNSIGNED DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `household_user`
--

CREATE TABLE `household_user` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `household_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `is_owner` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `kharcha_entries`
--

CREATE TABLE `kharcha_entries` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `category_id` bigint(20) UNSIGNED DEFAULT NULL,
  `date` date NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `vendor` varchar(255) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `receipt_path` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2025_10_27_152753_create_roles_table', 1),
(5, '2025_10_27_152800_create_role_user_table', 1),
(6, '2025_10_27_152808_create_categories_table', 1),
(7, '2025_10_27_152815_create_expenses_table', 1),
(8, '2025_10_27_152825_create_ration_items_table', 1),
(9, '2025_10_27_152832_create_ration_history_table', 1),
(10, '2025_10_27_152841_create_reminders_table', 1),
(11, '2025_10_27_152854_create_reports_cache_table', 1),
(12, '2025_10_27_152900_create_user_settings_table', 1),
(13, '2025_10_27_152918_create_announcements_table', 1),
(14, '2025_10_28_175312_create_kharcha_entries_table', 2),
(15, '2025_10_28_175343_create_ration_entries_table', 2),
(16, '2025_10_28_175400_create_reminders_table', 2),
(17, '2025_10_28_175421_update_categories_table_for_control_room', 2),
(18, '2025_02_19_000001_create_households_table', 3),
(19, '2025_02_19_000010_create_expenses_table', 4),
(20, '2025_02_19_000030_create_ration_prices_table', 4),
(21, '2025_11_01_000015_create_ration_items_table', 4),
(22, '2025_11_01_000025_add_description_to_categories_table', 4),
(23, '2025_11_01_000040_update_reminders_table_for_schedule', 4),
(24, '2025_11_09_120000_add_email_scheduling_to_reminders', 4),
(25, '2025_12_19_110510_create_blog_posts_table', 5),
(26, '2025_12_19_110514_create_blog_categories_table', 6),
(27, '2025_12_19_110518_create_blog_category_post_table', 7),
(28, '2025_12_01_000000_create_events_table', 8),
(29, '2025_12_01_000010_add_feature_hooks_to_blog_posts_table', 9);

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ration_entries`
--

CREATE TABLE `ration_entries` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `item_name` varchar(255) NOT NULL,
  `qty_used` decimal(10,2) NOT NULL,
  `unit` varchar(255) NOT NULL,
  `days_left_estimate` int(11) DEFAULT NULL,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `ration_history`
--

CREATE TABLE `ration_history` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `ration_item_id` bigint(20) UNSIGNED NOT NULL,
  `change_date` date NOT NULL,
  `change_type` enum('add_stock','consume','adjustment') NOT NULL,
  `quantity_change` decimal(10,2) NOT NULL,
  `notes` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `ration_history`
--

INSERT INTO `ration_history` (`id`, `ration_item_id`, `change_date`, `change_type`, `quantity_change`, `notes`, `created_at`, `updated_at`) VALUES
(1, 1, '2025-10-25', 'add_stock', 15.00, 'Initial inventory load', '2025-10-27 12:51:29', '2025-10-27 12:51:29'),
(2, 2, '2025-10-25', 'add_stock', 6.00, 'Initial inventory load', '2025-10-27 12:51:29', '2025-10-27 12:51:29'),
(3, 3, '2025-10-25', 'add_stock', 3.00, 'Initial inventory load', '2025-10-27 12:51:29', '2025-10-27 12:51:29');

-- --------------------------------------------------------

--
-- Table structure for table `ration_items`
--

CREATE TABLE `ration_items` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `item_name` varchar(255) NOT NULL,
  `unit` varchar(255) DEFAULT NULL,
  `stock_quantity` decimal(10,2) NOT NULL DEFAULT 0.00,
  `daily_usage` decimal(10,2) NOT NULL DEFAULT 0.00,
  `price_per_unit` decimal(12,2) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `ration_items`
--

INSERT INTO `ration_items` (`id`, `user_id`, `item_name`, `unit`, `stock_quantity`, `daily_usage`, `price_per_unit`, `created_at`, `updated_at`) VALUES
(1, 1, 'Atta', 'kg', 15.00, 1.50, 110.00, '2025-10-27 12:51:29', '2025-10-27 12:51:29'),
(2, 1, 'Sugar', 'kg', 6.00, 0.40, 180.00, '2025-10-27 12:51:29', '2025-10-27 12:51:29'),
(3, 1, 'Cooking Oil', 'litre', 3.00, 0.20, 520.00, '2025-10-27 12:51:29', '2025-10-27 12:51:29');

-- --------------------------------------------------------

--
-- Table structure for table `ration_prices`
--

CREATE TABLE `ration_prices` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `ration_item_id` bigint(20) UNSIGNED NOT NULL,
  `household_id` bigint(20) UNSIGNED DEFAULT NULL,
  `price` decimal(12,2) NOT NULL,
  `priced_at` date NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `reminders`
--

CREATE TABLE `reminders` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `household_id` bigint(20) UNSIGNED DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL DEFAULT 'other',
  `schedule_cron` varchar(255) DEFAULT NULL,
  `next_run_at` datetime DEFAULT NULL,
  `last_notified_at` datetime DEFAULT NULL,
  `starts_on` date DEFAULT NULL,
  `ends_on` date DEFAULT NULL,
  `timezone` varchar(255) NOT NULL DEFAULT 'UTC',
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `due_date` datetime DEFAULT NULL,
  `reminder_type` varchar(255) NOT NULL,
  `is_done` tinyint(1) NOT NULL DEFAULT 0,
  `notes` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `reminders`
--

INSERT INTO `reminders` (`id`, `user_id`, `household_id`, `title`, `type`, `schedule_cron`, `next_run_at`, `last_notified_at`, `starts_on`, `ends_on`, `timezone`, `is_active`, `due_date`, `reminder_type`, `is_done`, `notes`, `created_at`, `updated_at`) VALUES
(1, 2, NULL, 'done', 'other', '*/2 * * * *', '2025-11-08 09:30:00', NULL, NULL, NULL, 'UTC', 1, NULL, 'finance', 1, 'sdf sd sfssd sddsf sd', '2025-11-08 04:05:44', '2025-11-08 04:29:22'),
(2, 2, NULL, 'new reminder', 'other', '*/2 * * * *', '2025-11-08 09:30:00', NULL, NULL, NULL, 'UTC', 1, NULL, 'finance', 1, 'please send email', '2025-11-08 04:11:16', '2025-11-08 04:29:22'),
(3, 2, NULL, 'can you send now', 'finance', '0 15 * * *', '2025-11-08 10:00:00', NULL, '2025-11-08', '2025-11-08', 'Asia/Karachi', 1, NULL, 'finance', 0, 'i am from roznamcha', '2025-11-08 04:36:51', '2025-11-08 04:36:51');

-- --------------------------------------------------------

--
-- Table structure for table `reports_cache`
--

CREATE TABLE `reports_cache` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `period_start` date NOT NULL,
  `period_end` date NOT NULL,
  `total_spend` decimal(12,2) NOT NULL DEFAULT 0.00,
  `top_categories_json` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`top_categories_json`)),
  `ration_days_left_snapshot` int(11) DEFAULT NULL,
  `warnings_text` text DEFAULT NULL,
  `generated_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `reports_cache`
--

INSERT INTO `reports_cache` (`id`, `user_id`, `period_start`, `period_end`, `total_spend`, `top_categories_json`, `ration_days_left_snapshot`, `warnings_text`, `generated_at`, `created_at`, `updated_at`) VALUES
(1, 1, '2025-10-01', '2025-10-31', 27800.00, '{\"School\":15000,\"Utilities\":6200,\"Fuel\":3000,\"Ration\":2150,\"Medicine\":1450}', 9, 'Medicine stock low after 9 days', '2025-10-27 12:51:29', '2025-10-27 12:51:29', '2025-10-27 12:51:29');

-- --------------------------------------------------------

--
-- Table structure for table `roles`
--

CREATE TABLE `roles` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `roles`
--

INSERT INTO `roles` (`id`, `name`, `slug`, `created_at`, `updated_at`) VALUES
(1, 'Administrator', 'admin', '2025-10-27 12:46:36', '2025-10-27 12:46:36'),
(2, 'Household Member', 'member', '2025-10-27 12:46:36', '2025-10-27 12:46:36');

-- --------------------------------------------------------

--
-- Table structure for table `role_user`
--

CREATE TABLE `role_user` (
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `role_id` bigint(20) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `sessions`
--

INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES
('4U6094MoTqwLHAKW3IF6e3KmwzA69qyQ4qFFy9tO', 2, '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'YTo0OntzOjY6Il90b2tlbiI7czo0MDoiSEMyZGVQbWc5R2taM29nc3RwSVF5SG5LT3NVcjFWbEVXdHVWVTdMeSI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6MTA4OiJodHRwOi8vMTI3LjAuMC4xOjgwMDAvYmxvZy9ob3ctcGFraXN0YW5pLWZhbWlsaWVzLWNhbi1jb250cm9sLW1vbnRobHktZXhwZW5zZXMtd2l0aG91dC1jdXR0aW5nLXRoZWlyLWRpZ25pdHkiO3M6NToicm91dGUiO3M6MTY6InB1YmxpYy5ibG9nLnNob3ciO31zOjY6Il9mbGFzaCI7YToyOntzOjM6Im9sZCI7YTowOnt9czozOiJuZXciO2E6MDp7fX1zOjUwOiJsb2dpbl93ZWJfNTliYTM2YWRkYzJiMmY5NDAxNTgwZjAxNGM3ZjU4ZWE0ZTMwOTg5ZCI7aToyO30=', 1767854213),
('c2IoZeucxFAi99qp9BuY2tuSWGVUZ1y17CXzu76c', NULL, '127.0.0.1', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 'YTo0OntzOjY6Il90b2tlbiI7czo0MDoiUDBJcmIzY1pNVXVQMDBqYjc5R1I0ZFlEejhUaVBka2E2YjVJdmJVdyI7czo5OiJfcHJldmlvdXMiO2E6Mjp7czozOiJ1cmwiO3M6NTQ6Imh0dHA6Ly8xMjcuMC4wLjE6ODAwMC9yZWdpc3Rlcj9yZXR1cm5fdG89JTJGb25ib2FyZGluZyI7czo1OiJyb3V0ZSI7czo4OiJyZWdpc3RlciI7fXM6NjoiX2ZsYXNoIjthOjI6e3M6Mzoib2xkIjthOjA6e31zOjM6Im5ldyI7YTowOnt9fXM6MTA6ImFjdGl2YXRpb24iO2E6Mjp7czo2OiJyZXR1cm4iO3M6MTE6Ii9vbmJvYXJkaW5nIjtzOjg6ImNvbXBsZXRlIjtzOjMxOiIvYmxvZy91cGNvbWluZy1tZWhuZ2FpLWZvcmVjYXN0Ijt9fQ==', 1768025811);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('admin','user') NOT NULL DEFAULT 'user',
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `email_verified_at`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'Roznamcha Demo', 'demo@roznamcha.test', '$2y$12$4tFNv9zDuC2UqztS3fEkzepbjWGh8An6dvzdncMpztsQnhAwotSxe', 'admin', NULL, NULL, '2025-10-27 12:46:36', '2025-10-27 12:51:29'),
(2, 'Super Admin', 'micasony@gmail.com', '$2y$12$pC7RyZjygKofOxiNfejir.y1ah9lDuzwO5baa7Ik3g/CEPzdueSni', 'admin', NULL, NULL, '2025-10-27 12:50:27', '2025-10-28 06:53:00'),
(3, 'roznamcha', 'test@roznamcha.com', '$2y$12$9Jcx7xMou36O9lgcC/b3w.xPIplAUpp8XgvawpwTQL/nAzsOjbZbO', 'user', NULL, NULL, '2025-10-27 12:55:59', '2025-10-27 12:55:59'),
(4, 'sarim', 'sarimnadeem@gmail.com', '$2y$12$/OzliHhnlqbKtnOKyfXXje4xDYs6WxRB8DRsyaQ2r/uhuqiW7UzKK', 'user', NULL, NULL, '2025-11-09 03:21:34', '2025-11-09 03:21:34'),
(6, 'mohain', 'mohisnrazaac@gmail.com', '$2y$12$AC.Ho4dbVAZhUd7CfWLGneW0rg0Q0.IcZNYtjRtP/znLAO/FOL0t2', 'user', NULL, NULL, '2025-12-17 01:45:47', '2025-12-17 01:45:47');

-- --------------------------------------------------------

--
-- Table structure for table `user_settings`
--

CREATE TABLE `user_settings` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `key` varchar(255) NOT NULL,
  `value` text DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `user_settings`
--

INSERT INTO `user_settings` (`id`, `user_id`, `key`, `value`, `created_at`, `updated_at`) VALUES
(1, 1, 'currency', 'PKR', '2025-10-27 12:51:29', '2025-10-27 12:51:29'),
(2, 1, 'language', 'ur', '2025-10-27 12:51:29', '2025-10-27 12:51:29');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `announcements`
--
ALTER TABLE `announcements`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `blog_categories`
--
ALTER TABLE `blog_categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `blog_categories_slug_unique` (`slug`);

--
-- Indexes for table `blog_category_post`
--
ALTER TABLE `blog_category_post`
  ADD UNIQUE KEY `blog_category_post_blog_post_id_blog_category_id_unique` (`blog_post_id`,`blog_category_id`),
  ADD KEY `blog_category_post_blog_category_id_foreign` (`blog_category_id`);

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
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `categories_name_unique` (`name`);

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`),
  ADD KEY `events_user_id_foreign` (`user_id`),
  ADD KEY `events_session_id_index` (`session_id`),
  ADD KEY `events_name_index` (`name`);

--
-- Indexes for table `expenses`
--
ALTER TABLE `expenses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `expenses_user_id_foreign` (`user_id`),
  ADD KEY `expenses_category_id_foreign` (`category_id`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `households`
--
ALTER TABLE `households`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `households_slug_unique` (`slug`),
  ADD KEY `households_owner_id_foreign` (`owner_id`);

--
-- Indexes for table `household_user`
--
ALTER TABLE `household_user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `household_user_household_id_user_id_unique` (`household_id`,`user_id`),
  ADD KEY `household_user_user_id_foreign` (`user_id`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `kharcha_entries`
--
ALTER TABLE `kharcha_entries`
  ADD PRIMARY KEY (`id`),
  ADD KEY `kharcha_entries_user_id_foreign` (`user_id`),
  ADD KEY `kharcha_entries_category_id_foreign` (`category_id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `ration_entries`
--
ALTER TABLE `ration_entries`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ration_entries_user_id_foreign` (`user_id`);

--
-- Indexes for table `ration_history`
--
ALTER TABLE `ration_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ration_history_ration_item_id_foreign` (`ration_item_id`);

--
-- Indexes for table `ration_items`
--
ALTER TABLE `ration_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ration_items_user_id_foreign` (`user_id`);

--
-- Indexes for table `ration_prices`
--
ALTER TABLE `ration_prices`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ration_prices_ration_item_id_foreign` (`ration_item_id`),
  ADD KEY `ration_prices_household_id_foreign` (`household_id`);

--
-- Indexes for table `reminders`
--
ALTER TABLE `reminders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `reminders_user_id_foreign` (`user_id`),
  ADD KEY `reminders_household_id_foreign` (`household_id`);

--
-- Indexes for table `reports_cache`
--
ALTER TABLE `reports_cache`
  ADD PRIMARY KEY (`id`),
  ADD KEY `reports_cache_user_id_foreign` (`user_id`);

--
-- Indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `roles_slug_unique` (`slug`);

--
-- Indexes for table `role_user`
--
ALTER TABLE `role_user`
  ADD PRIMARY KEY (`user_id`,`role_id`),
  ADD KEY `role_user_role_id_foreign` (`role_id`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- Indexes for table `user_settings`
--
ALTER TABLE `user_settings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_settings_user_id_foreign` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `announcements`
--
ALTER TABLE `announcements`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `blog_categories`
--
ALTER TABLE `blog_categories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `blog_posts`
--
ALTER TABLE `blog_posts`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `expenses`
--
ALTER TABLE `expenses`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `households`
--
ALTER TABLE `households`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `household_user`
--
ALTER TABLE `household_user`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `kharcha_entries`
--
ALTER TABLE `kharcha_entries`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `ration_entries`
--
ALTER TABLE `ration_entries`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `ration_history`
--
ALTER TABLE `ration_history`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `ration_items`
--
ALTER TABLE `ration_items`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `ration_prices`
--
ALTER TABLE `ration_prices`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `reminders`
--
ALTER TABLE `reminders`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `reports_cache`
--
ALTER TABLE `reports_cache`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `user_settings`
--
ALTER TABLE `user_settings`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `blog_category_post`
--
ALTER TABLE `blog_category_post`
  ADD CONSTRAINT `blog_category_post_blog_category_id_foreign` FOREIGN KEY (`blog_category_id`) REFERENCES `blog_categories` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `blog_category_post_blog_post_id_foreign` FOREIGN KEY (`blog_post_id`) REFERENCES `blog_posts` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `blog_posts`
--
ALTER TABLE `blog_posts`
  ADD CONSTRAINT `blog_posts_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `blog_posts_updated_by_foreign` FOREIGN KEY (`updated_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `events`
--
ALTER TABLE `events`
  ADD CONSTRAINT `events_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `expenses`
--
ALTER TABLE `expenses`
  ADD CONSTRAINT `expenses_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `expenses_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `households`
--
ALTER TABLE `households`
  ADD CONSTRAINT `households_owner_id_foreign` FOREIGN KEY (`owner_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `household_user`
--
ALTER TABLE `household_user`
  ADD CONSTRAINT `household_user_household_id_foreign` FOREIGN KEY (`household_id`) REFERENCES `households` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `household_user_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `kharcha_entries`
--
ALTER TABLE `kharcha_entries`
  ADD CONSTRAINT `kharcha_entries_category_id_foreign` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `kharcha_entries_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `ration_entries`
--
ALTER TABLE `ration_entries`
  ADD CONSTRAINT `ration_entries_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `ration_history`
--
ALTER TABLE `ration_history`
  ADD CONSTRAINT `ration_history_ration_item_id_foreign` FOREIGN KEY (`ration_item_id`) REFERENCES `ration_items` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `ration_items`
--
ALTER TABLE `ration_items`
  ADD CONSTRAINT `ration_items_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `ration_prices`
--
ALTER TABLE `ration_prices`
  ADD CONSTRAINT `ration_prices_household_id_foreign` FOREIGN KEY (`household_id`) REFERENCES `households` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `ration_prices_ration_item_id_foreign` FOREIGN KEY (`ration_item_id`) REFERENCES `ration_items` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `reminders`
--
ALTER TABLE `reminders`
  ADD CONSTRAINT `reminders_household_id_foreign` FOREIGN KEY (`household_id`) REFERENCES `households` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `reminders_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `reports_cache`
--
ALTER TABLE `reports_cache`
  ADD CONSTRAINT `reports_cache_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `role_user`
--
ALTER TABLE `role_user`
  ADD CONSTRAINT `role_user_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `role_user_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_settings`
--
ALTER TABLE `user_settings`
  ADD CONSTRAINT `user_settings_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
