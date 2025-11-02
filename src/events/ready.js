export const name = "clientReady";
export const once = true;
export function execute(client) {
    console.log(`Logged in as ${client.user.tag}!`);
}