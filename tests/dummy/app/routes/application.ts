import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

import type StripeService from '@adopted-ember-addons/ember-stripe-elements/services/stripev3';

export default class ApplicationRoute extends Route {
  @service('stripev3') declare stripe: StripeService;

  beforeModel() {
    return this.stripe.load();
  }
}
