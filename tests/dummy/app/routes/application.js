import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class ApplicationRoute extends Route {
  @service('stripev3') stripe;

  beforeModel() {
    return this.stripe.load();
  }
}
