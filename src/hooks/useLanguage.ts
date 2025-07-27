import { useState, useEffect } from 'react';

export type Language = 'en' | 'fr';

interface UseLanguageResult {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

// Translation dictionary
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation & General
    'menu': 'Menu',
    'cart': 'Cart',
    'checkout': 'Checkout',
    'back': 'Back',
    'close': 'Close',
    'loading': 'Loading...',
    'error': 'Error',
    'tryAgain': 'Try Again',
    
    // Menu Page
    'welcomeToFairwayMate': 'Welcome to FairwayMate!',
    'welcomeDescription': 'Welcome to the app that fills in the blanks. Drinks, snacks and whatever else your round is missing — delivered right to you on the course.',
    'howItWorks': 'How It Works',
    'browseMenu': 'Browse Menu',
    'yourCart': 'Your Cart',
    'cartEmpty': 'Your cart is empty',
    'cartEmptyDescription': 'Add some delicious items to get started!',
    'addToCart': 'Add to Cart',
    'addToOrder': 'Add to Order',
    'proceedToCheckout': 'Proceed to Checkout',
    'total': 'Total',
    'item': 'item',
    'items': 'items',
    
    // Menu Item Detail
    'customize': 'Customize',
    'addNote': 'Add Note',
    'editNote': 'Edit Note',
    'saveNote': 'Save Note',
    'notePlaceholder': 'Add note (e.g. No onions)',
    'each': 'each',
    
    // Checkout
    'yourOrder': 'Your Order',
    'backToMenu': 'Back to Menu',
    'orderSubtotal': 'Order Subtotal',
    'convenienceFee': 'Convenience Fee',
    'clearCart': 'Clear Cart',
    'placeOrder': 'Place Order',
    'processing': 'Processing...',
    'mobileOrderingFee': '* A $2.50 mobile ordering fee & taxes are included in your total.',
    
    // How It Works Modal
    'howItWorksTitle': 'How FairwayMate Works',
    'step1Title': 'No App. No Account. Just Order.',
    'step1Description': 'You\'re already in — no downloads or signups needed. Just tap and go.',
    'step2Title': 'Place Your Order',
    'step2Description': 'Add items to your cart and check out with your phone. We\'ll receive your order in the clubhouse right away.',
    'step3Title': 'Delivered Right to Your Hole',
    'step3Description': 'Our staff prepares your order and brings it directly to your location on the course.',
    'privacyNotice': 'Privacy Notice',
    'privacyDescription': 'We use your location only at the time of ordering to help us deliver to the correct hole. Your data is never stored or shared.',
    'readyToOrder': 'Ready to start ordering? It\'s that simple!',
    'gotItBackToMenu': 'Got it – Back to Menu',
    
    // Thank You Page
    'thankYou': 'Thank you for your order!',
    'orderConfirmed': 'confirmed!',
    'deliverToHole': 'We\'ll deliver it to hole',
    'shortly': 'shortly.',
    'paymentSuccessful': 'Your payment was successful. Your order will be prepared shortly!',
    'helpUsImprove': 'Help us improve!',
    'surveyDescription': 'A short survey will arrive in your inbox soon — and it only takes 30 seconds',
    'backToMenu': 'Back to Menu',
    'oopsSomethingWrong': 'Oops! Something went wrong',
    'returnToMenu': 'Return to Menu',
    
    // Categories
    'breakfast': 'Breakfast',
    'lunchDinner': 'Lunch & Dinner',
    'snacks': 'Snacks',
    'drinks': 'Drinks',
    'beer': 'Beer',
    'proShop': 'Pro Shop',
    
