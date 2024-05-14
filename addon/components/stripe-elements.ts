import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

import type StripeService from '../services/stripev3';
import type {
  StripeElements as _StripeElements,
  StripeElementsOptionsClientSecret,
} from '@stripe/stripe-js';

interface StripeElementsSignature {
  options: StripeElementsOptionsClientSecret;
}

export default class StripeElements extends Component<StripeElementsSignature> {
  @service('stripev3') declare stripe: StripeService;

  elements: _StripeElements;

  get options() {
    return this.args.options || {};
  }

  constructor() {
    super(...arguments);
    this.elements = this.stripe.elements(this.options);
  }
}
