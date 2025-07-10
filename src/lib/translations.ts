export type Language = 'en' | 'fr';

export const translations = {
  en: {
    // Categories
    categories: {
      'Breakfast': 'Breakfast',
      'Lunch & Dinner': 'Lunch & Dinner',
      'Snacks': 'Snacks',
      'Drinks': 'Drinks',
      'Beer': 'Beer',
      'Pro Shop': 'Pro Shop'
    },
    // UI Elements
    ui: {
      howItWorks: 'How It Works',
      golfClub: 'Golf Club',
      items: 'items',
      item: 'item',
      proceedToCheckout: 'Proceed to Checkout',
      yourCart: 'Your Cart',
      cartEmpty: 'Your cart is empty',
      addToOrder: 'Add to Order',
      customize: 'Customize',
      notes: 'Notes / Allergies (optional)',
      specialRequests: 'Any special requests or allergy info?',
      backToMenu: 'Back to Menu',
      yourOrder: 'Your Order',
      subtotal: 'Subtotal',
      clearCart: 'Clear Cart',
      placeOrder: 'Place Order',
      processing: 'Processing…',
      remove: 'Remove',
      addNote: 'Add a note (e.g. no onions)',
      selectHole: 'Select Hole Number',
      selectHolePrompt: 'Select a hole...',
      submitOrder: 'Submit Order',
      hole: 'Hole',
      each: 'each'
    },
    // How It Works Modal
    howItWorksModal: {
      title: 'How FairwayMate Works',
      step1: {
        title: 'No App. No Account. Just Order.',
        description: "You're already in — no downloads or signups needed. Just tap and go."
      },
      step2: {
        title: 'Place Your Order',
        description: "Add items to your cart and check out with your phone. We'll receive your order in the clubhouse right away."
      },
      step3: {
        title: 'Delivered Right to Your Hole',
        description: 'Our staff prepares your order and brings it directly to your location on the course.'
      },
      privacyNotice: 'Privacy Notice',
      privacyText: 'We use your location only at the time of ordering to help us deliver to the correct hole. Your data is never stored or shared.',
      readyMessage: 'Ready to start ordering? It\'s that simple!',
      backToMenuButton: 'Got it – Back to Menu'
    }
  },
  fr: {
    // Categories
    categories: {
      'Breakfast': 'Petit déjeuner',
      'Lunch & Dinner': 'Déjeuner et dîner',
      'Snacks': 'Collations',
      'Drinks': 'Boissons',
      'Beer': 'Bière',
      'Pro Shop': 'Boutique pro'
    },
    // UI Elements
    ui: {
      howItWorks: 'Comment ça marche',
      golfClub: 'Club de golf',
      items: 'articles',
      item: 'article',
      proceedToCheckout: 'Passer à la commande',
      yourCart: 'Votre panier',
      cartEmpty: 'Votre panier est vide',
      addToOrder: 'Ajouter à la commande',
      customize: 'Personnaliser',
      notes: 'Notes / Allergies (optionnel)',
      specialRequests: 'Des demandes spéciales ou des informations sur les allergies?',
      backToMenu: 'Retour au menu',
      yourOrder: 'Votre commande',
      subtotal: 'Sous-total',
      clearCart: 'Vider le panier',
      placeOrder: 'Passer la commande',
      processing: 'Traitement en cours…',
      remove: 'Retirer',
      addNote: 'Ajouter une note (ex: pas d\'oignons)',
      selectHole: 'Sélectionner le numéro du trou',
      selectHolePrompt: 'Sélectionner un trou...',
      submitOrder: 'Soumettre la commande',
      hole: 'Trou',
      each: 'chacun'
    },
    // How It Works Modal
    howItWorksModal: {
      title: 'Comment fonctionne FairwayMate',
      step1: {
        title: 'Pas d\'app. Pas de compte. Juste commander.',
        description: 'Vous êtes déjà connecté — aucun téléchargement ou inscription nécessaire. Il suffit de toucher et de partir.'
      },
      step2: {
        title: 'Passez votre commande',
        description: 'Ajoutez des articles à votre panier et payez avec votre téléphone. Nous recevrons votre commande au club-house immédiatement.'
      },
      step3: {
        title: 'Livré directement à votre trou',
        description: 'Notre personnel prépare votre commande et l\'apporte directement à votre emplacement sur le parcours.'
      },
      privacyNotice: 'Avis de confidentialité',
      privacyText: 'Nous utilisons votre localisation uniquement au moment de la commande pour nous aider à livrer au bon trou. Vos données ne sont jamais stockées ou partagées.',
      readyMessage: 'Prêt à commencer à commander? C\'est aussi simple que ça!',
      backToMenuButton: 'Compris – Retour au menu'
    }
  }
};

export function useTranslation(language: Language) {
  return {
    t: (key: string) => {
      const keys = key.split('.');
      let value: any = translations[language];
      
      for (const k of keys) {
        value = value?.[k];
      }
      
      return value || key;
    },
    language
  };
}