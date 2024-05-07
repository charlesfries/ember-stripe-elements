import type StripeCardCvc from './components/stripe-card-cvc';
import type StripeCardExpiry from './components/stripe-card-expiry';
import type StripeCardNumber from './components/stripe-card-number';
import type StripeCard from './components/stripe-card';
import type StripeElements from './components/stripe-elements';
import type StripePostalCode from './components/stripe-postal-code';

export default interface Registry {
  StripeCardCvc: typeof StripeCardCvc;
  StripeCardExpiry: typeof StripeCardExpiry;
  StripeCardNumber: typeof StripeCardNumber;
  StripeCard: typeof StripeCard;
  StripeElements: typeof StripeElements;
  StripePostalCode: typeof StripePostalCode;
}
