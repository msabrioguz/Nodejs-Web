const Product = require('../models/product.js');
const Category = require('../models/category.js');
const category = require('../models/category.js');
// const User = require('../models/user.js');

exports.getProducts = (req, res, next) => {
    Product
            .find({userId: req.user._id})
            .populate('userId', 'name -_id')
            .select('name price imageUrl userId')
            .then(products => {
                res.render('./admin/products.pug',{
                    title: 'Admin Product List',
                    products: products,
                    path: '/admin/products',
                    action: req.query.action,
                    isAuthenticated: req.session.isAuthenticated
                });
            })
            .catch((error) => {
                console.log(error);
            });
};

exports.getAddProduct = (req, res, next) => {
    Category.find()
    .then(categories => {
        res.render('./admin/add-product.pug', {
            title: 'Ürün Ekle',
            path: '/admin/add-product',
            categories: categories,
            isAuthenticated: req.session.isAuthenticated
        });
    })
    .catch(error => console.log(error))
    
};

exports.postAddProduct = (req, res, next) => {
    // Database Kayıt

    const name = req.body.name;
    const price = req.body.price;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;
    const categories = req.body.categoryids;
    
    const product = new Product({
        name: name,
        price: price,
        imageUrl: imageUrl,
        description: description,
        userId: req.user,
        categories: categories
    });
    product.save()
    .then(result => {
        res.redirect('/admin/products?action=create');
    })
    .catch((error) => {
        console.log(error);
    });
};

exports.getEditProduct = (req, res, next) => {
    Product.findOne({_id: req.params.productid, userId: req.user._id})
    .then(product => {
        if(!product){
            return res.redirect('/');
        }
        Category.find()
        .then(categories => {
            
            categories = categories.map(category => {
                if(product.categories){
                    product.categories.find(item => {
                        if(item.toString() === category._id.toString()){
                            category.selected = true;
                        }
                    })
                }

                return category;
            })

            res.render('./admin/edit-product.pug', {
                title: 'Ürün Düzenle',
                path: '/admin/edit-product',
                product: product,
                categories: categories,
                isAuthenticated: req.session.isAuthenticated
            });    
        })
        .catch(error => console.log(error))
    })
    .catch(error => {
        console.log(error);
    });    
};

exports.postEditProduct = (req, res, next) => {

    // query first
    // update first

    const id = req.body.id;
    const name = req.body.name;
    const price = req.body.price;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;
    const categoryIds = req.body.categoryids;

    Product.updateOne({_id: id, userId: req.user._id}, {
        $set:{
            name: name,
            price: price,
            imageUrl: imageUrl,
            description: description,
            categories: categoryIds
        }
    })
    .then(() => {
        res.redirect('/admin/products?action=edit')
    })
    .catch(error => console.log(error));
};

exports.adminIndex = (req, res, next) => {
    res.render('./admin/index.pug', {
        title: 'Admin Anasayfa',
        path: '/admin',
        isAuthenticated: req.session.isAuthenticated
    });
};

exports.postDeleteProduct = (req, res, next) => {
    const productId = req.body.productid;
    Product.deleteOne({_id: productId, userId: req.user._id})
    .then(() => {
        console.log('Product has been deleted.');
        res.redirect('/admin/products?action=delete');
    })
    .catch((error)=> {
        console.log(error);
    });
    
};

// Category
exports.getAddCategory = (req, res, next) => {
    res.render('./admin/add-category.pug', {
        title: 'Kategori Ekle',
        path: '/admin/add-category',
        isAuthenticated: req.session.isAuthenticated
        //categories: categories
    });      
};

exports.postAddCategory = (req, res, next) => {
    const name = req.body.name;
    const description = req.body.description;

    const category = new Category({
        name: name,
        description: description
    });

    category.save()
    .then(result => {
        res.redirect('/admin/categories?action=create');
    })
    .catch(error => {
        console.log(error);
    })
};

exports.getCategories = (req, res, next) => {
    Category.find()
    .then(categories => {
        res.render('./admin/categories.pug', {
            title: 'Kategoriler',
            path: '/admin/categories',
            categories: categories,
            action: req.query.action,
            isAuthenticated: req.session.isAuthenticated
        });      
    })
    .catch(error => { console.log(error) })
};

exports.getEditCategory = (req, res, next) => {
    Category.findById(req.params.categoryid)
    .then(category => {
        res.render('./admin/edit-category.pug', {
            title: 'Kategori Düzenle',
            path: '/admin/add-category',
            category: category,
            isAuthenticated: req.session.isAuthenticated
        });      
    })
    .catch(error => {
        console.log(error);
    })
};

exports.postEditCategory = (req, res, next) => {
    const id = req.body.id;
    const name = req.body.name;
    const description = req.body.description;

    Category.findById(id)
    .then(category => {
        category.name = name;
        category.description = description;
        return category.save();
    })
    .then(result => {
        //console.log(result);
        res.redirect('/admin/categories?action=edit');
    })
    .catch(error => {
        console.log(error);
    })
};

exports.postDeleteCategory = (req, res, next) => {
    const categoryId = req.body.categoryid;
    Category.deleteOne({_id: categoryId})
    .then((result) => {
        if(result.deletedCount===0){
            return res.redirect('/');
        }
        console.log('Category has been deleted.');
        res.redirect('/admin/categories?action=delete');
    })
    .catch((error)=> {
        console.log(error);
    });
    
};