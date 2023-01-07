import { createContext} from "react";
import { useLocalStorage } from "../hooks/useLocalStorage.ts";

export const CartContext = createContext({
    items: [],
    getProductQuantity: () => {},
    addOneToCart: () => {},
    removeOneFromCart: () => {},
    deleteFromCart: () => {},
    getTotalCost: () => {},
    addOneToCartt: () => {}
});

export function CartProvider({children}) {
    const [cartProducts, setCartProducts] = useLocalStorage("shopping-cart",[]);

    function getProductQuantity(id) {
        const quantity = cartProducts.find(product => product.id === id)?.quantity;
        
        if (quantity === undefined) {
            return 0;
        }

        return quantity;
    }

    
   

    function addOneToCart(prod) {
        const quantity = getProductQuantity(prod.idproducts);

        if (quantity === 0) { 
            setCartProducts(
                [
                    ...cartProducts,
                    {
                        id: prod.idproducts,
                        name: prod.productName,
                        price:prod.price,
                        photo:prod.photo,
                        quantity: 1
                    }
                ]
            )
        } else { 
            setCartProducts(
                cartProducts.map(
                    product =>
                    product.id === prod.idproducts                               
                    ? { ...product, quantity: product.quantity + 1 } 
                    : product                                        
                )
            )
        }
    }

    function addOneToCartt(prod) {
        const quantity = getProductQuantity(prod.id);

        if (quantity === 0) { 
            setCartProducts(
                [
                    ...cartProducts,
                    {
                        id: prod.id,
                        name: prod.productName,
                        price:prod.price,
                        photo:prod.photo,
                        quantity: 1
                    }
                ]
            )
        } else { 
            setCartProducts(
                cartProducts.map(
                    product =>
                    product.id === prod.id                               
                    ? { ...product, quantity: product.quantity + 1 } 
                    : product                                        
                )
            )
        }
    }

    function removeOneFromCart(id) {
        const quantity = getProductQuantity(id);

        if(quantity === 1) {
            deleteFromCart(id);
        } else {
            setCartProducts(
                cartProducts.map(
                    product =>
                    product.id === id                                
                    ? { ...product, quantity: product.quantity - 1 } 
                    : product                                        
                )
            )
        }
    }

    function deleteFromCart(id) {
      
        setCartProducts(
            cartProducts =>
            cartProducts.filter(currentProduct => {
                return currentProduct.id !== id;
            })  
        )
    }

    function getTotalCost() {
        let totalCost = 0;
        for (var i = 0; i < cartProducts.length; i++){
            totalCost += (cartProducts[i].price * cartProducts[i].quantity);
        }
        return totalCost;
    }

    const contextValue = {
        items: cartProducts,
        getProductQuantity,
        addOneToCart,
        removeOneFromCart,
        deleteFromCart,
        getTotalCost,
        addOneToCartt
    }

    return (
        <CartContext.Provider value={contextValue}>
            {children}
        </CartContext.Provider>
    )
}

export default CartProvider;