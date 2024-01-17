// Database
const connection = require('../utility/database.js');

module.exports = class Product{

    constructor(name, price, imageUrl, description, categoryid){
        this.name = name;
        this.price = price;
        this.imageUrl = imageUrl;
        this.description = description;
        this.categoryId = categoryid;
    }

    saveProduct(){
        return connection.execute('INSERT INTO products (name, price, imageUrl, description) VALUES (?, ?, ?, ?)', [this.name, this.price, this.imageUrl, this.description]);
    }

    static getAll(){
        return connection.execute('SELECT * FROM products p');
    }

    static getById(id){
        return connection.execute('SELECT * FROM products p WHERE p.id =?',[id]);
    }

    static getProductsByCategoryId(categoryid){
    }

    static Update(product){
        return connection.execute('UPDATE products p SET p.name=?, p.price=?, p.imageUrl=?, p.description=? WHERE p.id=?', [product.name, product.price, product.imageUrl, product.description, product.id]);
    }

    static DeleteById(id){
    }
}