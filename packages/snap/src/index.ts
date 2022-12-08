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
 * @returns A message based on the origin.
 */
async function fetchNotifications() {
  const feedsUrl = `https://backend-staging.epns.io/apis/v1/users/eip155:5:0x04c755E1574F33B6C0747Be92DfE1f3277FCC0A9/feeds`;
  let fetchedNotifications: any = await fetchUrl(feedsUrl);
  fetchedNotifications = fetchedNotifications?.feeds;
  // Parse the notification fetched
  let msg = `You have ${fetchedNotifications.length} notifications\n`;
  if (fetchedNotifications.length > 0) {
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i = 0; i < fetchedNotifications.length; i++) {
      msg += `${fetchedNotifications[i].sender} ${fetchedNotifications[i].payload.data.amsg}\n`;
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
