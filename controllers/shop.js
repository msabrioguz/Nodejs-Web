const Category = require('../models/category.js');
const Product = require('../models/product.js');
const Order = require('../models/order.js');

exports.getIndex = (req, res, next) => {
    // console.log(req.cookies);
    // console.log(req.cookies['isAuthenticated']);
    //console.log(req.session.isAuthenticated);
    Product.find()
    .then(products => {
       Category.find()
       .then(categories => {
            res.render('shop/index', {
                title: 'Shopping', 
                products: products,
                categories: categories,
                path: '/'
            });
       })
       .catch(error => {
        next(error);
        })
    })
    .catch(error => {
        next(error);
    })
    
};

exports.getProducts = (req, res, next) => {
    Product
    .find()
    .then(products => {
        Category.find()
        .then(categories => {
            res.render('shop/products', {
                title: 'Products', 
                products: products,
                categories: categories,
                path: '/products'
            });
        })
    })
    .catch(error => {
        next(error);
    })
};

exports.getProductsByCategoryId = (req, res, next) => {
    const categoryId = req.params.categoryid;
    const model = [];
    Category.find()
    .then(categories=>{
        model.categories = categories;
        return Product.find({
            categories: categoryId
        });
    })
    .then(products => {
        res.render('shop/products', 
            {
                title: 'Products', 
                products: products,
                categories: model.categories,
                selectedCategory: categoryId,
                path: '/categories'
            });
        })
    .catch((error)=>{
        next(error);
    });
};

exports.getProduct = (req, res, next) => {

    const productId = req.params.productid;

    Product
    // .findById(req.params.productid)
    .findOne({_id: req.params.productid})
    .then(product => {
        res.render('shop/product-detail', {
            title:product.name,
            product: product,
            path: '/products'
        });
    })
    .catch(error => {
        next(error);
    })

    
};

exports.getCart = (req, res, next) => {

    req.user
    .populate('cart.items.productId')
    .then(user => {
            res.render('shop/cart', {
                title: 'Cart', 
                path: '/cart',
                products: user.cart.items
        })
    })
    .catch(error => {
        next(error);
    });
};

exports.postCart = (req, res, next) => {

    const productId = req.body.productId;
    
    Product.findById(productId)
    .then(product => {
        return req.user.addToCart(product);
    })
    .then(() => {
        res.redirect('/cart');
    })
    .catch(error => {
        next(error);
    })
};

exports.postCartItemDelete = (req, res, next) => {
    const productid = req.body.productid;

    req.user.deleteCartItem(productid)
    .then(result => {
        res.redirect('/cart');
    })
    .catch(error => {
        next(error);
    })

};

exports.getOrders = (req, res, next) => {   

    Order.find({'user.userId': req.user._id})
    .then(orders => {
        
        res.render('shop/orders', {
            title: 'Orders', 
            path: '/orders',
            orders: orders
        });
    })
    .catch(error => {
        next(error);
    });

    
};

exports.postOrder = (req, res, next) => {
    req.user
    .populate('cart.items.productId')
    .then(user => {
        const order = new Order({
            user:{
                userId: req.user._id,
                name: req.user.name,
                email: req.user.email
            },
            items: user.cart.items.map(p => {
                    return {
                        product:{
                            _id: p.productId._id,
                            name: p.productId.name,
                            price: p.productId.price,
                            imageUrl: p.productId.imageUrl
                        },
                        quantity: p.quantity
                    };
                })
        });
        return order.save();
    })
    .then(()=>{
        return req.user.clearCart();
    })
    .then(() =>{
        res.redirect('/orders');
    })
    .catch(error => {
        next(error);
    })
};
