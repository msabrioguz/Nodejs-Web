const getDB = require('../utility/database').getDatabase;
const mongodb = require('mongodb');

class User{
    constructor(name, email, cart, id){
        this.name = name;
        this.email = email;
        this.cart = cart ? cart : {};
        this.cart.items = cart ? cart.items : [];
        this._id = id;
    }

    save(){
        const db = getDB();
        return db.collection('users').insertOne(this);
    }

    getCart(){
        const ids = this.cart.items.map(i => {
            return i.productId;
        });
        
        const db = getDB();

        return db.collection('products')
        .find({ 
            _id:{ 
                $in : ids
            }
        })
        .toArray()
        .then(products => {
            return products.map(p => {
                return {
                    ...p,
                    quantity: this.cart.items.find(i => {
                        return i.productId.toString() === p._id.toString()
                    }).quantity

                }
            });
        })
        .catch(error => {
            console.log(error);
        })
    }

    deleteCartItem(productid){
        const cartItems = this.cart.items.filter(item => {
            return item.productId.toString() !== productid.toString();
        });

        const db = getDB();

        return db.collection('users').updateOne({_id: new mongodb.ObjectId(this._id)}, { $set: { cart: {items: cartItems}}});
    }

    addOrder(){
        // Get Cart

        // Create Order Object

        // Save Order

        // Update Cart

        const db = getDB();
        return this.getCart()
            .then(products => {
                const order = {
                    items: products.map(item => {
                        return {
                            _id: item._id,
                            name: item.name,
                            price: item.price,
                            imageUrl: item.imageUrl,
                            userId: item.userId,
                            quantity: item.quantity
                        }
                    }),
                    user: {
                        _id: new mongodb.ObjectId(this._id),
                        name: this.name,
                        email: this.email
                    },
                    date: new Date().toLocaleString()
                }

                return db.collection('orders').insertOne(order);
            })
            .then(() => {
                this.cart = {items: []};
                return db.collection('users')
                    .updateOne({_id: new mongodb.ObjectId(this._id)}, {$set: {cart: { items: []}}});
            })
    }

    getOrders(){

    }
    

    addToCart(product){
        const index = this.cart.items.findIndex(cp => {
            return cp.productId.toString() === product._id.toString();
        });

        const updatedCartItems = [...this.cart.items];

        let itemQuantity = 1;

        if(index >= 0){
            itemQuantity = this.cart.items[index].quantity+1;
            updatedCartItems[index].quantity = itemQuantity;
        }
        else{
            updatedCartItems.push({
                productId: new mongodb.ObjectId(product._id),
                quantity: itemQuantity
            })
        }

        const db = getDB();

        return db.collection('users').updateOne(
            { 
                _id: new mongodb.ObjectId(this._id)
            }, 
            { 
                $set: { 
                    cart: { 
                        items: updatedCartItems
                    }
                }
            });
    }

    static findById(userid){
        const db = getDB();
        return db.collection('users').findOne({_id: new mongodb.ObjectId(userid)})
        .then(user => {
            return user;
        })
        .catch(error => {
            console.log(error);
        })
    }

    static findByUserName(username){
        const db = getDB();
        return db.collection('users').findOne({name: username})
        .then(user => {
            return user;
        })
        .catch(error => {
            console.log(error);
        })
    }
}

module.exports = User;