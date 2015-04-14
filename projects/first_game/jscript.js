

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
        this.original_health = this.health;
        this.turn = 1;
    }

//undead
arthus = new person(110,100,14,"plate","DeathKnight",1,"arthus",[14,15],"undead");
nec = new person(80,100,9,"cloth","Necromancer",1,"nec",[8,9],"undead");
timmy = new person(0,0,13,"leather","Ghoul",1,"timmy",[11,12,13,14],"undead");

skel =  new person(50,100,13,"cloth","Skeleton",1,"skel",[10,11,12,13],"undead");
//humans
uther =  new person(110,100,16,"plate","Palatine",1,"uther",[10,11,12,13],"human");
mage = new person(80,100,10,"cloth","Sorcerer",1,"mage",[5,6,7,8],"human");
arch = new person(90,100,11,"leather","Archer",1,"arch",[10,11,12,13,14,15,16,17],"human");


arthus.mana = 80;
uther.mana = 80;
mage.mana = 120;
nec.mana = 120;

arthus.spells = {1:"Deathcoil"};
uther.spells = {1:"Holylight"};
mage.spells = {1:"Fireball"};
nec.spells = {1:"RaiseDead"};

var humans = [uther,arch,mage];
var undead = [arthus,nec,timmy];

var walking_dead = false;

// if spell has array, then it has effects beyond just damage
//dmg is followed by what race the spell damages, hp is followed by what race the spell heals


var maxTurn = 3;

