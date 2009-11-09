(function($) {
  $.fn.initializeAppDb = function(){
    return this.each(function(){
      $(this).data("AppSettings", new $.AppSettings(this));
    });
  };

  $.AppSettings = function(passed) {
    var element = $(passed);
    var db = null;
    var stmt = null;
    
    //read the settings from db
    function onDatabaseOpen(e) {
      Settings.__load(db);

      //set feed
      $("input#rss_feed").val(Settings.feed);

      //show the window
      window.nativeWindow.visible = true;
    }

    //read the feed before the window is closed and save it to db
    function onWindowClose() {
        Settings.feed = $("input#rss_feed").val();
        //save the settings
        Settings.__save();
    }
    
    //add handler to save the settings
    window.nativeWindow.addEventListener("closing", onWindowClose);

    //open connection to settings.db database
    db = new air.SQLConnection();
    db.addEventListener( air.SQLEvent.OPEN, onDatabaseOpen );
    db.open( air.File.applicationDirectory.resolvePath("settings.db"), air.SQLMode.CREATE );        

  };
})(jQuery);
