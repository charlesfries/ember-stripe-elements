import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

import type StripeService from '../services/stripev3';

export default class StripeElements extends Component {
  @service('stripev3') declare stripe: StripeService;

  get options() {
    return this.args.options || {};
  }

  constructor() {
    super(...arguments);
    this.elements = this.stripe.elements(this.options);
  }
}