$(document).ready(function(){
//$(".Spell").fadeOut('fast');

var race = prompt("Chose your race, 'undead' or 'humans'.");
var otherteam;

if(race == "humans"){
  $("tr.undead > div.icon").fadeOut('fast');
  race = humans;
   $('#combat_log').html("You have chosen Humans. Battle start! Select a character and then an action.");
  otherteam = undead;
}
else{
  race = undead;
   $("tr.human > div.icon").fadeOut('fast');
   $('#combat_log').html("You have chosen Undead. Battle start! Select a character and then an action.");
  otherteam = humans;
}
var team = race; //quick fix for problems below


spells = { // had to define raise dead here, because declaring functions requires that the variable used in the function be in the same scope
  "Deathcoil": [16,"human",13,"undead"],
  "Holylight": [13,"undead",16,"human"],
  "Fireball": 20,
  "RaiseDead": function(){
    for(person in team){
      if(team[person].health <= 0){
        playSound(spellSounds["RaiseDead"]);
        $("."+team[person].klass).attr("src","./skeletonedited.jpg");
        var klass = team[person].klass;
        team[person] = skel; team[person].health = 50; team[person].health_percentage = 100;
        team[person].klass = klass;
        highlightRED(nec);
        nec.turn -=1;
        checkForDead(); //affects number of turns before AI acts
        enemyActions();
      }
    }
  }
};
var game = 1;
var turn_counter = 0;
  var turn = 0;
  var giver = ""; var action = "";
  var damage_reciever = ""; var health_id = "";
  var race1tag = "." +race[0].klass;
  var race2tag = "." + race[1].klass;
  var race3tag = "." + race[2].klass;

  //character selector functions
  $(race1tag).click(function(){
    playSound(responseSounds[race[0].klass]);
      if(race[0].turn > 0 && race[0].health > 0){
        giver = $(this).attr('class');
        //alert("giver = " + giver);
        action = "";
        $('.highlighted').removeClass('highlighted');
      }
    });

    $(race2tag).click(function(){
      playSound(responseSounds[race[1].klass]);
        if(race[1].turn > 0 && race[1].health > 0){
          giver = $(this).attr('class');
          //alert("giver = " + giver);
          action = "";
          $('.highlighted').removeClass('highlighted');
        }
    });

  $(race3tag).click(function(){
    playSound(responseSounds[race[2].klass]);
      if(race[2].turn > 0 && race[2].health > 0){
        giver = $(this).attr('class');
        //alert("giver = " + giver);
        action = "";
        $('.highlighted').removeClass('highlighted');
      }
  });
//action selector functions
  //spells
 $(race1tag + "spell").click(function(){
    if(giver !="" && ("."+giver+"spell") == (race1tag + "spell")){
      $('.highlighted').removeClass('highlighted');
      $(this).addClass('highlighted');
      action = $(this).attr('id');
    }
  });

  $(race2tag + "spell").click(function(){
    if(giver !="" && ("."+giver+"spell") == (race2tag + "spell")){
      $('.highlighted').removeClass('highlighted');
      $(this).addClass('highlighted');
      action = $(this).attr('id');
    }
  });

   $(race3tag + "spell").click(function(){
    if(giver !="" && ("."+giver+"spell") == (race3tag + "spell")){
      $('.highlighted').removeClass('highlighted');
      $(this).addClass('highlighted');
      action = $(this).attr('id');
    }
  });
  //spell selectors && effects
  $("#Holylight").click(function(){
    if(giver !="" && (giver == "Palatine")){
      $('.highlighted').removeClass('highlighted');
      $(this).addClass('highlighted');
      action = $(this).attr('id');
    }
  });

  function Holylight(race,target){
   if(race == "human"){
     target.health = target.health + spells["Holylight"][2];
     target.health_percentage = 100*target.health / target.original_health;
     var log = $('#combat_log').html();
       $('#combat_log').html(log+"<br><br>"+"Palatine healed "+target.klass+ "for"+String(damage) + " damage! ");
    }
   if(race == "undead"){
     target.health = target.health - spells["Holylight"][0];
     target.health_percentage = 100*target.health / target.original_health;
     $('#combat_log').html(log+"<br><br>"+" Palatine dealt " + String(damage) + " damage to " + target.klass + "! ");
    }
    playSound(spellSounds["Holylight"]);
   $("#"+target.klass+"Health").width(String(target.health_percentage)+"%");
    uther.turn -=1;
    highlightRED(uther);
    checkIfBattleOver();
    turn++;
    giver = "";
    action = "";
    checkForDead(); //affects number of turns before AI acts
    enemyActions();
  }

  $("#Fireball").click(function(){
    if(giver !="" && (giver == "Sorcerer")){
      $('.highlighted').removeClass('highlighted');
      $(this).addClass('highlighted');
      action = $(this).attr('id');
    }
  });

  function Fireball(target){
    target.health = target.health - spells["Fireball"];
    target.health_percentage = 100*target.health / target.original_health;
    $('#combat_log').html(log+"<br><br>"+" Sorcerer dealt " + String(damage) + " damage to " + target.klass + "! ");
    playSound(spellSounds["Fireball"]);
   $("#"+target.klass+"Health").width(String(target.health_percentage)+"%");
    mage.turn -=1;
    highlightRED(mage);
    checkIfBattleOver();
    turn++;
    giver = "";
    action = "";
    checkForDead(); //affects number of turns before AI acts
    enemyActions();
  }

  $("#Deathcoil").click(function(){
    if(giver !="" && (giver == "DeathKnight")){
      $('.highlighted').removeClass('highlighted');
      $(this).addClass('highlighted');
      action = $(this).attr('id');
    }
  });

  function Deathcoil(race,target){
    if(race == "undead"){
     target.health = target.health + spells["Deathcoil"][0];
     target.health_percentage = 100*target.health / target.original_health;
     var log = $('#combat_log').html();
       $('#combat_log').html(log+"<br><br>"+"DeathKnight healed "+target.klass+ "for"+String(damage) + " damage! ");
    }
   if(race == "human"){
     target.health = target.health - spells["Deathcoil"][2];
     target.health_percentage = 100*target.health / target.original_health;
     $('#combat_log').html(log+"<br><br>"+" DeathKnight dealt " + String(damage) + " damage to " + target.klass + "! ");
    }
    playSound(spellSounds["Deathcoil"]);
   $("#"+target.klass+"Health").width(String(target.health_percentage)+"%");
    arthus.turn -=1;
    highlightRED(arthus);
    checkIfBattleOver();
    turn++;
    giver = "";
    action = "";
    checkForDead(); //affects number of turns before AI acts
    enemyActions();
  }

  $("#RaiseDead").click(function(){
    if(giver !="" && (giver == "Necromancer")){
      $('.highlighted').removeClass('highlighted');
      $(this).addClass('highlighted');
      action = $(this).attr('id');
      return spells.RaiseDead();
    }
  });

  //attack
 $((race1tag + "attack")).click(function(){
      if( giver != "" && ("."+giver+"attack") == (race1tag + "attack") ){
        $('.highlighted').removeClass('highlighted');
        $(this).addClass('highlighted');
        action = $(this).attr('id');
      }
  });
  $((race2tag + "attack")).click(function(){
      if( giver != "" && ("."+giver+"attack") == (race2tag + "attack") ){
        $('.highlighted').removeClass('highlighted');
        $(this).addClass('highlighted');
        action = $(this).attr('id');
      }
  });
  $((race3tag + "attack")).click(function(){
      if( giver != "" && ("."+giver+"attack") == (race3tag + "attack") ){
        $('.highlighted').removeClass('highlighted');
        $(this).addClass('highlighted');
        action = $(this).attr('id');
      }
  });

 //implement turn control
  function highlightRED(teamMember){
      if(teamMember.turn == 0){
        $("."+teamMember.klass).addClass('highlightedRED');
      }
  }
  //check if one of your characters is dead, and update turn counter

  function checkForDead(){
    maxTurn = 0;
    for(person in team){
      if(team[person].health > 0){
         maxTurn +=1;
      }
    }
  }
  //check if battle over
  function checkIfBattleOver(){
    if((race[0].health + race[1].health + race[2].health) <=0){
        game = 0;
        alert("Your whole team died, you lost.");
    }
    if((otherteam[0].health + otherteam[1].health + otherteam[2].health) <= 0){
        game = 0;
        alert("You have defeated the enemy team!");
    }
  }
 //AI actions - attack
 function AIattack(enemycharacter){
       var index1 = Math.floor(Math.random()*team.length);
       var target = team[index1];

       var index2 = Math.floor(Math.random()*enemycharacter.damage.length);
       var damage = enemycharacter.damage[index2];
       damage = damageCalculator(damage,target.armor,target.armor_type);
       target.health = target.health - damage;
       target.health_percentage = 100*target.health / target.original_health;
          //code for slice animation
       $("#"+target.klass+"Health").width(String(target.health_percentage)+"%");
       var log = $('#combat_log').html();
       $('#combat_log').html(log+"<br><br>"+" "+enemycharacter.klass + " dealt " + String(damage) + " damage to " + target.klass + "! ");
    }
 //AI actions - team actions
  function enemyActions(){
    if(turn >= maxTurn){
      for(person in otherteam){
        if(otherteam[person].health > 0){
          AIattack(otherteam[person]);
        }
      }
      turn = 0;
      $('.highlightedRED').removeClass('highlightedRED');
      for(person in team){
        team[person].turn = 1;
      }
    }
  }

 //calculate damage on target
     function damageCalculator(damage,armor,armorType){
      var reductionByType = {cloth: 0.01, leather: 0.012, mail: 0.014, plate: 0.016};
      var c = reductionByType[armorType]
      damage = damage*(1-( (armor*c)/(1+(armor*c)) ) );
      return Math.ceil(damage);
    }
 //attack sound effect
 attackSounds={
    DeathKnight: "./gameSounds/MetalHeavySliceMetal3.wav",
    Archer:      "./gameSounds/ArrowAttack1.wav",
    Necromancer: "./gameSounds/NecromancerMissileLaunch2.wav",
    Ghoul:       "./gameSounds/MetalLightChopFlesh2.wav",
    Sorcerer:    "./gameSounds/SorceressMissileHit1.wav",
    Palatine:    "./gameSounds/MetalHeavyBashFlesh2.wav"
  };
  //response sound effects
  responseSounds ={
    DeathKnight: "./gameSounds/HeroFirelordWhat2.wav",
    Archer:      "./gameSounds/ArcherWhat1.wav",
    Necromancer: "./gameSounds/NecromancerWhat3.wav",
    Ghoul:       "./gameSounds/GhoulReady1.wav",
    Sorcerer:    "./gameSounds/SorceressReady1.wav",
    Palatine:    "./gameSounds/UtherWhat1.wav"
  }
  //spell sound effects
  spellSounds = {
    "Deathcoil": "./gameSounds/DeathCoilSpecialArt1.wav",
    "Holylight": "./gameSounds/HolyBolt.wav",
    "Fireball" : "./gameSounds/FireBallMissileDeath.wav",
    "RaiseDead": "./gameSounds/RaiseSkeleton.wav"
  }

 function playSound(file){
   var snd = new Audio(file);
   return snd.play();
 }

 //implement attack
  function get_DamageRecieverInfo(target){
    if(action == "attack" && giver != ""){
      for(person in otherteam){
        if(target == (otherteam[person].klass)){
          damage_reciever = otherteam[person];
          health_id = "#" + damage_reciever.klass + "Health";
        }
      }

      for(person in team){
        if(team[person].klass == giver){
          var index = Math.floor(Math.random()*team[person].damage.length);
          var damage = team[person].damage[index];
          damage = damageCalculator(damage,damage_reciever.armor,damage_reciever.armor_type);
          damage_reciever.health = damage_reciever.health - damage;
          damage_reciever.health_percentage = 100*damage_reciever.health / damage_reciever.original_health;
              //code for slice animation
          playSound(attackSounds[team[person].klass]);
          $(health_id).width(String(damage_reciever.health_percentage)+"%");
          $('#combat_log').html("<br>"+giver+" dealt "+String(damage)+" damage to "+damage_reciever.klass+"! ");
          team[person].turn -=1;
          highlightRED(team[person]);
          checkIfBattleOver();
          turn++;
          giver = "";
          action = "";
          checkForDead(); //affects number of turns before AI acts
          enemyActions();
        }
      }

    }
  }

    $("."+otherteam[0].klass).click(function(){         //damage_reciever and health_id set
        target = $(this).attr('class');
        if(action == "attack") get_DamageRecieverInfo(target);
        if(action == "Holylight") Holylight(otherteam[0].race,otherteam[0]);
        if(action == "Deathcoil") Death(otherteam[0].race,otherteam[0]);
        if(action == "Fireball")  Fireball(otherteam[0]);
    });
     $("."+otherteam[1].klass).click(function(){      //damage_reciever and health_id set
        target = $(this).attr('class');
        if(action == "attack") get_DamageRecieverInfo(target);
        if(action == "Holylight") Holylight(otherteam[1].race,otherteam[1]);
        if(action == "Deathcoil") Death(otherteam[1].race,otherteam[1]);
        if(action == "Fireball")  Fireball(otherteam[1]);
    });
     $("."+otherteam[2].klass).click(function(){       //damage_reciever and health_id set
        target = $(this).attr('class');
        if(action == "attack") get_DamageRecieverInfo(target);
        if(action == "Holylight") Holylight(otherteam[2].race,otherteam[2]);
        if(action == "Deathcoil") Death(otherteam[2].race,otherteam[2]);
        if(action == "Fireball")  Fireball(otherteam[2]);
    });

    //each team gets 3 turns (one for each character)
   //once target person has recieved damage its the next character's turn

 turn_counter++;

});
