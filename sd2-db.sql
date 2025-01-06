-- Granting privileges
GRANT ALL PRIVILEGES ON *.* TO 'root'@'%' WITH GRANT OPTION;

-- Setting the password
ALTER USER 'root'@'%' IDENTIFIED BY 'password';

-- Refresh privileges
FLUSH PRIVILEGES;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- Create producers table 
CREATE TABLE `producers` (
    `producer_id` INT NOT NULL AUTO_INCREMENT,
    `producer_name` TEXT NOT NULL,
    `details` TEXT NULL,
    `password` CHAR(60) NOT NULL,
    PRIMARY KEY (`producer_id`)
);

ALTER TABLE `producers` AUTO_INCREMENT = 3;

INSERT INTO `producers` (`producer_id`, `producer_name`, `details`,`password`) VALUES

("7701","Amul","Amul is one of India's largest dairy product manufacturers, founded in 1946 and managed by the Gujarat Co-operative Milk Marketing Federation (GCMMF).\nIt is known for its wide range of dairy products, including milk, butter, cheese, ice cream, and yogurt.\nAmul's brand has become synonymous with quality and innovation in the dairy industry, and it has a significant presence both domestically and internationally.","amul1234"),

("7702","Healthy Dairy","Healthy Dairy is a prominent dairy brand in India, known for providing a range of high-quality dairy products. The company focuses on delivering fresh and nutritious products like milk, curd, butter, and paneer to consumers. Healthy Dairy places a strong emphasis on quality control and hygienic production processes to ensure the health and safety of its products.","healthy1234"),

("7703","Organic Oils Ltd.","Organic Oils is a company that specializes in producing and distributing a wide range of organic oils, such as coconut oil, olive oil, mustard oil, and sesame oil. The brand is dedicated to offering chemical-free, natural products that are sourced from organic farms and processed with minimal interference to preserve their nutritional value. ","organic1234"),

("7704","Natural Dairy","Natural Dairy is a company that specializes in producing high-quality dairy products made from natural, farm-fresh ingredients. The brand focuses on offering a wide range of dairy items, such as milk, curd, paneer, and butter, which are free from artificial additives and preservatives.","natural1234"),

("7705","Dairy Farmers Co.","Dairy Farmers is an Australian dairy cooperative that supplies a wide variety of dairy products, including milk, cheese, butter, and yogurt. Established in 1900, it is one of the largest dairy cooperatives in Australia, with a network of thousands of farmer members who supply high-quality milk. ","dairy1234"),

("7706","Tea Farmers Union","The Tea Farmers Union is an organization that represents and supports tea growers and farmers, focusing on advocating for their rights, improving their livelihoods, and promoting sustainable farming practices. The union aims to address challenges faced by tea farmers, such as fluctuating market prices, unfair trade practices, and the impact of climate change.","tea1234"),

("7707","Sun Gold Oil","KOF (Karnataka Oil Federation) is a cooperative federation based in the Indian state of Karnataka, focused on the production and marketing of edible oils. The federation works with a network of oil mills, farmers, and local producers to supply a variety of oils, including groundnut oil, sunflower oil, and other vegetable oils.","sun1234"); 

