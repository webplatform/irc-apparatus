// see https://node-irc.readthedocs.org/en/latest/API.html#events

// these are the events that can be listened for
// contains info for mapping event params to context params:
//   raw - registered, topic, join, part, quit, kick, kill, msg, notice, pm, ctcp, ctcpNotice, ctcpPrivmsg, ctcpVersion, nick, invite, modeAdd, modeRemove
//   channel - topic, join, part, kick, msg, invite, modeAdd, modeRemove
//   channels (defaults to channel) - quit, kill, nick
//   source - topic, join, part, quit, kick, msg, notice, pm, ctcp, ctcpNotice, ctcpPrivmsg, ctcpVersion, nick, invite, modeAdd, modeRemove
//   target - kick, kill, notice, ctcp, ctcpNotice, ctcpPrivmsg, ctcpVersion, nick
//   text - motd, topic, part, quit, kick, kill, msg, notice, pm, ctcp, ctcpNotice, ctcpPrivmsg, ctcpVersion, modeAdd, modeRemove
//   type - ctcp
//   mode - modeAdd, modeRemove
module.exports = {
  // connect()
  raw:          { args: ['raw'] }, // message
  registered:   { args: ['raw'] }, // message
  motd:         { args: ['text'] }, // motd
  // names(channel, nicks)
  // names#channel(nicks)
  topic:        { args: ['channel', 'text', 'source', 'raw'] }, // channel, topic, nick, message
  join:         { args: ['channel', 'source', 'raw'] }, // channel, nick, message
  // join#channel(nick, message)
  part:         { args: ['channel', 'source', 'text', 'raw'] }, // channel, nick, reason, message
  // part#channel(nick, reason, message)
  quit:         { args: ['source', 'text', 'channels', 'raw'] }, // nick, reason, channels, message
  kick:         { args: ['channel', 'target', 'source', 'text', 'raw'] }, // channel, nick, by, reason, message
  // kick#channel(nick, by, reason, message)
  kill:         { args: ['target', 'text', 'channels', 'raw'] }, // nick, reason, channels, message
  // message(nick, to, text, message)
  msg:          { event: 'message#', args: ['source', 'channel', 'text', 'raw'] }, // nick, to, text, message
  // message#channel(nick, text, message)
  notice:       { args: ['source', 'target', 'text', 'raw'] }, // nick, to, text, message
  ping:         { args: ['text'] }, // server
  pm:           { args: ['source', 'text', 'raw'] }, // nick, text, message
  ctcp:         { args: ['source', 'target', 'text', 'type', 'raw'] }, // from, to, text, type, message
  ctcpNotice:   { args: ['source', 'target', 'text', 'raw'] }, // from, to, text, message
  ctcpPrivmsg:  { args: ['source', 'target', 'text', 'raw'] }, // from, to, test, message
  ctcpVersion:  { args: ['source', 'target', 'text', 'raw'] }, // from, to, text, message
  nick:         { args: ['source', 'target', 'channels', 'raw'] }, // oldnick, newnick, channels, message
  invite:       { args: ['channel', 'source', 'raw'] }, // channel, from, message
  modeAdd:      { args: ['channel', 'source', 'mode', 'text', 'raw'] }, // channel, by, mode, argument, message
  modeRemove:   { args: ['channel', 'source', 'mode', 'text', 'raw'] } // channel, by, mode, argument, message
  // whois(info)
  // channellist_start()
  // channellist_item(channel_info)
  // channellist(channel_list)
  // abort(retryCount)
  // error(message)
  // netError(exception)
  // selfMessage(target, text)
};

// TODO highlight/mention as type or via filter?
// TODO 'act' as ctcpPrivmsg alias?
