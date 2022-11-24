import { OnRpcRequestHandler } from '@metamask/snap-types';
import * as PushAPI from '@pushprotocol/restapi';

/**
 * Get a message from the origin. For demonstration purposes only.
 *
 * @param originString - The origin string.
 * @returns A message based on the origin.
 */
export const getMessage = (originString: string): string =>
  `Hello, ${originString}!`;

const account = '0x591fb5caaC5F830eAe22EdB5e6279AD1355Acc85';
/**
 * Fetches notification from the PUSH API.
 *
 * @returns A message based on the origin.
 */
async function fetchNotifications() {
  const fetchedNotifications = await PushAPI.user.getFeeds({
    user: `eip155:5:${account}`,
    env: 'staging',
  });
  let msg;
  // Parse the notification fetched
  if (fetchedNotifications) {
    msg = `You have ${fetchedNotifications.length} notifications\n`;
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i = 0; i < fetchedNotifications.length; i++) {
      msg += `${fetchedNotifications[i].title} ${fetchedNotifications[i].message}\n`;
    }
  } else {
    msg = 'You have 0 notifications';
  }
  console.log(msg);
  return msg;
  // This is used to render the text present in a notification body as a JSX element
  // <NotificationItem
  //   notificationTitle={parsedResponse.title}
  //   notificationBody={parsedResponse.message}
  //   cta={parsedResponse.cta}
  //   app={parsedResponse.app}
  //   icon={parsedResponse.icon}
  //   image={parsedResponse.image}
  // />;
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
  const msg = await fetchNotifications();
  switch (request.method) {
    case 'push_notifications':
      return wallet.request({
        method: 'snap_confirm',
        params: [
          {
            prompt: 'Push Notifications',
            description: 'These are the notifications From PUSH.',
            textAreaContent: msg,
          },
        ],
      });

    default:
      throw new Error('Method not found.');
  }
};
