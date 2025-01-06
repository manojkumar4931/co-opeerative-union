// Import express.js
const express = require("express");

// Create express app
var app = express();

const session = require('express-session');

// Use express-session middleware
app.use(session({
    secret: 'your-secret-key', // This should be a random secret key
    resave: false,  // Don't resave session if not modified
    saveUninitialized: false, // Don't save uninitialized sessions
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 // Session expires after 1 day
    }
}));

app.set('view engine', 'pug');
app.set('views', './app/views');

app.use(express.urlencoded({ extended: true })); // This is crucial!
app.use(express.json()); // if you are using JSON in your requests

// Add static files location
app.use(express.static("static", {
    setHeaders: (res, path) => {
        console.log(`Serving static file: ${path}`);
    }
}));

// Get the functions in the db.js file to use
const db = require('./services/db');

const multer = require('multer');
const path = require('path');

// Set up storage configuration for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'static/images'); // Save images in the 'app/images' directory
  },
  filename: function (req, file, cb) {
    // Save the file with its original name or add a timestamp to avoid name conflicts
    cb(null, Date.now() + path.extname(file.originalname)); 
  }
});

const upload = multer({ storage: storage });

  app.get("/", function(req, res) {
    var sql = 'SELECT * FROM products';
    db.query(sql).then(results => {
        // Send the data to the Pug template
        res.render("index", { data: results });
    }).catch(err => {
        console.error(err);
        res.status(500).send("Error fetching products.");
    });

    app.get('/product-single/:id', (req, res) => {
        const productId = req.params.id;
        const sql = 'SELECT * FROM products WHERE id = ?';
    
        db.query(sql, [productId])
            .then(result => {
                if (result.length > 0) {
                    const product = result[0];
                    console.log("Product from database:", product); // Log the raw product data
                    console.log("Product details (before split):", product.details); // Log details before splitting

                    // Process details (optional - for debugging)
                    const detailsArray = (product.details || "").split('\n').map(s => s.trim()).filter(Boolean);
                    console.log("Product details (after split):", detailsArray); // Log details after splitting

                    res.render('product-single', { product }); // Pass the product object
                } else {
                    res.status(404).render('error', { message: "Product not found." });
                }
            })
            .catch(err => {
                console.error("Error fetching product details:", err.message);
                res.status(500).render('error', { message: "Internal server error." });
            });
    });

    app.get('/producers/:producerName', (req, res) => {
        const producerName = decodeURIComponent(req.params.producerName); // Decode the URL
        console.log("Decoded Producer Name:", producerName); // Log producerName to debug
        
        // Fetch the producer details
        const sqlForProducer = 'SELECT producer_id, producer_name, details FROM producers WHERE producer_name = ?';
        
        db.query(sqlForProducer, [producerName])
            .then(result => {
                console.log("Database Query Result for Producer:", result); // Log producer query result to debug
                
                if (result.length > 0) {
                    const producer = result[0];  // The first producer object from the result
                    
                    // Fetch all products from the same producer
                    const sqlForProducts = 'SELECT * FROM products WHERE producer = ?';
                    db.query(sqlForProducts, [producerName])
                        .then(productsResult => {
                            console.log("Database Query Result for Products:", productsResult); // Log products query result to debug
                            
                            // Render the producer details page with producer info and products list
                            res.render('producerDetails', { producer, products: productsResult });
                        })
                        .catch(err => {
                            console.error('Error fetching products:', err.message); // Log the error
                            res.status(500).render('error', { message: "Error fetching products." });
                        });
                } else {
                    res.status(404).render('error', { message: "Producer not found." });
                }
            })
            .catch(err => {
                console.error("Error Fetching Producer Details:", err.message); // Log the full error
                res.status(500).render('error', { message: "Internal server error." });
            });
    });

    app.get('/order/:productId', (req, res) => {
        const productId = req.params.productId;
        const sql = 'SELECT * FROM products WHERE id = ?';
    
        db.query(sql, [productId])
            .then(result => {
                if (result.length > 0) {
                    const product = result[0];
                    console.log("Product in /order/:productId route:", product); // Very important debug line
                    res.render('orderForm', { product });
                } else {
                    console.error("Product not found for ID:", productId);
                    res.status(404).send("Product not found.");
                }
            })
            .catch(err => {
                console.error("Error fetching product details:", err.message);
                res.status(500).send("Internal server error.");
            });
    });

    app.post('/confirm-order', async (req, res) => {
        try {
            // Log the request body to inspect incoming data
            console.log("Request Body:", req.body);
    
            const { product_id, product_name, quantity, totalPrice, buyer_first_name, buyer_last_name, contact, location } = req.body;
    
            // Log individual fields to ensure proper data
            console.log("product_id:", product_id);
            console.log("product_name:", product_name);
            console.log("quantity (before parseInt):", quantity);
            const parsedQuantity = parseInt(quantity, 10); // Ensure base 10 parsing
            console.log("quantity (after parseInt):", parsedQuantity);
    
            console.log("totalPrice (before parseFloat):", totalPrice);
            const parsedPrice = parseFloat(totalPrice.replace('£', '').trim()); // Sanitize the '£' symbol
            console.log("totalPrice (after parseFloat):", parsedPrice);
    
            console.log("buyer_first_name:", buyer_first_name);
            console.log("buyer_last_name:", buyer_last_name);
            console.log("contact:", contact);
            console.log("location:", location);
    
            // Ensure all required data is present
            if (!product_id || !product_name || !parsedQuantity || !parsedPrice || !buyer_first_name || !buyer_last_name || !contact || !location) {
                return res.status(400).send("Missing required fields");
            }
    
            const buyer_full_name = `${buyer_first_name} ${buyer_last_name}`;
    
            // Use parameterized query to prevent SQL injection
            const result = await db.query(
                'INSERT INTO Orders (product_id, product_name, quantity, total_price, buyer_full_name, contact, address, order_datetime) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())',
                [product_id, product_name, parsedQuantity, parsedPrice, buyer_full_name, contact, location]
            );
    
            console.log("Order saved to database successfully.", result); // Log the result
            res.redirect('/order-confirmed');
        } catch (error) {
            console.error("Error saving order:", error);
            res.status(500).send("Error saving order to database.");
        }
    });

    app.get('/order-confirmed', (req, res) => {
        res.render('order-confirmed'); // Renders the order-confirmed.pug file
    });


    // Render the login page
    app.get('/login', (req, res) => {
        if (req.session.producerId) {
            return res.redirect('/producer-dashboard'); // Redirect to dashboard if logged in
        }
        res.render('login');
    });

    app.post('/login', async (req, res) => {
        try {
            const { producerId, password } = req.body;
    
            // Basic validation
            if (!producerId || !password) {
                return res.status(400).send("Missing required fields: producerId and password");
            }
    
            // Query the database
            const sql = 'SELECT * FROM producers WHERE producer_id = ?';
            const rows = await db.query(sql, [producerId]);
    
            if (rows.length === 0 || rows[0].password !== password) {
                return res.status(401).send("Invalid producer ID or password");
            }
    
            const producer = rows[0]; // Get the first producer object
    
            // Set session for the logged-in producer
            req.session.producerId = producer.producer_id;
            req.session.producerName = producer.producer_name;
    
            // Redirect to the dashboard
            res.redirect(`/producer-dashboard/${producer.producer_id}?name=${encodeURIComponent(producer.producer_name)}`);
        } catch (error) {
            console.error("Error during login:", error.message);
            res.status(500).send("Internal server error during login.");
        }
    });
    
    

    


    app.get('/producer-dashboard/:id',isLoggedIn, async (req, res) => {
        res.setHeader('Cache-Control', 'no-store');

        if (!req.session.producerId) {
            return res.redirect('/login'); // Redirect to login if session is invalid
        }

        try {
            const producerId = req.params.id;
            const producerName = req.query.name;
    
            if (!producerName) {
                return res.status(400).send("Producer name is missing.");
            }
    
            // Assuming 'producer' is the correct column in 'products' table
            const sql = 'SELECT * FROM products WHERE producer = ?';
            const products = await db.query(sql, [producerName]);
    
            // Render the dashboard
            res.render('producer-dashboard', { producerId, producerName, products });
        } catch (error) {
            console.error("Error fetching producer products:", error.message);
            res.status(500).send("Error fetching producer products.");
        }
    });

    app.get('/productCheck/:id',isLoggedIn, (req, res) => {
        
        const productId = req.params.id;
        const sql = 'SELECT * FROM products WHERE id = ?';
    
        db.query(sql, [productId])
            .then(result => {
                if (result.length > 0) {
                    const product = result[0];
                    console.log("Product from database:", product); // Log the raw product data
                    console.log("Product details (before split):", product.details); // Log details before splitting

                    // Process details (optional - for debugging)
                    const detailsArray = (product.details || "").split('\n').map(s => s.trim()).filter(Boolean);
                    console.log("Product details (after split):", detailsArray); // Log details after splitting

                    res.render('productCheck', { product }); // Pass the product object
                } else {
                    res.status(404).render('error', { message: "Product not found." });
                }
            })
            .catch(err => {
                console.error("Error fetching product details:", err.message);
                res.status(500).render('error', { message: "Internal server error." });
            });
    });

    app.delete('/delete-product/:id',isLoggedIn, async (req, res) => {
        const productId = req.params.id;
        try {
          await db.query('DELETE FROM products WHERE id = ?', [productId]);
          console.log("Product added to the database");
          res.status(200).send('Product deleted successfully');
        } catch (error) {
          console.error('Error deleting product:', error);
          res.status(500).send('Failed to delete product');
        }
      });
      

    app.post("/add-product", upload.single("productImage"),isLoggedIn, async (req, res) => {
        const { productName, productPrice, productDetails, producerName, producerID } = req.body;
    
        // Check if file is uploaded
        if (!req.file) {
            return res.status(400).send("Product image is required.");
        }
    
        const productImagePath = `images/${req.file.filename}`; // Path for saving the image
    
        const query = `
            INSERT INTO products (name, producer, image, price, details)
            VALUES (?, ?, ?, ?, ?)
        `;
    
        try {
            await db.query(query, [
                productName,
                producerName,
                productImagePath,
                productPrice,
                productDetails
            ]);
            console.log("Product added to the database");
            res.redirect(`/producer-dashboard/${producerID}?name=${encodeURIComponent(producerName)}`);
        } catch (err) {
            console.error("Error adding product:", err);
            res.status(500).send("Error adding product to the database.");
        }
    });
    
    
    
    
    app.get('/logout', (req, res) => {
        // Destroy the session
        req.session.destroy((err) => {
            if (err) {
                console.error("Error destroying session:", err);
                return res.status(500).send("Error logging out.");
            }
    
            // Redirect to the homepage after logout
            res.redirect('/');
        });
    });
    

    app.use((req, res) => {
        console.error(`404 Error: Page not found for URL: ${req.originalUrl}`);
        res.status(404).render('error', { message: "Page not found." });
    });
    
    app.use((err, req, res, next) => {
        console.error("Unhandled Error:", err.message);
        res.status(500).render('error', { message: "Something went wrong." });
    });
    
    
    
    




    
    
    app.get('/test-db', (req, res) => {
        const sql = 'SELECT * FROM producers';
        db.query(sql)
            .then(result => res.json(result))
            .catch(err => {
                console.error("Database Connection Test Error:", err.message);
                res.status(500).send("Database connection failed.");
            });
    });

    app.get('/products', (req, res) => {
        const sql = 'SELECT * FROM products';
        db.query(sql)
            .then(results => {
                res.render('products', { products: results });
            })
            .catch(err => {
                console.error(err);
                res.status(500).send("Error fetching products.");
            });
    });

    function isLoggedIn(req, res, next) {
        if (req.session.producerId) {
            return next(); // If logged in, proceed to the next route
        } else {
            res.redirect('/login'); // If not logged in, redirect to login
        }
    }
    

});

// Start server on port 3000
app.listen(3000,function(){
    console.log(`Server running at http://127.0.0.1:3000/`);
});

