/*
 * Facebox (for jQuery)
 * version: 1.2 (05/05/2008)
 * @requires jQuery v1.2 or later
 *
 * Examples at http://famspam.comhttp://www.iplaysoft.com/wp-content/themes/ips/js/facebox/
 *
 * Licensed under the MIT:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright 2007, 2008 Chris Wanstrath [ chris@ozmm.org ]
 *
 * Usage:
 *  
 *  jQuery(document).ready(function() {
 *    jQuery('a[rel*=facebox]').facebox() 
 *  })
 *
 *  <a href="#terms" rel="facebox">Terms</a>
 *    Loads the #terms div in the box
 *
 *  <a href="terms.html" rel="facebox">Terms</a>
 *    Loads the terms.html page in the box
 *
 *  <a href="terms.png" rel="facebox">Terms</a>
 *    Loads the terms.png image in the box
 *
 *
 *  You can also use it programmatically:
 * 
 *    jQuery.facebox('some html')
 *
 *  The above will open a facebox with "some html" as the content.
 *    
 *    jQuery.facebox(function(jq) { 
 *      jq.get('blah.html', function(data) { jq.facebox(data) })
 *    })
 *
 *  The above will show a loading screen before the passed function is called,
 *  allowing for a better ajaxy experience.
 *
 *  The facebox function can also display an ajax page or image:
 *  
 *    jQuery.facebox({ ajax: 'remote.html' })
 *    jQuery.facebox({ image: 'dude.jpg' })
 *
 *  Want to close the facebox?  Trigger the 'close.facebox' document event:
 *
 *    jQuery(document).trigger('close.facebox')
 *
 *  Facebox also has a bunch of other hooks:
 *
 *    loading.facebox
 *    beforeReveal.facebox
 *    reveal.facebox (aliased as 'afterReveal.facebox')
 *    init.facebox
 *
 *  Simply bind a function to any of these hooks:
 *
 *   jq(document).bind('reveal.facebox', function() { ...stuff to do after the facebox and contents are revealed... })
 *
 */
