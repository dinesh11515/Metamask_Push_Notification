import { OnRpcRequestHandler } from '@metamask/snap-types';
import { fetchUrl } from './fetchUrl';

/**
 * Get a message from the origin. For demonstration purposes only.
 *
 * @param originString - The origin string.
 * @returns A message based on the origin.
 */
export const getMessage = (originString: string): string =>
  `Hello, ${originString}!`;

/**
 * Fetches notification from the PUSH API.
 *
 * @param address - The address of the user.
 * @returns A message based on the origin.
 */
async function fetchNotifications(address: string) {
  const feedsUrl = `https://backend-staging.epns.io/apis/v1/users/eip155:5:${address}/feeds`;
  let fetchedNotifications: any = await fetchUrl(feedsUrl);
  fetchedNotifications = fetchedNotifications?.feeds;
  // Parse the notification fetched
  let msg = `You have ${fetchedNotifications.length} notifications\n`;
  if (fetchedNotifications.length > 0) {
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i = 0; i < fetchedNotifications.length; i++) {
      msg += `${fetchedNotifications[i].payload.data.app} - ${fetchedNotifications[i].payload.data.amsg}\n`;
    }
  } else {
    msg = 'You have 0 notifications';
  }
  console.log(msg);

  return msg;
}

/**
 * Fetches notification from the PUSH API.
 *
 * @param address - The address of the user.
 * @returns A message based on the origin.
 */
async function latestNotifications(address: string) {
  const feedsUrl = `https://backend-staging.epns.io/apis/v1/users/eip155:5:${address}/feeds`;
  let fetchedNotifications: any = await fetchUrl(feedsUrl);
  fetchedNotifications = fetchedNotifications?.feeds;
  // Parse the notification fetched
  const msg = `${
    fetchedNotifications[fetchedNotifications.length - 1].payload.data.app
  } - ${
    fetchedNotifications[fetchedNotifications.length - 1].payload.data.amsg
  }`;

  return msg;
}

/**
 * Get the address of the user.
 */
async function getAddress() {
  const addresses = await (wallet as any).request({
    method: 'eth_requestAccounts',
  });
  const address = addresses[0];
  return address;
}

/**
 * Handle incoming JSON-RPC requests, sent through `wallet_invokeSnap`.
 *
 * @param args - The request handler args as object.
 *
 * invoked the snap.
 * @param args.request - A validated JSON-RPC request object.
 * @returns `null` if the request succeeded.
 * @throws If the request method is not valid for this snap.
 * @throws If the `snap_confirm` call failed.
 */

export const onRpcRequest: OnRpcRequestHandler = async ({ request }) => {
  const address = await getAddress();
  switch (request.method) {
    case 'push_notifications':
      return wallet.request({
        method: 'snap_confirm',
        params: [
          {
            prompt: 'Push Notifications',
            description: 'These are the notifications From PUSH.',
            textAreaContent: await fetchNotifications(address),
          },
        ],
      });
    case 'push_notify':
      return wallet.request({
        method: 'snap_notify',
        params: [
          {
            type: 'inApp',
            message: await latestNotifications(address),
          },
        ],
      });
    case 'push_popup':
      return wallet.request({
        method: 'snap_notify',
        params: [
          {
            type: 'native',
            message: await latestNotifications(address),
          },
        ],
      });

    default:
      throw new Error('Method not found.');
  }
};
