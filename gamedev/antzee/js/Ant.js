class Ant{
    static default_attack = 2;
    static default_max_health = 3;
    static default_growing = 0;
    static default_max_carrying = 30;    
    static defaul_metabolism = 1;
    static default_moves_til_death = 50;
    static default_see_range = 1;
    alive = true;
    attack = null;
    health = null;
    max_health = null;
    id = null
    base = null    
    player = null
    carrying = 0
    clear_history = true;    
    exploring = true
    growing = null;
    max_carrying = null;
    memory = null
    moves = 0
    moves_til_death = null;    
    see_range = 0
    x = null
    y = null

    going = new AntGoing();

    constructor (id, x, y, player){
        this.id = id
        this.x = x;
        this.y = y;
        this.base = { x : x, y: y };        
        this.player = player
        this.attack = Ant.default_attack;
        this.growing = Ant.default_growing;
        this.health = Ant.default_max_health;
        this.max_health = Ant.default_max_health;
        this.max_carrying = Ant.default_max_carrying;
        this.moves_til_death = Ant.default_moves_til_death;
        this.see_range = Ant.default_see_range;


    }
    add_memory(x, y, what, quantity){
        this.memory = {x: x, y: y, what: what, quantity: quantity }
    }
        
    stock_inventory(){
        if (this.player){
            game.food_inventory += this.carrying;  // pop up msg when this happens        
            game.food_inventory -= this.moves
        } else {
            game.op_food += this.carrying 
            game.op_food -= this.moves
        }
        this.carrying = 0;        
    }


    
}