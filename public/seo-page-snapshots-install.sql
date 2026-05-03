-- Purpose: Create the SEO snapshot, city fuel, and fuel audit tables manually through phpMyAdmin or similar hosting panels. Date: 2026-03-29. Author: Mohsin.

CREATE TABLE IF NOT EXISTS `seo_page_snapshots` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `page_type` VARCHAR(50) NOT NULL,
    `page_key` VARCHAR(100) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `value_1` DECIMAL(12, 2) NULL,
    `value_2` DECIMAL(12, 2) NULL,
    `value_3` DECIMAL(12, 2) NULL,
    `summary_text` TEXT NULL,
    `comparison_text` TEXT NULL,
    `effective_date` DATE NULL,
    `source_label` VARCHAR(255) NULL,
    `extra_json` JSON NULL,
    `created_at` TIMESTAMP NULL DEFAULT NULL,
    `updated_at` TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (`id`),
    INDEX `seo_page_snapshots_page_type_page_key_index` (`page_type`, `page_key`),
    INDEX `seo_page_snapshots_lookup_idx` (`page_type`, `page_key`, `effective_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `cities` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP NULL DEFAULT NULL,
    `updated_at` TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (`id`),
    UNIQUE KEY `cities_slug_unique` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO `cities` (`name`, `slug`, `created_at`, `updated_at`) VALUES
    ('Karachi', 'karachi', NOW(), NOW()),
    ('Lahore', 'lahore', NOW(), NOW()),
    ('Islamabad', 'islamabad', NOW(), NOW()),
    ('Peshawar', 'peshawar', NOW(), NOW()),
    ('Quetta', 'quetta', NOW(), NOW()),
    ('Multan', 'multan', NOW(), NOW()),
    ('Faisalabad', 'faisalabad', NOW(), NOW()),
    ('Rawalpindi', 'rawalpindi', NOW(), NOW()),
    ('Hyderabad', 'hyderabad', NOW(), NOW()),
    ('Gilgit', 'gilgit', NOW(), NOW()),
    ('Gujranwala', 'gujranwala', NOW(), NOW()),
    ('Sialkot', 'sialkot', NOW(), NOW()),
    ('Sukkur', 'sukkur', NOW(), NOW()),
    ('Bahawalpur', 'bahawalpur', NOW(), NOW()),
    ('Abbottabad', 'abbottabad', NOW(), NOW())
ON DUPLICATE KEY UPDATE
    `name` = VALUES(`name`),
    `updated_at` = VALUES(`updated_at`);

CREATE TABLE IF NOT EXISTS `petrol_prices` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `city_id` BIGINT UNSIGNED NOT NULL,
    `fuel_type` VARCHAR(50) NOT NULL,
    `price_per_litre` DECIMAL(12, 2) NOT NULL,
    `effective_date` DATE NOT NULL,
    `source_url` VARCHAR(500) NOT NULL,
    `created_at` TIMESTAMP NULL DEFAULT NULL,
    `updated_at` TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `petrol_prices_fuel_type_effective_date_index` (`fuel_type`, `effective_date`),
    UNIQUE KEY `petrol_prices_unique_record` (`city_id`, `fuel_type`, `effective_date`, `source_url`),
    CONSTRAINT `petrol_prices_city_id_foreign` FOREIGN KEY (`city_id`) REFERENCES `cities` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `price_audit_logs` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `source` VARCHAR(100) NOT NULL,
    `fuel_type` VARCHAR(100) NOT NULL,
    `scraped_price` DECIMAL(12, 2) NULL,
    `stored_price` DECIMAL(12, 2) NULL,
    `difference` DECIMAL(12, 2) NULL,
    `checked_at` TIMESTAMP NOT NULL,
    `created_at` TIMESTAMP NULL DEFAULT NULL,
    `updated_at` TIMESTAMP NULL DEFAULT NULL,
    PRIMARY KEY (`id`),
    KEY `price_audit_logs_source_checked_at_index` (`source`, `checked_at`),
    KEY `price_audit_logs_fuel_type_checked_at_index` (`fuel_type`, `checked_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
