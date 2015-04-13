

    function person(health,health_percentage,armor,armor_type,klass,level,id,damage,race){
        this.health = health;
        this.health_percentage = health_percentage;
        this.armor = armor;
        this.armor_type = armor_type;
        this.klass = klass;
        this.id = id;
        this.level = level;
        this.damage = damage;
        this.race = race;
        this.attack = "";
    }

//undead
arthus = new person(110,100,15,"plate","Death Knight",1,"arthus",[14,15],"undead");
nec = new person(80,100,9,"cloth","Necromancer",1,"nec",[8,9],"undead");
timmy = new person(90,100,13,"leather","Ghoul",1,"timmy",[11,12,13,14],"undead");

skel =  new person(50,100,13,"cloth","skeleton",1,"skel",[10,11,12,13],"undead");
//humans
uther =  new person(110,100,16,"plate","Palatine",1,"uther",[10,11,12,13],"human");
mage = new person(80,100,10,"cloth","Sorcerer",1,"mage",[5,6,7,8],"human");
arch = new person(90,100,11,"leather","Archer",1,"arch",[10,11,12,13,14,15,16,17],"human");


arthus.mana = 80;
uther.mana = 80;
mage.mana = 120;
nec.mana = 120;

arthus.spells = {1: "death coil"};
uther.spells = {1: "holy light"};
mage.spells = {1: "fire ball"};
nec.spells = {1: "raise dead"};

var humans = [uther,arch,mage];
var undead = [arthus,nec,timmy];

var walking_dead = false;

// if spell has array, then it has effects beyond just damage
//dmg is followed by what race the spell damages, hp is followed by what race the spell heals
spells = {
  "death coil": [16,"human",13,"undead"],
  "holy light": [13,"undead",16,"human"],
  "fireball": 20,
  "raise dead": function(){
    for(thing in team2){
      if(thing.health <= 0){ walking_dead = true;}
    }
   }
};



$(document).ready(function(){
var race = prompt("Chose your race, 'undead' or 'humans'.");
var otherteam;

if(race == "humans"){
    race = humans;
    alert("you chose humans");
    otherteam = undead;
    
}
else{
    race = undead;
    alert("you chose undead");
    otherteam = humans;
    
}

 $('#combat_log').html("Battle start! Your turn, select a character and then an action.");

var game = 1;
var turn_counter = 0;

  var turn = 1;
  var giver = ""; var action = "";
  var damage_reciever = ""; var health_id = "";
  $('img').click(function(){
        if($(this).attr('class') == race[0].klass || race[1].klass || race[2].klass){ 
            giver = $(this).attr('class');
            alert($(this).attr('class'));
            action = "";
        }
    });
  
   $('img').click(function(){
        if( ( $(this).attr('id') == "attack" || "spell" )&& giver != ""){
            $(this).attr('class') = "highlighted";
            action = $(this).attr('id');
        }
    });
    
    $('img').click(function(){         //damage_reciever and health_id set
     if(action != "" && giver != ""){
            for(person in otherteam){
                if(this.class == otherteam[person].klass){
                    damage_reciever = otherteam[person];
                    health_id = "#" + damage_reciever.replace(/\s+/g, '') + "Health";
                }
            }
        }
      for(person in team){
            if(team[person].klass == giver){
                var damage = team[person].damage[Math.floor(Math.random()*team[person].damage.length)];
                damage_reciever.health = health - damage;
                damage_reciever.health_percentage = damage_reciever.health / 100;
                //code for slice animation
                $(damage_reiever).width(String(damage_reciever.health_percentage)+"%");
                $('#combat_log').html(giver + " dealt " + String(damage) + " to " + damage_reciever.klass);
                turn++;
            }
        }
        if(race[0].health && race[1].health && race[2].health <=0){
            game = 0;
            alert("Your whole team died, you lost.");
        }
        if(otherteam[0].health && otherteam[1].health && otherteam[2].health <= 0){
            game = 0;
            alert("You have defeated the enemy team!");
        }
    });
    

  if(turn_counter == 0){
    $('#combat_log').html("Battle start! Your turn, select a character and then an action...");
  }
 
    //each team gets 3 turns (one for each character)
   getGiver();
   getAction();
   getDamageReciever();
   attackSetRecieversNewHealth();//once target person has recieved damage its the next character's turn


  if(race[0].health && race[1].health && race[2].health <=0){
    game = 0;
    alert("Your whole team died, you lost.");
  }
  if(otherteam[0].health && otherteam[1].health && otherteam[2].health <= 0){
    game = 0;
    alert("You have defeated the enemy team!");
  }
 turn_counter++;
 
});
