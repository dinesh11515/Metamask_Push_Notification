
## Getting Started

Go to packages/snap/src/index.ts and find the account variable and place your address (tried to fetch the address directly but can't able to do because of less time and my dumb skills)

Clone this repository and setup the development environment:

```shell
yarn install && yarn start
```
Click on the show notifications it will pop up the metamask flask and show the notifications

### Implementation

* Created a simple snap which will fetch notifications by using push protocol restapi for that address and explicitly converts them all to a string which further used as msg in metamask request.


##### Request code
```
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
```
##### Notifications code

```shell
msg = `You have ${fetchedNotifications.length} notifications\n`;
for (let i = 0; i < fetchedNotifications.length; i++) {
	msg += `${fetchedNotifications[i].title} ${fetchedNotifications[i].message}\n`;
}
```
