(function(jQuery) {
  jQuery.fn.externalLinks = function() {
    $(this).find('a.external').click(function(e){
      e.preventDefault();
      var link = $(this);
      var urlReq = new air.URLRequest(link.attr('href'));
      air.navigateToURL(urlReq, "pandoratorrent");
    });
    return $(this);
  };
})(jQuery);
