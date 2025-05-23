class Loop {
    constructor(){
        
        setInterval(() => this.go(), game.config.auto_toggle_interval);
    }
    go(){
        if (game.auto_spinning && !game.paused){
            game.spin();
            ui.refresh();
        }
    }

}