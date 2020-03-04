const checkoutNodeJssdk = require('@paypal/checkout-server-sdk');

/**
 *
 * Returns PayPal HTTP client instance with environment that has access
 * credentials context. Use this instance to invoke PayPal APIs, provided the
 * credentials have access.
 */
function client() {
    return new checkoutNodeJssdk.core.PayPalHttpClient(environment());
}

/**
 *
 * Set up and return PayPal JavaScript SDK environment with PayPal access credentials.
 * This sample uses SandboxEnvironment. In production, use LiveEnvironment.
 *
 */
function environment() {
    let clientId = process.env.PAYPAL_CLIENT_ID || 'Ac9hfvzrAbvxKLOH0rl4Y1xmusx5HEOZnLxG3jwTZC778AHZ2L8i9XQpyS0UBMEIA3KJ2XZmN7yG0lT4';
    let clientSecret = process.env.PAYPAL_CLIENT_SECRET || 'EDTEuHDqeESXD12ArniDTLf9UH90ANXsLRSJBp4e8iTPtnTGbAL8pexQjQvRmx_pG4TOp0zLrQY7ydml';

    return new checkoutNodeJssdk.core.SandboxEnvironment(
        clientId, clientSecret
    );
}

module.exports = {client: client}