-- Create products table
CREATE TABLE `products` (
  `id` int NOT NULL,
  `name` varchar(512) NOT NULL,
  `producer` VARCHAR(255) NOT NULL,
  `image` VARCHAR(255) NOT NULL,
  `price` INT(3) NOT NULL,
  `details` TEXT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

ALTER TABLE products MODIFY id INT AUTO_INCREMENT;

INSERT INTO `products` (`name`, `producer`, `image`,`price`,`details`) VALUES
  ('Milk', 'Dairy Farmers Co.', 'images/milk.jpg','12','Dairy Farmers Co. offers premium-quality milk sourced directly from trusted local dairy farmers, ensuring freshness and purity. Available in a variety of options, including whole, skimmed, and organic milk, it falls under the Dairy Products category. The milk is packaged in eco-friendly cartons and bottles designed to preserve its natural taste and nutritional value. Ideal for everyday consumption, it is also perfect for cooking, making desserts, and pairing with cereals or beverages. Dairy Farmers Co. prioritizes both quality and sustainability in every step of the production process.'),
  ('Yogurt', 'Healthy Dairy', 'images/yogurt.jpg','18','Healthy Dairy Yogurt is a creamy, nutritious yogurt made from high-quality milk, offering a rich source of probiotics, calcium, and vitamins. It comes in various flavors, including natural, fruit-infused, and low-fat options, catering to a variety of tastes and dietary needs. Packaged in convenient, eco-friendly containers, the yogurt maintains freshness and supports a healthy gut. Ideal for breakfast, snacks, or as a topping for smoothies and desserts, it is a versatile addition to a balanced diet. Healthy Dairy Yogurt promotes digestive health while providing a delicious and wholesome snack.'),
  ('Sunflower Oil', 'Organic Oils Ltd.', 'images/sunflower_oil.jpg','24','Organic Oils Ltd Sunflower Oil is a high-quality, cold-pressed oil made from organically grown sunflowers, ensuring purity and natural goodness. Known for its light flavor and high smoke point, it is perfect for frying, sautéing, and baking. The oil is rich in essential fatty acids, vitamin E, and antioxidants, making it a healthy addition to any kitchen. Packaged in environmentally friendly containers, it preserves freshness while being gentle on the planet. Organic Oils Limited Sunflower Oil is a versatile and health-conscious choice for cooking and salad dressings.'),
  ('Buttermilk', 'Natural Dairy', 'images/buttermilk.jpg','6','Natural Dairy Buttermilk is a refreshing, low-fat beverage made from fresh, high-quality milk and cultured naturally to enhance its smooth, tangy flavor. Rich in probiotics, calcium, and vitamins, it supports digestive health while providing a good source of hydration. Ideal for drinking on its own or as a base for smoothies, sauces, and baking recipes, it adds a unique, creamy texture. Packaged in eco-friendly bottles, it ensures freshness while being a sustainable choice. Natural Dairy Buttermilk offers a wholesome, nutritious alternative for those seeking a healthy, dairy-based option.'),
  ('Tea Special Milk', 'Amul', 'images/tea_special_milk.jpg','24','Amul Tea Special Milk is a premium dairy product specially crafted to enhance the taste of your tea. Made from high-quality, fresh milk, it is enriched with a perfect blend of creaminess and smoothness, ensuring a rich and flavorful cup of tea every time. With its ideal consistency and taste, it dissolves easily and complements tea leaves, offering a balanced and indulgent experience. Available in convenient, fresh packaging, it preserves the milk’s natural goodness. Amul Tea Special Milk is the perfect choice for tea lovers looking for a consistently delicious and creamy tea preparation.'),
  ('GroundNut Oil', 'Tea Farmers Union', 'images/groundnut.jpg','12','Tea Farmers Union Groundnut Oil is a high-quality, cold-pressed oil made from carefully selected groundnuts, offering a rich, nutty flavor and numerous health benefits. It is rich in unsaturated fats, antioxidants, and vitamin E, making it a heart-healthy choice for cooking and frying. Known for its high smoke point, this oil is ideal for deep frying, sautéing, and making dressings. Packaged in eco-friendly containers, it preserves the natural freshness and quality of oil. Tea Farmers Union Groundnut Oil provides a nutritious, flavorful addition to various dishes, promoting both taste and wellness.'),
  ('Coconut Oil', 'Tea Farmers Union', 'images/coconut.jpg','14','Tea Farmers Union Coconut Oil is a premium, cold-pressed oil sourced from fresh, organic coconuts, ensuring purity and rich flavor. Known for its natural antibacterial and moisturizing properties, it is perfect for cooking, baking, and as a healthy alternative to other oils. The oil is also highly versatile, ideal for skincare and hair care routines due to its nourishing qualities. Packaged in eco-friendly containers, it retains its natural goodness while being gentle on the environment. Tea Farmers Union Coconut Oil offers a wholesome, multipurpose solution for both culinary and personal care needs.'),
  ('Shakti Milk', 'Amul', 'images/shakti.jpg','5','Amul Shakti Milk is a nutritious and high-quality milk product, specially designed to meet the dietary needs of individuals looking for extra energy and strength. Sourced from healthy, well-maintained dairy cattle, it is enriched with essential vitamins and minerals, including calcium, vitamin D, and proteins. The milk is processed to ensure optimum freshness and purity, making it a reliable choice for daily consumption. Amul Shakti Milk is ideal for growing children, athletes, and anyone in need of an energy boost. Packaged in convenient, fresh containers, it guarantees quality and nourishment in every sip.'),
  ('Gold Milk', 'Amul', 'images/gold.jpg','8','Amul Gold Milk is a premium full-cream milk known for its rich taste and high nutritional value. Sourced from healthy cows and processed using advanced techniques to maintain its natural goodness, it is a perfect blend of creaminess and freshness. This milk is packed with essential nutrients like calcium, protein, and vitamins, supporting overall health and well-being. Ideal for daily consumption, Amul Gold Milk is perfect for beverages, cooking, and making dairy-based treats. Available in fresh, convenient packaging, it guarantees a high-quality, wholesome product for your family.'),
  ('Butter', 'Amul', 'images/butter.jpg','28','Amul Butter is a popular and creamy butter made from high-quality, fresh milk, offering a rich, smooth texture and authentic flavor. Known for its consistent quality, it adds a delightful taste to bread, parathas, and a variety of dishes, both savory and sweet. Rich in healthy fats and essential vitamins, Amul Butter is a great addition to any meal, enhancing flavor while providing nutritional benefits. Packaged in easy-to-store, hygienic wrapping, it preserves freshness for longer periods. A trusted brand, Amul Butter is a household favorite for its taste, quality, and versatility in the kitchen.'),
  ('Sun Gold Oil', 'KOF', 'images/sungold.jpg','20','KOF SunGold Oil is a high-quality, refined sunflower oil known for its light flavor and health benefits. Rich in unsaturated fats, it is an excellent source of vitamin E and omega-6 fatty acids, promoting heart health and overall well-being. With a high smoke point, it is perfect for frying, sautéing, and baking, ensuring crisp and delicious results. The oil is carefully processed to retain its natural purity and freshness, making it a trusted choice for everyday cooking. KOF SunGold Oil is packaged in eco-friendly containers, preserving quality while being environmentally conscious.'),
  ('Masti Dahi', 'Amul', 'images/masti.jpg','40','Amul Masti Dahi is a creamy, delicious yogurt made from high-quality, fresh milk, offering a smooth texture and a perfect balance of tanginess. It is rich in probiotics, calcium, and essential vitamins, supporting digestive health and overall well-being. Ideal for consumption as a snack, dessert, or accompaniment to meals, Amul Masti Dahi adds a refreshing, nutritious touch to your diet. The yogurt is carefully processed and packaged to maintain its freshness and natural goodness. With its great taste and health benefits, Amul Masti Dahi is a popular choice for families seeking a healthy and tasty option.');


ALTER TABLE products AUTO_INCREMENT = 6;  -- or the next available number

ALTER TABLE `products`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

CREATE TABLE IF NOT EXISTS Orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    buyer_full_name VARCHAR(255),
    product_id VARCHAR(255),
    product_name VARCHAR(255),
    quantity INT,
    total_price DECIMAL(10, 2),
    contact VARCHAR(15),
    address TEXT,
    order_datetime DATETIME
);
