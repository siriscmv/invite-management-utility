import hikari
import os
from dotenv import load_dotenv
import json

load_dotenv()

config = json.load('config.json')

bot = hikari.GatewayBot(token = os.getenv('DISCORD_TOKEN'))

@bot.listen()
async def ping(msg: hikari.GuildMessageCreateEvent) -> None:
    # If a non-bot user sends a message "hk.ping", respond with "Pong!"
    # We check there is actually content first, if no message content exists,
    # we would get `None' here.
    if msg.is_bot or not msg.content:
        return

    if msg.content.startswith(f"{config.prefix}ping"):
        await msg.message.respond("Pong!")

bot.run( asyncio_debug=True, coroutine_tracking_depth=20, propagate_interrupts=True)