(function(jq) {
  jq.facebox = function(data, klass) {
    jq.facebox.loading()

    if (data.ajax) fillFaceboxFromAjax(data.ajax)
    else if (data.image) fillFaceboxFromImage(data.image)
    else if (data.div) fillFaceboxFromHref(data.div)
    else if (jq.isFunction(data)) data.call(jq)
    else jq.facebox.reveal(data, klass)
  }

  /*
   * Public, jq.facebox methods
   */

  jq.extend(jq.facebox, {
    settings: {
      opacity      : 0,
      overlay      : true,
      loadingImage : 'http://www.iplaysoft.com/wp-content/themes/ips/js/facebox/loading.gif',
      closeImage   : 'http://www.iplaysoft.com/wp-content/themes/ips/js/facebox/closelabel.gif',
      imageTypes   : [ 'png', 'jpg', 'jpeg', 'gif' ],
      faceboxHtml  : '\
    <div id="facebox" style="display:none;"> \
      <div class="popup"> \
        <table> \
          <tbody> \
            <tr> \
              <td class="tl"/><td class="b"/><td class="tr"/> \
            </tr> \
            <tr> \
              <td class="b"/> \
              <td class="body"> \
                <div class="content"> \
                </div> \
                <div class="footer"> \
                  <a href="#" class="close"> \
                    <img src="http://www.iplaysoft.com/wp-content/themes/ips/js/facebox/closelabel.gif" title="close" class="close_image" /> \
                  </a> \
                </div> \
              </td> \
              <td class="b"/> \
            </tr> \
            <tr> \
              <td class="bl"/><td class="b"/><td class="br"/> \
            </tr> \
          </tbody> \
        </table> \
      </div> \
    </div>'
    },

    loading: function() {
      init()
      if (jq('#facebox .loading').length == 1) return true
      showOverlay()

      jq('#facebox .content').empty()
      jq('#facebox .body').children().hide().end().
        append('<div class="loading"><img src="'+jq.facebox.settings.loadingImage+'"/></div>')

      jq('#facebox').css({
        top:	getPageScroll()[1] + (getPageHeight() / 10),
        left:	385.5
      }).show()

      jq(document).bind('keydown.facebox', function(e) {
        if (e.keyCode == 27) jq.facebox.close()
        return true
      })
      jq(document).trigger('loading.facebox')
    },

    reveal: function(data, klass) {
      jq(document).trigger('beforeReveal.facebox')
      if (klass) jq('#facebox .content').addClass(klass)
      jq('#facebox .content').append(data)
      jq('#facebox .loading').remove()
      jq('#facebox .body').children().fadeIn('normal')
      jq('#facebox').css('left', jq(window).width() / 2 - (jq('#facebox table').width() / 2))
      jq(document).trigger('reveal.facebox').trigger('afterReveal.facebox')
    },

    close: function() {
      jq(document).trigger('close.facebox')
      return false
    }
  })

  /*
   * Public, jq.fn methods
   */

  jq.fn.facebox = function(settings) {
    init(settings)

    function clickHandler() {
      jq.facebox.loading(true)

      // support for rel="facebox.inline_popup" syntax, to add a class
      // also supports deprecated "facebox[.inline_popup]" syntax
      var klass = this.rel.match(/facebox\[?\.(\w+)\]?/)
      if (klass) klass = klass[1]

      fillFaceboxFromHref(this.href, klass)
      return false
    }

    return this.click(clickHandler)
  }

  /*
   * Private methods
   */

  // called one time to setup facebox on this page
  function init(settings) {
    if (jq.facebox.settings.inited) return true
    else jq.facebox.settings.inited = true

    jq(document).trigger('init.facebox')
    makeCompatible()

    var imageTypes = jq.facebox.settings.imageTypes.join('|')
    jq.facebox.settings.imageTypesRegexp = new RegExp('\.' + imageTypes + 'jq', 'i')

    if (settings) jq.extend(jq.facebox.settings, settings)
    jq('body').append(jq.facebox.settings.faceboxHtml)

    var preload = [ new Image(), new Image() ]
    preload[0].src = jq.facebox.settings.closeImage
    preload[1].src = jq.facebox.settings.loadingImage

    jq('#facebox').find('.b:first, .bl, .br, .tl, .tr').each(function() {
      preload.push(new Image())
      preload.slice(-1).src = jq(this).css('background-image').replace(/url\((.+)\)/, 'jq1')
    })

    jq('#facebox .close').click(jq.facebox.close)
    jq('#facebox .close_image').attr('src', jq.facebox.settings.closeImage)
  }
  
  // getPageScroll() by quirksmode.com
  function getPageScroll() {
    var xScroll, yScroll;
    if (self.pageYOffset) {
      yScroll = self.pageYOffset;
      xScroll = self.pageXOffset;
    } else if (document.documentElement && document.documentElement.scrollTop) {	 // Explorer 6 Strict
      yScroll = document.documentElement.scrollTop;
      xScroll = document.documentElement.scrollLeft;
    } else if (document.body) {// all other Explorers
      yScroll = document.body.scrollTop;
      xScroll = document.body.scrollLeft;	
    }
    return new Array(xScroll,yScroll) 
  }

  // Adapted from getPageSize() by quirksmode.com
  function getPageHeight() {
    var windowHeight
    if (self.innerHeight) {	// all except Explorer
      windowHeight = self.innerHeight;
    } else if (document.documentElement && document.documentElement.clientHeight) { // Explorer 6 Strict Mode
      windowHeight = document.documentElement.clientHeight;
    } else if (document.body) { // other Explorers
      windowHeight = document.body.clientHeight;
    }	
    return windowHeight
  }

  // Backwards compatibility
  function makeCompatible() {
    var jqs = jq.facebox.settings

    jqs.loadingImage = jqs.loading_image || jqs.loadingImage
    jqs.closeImage = jqs.close_image || jqs.closeImage
    jqs.imageTypes = jqs.image_types || jqs.imageTypes
    jqs.faceboxHtml = jqs.facebox_html || jqs.faceboxHtml
  }

  // Figures out what you want to display and displays it
  // formats are:
  //     div: #id
  //   image: blah.extension
  //    ajax: anything else
  function fillFaceboxFromHref(href, klass) {
    // div
    if (href.match(/#/)) {
      var url    = window.location.href.split('#')[0]
      var target = href.replace(url,'')
      jq.facebox.reveal(jq(target).clone().show(), klass)

    // image
    } else if (href.match(jq.facebox.settings.imageTypesRegexp)) {
      fillFaceboxFromImage(href, klass)
    // ajax
    } else {
      fillFaceboxFromAjax(href, klass)
    }
  }

  function fillFaceboxFromImage(href, klass) {
    var image = new Image()
    image.onload = function() {
      jq.facebox.reveal('<div class="image"><img src="' + image.src + '" /></div>', klass)
    }
    image.src = href
  }

  function fillFaceboxFromAjax(href, klass) {
    jq.get(href, function(data) { jq.facebox.reveal(data, klass) })
  }

  function skipOverlay() {
    return jq.facebox.settings.overlay == false || jq.facebox.settings.opacity === null 
  }

  function showOverlay() {
    if (skipOverlay()) return

    if (jq('facebox_overlay').length == 0) 
      jq("body").append('<div id="facebox_overlay" class="facebox_hide"></div>')

    jq('#facebox_overlay').hide().addClass("facebox_overlayBG")
      .css('opacity', jq.facebox.settings.opacity)
      .click(function() { jq(document).trigger('close.facebox') })
      .fadeIn(200)
    return false
  }

  function hideOverlay() {
    if (skipOverlay()) return

    jq('#facebox_overlay').fadeOut(200, function(){
      jq("#facebox_overlay").removeClass("facebox_overlayBG")
      jq("#facebox_overlay").addClass("facebox_hide") 
      jq("#facebox_overlay").remove()
    })
    
    return false
  }

  /*
   * Bindings
   */

  jq(document).bind('close.facebox', function() {
    jq(document).unbind('keydown.facebox')
    jq('#facebox').fadeOut(function() {
      jq('#facebox .content').removeClass().addClass('content')
      hideOverlay()
      jq('#facebox .loading').remove()
    })
  })

})(jQuery);
