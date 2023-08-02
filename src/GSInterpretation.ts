

export type GSPlayer = {
  name: string;
  guild: string;
  totalPoints: number;
  kills: string[];
  death: string[];
};

export type Interpretation = {
  players: GSPlayer[];
};

export function InterpretLog(log: string): Interpretation {
  let lines = log.split(/\r?\n/);

  const regex = /^\[([A-Za-z0-9]*)\]\s*(Maître de guilde\s*)?([A-Za-z0-9]*)\((\d*) grade\) Attaque -> \[([A-Za-z0-9]*)\]\s*(Défenseur\s*)?([A-Za-z0-9]*)$/mgyi;

  const players: { [name: string]: GSPlayer } = {};
  function getPlayer(name: string, guildName: string) {
    players[name] = players[name] || {
      name, guild: guildName, totalPoints: 0, kills: [], death: []
    };
    return players[name];
  }

  for (const line of lines) {
    const match = regex.exec(line);
    if (!match) continue;

    const attackerGuild = match[1];
    const attackerPlayer = match[3];
    const points = parseInt(match[4]);
    const defenderGuild = match[5];
    const defenderPlayer = match[7];

    const att = getPlayer(attackerPlayer, attackerGuild);
    att.kills.push(defenderPlayer);
    att.totalPoints += points;

    getPlayer(defenderPlayer, defenderGuild).death.push(attackerPlayer);
  }

  const retval: Interpretation = {
    players: [...Object.values(players)]
  };

  retval.players.sort(
    (lhs, rhs) => {
      if (lhs.totalPoints != rhs.totalPoints) {
        return rhs.totalPoints - lhs.totalPoints;
      }

      return lhs.name.localeCompare(rhs.name);
    }
  )

  return retval;
}