    // Tags
    'spicy': 'Spicy',
    'vegetarian': 'Vegetarian',
    'bestseller': 'Best Seller',
    'glutenFree': 'Gluten-Free',
    'dairyFree': 'Dairy-Free',
    'vegan': 'Vegan',
    'keto': 'Keto',
    'lowCarb': 'Low-Carb',
    'organic': 'Organic',
    'local': 'Local',
  },
  fr: {
    // Navigation & General
    'menu': 'Menu',
    'cart': 'Panier',
    'checkout': 'Commande',
    'back': 'Retour',
    'close': 'Fermer',
    'loading': 'Chargement...',
    'error': 'Erreur',
    'tryAgain': 'Réessayer',
    
    // Menu Page
    'welcomeToFairwayMate': 'Bienvenue chez FairwayMate!',
    'welcomeDescription': 'Bienvenue dans l\'application qui comble les lacunes. Boissons, collations et tout ce qui manque à votre partie — livré directement sur le parcours.',
    'howItWorks': 'Comment ça marche',
    'browseMenu': 'Parcourir le menu',
    'yourCart': 'Votre panier',
    'cartEmpty': 'Votre panier est vide',
    'cartEmptyDescription': 'Ajoutez des articles délicieux pour commencer!',
    'addToCart': 'Ajouter au panier',
    'addToOrder': 'Ajouter à la commande',
    'proceedToCheckout': 'Procéder à la commande',
    'total': 'Total',
    'item': 'article',
    'items': 'articles',
    
    // Menu Item Detail
    'customize': 'Personnaliser',
    'addNote': 'Ajouter une note',
    'editNote': 'Modifier la note',
    'saveNote': 'Sauvegarder la note',
    'notePlaceholder': 'Ajouter une note (ex: Sans oignons)',
    'each': 'chacun',
    
    // Checkout
    'yourOrder': 'Votre commande',
    'backToMenu': 'Retour au menu',
    'orderSubtotal': 'Sous-total de la commande',
    'convenienceFee': 'Frais de commodité',
    'clearCart': 'Vider le panier',
    'placeOrder': 'Passer la commande',
    'processing': 'Traitement...',
    'mobileOrderingFee': '* Des frais de commande mobile de 2,50 $ et les taxes sont inclus dans votre total.',
    
    // How It Works Modal
    'howItWorksTitle': 'Comment fonctionne FairwayMate',
    'step1Title': 'Pas d\'app. Pas de compte. Juste commander.',
    'step1Description': 'Vous êtes déjà connecté — aucun téléchargement ou inscription nécessaire. Il suffit de toucher et de partir.',
    'step2Title': 'Passez votre commande',
    'step2Description': 'Ajoutez des articles à votre panier et payez avec votre téléphone. Nous recevrons votre commande au club-house immédiatement.',
    'step3Title': 'Livré directement à votre trou',
    'step3Description': 'Notre personnel prépare votre commande et l\'apporte directement à votre emplacement sur le parcours.',
    'privacyNotice': 'Avis de confidentialité',
    'privacyDescription': 'Nous utilisons votre emplacement uniquement au moment de la commande pour nous aider à livrer au bon trou. Vos données ne sont jamais stockées ou partagées.',
    'readyToOrder': 'Prêt à commencer? C\'est aussi simple que ça!',
    'gotItBackToMenu': 'Compris – Retour au menu',
    
    // Thank You Page
    'thankYou': 'Merci pour votre commande!',
    'order': 'Commande',
    'orderConfirmed': 'confirmée!',
    'deliverToHole': 'Nous la livrerons au trou',
    'shortly': 'sous peu.',
    'paymentSuccessful': 'Votre paiement a été effectué avec succès. Votre commande sera préparée sous peu!',
    'helpUsImprove': 'Aidez-nous à nous améliorer!',
    'surveyDescription': 'Un court sondage arrivera bientôt dans votre boîte de réception — et cela ne prend que 30 secondes',
    'backToMenu': 'Retour au menu',
    'oopsSomethingWrong': 'Oups! Quelque chose s\'est mal passé',
    'returnToMenu': 'Retour au menu',
    
    // Categories
    'breakfast': 'Déjeuner',
    'lunchDinner': 'Dîner et souper',
    'snacks': 'Collations',
    'drinks': 'Boissons',
    'beer': 'Bière',
    'proShop': 'Boutique pro',
    
    // Tags
    'spicy': 'Épicé',
    'vegetarian': 'Végétarien',
    'bestseller': 'Meilleure vente',
    'glutenFree': 'Sans gluten',
    'dairyFree': 'Sans produits laitiers',
    'vegan': 'Végétalien',
    'keto': 'Kéto',
    'lowCarb': 'Faible en glucides',
    'organic': 'Biologique',
    'local': 'Local',
    
    // Additional translations
    'step': 'Étape',
  }
};

// Browser language detection
const detectBrowserLanguage = (): Language => {
  if (typeof window === 'undefined') return 'en';
  
  const browserLang = navigator.language.toLowerCase();
  
  // Check for French variants
  if (browserLang.startsWith('fr')) {
    return 'fr';
  }
  
  return 'en';
};

export function useLanguage(): UseLanguageResult {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window === 'undefined') return 'en';
    
    // Try to get from localStorage first
    const saved = localStorage.getItem('language') as Language;
    if (saved && (saved === 'en' || saved === 'fr')) {
      return saved;
    }
    
    // Fallback to browser detection
    return detectBrowserLanguage();
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || translations.en[key] || key;
  };

  return { language, setLanguage, t };
}

// Helper function to get localized menu item content
export function getLocalizedContent(
  item: {
    item_name: string;
    item_name_fr?: string;
    description: string;
    description_fr?: string;
  },
  language: Language
) {
  return {
    name: language === 'fr' && item.item_name_fr ? item.item_name_fr : item.item_name,
    description: language === 'fr' && item.description_fr ? item.description_fr : item.description,
  };
}