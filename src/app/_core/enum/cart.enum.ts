export enum CartStatus {
    PENDING = 'PENDING',
    AWAITING_APPROVAL = 'AWAITING_APPROVAL',
    VALIDATE = 'VALIDATE',
    ESTIMATE_SENT = 'ESTIMATE_SENT',
    READY_DELIVER = 'READY_DELIVER',
    DELIVERED = 'DELIVERED',
    ABANDON = 'ABANDON'
}

export const CartStatusValue: Record<CartStatus, string> = {
    [CartStatus.PENDING]: "En constitution",
    [CartStatus.AWAITING_APPROVAL]: "En attente de validation",
    [CartStatus.ESTIMATE_SENT]: "Devis envoyé",
    [CartStatus.READY_DELIVER]: "Prêt à livrer",
    [CartStatus.VALIDATE]: "Validé",
    [CartStatus.DELIVERED]: "Livré",
    [CartStatus.ABANDON]: "Abandonné",
    
};

export enum OrderStatus {
    PENDING = 'PENDING',
    PENDING_TBV = 'PENDING_TBV',
    AWAITING_APPROVAL = 'AWAITING_APPROVAL',
    AWAITING_APPROVAL_TBV = 'AWAITING_APPROVAL_TBV',
    VALIDATE = 'VALIDATE',
    VALIDATE_TBV = 'VALIDATE_TBV',
    ESTIMATE_SENT = 'ESTIMATE_SENT',
    ESTIMATE_SENT_TBV = 'ESTIMATE_SENT_TBV',
    READY_DELIVER = 'READY_DELIVER',
    READY_DELIVER_TBV = 'READY_DELIVER_TBV',
    DELIVERED = 'DELIVERED',
    DELIVERED_TBV = 'DELIVERED_TBV',
    MATERIAL_AVAILABLE = 'MATERIAL_AVAILABLE',
    MATERIAL_AVAILABLE_TBV = 'MATERIAL_AVAILABLE_TBV',
    ABANDONED = 'ABANDONED',
    CREATED = 'CREATED',
    CONFIRMED = 'CONFIRMED',
    REJECTED = 'REJECTED',
    CANCELED = 'CANCELED'
}

export enum CartColor {
    /* livraison retour */
    RED = 'RED',
    /* statut commande cree ou commandee */
    YELLOW = 'YELLOW',
    /* expedie */
    GREEN = 'GREEN',
    /* livraison livré */
    BLUE = 'BLUE',
    /* le reste */
    GREY = 'GREY',
    /* pas tout les articles on ete traité */
    ORANGE = 'ORANGE',
    /* si pas de reponse de publidispatch pendant 24h */
    WARNING = 'WARNING',
    /* status confirmed ( publi a accusé reception de la commande 
        c'est en cour de traitement ) */
    PINK = 'PINK'
}

export enum CartIconClass {
    CART = 'cart-grey-normal',
    CART_BLUE = 'cart-blue-normal',
    CART_BLUE_PRN = 'cart-blue-parnasse',
    CART_RED = 'cart-red-normal',
    CART_ORANGE = 'cart-orange-normal',
    CART_GREEN = 'cart-green-normal',
    CART_GREEN_PRN = 'cart-green-parnasse',
    CART_YELLOW = 'cart-yellow-normal',
    CART_PINK = 'cart-purple-normal',
    CART_WARNING = 'cart-grey-error'

}

export enum Stocks {
    RASPAIL = "RSP01",
    RIVIERA = "RVA01",
    OPERA = "OPA01",
    PUBLIDISPATCH = "PBL01",
    ASTREINTE = "RSP05",
    ARM11 = "ARM11",
    PROVENCE = "PRO12",
    LYON_RHONE = "LYO13",
    HAUTE_SAVOIE = "HAS14"
}

export const StocksValue: Record<Stocks, string> = {
    [Stocks.RASPAIL]: "Raspail",
    [Stocks.RIVIERA]: "Riviera",
    [Stocks.OPERA]: "Opera",
    [Stocks.PUBLIDISPATCH]: "Publidispatch",
    [Stocks.ASTREINTE]: "Valise d'astreinte",
    [Stocks.ARM11]: "Retour membre en attente",
    [Stocks.HAUTE_SAVOIE]: "Haute Savoie",
    [Stocks.LYON_RHONE]: "Lyon-Rhone",
    [Stocks.PROVENCE]: "Provence"  
};
