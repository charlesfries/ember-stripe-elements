import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';
import { render, find, clearRender } from '@ember/test-helpers';
import StripeMock from '@adopted-ember-addons/ember-stripe-elements/test-support';

module('Integration | Component | stripe-postal-code', function (hooks) {
  setupRenderingTest(hooks);

  hooks.beforeEach(function () {
    window.Stripe = StripeMock;
    this.stripe = this.owner.lookup('service:stripe');
    this.stripe.configure();
  });

  test('it renders', async function (assert) {
    await render(hbs`<StripePostalCode/>`);

    assert.ok(find('.ember-stripe-element.ember-stripe-postal-code'));
    assert.ok(find('[role="mount-point"]'));
    assert.strictEqual(this.stripe.getActiveElements().length, 1);

    await clearRender();

    assert.strictEqual(this.stripe.getActiveElements().length, 0);
  });
});
