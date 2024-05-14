import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

import type StripeService from '../services/stripev3';
import type {
  StripeElements,
  StripeAddressElement,
  StripeAddressElementOptions,
  StripeAddressElementChangeEvent,
} from '@stripe/stripe-js';

interface StripeElementSignature {
  autofocus?: boolean;
  options?: StripeAddressElementOptions;
  stripeError: unknown;
  _elements: StripeElements;
  onReady?: (cardElement: unknown) => void;
  onBlur?: (cardElement: unknown) => void;
  onChange?: (
    cardElement: unknown,
    event: StripeAddressElementChangeEvent
  ) => void;
  onFocus?: (cardElement: unknown) => void;
  onComplete?: (cardElement: unknown) => void;
  onError?: (stripeError: Error) => void;
}

export default class StripeElement extends Component<StripeElementSignature> {
  @tracked stripeElement: StripeAddressElement | null = null;
  @tracked type: string | null = null; // Set in components that extend from `stripe-element`
  @tracked _stripeError: unknown | null = null;

  @service declare stripev3: StripeService;

  get autofocus() {
    return this.args.autofocus;
  }

  get options() {
    return this.args.options || {};
  }

  get elements() {
    if (this.args._elements) {
      return this.args._elements;
    }

    return this.stripev3.elements();
  }

  get stripeError() {
    return this.args.stripeError || this._stripeError;
  }

  set stripeError(error) {
    this._stripeError = error;
  }

  @action
  registerListeners(element: HTMLElement) {
    this.mountElement(element);
    this.setEventListeners();
    this.focusElement(element);
  }

  mountElement(element: HTMLElement) {
    // Fetch user options
    let options = this.args.options;

    // `stripeElement` instead of `element` to distinguish from `element`
    let stripeElement = this.elements.create(this.type as 'address', options!);

    // Mount the Stripe Element onto the mount point
    stripeElement.mount(element);

    // Make the element available to the component
    this.stripeElement = stripeElement;
    this.stripev3.addStripeElement(stripeElement);
  }

  focusElement(element: HTMLElement) {
    // Fetch autofocus, set by user
    let iframe = element.querySelector('iframe');
    if (this.autofocus && iframe) {
      iframe.onload = () => {
        this.stripeElement!.focus();
      };
    }
  }

  setEventListeners() {
    let { stripeElement } = this;

    stripeElement!.on('ready', (event) => {
      this._invokeAction('onReady', stripeElement, event);
    });

    stripeElement!.on('blur', (event) => {
      this._invokeAction('onBlur', stripeElement, event);
    });

    stripeElement!.on('focus', (event) => {
      this._invokeAction('onFocus', stripeElement, event);
    });

    stripeElement!.on('change', (...args) => {
      if (this.isDestroying || this.isDestroyed) {
        return;
      }

      let [{ complete, error: stripeError }] = args;
      this.args.onChange?.(stripeElement, ...args);

      if (complete) {
        this._invokeAction('onComplete', stripeElement);
      } else if (stripeError) {
        this._invokeAction('onError', stripeError);
      }

      this.stripeError = stripeError;
    });
  }

  _invokeAction(method: keyof StripeElementSignature, ...args: unknown[]) {
    if (this.isDestroying || this.isDestroyed) {
      return;
    }

    if (typeof this.args[method] === 'function') {
      this.args[method](...args);
    }
  }

  @action
  onOptionsChange() {
    let options = this.options;
    this.stripeElement!.update(options);
  }

  willDestroy() {
    this.stripeElement!.unmount();
    this.stripev3.removeStripeElement(this.stripeElement!);
    super.willDestroy(...arguments);
  }
}
