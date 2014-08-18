function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

var dude = {
  name: "DUDE MAN",
  damage: 1,
  armor: 1,
  health: 10,
  aggressor: true,
  hit: function(other_guy) {
    if(getRandomInt(1,100) >= 20) {
      console.log("%s hits %s BIFF", this.name, other_guy.name)
      other_guy.health -= this.damage
      console.log("%s now has %d health", other_guy.name, other_guy.health)
    } else {
      console.log("%s MISSES %s", this.name, other_guy.name)
    }
  }
}

var oppo = {
  name: "trash mob of silliness",
  damage: 1,
  armor: 1,
  health: 10,
  aggressor: false,
  hit: function(other_guy) {
    if(getRandomInt(1,100) >= 50) {
      console.log("%s hits %s ZOT", this.name, other_guy.name)
      other_guy.health -= this.damage
      console.log("%s now has %d health", other_guy.name, other_guy.health)
    } else {
      console.log("%s MISSES %s", this.name, other_guy.name)
    }
  }
}

dude.isAlive = true
oppo.isAlive = true

var hero = {}
var trash = {}

function recFun(hero, trash) {

  if (hero.health <= 0) {
    return "YOU DIED"
  } else if (trash.health <= 0) {
    return "YOU WON"
  } else {
    if (hero.aggressor) {

      hero.hit(trash)

      if (trash.health <= 0) {
        console.log("%s dies!", trash.name)
      }

      hero.aggressor = false
      trash.aggressor = true
    } else if (trash.aggressor) {

      trash.hit(hero)

      if (hero.health <= 0) {
        console.log("%s dies!", hero.name)
      }

      trash.aggressor = false
      hero.aggressor = true
    }
    return setTimeout(function() {
      return recFun(hero, trash)
    }, 100)
  }
}

var result = recFun(dude, oppo)
console.log(result)


