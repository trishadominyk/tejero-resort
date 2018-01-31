/*!
 * SlideDeck Preview Updater
 * 
 * @author Hummingbird Web Solutions Pvt. Ltd.
 * @package SlideDeck
 * @since 2.0.0
 */
/*!
Copyright 2012 HBWSL  (email : support@hbwsl.com)

This file is part of SlideDeck.

SlideDeck is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

SlideDeck is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with SlideDeck.  If not, see <http://www.gnu.org/licenses/>.
*/
var SlideDeckPreview,SlideDeckPrefix="sd2-";!function(e){window.SlideDeckPreview={elems:{},updates:{},ajaxOptions:["options[size]","options[date-format]","options[randomize]","options[total_slides]","options[verticalTitleLength]","options[start]","options[slideTransition]","options[width]","options[height]","options[show-front-cover]","options[show-back-cover]","options[excerptLengthWithImages]","options[excerptLengthWithoutImages]","options[titleLengthWithImages]","options[titleLengthWithoutImages]","options[linkAuthorName]","options[linkTitle]","options[linkTarget]","options[navigation]"],importedFonts:[],outerWidth:0,outerHeight:0,timerDelay:250,validations:{},invalidKeyCodes:[9,13,16,17,18,19,20,27,33,34,35,36,37,38,39,40,45,91,92,93,112,113,114,115,116,117,118,119,120,121,122,123,144,145],ajaxUpdate:function(){var i=this;"custom"==this.elems.form.find('input[name="options[size]"]:checked').val()&&this.elems.form.find(".sd-height").val(this.elems.form.find("#customHeight").val());var s=this.elems.form.serialize();s=s.replace(/action\=([a-zA-Z0-9\-_]+)/gi,"action=slidedeck_preview_iframe_update"),this.elems.slideDimensions.addClass("getting-dimensions"),this.elems.iframeBody.find("#mask").addClass("visible"),e.ajax({url:ajaxurl+"?action=slidedeck_preview_iframe_update",type:"GET",dataType:"json",data:s,cache:!1,success:function(s){var t=!1,d=e("#slidedeck-section-preview .inner");(i.outerWidth!=s.outer_width||i.outerHeight!=s.outer_height)&&(i.outerWidth=s.outer_width,i.outerHeight=s.outer_height,t=!0),"parfocal"!=e("#slidedeck-section-lenses input[type='radio']:checked").val()?e("#slidedeck-slide-dimensions").show():e("#slidedeck-slide-dimensions").hide(),t?(i.elems.slideDimensions.addClass("slidedeck-resizing"),d.height()>0&&d.height(""),i.elems.iframe.animate({width:parseInt(s.outer_width,10),height:parseInt(s.outer_height,10)},500,function(){i.elems.iframe[0].src=s.url,i.elems.slideDimensions.css("margin-left",0-parseInt(s.outer_width,10)/2).removeClass("slidedeck-resizing")})):i.elems.iframe[0].src=s.url}})},eventOnLoad:function(){this.elems.iframeContents=this.elems.iframe.contents(),this.elems.iframeBody=this.elems.iframeContents.find("body"),this.elems.slidedeck=this.elems.iframeBody.find(".slidedeck"),this.elems.layerpro=this.elems.iframeBody.find(".slidedeck-layerpro"),this.elems.tiled=this.elems.iframeBody.find(".slidedeck-tiled"),this.elems.transitionpro=this.elems.iframeBody.find(".slidedeck-transitionpro"),this.elems.slidedeckFrame=this.elems.slidedeck.closest(".slidedeck-frame"),this.elems.slidedeckLayerproFrame=this.elems.layerpro.closest(".slidedeck-layerpro"),this.elems.slidedeckTiledFrame=this.elems.tiled.closest(".slidedeck-tiled"),this.elems.slidedeckTransitionProFrame=this.elems.transitionpro.closest(".slidedeck-transitionpro"),this.elems.noContent=this.elems.iframeBody.find(".no-content-found"),this.slidedeck=this.elems.slidedeck.slidedeck();var i=0;i=this.elems.slidedeckFrame.hasClass("lens-fashion")||this.elems.slidedeckFrame.hasClass("lens-prime")||this.elems.slidedeckFrame.hasClass("lens-parfocal")?this.elems.slidedeck.find("li").length:this.elems.slidedeckTiledFrame.hasClass("slidedeck-tiled")?this.elems.tiled.find("li").length:this.elems.slidedeckTransitionProFrame.hasClass("slidedeck-transitionpro")?this.elems.transitionpro.find("li").length:this.elems.slidedeckLayerproFrame.hasClass("slidedeck-layerpro")?this.elems.layerpro.find("li").length:this.elems.slidedeck.find("dd.slide").length,1>i?parent.document.getElementById("slidedeck-scheduler-warning").style.display="block":parent.document.getElementById("slidedeck-scheduler-warning").style.display="none",this.elems.noContent.length&&(this.elems.iframeBody.find("#mask").removeClass("visible"),this.elems.noContent.find(".no-content-source-configuration").bind("click",function(i){i.preventDefault(),e(".slidedeck-content-source").removeClass("hidden")})),this.elems.slidedeckFrame.find(".slidedeck-overlays .slidedeck-overlays-wrapper a").bind("click",function(e){return e.preventDefault(),!1}).attr("title","Overlay links disabled for preview"),this.updateSlideDimensions()},getSlideDimensions:function(){if(this.elems.slidedeck.find("li").length>0)var e=this.elems.slidedeck.parent(".slidedeck-frame").eq(0);else var e=this.elems.slidedeck.find("dd.slide").eq(0);this.isVertical()&&(e=e.find(".slidesVertical dd").eq(0));var i={width:e.width(),height:e.height()};return i},isVertical:function(){if("undefined"!=typeof this.slidedeck){if("undefined"==typeof this.slidedeck.deck)return this.elems.slidedeck.find(".slidesVertical").length>0?!0:!1;if(this.slidedeck.verticalSlides&&this.slidedeck.verticalSlides[this.slidedeck.current-1])return this.slidedeck.verticalSlides[this.slidedeck.current-1].navChildren?!0:!1}return!1},realtime:function(i,s){var t=e.data(i,"$elem");t||(t=e(i),e.data(i,"$elem",t));var d=t.attr("name");"function"==typeof this.updates[d]&&this.updates[d](t,s),this.updateSlideDimensions()},update:function(e,i){var s=!0;if("text"==e.type){var t=jQuery.data(e,"previousValue");if(t==i)return!1;jQuery.data(e,"previousValue",i)}for(var d=0;d<this.ajaxOptions.length;d++)this.ajaxOptions[d]==e.name&&(s=!1);for(var l in this.updates)l==e.name&&(s=!0);if(this.validate(e,i)){var n=this;s?this.realtime(e,i):n.ajaxUpdate()}},updateSlideDimensions:function(){var e=this.getSlideDimensions();this.elems.slideDimensions.find(".width").text(e.width+"x"),this.elems.slideDimensions.find(".height").text(e.height),this.elems.slideDimensions.removeClass("getting-dimensions")},validate:function(e,i){var s=!0;return"function"==typeof this.validations[e.name]&&(s=this.validations[e.name](e,i)),s},initialize:function(){var i=this;return this.elems.form=e("#slidedeck-update-form"),this.elems.form.length<1?!1:(this.elems.form.delegate("select","change",function(e){var s=this.getElementsByTagName("option"),t="";for(var d in s)s[d].selected&&(t=s[d].value);i.update(this,t)}).delegate('input[type="text"]',"blur change",function(e){i.update(this,this.value)}).delegate('input[type="text"]',"keyup",function(e){for(var s in i.invalidKeyCodes)if(i.invalidKeyCodes[s]==e.keyCode)return!1;var t=this;return this.timer&&clearTimeout(t.timer),this.timer=setTimeout(function(){i.update(t,t.value)},i.timerDelay),!0}).delegate('input[type="text"]',"keydown",function(e){return 13==e.keyCode?(e.preventDefault(),i.update(this,this.value),!1):void 0}).delegate('input[type="radio"], input[type="checkbox"]',"click",function(e){var s=this.value;"checkbox"==this.type&&(s=this.checked),i.update(this,s)}),this.elems.form.delegate(".slidedeck-ajax-update","click",function(s){s.preventDefault(),e(".slidedeck-content-source").addClass("hidden"),i.ajaxUpdate()}),this.elems.form.find('input[type="text"]').each(function(){e.data(this,"previousValue",e(this).val())}),this.elems.iframe=e("#slidedeck-preview"),this.elems.iframe.bind("load",function(){i.eventOnLoad()}),this.elems.slideDimensions=e("#slidedeck-slide-dimensions"),void("parfocal"!=e("#slidedeck-section-lenses input[type='radio']:checked").val()?(e("#slidedeck-slide-dimensions").show(),this.outerWidth=this.elems.iframe.width(),this.outerHeight=this.elems.iframe.height(),this.size=this.elems.form.find('input[name="options[size]"]:checked').val(),this.elems.slideDimensions.css("margin-left",0-this.outerWidth/2).removeClass("slidedeck-resizing")):e("#slidedeck-slide-dimensions").hide()))}},SlideDeckPreview.updates["options[show-link-slide]"]=function(e,i){i=1==i?!0:!1,i?SlideDeckPreview.elems.slidedeckFrame.addClass(SlideDeckPrefix+"show-link-slide"):SlideDeckPreview.elems.slidedeckFrame.removeClass(SlideDeckPrefix+"show-link-slide")},SlideDeckPreview.updates["options[titleFont]"]=SlideDeckPreview.updates["options[bodyFont]"]=function(e,i){var s=SlideDeckFonts[i];if(s["import"]){for(var t=!0,d=0;d<SlideDeckPreview.importedFonts.length;d++)SlideDeckPreview.importedFonts[d]==s["import"]&&(t=!1);t&&SlideDeckPreview.elems.iframeBody.append('<style type="text/css">@import url('+s["import"]+");</style>")}if("options[titleFont]"==e[0].name){var l=SlideDeckPreview.elems.slidedeck.find(".slide-title, .sd2-slide-title").add(SlideDeckPreview.elems.slidedeckFrame.find(".sd2-custom-title-font"));l.css("font-family",s.stack),s.weight&&l.css("font-weight",s.weight)}else"options[bodyFont]"==e[0].name&&SlideDeckPreview.elems.slidedeck.css("font-family",s.stack)},SlideDeckPreview.updates["options[accentColor]"]=function(e,i){var s=SlideDeckPreview.elems.iframeContents.find("#slidedeck-footer-styles"),t=s.text().replace(/\.accent-color(-background)?\{(background-)?color:([\#0-9a-fA-F]+);?\}/gi,".accent-color$1{$2color:"+i+"}");s.text(t);var d=SlideDeckPreview.elems.slidedeckFrame.find(".icon-shape");if(d.length)for(var l=0;l<d.length;l++)SlideDeckPreview.elems.iframe[0].contentWindow.jQuery.data(d[l],"slidedeck-accent-shape").attr("fill",i);slidedeck_ie<9&&(SlideDeckPreview.elems.slidedeckFrame.find(".accent-color").css("color",i),SlideDeckPreview.elems.slidedeckFrame.find(".accent-color-background").css("background-color",i))},SlideDeckPreview.updates["options[lensVariations]"]=function(e,i){var s=e.find("option");s.each(function(e){i==this.value?SlideDeckPreview.elems.slidedeckFrame.addClass(SlideDeckPrefix+this.value):SlideDeckPreview.elems.slidedeckFrame.removeClass(SlideDeckPrefix+this.value)})},SlideDeckPreview.updates["options[overlays]"]=function(e,i){var s=e.find("option");s.each(function(e){i==this.value?SlideDeckPreview.elems.slidedeckFrame.addClass("show-overlay-"+this.value):SlideDeckPreview.elems.slidedeckFrame.removeClass("show-overlay-"+this.value)})},SlideDeckPreview.updates["options[overlays_open]"]=function(e,i){i=1==i?!0:!1,i?(SlideDeckPreview.elems.slidedeckFrame.addClass(SlideDeckPrefix+"overlays-open"),SlideDeckPreview.elems.iframe[0].contentWindow.jQuery.data(SlideDeckPreview.elems.slidedeck[0],"SlideDeckOverlay").open()):(SlideDeckPreview.elems.slidedeckFrame.removeClass(SlideDeckPrefix+"overlays-open"),SlideDeckPreview.elems.iframe[0].contentWindow.jQuery.data(SlideDeckPreview.elems.slidedeck[0],"SlideDeckOverlay").close())},SlideDeckPreview.updates["options[hyphenate]"]=function(e,i){i=1==i?!0:!1,i?SlideDeckPreview.elems.slidedeckFrame.addClass(SlideDeckPrefix+"hyphenate"):SlideDeckPreview.elems.slidedeckFrame.removeClass(SlideDeckPrefix+"hyphenate")},SlideDeckPreview.updates["options[continueScrolling]"]=function(e,i){SlideDeckPreview.slidedeck.setOption("continueScrolling",i)},SlideDeckPreview.updates["options[cycle]"]=function(e,i){i=1==i?!0:!1,SlideDeckPreview.slidedeck.setOption("cycle",i),SlideDeckFadingNav.prototype.checkHorizontal(SlideDeckPreview.slidedeck),SlideDeckFadingNav.prototype.checkVertical(SlideDeckPreview.slidedeck)},SlideDeckPreview.updates["options[keys]"]=function(e,i){i=1==i?!0:!1,SlideDeckPreview.slidedeck.setOption("keys",i)},SlideDeckPreview.updates["options[scroll]"]=function(e,i){i=1==i?!0:!1,SlideDeckPreview.slidedeck.setOption("scroll",i),SlideDeckPreview.slidedeck.deck.find(".slidesVertical").length&&(SlideDeckPreview.slidedeck.vertical().options.scroll=i)},SlideDeckPreview.updates["options[touch]"]=function(e,i){i=1==i?!0:!1,SlideDeckPreview.slidedeck.setOption("touch",i)},SlideDeckPreview.updates["options[touchThreshold]"]=function(e,i){SlideDeckPreview.slidedeck.options.touchThreshold.x=i,SlideDeckPreview.slidedeck.options.touchThreshold.y=i},SlideDeckPreview.updates["options[autoPlay]"]=function(e,i){i=1==i?!0:!1,SlideDeckPreview.slidedeck.pauseAutoPlay=!i,SlideDeckPreview.slidedeck.setOption("autoPlay",i)},SlideDeckPreview.updates["options[autoPlayInterval]"]=function(e,i){SlideDeckPreview.slidedeck.options.autoPlayInterval=1e3*parseInt(i,10)},SlideDeckPreview.updates["options[speed]"]=function(e,i){SlideDeckPreview.slidedeck.setOption("speed",i),SlideDeckPreview.slidedeck.deck.find(".slidesVertical").length&&(SlideDeckPreview.slidedeck.vertical().options.speed=i)},SlideDeckPreview.updates["options[transition]"]=function(e,i){SlideDeckPreview.slidedeck.setOption("transition",i)},SlideDeckPreview.updates["options[display-nav-arrows]"]=function(e,i){e.find("option").each(function(){this.value!=i?SlideDeckPreview.elems.slidedeckFrame.removeClass("display-nav-"+this.value):SlideDeckPreview.elems.slidedeckFrame.addClass("display-nav-"+this.value)})},SlideDeckPreview.validations["options[size]"]=function(i,s){return"fullwidth"==s?e("span#slidedeck-fullwidth-dimensions").show():e("span#slidedeck-fullwidth-dimensions").hide(),SlideDeckPreview.size==s?!1:(SlideDeckPreview.size=s,!0)},SlideDeckPreview.updates["options[show-excerpt]"]=function(e,i){i=1==i?!0:!1,i?SlideDeckPreview.elems.slidedeckFrame.addClass(SlideDeckPrefix+"show-excerpt"):SlideDeckPreview.elems.slidedeckFrame.removeClass(SlideDeckPrefix+"show-excerpt")},SlideDeckPreview.updates["options[hyphenate]"]=function(e,i){i=1==i?!0:!1,i?SlideDeckPreview.elems.slidedeckFrame.addClass(SlideDeckPrefix+"hyphenate"):SlideDeckPreview.elems.slidedeckFrame.removeClass(SlideDeckPrefix+"hyphenate")},SlideDeckPreview.updates["options[show-title]"]=function(e,i){i=1==i?!0:!1,i?SlideDeckPreview.elems.slidedeckFrame.addClass(SlideDeckPrefix+"show-title"):SlideDeckPreview.elems.slidedeckFrame.removeClass(SlideDeckPrefix+"show-title")},SlideDeckPreview.updates["options[show-readmore]"]=function(e,i){i=1==i?!0:!1,i?SlideDeckPreview.elems.slidedeckFrame.addClass(SlideDeckPrefix+"show-readmore"):SlideDeckPreview.elems.slidedeckFrame.removeClass(SlideDeckPrefix+"show-readmore")},SlideDeckPreview.updates["options[show-author]"]=function(e,i){i=1==i?!0:!1,i?SlideDeckPreview.elems.slidedeckFrame.addClass(SlideDeckPrefix+"show-author"):SlideDeckPreview.elems.slidedeckFrame.removeClass(SlideDeckPrefix+"show-author")},SlideDeckPreview.updates["options[show-author-avatar]"]=function(e,i){i=1==i?!0:!1,i?SlideDeckPreview.elems.slidedeckFrame.addClass(SlideDeckPrefix+"show-author-avatar"):SlideDeckPreview.elems.slidedeckFrame.removeClass(SlideDeckPrefix+"show-author-avatar")},SlideDeckPreview.updates["options[image_scaling]"]=function(e,i){e.find("option").each(function(){this.value==i?SlideDeckPreview.elems.slidedeck.find("dd").addClass(SlideDeckPrefix+"image-scaling-"+this.value):SlideDeckPreview.elems.slidedeck.find("dd").removeClass(SlideDeckPrefix+"image-scaling-"+this.value)})},e(document).ready(function(){SlideDeckPreview.initialize()})}(jQuery);