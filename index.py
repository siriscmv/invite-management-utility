from datetime import datetime, timedelta
import hikari
import os

from hikari.messages import MessageFlag
from dotenv import load_dotenv
import json

load_dotenv()

config = json.load(open('config.json', 'r'))

bot = hikari.GatewayBot(token = os.getenv('DISCORD_TOKEN'))

@bot.listen()
async def ping(msg: hikari.GuildMessageCreateEvent) -> None:
    # If a non-bot user sends a message "hk.ping", respond with "Pong!"
    # We check there is actually content first, if no message content exists,
    # we would get `None' here.
    if msg.is_bot or not msg.content:
        return

    if msg.content.startswith(f"{config.get('prefix')}ping"):
        await msg.message.respond("Pong!")

@bot.listen()
async def verify(interaction: hikari.ComponentInteraction) -> None:
    if not interaction.guild_id == config.get('main_server'): return
    if not interaction.custom_id == '_VERIFY': return

    if interaction.user.created_at - datetime.now() < timedelta(days=7):
        await interaction.create_initial_response(content="Your account is to younf to get verified, please DM a staff member to verify your account.", flags=MessageFlag.EPHEMERAL)
        return
    elif interaction.member.get_presence().visible_status.value == 'offline':
        await interaction.create_initial_response(content="You cannot verify while being invisible!, please go online for a moment to verify and then go back to being invisible.", flags=MessageFlag.EPHEMERAL)
    else:
        await interaction.member.add_role(config.get('verified_role'))
        await interaction.create_initial_response(content="You have been verified!", flags=MessageFlag.EPHEMERAL)

bot.run( asyncio_debug=True, coroutine_tracking_depth=20, propagate_interrupts=True)