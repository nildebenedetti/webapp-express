CREATE TABLE `categories`(
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `marketing_description` TEXT NOT NULL,
    `short_description` VARCHAR(255) NOT NULL,
    `category_type` ENUM('theme', 'product_type') NOT NULL DEFAULT 'product_type' COMMENT 'select the category type between product_type (e.g. popsicle, ice cream, milkshakes) or theme (exorcism, ghosts)'
);
ALTER TABLE
    `categories` COMMENT = 'The website will have 2 navigation journeys, 1 by product type and 1 by theme';
CREATE TABLE `products`(
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(150) NOT NULL,
    `short_description` VARCHAR(255) NOT NULL,
    `marketing_description` TEXT NOT NULL,
    `price` DECIMAL(4, 2) NOT NULL,
    `ingredients` TEXT NOT NULL,
    `allergens` TEXT NOT NULL,
    `availability` BOOLEAN NOT NULL,
    `image_url` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP NOT NULL,
    `updated_at` TIMESTAMP NOT NULL
        ON UPDATE CURRENT_TIMESTAMP
);
CREATE TABLE `category_product`(
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `category_id` BIGINT NOT NULL,
    `product_id` BIGINT NOT NULL
);
ALTER TABLE
    `category_product` ADD INDEX `category_product_category_id_product_id_index`(`category_id`, `product_id`);
CREATE TABLE `reviews`(
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `title` VARCHAR(170) NOT NULL,
    `body` TEXT NOT NULL,
    `start_rating` TINYINT NOT NULL COMMENT 'select value from 1 to 5',
    `author_name` VARCHAR(255) NOT NULL,
    `submission_date` DATE NOT NULL,
    `find_it_useful` INT NULL,
    `product_id` BIGINT NULL
);
ALTER TABLE
    `category_product` ADD CONSTRAINT `category_product_category_id_foreign` FOREIGN KEY(`category_id`) REFERENCES `categories`(`id`)
    ON DELETE CASCADE;
ALTER TABLE
    `category_product` ADD CONSTRAINT `category_product_product_id_foreign` FOREIGN KEY(`product_id`) REFERENCES `products`(`id`)
    ON DELETE CASCADE;
ALTER TABLE
    `reviews` ADD CONSTRAINT `reviews_product_id_foreign` FOREIGN KEY(`product_id`) REFERENCES `products`(`id`)
        ON DELETE SET NULL;